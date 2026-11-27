---
term: '自己回帰モデル'
reading: じこかいきもでる
en: 'autoregressive model'
aliases: ['ARモデル', 'AR(1)', 'AR(2)', 'AR(p)', '自己回帰過程']
exams: [toukei-jun1, toukei-1, toukei-dse]
summary: '時系列の現在の値を、過去 p 期の自分自身の値の線形結合とホワイトノイズで表すモデル。AR(p) と書き、特性方程式の根がすべて単位円の外にあれば定常になる。'
related: [stationarity, autocorrelation-function, partial-autocorrelation, yule-walker-equations, characteristic-equation]
formula: 'X_t = c + \phi_1 X_{t-1} + \phi_2 X_{t-2} + \cdots + \phi_p X_{t-p} + \varepsilon_t,\qquad \varepsilon_t \sim \mathrm{WN}(0, \sigma^2)'
---
## 定義と定常条件

過去 $p$ 期の値で現在を説明するモデルを $p$ 次の自己回帰モデル AR($p$) といいます。ラグ作用素 $B$（$BX_t = X_{t-1}$）を使うと $\phi(B)X_t = c + \varepsilon_t$、$\phi(z) = 1 - \phi_1 z - \cdots - \phi_p z^p$ です。

特性方程式 $\phi(z) = 0$ の根がすべて単位円の外（$\lvert z\rvert > 1$）にあるとき、AR($p$) は定常（因果的な定常解をもつ）になります。根が $z = 1$ なら単位根で非定常です。

## AR(1) の性質

$X_t = c + \phi X_{t-1} + \varepsilon_t$、$\lvert\phi\rvert < 1$ のとき

$$\mu = \frac{c}{1 - \phi},\qquad \gamma(0) = \frac{\sigma^2}{1 - \phi^2},\qquad \rho(h) = \phi^{h}$$

です。例：$c = 2,\ \phi = 0.8,\ \sigma^2 = 1$ なら平均 10、分散 $1/0.36 \approx 2.78$、ラグ 2 の自己相関 0.64。

予測は $\hat{X}_{n+h} = \mu + \phi^h(x_n - \mu)$ で、$h$ が大きくなると平均に戻っていきます。上の例で $x_n = 12$ なら、1 期先 11.6、2 期先 11.28 です。$h$ 期先の予測誤差の分散は $\sigma^2(1 - \phi^{2h})/(1 - \phi^2)$ で、$\gamma(0)$ に近づきます。

## AR(2) の性質

- 定常条件：$\phi_1 + \phi_2 < 1$、$\phi_2 - \phi_1 < 1$、$\lvert\phi_2\rvert < 1$（三角形の領域）。
- 自己相関：$\rho(1) = \phi_1/(1 - \phi_2)$、$\rho(h) = \phi_1\rho(h-1) + \phi_2\rho(h-2)$（ユール・ウォーカー方程式）。
- $\phi_1^2 + 4\phi_2 < 0$ なら特性方程式の根は複素数で、自己相関は減衰振動し、系列は周期的な動きを示す。

## 推定と次数の選択

- 推定：最小二乗法（$X_t$ を $X_{t-1}, \ldots, X_{t-p}$ に回帰）、ユール・ウォーカー推定、最尤法。大標本ではほぼ同じ結果になる。
- 次数：偏自己相関がラグ $p$ の後で 0 になることを手がかりにし、AIC・BIC で比べる。
- 診断：残差の自己相関がホワイトノイズの帯に収まるか、リュン・ボックス検定で確かめる。

## 試験での問われ方

統計検定準1級・1級では、AR(1)・AR(2) の平均・分散・自己相関の計算、定常条件の判定（係数の組から定常なものを選ぶ）、予測値と予測誤差の分散、次数選択が繰り返し出題されます。データサイエンスエキスパートでは、需要予測などの基本モデルとして解釈が問われます。

## よくある誤り

- 特性方程式の形を確かめずに、根の位置で定常かどうかを判断する（$1 - \phi_1 z - \cdots - \phi_p z^p = 0$ の形なら根が単位円の外、$z^p - \phi_1 z^{p-1} - \cdots - \phi_p = 0$ の形なら根が単位円の内側が定常の条件）。
- 定数項 $c$ を平均と取り違える（平均は $c/(1 - \phi_1 - \cdots - \phi_p)$）。
- AR(2) で各係数の絶対値が 1 未満なら定常だと考える。
