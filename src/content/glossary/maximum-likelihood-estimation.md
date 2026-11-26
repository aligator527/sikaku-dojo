---
term: '最尤推定'
reading: さいゆうすいてい
en: 'maximum likelihood estimation'
aliases: ['最尤法', 'MLE']
exams: [toukei-jun1, toukei-1, toukei-dse, jdla-e]
summary: '観測されたデータが得られる確率（尤度）を最大にするパラメータの値を推定値とする方法。大標本で良い性質をもち、多くの統計モデルの推定に使われる。'
related: [fisher-information, logistic-regression, aic, unbiased-estimator, sufficient-statistic]
formula: '\hat{\theta} = \arg\max_{\theta}\ \sum_{i=1}^{n} \log f(x_i; \theta)'
---
### 定義

独立な観測値 $x_1, \ldots, x_n$ に対して、尤度関数 $L(\theta) = \prod_i f(x_i; \theta)$ を最大にする $\hat{\theta}$ を最尤推定値といいます。実際には対数尤度 $\ell(\theta) = \sum_i \log f(x_i; \theta)$ を微分して 0 とおいた尤度方程式を解くことが多くなります。

### 代表例

| 分布 | 最尤推定量 |
| --- | --- |
| ベルヌーイ $B(1, p)$ | $\hat{p} = \bar{x}$ |
| ポアソン $Po(\lambda)$ | $\hat{\lambda} = \bar{x}$ |
| 正規 $N(\mu, \sigma^2)$ | $\hat{\mu} = \bar{x},\ \hat{\sigma}^2 = \frac{1}{n}\sum (x_i - \bar{x})^2$ |
| 一様 $U(0, \theta)$ | $\hat{\theta} = \max_i x_i$ |

### 性質

- 不変性：$g(\theta)$ の最尤推定量は $g(\hat{\theta})$。
- 正則条件のもとで一致性と漸近正規性 $\sqrt{n}(\hat{\theta} - \theta) \xrightarrow{d} N(0,\ 1/I(\theta))$ をもち、漸近的に有効。
- 解析的に解けない場合は、ニュートン・ラフソン法や EM アルゴリズムで数値的に求める（ロジスティック回帰、混合分布など）。

### 試験での問われ方

準1級では最尤推定量の計算と、フィッシャー情報量にもとづく近似信頼区間、1級では導出と漸近的性質の証明、DSE ではロジスティック回帰の対数尤度やニュートン法の更新式が問われます。

### よくある誤り

- 尤度を「パラメータの確率」と解釈する（尤度は $\theta$ の関数だが確率分布ではない）。
- 一様分布 $U(0, \theta)$ のように、微分しても最大値が求まらない（端点で最大になる）場合に気づかない。
- 正規分布の分散の最尤推定量が不偏だと考える。
