---
term: ガンマ関数
reading: がんまかんすう
en: gamma function
aliases: [Γ関数, ベータ関数]
exams: [suken-1, toukei-1]
summary: 階乗を実数（複素数）に拡張した特殊関数。Γ(s) = ∫₀^∞ t^(s−1) e^(−t) dt で定義され、自然数 n に対して Γ(n+1) = n! となる。
related: [taylor-expansion, jacobian]
formula: '\Gamma(s) = \int_0^{\infty} t^{s-1} e^{-t}\,dt\quad (s > 0),\qquad \Gamma(s+1) = s\,\Gamma(s)'
---
## 定義と基本性質

$s > 0$ に対して $\Gamma(s) = \displaystyle\int_0^\infty t^{s-1}e^{-t}\,dt$ と定義します。部分積分により

- $\Gamma(s+1) = s\,\Gamma(s)$、$\Gamma(1) = 1$ なので $\Gamma(n+1) = n!$
- $\Gamma\!\left(\tfrac12\right) = \sqrt\pi$（ガウス積分 $\int_{-\infty}^\infty e^{-x^2}dx = \sqrt\pi$ と同値）

が成り立ちます。

## ベータ関数との関係

$B(p, q) = \displaystyle\int_0^1 x^{p-1}(1-x)^{q-1}\,dx = \frac{\Gamma(p)\Gamma(q)}{\Gamma(p+q)}$。$x = \sin^2\theta$ と置換すると $\int_0^{\pi/2}\sin^m\theta\cos^n\theta\,d\theta$ 型の積分（ウォリス積分）もベータ関数で表せます。証明には重積分の変数変換（ヤコビアン）を使います。

## 使いどころ

- $\displaystyle\int_0^\infty x^{a}e^{-bx^c}dx$ 型の積分は、$t = bx^c$ と置換すればガンマ関数に帰着します。例：$\int_0^\infty x^{2n+1}e^{-x^2}dx = n!/2$。
- 統計ではガンマ分布・カイ二乗分布・t 分布・ベータ分布の正規化定数に現れます。

## 試験での問われ方

数検1級の1次では広義積分の値を求める問題で、置換してガンマ関数・ベータ関数に帰着させると速く解けます。2次では $\Gamma(1/2) = \sqrt\pi$ の証明や、ベータ関数との関係式の証明が題材になります。

## よくある誤り

- $\Gamma(n) = n!$ と覚え違える（正しくは $\Gamma(n) = (n-1)!$）。
- 置換 $t = x^2$ などで $dx$ の変換係数（$\tfrac12$ など）を落とす。
