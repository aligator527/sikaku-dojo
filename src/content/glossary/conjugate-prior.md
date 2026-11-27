---
term: '共役事前分布'
reading: きょうやくじぜんぶんぷ
en: 'conjugate prior'
exams: [toukei-jun1, toukei-1, toukei-dse]
summary: '尤度と組み合わせたとき、事後分布が事前分布と同じ分布族に属するような事前分布。事後分布のパラメータをデータで更新するだけで計算できる。'
related: [prior-distribution, posterior-distribution, beta-distribution, gamma-distribution, poisson-distribution]
formula: 'p \sim \mathrm{Beta}(a, b),\ \ X \mid p \sim \mathrm{Bin}(n, p)\ \ \Longrightarrow\ \ p \mid X = x \sim \mathrm{Beta}(a + x,\ b + n - x)'
---
## 定義

ある尤度（データの分布）に対して、事前分布の族 $\mathcal{F}$ が「事前分布が $\mathcal{F}$ に属すれば事後分布も $\mathcal{F}$ に属する」という性質をもつとき、$\mathcal{F}$ をその尤度の共役事前分布族といいます。事後分布は積分せずに、パラメータの更新式だけで求まります。指数型分布族のデータには、必ず共役事前分布族があります。

## 代表的な組合せ

| データの分布 | 共役事前分布 | 事後分布（$n$ 個の観測） |
|---|---|---|
| 二項 $\mathrm{Bin}(n, p)$ | $p \sim \mathrm{Beta}(a, b)$ | $\mathrm{Beta}(a + x,\ b + n - x)$ |
| ポアソン $\mathrm{Po}(\lambda)$ | $\lambda \sim \mathrm{Ga}(\alpha, \beta)$（$\beta$ はレート） | $\mathrm{Ga}(\alpha + \sum x_i,\ \beta + n)$ |
| 指数 $\mathrm{Exp}(\lambda)$ | $\lambda \sim \mathrm{Ga}(\alpha, \beta)$ | $\mathrm{Ga}(\alpha + n,\ \beta + \sum x_i)$ |
| 正規 $N(\mu, \sigma^2)$、$\sigma^2$ 既知 | $\mu \sim N(\mu_0, \tau_0^2)$ | 正規分布（精度が $n/\sigma^2$ だけ増える） |
| 正規 $N(\mu, \sigma^2)$、$\mu$ 既知 | $\sigma^2 \sim$ 逆ガンマ $\mathrm{IG}(\alpha, \beta)$ | $\mathrm{IG}\bigl(\alpha + n/2,\ \beta + \sum (x_i - \mu)^2/2\bigr)$ |
| 多項分布 | ディリクレ分布 | ディリクレ分布（各カテゴリの度数を加える） |

## 計算例

ある窓口の 1 日の苦情件数がポアソン分布 $\mathrm{Po}(\lambda)$ に従い、$\lambda$ の事前分布をガンマ分布 $\mathrm{Ga}(2, 1)$（平均 2）とします。3 日間で 3, 5, 4 件（合計 12 件）を観測すると、事後分布は $\mathrm{Ga}(2 + 12,\ 1 + 3) = \mathrm{Ga}(14, 4)$ で、事後平均 $14/4 = 3.5$、事後分散 $14/4^2 = 0.875$ です。事後平均は事前平均 2 と標本平均 4 の加重平均 $(1/4)(2) + (3/4)(4)$ になっています。

## 解釈

事前分布のパラメータは「仮想的な過去のデータ」と読めます。$\mathrm{Beta}(a, b)$ は成功 $a$ 回・失敗 $b$ 回、$\mathrm{Ga}(\alpha, \beta)$ は $\beta$ 単位の期間に $\alpha$ 件の観測をすでにもっていることに相当します。

## 試験での問われ方

統計検定準1級では、ベータ・二項、ガンマ・ポアソン、正規・正規の組合せで事後分布・事後平均・事後予測分布を計算する問題がよく出ます。1級ではこれらを導出させたり、逆ガンマ分布や正規・ガンマ分布（平均と分散がともに未知）を扱わせたりします。データサイエンスエキスパートでは A/B テストのクリック率の比較に使われます。

## よくある誤り

- ガンマ分布のパラメータをレートと尺度で取り違える（$\mathrm{Ga}(\alpha, \beta)$ の平均はレート表記なら $\alpha/\beta$、尺度表記なら $\alpha\beta$）。
- ベータ分布の更新で、失敗数 $n - x$ ではなく試行数 $n$ を $b$ に足す。
- 共役でない事前分布は使えないと考える（使えるが、事後分布が既知の形にならないので MCMC などの数値計算が必要になる）。
