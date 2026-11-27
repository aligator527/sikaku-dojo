---
term: '全分散の公式'
reading: ぜんぶんさんのこうしき
en: 'law of total variance'
aliases: ['条件付き分散']
exams: [toukei-jun1, toukei-1, toukei-dse, suken-1]
summary: '確率変数の分散を、条件付き分散の期待値（条件の内側のばらつき）と、条件付き期待値の分散（条件の間のばらつき）の和に分解する公式。'
related: [conditional-expectation, variance, conditional-probability, analysis-of-variance]
formula: 'V[X] = E\big[V[X \mid Y]\big] + V\big[E[X \mid Y]\big]'
---
## 内容

条件付き分散 $V[X \mid Y] = E[(X - E[X \mid Y])^2 \mid Y] = E[X^2 \mid Y] - (E[X \mid Y])^2$ を使うと、

$$V[X] = E[V[X \mid Y]] + V[E[X \mid Y]]$$

が成り立ちます。第 1 項は「$Y$ を固定したときに残る $X$ のばらつき」の平均、第 2 項は「$Y$ によって $X$ の平均がどれだけ動くか」です。分散分析の「全平方和 = 群内平方和 + 群間平方和」と同じ構造をしています。

## 導出の要点

$E[X^2] = E[E[X^2 \mid Y]] = E[V[X \mid Y]] + E[(E[X \mid Y])^2]$ から $(E[X])^2 = (E[E[X \mid Y]])^2$ を引くと、右辺の残りが $V[E[X \mid Y]]$ になります。

## 計算例

**ランダムな個数の和**：$N \sim Po(\lambda)$、$X_i$ が $N$ と独立に平均 $\mu$、分散 $\sigma^2$ のとき、$S = X_1 + \cdots + X_N$ は $E[S \mid N] = N\mu$、$V[S \mid N] = N\sigma^2$ なので

$$V[S] = E[N\sigma^2] + V[N\mu] = \lambda\sigma^2 + \lambda\mu^2 = \lambda E[X_1^2]$$

です。

**混合による過分散**：$\lambda$ が平均 $m$、分散 $v$ の分布に従い、$\lambda$ を与えたもとで $X \sim Po(\lambda)$ のとき、$V[X] = E[\lambda] + V[\lambda] = m + v$ となり、平均 $m$ より大きくなります。ポアソン分布より散らばりの大きいデータ（過分散）が生じる仕組みの説明になります。

**一様な成功確率**：$p \sim U(0, 1)$、$X \mid p \sim B(n, p)$ なら $V[X] = E[np(1-p)] + V[np] = n/6 + n^2/12 = n(n+2)/12$ です。

## 試験での問われ方

統計検定準1級・1級では、階層モデル・混合分布の分散、ランダムな個数の和（複合ポアソン分布）の分散、二段抽出法での推定量の分散、ベイズ推定における事前予測分布の分散を求める問題で使われます。記述式では、公式の導出そのものが問われることもあります。

## よくある誤り

- 第 2 項 $V[E[X \mid Y]]$ を落とし、$V[X] = E[V[X \mid Y]]$ とする。
- $V[N\mu] = \mu V[N]$ のように、定数を 2 乗せずに外へ出す（正しくは $\mu^2 V[N]$）。
- 条件付き分散を $E[X^2 \mid Y] - (E[X])^2$ と、条件なしの期待値を混ぜて計算する。
