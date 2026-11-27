---
term: '枢軸量'
reading: すうじくりょう
en: 'pivotal quantity'
aliases: ['ピボット量']
exams: [toukei-1]
summary: 'データと未知母数の両方を含む関数で、その分布が未知母数によらずに決まるもの。不等式を母数について解くことで信頼区間を作るのに使う。'
related: [confidence-interval, t-distribution, chi-square-distribution, normal-distribution, sufficient-statistic]
formula: 'P\left(a \leq Q(\mathbf{X}; \theta) \leq b\right) = 1 - \alpha\quad (\text{the law of } Q \text{ is free of } \theta)'
---
## 定義

データ $\mathbf{X}$ と母数 $\theta$ の関数 $Q(\mathbf{X}; \theta)$ の分布が $\theta$ に依存しないとき、$Q$ を枢軸量といいます。統計量ではない（母数を含む）点が検定統計量との違いです。分布が既知なので $P(a \leq Q \leq b) = 1 - \alpha$ となる $a, b$ を数値表から決め、不等式 $a \leq Q(\mathbf{X}; \theta) \leq b$ を $\theta$ について解けば、信頼係数 $1 - \alpha$ の信頼区間が得られます。

## 代表的な枢軸量

| 状況 | 枢軸量 | 分布 |
| --- | --- | --- |
| 正規、$\sigma^2$ 既知、平均 $\mu$ | $\dfrac{\bar{X} - \mu}{\sigma/\sqrt{n}}$ | $N(0, 1)$ |
| 正規、$\sigma^2$ 未知、平均 $\mu$ | $\dfrac{\bar{X} - \mu}{s/\sqrt{n}}$ | $t(n-1)$ |
| 正規、分散 $\sigma^2$ | $\dfrac{(n-1)s^2}{\sigma^2}$ | $\chi^2(n-1)$ |
| 2 つの正規母集団の分散比 | $\dfrac{s_1^2/\sigma_1^2}{s_2^2/\sigma_2^2}$ | $F(n_1-1,\ n_2-1)$ |
| 指数分布（平均 $\theta$） | $\dfrac{2\sum X_i}{\theta}$ | $\chi^2(2n)$ |
| 一様 $U(0, \theta)$ | $\dfrac{\max_i X_i}{\theta}$ | 分布関数 $u^n$（$0 < u < 1$） |

## 計算例

- 指数分布で $n = 5$、$\sum x_i = 20$ のとき、$\chi^2_{0.975}(10) \approx 3.247$、$\chi^2_{0.025}(10) \approx 20.48$ から、$3.247 \leq 40/\theta \leq 20.48$ を解いて、$\theta$ の 95% 信頼区間は約 $[1.95,\ 12.3]$。
- 一様分布で $n = 10$、最大値 $8.0$ のとき、$P(0.05^{1/10} \leq M/\theta \leq 1) = 0.95$ から、95% 信頼区間は $[8.0,\ 8.0/0.741] \approx [8.0,\ 10.8]$。

## 枢軸量がない場合

正確な枢軸量が見つからないときは、最尤推定量の漸近正規性を使った近似的な枢軸量 $(\hat{\theta} - \theta)/\widehat{\mathrm{SE}}$ を使います。二項分布の比率のような離散分布では、正確な枢軸量は一般に存在しません。

## 試験での問われ方

統計検定1級では、指数分布・一様分布・ガンマ分布などについて枢軸量を見つけ、その分布を変数変換で導いて信頼区間を構成する問題が頻出です。準1級では、t 分布・カイ二乗分布・F 分布を使う標準的な区間の構成が中心です。

## よくある誤り

- 枢軸量を統計量と混同する（枢軸量は未知母数を含んでよく、分布が母数によらないことが条件）。
- 不等式を母数について解くとき、逆数をとって向きが変わることを忘れる（分散の区間で上側点と下側点が入れ替わる）。
- 区間の両端を対称にとれば最短になると考える（非対称な分布では、等確率に裾を切った区間が最短とは限らない）。
