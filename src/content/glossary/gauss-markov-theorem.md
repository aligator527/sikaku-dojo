---
term: 'ガウス・マルコフの定理'
reading: がうす・まるこふのていり
en: 'Gauss-Markov theorem'
aliases: ['最良線形不偏推定量', 'BLUE']
exams: [toukei-jun1, toukei-1]
summary: '線形回帰モデルで誤差の期待値が 0、分散が等しく互いに無相関なら、最小二乗推定量は線形不偏推定量の中で分散が最小（最良線形不偏推定量）になるという定理。'
related: [least-squares-method, unbiased-estimator, regression-coefficient, regression-analysis]
formula: 'V[\tilde{\boldsymbol{\beta}}] - V[\hat{\boldsymbol{\beta}}] \succeq O,\qquad V[\hat{\boldsymbol{\beta}}] = \sigma^2 (X^{\top}X)^{-1}'
---
## 内容

線形モデル $\mathbf{y} = X\boldsymbol{\beta} + \boldsymbol{\varepsilon}$ で

- $E[\boldsymbol{\varepsilon}] = \mathbf{0}$
- $V[\boldsymbol{\varepsilon}] = \sigma^2 I$（等分散・無相関）
- $X$ は列フルランクの定数行列

を仮定します。このとき最小二乗推定量 $\hat{\boldsymbol{\beta}} = (X^{\top}X)^{-1}X^{\top}\mathbf{y}$ は、$\mathbf{y}$ の 1 次式で表される不偏推定量 $\tilde{\boldsymbol{\beta}} = C\mathbf{y}$ の中で分散共分散行列が最小になります。つまり、$V[\tilde{\boldsymbol{\beta}}] - V[\hat{\boldsymbol{\beta}}]$ は半正定値で、任意の係数の 1 次結合 $\mathbf{c}^{\top}\boldsymbol{\beta}$ についても最小二乗推定量の分散が最小です。このような推定量を最良線形不偏推定量（BLUE）といいます。

## 証明の考え方

不偏な線形推定量を $C\mathbf{y}$、$C = (X^{\top}X)^{-1}X^{\top} + D$ と書くと、不偏性から $DX = O$ が必要です。すると

$$V[C\mathbf{y}] = \sigma^2 CC^{\top} = \sigma^2 (X^{\top}X)^{-1} + \sigma^2 DD^{\top}$$

となり、$DD^{\top}$ は半正定値なので、$D = O$（最小二乗推定量）のとき分散が最小になります。

## 仮定と結論の範囲

- 誤差の正規性は不要。必要なのは 2 次までのモーメントの条件だけ。
- 比べる相手は「線形」かつ「不偏」な推定量に限られる。リッジ回帰のような偏りのある推定量や、非線形な推定量の方が平均二乗誤差は小さいことがある。
- 誤差が正規分布なら、最小二乗推定量は線形に限らずすべての不偏推定量の中で分散最小（UMVUE）になる。
- 不均一分散や系列相関があり $V[\boldsymbol{\varepsilon}] = \sigma^2\Omega$ のときは、最小二乗推定量は不偏のままだが BLUE ではなくなる。代わりに一般化最小二乗推定量 $(X^{\top}\Omega^{-1}X)^{-1}X^{\top}\Omega^{-1}\mathbf{y}$ が BLUE になる（エイトケンの定理）。

## 試験での問われ方

統計検定準1級・1級では、定理の仮定（特に正規性が不要なこと、等分散・無相関が必要なこと）の正誤問題、行列による証明、不均一分散のもとでの加重最小二乗法との比較が問われます。

## よくある誤り

- ガウス・マルコフの定理には誤差の正規性が必要だと考える。
- 「最小二乗推定量は全ての推定量の中で最良」と考える（比べているのは線形不偏推定量だけ）。
- 不均一分散があると最小二乗推定量が不偏でなくなると考える（不偏性は保たれ、失われるのは最良性と通常の標準誤差の正しさ）。
