---
term: '変数分離形'
reading: へんすうぶんりけい
en: 'separable differential equation'
aliases: ['変数分離型', '変数分離法']
exams: [suken-1]
summary: 'dy/dx = f(x)g(y) の形の 1 階微分方程式。y を含む部分と x を含む部分を左右に分けて、それぞれ積分すれば解ける。'
related: [second-order-linear-differential-equation, integration-by-substitution, partial-fraction-decomposition]
formula: '\frac{dy}{dx} = f(x)\,g(y) \implies \int\frac{dy}{g(y)} = \int f(x)\,dx + C'
---
## 解き方

$\dfrac{dy}{dx} = f(x)g(y)$ の形の方程式を**変数分離形**といいます。$g(y) \ne 0$ のとき両辺を $g(y)$ で割って

$$\int\frac{dy}{g(y)} = \int f(x)\,dx + C$$

とし、積分してから $y$ について解きます。$g(y_0) = 0$ となる $y_0$ があれば、定数関数 $y = y_0$ も解です。割り算で失われやすいので、別に確かめる必要があります。

## 計算例

- $\dfrac{dy}{dx} = xy$：$\log|y| = \dfrac{x^2}{2} + C$ より $y = Ce^{x^2/2}$。$y = 0$ も解で、$C = 0$ として含められます。
- ニュートンの冷却法則 $\dfrac{dT}{dt} = -k(T - T_a)$：$T = T_a + (T_0 - T_a)e^{-kt}$。物体の温度は周囲の温度 $T_a$ に指数関数的に近づきます。
- ロジスティック方程式 $\dfrac{dN}{dt} = rN\left(1 - \dfrac{N}{K}\right)$：部分分数分解 $\dfrac{1}{N(1 - N/K)} = \dfrac{1}{N} + \dfrac{1}{K - N}$ を使って積分すると

$$N(t) = \frac{K}{1 + \dfrac{K - N_0}{N_0}e^{-rt}}$$

となり、$t \to \infty$ で環境収容力 $K$ に近づきます。

## 変数分離形に帰着できる型

- **同次形** $\dfrac{dy}{dx} = F\!\left(\dfrac{y}{x}\right)$：$u = y/x$ と置くと $x\dfrac{du}{dx} = F(u) - u$ で変数分離形になります。
- $\dfrac{dy}{dx} = F(ax + by + c)$：$u = ax + by + c$ と置きます。
- 1 階線形 $y' + P(x)y = Q(x)$：まず $Q = 0$ の場合を変数分離で解き、その定数 $C$ を関数 $C(x)$ に置き換える（定数変化法）か、積分因子 $e^{\int P\,dx}$ を掛けて解きます。ベルヌーイの微分方程式 $y' + Py = Qy^n$ は $u = y^{1-n}$ でこの形になります。

## 試験での問われ方

数検1級では、変数分離形や同次形の一般解・初期値問題の解を求める計算問題、冷却・人口増加・化学反応・落下運動などの現象を微分方程式で表して解く応用問題が出ます。

## よくある誤り

- $g(y) = 0$ となる定数解を落とす。
- $\int\frac{dy}{y} = \log|y|$ の絶対値を外すときに、$\pm e^C$ をまとめた任意定数の扱いを誤り、符号の情報を失う。
- 初期値問題で任意定数を決めたあと、解が存在する区間を確かめ忘れる。$y' = y^2,\ y(0) = 1$ の解 $y = \frac{1}{1 - x}$ は $x < 1$ でしか定義されません。
