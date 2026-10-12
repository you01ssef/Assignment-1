# Dataset feature guide

The Kaggle CSV stores the UCI Phishing Websites benchmark’s rule-based feature codes. The predictors are integer indicators (typically −1, 0, 1); a value is not a probability. See the original [UCI feature documentation](https://archive.ics.uci.edu/dataset/327/phishing+websites) for the source definitions. Kaggle column names are preserved below, including the few repeated-name/typo artifacts in the mirror.

| Kaggle column | What it represents |
|---|---|
| `having_IPhaving_IP_Address` | Whether the URL uses an IP address in place of a domain name. |
| `URLURL_Length` | URL length category. |
| `Shortining_Service` | Use of a URL shortening service. |
| `having_At_Symbol` | Presence of `@` in the URL. |
| `double_slash_redirecting` | Redirect-style `//` placement in the URL. |
| `Prefix_Suffix` | Hyphen-like prefix/suffix pattern in the domain. |
| `having_Sub_Domain` | Number/structure of subdomains. |
| `SSLfinal_State` | HTTPS/certificate state signal. |
| `Domain_registeration_length` | Domain registration duration/expiry signal. |
| `Favicon` | Whether the favicon source matches the page’s domain. |
| `port` | Use of a non-standard port. |
| `HTTPS_token` | Whether “https” appears in the domain string as a token. |
| `Request_URL` | Proportion of page objects requested from another domain. |
| `URL_of_Anchor` | Proportion/behavior of links pointing to another domain or suspicious target. |
| `Links_in_tags` | External or suspicious links in metadata/script/link tags. |
| `SFH` | Server Form Handler destination behavior. |
| `Submitting_to_email` | Whether forms submit through an email (`mailto`) route. |
| `Abnormal_URL` | Whether the hostname/domain identity appears abnormal. |
| `Redirect` | Redirect count/behavior. |
| `on_mouseover` | Whether mouse-over behavior manipulates the status bar. |
| `RightClick` | Whether right-click behavior is disabled or altered. |
| `popUpWidnow` | Popup window behavior (source column spelling preserved). |
| `Iframe` | IFrame usage/visibility behavior. |
| `age_of_domain` | Domain age signal. |
| `DNSRecord` | DNS record existence signal. |
| `web_traffic` | Website traffic/ranking signal. |
| `Page_Rank` | Page rank/reputation signal. |
| `Google_Index` | Search-engine index presence signal. |
| `Links_pointing_to_page` | Count/category of inbound links to the page. |
| `Statistical_report` | Suspicious-list/statistical report signal. |

`index` is a sequential row identifier, not a model input. `Result` is the target (`-1` phishing, `1` legitimate). This file describes engineered indicators; it does not reproduce the original measurement pipeline or assert that any single indicator proves malicious intent.
