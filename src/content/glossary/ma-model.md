---
term: '移動平均モデル'
reading: いどうへいきんもでる
en: 'moving average model'
aliases: ['MAモデル', 'MA(1)', 'MA(2)', 'MA(q)', '移動平均過程']
exams: [toukei-jun1, toukei-1, toukei-dse]
summary: '時系列の現在の値を、現在と過去 q 期のホワイトノイズ（ショック）の線形結合で表すモデル。MA(q) と書き、常に定常で、自己相関はラグ q より先で 0 になる。'
related: [autocorrelation-function, invertibility, white-noise, arma-model, partial-autocorrelation]
formula: 'X_t = \mu + \varepsilon_t + \theta_1\varepsilon_{t-1} + \cdots + \theta_q\varepsilon_{t-q},\qquad \varepsilon_t \sim \mathrm{WN}(0, \sigma^2)'
---
## 定義

過去 $q$ 期分のショック $\varepsilon_{t-1}, \ldots, \varepsilon_{t-q}$ の影響が現在に残るモデルを $q$ 次の移動平均モデル MA($q$) といいます。有限個のホワイトノイズの和なので、係数の値によらず常に定常です。ラグ作用素では $X_t - \mu = \theta(B)\varepsilon_t$、$\theta(z) = 1 + \theta_1 z + \cdots + \theta_q z^q$ と書きます（教科書によっては係数の符号をマイナスで定義するので注意）。

## 自己共分散と自己相関

$\theta_0 = 1$ として

$$\gamma(h) = \sigma^2\sum_{j=0}^{q-h}\theta_j\theta_{j+h}\quad (0 \leq h \leq q),\qquad \gamma(h) = 0\quad (h > q)$$

です。自己相関がラグ $q$ で切れることが MA($q$) の目印です。

MA(1) では $\gamma(0) = (1 + \theta^2)\sigma^2$、$\rho(1) = \theta/(1 + \theta^2)$ で、$\lvert\rho(1)\rvert$ は最大でも $1/2$（$\theta = \pm 1$ のとき）です。

## 反転可能性と識別

$\theta$ と $1/\theta$ は同じ自己相関を与えます。たとえば $\theta = 0.5$ と $\theta = 2$ はどちらも $\rho(1) = 0.4$ です。自己相関だけからは区別できないので、$\lvert\theta\rvert < 1$（$\theta(z) = 0$ の根が単位円の外）という反転可能条件を課して一意に定めます。反転可能なら、MA(1) は $\varepsilon_t = \sum_{j \geq 0}(-\theta)^jX_{t-j}$ と過去の観測値で書け、AR($\infty$) 表現をもちます。

## 予測

MA($q$) では $q$ 期より先の予測は平均 $\mu$ になり、予測誤差の分散は $\gamma(0)$ で頭打ちになります。1 期先の予測には観測できない $\varepsilon_t$ が必要ですが、反転可能なら過去の観測値から復元できます。

## 平滑化の移動平均との違い

2級で扱う移動平均（$k$ 期の値の平均でトレンドを取り出す平滑化の操作）は、観測値の平均をとるデータ処理です。MA モデルは観測できないショックの加重和で過程を表す確率モデルで、名前は似ていても別物です。

## 試験での問われ方

統計検定準1級・1級では、MA(1)・MA(2) の分散・自己共分散・自己相関の計算、$\rho(1)$ から $\theta$ を求めて反転可能な解を選ぶ問題、自己相関の切断によるモデル同定がよく出ます。

## よくある誤り

- MA(1) の分散を $\sigma^2$ とする（$(1 + \theta^2)\sigma^2$）。
- $\rho(1) = \theta/(1 + \theta^2)$ を解いたとき、反転可能でない方の解を選ぶ。
- MA にも AR と同じ定常条件が必要だと考える（MA は常に定常で、係数に課すのは反転可能条件）。
