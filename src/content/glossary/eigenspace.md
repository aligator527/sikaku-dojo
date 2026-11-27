---
term: '固有空間'
reading: こゆうくうかん
en: 'eigenspace'
aliases: ['幾何的重複度', '代数的重複度']
exams: [suken-1]
summary: '固有値 λ に属する固有ベクトル全体に零ベクトルを加えた部分空間 ker(A − λI)。その次元（幾何的重複度）で対角化の可否が決まる。'
related: [eigenvalue, diagonalization, matrix-rank, characteristic-equation]
formula: 'V(\lambda) = \ker(A - \lambda I),\qquad \dim V(\lambda) = n - \operatorname{rank}(A - \lambda I)'
---
## 定義

$n$ 次正方行列 $A$ の固有値 $\lambda$ に対して、

$$V(\lambda) = \{\boldsymbol{x} \mid A\boldsymbol{x} = \lambda\boldsymbol{x}\} = \ker(A - \lambda I)$$

を $\lambda$ の**固有空間**といいます。固有ベクトル全体に零ベクトルを加えたもので、部分空間になります。次元定理から $\dim V(\lambda) = n - \operatorname{rank}(A - \lambda I)$ です。

## 2 つの重複度

- **代数的重複度**：特性方程式 $\det(\lambda I - A) = 0$ の根としての $\lambda$ の重複度
- **幾何的重複度**：固有空間の次元 $\dim V(\lambda)$

つねに $1 \le$ 幾何的重複度 $\le$ 代数的重複度 が成り立ちます。$A$ が対角化可能であることは、すべての固有値で両者が等しいこと（固有空間の次元の和が $n$ になること）と同値です。

## 計算例

$A = \begin{pmatrix} 2 & 1 & 0 \\ 0 & 2 & 0 \\ 0 & 0 & 3 \end{pmatrix}$ の固有値は 2（代数的重複度 2）と 3 です。$A - 2I = \begin{pmatrix} 0 & 1 & 0 \\ 0 & 0 & 0 \\ 0 & 0 & 1 \end{pmatrix}$ の階数は 2 なので $\dim V(2) = 1$ で、幾何的重複度が代数的重複度より小さく、$A$ は対角化できません。一方、$\operatorname{diag}(2, 2, 3)$ なら $\dim V(2) = 2$ で対角化できます。

## 性質

- 異なる固有値の固有空間の和は直和になる（異なる固有値に属する固有ベクトルは一次独立）。
- 実対称行列では、異なる固有値の固有空間は互いに直交します。
- 幾何的重複度は、ジョルダン標準形におけるその固有値のジョルダン細胞の個数に等しくなります。

## 試験での問われ方

数検1級では、重複固有値をもつ行列で固有空間の次元を調べて対角化できるかを判定する問題、固有空間の基底を求める問題、ジョルダン標準形を決める前段階としての計算が出ます。

## よくある誤り

- 固有空間を「固有ベクトル全体」と述べ、零ベクトルを含めないまま部分空間と呼ぶ。
- 重複固有値があれば必ず対角化できない、あるいは必ずできると決めつける。$\operatorname{rank}(A - \lambda I)$ を計算して確かめます。
- $\dim V(\lambda)$ を $\operatorname{rank}(A - \lambda I)$ そのものと取り違える。
