---
term: '余因子行列'
reading: よいんしぎょうれつ
en: 'adjugate matrix'
aliases: ['余因子展開', '余因子']
exams: [suken-1, jdla-e, toukei-dse, toukei-1]
summary: '各成分の余因子を並べて転置した行列 adj A。A·adj A = (det A) I を満たし、逆行列の公式 A⁻¹ = adj A / det A を与える。'
related: [determinant, inverse-matrix, cayley-hamilton-theorem]
formula: '\Delta_{ij} = (-1)^{i+j}M_{ij},\qquad (\operatorname{adj}A)_{ij} = \Delta_{ji},\qquad A\,\operatorname{adj}A = (\det A)\,I'
---
## 定義

$n$ 次正方行列 $A$ から第 $i$ 行と第 $j$ 列を取り除いた $n-1$ 次の行列式を小行列式 $M_{ij}$ とし、$\Delta_{ij} = (-1)^{i+j}M_{ij}$ を $(i, j)$ **余因子**といいます。余因子を並べた行列を**転置**したもの

$$\operatorname{adj}A = (\Delta_{ji})$$

を**余因子行列**といいます（随伴行列と呼ぶ本もありますが、複素共役転置を指すこともあるので注意）。2 次なら $\operatorname{adj}\begin{pmatrix} a & b \\ c & d \end{pmatrix} = \begin{pmatrix} d & -b \\ -c & a \end{pmatrix}$ です。

## 余因子展開

行列式は、任意の行（列）について

$$\det A = \sum_{j=1}^n a_{ij}\Delta_{ij}\quad(\text{第 } i \text{ 行で展開})$$

と計算できます。0 の多い行・列を選ぶと計算が楽になります。一方、ある行の成分と**別の**行の余因子を掛けて足すと 0 になります。この 2 つをまとめたものが $A\,\operatorname{adj}A = \operatorname{adj}A\,A = (\det A)I$ です。

## 性質

- $\det A \ne 0$ なら $A^{-1} = \dfrac{1}{\det A}\operatorname{adj}A$
- $\det(\operatorname{adj}A) = (\det A)^{n-1}$
- $\operatorname{adj}(AB) = \operatorname{adj}B\,\operatorname{adj}A$
- クラメルの公式 $x_i = \det A_i/\det A$（$A_i$ は第 $i$ 列を $\boldsymbol{b}$ に置き換えた行列）も、$\boldsymbol{x} = A^{-1}\boldsymbol{b}$ を余因子で書いたものです。

## 計算例

$A = \begin{pmatrix} 1 & 2 & 0 \\ 3 & 1 & 4 \\ 0 & 2 & 5 \end{pmatrix}$ では、$\Delta_{11} = 1\cdot 5 - 4\cdot 2 = -3$、$\Delta_{12} = -(3\cdot 5 - 4\cdot 0) = -15$、$\Delta_{13} = 3\cdot 2 - 1\cdot 0 = 6$ なので、第 1 行で展開して $\det A = 1\cdot(-3) + 2\cdot(-15) + 0\cdot 6 = -33$ です。

## 試験での問われ方

数検1級では、余因子行列を使って 3 次の逆行列を求める、$\det(\operatorname{adj}A) = (\det A)^{n-1}$ などの性質を証明する問題が出ます。統計検定では、行列式の余因子展開の計算や、分散共分散行列の逆行列の成分を余因子で表す場面で使います。E資格のシラバス 2026 では、線形代数は前提知識（グレー網掛けで出題対象外）です。

## よくある誤り

- 余因子を並べたまま転置し忘れる（$(i, j)$ 成分には $\Delta_{ji}$ が入ります）。
- 符号 $(-1)^{i+j}$ を忘れる、または市松模様の符号をずらす。
- $\det(\operatorname{adj}A) = \det A$ とする。正しくは $(\det A)^{n-1}$ です。
