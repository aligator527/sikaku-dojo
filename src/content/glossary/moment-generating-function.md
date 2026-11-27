---
term: '積率母関数'
reading: せきりつぼかんすう
en: 'moment generating function'
aliases: ['モーメント母関数']
exams: [toukei-jun1, toukei-1, toukei-dse, suken-1]
summary: '確率変数 X に対して E[e^{tX}] を t の関数とみたもの。t = 0 での微分係数がモーメントを与え、分布を一意に決めるので、和の分布や極限分布の導出に使う。'
related: [moment, reproductive-property, central-limit-theorem, convergence-in-distribution, normal-distribution]
formula: 'M_X(t) = E\left[e^{tX}\right],\qquad M_X^{(k)}(0) = E[X^k]'
---
## 定義と基本性質

$M_X(t) = E[e^{tX}]$ が 0 を含むある区間で有限のとき、これを $X$ の積率母関数（モーメント母関数）といいます。

- $M_X(0) = 1$、$M_X'(0) = E[X]$、$M_X''(0) = E[X^2]$。一般に $M_X^{(k)}(0) = E[X^k]$。
- 1 次変換：$M_{aX+b}(t) = e^{bt}M_X(at)$。
- 独立な和：$M_{X+Y}(t) = M_X(t)M_Y(t)$。
- **一意性**：積率母関数が 0 の近くで一致すれば、分布も一致する。
- $\log M_X(t)$（キュムラント母関数）を微分すると、1 次で平均、2 次で分散が直接得られる。

## 主な分布の積率母関数

| 分布 | $M(t)$ |
| --- | --- |
| 二項分布 $B(n, p)$ | $(1 - p + pe^t)^n$ |
| ポアソン分布 $Po(\lambda)$ | $\exp\{\lambda(e^t - 1)\}$ |
| 正規分布 $N(\mu, \sigma^2)$ | $\exp(\mu t + \sigma^2 t^2/2)$ |
| 指数分布 $\mathrm{Exp}(\lambda)$ | $\lambda/(\lambda - t)$（$t < \lambda$） |
| ガンマ分布 $\mathrm{Ga}(\alpha, \lambda)$ | $(1 - t/\lambda)^{-\alpha}$（$t < \lambda$） |

## 計算例

ポアソン分布では $M'(t) = \lambda e^t M(t)$ なので $E[X] = M'(0) = \lambda$、$M''(0) = \lambda + \lambda^2$ から $V[X] = \lambda$ です。独立な $Po(\lambda_1)$ と $Po(\lambda_2)$ の和は $M(t) = \exp\{(\lambda_1 + \lambda_2)(e^t - 1)\}$ となり、一意性から $Po(\lambda_1 + \lambda_2)$ に従います（再生性）。

## 関連する母関数

- **確率母関数** $G(s) = E[s^X]$（非負整数値の変数）：$G'(1) = E[X]$、$G''(1) = E[X(X-1)]$。$M(t) = G(e^t)$ の関係がある。
- **特性関数** $\varphi(t) = E[e^{itX}]$：すべての分布で存在する。コーシー分布や t 分布のように積率母関数が存在しない分布でも使える。

## 試験での問われ方

統計検定準1級・1級では、積率母関数の導出と微分によるモーメントの計算、和の分布（再生性）の証明、1 次変換後の分布の特定、積率母関数の収束による極限分布の導出（二項分布のポアソン近似、中心極限定理の証明の概略）が出題されます。

## よくある誤り

- 存在しない分布（コーシー分布、t 分布、対数正規分布）に積率母関数を使う。
- $M_{aX}(t) = aM_X(t)$ とする（正しくは $M_X(at)$）。
- 独立でない確率変数の和にも、積の公式を使う。
