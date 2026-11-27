---
term: 'MAP 推定'
reading: えむえーぴーすいてい
en: 'maximum a posteriori estimation'
aliases: ['MAP', '事後確率最大化推定', '最大事後確率推定', '事後モード', '事後最頻値']
exams: [toukei-jun1, toukei-1, toukei-dse, jdla-e]
summary: '事後分布の確率密度（確率）を最大にするパラメータの値を推定値とする方法。対数尤度に対数事前密度を加えたものの最大化で、正則化付きの最尤推定と同じ形になる。'
related: [posterior-distribution, prior-distribution, maximum-likelihood-estimation, ridge-regression, weight-decay]
formula: '\hat{\theta}_{\mathrm{MAP}} = \arg\max_{\theta}\ \pi(\theta \mid x) = \arg\max_{\theta}\ \bigl\{\log f(x \mid \theta) + \log \pi(\theta)\bigr\}'
---
## 定義

事後分布 $\pi(\theta \mid x) \propto f(x \mid \theta)\,\pi(\theta)$ の最頻値（モード）を推定値とします。正規化定数（周辺尤度）は $\theta$ によらないので、最大化には不要です。事前分布が一様なら、MAP 推定値は最尤推定値と一致します。

## 計算例

成功確率 $p$ に $\mathrm{Beta}(a, b)$ を置き、$n$ 回中 $x$ 回成功したとき、事後分布 $\mathrm{Beta}(a + x,\ b + n - x)$ のモードは

$$\hat{p}_{\mathrm{MAP}} = \frac{a + x - 1}{a + b + n - 2}\qquad (a + x > 1,\ b + n - x > 1)$$

です。$\mathrm{Beta}(2, 2)$ で 10 回中 7 回成功なら $8/12 \approx 0.667$ で、最尤推定値 0.7 と事後平均 $9/14 \approx 0.643$ の間の値になります。

## 正則化との対応

対数をとると「対数尤度 + 対数事前密度」の最大化なので、事前分布は罰則項として働きます。

| 事前分布（係数 $\beta_j$ に独立に置く） | 罰則 | 対応する手法 |
|---|---|---|
| 正規分布 $N(0, \tau^2)$ | $\lambda\sum \beta_j^2$ | リッジ回帰（L2 正則化） |
| ラプラス分布（両側指数分布） | $\lambda\sum \lvert\beta_j\rvert$ | ラッソ（L1 正則化） |

正規線形回帰（誤差分散 $\sigma^2$）に $N(0, \tau^2)$ を置いた MAP 推定値は、罰則の強さ $\lambda = \sigma^2/\tau^2$ のリッジ推定量に一致します。

## 他の推定量との違い

- 事後平均（二乗誤差損失のベイズ推定量）・事後中央値（絶対誤差損失）とは一般に異なり、一致するのは事後分布が対称で単峰のとき（正規分布など）。
- 確率密度の最大点なので、パラメータを変数変換すると変換後の MAP 推定値は元の MAP 推定値の変換と一致しない（最尤推定量の不変性とは対照的）。
- 点推定だけで、不確かさの情報（事後分布の広がり）はもたない。

## 試験での問われ方

統計検定準1級・データサイエンスエキスパートでは、ベータ分布やガンマ分布の事後分布からモードを求め、事後平均と比べさせる問題が出ます。E資格では、MAP 推定と最尤推定・ベイズ推定の違い、正則化（重み減衰）と正規事前分布の関係が頻出です。

## よくある誤り

- ベータ分布のモードを平均の式 $a/(a+b)$ で計算する（モードは $(a-1)/(a+b-2)$）。
- MAP 推定値は変数変換に対して不変だと考える。
- 一様事前分布でなくても MAP 推定値と最尤推定値が一致すると考える。
