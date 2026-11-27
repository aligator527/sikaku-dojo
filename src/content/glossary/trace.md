---
term: 'トレース'
reading: とれーす
en: 'trace'
exams: [suken-1, toukei-dse, toukei-jun1, toukei-1, jdla-e]
summary: '正方行列の対角成分の和 tr A。固有値の和に等しく、tr(AB) = tr(BA) という巡回性をもつ。'
related: [eigenvalue, determinant, projection-matrix, characteristic-equation]
formula: '\operatorname{tr}A = \sum_{i=1}^n a_{ii} = \sum_{i=1}^n \lambda_i,\qquad \operatorname{tr}(AB) = \operatorname{tr}(BA)'
---
## 定義と性質

$n$ 次正方行列 $A$ の対角成分の和を**トレース**といい、$\operatorname{tr}A$ と書きます。

- 線形性：$\operatorname{tr}(A + B) = \operatorname{tr}A + \operatorname{tr}B$、$\operatorname{tr}(cA) = c\operatorname{tr}A$
- $\operatorname{tr}(A^{\top}) = \operatorname{tr}A$
- 巡回性：$\operatorname{tr}(AB) = \operatorname{tr}(BA)$。$A$ が $m \times n$、$B$ が $n \times m$ でも成り立ちます。3 つ以上なら $\operatorname{tr}(ABC) = \operatorname{tr}(BCA) = \operatorname{tr}(CAB)$（順序を任意に入れ替えてよいわけではない）。
- 相似な行列のトレースは等しい：$\operatorname{tr}(P^{-1}AP) = \operatorname{tr}A$
- 固有値（重複を含む）の和に等しい：$\operatorname{tr}A = \sum \lambda_i$。行列式は固有値の積です。

2 次正方行列の固有多項式は $\lambda^2 - (\operatorname{tr}A)\lambda + \det A$ なので、トレースと行列式から固有値が求まります。

## 統計・機械学習での使い方

- スカラーをトレースで書く：$\boldsymbol{x}^{\top}A\boldsymbol{x} = \operatorname{tr}(A\boldsymbol{x}\boldsymbol{x}^{\top})$。これと期待値の線形性から $E[\boldsymbol{x}^{\top}A\boldsymbol{x}] = \operatorname{tr}(A\Sigma) + \boldsymbol{\mu}^{\top}A\boldsymbol{\mu}$ が導けます。
- 射影行列 $P$ では $\operatorname{tr}P = \operatorname{rank}P$。回帰のハット行列のトレースはパラメータ数 $p$ で、残差の自由度 $n - p$ の根拠になります。リッジ回帰などでは $\operatorname{tr}$ を「有効自由度」として使います。
- 主成分分析：分散共分散行列のトレースは各変数の分散の和で、固有値の和（全主成分の分散の和）に等しくなります。寄与率の分母です。
- フロベニウスノルム：$\|A\|_F^2 = \operatorname{tr}(A^{\top}A)$
- 行列微分：$\dfrac{\partial}{\partial X}\operatorname{tr}(AX) = A^{\top}$

## 試験での問われ方

数検1級では、トレースと行列式から固有値を求める、$\operatorname{tr}(AB) = \operatorname{tr}(BA)$ を使った証明（$AB - BA = I$ となる行列は存在しない、など）が出ます。統計検定データサイエンスエキスパート・準1級・1級では、ハット行列のトレース、主成分の寄与率、二次形式の期待値の計算に使います。

## よくある誤り

- $\operatorname{tr}(AB) = \operatorname{tr}A\cdot\operatorname{tr}B$ とする。積については成り立ちません。
- $\operatorname{tr}(ABC) = \operatorname{tr}(BAC)$ のように、巡回でない入れ替えをする。
- 相関行列で主成分分析をしたとき、トレース（固有値の和）が変数の個数になることを忘れる。
