# Reading the Signals: Phishing Website Detection with Interpretable Machine Learning

**Course project report · Computer Security and Machine Learning**
**Research question:** How well can Logistic Regression and Random Forest classify phishing websites using engineered URL, domain, and page indicators, and what do their errors mean for a security workflow?

## 1. Introduction

Phishing uses deceptive websites to persuade people to enter credentials, payment details, or other sensitive information. Security teams can use automated classification to sort potential threats for review. A detector is useful only if its errors are understood: a phishing site marked legitimate can expose users to fraud, while a legitimate site marked suspicious can block work and consume analyst time.

This project compares a linear Logistic Regression model with a Random Forest on an established phishing website benchmark. The aim is to study what the models learn from pre-engineered signals, not to build a browser-safe browsing service or to claim that high benchmark scores guarantee protection. The work examines data quality, uses a group-aware split to reduce overlap between identical feature profiles, evaluates false positives and false negatives, and interprets measured feature importance cautiously.

## 2. Security problem and research question

The problem is binary classification of website observations as phishing or legitimate. The specific research question is: **How well can Logistic Regression and Random Forest distinguish phishing from legitimate websites on a held-out set of unseen predictor profiles, and how should the false-positive and false-negative rates affect a proposed analyst workflow?**

The positive class in this report is phishing. A false negative (FN) is a phishing example classified as legitimate. In a deployed system, this could let a user reach a credential-harvesting page. A false positive (FP) is a legitimate website classified as phishing. If a system blocks such a site automatically, users may lose access to a needed service; if it sends an alert, an analyst must spend time clearing the false alarm. Because these costs differ, accuracy alone is not enough to select an operating threshold.

## 3. Dataset description

The selected source is Akash Kumar’s [Phishing website dataset on Kaggle](https://www.kaggle.com/datasets/akashkr/phishing-website-dataset). It mirrors the UCI Phishing Websites benchmark introduced by Mohammad, Thabtah, and McCluskey. The benchmark contains **11,055 records** and **30 integer-coded predictors**. The Kaggle CSV has 32 columns: those 30 predictors, a sequential `index`, and `Result` as the target. The label is `-1` for phishing and `1` for legitimate; the notebook maps it to 1 for phishing and 0 for legitimate.

Features represent indicators such as `having_IPhaving_IP_Address` (IP literal use), `URLURL_Length` (URL length category), `Shortining_Service` (shortened URL), `Prefix_Suffix` (domain punctuation), `SSLfinal_State` (HTTPS/certificate state), `Request_URL` (external page objects), `URL_of_Anchor` (link destinations), `age_of_domain`, `web_traffic`, and `Page_Rank`. Most values use −1, 0, or 1 to encode a feature rule. The full column-by-column descriptions are in [the feature dictionary](feature_dictionary.md). They are not raw URLs or page contents, so the data cannot support analysis of page text, screenshots, actual campaign groups, or current site behavior. The UCI record describes the data collection sources and reports no missing values. The Kaggle dataset page and the UCI repository are cited in the references; the raw CSV is omitted from this deliverable and is downloaded separately under the source terms.

### Exploratory data analysis

The CSV contains 11,055 rows and 32 columns. There are **no missing cells** and no exact duplicate CSV rows while the sequential index is present. The target distribution is **6,157 legitimate records (55.7%)** and **4,898 phishing records (44.3%)**, a moderate imbalance. All 30 predictors are numeric integers. Twenty-two predictors have two observed values and eight have three, matching the dataset’s categorical/ordinal indicator design.

After excluding the row index, many records share the same predictor and label profile: 5,206 such repeated profiles are observed, and 64 predictor profiles appear with both labels. The data does not include URL identity, so these repeated vectors cannot be safely identified as duplicate websites. Removing them would discard 47% of the observations, shift the target mix substantially, and erase contradictory labels. The analysis therefore keeps the records and groups matching predictor signatures together during the train/test split. This is a data-quality choice: the records are feature-equivalent, not proven duplicate sites.

The class distribution chart shows the phishing and legitimate counts. Feature plots compare encoded values for representative URL, domain, certificate, page-link, and traffic indicators. Correlation analysis compares each encoded indicator with the target and with other strong indicators. The strongest target-associated patterns include the final SSL state and URL anchor behavior. These are associations in this benchmark; they do not show that a feature causes phishing or that every site with such a signal is malicious. Charts are saved under `reports/figures/` and are generated by the notebook.

## 4. Data preprocessing

The sequential `index` is removed because it identifies row order rather than website behavior. Exact duplicate rows are checked before removing the index; none exist. Repeated feature profiles are retained because the dataset does not identify URLs and because 64 profiles have conflicting labels. A five-fold `StratifiedGroupKFold` split is used, with the first fold as an approximately 80/20 held-out comparison. The group key is the complete predictor vector, ensuring the same feature profile does not occur in both training and test partitions. The split uses seed 42. The resulting test set contains 2,196 records: 1,203 legitimate and 993 phishing.

The target is recoded so phishing is the positive class. Numeric missing-value imputation with the training median is included in the pipelines even though the source has no missing cells; this keeps the analysis reproducible if a later input does. Logistic Regression receives median imputation followed by standardization because its regularization depends on feature scale. Random Forest receives imputation but no scaling because tree splits are not scale-sensitive. The baseline keeps the integer category codes. For Logistic Regression this assumes ordered, evenly spaced effects; comparing one-hot encoding is a possible extension. Both methods use class weights to account for the modest target imbalance without fabricating synthetic examples. The pipelines are fitted only to the training fold, avoiding leakage of preprocessing statistics from the test data.

## 5. Methodology

Logistic Regression is a useful linear baseline: each encoded feature contributes to a log-odds score, and the fitted coefficients can provide a compact summary of direction and magnitude. It may miss interactions where multiple suspicious indicators matter together. Random Forest averages many decision trees and can model nonlinear splits and feature interactions. Its flexibility can improve benchmark performance, but it does not make the result inherently explainable or robust to new attack tactics.

Both models are evaluated on exactly the same held-out records. Reported metrics are accuracy, phishing precision, phishing recall, phishing F1, ROC-AUC, false-positive rate, false-negative rate, and confusion-matrix counts. The classifier’s default probability threshold is 0.5; it is not calibrated to a particular analyst capacity. The Random Forest uses 400 trees, minimum leaf size 2, balanced subsample weights, and seed 42. Logistic Regression uses balanced class weights and a 2,000-iteration convergence limit. Random Forest permutation importance is calculated on the test split using ROC-AUC, with 10 shuffles per feature.

## 6. Experimental results

These results were regenerated with the pinned analysis dependencies (scikit-learn 1.7.2). The dataset checksum, split sizes, and package versions are recorded in [the run manifest](run_manifest.json). Library versions can affect grouped split assignments; use the recorded environment to reproduce this run.

| Model | Accuracy | Precision (phishing) | Recall (phishing) | F1 (phishing) | ROC-AUC | FPR | FNR |
|---|---:|---:|---:|---:|---:|---:|---:|
| Logistic Regression | 0.922 | 0.900 | 0.930 | 0.915 | 0.974 | 0.085 | 0.070 |
| Random Forest | 0.944 | 0.939 | 0.937 | 0.938 | 0.986 | 0.050 | 0.063 |

The Random Forest scores higher on this grouped holdout: it classifies 94.4% of records correctly and has phishing recall of 93.7%. Its test confusion matrix contains 1,143 true negatives (legitimate sites correctly labeled), 60 false positives, 63 false negatives, and 930 true positives. Logistic Regression has 1,101 true negatives, 102 false positives, 70 false negatives, and 923 true positives. ROC-AUC measures ranking across thresholds rather than performance at one operational threshold, so it complements rather than replaces the confusion matrix.

The Random Forest reduces false alarms and missed phishing examples compared with the linear baseline in this one split. At the fixed 0.5 threshold, however, it still misses 63 of the 993 phishing examples in the test set (6.3% FNR). A real security team would need to decide how to trade review volume against misses and validate a threshold against current data and real incident costs. These values are not population estimates and should not be generalized beyond this dataset without further testing.

Permutation importance ranks `SSLfinal_State` first (mean ROC-AUC drop 0.0691 when shuffled), followed by `URL_of_Anchor` (0.0610), `web_traffic` (0.0132), `Prefix_Suffix` (0.0116), and `Links_in_tags` (0.0062). Importance is predictive association; correlated indicators can substitute for one another. The score does not prove a particular feature is causal or provide a reliable reason for an individual prediction.

## 7. Security analysis

The results suggest these historical feature patterns can separate many phishing and legitimate records under a held-out profile-group split. From a user-protection perspective, false negatives deserve attention because an overlooked phishing page can lead to stolen credentials or financial loss. The model’s 63 test false negatives demonstrate that the classifier is not a complete control. False positives can create alert fatigue, delay legitimate browsing, and weaken trust in security warnings. The 60 Random Forest false positives are smaller than the 63 misses in this test split, but the relative costs depend on the organization and on whether the model alerts, quarantines, or blocks.

A cautious deployment concept would place the classifier inside a layered workflow: a new URL or website telemetry source produces the same feature schema; the model assigns a risk score; high-risk cases are queued for analyst review alongside reputation feeds and browser defenses; a human or independently validated policy determines action. The model should not be used to tell users that an unflagged site is safe. A production system would need current data, calibration, monitoring for drift, documented escalation policy, and an override path for false alarms.

## 8. Limitations

The dataset is a static benchmark from historical collection sources. It does not contain timestamps, source identifiers, raw URLs, page content, campaign IDs, or current threat-feed context. Grouping by feature signature reduces leakage from identical predictor vectors across train and test, but it does not create a temporal or source-separated evaluation. Sites with distinct identities can share a feature vector, and the same vector can have opposing labels. The class balance does not reflect a real browsing stream where phishing prevalence may be much lower. The selected features and their threshold rules may be stale as attackers adapt. No calibration or threshold optimization against review capacity is performed. Permutation importance can understate individual features when predictors are correlated. The model comparison includes two classical methods and one fixed split, not a broad hyperparameter search or adversarial robustness study.

## 9. Conclusion

On this benchmark and grouped holdout, Random Forest performs better than Logistic Regression across the reported metrics. It reaches 0.944 accuracy, 0.937 phishing recall, and 0.986 ROC-AUC, while still missing 63 phishing examples and flagging 60 legitimate examples. The feature analysis highlights certificate state and anchor behavior as the strongest predictive signals for this model. These findings support using engineered website indicators for offline prioritization research, not treating a model score as proof that a live site is safe or unsafe.

The most important next step is validation on recent, source-separated observations and a security-specific threshold decision based on the costs of missed attacks and false alarms. This limitation-focused conclusion is more appropriate than treating benchmark accuracy as the objective.

## 10. References

1. Akash Kumar. *Phishing website dataset*. Kaggle. <https://www.kaggle.com/datasets/akashkr/phishing-website-dataset>.
2. Mohammad, R., Thabtah, F., & McCluskey, L. (2012). “An assessment of features related to phishing websites using an automated technique.” *International Conference for Internet Technology and Secured Transactions*.
3. Mohammad & McCluskey. *Phishing Websites* [Dataset]. UCI Machine Learning Repository. <https://archive.ics.uci.edu/dataset/327/phishing+websites>. DOI: 10.24432/C51W2X. The repository record gives dataset license and feature descriptions.
4. Pedregosa, F., et al. (2011). “Scikit-learn: Machine Learning in Python.” *Journal of Machine Learning Research*, 12, 2825–2830. <https://scikit-learn.org/stable/>.
5. pandas development team. *pandas documentation*. <https://pandas.pydata.org/>.
6. Waskom, M. L. (2021). “seaborn: statistical data visualization.” *Journal of Open Source Software*, 6(60), 3021. <https://seaborn.pydata.org/>.

All data analysis, preprocessing, model training, evaluation, charts, and interpretation were written for this project. No external Kaggle notebook or solution code was reproduced. External tools and sources are cited above.
