---
term: 'ロピタルの定理'
reading: ろぴたるのていり
en: 'L''Hopital''s rule'
exams: [suken-1]
summary: '0/0 や ∞/∞ の不定形の極限を、分子と分母をそれぞれ微分した比の極限で求めてよいとする定理。'
related: [taylor-expansion, chain-rule]
formula: '\lim_{x \to a}\frac{f(x)}{g(x)} = \lim_{x \to a}\frac{f''(x)}{g''(x)}\quad \Bigl(\frac{0}{0}\ \text{または}\ \frac{\infty}{\infty}\ \text{の不定形で、右辺が存在するとき}\Bigr)'
---
## 内容

$f, g$ が $a$ の近く（$a$ を除いてよい）で微分可能で $g'(x) \ne 0$ とし、$x \to a$ で $f(x), g(x)$ がともに 0（またはともに $\pm\infty$）に近づくとします。このとき

$$\lim_{x\to a}\frac{f'(x)}{g'(x)} = L\quad\text{が存在すれば}\quad \lim_{x\to a}\frac{f(x)}{g(x)} = L$$

です。$a = \pm\infty$ や片側極限でも成り立ちます。証明にはコーシーの平均値の定理を使います。

## 使い方

- 0/0 型：$\displaystyle\lim_{x\to0}\frac{x - \sin x}{x^3} = \lim\frac{1 - \cos x}{3x^2} = \lim\frac{\sin x}{6x} = \frac{1}{6}$（3 回適用）
- $0\cdot\infty$ 型：$x\log x = \dfrac{\log x}{1/x}$ と直して $\displaystyle\lim_{x\to+0}\frac{1/x}{-1/x^2} = \lim(-x) = 0$
- $1^\infty$、$0^0$、$\infty^0$ 型：対数をとって積の形にします。$\lim_{x\to\infty}\left(1 + \frac{1}{x}\right)^x$ は $x\log(1 + 1/x) \to 1$ から $e$ です。
- $\infty - \infty$ 型：通分して商の形にします。

## テイラー展開との使い分け

何回も微分が必要な場合や合成関数を含む場合は、テイラー展開で主要項を比べるほうが速く確実です。上の例も $\sin x = x - \frac{x^3}{6} + o(x^3)$ から直ちに $\frac{1}{6}$ と分かります。

## 試験での問われ方

数検1級の 1次では不定形の極限を求める計算問題として、2次では関数の連続性・微分可能性を調べる途中（$x \ne 0$ と $x = 0$ で定義が異なる関数の導関数など）で使われます。

## よくある誤り

- 不定形でない極限に使う。$\lim_{x\to0}\frac{\cos x}{x + 1} = 1$ なのに、微分して $\lim\frac{-\sin x}{1} = 0$ とするのは誤りです。
- 商の微分 $(f/g)'$ を計算してしまう。分子と分母を**別々に**微分します。
- $f'/g'$ の極限が存在しないことから、元の極限も存在しないと結論する。$\lim_{x\to\infty}\frac{x + \sin x}{x} = 1$ ですが、$\frac{1 + \cos x}{1}$ は振動します。
