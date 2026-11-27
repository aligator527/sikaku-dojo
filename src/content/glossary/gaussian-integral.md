---
term: 'ガウス積分'
reading: がうすせきぶん
en: 'Gaussian integral'
exams: [suken-1, toukei-dse, toukei-1]
summary: 'e^(−x²) を実数全体で積分すると √π になるという広義積分。正規分布の正規化定数の根拠で、極座標による重積分で求めるのが定番。'
related: [normal-distribution, gamma-function, polar-coordinates, multiple-integral]
formula: '\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi},\qquad \int_{-\infty}^{\infty} e^{-ax^2}\,dx = \sqrt{\frac{\pi}{a}}\quad (a > 0)'
---
## 内容

$$I = \int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}$$

を**ガウス積分**といいます。$e^{-x^2}$ の原始関数は初等関数で表せないので、通常の方法では計算できません。

## 求め方（極座標）

$I^2$ を重積分として書き、極座標 $x = r\cos\theta$、$y = r\sin\theta$（$dx\,dy = r\,dr\,d\theta$）に変換します。

$$I^2 = \iint_{\mathbb{R}^2} e^{-(x^2+y^2)}\,dx\,dy = \int_0^{2\pi}\!\!\int_0^{\infty} e^{-r^2}\,r\,dr\,d\theta = 2\pi\cdot\frac{1}{2} = \pi$$

$I > 0$ なので $I = \sqrt{\pi}$ です。$r\,dr$ が現れることで $e^{-r^2}$ が積分できるようになるのがポイントです。記述問題では、正方形と円板で挟む評価により広義重積分の扱いを正当化することも求められます。

別の方法として、$t = x^2$ と置けば $\int_0^\infty e^{-x^2}dx = \frac{1}{2}\Gamma\!\left(\frac{1}{2}\right)$ なので、$\Gamma\!\left(\frac{1}{2}\right) = \sqrt{\pi}$ と同値です。

## 関連する公式

- $\displaystyle\int_{-\infty}^{\infty} e^{-ax^2}\,dx = \sqrt{\frac{\pi}{a}}$（$a > 0$）
- $\displaystyle\int_{-\infty}^{\infty} e^{-\frac{(x-\mu)^2}{2\sigma^2}}\,dx = \sqrt{2\pi}\,\sigma$：正規分布の密度の係数 $\dfrac{1}{\sqrt{2\pi}\sigma}$ の由来
- $\displaystyle\int_0^{\infty} x^2 e^{-x^2}\,dx = \frac{\sqrt{\pi}}{4}$、$\displaystyle\int_{-\infty}^{\infty} x^2 e^{-x^2/2}\,dx = \sqrt{2\pi}$（標準正規分布の分散が 1）
- 平方完成：$\displaystyle\int_{-\infty}^{\infty} e^{-ax^2 + bx}\,dx = \sqrt{\frac{\pi}{a}}\,e^{b^2/(4a)}$。正規分布の積率母関数の計算はこの形です。
- 多次元：正定値行列 $A$ について $\displaystyle\int_{\mathbb{R}^n} e^{-\frac{1}{2}\boldsymbol{x}^{\top}A\boldsymbol{x}}\,d\boldsymbol{x} = \frac{(2\pi)^{n/2}}{\sqrt{\det A}}$

## 試験での問われ方

数検1級では、極座標を使ってガウス積分を導く記述問題や、パラメータを含む積分（$\int_0^\infty e^{-x^2}\cos bx\,dx$ など）を微分して求める問題に現れます。統計検定では、正規分布の正規化定数・モーメント・積率母関数の計算の前提として使います。

## よくある誤り

- 半分の区間 $\int_0^\infty e^{-x^2}dx$ の値を $\sqrt{\pi}$ とする（正しくは $\frac{\sqrt{\pi}}{2}$）。
- $e^{-ax^2}$ の積分を $\sqrt{\pi a}$ とする（$a$ は分母に入ります）。
- 極座標変換でヤコビアン $r$ を落とし、計算が進まなくなる。
