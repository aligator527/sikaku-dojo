---
term: 'ハット行列'
reading: はっとぎょうれつ
en: 'hat matrix'
exams: [toukei-jun1, toukei-1, toukei-dse]
summary: '線形回帰で、観測値ベクトル y を当てはめ値 ŷ に写す行列 H = X(XᵀX)⁻¹Xᵀ。説明変数の列空間への正射影を表す。'
related: [leverage, least-squares-method, normal-equation, residual, residual-sum-of-squares]
formula: 'H = X(X^{\top}X)^{-1}X^{\top},\qquad \hat{\mathbf{y}} = H\mathbf{y},\qquad \mathbf{e} = (I - H)\mathbf{y}'
---
## 定義

最小二乗推定量 $\hat{\boldsymbol{\beta}} = (X^{\top}X)^{-1}X^{\top}\mathbf{y}$ を使うと、当てはめ値は

$$\hat{\mathbf{y}} = X\hat{\boldsymbol{\beta}} = X(X^{\top}X)^{-1}X^{\top}\mathbf{y} = H\mathbf{y}$$

となります。$\mathbf{y}$ に「ハット（^）をかぶせる」行列なので、$H$ をハット行列と呼びます。

## 性質

- 対称：$H^{\top} = H$。べき等：$H^2 = H$。つまり $X$ の列空間への正射影行列。
- $HX = X$：説明変数の列そのものは変わらない。
- $\mathrm{tr}(H) = \mathrm{rank}(X) = p + 1$（係数の数）。
- $I - H$ も対称でべき等で、残差は $\mathbf{e} = (I - H)\mathbf{y}$。$H(I - H) = O$ なので、当てはめ値と残差は直交する。
- 残差の分散共分散行列は $V[\mathbf{e}] = \sigma^2(I - H)$。
- 残差平方和は $\mathbf{y}^{\top}(I - H)\mathbf{y}$ で、$E[\mathbf{y}^{\top}(I - H)\mathbf{y}] = \sigma^2\,\mathrm{tr}(I - H) = (n - p - 1)\sigma^2$。ここから誤差分散の不偏推定量の分母が $n - p - 1$ になることが分かる。

## 対角成分（てこ比）

対角成分 $h_{ii}$ はてこ比と呼ばれ、$0 \leq h_{ii} \leq 1$、$\sum h_{ii} = p + 1$ です。外れた説明変数の値をもつ点の検出や、スチューデント化残差・クックの距離の計算に使います。

## 一般化

リッジ回帰の $X(X^{\top}X + \lambda I)^{-1}X^{\top}$ や平滑化スプラインのように、当てはめ値が $\mathbf{y}$ の 1 次式で書ける方法では、同じ形の行列（平滑化行列）のトレースを「有効自由度」として使います。

## 試験での問われ方

統計検定準1級・データサイエンスエキスパートでは、ハット行列の性質（対称・べき等、トレース）、残差の分散共分散行列、てこ比の性質が正誤問題や計算問題で問われます。1級では、対称でべき等であることの証明や、残差平方和の期待値の導出が記述式で問われます。

## よくある誤り

- $H = (X^{\top}X)^{-1}X^{\top}$ と、係数の推定に使う行列と混同する（$H$ は $n \times n$ 行列）。
- $\mathrm{tr}(H) = n$ とする（トレースは $X$ の階数 $p + 1$）。
- 残差が互いに独立で等分散だと考える（$V[\mathbf{e}] = \sigma^2(I - H)$ で、非対角成分は 0 でない）。
