---
term: '条件付き期待値'
reading: じょうけんつききたいち
en: 'conditional expectation'
aliases: ['繰り返し期待値の法則', '全期待値の公式']
exams: [toukei-jun1, toukei-1, toukei-dse, suken-1]
summary: 'ある確率変数の値が与えられたという条件のもとでの、別の確率変数の期待値。条件の値の関数であり、条件を確率変数とみれば E[X | Y] 自体も確率変数になる。'
related: [conditional-probability, expected-value, law-of-total-variance, joint-distribution, multivariate-normal-distribution]
formula: 'E[X \mid Y = y] = \int x\, f(x \mid y)\,dx,\qquad E[X] = E\big[E[X \mid Y]\big]'
---
## 定義

$Y = y$ が与えられたときの $X$ の条件付き分布 $f(x \mid y) = f(x, y)/f_Y(y)$ による期待値を $E[X \mid Y = y]$ と書きます（離散型なら和）。これは $y$ の関数 $h(y)$ で、$y$ に確率変数 $Y$ を代入した $h(Y)$ を $E[X \mid Y]$ と表します。

## 主な性質

- **繰り返し期待値の法則（全期待値の公式）**：$E[X] = E[E[X \mid Y]]$。まず条件付きで平均し、次に条件について平均する。
- $Y$ の関数は定数のように外に出せる：$E[g(Y)X \mid Y] = g(Y)E[X \mid Y]$。
- $X$ と $Y$ が独立なら $E[X \mid Y] = E[X]$。
- 最良予測：$Y$ の関数 $h(Y)$ のうち、平均二乗誤差 $E[(X - h(Y))^2]$ を最小にするのは $h(Y) = E[X \mid Y]$。回帰関数とも呼ばれる。
- 分散については全分散の公式 $V[X] = E[V[X \mid Y]] + V[E[X \mid Y]]$ が成り立つ。

## 計算例

**ランダムな個数の和**：1 日の請求件数 $N \sim Po(\lambda)$、各請求額 $X_i$ が $N$ と独立に平均 $\mu$ の同じ分布に従うとき、総額 $S = X_1 + \cdots + X_N$ の期待値は $E[S \mid N] = N\mu$ から $E[S] = E[N\mu] = \lambda\mu$ です。

**2 変量正規分布**：$(X, Y)$ が相関係数 $\rho$ の 2 変量正規分布に従うとき

$$E[Y \mid X = x] = \mu_Y + \rho\frac{\sigma_Y}{\sigma_X}(x - \mu_X)$$

で、$x$ の 1 次式（回帰直線）になります。

## 試験での問われ方

統計検定準1級・1級では、条件付き密度から条件付き期待値を求める計算、繰り返し期待値の法則と全分散の公式を組み合わせた階層モデル（ポアソン・ガンマ、二項・ベータなど）の期待値と分散、2 変量正規分布の条件付き期待値が頻出です。十分統計量で条件付けて推定量を改良するラオ・ブラックウェルの定理の土台でもあります。

## よくある誤り

- $E[X \mid Y]$ を定数と考える。条件の値によって変わる確率変数です。
- $E[X \mid Y = y]$ の計算で、条件付き密度ではなく同時密度のまま積分する（$f_Y(y)$ で割り忘れる）。
- 条件付き期待値が $x$ の 1 次式になるのは正規分布などの特別な場合であることを忘れ、一般の分布にも回帰直線の式を当てはめる。
