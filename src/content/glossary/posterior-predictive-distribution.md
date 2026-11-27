---
term: '事後予測分布'
reading: じごよそくぶんぷ
en: 'posterior predictive distribution'
aliases: ['ベイズ予測分布']
exams: [toukei-jun1, toukei-1, toukei-dse]
summary: '将来の観測値の分布を、パラメータの事後分布で尤度を平均して求めたもの。パラメータの不確かさを含むので、推定値を代入しただけの分布より広がる。'
related: [posterior-distribution, conjugate-prior, marginal-likelihood, bayes-estimator]
formula: 'p(\tilde{x} \mid x) = \int f(\tilde{x} \mid \theta)\,\pi(\theta \mid x)\,d\theta'
---
## 定義

観測済みのデータ $x$ のもとで、まだ観測していない値 $\tilde{x}$ の分布を

$$p(\tilde{x} \mid x) = \int f(\tilde{x} \mid \theta)\,\pi(\theta \mid x)\,d\theta$$

で定めます。$\theta$ の値ごとの分布 $f(\tilde{x} \mid \theta)$ を、事後分布の重みで混ぜ合わせたものです。

## 代表的な結果

| モデル | 事後分布 | 事後予測分布 |
|---|---|---|
| ベルヌーイ・ベータ | $\mathrm{Beta}(a', b')$ | 次の試行の成功確率 $a'/(a' + b')$（事後平均）。$m$ 回中の成功数はベータ二項分布 |
| ポアソン・ガンマ | $\mathrm{Ga}(\alpha', \beta')$ | 負の二項分布（平均 $\alpha'/\beta'$、分散 $\alpha'/\beta' + \alpha'/\beta'^2$） |
| 正規（分散 $\sigma^2$ 既知） | $N(\mu_n, \tau_n^2)$ | $N(\mu_n,\ \sigma^2 + \tau_n^2)$ |

一様事前分布で $n$ 回中 $x$ 回成功したとき、次が成功する予測確率 $(x + 1)/(n + 2)$ はラプラスの継起則と呼ばれます。

## 分散の分解

全分散の公式から

$$V[\tilde{X} \mid x] = E\bigl[V[\tilde{X} \mid \theta] \bigm| x\bigr] + V\bigl[E[\tilde{X} \mid \theta] \bigm| x\bigr]$$

で、「データ自体のばらつき」と「パラメータの不確かさ」の和になります。たとえば苦情件数がポアソン分布で、$\lambda$ の事後分布が $\mathrm{Ga}(14, 4)$ なら、翌日の件数の予測分布の平均は 3.5、分散は $3.5 + 14/16 = 4.375$ で、ポアソン分布 $\mathrm{Po}(3.5)$ を当てた場合の分散 3.5 より大きくなります。

## 使いみち

- 予測区間：将来の観測値の範囲を、パラメータの不確かさも含めて示す。
- 事後予測チェック：事後予測分布から模擬データを発生させ、実データの特徴（最大値、ゼロの個数など）と比べてモデルの当てはまりを点検する。
- 周辺尤度との関係：データを 1 個ずつ予測した事後予測確率を掛け合わせると、周辺尤度になる。

## 試験での問われ方

統計検定準1級では、ベータ・二項やガンマ・ポアソンの事後分布から、次の観測が成功する確率や予測分布の平均・分散を求める問題が出ます。1級では事後予測分布が負の二項分布・ベータ二項分布になることの導出が記述式で問われます。

## よくある誤り

- 推定値を代入した分布（$\theta = \hat{\theta}$ とした $f(\tilde{x} \mid \hat{\theta})$）を予測分布とみなし、ばらつきを過小評価する。
- 予測分布の分散を、事後分布の分散だけだと考える（データ生成のばらつき $\sigma^2$ を足し忘れる）。
- 事後予測分布と事後分布を混同する（前者は観測値、後者はパラメータの分布）。
