---
term: '正規分布'
reading: せいきぶんぷ
en: 'normal distribution'
aliases: ['ガウス分布']
exams: [toukei-2, toukei-jun1, toukei-1, toukei-dse, suken-1, jdla-e]
summary: '平均 μ を中心に左右対称な釣鐘型の連続分布。多くの統計的推測の基礎になり、標準化すると標準正規分布 N(0, 1) に従う。'
related: [central-limit-theorem, t-distribution, standard-deviation]
formula: 'f(x) = \frac{1}{\sqrt{2\pi}\,\sigma}\exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)'
---
## 定義と性質

平均 $\mu$、分散 $\sigma^2$ の正規分布を $N(\mu, \sigma^2)$ と書きます。

- 標準化 $Z = (X - \mu)/\sigma$ は標準正規分布 $N(0, 1)$ に従う。
- 上側確率点：$z_{0.05} = 1.645$、$z_{0.025} = 1.96$、$z_{0.005} = 2.576$。
- $\mu \pm \sigma$、$\mu \pm 2\sigma$、$\mu \pm 3\sigma$ の範囲に入る確率は約 68.3%、95.4%、99.7%。
- 独立な正規確率変数の線形結合も正規分布：$aX + bY \sim N(a\mu_X + b\mu_Y,\ a^2\sigma_X^2 + b^2\sigma_Y^2)$。
- モーメント母関数は $\exp(\mu t + \sigma^2 t^2/2)$。

## 試験での問われ方

2級では、標準正規分布表を使った確率計算、標準化、線形結合の分布が頻出です。準1級・1級では、多変量正規分布の条件付き分布、正規母集団からの標本平均と不偏分散の独立性、t・カイ二乗・F 分布の導出が問われます。

## よくある誤り

- 標準化で分散 $\sigma^2$ で割ってしまう（割るのは標準偏差 $\sigma$）。
- 数値表が「上側確率」か「累積確率」かを確認せずに読む。
- 「無相関なら独立」を一般に成り立つと考える。これが成り立つのは、同時分布が（多変量）正規分布の場合などに限られる。
