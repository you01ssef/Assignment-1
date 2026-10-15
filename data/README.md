# Dataset

Download the Kaggle dataset **Phishing website dataset** by Akash Kumar:

<https://www.kaggle.com/datasets/akashkr/phishing-website-dataset>

The notebook downloads **version 2** automatically with KaggleHub when no local CSV is available. To download it separately:

```sh
python -m pip install kagglehub==0.4.3
python -c "import kagglehub; print(kagglehub.dataset_download('akashkr/phishing-website-dataset/versions/2'))"
```

The command prints the downloaded folder. For an offline run, copy its `dataset.csv` into this directory, or set `DATA_FILE` in the notebook to its location. The raw dataset is excluded from Git; the Kaggle license and version terms apply.

| Dataset requirement | Details |
|---|---|
| Name | Phishing website dataset, by Akash Kumar |
| Description | Engineered URL, domain, certificate, page-link, and traffic indicators for historical phishing and legitimate website observations. A Kaggle mirror of the UCI Phishing Websites benchmark. |
| Records | 11,055 |
| Predictor features | 30 integer-coded indicators |
| CSV columns | 32: 30 predictors, the sequential `index`, and the target `Result` |
| Target | `Result`: −1 = phishing; +1 = legitimate |
| Class counts | 4,898 phishing; 6,157 legitimate |
| Important features | `SSLfinal_State` (certificate state), `URL_of_Anchor` (link destinations), `URLURL_Length` (URL length category), `having_IPhaving_IP_Address` (IP address use), and `web_traffic` (traffic category). |

See the [full feature dictionary](../reports/feature_dictionary.md). The notebook removes the row index and maps phishing to the positive class before modeling.

Version-2 CSV SHA-256: `83853a3ddf39a77e4bda0c8c907c5a7f521f16ed844299de75d215c22d5bd379`.

Original benchmark citation: Mohammad, R., Thabtah, F., & McCluskey, L. (2012). “An assessment of features related to phishing websites using an automated technique.” The UCI dataset record gives the source description, feature details, and CC BY 4.0 license: <https://archive.ics.uci.edu/dataset/327/phishing+websites>.

No raw URLs or website content are included in this feature dataset. Do not treat its predictions as a verdict on a live website.
