---
term: '二項係数'
reading: にこうけいすう
en: 'binomial coefficient'
aliases: ['二項定理']
exams: [suken-1, toukei-dse, toukei-1, toukei-2]
summary: 'n 個から k 個を選ぶ組合せの数 C(n, k)。(a + b)ⁿ を展開したときの係数（二項定理）として現れる。'
related: [binomial-distribution, inclusion-exclusion-principle, taylor-expansion]
formula: '\binom{n}{k} = \frac{n!}{k!\,(n-k)!},\qquad (a + b)^n = \sum_{k=0}^n \binom{n}{k} a^k b^{n-k}'
---
## 定義

異なる $n$ 個から $k$ 個を選ぶ組合せの数を**二項係数**といい、$\binom{n}{k}$ または ${}_n\mathrm{C}_k$ と書きます。

$$\binom{n}{k} = \frac{n!}{k!\,(n-k)!} = \frac{n(n-1)\cdots(n-k+1)}{k!}$$

**二項定理** $(a + b)^n = \sum_{k=0}^n \binom{n}{k} a^k b^{n-k}$ の係数になることが名前の由来です。

## 主な性質

- 対称性：$\binom{n}{k} = \binom{n}{n-k}$
- パスカルの法則：$\binom{n}{k} = \binom{n-1}{k-1} + \binom{n-1}{k}$（特定の 1 個を選ぶか選ばないかで分ける）
- 和：$\sum_{k=0}^n \binom{n}{k} = 2^n$、$\sum_{k=0}^n (-1)^k \binom{n}{k} = 0$（$n \ge 1$）
- ヴァンデルモンドの恒等式：$\sum_j \binom{m}{j}\binom{n}{k-j} = \binom{m+n}{k}$。例えば $m = 3,\ n = 4,\ k = 3$ で両辺とも 35 です。
- $k\binom{n}{k} = n\binom{n-1}{k-1}$。二項分布の期待値 $np$ の計算でこれを使います。

## 一般化

$\alpha$ が実数のとき $\binom{\alpha}{k} = \frac{\alpha(\alpha-1)\cdots(\alpha-k+1)}{k!}$ と定めると、$|x| < 1$ で

$$(1 + x)^{\alpha} = \sum_{k=0}^{\infty} \binom{\alpha}{k} x^k$$

が成り立ちます（一般二項展開）。$\sqrt{1 + x} \approx 1 + \frac{x}{2} - \frac{x^2}{8}$ のような近似計算や、負の二項分布の確率の式に現れます。

## 試験での問われ方

数検1級では、二項定理を使った和の計算や恒等式の証明、一般二項展開による近似値の計算が出ます。統計検定では、二項分布・超幾何分布の確率、組合せの数え上げ、順位にもとづく検定の帰無分布の計算で二項係数を扱います。

## よくある誤り

- 順列の数 $n!/(n-k)!$ と組合せの数 $n!/\{k!(n-k)!\}$ を取り違える。
- 二項定理で、項の指数（$a^k b^{n-k}$）と係数の対応をずらす。
- 一般二項展開を $|x| \ge 1$ でも使う。収束が保証されるのは $|x| < 1$ の範囲です。
