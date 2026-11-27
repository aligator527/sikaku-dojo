---
term: '自己共分散関数'
reading: じこきょうぶんさんかんすう
en: 'autocovariance function'
aliases: ['自己共分散']
exams: [toukei-jun1, toukei-1, toukei-dse]
summary: '定常な時系列で、時間差（ラグ）h だけ離れた 2 時点の値の共分散を h の関数として表したもの。ラグ 0 の値は分散で、これで割ると自己相関関数になる。'
related: [autocorrelation-function, stationarity, covariance, ma-model, ar-model]
formula: '\gamma(h) = \mathrm{Cov}(X_t,\ X_{t+h}),\qquad \gamma(0) = V[X_t],\qquad \gamma(-h) = \gamma(h)'
---
## 定義と性質

弱定常過程 $\{X_t\}$ では $\mathrm{Cov}(X_t, X_{t+h})$ が $t$ によらず、ラグ $h$ だけで決まります。これを $\gamma(h)$ と書き、自己共分散関数といいます。

- $\gamma(0) = V[X_t] \geq 0$。
- 偶関数：$\gamma(-h) = \gamma(h)$。
- $\lvert\gamma(h)\rvert \leq \gamma(0)$（コーシー・シュワルツの不等式）。
- 非負定値：任意の実数 $a_1, \ldots, a_n$ と時点 $t_1, \ldots, t_n$ で $\sum_{i,j} a_ia_j\gamma(t_i - t_j) = V\bigl[\sum_i a_iX_{t_i}\bigr] \geq 0$。

## 代表的なモデルの自己共分散

$\varepsilon_t$ を分散 $\sigma^2$ のホワイトノイズとします。

| モデル | $\gamma(0)$ | $\gamma(h)\ (h \geq 1)$ |
|---|---|---|
| MA(1) $X_t = \varepsilon_t + \theta\varepsilon_{t-1}$ | $(1 + \theta^2)\sigma^2$ | $h = 1$ で $\theta\sigma^2$、$h \geq 2$ で 0 |
| MA($q$)（$\theta_0 = 1$） | $\sigma^2\sum_{j=0}^{q}\theta_j^2$ | $\sigma^2\sum_{j=0}^{q-h}\theta_j\theta_{j+h}$（$h > q$ で 0） |
| AR(1) $X_t = \phi X_{t-1} + \varepsilon_t$ | $\sigma^2/(1 - \phi^2)$ | $\phi^h\gamma(0)$ |

AR(1) の場合は、両辺に $X_{t-h}$ を掛けて期待値をとると $\gamma(h) = \phi\gamma(h-1)$ が得られ、これを繰り返すと上の結果になります。

## 標本自己共分散

観測値 $x_1, \ldots, x_n$ からは

$$\hat{\gamma}(h) = \frac{1}{n}\sum_{t=1}^{n-h}(x_t - \bar{x})(x_{t+h} - \bar{x})$$

で推定します。和の項数は $n - h$ ですが、$n$ で割るのが標準です。こうすると $\hat{\gamma}$ を並べた行列が必ず非負定値になり、自己相関の推定値としても扱いやすくなります。

## 標本平均の分散との関係

定常過程の標本平均の分散は

$$V[\bar{X}] = \frac{1}{n}\sum_{h=-(n-1)}^{n-1}\left(1 - \frac{\lvert h\rvert}{n}\right)\gamma(h) \approx \frac{1}{n}\sum_{h=-\infty}^{\infty}\gamma(h)$$

で、正の自己共分散があると $\gamma(0)/n$ より大きくなります。MCMC の標本平均の誤差や有効標本サイズの計算もこの式に基づきます。

## 試験での問われ方

統計検定準1級・1級では、MA・AR・ARMA 過程の自己共分散を定義から計算する問題、和や差で作った過程の自己共分散、自己相関を介したモデルの判別が頻出です。

## よくある誤り

- 自己共分散と自己相関（$\gamma(h)/\gamma(0)$）を取り違える。
- MA(1) の分散を $\sigma^2$ とする（$(1 + \theta^2)\sigma^2$）。
- AR(1) の分散を $\sigma^2/(1 - \phi)$ とする（$\sigma^2/(1 - \phi^2)$）。
