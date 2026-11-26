---
term: 固有値
reading: こゆうち
en: eigenvalue
aliases: [固有ベクトル, 固有方程式, 特性方程式]
exams: [suken-1, jdla-e, toukei-jun1, toukei-1]
summary: 正方行列 A に対して Ax = λx を満たす零でないベクトル x が存在するときのスカラー λ。x を固有ベクトルという。
related: [determinant, singular-value-decomposition, positive-definite-matrix, hessian-matrix]
formula: 'A\boldsymbol{x} = \lambda\boldsymbol{x}\ (\boldsymbol{x} \neq \boldsymbol{0}) \iff \det(A - \lambda I) = 0'
---
## 定義

$n$ 次正方行列 $A$ に対して、$A\boldsymbol x = \lambda\boldsymbol x$ を満たす零でないベクトル $\boldsymbol x$ が存在するとき、$\lambda$ を $A$ の**固有値**、$\boldsymbol x$ を $\lambda$ に属する**固有ベクトル**といいます。$(A - \lambda I)\boldsymbol x = \boldsymbol 0$ が非自明な解を持つ条件から、固有値は**固有方程式** $\det(A - \lambda I) = 0$ の解として求まります。

## 直感的な意味

行列を線形変換と見たとき、固有ベクトルは「向きを変えずに $\lambda$ 倍に伸び縮みするだけの方向」です。対角化 $A = PDP^{-1}$ ができれば、$A^n = PD^nP^{-1}$ のように行列のべき乗や指数関数が固有値のべき乗に帰着します。

## 重要な性質

- 固有値の和はトレース、積は行列式に等しい：$\sum \lambda_i = \operatorname{tr}A$、$\prod \lambda_i = \det A$。
- 実対称行列の固有値はすべて実数で、異なる固有値の固有ベクトルは直交する。直交行列で対角化できる。
- $A^k$ の固有値は $\lambda^k$、$A^{-1}$ の固有値は $1/\lambda$、$A + cI$ の固有値は $\lambda + c$。

## 試験での問われ方

- **数検1級**：固有値・固有ベクトルの計算、対角化、$A^n$ の計算、二次形式の標準形、実対称行列の性質の証明。
- **E資格**：主成分分析（分散共分散行列の固有値分解）、寄与率、ヘッセ行列の固有値による停留点の判定。
- **統計検定**：主成分分析・多変量正規分布の分散共分散行列。

## よくある誤り

- 重複固有値に属する固有ベクトルが重複度の数だけ取れるとは限らない（対角化できない場合がある）。
- 固有ベクトルは定数倍の自由度があるので、正規化（長さ 1）の指定があるかを確認する。
