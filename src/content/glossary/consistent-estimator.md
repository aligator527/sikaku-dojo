---
term: '一致推定量'
reading: いっちすいていりょう
en: 'consistent estimator'
aliases: ['一致性']
exams: [toukei-2, toukei-jun1, toukei-1, toukei-dse]
summary: '標本サイズを大きくすると、真の母数の値に確率収束する推定量。データが十分に多ければ、いくらでも正確に推定できることを意味する。'
related: [unbiased-estimator, maximum-likelihood-estimation, asymptotic-normality, point-estimation, instrumental-variable]
formula: '\lim_{n \to \infty} P\left(|\hat{\theta}_n - \theta| > \varepsilon\right) = 0\quad (\text{for all } \varepsilon > 0)'
---
## 定義

推定量の列 $\hat{\theta}_n$ が、任意の $\varepsilon > 0$ について $P(|\hat{\theta}_n - \theta| > \varepsilon) \to 0$（$n \to \infty$）を満たすとき、$\hat{\theta}_n$ は $\theta$ の一致推定量である、または一致性をもつといいます。確率収束 $\hat{\theta}_n \xrightarrow{p} \theta$ と同じ意味です。

## 一致性を示す方法

- 平均二乗誤差が 0 に収束すれば一致推定量：チェビシェフ（マルコフ）の不等式から $P(|\hat{\theta}_n - \theta| > \varepsilon) \leq \mathrm{MSE}(\hat{\theta}_n)/\varepsilon^2$ なので、「バイアス $\to 0$ かつ分散 $\to 0$」を確かめればよい。
- 大数の法則：標本平均は母平均の一致推定量。
- 連続写像定理：$\hat{\theta}_n \xrightarrow{p} \theta$ で $g$ が連続なら $g(\hat{\theta}_n) \xrightarrow{p} g(\theta)$。たとえば $s = \sqrt{s^2}$ は $\sigma$ の一致推定量。
- 最尤推定量は、正則条件のもとで一致推定量になる。

## 不偏性との違い

| 推定量 | 不偏 | 一致 |
| --- | --- | --- |
| $\bar{X}$（母平均） | ○ | ○ |
| $X_1$（最初の 1 個だけ） | ○ | × |
| $\frac{1}{n}\sum (X_i - \bar{X})^2$（母分散） | ×（$n \to \infty$ で偏りは 0） | ○ |
| $\bar{X} + 1/n$ | × | ○ |

不偏性は「標本サイズを固定したときの平均的な位置」、一致性は「標本サイズを大きくしたときの振る舞い」についての性質で、互いに独立した概念です。

## 回帰分析での一致性

最小二乗推定量は、説明変数と誤差が無相関なら一致性をもちます。説明変数と誤差が相関する（欠落変数・測定誤差・同時性がある）と、標本を増やしても偏りが残り一致性を失います。そのときは操作変数法などを使います。

## 試験での問われ方

統計検定準1級・1級では、MSE の収束やチェビシェフの不等式を使って一致性を示す問題、不偏性と一致性の有無を推定量ごとに判定する問題、内生性があるときに推定量が一致性を失う理由を説明する問題が出ます。

## よくある誤り

- 不偏推定量なら一致推定量であると考える（$X_1$ は不偏だが一致性がない）。
- 一致推定量なら有限の $n$ でも偏りがないと考える。
- 分散が 0 に収束することだけを確かめ、バイアスの収束を確かめない。
