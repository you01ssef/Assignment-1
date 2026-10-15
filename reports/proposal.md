# One-page project proposal

**Project title:** Reading the Signals: Phishing Website Detection with Interpretable Machine Learning

**Dataset:** Akash Kumar’s [Phishing website dataset on Kaggle](https://www.kaggle.com/datasets/akashkr/phishing-website-dataset), a Kaggle-hosted mirror of the UCI Phishing Websites benchmark. The CSV contains 11,055 records, 30 integer-coded predictors, a sequential row index, and the `Result` label. The target encodes phishing as −1 and legitimate as 1. Features describe URL, domain, page, and reputation indicators. The UCI source reports no missing values. The raw CSV is not committed; download instructions are in `data/README.md`.

**Security problem:** Phishing pages imitate legitimate services to trick visitors into disclosing passwords, payment information, or other sensitive data. A detector can help analysts prioritize suspicious sites, but a missed phishing page can harm users and a false alert can interrupt access to a legitimate service.

**Research question:** How well can Logistic Regression and Random Forest classify phishing sites using the dataset’s engineered indicators, and what do each model’s false positives and false negatives imply for a security workflow?

**Proposed methodology:** Conduct exploratory data analysis for class balance, missing cells, exact duplicates, feature distributions, and correlations. Remove the sequential row index, encode phishing as the positive class, and fit preprocessing only on training folds. The dataset has many repeated predictor profiles and some profiles with conflicting labels, so retain records and use a stratified group split by predictor signature to keep identical profiles out of both train and test sets. Compare a scaled Logistic Regression pipeline with a class-weighted Random Forest using an 80/20 grouped holdout (first fold of five stratified folds grouped by predictor profile, seed 42). Report accuracy, phishing precision/recall/F1, ROC-AUC, confusion matrices, false-positive rate, false-negative rate, and held-out permutation importance.

**Expected results:** Both methods should identify patterns associated with phishing, while the tree ensemble may capture nonlinear combinations. The security goal is not the highest accuracy score: results will be interpreted through missed-phishing risk, alert burden, dataset age, and limits on generalization to current attacks. No model result will be presented as live website safety assurance.
