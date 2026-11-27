---
term: '不偏推定量'
reading: ふへんすいていりょう
en: 'unbiased estimator'
exams: [toukei-2, toukei-jun1, toukei-1, jdla-e, toukei-dse]
summary: '期待値が、推定したい母数に一致する推定量。推定に系統的な偏り（バイアス）がないことを意味する。'
related: [unbiased-variance, maximum-likelihood-estimation, fisher-information, sufficient-statistic]
formula: 'E[\hat{\theta}] = \theta\quad(\text{for all }\theta),\qquad \mathrm{MSE}(\hat{\theta}) = V[\hat{\theta}] + \left(E[\hat{\theta}] - \theta\right)^2'
---
## 定義

推定量 $\hat{\theta}$ が、母数 $\theta$ のどの値に対しても $E[\hat{\theta}] = \theta$ を満たすとき、不偏推定量といいます。$E[\hat{\theta}] - \theta$ をバイアス（偏り）と呼びます。

## 例

- 標本平均 $\bar{X}$ は母平均の、標本比率 $\hat{p}$ は母比率の不偏推定量。
- 不偏分散 $s^2$（$n-1$ で割る）は母分散の不偏推定量だが、$n$ で割った分散は不偏でない。
- $s^2$ が不偏でも $s = \sqrt{s^2}$ は $\sigma$ の不偏推定量ではない。不偏性は非線形な変換で一般に保たれない。

## 推定量の良さとの関係

推定量の良さは平均二乗誤差 $\mathrm{MSE} = V[\hat{\theta}] + (\text{バイアス})^2$ で測られます。不偏推定量の中で分散が最小のものが望ましく（有効性）、その下限はクラーメル・ラオの不等式 $V[\hat{\theta}] \geq 1/(nI(\theta))$ で与えられます。十分統計量を使って改良する方法（ラオ・ブラックウェルの定理）もあります。

## 試験での問われ方

2級では一致性・不偏性の意味の区別、準1級ではバイアスや MSE の計算、1級では不偏性の証明や一様最小分散不偏推定量の導出が問われます。

## よくある誤り

- 不偏であれば常に良い推定量だと考える（わずかなバイアスを許して分散を大きく減らす推定量の方が、MSE が小さいこともある）。
- 不偏性（期待値が一致）と一致性（$n \to \infty$ で真の値に収束）を混同する。
