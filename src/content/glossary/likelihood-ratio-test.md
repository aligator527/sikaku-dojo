---
term: '尤度比検定'
reading: ゆうどひけんてい
en: 'likelihood ratio test'
aliases: ['尤度比統計量']
exams: [toukei-jun1, toukei-1, toukei-dse]
summary: '帰無仮説のもとでの最大尤度と、母数全体での最大尤度の比に基づいて仮説を検定する方法。大標本では −2 log（尤度比）がカイ二乗分布に近似的に従う。'
related: [likelihood-function, maximum-likelihood-estimation, neyman-pearson-lemma, chi-square-test, aic]
formula: '\Lambda = \frac{\sup_{\theta \in \Theta_0} L(\theta)}{\sup_{\theta \in \Theta} L(\theta)},\qquad -2\log\Lambda \xrightarrow{d} \chi^2(r)'
---
## 定義

母数空間 $\Theta$ の部分集合 $\Theta_0$ について $H_0: \theta \in \Theta_0$ を検定するとき、尤度比

$$\Lambda = \frac{\sup_{\theta \in \Theta_0} L(\theta)}{\sup_{\theta \in \Theta} L(\theta)} = \frac{L(\hat{\theta}_0)}{L(\hat{\theta})}$$

を計算します。分母は制約なしの最尤推定値、分子は帰無仮説の範囲での最尤推定値での尤度で、$0 < \Lambda \leq 1$ です。$\Lambda$ が小さい（帰無仮説の制約でデータへの当てはまりが大きく悪くなる）ときに棄却します。

## ウィルクスの定理

正則条件のもとで、帰無仮説が正しければ

$$-2\log\Lambda = 2\left\{\ell(\hat{\theta}) - \ell(\hat{\theta}_0)\right\} \xrightarrow{d} \chi^2(r)$$

が成り立ちます。自由度 $r$ は、帰無仮説によって減る自由な母数の数（$\dim\Theta - \dim\Theta_0$）です。

## 例

- 正規分布の平均（分散既知）：$-2\log\Lambda = n(\bar{x} - \mu_0)^2/\sigma^2 = Z^2$ で、正確に $\chi^2(1)$ に従う。
- ポアソン分布：$n = 10$、$\sum x_i = 30$、$H_0: \lambda = 2$ のとき、$\hat{\lambda} = 3$ で $-2\log\Lambda = 2\{30\log(3/2) - 10(3 - 2)\} \approx 4.33$。$\chi^2_{0.05}(1) = 3.84$ を超えるので 5% で棄却する。
- 分割表の独立性：$G^2 = 2\sum O\log(O/E)$ は尤度比検定統計量で、ピアソンのカイ二乗統計量と漸近的に同等。
- 正規線形モデル：入れ子のモデルを比べる F 検定や、t 検定も尤度比検定から導ける。

## スコア検定・ワルド検定との関係

尤度比検定・スコア検定・ワルド検定は、どれも漸近的に同じ $\chi^2(r)$ 分布に従い、大標本では同等です。尤度比検定は両方のモデルを当てはめる必要がありますが、母数の変換に対して結果が変わらないという長所があります。

## 試験での問われ方

統計検定準1級・1級では、指数分布・ポアソン分布・正規分布などで尤度比を計算して棄却域を簡単な統計量の形に直す問題、$-2\log\Lambda$ の漸近分布と自由度を答える問題が典型です。一般化線形モデルの逸脱度の差による検定も、尤度比検定の応用として出題されます。

## よくある誤り

- 自由度を母数の総数とする（帰無仮説で制約される母数の数）。
- $\Lambda$ が大きいときに棄却する（棄却するのは小さいとき、つまり $-2\log\Lambda$ が大きいとき）。
- 母数が母数空間の境界にある帰無仮説（分散成分 $= 0$ など）にもウィルクスの定理をそのまま使う（極限分布が変わる）。
