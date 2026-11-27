---
term: '標本平均'
reading: ひょうほんへいきん
en: 'sample mean'
aliases: ['算術平均']
exams: [toukei-2, toukei-jun1, toukei-1, toukei-dse, jdla-e, suken-1]
summary: '標本として得られた観測値の算術平均。母平均の代表的な推定量で、期待値は母平均に等しく、分散は母分散の 1/n になる。'
related: [unbiased-variance, central-limit-theorem, unbiased-estimator, standard-deviation]
formula: '\bar{X} = \frac{1}{n}\sum_{i=1}^{n} X_i,\qquad E[\bar{X}] = \mu,\qquad V[\bar{X}] = \frac{\sigma^2}{n}'
---
## 定義

母集団から無作為に抽出した $n$ 個の観測値 $X_1, \ldots, X_n$ の算術平均 $\bar{X} = \frac{1}{n}\sum X_i$ を標本平均といいます。データから計算した具体的な値 $\bar{x}$（推定値）と、標本の取り方によって変動する確率変数 $\bar{X}$（推定量）を区別して考えるのが、推測統計の出発点です。

## 性質

$X_1, \ldots, X_n$ が互いに独立に母平均 $\mu$、母分散 $\sigma^2$ の分布に従うとき、

- $E[\bar{X}] = \mu$（不偏性）
- $V[\bar{X}] = \sigma^2/n$。その平方根 $\sigma/\sqrt{n}$ を標準誤差と呼び、$n$ を 4 倍にすると半分になる。
- 大数の法則により $n \to \infty$ で $\mu$ に確率収束する（一致性）。
- 中心極限定理により、$n$ が大きければ近似的に正規分布 $N(\mu, \sigma^2/n)$ に従う。母集団が正規分布なら、$n$ によらず正確にこの分布に従う。

## 試験での問われ方

2級では、標本平均の分布を使った確率計算や、信頼区間・検定に現れる標準誤差の計算が頻出です。準1級・1級では、不偏性・一致性の証明、有効性（分散の小ささ）、外れ値に対する弱さ（中央値との比較）などが問われます。

## よくある誤り

- 個々の観測値の標準偏差 $\sigma$ と、標本平均の標準誤差 $\sigma/\sqrt{n}$ を混同する。
- 有限母集団から非復元抽出する場合、分散に有限母集団修正 $\frac{N-n}{N-1}$ がかかることを忘れる。
