---
term: '一様最小分散不偏推定量'
reading: いちようさいしょうぶんさんふへんすいていりょう
en: 'uniformly minimum variance unbiased estimator'
aliases: ['UMVUE', 'UMVU推定量', '最小分散不偏推定量']
exams: [toukei-1]
summary: '不偏推定量のうち、母数のどの値に対しても分散が最小になる推定量。完備十分統計量の関数として作れる（レーマン・シェフェの定理）。'
related: [unbiased-estimator, sufficient-statistic, rao-blackwell-theorem, lehmann-scheffe-theorem, cramer-rao-inequality]
formula: 'V_{\theta}[T^{*}] \leq V_{\theta}[T]\quad \text{for all } \theta \text{ and every unbiased } T'
---
## 定義

$g(\theta)$ の不偏推定量 $T^{*}$ が、他のどの不偏推定量 $T$ と比べても、すべての $\theta$ で $V_{\theta}[T^{*}] \leq V_{\theta}[T]$ を満たすとき、$T^{*}$ を一様最小分散不偏推定量（UMVUE）といいます。「一様」は、特定の $\theta$ だけでなく母数のすべての値で最小という意味です。存在すれば一意です。

## 求め方

1. 完備十分統計量 $T$ を見つける（自然母数の空間が内点をもつ指数型分布族なら、自然な十分統計量が完備）。
2. $T$ の関数で不偏なもの $h(T)$ を作る。期待値を計算して係数を調整するか、
3. 簡単な不偏推定量 $\tilde{\theta}$ を $T$ で条件付けて $E[\tilde{\theta} \mid T]$ を計算する（ラオ・ブラックウェル化）。

レーマン・シェフェの定理により、こうして得た $h(T)$ が UMVUE です。

## 例

| 分布 | 推定対象 | UMVUE |
| --- | --- | --- |
| 正規 $N(\mu, \sigma^2)$ | $\mu$、$\sigma^2$ | $\bar{X}$、不偏分散 $s^2$ |
| ポアソン $Po(\lambda)$ | $\lambda$ | $\bar{X}$ |
| ポアソン $Po(\lambda)$ | $P(X = 0) = e^{-\lambda}$ | $\left(\frac{n-1}{n}\right)^{\sum X_i}$ |
| 一様 $U(0, \theta)$ | $\theta$ | $\frac{n+1}{n}\max_i X_i$ |
| 指数分布（率 $\lambda$） | $\lambda$ | $\frac{n-1}{\sum X_i}$ |

ポアソン分布の $e^{-\lambda}$ の例は、指示関数 $\mathbf{1}\{X_1 = 0\}$ を $\sum X_i = t$ で条件付けると、$X_1 \mid t \sim B(t, 1/n)$ より $((n-1)/n)^t$ が得られます。

## クラーメル・ラオの下限との関係

下限に達する不偏推定量（有効推定量）は UMVUE ですが、UMVUE が下限に達するとは限りません。正規分布の $s^2$ は UMVUE ですが、分散 $2\sigma^4/(n-1)$ は下限 $2\sigma^4/n$ より大きくなります。一様分布 $U(0, \theta)$ のように正則条件が成り立たない場合も、レーマン・シェフェの定理なら UMVUE を求められます。

## 試験での問われ方

統計検定1級の統計数理では、十分統計量の完備性を示し、レーマン・シェフェの定理やラオ・ブラックウェル化で UMVUE を導く問題、その分散をクラーメル・ラオの下限と比べる問題が出題されます。

## よくある誤り

- 平均二乗誤差が最小の推定量と UMVUE を混同する（UMVUE は不偏推定量の中だけで比べる）。
- 十分統計量の関数でありさえすれば UMVUE だと考える（完備性と不偏性の両方が必要）。
- UMVUE は常にクラーメル・ラオの下限に達すると考える。
