---
term: 'ベータ関数'
reading: べーたかんすう
en: 'beta function'
exams: [suken-1, toukei-1, toukei-dse]
summary: 'B(p, q) = ∫₀¹ t^(p−1)(1−t)^(q−1) dt で定義される 2 変数の特殊関数。ガンマ関数で B(p, q) = Γ(p)Γ(q)/Γ(p+q) と表せる。'
related: [gamma-function, improper-integral, jacobian, binomial-distribution]
formula: 'B(p, q) = \int_0^1 t^{p-1}(1-t)^{q-1}\,dt = \frac{\Gamma(p)\,\Gamma(q)}{\Gamma(p+q)}\quad (p, q > 0)'
---
## 定義と基本性質

$p > 0,\ q > 0$ に対して

$$B(p, q) = \int_0^1 t^{p-1}(1-t)^{q-1}\,dt$$

を**ベータ関数**といいます。$p < 1$ や $q < 1$ では端点で被積分関数が発散する広義積分ですが、$p, q > 0$ なら収束します。

- 対称性：$B(p, q) = B(q, p)$（$t \mapsto 1 - t$ と置換）
- ガンマ関数との関係：$B(p, q) = \dfrac{\Gamma(p)\Gamma(q)}{\Gamma(p+q)}$。$\Gamma(p)\Gamma(q)$ を重積分として書き、変数変換（ヤコビアン）を使って示すのが標準的な証明です。
- 三角関数による表示：$t = \sin^2\theta$ と置くと $B(p, q) = 2\displaystyle\int_0^{\pi/2}\sin^{2p-1}\theta\,\cos^{2q-1}\theta\,d\theta$
- 別の表示：$t = \dfrac{u}{1+u}$ と置くと $B(p, q) = \displaystyle\int_0^{\infty}\frac{u^{p-1}}{(1+u)^{p+q}}\,du$

## 計算例

- $\displaystyle\int_0^1 x^2(1-x)^3\,dx = B(3, 4) = \frac{2!\,3!}{6!} = \frac{1}{60}$
- $\displaystyle\int_0^{\pi/2}\sin^4\theta\cos^2\theta\,d\theta = \frac{1}{2}B\!\left(\tfrac{5}{2}, \tfrac{3}{2}\right) = \frac{1}{2}\cdot\frac{\frac{3\sqrt{\pi}}{4}\cdot\frac{\sqrt{\pi}}{2}}{3!} = \frac{\pi}{32}$
- $B\!\left(\tfrac{1}{2}, \tfrac{1}{2}\right) = \Gamma\!\left(\tfrac{1}{2}\right)^2 = \pi$

自然数 $m, n$ なら $B(m, n) = \dfrac{(m-1)!\,(n-1)!}{(m+n-1)!}$ です。

## 統計での使われ方

ベータ分布 $\mathrm{Be}(a, b)$ の密度 $\dfrac{x^{a-1}(1-x)^{b-1}}{B(a, b)}$ の正規化定数がベータ関数です。モーメントは $E[X^k] = \dfrac{B(a+k, b)}{B(a, b)}$ から求まり、例えば $E[X] = \dfrac{a}{a+b}$ です。二項分布の成功確率にベータ事前分布を置くと事後分布もベータ分布になるので、ベイズ推定の計算でも頻繁に使います。

## 試験での問われ方

数検1級では、定積分をベータ関数に帰着させて値を求める問題や、$B(p, q) = \Gamma(p)\Gamma(q)/\Gamma(p+q)$ を使った計算が出ます。統計検定1級では、ベータ分布の期待値・分散や事後分布の正規化定数の計算に現れます。

## よくある誤り

- 指数を $t^{p}(1-t)^{q}$ と読み違え、$B(p+1, q+1)$ を $B(p, q)$ としてしまう。
- 三角関数表示で係数 2 を落とす、または指数を $2p - 1$ ではなく $p - 1$ にする。
- $\Gamma(p+q)$ を分母ではなく分子に置いてしまう。
