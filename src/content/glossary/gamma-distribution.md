---
term: 'ガンマ分布'
reading: がんまぶんぷ
en: 'gamma distribution'
aliases: ['アーラン分布']
exams: [toukei-jun1, toukei-1, toukei-dse, suken-1]
summary: '正の値をとる連続分布で、形状母数と尺度（または率）母数をもつ。指数分布の和の分布として現れ、指数分布やカイ二乗分布を特別な場合として含む。'
related: [exponential-distribution, chi-square-distribution, gamma-function, poisson-distribution, reproductive-property]
formula: 'f(x) = \frac{\lambda^{\alpha}}{\Gamma(\alpha)}x^{\alpha-1}e^{-\lambda x}\ (x > 0),\qquad E[X] = \frac{\alpha}{\lambda},\quad V[X] = \frac{\alpha}{\lambda^2}'
---
## 定義

形状母数 $\alpha > 0$、率母数 $\lambda > 0$ のガンマ分布 $\mathrm{Ga}(\alpha, \lambda)$ の密度は上の式です。尺度母数 $\beta = 1/\lambda$ を使って $f(x) = \frac{1}{\Gamma(\alpha)\beta^\alpha}x^{\alpha-1}e^{-x/\beta}$ と書く流儀もあり、このとき期待値は $\alpha\beta$、分散は $\alpha\beta^2$ です。問題文がどちらで表しているかを最初に確認します。

## 性質

- モーメント母関数：$M(t) = \left(1 - t/\lambda\right)^{-\alpha}$（$t < \lambda$）。
- 再生性：率が同じなら $\mathrm{Ga}(\alpha_1, \lambda) + \mathrm{Ga}(\alpha_2, \lambda) = \mathrm{Ga}(\alpha_1 + \alpha_2, \lambda)$（独立な場合）。
- 定数倍：$X \sim \mathrm{Ga}(\alpha, \lambda)$ なら $cX \sim \mathrm{Ga}(\alpha, \lambda/c)$。
- 最頻値は $(\alpha - 1)/\lambda$（$\alpha \geq 1$）。$\alpha < 1$ では原点で密度が無限大に発散する。
- 独立な $X \sim \mathrm{Ga}(\alpha_1, \lambda)$、$Y \sim \mathrm{Ga}(\alpha_2, \lambda)$ について、$X/(X + Y)$ はベータ分布 $\mathrm{Beta}(\alpha_1, \alpha_2)$ に従い、$X + Y$ と独立。

## 特別な場合

| 母数 | 分布 |
| --- | --- |
| $\alpha = 1$ | 指数分布 $\mathrm{Exp}(\lambda)$ |
| $\alpha = n$（自然数） | アーラン分布：$\mathrm{Exp}(\lambda)$ の $n$ 個の和、ポアソン過程で $n$ 回目の事象が起こるまでの時間 |
| $\alpha = k/2,\ \lambda = 1/2$ | 自由度 $k$ のカイ二乗分布 |

## ポアソン分布との関係

率 $\lambda$ のポアソン過程で $n$ 回目の発生時刻を $T_n \sim \mathrm{Ga}(n, \lambda)$ とすると、「$T_n > t$」と「時間 $t$ までの発生回数 $< n$」は同じ事象なので、$P(T_n > t) = \sum_{k=0}^{n-1} e^{-\lambda t}(\lambda t)^k/k!$ が成り立ちます。また、ベイズ統計ではガンマ分布がポアソン分布の率の共役事前分布になります。

## 試験での問われ方

統計検定準1級・1級では、密度の積分（ガンマ関数への帰着）による期待値・分散の計算、モーメント母関数による再生性の証明、指数分布の和の分布、カイ二乗分布との関係、最尤推定（形状母数の推定は陽に解けない）、ポアソン・ガンマ型の階層モデルが出題されます。

## よくある誤り

- 率母数と尺度母数を取り違え、期待値を $\alpha\lambda$ とする。
- 率が異なるガンマ分布どうしにも再生性を使う。
- 積分 $\int_0^\infty x^{\alpha-1}e^{-\lambda x}\,dx = \Gamma(\alpha)/\lambda^\alpha$ の $\lambda^\alpha$ を落とす。
