---
term: '分散共分散行列'
reading: ぶんさんきょうぶんさんぎょうれつ
en: 'variance-covariance matrix'
aliases: ['共分散行列']
exams: [toukei-2, toukei-jun1, toukei-1, toukei-dse, jdla-e]
summary: '複数の変数について、対角成分に各変数の分散、非対角成分に 2 変数ずつの共分散を並べた対称行列。線形結合の分散や多変量解析の計算の基礎になる。'
related: [covariance, correlation-matrix, multivariate-normal-distribution, principal-component-analysis, positive-definite-matrix]
formula: '\Sigma = E\left[(\boldsymbol{X} - \boldsymbol{\mu})(\boldsymbol{X} - \boldsymbol{\mu})^\top\right],\qquad V[\boldsymbol{a}^\top\boldsymbol{X}] = \boldsymbol{a}^\top\Sigma\boldsymbol{a}'
---
## 定義

確率ベクトル $\boldsymbol{X} = (X_1, \ldots, X_p)^\top$ の分散共分散行列（共分散行列）は、$(i, j)$ 成分が $\mathrm{Cov}(X_i, X_j)$ の $p \times p$ 行列 $\Sigma$ です。対角成分 $\sigma_{ii}$ は $X_i$ の分散になります。データでは、標本の偏差積和を $n$（または $n-1$）で割った標本分散共分散行列を使います。

## 性質

- 対称：$\sigma_{ij} = \sigma_{ji}$。
- 半正定値：任意の $\boldsymbol{a}$ について $\boldsymbol{a}^\top\Sigma\boldsymbol{a} = V[\boldsymbol{a}^\top\boldsymbol{X}] \geq 0$。固有値はすべて 0 以上。
- 線形変換：$V[A\boldsymbol{X} + \boldsymbol{b}] = A\Sigma A^\top$。
- 対角成分の平方根を並べた $D = \mathrm{diag}(\sigma_1, \ldots, \sigma_p)$ で $R = D^{-1}\Sigma D^{-1}$ とすると相関行列になる。
- 変数どうしに完全な線形関係があると $\Sigma$ は正則でなくなる（$\det\Sigma = 0$）。

## 計算例

$V[X] = 4$、$V[Y] = 9$、$\mathrm{Cov}(X, Y) = 3$ のとき

$$\Sigma = \begin{pmatrix} 4 & 3 \\ 3 & 9 \end{pmatrix}$$

で、$\boldsymbol{a} = (2, -1)^\top$ とすれば $V[2X - Y] = \boldsymbol{a}^\top\Sigma\boldsymbol{a} = 4 \cdot 4 - 2 \cdot 2 \cdot 3 + 9 = 13$ です。成分ごとに $V[2X] + V[Y] - 2\,\mathrm{Cov}(2X, Y) = 16 + 9 - 12 = 13$ と計算しても同じになります。

## 使われる場面

- **主成分分析**：$\Sigma$（または相関行列）の固有ベクトルが主成分の方向、固有値が各主成分の分散。
- **重回帰分析**：最小二乗推定量の分散共分散行列は $\sigma^2(X^\top X)^{-1}$。
- **多変量正規分布**：密度や条件付き分布が $\Sigma$ とその逆行列で表される。
- **ポートフォリオ**：資産の組入れ比率 $\boldsymbol{w}$ に対する収益率の分散 $\boldsymbol{w}^\top\Sigma\boldsymbol{w}$。

## 試験での問われ方

統計検定2級では、分散共分散行列（や相関行列）の表から、和や差の分散・相関係数を読み取る問題が出題されます。準1級・1級・データサイエンスエキスパートでは、線形結合の分散、行列の半正定値性、主成分分析の固有値・寄与率、回帰係数の推定量の分散、多変量正規分布の条件付き分散が問われます。

## よくある誤り

- $V[\boldsymbol{a}^\top\boldsymbol{X}]$ の計算で、非対角成分を 1 回だけ数える（$2a_ia_j\sigma_{ij}$ となる）。
- 分散共分散行列と相関行列を取り違える。単位をそろえない変数どうしの主成分分析では、どちらを使うかで結果が変わる。
- 任意の対称行列が分散共分散行列になりうると考える（半正定値でなければならない）。
