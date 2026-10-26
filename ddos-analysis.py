"""Offline CICIDS2017 Friday study. Run: python ddos-analysis.py
Downloads only a public dataset; does not generate network attack traffic.
"""
from pathlib import Path
import hashlib, json, platform, urllib.request
import numpy as np
import pandas as pd
import sklearn
from sklearn.model_selection import StratifiedGroupKFold
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import precision_score, recall_score, f1_score, confusion_matrix
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parent
REV = 'acc006479c77c0d1904fd5549a1b32658d9f7ab3'
URL = f'https://huggingface.co/datasets/San0160/CICIDS-2017/resolve/{REV}/Friday-WorkingHours-Afternoon-DDos.pcap_ISCX.csv'
FILE = ROOT / 'data/ddos-friday.csv'
FILE.parent.mkdir(exist_ok=True)
if not FILE.exists():
    urllib.request.urlretrieve(URL, FILE)
FEATURES = ['Flow Duration', 'Total Fwd Packets', 'Total Backward Packets',
 'Total Length of Fwd Packets', 'Total Length of Bwd Packets',
 'Flow Packets/s', 'Packet Length Mean', 'Flow IAT Mean']
expected_sha256 = '6ff1580f5f81c0ae28a26f7631721018577f5f7c5e0feac28b795fcfe7b411ee'
if hashlib.sha256(FILE.read_bytes()).hexdigest() != expected_sha256:
    raise ValueError('Dataset checksum mismatch; restore the pinned CSV before running.')
raw = pd.read_csv(FILE)
raw.columns = raw.columns.str.strip()
raw['Label'] = raw['Label'].str.strip()
assert set(raw.Label.unique()) == {'BENIGN','DDoS'}
x = raw[FEATURES].apply(pd.to_numeric, errors='coerce')
valid = np.isfinite(x).all(axis=1) & (x >= 0).all(axis=1)
x = x.loc[valid].copy()
y = raw.loc[valid, 'Label'].eq('DDoS').astype(int)
groups = pd.util.hash_pandas_object(x, index=False)
train, test = next(StratifiedGroupKFold(n_splits=5, shuffle=True, random_state=42).split(x,y,groups))
assert set(groups.iloc[train]).isdisjoint(groups.iloc[test])
model = DecisionTreeClassifier(max_depth=5, min_samples_leaf=50, class_weight='balanced', random_state=42)
model.fit(x.iloc[train],y.iloc[train])
threshold = float(x.iloc[train].loc[y.iloc[train].eq(0), 'Flow Packets/s'].quantile(.99))
predictions = {'99th-percentile rate rule': (x.iloc[test]['Flow Packets/s'] > threshold).astype(int),
               'Decision tree': model.predict(x.iloc[test])}
results = {}
for name, pred in predictions.items():
    tn, fp, fn, tp = confusion_matrix(y.iloc[test],pred,labels=[0,1]).ravel()
    results[name] = dict(precision=precision_score(y.iloc[test],pred,zero_division=0),
        recall=recall_score(y.iloc[test],pred), f1=f1_score(y.iloc[test],pred),
        tn=int(tn),fp=int(fp),fn=int(fn),tp=int(tp),fpr=fp/(fp+tn))
summary = x.assign(Label=raw.loc[valid,'Label'], Packets=x['Total Fwd Packets']+x['Total Backward Packets'],
                   Bytes=x['Total Length of Fwd Packets']+x['Total Length of Bwd Packets'])
columns=['Packets','Bytes','Flow Packets/s','Flow Duration','Packet Length Mean','Flow IAT Mean']
stats = {}
for label, d in summary.groupby('Label'):
    stats[label] = {'records':len(d), 'total_packets':int(d.Packets.sum()),'total_bytes':int(d.Bytes.sum()),
                   'medians':d[columns].median().to_dict()}
manifest = dict(dataset='CICIDS2017 Friday afternoon DDoS CSV',source=URL,revision=REV,
 sha256=hashlib.sha256(FILE.read_bytes()).hexdigest(),raw_rows=len(raw),removed_rows=int((~valid).sum()),
 clean_rows=len(x),raw_labels=raw.Label.value_counts().to_dict(),features=FEATURES,
 repeated_profiles=int(groups.duplicated().sum()),
 conflicting_profiles=int(pd.DataFrame({'group':groups,'y':y}).groupby('group').y.nunique().gt(1).sum()),
 train_rows=len(train),test_rows=len(test),test_labels=y.iloc[test].value_counts().to_dict(),
 seed=42,split='First fold of StratifiedGroupKFold(5); identical selected-feature profiles stay together',
 rate_threshold=threshold,metrics=results,statistics=stats,
 versions=dict(python=platform.python_version(),numpy=np.__version__,pandas=pd.__version__,sklearn=sklearn.__version__,matplotlib=matplotlib.__version__))
(ROOT/'ddos-results.json').write_text(json.dumps(manifest,indent=2)+'\n')
plt.rcParams.update({'font.family':'DejaVu Sans','axes.spines.top':False,'axes.spines.right':False,'figure.facecolor':'#f7f8f4','axes.facecolor':'#f7f8f4','text.color':'#172c30','axes.labelcolor':'#172c30'})
colors=['#146557','#b5543a']
fig, axs=plt.subplots(1,3,figsize=(12,4.2))
for ax, col, title in zip(axs,['records','total_packets','total_bytes'],['Flow records','Total packets across flows','Total bytes across flows']):
    vals=[stats[c][col] for c in ['BENIGN','DDoS']]
    ax.bar(['BENIGN','DDoS'],vals,color=colors)
    ax.set_title(title,fontsize=12)
    ax.ticklabel_format(axis='y',style='sci',scilimits=(0,0))
fig.suptitle('Traffic volume in the cleaned Friday capture',fontsize=16)
fig.tight_layout()
fig.savefig(ROOT/'ddos-volume.png',dpi=160)
plt.close(fig)
fig,axs=plt.subplots(1,3,figsize=(12,4.4))
for ax,col,title in zip(axs,['Packets','Flow Packets/s','Flow Duration'],['Packets per flow','Packets / second within a flow','Flow duration (microseconds)']):
    data=[np.log10(1+summary.loc[summary.Label.eq(c),col]) for c in ['BENIGN','DDoS']]
    boxes=ax.boxplot(data,tick_labels=['BENIGN','DDoS'],patch_artist=True,showfliers=False)
    for patch,color in zip(boxes['boxes'],colors): patch.set_facecolor(color); patch.set_alpha(.65)
    ax.set_title(title,fontsize=11); ax.set_ylabel('log10(1 + value)')
fig.suptitle('Normal and attack traffic overlap: volume alone is insufficient',fontsize=14)
fig.tight_layout(); fig.savefig(ROOT/'ddos-distributions.png',dpi=160); plt.close(fig)
fig,axs=plt.subplots(1,2,figsize=(10,4.4))
for ax,(name,r) in zip(axs,results.items()):
    arr=np.array([[r['tn'],r['fp']],[r['fn'],r['tp']]])
    ax.imshow(arr,cmap='Greens')
    for i in range(2):
        for j in range(2): ax.text(j,i,f'{arr[i,j]:,}',ha='center',va='center',color='white' if arr[i,j]>arr.max()*.55 else '#172c30',fontsize=15)
    ax.set_xticks([0,1],['BENIGN','DDoS']); ax.set_yticks([0,1],['BENIGN','DDoS'])
    ax.set_xlabel('Predicted'); ax.set_ylabel('Actual'); ax.set_title(name)
fig.suptitle('Held-out records · identical feature profiles grouped',fontsize=14)
fig.tight_layout(); fig.savefig(ROOT/'ddos-confusion.png',dpi=160); plt.close(fig)
print(json.dumps(manifest,indent=2))
