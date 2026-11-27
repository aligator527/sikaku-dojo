---
term: '分布関数'
reading: ぶんぷかんすう
en: 'cumulative distribution function'
aliases: ['累積分布関数']
exams: [toukei-2, toukei-jun1, toukei-1, toukei-dse, suken-1]
summary: '確率変数がある値 x 以下になる確率 P(X ≤ x) を x の関数として表したもの。離散型でも連続型でも定義でき、分布を完全に決める。'
related: [probability-density-function, random-variable, order-statistic, change-of-variables, uniform-distribution]
formula: 'F(x) = P(X \leq x),\qquad P(a < X \leq b) = F(b) - F(a)'
---
## 定義と性質

$F(x) = P(X \leq x)$ を $X$ の分布関数（累積分布関数）といいます。

- 単調非減少で、$x \to -\infty$ で 0、$x \to \infty$ で 1 に近づく。右連続。
- $P(a < X \leq b) = F(b) - F(a)$、$P(X > x) = 1 - F(x)$。
- 離散型では、とりうる値で跳ね上がる階段状の関数になり、跳びの大きさがその値の確率。
- 連続型では連続な関数で、微分すると密度関数：$F'(x) = f(x)$。

## 分布関数を使う場面

**変数変換（分布関数法）**：$Y = X^2$（$X \sim N(0, 1)$）なら、$y > 0$ で $F_Y(y) = P(-\sqrt{y} \leq X \leq \sqrt{y}) = 2\Phi(\sqrt{y}) - 1$。これを微分すると自由度 1 のカイ二乗分布の密度が得られます。単調でない変換でも使えるのが利点です。

**最大値・最小値**：$X_1, \ldots, X_n$ が独立に分布関数 $F$ に従うとき

$$P(\max X_i \leq x) = F(x)^n,\qquad P(\min X_i > x) = \{1 - F(x)\}^n$$

です。

**確率積分変換**：$X$ が連続な分布関数 $F$ に従うなら $F(X) \sim U(0, 1)$。逆に $U \sim U(0, 1)$ なら $F^{-1}(U)$ は分布関数 $F$ に従うので、一様乱数から任意の分布の乱数を作れます（逆関数法）。例：$-\log(1 - U)/\lambda$ は平均 $1/\lambda$ の指数分布に従う。

## 試験での問われ方

統計検定2級では、分布関数のグラフや式から確率を読み取る問題、累積相対度数（データ版の分布関数）の読み取りが出題されます。準1級・1級では、分布関数法による変数変換、順序統計量の分布、逆関数法による乱数生成、経験分布関数とコルモゴロフ・スミルノフ検定が問われます。

## よくある誤り

- 離散型で $P(X < x)$ と $P(X \leq x)$ を区別しない（跳びのある点で値が違う）。
- $P(\min X_i \leq x) = F(x)^n$ とする。最小値は余事象 $\{1 - F(x)\}^n$ を経由して求める。
- 単調でない変換 $Y = X^2$ で、$x = -\sqrt{y}$ 側の寄与を落とす。
