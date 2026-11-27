---
term: '不偏分散'
reading: ふへんぶんさん
en: 'unbiased sample variance'
aliases: ['不偏標本分散']
exams: [toukei-2, toukei-jun1, toukei-1, toukei-dse, jdla-e]
summary: '偏差平方和を n−1 で割った分散。期待値が母分散に一致する（不偏である）ため、母分散の推定に用いられる。'
related: [sample-mean, standard-deviation, unbiased-estimator]
formula: 's^2 = \frac{1}{n-1}\sum_{i=1}^{n}(X_i-\bar{X})^2,\qquad E[s^2] = \sigma^2'
---
## 定義

標本 $X_1, \ldots, X_n$ の偏差平方和 $\sum (X_i - \bar{X})^2$ を $n-1$ で割ったものを不偏分散といい、$s^2$ や $u^2$ で表します。

## なぜ $n-1$ で割るのか

偏差は母平均 $\mu$ ではなく標本平均 $\bar{X}$ のまわりで測るため、$\sum (X_i - \bar{X}) = 0$ という制約があり、自由に動ける偏差は $n-1$ 個です。式で確かめると、

$$\sum (X_i - \mu)^2 = \sum (X_i - \bar{X})^2 + n(\bar{X} - \mu)^2$$

の両辺の期待値をとって $n\sigma^2 = E\left[\sum (X_i - \bar{X})^2\right] + \sigma^2$、よって $E\left[\sum (X_i - \bar{X})^2\right] = (n-1)\sigma^2$ となります。

## 試験での問われ方

- 2級：「分散（$n-1$ で割る）」と指定された計算、t 統計量や信頼区間での利用。正規母集団では $(n-1)s^2/\sigma^2 \sim \chi^2(n-1)$ を使って母分散の区間推定・検定を行う。
- 準1級・1級：$n$ で割る最尤推定量 $\hat{\sigma}^2$ は $E[\hat{\sigma}^2] = \frac{n-1}{n}\sigma^2$ と偏るが、平均二乗誤差は不偏分散より小さい、といった比較。

## よくある誤り

- 不偏分散の平方根 $s$ を $\sigma$ の不偏推定量と考える（実際は $E[s] < \sigma$）。
- ソフトウェアによって既定の割り方が違うことに注意する。たとえば Excel の VAR.S は $n-1$、VAR.P は $n$ で割り、NumPy の `var` は既定で $n$、pandas の `var` は既定で $n-1$ で割る。
