---
term: '最小二乗法'
reading: さいしょうにじょうほう
en: 'least squares method'
aliases: ['最小二乗推定量', '最小二乗推定値', 'OLS', '普通最小二乗法']
exams: [toukei-2, toukei-jun1, toukei-1, toukei-dse, suken-1]
summary: '観測値と当てはめ値の差（残差）の 2 乗和が最小になるように、回帰モデルなどの係数を決める方法。'
related: [regression-analysis, normal-equation, residual, gauss-markov-theorem, maximum-likelihood-estimation]
formula: '\hat{\boldsymbol{\beta}} = \arg\min_{\boldsymbol{\beta}} \sum_{i=1}^{n}\left(y_i - \mathbf{x}_i^{\top}\boldsymbol{\beta}\right)^2 = (X^{\top}X)^{-1}X^{\top}\mathbf{y}'
---
## 定義

残差平方和 $S(\boldsymbol{\beta}) = \sum_i (y_i - \mathbf{x}_i^{\top}\boldsymbol{\beta})^2$ を最小にする $\hat{\boldsymbol{\beta}}$ を最小二乗推定量といいます。$S$ を各係数で偏微分して 0 とおいた連立方程式（正規方程式）$X^{\top}X\boldsymbol{\beta} = X^{\top}\mathbf{y}$ を解くと、$X^{\top}X$ が正則なら $\hat{\boldsymbol{\beta}} = (X^{\top}X)^{-1}X^{\top}\mathbf{y}$ となります。

単回帰 $y = \beta_0 + \beta_1 x$ では

$$\hat{\beta}_1 = \frac{S_{xy}}{S_{xx}},\qquad \hat{\beta}_0 = \bar{y} - \hat{\beta}_1\bar{x}$$

です。

## 計算例

$x = 1, 2, 3, 4, 5$、$y = 2, 4, 5, 4, 5$ のとき、$\bar{x} = 3$、$\bar{y} = 4$、$S_{xx} = 10$、$S_{xy} = 6$ なので、$\hat{\beta}_1 = 0.6$、$\hat{\beta}_0 = 4 - 0.6 \times 3 = 2.2$ です。残差は $-0.8, 0.6, 1.0, -0.6, -0.2$ で、和は 0、残差平方和は 2.4 になります。

## 最小二乗推定量の性質

- 定数項を含むモデルでは、残差の和は 0 で、回帰直線（回帰平面）は平均の点 $(\bar{x}, \bar{y})$ を通る。
- 残差は各説明変数とも当てはめ値とも直交する（幾何学的には、$\mathbf{y}$ を $X$ の列空間へ正射影したものが当てはめ値）。
- 誤差の期待値が 0 なら不偏。さらに等分散・無相関なら、線形不偏推定量の中で分散が最小（ガウス・マルコフの定理）。
- 誤差が正規分布なら、最尤推定量と一致する。
- 誤差分散の不偏推定量は $\hat{\sigma}^2 = S_e/(n - p - 1)$（$p$ は定数項以外の説明変数の数）。

## 試験での問われ方

統計検定2級では、平均・分散・共分散から回帰直線の係数を求める計算が頻出です。準1級・1級では、正規方程式と行列表示による導出、推定量の期待値と分散共分散行列 $\sigma^2(X^{\top}X)^{-1}$、誤差に相関や不均一分散があるときの一般化（加重）最小二乗法が問われます。

## よくある誤り

- 縦方向の距離ではなく、点から直線への垂直距離の 2 乗和を最小にすると考える（それは主成分分析の第 1 主軸にあたる）。
- 残差の和が 0 になることを、定数項のないモデルにも当てはめる。
- 外れ値の影響を見落とす（2 乗するので、大きく外れた点に係数が強く引っ張られる）。
