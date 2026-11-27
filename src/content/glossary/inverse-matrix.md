---
term: '逆行列'
reading: ぎゃくぎょうれつ
en: 'inverse matrix'
aliases: ['正則行列']
exams: [suken-1, toukei-dse, jdla-e, toukei-1, toukei-jun1]
summary: '正方行列 A に対して AX = XA = I を満たす行列 X。行列式が 0 でないときに限り存在し、A⁻¹ と書く。逆行列をもつ行列を正則行列という。'
related: [determinant, cofactor-matrix, matrix-rank, generalized-inverse]
formula: 'A^{-1} = \frac{1}{\det A}\,\operatorname{adj}A,\qquad \begin{pmatrix} a & b \\ c & d \end{pmatrix}^{-1} = \frac{1}{ad - bc}\begin{pmatrix} d & -b \\ -c & a \end{pmatrix}'
---
## 定義

$n$ 次正方行列 $A$ に対して $AX = XA = I$ を満たす $X$ が存在するとき、$X$ を**逆行列**といい $A^{-1}$ と書きます。逆行列をもつ行列を**正則行列**といいます。次の条件はすべて同値です。

- $A$ が正則
- $\det A \ne 0$
- $\operatorname{rank}A = n$
- $A\boldsymbol{x} = \boldsymbol{0}$ の解は $\boldsymbol{x} = \boldsymbol{0}$ だけ
- 固有値に 0 がない

## 求め方

- 2 次：$\begin{pmatrix} a & b \\ c & d \end{pmatrix}^{-1} = \dfrac{1}{ad - bc}\begin{pmatrix} d & -b \\ -c & a \end{pmatrix}$。例えば $\begin{pmatrix} 2 & 1 \\ 5 & 3 \end{pmatrix}^{-1} = \begin{pmatrix} 3 & -1 \\ -5 & 2 \end{pmatrix}$（行列式が 1）です。
- 余因子行列：$A^{-1} = \dfrac{1}{\det A}\operatorname{adj}A$。理論的には便利ですが、3 次以上の数値計算には向きません。
- 掃き出し法：$[A \mid I]$ に行基本変形を施して $[I \mid A^{-1}]$ にします。
- ケーリー・ハミルトンの定理：2 次なら $A^2 - (\operatorname{tr}A)A + (\det A)I = O$ から $A^{-1} = \dfrac{(\operatorname{tr}A)I - A}{\det A}$。

## 性質

- $(AB)^{-1} = B^{-1}A^{-1}$（順序が逆になる）、$(A^{\top})^{-1} = (A^{-1})^{\top}$、$\det(A^{-1}) = 1/\det A$
- $A$ の固有値が $\lambda$ なら $A^{-1}$ の固有値は $1/\lambda$（固有ベクトルは同じ）
- 対称な正定値行列の逆行列も対称な正定値行列

## 統計・機械学習での役割

最小二乗推定量 $\hat{\boldsymbol{\beta}} = (X^{\top}X)^{-1}X^{\top}\boldsymbol{y}$、多変量正規分布の密度に現れる $\Sigma^{-1}$（精度行列）、推定量の分散共分散行列（フィッシャー情報行列の逆行列）など、逆行列はいたるところに出ます。ただし数値計算では、逆行列を明示的に求めるより連立方程式を解く（LU 分解やコレスキー分解）ほうが速く安定です。正則でない、または正則に近い（条件数が大きい）ときは一般逆行列や正則化（リッジ）を使います。

## 試験での問われ方

数検1級では、余因子行列や掃き出し法で 3 次の逆行列を求める計算、文字を含む行列が正則になる条件が出ます。統計検定データサイエンスエキスパートでは、2 次の逆行列の計算、$(X^{\top}X)^{-1}$ が存在する条件、精度行列の解釈が問われます。E資格のシラバス 2026 では、線形代数は前提知識（グレー網掛けで出題対象外）です。

## よくある誤り

- $(AB)^{-1} = A^{-1}B^{-1}$ と順序を入れ替えずに書く。
- 2 次の逆行列で、対角成分を入れ替えずに符号だけ変える、または非対角成分の符号を変え忘れる。
- 行列式の値で割り忘れる。
