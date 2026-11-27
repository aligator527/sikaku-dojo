---
term: '多変量正規分布'
reading: たへんりょうせいきぶんぷ
en: 'multivariate normal distribution'
aliases: ['2変量正規分布', '二変量正規分布']
exams: [toukei-jun1, toukei-1, toukei-dse, suken-1]
summary: '正規分布を複数の変数に拡張した同時分布。平均ベクトルと分散共分散行列で決まり、線形変換・周辺分布・条件付き分布がすべて正規分布になる。'
related: [normal-distribution, covariance-matrix, conditional-expectation, joint-distribution, principal-component-analysis]
formula: 'f(\boldsymbol{x}) = \frac{1}{(2\pi)^{p/2}|\Sigma|^{1/2}}\exp\left\{-\frac{1}{2}(\boldsymbol{x}-\boldsymbol{\mu})^\top\Sigma^{-1}(\boldsymbol{x}-\boldsymbol{\mu})\right\}'
---
## 定義

平均ベクトル $\boldsymbol{\mu}$、分散共分散行列 $\Sigma$（正定値）をもつ $p$ 変量正規分布 $N_p(\boldsymbol{\mu}, \Sigma)$ の密度は上の式です。2 変量の場合、相関係数を $\rho$ とすると

$$f(x, y) = \frac{1}{2\pi\sigma_X\sigma_Y\sqrt{1-\rho^2}}\exp\left\{-\frac{1}{2(1-\rho^2)}\left[z_x^2 - 2\rho z_x z_y + z_y^2\right]\right\}$$

（$z_x = (x - \mu_X)/\sigma_X$、$z_y = (y - \mu_Y)/\sigma_Y$）となり、密度の等高線は楕円になります。

## 主な性質

- **線形変換**：$\boldsymbol{Y} = A\boldsymbol{X} + \boldsymbol{b}$ なら $\boldsymbol{Y} \sim N(A\boldsymbol{\mu} + \boldsymbol{b},\ A\Sigma A^\top)$。特に各成分の線形結合は 1 変量の正規分布。
- **周辺分布**：一部の成分の分布も正規分布で、$\boldsymbol{\mu}$ と $\Sigma$ の対応する部分をとり出せばよい。
- **無相関と独立**：成分どうしが無相関（$\Sigma$ の対応するブロックが 0）なら独立。一般の分布では成り立たない、正規分布の大きな特徴。
- **条件付き分布**：$\boldsymbol{X} = (\boldsymbol{X}_1, \boldsymbol{X}_2)$ と分けると、$\boldsymbol{X}_1 \mid \boldsymbol{X}_2 = \boldsymbol{x}_2$ は平均 $\boldsymbol{\mu}_1 + \Sigma_{12}\Sigma_{22}^{-1}(\boldsymbol{x}_2 - \boldsymbol{\mu}_2)$、分散 $\Sigma_{11} - \Sigma_{12}\Sigma_{22}^{-1}\Sigma_{21}$ の正規分布。
- **マハラノビス距離の 2 乗**：$(\boldsymbol{X} - \boldsymbol{\mu})^\top\Sigma^{-1}(\boldsymbol{X} - \boldsymbol{\mu}) \sim \chi^2(p)$。

## 2 変量の条件付き分布

$$Y \mid X = x \ \sim\ N\left(\mu_Y + \rho\frac{\sigma_Y}{\sigma_X}(x - \mu_X),\ \ \sigma_Y^2(1 - \rho^2)\right)$$

条件付き期待値は $x$ の 1 次式（回帰直線）で、条件付き分散は $x$ によらず、$\rho$ が $\pm 1$ に近いほど小さくなります。$|\rho| < 1$ なら回帰直線の傾きの絶対値は $\sigma_Y/\sigma_X$ より小さく、「平均への回帰」が起こります。

## 試験での問われ方

統計検定準1級・1級では、線形結合の分布、条件付き期待値・条件付き分散の計算、無相関と独立の同値性、マハラノビス距離の分布、2 変量正規分布での相関係数の推測が出題されます。主成分分析・判別分析・回帰分析の理論の前提としても繰り返し登場します。

## よくある誤り

- 各成分が正規分布に従えば、同時分布も多変量正規分布になると考える（周辺が正規でも同時分布が正規とは限らない）。
- 「無相関なら独立」を、多変量正規分布以外にも使う。
- 条件付き分散を $\sigma_Y^2$ のままにして、$(1 - \rho^2)$ を掛け忘れる。
