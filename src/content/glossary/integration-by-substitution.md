---
term: '置換積分'
reading: ちかんせきぶん
en: 'integration by substitution'
aliases: ['置換積分法']
exams: [suken-1, toukei-1]
summary: '積分変数を x = φ(t) と置き換え、dx = φ′(t) dt として積分を計算しやすい形に直す方法。合成関数の微分の逆にあたる。'
related: [integration-by-parts, jacobian, chain-rule, improper-integral]
formula: '\int_a^b f(x)\,dx = \int_\alpha^\beta f(\varphi(t))\,\varphi''(t)\,dt\quad (a = \varphi(\alpha),\ b = \varphi(\beta))'
---
## 公式

$x = \varphi(t)$ と置くと $dx = \varphi'(t)\,dt$ で、

$$\int_a^b f(x)\,dx = \int_\alpha^\beta f(\varphi(t))\,\varphi'(t)\,dt\qquad(\varphi(\alpha) = a,\ \varphi(\beta) = b)$$

となります。逆向きに、被積分関数の中に $g(x)$ とその導関数 $g'(x)$ があれば $u = g(x)$ と置いて $\int f(g(x))g'(x)\,dx = \int f(u)\,du$ とできます。連鎖律（合成関数の微分）を積分の側から見たものです。

## 代表的な置き換え

| 被積分関数の形 | 置き換え |
| --- | --- |
| $\sqrt{a^2 - x^2}$ | $x = a\sin\theta$ |
| $\dfrac{1}{x^2 + a^2}$、$\sqrt{x^2 + a^2}$ | $x = a\tan\theta$ |
| $R(\sin x, \cos x)$（三角関数の有理式） | $t = \tan\dfrac{x}{2}$ |
| $R(x, \sqrt{ax + b})$ | $t = \sqrt{ax + b}$ |
| $e^{-x^2}$ を含む広義積分 | $t = x^2$ でガンマ関数へ |

$t = \tan\frac{x}{2}$ では $\sin x = \frac{2t}{1+t^2}$、$\cos x = \frac{1-t^2}{1+t^2}$、$dx = \frac{2}{1+t^2}dt$ となり、有理関数の積分に帰着します。

## 計算例

$x = \sin\theta$（$0 \le \theta \le \frac{\pi}{2}$）と置くと

$$\int_0^1\sqrt{1 - x^2}\,dx = \int_0^{\pi/2}\cos^2\theta\,d\theta = \frac{\pi}{4}$$

で、四分円の面積に一致します。$\int_0^\infty x^{2}e^{-x^2}dx$ は $t = x^2$ と置けば $\frac{1}{2}\int_0^\infty t^{1/2}e^{-t}dt = \frac{1}{2}\Gamma\!\left(\frac{3}{2}\right) = \frac{\sqrt{\pi}}{4}$ です。

## 多変数の場合

重積分では、1 変数の $\varphi'(t)$ の代わりにヤコビアンの絶対値 $\left|\frac{\partial(x, y)}{\partial(u, v)}\right|$ が掛かります。確率変数の変数変換で密度関数を求める公式も同じ原理です。

## 試験での問われ方

数検1級では、定積分や広義積分の計算で、適切な置き換えを見つけてガンマ関数・ベータ関数・既知の積分に帰着させる問題が頻出です。統計検定1級では、確率密度の積分や期待値の計算で使います。

## よくある誤り

- 積分区間を新しい変数に合わせて変え忘れる。
- $dx$ を $\varphi'(t)\,dt$ に置き換え忘れる。
- 置き換えが区間で 1 対 1 でない（単調でない）のに、そのまま使う。$x = \sin\theta$ なら $\theta$ の範囲を $[-\frac{\pi}{2}, \frac{\pi}{2}]$ 内に取ります。
