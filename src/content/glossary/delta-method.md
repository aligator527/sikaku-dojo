---
term: 'デルタ法'
reading: でるたほう
en: 'delta method'
exams: [toukei-jun1, toukei-1]
summary: '漸近正規性をもつ推定量を滑らかな関数で変換したとき、その漸近分布（漸近分散）を 1 次のテイラー展開で求める方法。'
related: [central-limit-theorem, fisher-information, maximum-likelihood-estimation]
formula: '\sqrt{n}\left(g(T_n) - g(\theta)\right) \xrightarrow{d} N\left(0,\ g''(\theta)^2\sigma^2\right)'
---
### 内容

$\sqrt{n}(T_n - \theta) \xrightarrow{d} N(0, \sigma^2)$ で、$g$ が $\theta$ で微分可能かつ $g'(\theta) \neq 0$ なら、

$$\sqrt{n}\left(g(T_n) - g(\theta)\right) \xrightarrow{d} N\left(0,\ g'(\theta)^2\sigma^2\right)$$

が成り立ちます。$g(T_n) \approx g(\theta) + g'(\theta)(T_n - \theta)$ という 1 次近似が根拠で、厳密にはスルツキーの補題を使って示します。

### 代表例

- 対数オッズ $\log\{\hat{p}/(1-\hat{p})\}$ の漸近分散：$1/\{np(1-p)\}$
- $\log\bar{X}$ の漸近分散：$\sigma^2/(n\mu^2)$（変動係数の 2 乗を $n$ で割ったもの）
- 分散安定化変換：ポアソン分布では $2\sqrt{\bar{X}}$ の漸近分散が $1/n$ となり、$\lambda$ に依存しない。二項比率の $\arcsin\sqrt{\hat{p}}$、相関係数のフィッシャーの $z$ 変換も同じ考え方。
- 多変量版：$\sqrt{n}(g(\mathbf{T}_n) - g(\boldsymbol{\theta})) \xrightarrow{d} N(0,\ \nabla g^{\top}\Sigma\,\nabla g)$。比の推定量などに使う。

### 試験での問われ方

準1級では漸近分散の計算と、それを使った近似信頼区間、1級では証明や分散安定化変換の導出が問われます。

### よくある誤り

- 微分係数を 2 乗し忘れる（分散に掛けるのは $g'(\theta)^2$、標準誤差に掛けるのは $|g'(\theta)|$）。
- $g'(\theta) = 0$ となる点でもそのまま使う（その場合は 2 次の展開が必要）。
- 小標本でも近似が良いと過信する。
