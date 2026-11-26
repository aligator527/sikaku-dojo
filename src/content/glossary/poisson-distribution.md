---
term: 'ポアソン分布'
reading: ぽあそんぶんぷ
en: 'Poisson distribution'
exams: [toukei-2, toukei-jun1, toukei-1, toukei-dse, suken-1]
summary: '一定の時間や領域の中で、まれな事象が起きる回数のモデルとなる離散分布。期待値と分散がともに λ に等しい。'
related: [binomial-distribution, maximum-likelihood-estimation, delta-method]
formula: 'P(X=k) = \frac{e^{-\lambda}\lambda^k}{k!}\ (k = 0, 1, 2, \ldots),\qquad E[X] = V[X] = \lambda'
---
### 定義と性質

$P(X = k) = e^{-\lambda}\lambda^k/k!$（$k = 0, 1, 2, \ldots$）で表される分布を $Po(\lambda)$ と書きます。

- $E[X] = V[X] = \lambda$
- 再生性：独立なら $Po(\lambda_1) + Po(\lambda_2) = Po(\lambda_1 + \lambda_2)$
- 二項分布 $B(n, p)$ で $np = \lambda$ を一定に保って $n \to \infty$ とした極限（少数の法則）
- ポアソン過程では、一定時間内の発生回数がポアソン分布、発生間隔が指数分布に従う。

### 試験での問われ方

- 2級：確率の計算、期待値と分散。
- 準1級：最尤推定 $\hat{\lambda} = \bar{x}$ とフィッシャー情報量 $1/\lambda$ による区間推定、平方根変換による分散安定化、ポアソン回帰（対数リンク）。
- 1級：母関数による再生性の証明、条件付き分布（$X_1 + X_2 = n$ のもとで $X_1 \sim B(n,\ \lambda_1/(\lambda_1 + \lambda_2))$）など。

### よくある誤り

- 観測する時間の長さを変えたとき、$\lambda$ も比例して変えるのを忘れる（1 時間あたり $\lambda$ なら 3 時間では $3\lambda$）。
- 分散を $\lambda^2$ とする。
- 実データで分散が平均より明らかに大きい（過分散）のに、ポアソン分布を当てはめ続ける。負の二項分布などを検討する。
