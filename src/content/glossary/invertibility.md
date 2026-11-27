---
term: '反転可能性'
reading: はんてんかのうせい
en: 'invertibility'
aliases: ['反転可能', '反転可能条件']
exams: [toukei-jun1, toukei-1, toukei-dse]
summary: 'MA・ARMA モデルで、ホワイトノイズを現在と過去の観測値で表せる（AR(∞) 表現をもつ）こと。MA 多項式の根がすべて単位円の外にあることが条件で、MA モデルを一意に定めるために課す。'
related: [ma-model, arma-model, stationarity, ar-model]
formula: '\theta(z) = 1 + \theta_1 z + \cdots + \theta_q z^q = 0\ \ \text{の根がすべて}\ \ \lvert z\rvert > 1'
---
## 定義

ARMA モデル $\phi(B)X_t = \theta(B)\varepsilon_t$ が反転可能であるとは、

$$\varepsilon_t = \frac{\phi(B)}{\theta(B)}X_t = \sum_{j=0}^{\infty}\pi_jX_{t-j},\qquad \sum_j\lvert\pi_j\rvert < \infty$$

と、ショック $\varepsilon_t$ を観測値の（収束する）無限和で書けることです。条件は $\theta(z) = 0$ の根がすべて単位円の外にあることで、AR 側の定常条件と対になっています。

| 性質 | 条件をかける多項式 | 意味 |
|---|---|---|
| 定常性 | AR 多項式 $\phi(z)$ | MA($\infty$) 表現 $X_t = \sum\psi_j\varepsilon_{t-j}$ をもつ |
| 反転可能性 | MA 多項式 $\theta(z)$ | AR($\infty$) 表現 $\varepsilon_t = \sum\pi_jX_{t-j}$ をもつ |

## MA(1) の例

$X_t = \varepsilon_t + \theta\varepsilon_{t-1}$ を $\varepsilon_t$ について順に代入していくと

$$\varepsilon_t = X_t - \theta X_{t-1} + \theta^2X_{t-2} - \cdots = \sum_{j=0}^{\infty}(-\theta)^jX_{t-j}$$

で、これが収束するのは $\lvert\theta\rvert < 1$ のときです。

## なぜ必要か

1. **識別**：MA(1) の $\theta$ と $1/\theta$ は同じ自己相関 $\rho(1) = \theta/(1 + \theta^2)$ を与える（$\theta = 0.5$ と $2$ はどちらも 0.4）。反転可能な方に限ることで、モデルが一意に決まる。
2. **予測と推定**：観測できない $\varepsilon_t$ を過去の観測値から復元できるので、1 期先予測や条件付き最小二乗推定が計算できる。
3. **解釈**：過去の観測値の影響が遠い過去ほど小さくなる、という自然な性質をもつ。

## 反転可能でなくなる典型例

定常な系列を差分しすぎると、MA 多項式に単位根 $\theta = -1$ が生じます。たとえばホワイトノイズの差分 $\varepsilon_t - \varepsilon_{t-1}$ は反転可能でない MA(1) です。

## 試験での問われ方

統計検定準1級・1級では、$\rho(1)$ の値から MA(1) の $\theta$ を求めて反転可能な解を選ぶ問題、「定常かつ反転可能な ARMA モデル」の係数の条件、AR($\infty$) 表現の係数の計算が出題されます。

## よくある誤り

- 反転可能性と定常性を取り違え、AR の係数に反転可能条件を課す。
- MA モデルは常に定常なので、係数に何の条件も要らないと考える（一意性のために反転可能条件を課す）。
- 反転可能条件を $\lvert\theta\rvert > 1$ とする。
