---
term: '漸近正規性'
reading: ぜんきんせいきせい
en: 'asymptotic normality'
exams: [toukei-jun1, toukei-1, toukei-dse]
summary: '標本サイズを大きくしたとき、推定量を中心化して √n 倍したものの分布が正規分布に近づく性質。その極限の分散を漸近分散という。'
related: [central-limit-theorem, maximum-likelihood-estimation, fisher-information, delta-method, confidence-interval]
formula: '\sqrt{n}\,(\hat{\theta}_n - \theta) \xrightarrow{d} N\left(0,\ \sigma^2(\theta)\right)'
---
## 定義

推定量の列 $\hat{\theta}_n$ について、$\sqrt{n}(\hat{\theta}_n - \theta)$ が正規分布 $N(0, \sigma^2(\theta))$ に分布収束するとき、$\hat{\theta}_n$ は漸近正規性をもつといいます。$\sigma^2(\theta)$ を漸近分散と呼び、大標本では近似的に $\hat{\theta}_n \sim N(\theta,\ \sigma^2(\theta)/n)$ とみなせます。

## 代表例

- 標本平均：中心極限定理により、漸近分散は母分散 $\sigma^2$。
- 最尤推定量：正則条件のもとで漸近分散は $1/I(\theta)$（$I$ は 1 観測あたりのフィッシャー情報量）。これはクラーメル・ラオの下限に一致するので、最尤推定量は漸近有効といわれる。
- 標本中央値：母集団の密度 $f$ と中央値 $m$ を使って、漸近分散は $1/\{4f(m)^2\}$。正規分布 $N(\mu, \sigma^2)$ では $\pi\sigma^2/2$ で、標本平均の約 1.57 倍になる。
- 推定量の滑らかな関数 $g(\hat{\theta})$：デルタ法により、漸近分散は $g'(\theta)^2\sigma^2(\theta)$。

## 使い方

漸近正規性があれば、標準誤差 $\widehat{\mathrm{SE}} = \sigma(\hat{\theta})/\sqrt{n}$ を使って近似的な信頼区間 $\hat{\theta} \pm z_{\alpha/2}\,\widehat{\mathrm{SE}}$ や、ワルド検定統計量 $(\hat{\theta} - \theta_0)/\widehat{\mathrm{SE}}$ を作れます。2 つの推定量の漸近分散の比は、漸近相対効率として推定量の比較に使われます。

## 漸近正規にならない例

一様分布 $U(0, \theta)$ の最尤推定量 $X_{(n)} = \max_i X_i$ では、$P(n(\theta - X_{(n)}) > t) = (1 - t/(n\theta))^n \to e^{-t/\theta}$ となり、$\sqrt{n}$ ではなく $n$ の速さで収束し、極限分布は指数分布です。台が母数に依存するため、正則条件が成り立たないからです。

## 試験での問われ方

統計検定準1級・1級では、最尤推定量の漸近分散をフィッシャー情報量から求める問題、デルタ法と組み合わせて変換後の推定量の漸近分布を求める問題、中央値と平均の漸近分散を比べる問題が典型です。

## よくある誤り

- 漸近分散 $\sigma^2$ と、推定量の近似的な分散 $\sigma^2/n$ を取り違える。
- 正則条件を確かめずに、すべての最尤推定量に漸近分散 $1/I(\theta)$ を当てはめる。
- 一致性があれば漸近正規性もあると考える（一致性は分布の形について何も述べていない）。
