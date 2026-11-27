---
term: '凸関数'
reading: とつかんすう
en: 'convex function'
aliases: ['凹関数', '狭義凸関数']
exams: [toukei-dse, toukei-1, jdla-e]
summary: 'グラフ上の任意の 2 点を結ぶ線分が、グラフより下にこない関数。局所最小解が大域最小解になるため、最適化で中心的な役割をもつ。'
related: [hessian-matrix, positive-definite-matrix, gradient-descent, lagrange-multiplier]
formula: 'f(t\boldsymbol{x} + (1-t)\boldsymbol{y}) \le t f(\boldsymbol{x}) + (1-t) f(\boldsymbol{y}) \quad (0 \le t \le 1)'
---
## 定義

凸集合上の関数 $f$ が、任意の $\boldsymbol{x}, \boldsymbol{y}$ と $0 \le t \le 1$ に対して

$$f(t\boldsymbol{x} + (1-t)\boldsymbol{y}) \le t f(\boldsymbol{x}) + (1-t) f(\boldsymbol{y})$$

を満たすとき、$f$ を**凸関数**といいます。$\boldsymbol{x} \ne \boldsymbol{y}$、$0 < t < 1$ で常に等号なしの不等号（$<$）が成り立つものを**狭義凸関数**、$-f$ が凸である $f$ を**凹関数**といいます。

## 判定法

- 1 変数で 2 回微分可能なら、$f''(x) \ge 0$ がつねに成り立つことと凸であることは同値です。
- 多変数で 2 回微分可能なら、ヘッセ行列がすべての点で半正定値であることと同値です。すべての点で正定値なら狭義凸です。
- 微分可能なら、接平面が常にグラフの下にあること $f(\boldsymbol{y}) \ge f(\boldsymbol{x}) + \nabla f(\boldsymbol{x})^{\top}(\boldsymbol{y} - \boldsymbol{x})$ とも同値です。

例として $x^2$、$e^x$、$-\log x$、$|x|$、ノルム $\|\boldsymbol{x}\|$、二乗誤差 $\|\boldsymbol{y} - X\boldsymbol{\beta}\|^2$ は凸です。ロジスティック回帰の負の対数尤度も凸なので、ニュートン法などで大域最小解が求まります。凸関数の和や、正の定数倍も凸です。

## 最適化での意味

凸関数では、勾配が $\boldsymbol{0}$ になる点（停留点）はすべて大域最小点です。狭義凸なら最小点はあっても 1 つだけです。一方、ニューラルネットワークの損失のような非凸関数では、局所最小点や鞍点で止まる可能性があります。なお凸関数に関する不等式 $f(E[X]) \le E[f(X)]$（イェンセンの不等式）は、確率・統計の多くの証明で使われます。

## 試験での問われ方

統計検定データサイエンスエキスパートでは、与えられた関数のうち凸なものを選ぶ、ヘッセ行列の固有値から凸性を判定する、凸なら局所解が大域解になることを使う問題が出ます。統計検定1級では、対数尤度が凹であることから最尤推定量の一意性を示す議論に現れます。

## よくある誤り

- 「凸関数」の向きを逆に覚える。グラフが下に膨らむ（お椀型）のが凸関数です。
- 2 変数関数の凸性を、$f_{xx} \ge 0$ と $f_{yy} \ge 0$ だけで判定する。交差項を含むヘッセ行列全体が半正定値かを調べる必要があります。
- 狭義凸でない凸関数でも最小点は 1 つだと思い込む。$f(x, y) = x^2$ のように最小点が無数にある場合があります。
