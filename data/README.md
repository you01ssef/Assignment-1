# Dataset

Download the Kaggle dataset **Phishing website dataset** by Akash Kumar:

<https://www.kaggle.com/datasets/akashkr/phishing-website-dataset>

From the repository root, with Kaggle API credentials configured, run:

```sh
python -m pip install kaggle
kaggle datasets download -d akashkr/phishing-website-dataset --unzip -p data
```

The archive contains `dataset.csv`. Keep the original file name and place it in this directory. The raw dataset is excluded from Git; the Kaggle license and version terms apply. The Kaggle mirror corresponds to the UCI **Phishing Websites** benchmark (11,055 records, 30 integer-coded predictors). It includes an additional sequential `index` field and a `Result` target: `-1` = phishing; `1` = legitimate. The notebook drops the index before modeling.

Original benchmark citation: Mohammad, R., Thabtah, F., & McCluskey, L. (2012). “An assessment of features related to phishing websites using an automated technique.” The UCI dataset record gives the source description, feature details, and CC BY 4.0 license: <https://archive.ics.uci.edu/dataset/327/phishing+websites>.

No raw URLs or website content are included in this feature dataset. Do not treat its predictions as a verdict on a live website.
