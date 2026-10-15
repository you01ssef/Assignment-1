# Youssef’s IT portfolio — GitHub Pages edition

**Open https://you01ssef.github.io/Assignment-1/ — no installation or local server needed.**

## Phishing analysis notebook

[Read the full notebook on the website](https://you01ssef.github.io/Assignment-1/analysis/phishing_analysis.html).

[Read the executed notebook](analysis/phishing_analysis.ipynb) · [Run in Google Colab](https://colab.research.google.com/github/you01ssef/Assignment-1/blob/main/analysis/phishing_analysis.ipynb) · [Research page](https://you01ssef.github.io/Assignment-1/phishing-study.html)

In Colab, connect to a Python runtime and choose **Runtime → Run all**. The notebook installs missing libraries and downloads the public Kaggle dataset when a local CSV is unavailable. Its saved outputs include the charts, model results, and a conclusion calculated from those results. The Security Lab's encrypted study notes are a separate browser demo.

## Try it

1. Open Security Lab and choose **Create notebook**.
2. Choose a notebook name and a passphrase of at least 12 characters.
3. Save a practice note, press **Lock**, and unlock it again.
4. Open **Ask Nova**. Try `15% of 240`, `sqrt(81)`, `12 times 8`, or `Who are you?`.
5. Press **Read aloud** on a reply. Press **Stop reading** to cancel.

## Simple features

- Browser notebook with encrypted storage, safe text rendering, validation, and a 15-minute unlock session.
- Nova: a digital website helper with curated portfolio/security answers and page links. It uses local rules, not a generative AI model.
- Arithmetic, parentheses, powers, percentages, and square roots. The calculator never evaluates input as JavaScript. It does not solve general algebra or arbitrary word problems.
- Optional text to speech using browser speech synthesis. No microphone or API key. Voice availability depends on the browser; some voices may use an online service.
- Responsive cream, navy, and teal design, keyboard controls, and clear architecture and threat-model explanations.

## Where notes live

Notes stay in **this browser on this device**. They are not uploaded to GitHub and do not sync. Web Crypto derives an AES-256-GCM key from the passphrase using PBKDF2-SHA-256, 600,000 iterations, and a random salt. Each save uses a fresh IV. Only ciphertext, salt, IV, and a readable notebook name are persisted. The passphrase and key are not stored.

Lock, refresh, or 15 minutes ends the demo session and clears the in-memory key. Clearing site data deletes notes. Forgotten passphrases cannot be recovered. Browser storage may be unavailable or temporary in private browsing. Use practice notes only.

This is a **browser-only classroom demo**, not secure server accounts or real multi-user authorization. Someone who controls the page, browser, or an extension can interfere or read unlocked notes. Client validation is not a trusted security boundary.

## Assignment components

The live Architecture page maps all nine components honestly. GitHub Pages provides the web server; JavaScript provides the application layer; browser storage demonstrates persistence and encryption. A real database, server authentication, and server authorization require a backend.

The original `server/` Express/SQLite code remains available for coursework, with password hashing, ownership checks, cookie sessions, and parameterized queries. Its accounts/data are separate; the live browser notebook does not use or migrate them. `npm install` and `npm start` run that optional server, which also serves the current static frontend. Its API can be demonstrated with the automated tests. Running it is not needed for the live website.

## Tests

With Node.js 24.13 or newer:

```sh
npm install
npm test
```

Tests cover the optional server’s security controls, Nova’s matching and math, encryption round-trips, wrong passphrases, and tamper detection.

## Main files

- `security-lab.html`: browser notebook page
- `css/js/lab.js`: create/unlock/save/lock interface
- `css/js/vault.js`: Web Crypto encryption
- `css/js/chatbot.js`: Nova’s answers, persona, and speech controls
- `css/js/math.js`: safe arithmetic parser
- `architecture.html`: requirement mapping and limitations

References: [Web Crypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey), [speech synthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis), [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

## Computer security research project

The site now includes a controlled SQL input lesson and a reproducible phishing website classification project.

- [Research overview](https://you01ssef.github.io/Assignment-1/phishing-study.html): dataset, EDA, model comparison, errors, charts, and limitations.
- [Secure input lesson](https://you01ssef.github.io/Assignment-1/input-security.html): vulnerable SQL construction versus prepared statements, input validation, and least-privilege database access. Its interactive example displays query text only; it never connects to or executes SQL.
- [One-page proposal](reports/proposal.md)
- [Full report](reports/report.md)
- [Feature dictionary](reports/feature_dictionary.md)
- [Executed Jupyter notebook](analysis/phishing_analysis.ipynb)
- [Presentation deck](presentation/Phishing_Website_Detection.pptx)
- [Presentation timing and talk guide](reports/presentation-notes.md)

### Dataset and analysis setup

The selected dataset is Akash Kumar’s [Phishing website dataset on Kaggle](https://www.kaggle.com/datasets/akashkr/phishing-website-dataset), a Kaggle mirror of the [UCI Phishing Websites benchmark](https://archive.ics.uci.edu/dataset/327/phishing+websites). The CSV has 11,055 records, 30 predictor features, a sequential index, and the `Result` label. See [data/README.md](data/README.md) for citation and download steps. The raw CSV is not checked into the repository.

For a local run, use Python 3.11 or newer and run these commands from the repository folder:

```sh
python -m venv .venv
source .venv/bin/activate
# Windows PowerShell: .venv\Scripts\Activate.ps1
python -m pip install -r requirements-analysis.txt
jupyter lab analysis/phishing_analysis.ipynb
```

Choose **Restart Kernel and Run All Cells**. The loader uses `data/dataset.csv` if present, otherwise downloads Kaggle version 2 using KaggleHub. If internet access is unavailable, download that CSV beforehand or set `DATA_FILE` in the notebook. No API token is needed for this public dataset under its current access settings; any Kaggle consent request must be completed on Kaggle.

The core library versions are pinned in `requirements-analysis.txt`. The notebook records the dataset checksum, library versions, random seed, and split sizes in [reports/run_manifest.json](reports/run_manifest.json). Colab's preinstalled library versions may differ; use the pinned environment to reproduce the saved results most closely.

The notebook reports EDA, repeated feature profiles, missing cells, and class distribution; it compares class-weighted Logistic Regression and Random Forest in a stratified grouped split; and evaluates accuracy, phishing precision/recall/F1, ROC-AUC, FPR, FNR, confusion matrices, and permutation importance. Its rendered charts and metrics are in `reports/`. The project report interprets missed phishing as a user-harm path and false alarms as review/access costs. Results are from a static historical benchmark and do not certify a live site as safe.

The optional Node server explicitly serves the added pages and project artifacts. Run `npm install && npm start` for the local site; `npm test` runs the repository’s existing server and browser-feature checks.
