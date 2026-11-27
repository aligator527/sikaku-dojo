---
term: 正定値行列
reading: せいていちぎょうれつ
en: positive definite matrix
aliases: [正定値, 半正定値行列]
exams: [suken-1, jdla-e, toukei-dse]
summary: 零でない任意のベクトル x に対して二次形式 xᵀAx が正になる実対称行列。固有値がすべて正であることと同値。
related: [eigenvalue, hessian-matrix, singular-value-decomposition, quadratic-form]
formula: '\boldsymbol{x}^{\mathsf T} A \boldsymbol{x} > 0 \quad (\forall\, \boldsymbol{x} \neq \boldsymbol{0})'
---
## 定義

実対称行列 $A$ が、零でない任意のベクトル $\boldsymbol x$ に対して $\boldsymbol x^{\mathsf T}A\boldsymbol x > 0$ を満たすとき**正定値**といいます。$\ge 0$ なら半正定値、$< 0$ なら負定値です。

## 判定法

次はいずれも同値です（$A$ は実対称）。

- 固有値がすべて正。
- 首座小行列式（左上の $k \times k$ 部分の行列式）がすべて正（シルベスターの判定法）。
- $A = B^{\mathsf T}B$（$B$ は正則）と書ける。コレスキー分解 $A = LL^{\mathsf T}$ ができる。

## 現れる場面

- **極値判定**：停留点でヘッセ行列が正定値なら極小、負定値なら極大、正負の固有値が混在すれば鞍点。
- **二次形式の標準形**：直交変換で $\sum \lambda_i y_i^2$ の形にでき、正定値なら楕円（楕円体）になります。
- **確率・統計**：分散共分散行列は半正定値です。多変量正規分布では正定値であることが必要です。
- **最適化**：目的関数のヘッセ行列が至るところ正定値なら狭義凸関数で、極小点は大域的最小点になります。

## 試験での問われ方

数検1級では二次形式の最大・最小や標準形、条件付き極値で現れます。E資格のシラバス 2026 では線形代数は前提知識（グレー網掛けで出題対象外）ですが、出題対象の最適化で、損失関数の曲率（ヘッセ行列）と最適化の難しさ（Pathological Curvature・鞍点）を理解する土台になります。

## よくある誤り

- 対角成分がすべて正でも正定値とは限らない（例：$\begin{pmatrix}1&2\\2&1\end{pmatrix}$ の固有値は $3, -1$）。
- 首座小行列式による判定は正定値の判定であり、半正定値の判定には主小行列式をすべて調べる必要がある。
