---
term: 'フィッシャー情報量'
reading: ふぃっしゃーじょうほうりょう
en: 'Fisher information'
exams: [toukei-jun1, toukei-1]
summary: '1 つの観測値がパラメータについてもつ情報の量。対数尤度の曲がり具合で表され、不偏推定量の分散の下限や最尤推定量の漸近分散を与える。'
related: [maximum-likelihood-estimation, unbiased-estimator, delta-method]
formula: 'I(\theta) = E\left[\left(\frac{\partial}{\partial\theta}\log f(X;\theta)\right)^2\right] = -E\left[\frac{\partial^2}{\partial\theta^2}\log f(X;\theta)\right]'
---
### 定義

スコア関数 $\frac{\partial}{\partial\theta}\log f(X; \theta)$ の分散をフィッシャー情報量 $I(\theta)$ といいます。正則条件のもとでは、対数尤度の 2 階微分の期待値の符号を反転させたものに等しくなります。独立な $n$ 個の観測では $I_n(\theta) = nI(\theta)$ です。

### 直感的な意味

対数尤度が真の値の近くで鋭くとがっている（曲率が大きい）ほど、データからパラメータを精度よく特定できます。その「とがり具合」の期待値がフィッシャー情報量です。

### 使われ方

- クラーメル・ラオの不等式：不偏推定量の分散は $1/(nI(\theta))$ 以上。等号が成り立つ推定量が有効推定量。
- 最尤推定量の漸近分散は $1/(nI(\theta))$。近似信頼区間 $\hat{\theta} \pm z_{\alpha/2}/\sqrt{nI(\hat{\theta})}$ の構成に使う。

### 代表例（1 観測あたり）

| 分布と母数 | $I(\theta)$ |
| --- | --- |
| ベルヌーイ $p$ | $1/\{p(1-p)\}$ |
| ポアソン $\lambda$ | $1/\lambda$ |
| 正規 $\mu$（$\sigma^2$ 既知） | $1/\sigma^2$ |
| 指数分布（平均 $\theta$） | $1/\theta^2$ |

### よくある誤り

- 2 階微分の符号を反転し忘れて、負の情報量を得る。
- $n$ 倍するのを忘れる。
- 台が母数に依存する分布（一様分布 $U(0, \theta)$ など）にも、正則条件を確認せずに適用する。
