---
term: '指数分布'
reading: しすうぶんぷ
en: 'exponential distribution'
exams: [toukei-2, toukei-jun1, toukei-1, toukei-dse, suken-1]
summary: '一定の割合でランダムに起こる事象の待ち時間や、劣化しない製品の寿命を表す連続分布。平均 1/λ で、無記憶性をもつ唯一の連続分布。'
related: [poisson-distribution, gamma-distribution, memorylessness, geometric-distribution]
formula: 'f(x) = \lambda e^{-\lambda x}\ (x \geq 0),\qquad P(X > x) = e^{-\lambda x},\qquad E[X] = \frac{1}{\lambda},\quad V[X] = \frac{1}{\lambda^2}'
---
## 定義と性質

密度 $f(x) = \lambda e^{-\lambda x}$（$x \geq 0$、$\lambda > 0$）の分布を、率（強度）$\lambda$ の指数分布といいます。平均 $\theta = 1/\lambda$ を使って $f(x) = \frac{1}{\theta}e^{-x/\theta}$ と書くこともあるので、どちらの母数表示かを確認します。

- 生存関数 $P(X > x) = e^{-\lambda x}$、中央値 $\log 2/\lambda$（平均の約 0.69 倍）。
- 期待値 $1/\lambda$、標準偏差 $1/\lambda$（変動係数は 1）。
- **無記憶性**：$P(X > s + t \mid X > s) = P(X > t)$。すでに $s$ 時間使ったことが、残りの寿命に影響しない。
- **最小値**：独立な $X_i \sim \mathrm{Exp}(\lambda_i)$ の最小値は $\mathrm{Exp}(\lambda_1 + \cdots + \lambda_n)$ に従う。
- **和**：独立な $\mathrm{Exp}(\lambda)$ の $n$ 個の和はガンマ分布（形状 $n$、率 $\lambda$）に従う。
- **ポアソン過程との関係**：単位時間あたり平均 $\lambda$ 回のポアソン過程では、事象の間隔が独立に $\mathrm{Exp}(\lambda)$ に従い、時間 $t$ の発生回数は $Po(\lambda t)$ に従う。

## 計算例

平均寿命 1000 時間の部品（$\lambda = 1/1000$）が 2000 時間以上もつ確率は $e^{-2} \approx 0.135$ です。1000 時間使って壊れていない部品が、さらに 2000 時間もつ確率も無記憶性により同じ $0.135$ です。この部品を 3 個並列ではなく直列に使う（1 個でも壊れれば停止）と、停止までの時間は平均 $1000/3 \approx 333$ 時間の指数分布になります。

## 推定

標本 $X_1, \ldots, X_n$ から、$\lambda$ の最尤推定量は $1/\bar{X}$、平均 $1/\lambda$ の最尤推定量は $\bar{X}$ です。$2\lambda\sum X_i \sim \chi^2(2n)$ を使うと、$\lambda$ の正確な信頼区間が作れます。

## 試験での問われ方

統計検定2級では、待ち時間・寿命の確率計算と期待値が出題されます。準1級・1級では、無記憶性の証明、最小値・和の分布、ポアソン過程との関係、最尤推定・信頼区間・打ち切りデータを含む尤度、ガンマ分布やワイブル分布への拡張が頻出です。

## よくある誤り

- 率 $\lambda$ と平均 $1/\lambda$ を取り違える（「平均 $\lambda$」と書かれた問題もある）。
- 無記憶性を「故障しにくくなる」や「故障しやすくなる」と解釈する。指数分布はハザード（瞬間の故障率）が一定の分布である。
- 直列系（最小値）と並列系（最大値）の寿命分布を取り違える。
