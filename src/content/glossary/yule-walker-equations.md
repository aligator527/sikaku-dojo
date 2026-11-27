---
term: 'ユール・ウォーカー方程式'
reading: ゆーる・うぉーかーほうていしき
en: 'Yule–Walker equations'
aliases: ['ユール・ウォーカー', 'ユール・ウォーカー推定']
exams: [toukei-jun1, toukei-1, toukei-dse]
summary: '定常な AR(p) 過程の自己相関と係数の間に成り立つ連立一次方程式。自己相関からの係数の推定（ユール・ウォーカー推定）や、係数からの自己相関の計算に使う。'
related: [ar-model, autocorrelation-function, partial-autocorrelation, autocovariance-function]
formula: '\rho(h) = \phi_1\rho(h-1) + \phi_2\rho(h-2) + \cdots + \phi_p\rho(h-p)\qquad (h = 1, 2, \ldots)'
---
## 導出

平均 0 の定常な AR($p$) 過程 $X_t = \phi_1X_{t-1} + \cdots + \phi_pX_{t-p} + \varepsilon_t$ の両辺に $X_{t-h}$（$h \geq 1$）を掛けて期待値をとります。$\varepsilon_t$ は過去の $X_{t-h}$ と無相関なので

$$\gamma(h) = \phi_1\gamma(h-1) + \cdots + \phi_p\gamma(h-p)$$

となり、$\gamma(0)$ で割ると冒頭の式が得られます。$h = 0$ の場合は $\gamma(0) = \phi_1\gamma(1) + \cdots + \phi_p\gamma(p) + \sigma^2$ となり、誤差分散は

$$\sigma^2 = \gamma(0)\bigl\{1 - \phi_1\rho(1) - \cdots - \phi_p\rho(p)\bigr\}$$

と表せます。

## 行列表示

$h = 1, \ldots, p$ の式を並べると

$$\begin{pmatrix}1 & \rho(1) & \cdots & \rho(p-1)\\ \rho(1) & 1 & \cdots & \rho(p-2)\\ \vdots & & \ddots & \vdots\\ \rho(p-1) & \rho(p-2) & \cdots & 1\end{pmatrix}\begin{pmatrix}\phi_1\\ \phi_2\\ \vdots\\ \phi_p\end{pmatrix} = \begin{pmatrix}\rho(1)\\ \rho(2)\\ \vdots\\ \rho(p)\end{pmatrix}$$

です。$\rho$ を標本自己相関 $r_h$ に置き換えて解いたものがユール・ウォーカー推定量で、得られる AR モデルは必ず定常になります。

## AR(2) の場合

$$\rho(1) = \frac{\phi_1}{1 - \phi_2},\qquad \rho(2) = \phi_1\rho(1) + \phi_2$$

逆に解くと

$$\hat{\phi}_1 = \frac{r_1(1 - r_2)}{1 - r_1^2},\qquad \hat{\phi}_2 = \frac{r_2 - r_1^2}{1 - r_1^2}$$

です。$\hat{\phi}_2$ はラグ 2 の偏自己相関 $\phi_{22}$ に一致します。

**計算例**：$r_1 = 0.5,\ r_2 = 0.1$ なら $\hat{\phi}_1 = 0.5 \times 0.9/0.75 = 0.6$、$\hat{\phi}_2 = (0.1 - 0.25)/0.75 = -0.2$。標本分散が $\hat{\gamma}(0) = 2$ なら、誤差分散の推定値は $2\{1 - 0.6 \times 0.5 - (-0.2) \times 0.1\} = 1.44$ です。

## 偏自己相関との関係

次数を $1, 2, 3, \ldots$ と上げながらユール・ウォーカー方程式を解いたときの最後の係数が偏自己相関 $\phi_{11}, \phi_{22}, \phi_{33}, \ldots$ です。ダービン・レビンソンの漸化式を使うと、逆行列を計算せずに順に求められます。

## 試験での問われ方

統計検定準1級・1級では、AR(1)・AR(2) の係数から自己相関を求める問題と、標本自己相関から係数・誤差分散を推定する問題が典型です。1級では一般の AR($p$) の行列表示や、偏自己相関との関係の説明が記述式で問われることがあります。

## よくある誤り

- $h = 0$ の式にも誤差分散 $\sigma^2$ を入れ忘れる（$h \geq 1$ の式には入らないが、$h = 0$ の式には入る）。
- AR(2) の $\rho(1)$ を $\phi_1$ とする（$\phi_1/(1 - \phi_2)$）。
- MA や ARMA の自己相関にもそのまま適用する（ARMA ではラグ $q$ より大きい $h$ でしか成り立たない）。
