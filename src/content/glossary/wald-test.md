---
term: 'ワルド検定'
reading: わるどけんてい
en: 'Wald test'
exams: [toukei-jun1, toukei-1, toukei-dse]
summary: '最尤推定量が漸近的に正規分布に従うことを使い、推定値と帰無仮説の値の差をその標準誤差で割った統計量で検定する方法。'
related: [likelihood-ratio-test, score-test, asymptotic-normality, maximum-likelihood-estimation, logistic-regression]
formula: 'W = \frac{(\hat{\theta} - \theta_0)^2}{\widehat{V}(\hat{\theta})} \xrightarrow{d} \chi^2(1),\qquad Z = \frac{\hat{\theta} - \theta_0}{\widehat{\mathrm{SE}}(\hat{\theta})}'
---
## 定義

最尤推定量 $\hat{\theta}$ は大標本で近似的に $N(\theta,\ 1/I_n(\theta))$ に従います。そこで $H_0: \theta = \theta_0$ を

$$Z = \frac{\hat{\theta} - \theta_0}{\widehat{\mathrm{SE}}(\hat{\theta})},\qquad W = Z^2$$

で検定するのがワルド検定です。標準誤差は $1/\sqrt{I_n(\hat{\theta})}$ のように推定値で評価します。$|Z| \geq z_{\alpha/2}$（または $W \geq \chi^2_{\alpha}(1)$）なら棄却します。多母数では $(\hat{\boldsymbol{\theta}} - \boldsymbol{\theta}_0)^{\top}\widehat{V}^{-1}(\hat{\boldsymbol{\theta}} - \boldsymbol{\theta}_0)$ を自由度 $r$（検定する母数の数）のカイ二乗分布と比べます。

## 例

- ロジスティック回帰やポアソン回帰の出力にある各係数の「z 値」は、係数 ÷ 標準誤差のワルド統計量。
- ポアソン分布：$n = 10$、$\sum x_i = 30$、$H_0: \lambda = 2$ なら $\hat{\lambda} = 3$、$\widehat{V}(\hat{\lambda}) = \hat{\lambda}/n = 0.3$ で、$W = (3 - 2)^2/0.3 \approx 3.33$。5% の棄却限界 3.84 に届かず、同じデータの尤度比検定（約 4.33）やスコア検定（5.0）とは結論が分かれる。
- ワルド型信頼区間 $\hat{\theta} \pm z_{\alpha/2}\widehat{\mathrm{SE}}$ は、ワルド検定で棄却されない $\theta_0$ の集合。

## 特徴と注意点

- 制約なしのモデルを 1 回当てはめるだけで、すべての係数を検定できる。
- 母数の変換に対して不変でない：$\theta$ で検定するか $\log\theta$ で検定するかで結果が変わりうる。
- ロジスティック回帰などでは、推定値が帰無仮説の値から大きく離れる（比率が 0 や 1 に近い、完全分離に近い）と標準誤差が急に大きくなり、ワルド統計量がかえって小さくなって検出力が下がることがある（ハウク・ドナー効果）。

## 試験での問われ方

統計検定準1級・1級・データサイエンスエキスパートでは、一般化線形モデルの出力から係数のワルド検定や信頼区間を読む問題、尤度比検定・スコア検定との違い（どのモデルを当てはめるか、どこで情報量を評価するか）を問う問題が出ます。

## よくある誤り

- 標準誤差を帰無仮説の値で評価する（それはスコア検定の考え方）。
- 小標本や推定値が境界に近い場合でも、ワルド検定の結果を尤度比検定と同じように信頼する。
- $Z$ 統計量と $W = Z^2$ で別々の分布表（標準正規と $\chi^2(1)$）を使い分けることを忘れ、片方の棄却限界をもう片方に使う。
