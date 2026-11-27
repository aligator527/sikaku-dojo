---
term: '広義積分'
reading: こうぎせきぶん
en: 'improper integral'
aliases: ['広義重積分']
exams: [suken-1]
summary: '積分区間が無限に広がる場合や、被積分関数が区間内で有界でない場合に、通常の定積分の極限として定める積分。'
related: [gamma-function, beta-function, residue-theorem, gaussian-integral]
formula: '\int_a^{\infty} f(x)\,dx = \lim_{R \to \infty}\int_a^R f(x)\,dx,\qquad \int_0^1 f(x)\,dx = \lim_{\varepsilon \to +0}\int_\varepsilon^1 f(x)\,dx'
---
## 定義

次のような積分は、通常の（リーマン）積分では定義されないので、極限として定めます。

- 区間が無限：$\displaystyle\int_a^{\infty} f(x)\,dx = \lim_{R \to \infty}\int_a^R f(x)\,dx$
- 端点で発散：$f$ が $x \to +0$ で有界でないとき $\displaystyle\int_0^1 f(x)\,dx = \lim_{\varepsilon \to +0}\int_\varepsilon^1 f(x)\,dx$

極限が有限の値として存在するとき**収束**、そうでないとき**発散**といいます。両端に問題がある $\int_{-\infty}^{\infty}$ や $\int_0^{\infty}$ では、途中の点で分け、**それぞれ独立に**極限をとります。

## 収束の判定

基準になるのは次の 2 つです。

- $\displaystyle\int_1^{\infty}\frac{dx}{x^p}$ は $p > 1$ で収束、$p \le 1$ で発散
- $\displaystyle\int_0^1\frac{dx}{x^p}$ は $p < 1$ で収束、$p \ge 1$ で発散

$0 \le f(x) \le g(x)$ で $\int g$ が収束すれば $\int f$ も収束する（比較判定法）ので、被積分関数の端点での振る舞いを $x^{-p}$ と比べて判定します。例えばガンマ関数 $\Gamma(s) = \int_0^\infty t^{s-1}e^{-t}dt$ は、0 の近くで $t^{s-1}$、無限遠で $e^{-t}$ が支配的なので、$s > 0$ で収束します。

$\int |f|$ が収束する場合を**絶対収束**といいます。$\displaystyle\int_0^{\infty}\frac{\sin x}{x}\,dx = \frac{\pi}{2}$ は収束しますが、$\int_0^\infty \left|\frac{\sin x}{x}\right|dx$ は発散するので、絶対収束ではありません（条件収束）。

## 計算例

- $\displaystyle\int_0^{\infty}\frac{dx}{1 + x^2} = \lim_{R\to\infty}\arctan R = \frac{\pi}{2}$
- $\displaystyle\int_0^1 \log x\,dx = \lim_{\varepsilon\to +0}\bigl[x\log x - x\bigr]_\varepsilon^1 = -1$（$\varepsilon\log\varepsilon \to 0$ を使う）

置換積分・部分積分・ガンマ関数やベータ関数への帰着・積分順序の交換・留数定理などを組み合わせて値を求めます。

## 試験での問われ方

数検1級では、広義積分の値を求める計算問題が 1次・2次ともに頻出で、ガンマ関数・ベータ関数・ガウス積分への帰着、パラメータを含む積分の微分、留数定理の応用として出題されます。2次では「収束することを示せ」という評価の記述も求められます。

## よくある誤り

- $\int_{-\infty}^{\infty}$ を $\lim_{R\to\infty}\int_{-R}^{R}$ だけで計算する。これはコーシーの主値で、両側が別々に収束しなくても値が出てしまいます（例：$\int_{-\infty}^\infty x\,dx$）。
- 区間の途中で被積分関数が発散する点（$\int_{-1}^1 dx/x^2$ の $x = 0$ など）を見落として、原始関数に端点を代入する。
- 収束を確かめないまま、積分と極限・和の順序を入れ替える。
