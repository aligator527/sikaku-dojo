---
term: '二次形式'
reading: にじけいしき
en: 'quadratic form'
aliases: ['2次形式']
exams: [suken-1, toukei-dse, toukei-1, jdla-e]
summary: '変数の 2 次の項だけからなる多項式。対称行列 A を用いて xᵀAx と表され、直交変換で平方和の形（標準形）に直せる。'
related: [positive-definite-matrix, real-symmetric-matrix, eigenvalue, hessian-matrix, gradient]
formula: 'Q(\boldsymbol{x}) = \boldsymbol{x}^{\top}A\boldsymbol{x} = \sum_{i,j} a_{ij}x_i x_j \quad (A^{\top} = A)'
---
## 定義

$n$ 個の変数の 2 次の項だけからなる式を**二次形式**といいます。対称行列 $A$ を使って

$$Q(\boldsymbol{x}) = \boldsymbol{x}^{\top}A\boldsymbol{x} = \sum_{i,j} a_{ij}x_i x_j$$

と書けます。2 変数なら $ax^2 + 2bxy + cy^2 = \begin{pmatrix} x & y \end{pmatrix}\begin{pmatrix} a & b \\ b & c \end{pmatrix}\begin{pmatrix} x \\ y \end{pmatrix}$ で、交差項 $xy$ の係数の**半分**が非対角成分に入ります。対称でない行列 $B$ で書かれていても、$\frac{1}{2}(B + B^{\top})$ に置き換えれば同じ二次形式になります。

## 標準形

実対称行列は直交行列 $P$ で $P^{\top}AP = \operatorname{diag}(\lambda_1, \ldots, \lambda_n)$ と対角化できるので、$\boldsymbol{x} = P\boldsymbol{y}$ と変数変換すると

$$Q = \lambda_1 y_1^2 + \cdots + \lambda_n y_n^2$$

となります（標準形）。例えば $5x^2 + 4xy + 2y^2$ の行列 $\begin{pmatrix} 5 & 2 \\ 2 & 2 \end{pmatrix}$ の固有値は 6 と 1、固有ベクトルは $(2, 1)$ と $(1, -2)$ なので、$X = (2x + y)/\sqrt{5}$、$Y = (x - 2y)/\sqrt{5}$ とおくと $6X^2 + Y^2$ になります。よって $5x^2 + 4xy + 2y^2 = 1$ は楕円です。

正・負の固有値の個数は、どの正則な変数変換で標準形にしても変わりません（シルベスターの慣性法則）。

## 性質と応用

- 符号：固有値がすべて正なら正定値（$\boldsymbol{x} \ne \boldsymbol{0}$ で $Q > 0$）、正負が混じれば不定符号です。停留点の判定で、ヘッセ行列の二次形式としてこの分類を使います。
- 最大・最小：$\|\boldsymbol{x}\| = 1$ の下での $Q$ の最大値は最大固有値、最小値は最小固有値で、固有ベクトル方向で達成されます。上の例なら単位円上の最大値は 6 です。
- 微分：$\nabla(\boldsymbol{x}^{\top}A\boldsymbol{x}) = 2A\boldsymbol{x}$（$A$ が対称のとき）。
- 統計：$\boldsymbol{x} \sim N(\boldsymbol{\mu}, \Sigma)$ なら $E[\boldsymbol{x}^{\top}A\boldsymbol{x}] = \operatorname{tr}(A\Sigma) + \boldsymbol{\mu}^{\top}A\boldsymbol{\mu}$ です。$(\boldsymbol{x} - \boldsymbol{\mu})^{\top}\Sigma^{-1}(\boldsymbol{x} - \boldsymbol{\mu})$ は自由度 $p$ のカイ二乗分布に従います。

## 試験での問われ方

数検1級では、二次形式を直交変換で標準形に直し、条件 $\|\boldsymbol{x}\| = 1$ の下での最大・最小や曲線の形を答えさせる問題が典型です。統計検定データサイエンスエキスパートや1級では、分散共分散行列による二次形式（マハラノビス距離や残差平方和）の期待値・分布が問われます。

## よくある誤り

- $4xy$ の係数 4 を、そのまま非対角成分に入れる（正しくは 2 ずつ）。
- 標準形の係数を、もとの行列の対角成分と取り違える。係数は固有値です。
- 変数変換 $\boldsymbol{x} = P\boldsymbol{y}$ の $P$ を直交行列にしないまま、平方和の係数を固有値と考える。
