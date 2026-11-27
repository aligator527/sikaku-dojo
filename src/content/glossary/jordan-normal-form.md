---
term: 'ジョルダン標準形'
reading: じょるだんひょうじゅんけい
en: 'Jordan normal form'
aliases: ['ジョルダン細胞', 'ジョルダンブロック']
exams: [suken-1]
summary: '対角化できない行列も含め、任意の複素正方行列を相似変換で変形できる、ジョルダン細胞を対角に並べたブロック対角行列。'
related: [diagonalization, eigenspace, eigenvalue, characteristic-equation]
formula: 'J_k(\lambda) = \begin{pmatrix} \lambda & 1 & & \\ & \lambda & \ddots & \\ & & \ddots & 1 \\ & & & \lambda \end{pmatrix},\qquad P^{-1}AP = \operatorname{diag}(J_{k_1}(\lambda_1), \ldots, J_{k_s}(\lambda_s))'
---
## 定義

対角成分が $\lambda$、そのすぐ上がすべて 1、他が 0 の $k$ 次正方行列 $J_k(\lambda)$ を**ジョルダン細胞**（ジョルダンブロック）といいます。どんな複素正方行列 $A$ も、正則行列 $P$ を選んでジョルダン細胞を対角に並べた形

$$P^{-1}AP = \operatorname{diag}(J_{k_1}(\lambda_1), \ldots, J_{k_s}(\lambda_s))$$

にでき、これを**ジョルダン標準形**といいます。細胞の並べ方を除いて一意に決まります。すべての細胞が 1 次なら、対角化できる場合にあたります。

## 細胞の決め方

各固有値 $\lambda$ について、

- 細胞の個数 $= \dim\ker(A - \lambda I)$（幾何的重複度）
- 細胞の次数の合計 $=$ 代数的重複度
- 最大の細胞の次数 $=$ 最小多項式における $(x - \lambda)$ の指数
- 次数 $k$ 以上の細胞の個数 $= \dim\ker(A - \lambda I)^k - \dim\ker(A - \lambda I)^{k-1}$

です。3 次以下の行列なら、最初の 2 つだけで決まります。

## べき乗と指数関数

$J_k(\lambda) = \lambda I + N$ と分けると、$N$ は $N^k = O$ となる冪零行列で $\lambda I$ と可換なので、二項定理が使えます。

$$J_2(\lambda)^n = \begin{pmatrix} \lambda^n & n\lambda^{n-1} \\ 0 & \lambda^n \end{pmatrix},\qquad e^{tJ_2(\lambda)} = e^{\lambda t}\begin{pmatrix} 1 & t \\ 0 & 1 \end{pmatrix}$$

これにより、対角化できない行列の $A^n$ や $e^{tA}$ も計算でき、重根をもつ連立線形微分方程式に $te^{\lambda t}$ の項が現れる理由が分かります。

## 試験での問われ方

数検1級では、重複固有値をもつ 3 次行列のジョルダン標準形と変換行列 $P$ を求める問題、冪零行列の性質（固有値はすべて 0、$N^n = O$）を示す問題、$A^n$ を求める問題が出ます。

## よくある誤り

- 細胞の個数を代数的重複度で数える。個数は固有空間の次元（幾何的重複度）です。
- 変換行列 $P$ の列に、固有ベクトルだけを並べようとする。対角化できない部分では $(A - \lambda I)\boldsymbol{p}_2 = \boldsymbol{p}_1$ を満たす一般化固有ベクトルが必要です。
- $J_2(\lambda)^n$ の $(1, 2)$ 成分を $\lambda^{n-1}$ や $n\lambda^n$ とする。
