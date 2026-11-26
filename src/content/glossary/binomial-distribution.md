---
term: '二項分布'
reading: にこうぶんぷ
en: 'binomial distribution'
exams: [toukei-2, toukei-jun1, toukei-1, toukei-dse, suken-1]
summary: '成功確率 p の独立な試行を n 回繰り返したときの成功回数が従う離散分布。期待値は np、分散は np(1−p)。'
related: [poisson-distribution, normal-distribution, central-limit-theorem]
formula: 'P(X=k) = \binom{n}{k}p^k(1-p)^{n-k},\qquad E[X]=np,\qquad V[X]=np(1-p)'
---
### 定義と性質

成功確率 $p$ のベルヌーイ試行を独立に $n$ 回行ったときの成功回数 $X$ の分布を $B(n, p)$ と書きます。

- $E[X] = np$、$V[X] = np(1-p)$。標本比率 $\hat{p} = X/n$ では $E[\hat{p}] = p$、$V[\hat{p}] = p(1-p)/n$。
- 成功確率が同じなら再生性をもつ：$B(n_1, p) + B(n_2, p) = B(n_1 + n_2, p)$（独立な場合）。
- $n$ が大きく $p$ が小さい（$np = \lambda$ が一定）ときはポアソン分布 $Po(\lambda)$ で近似できる。
- $np$ と $n(1-p)$ がともに十分大きいときは正規分布 $N(np,\ np(1-p))$ で近似できる。

### 試験での問われ方

2級では、確率の計算、期待値と分散、正規近似（連続修正を含む）、母比率の区間推定・検定が中心です。準1級・1級では、確率母関数・モーメント母関数、最尤推定、超幾何分布（非復元抽出）との違いなどが問われます。

### よくある誤り

- 非復元抽出で試行が独立でないのに二項分布を使う（母集団が小さいときは超幾何分布）。
- 連続修正の向きを誤る。$P(X \leq k)$ は $P(Y \leq k + 0.5)$、$P(X \geq k)$ は $P(Y \geq k - 0.5)$ で近似する。
- 成功回数の分散 $np(1-p)$ と、比率の分散 $p(1-p)/n$ を混同する。
