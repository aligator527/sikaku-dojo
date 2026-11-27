---
term: '連続写像定理'
reading: れんぞくしゃぞうていり
en: 'continuous mapping theorem'
exams: [toukei-jun1, toukei-1]
summary: '確率変数の列が収束するとき、それを連続関数で変換した列も同じ意味で収束するという定理。確率収束・分布収束・概収束のいずれについても成り立つ。'
related: [convergence-in-probability, convergence-in-distribution, slutsky-theorem, delta-method]
formula: 'X_n \xrightarrow{p} X \Rightarrow g(X_n) \xrightarrow{p} g(X),\qquad X_n \xrightarrow{d} X \Rightarrow g(X_n) \xrightarrow{d} g(X)'
---
## 内容

$g$ が連続関数（より一般には、$X$ がとる値の集合の上で、ほとんど確実に連続）なら、

- $X_n \xrightarrow{p} X$ のとき $g(X_n) \xrightarrow{p} g(X)$
- $X_n \xrightarrow{d} X$ のとき $g(X_n) \xrightarrow{d} g(X)$
- $X_n \to X$（概収束）のとき $g(X_n) \to g(X)$（概収束）

が成り立ちます。極限が定数 $c$ の確率収束なら、$g$ が $c$ で連続であれば十分です。

## 使い方の例

- **一致推定量の関数**：$s^2 \xrightarrow{p} \sigma^2$ から $s = \sqrt{s^2} \xrightarrow{p} \sigma$。$\bar{X} \xrightarrow{p} \mu$（$\mu \neq 0$）から $1/\bar{X} \xrightarrow{p} 1/\mu$。指数分布の率の推定量 $1/\bar{X}$ が一致推定量であることも、これで示せる。
- **漸近分布の関数**：$Z_n \xrightarrow{d} N(0, 1)$ なら $Z_n^2 \xrightarrow{d} \chi^2(1)$。ワルド検定統計量の 2 乗形がカイ二乗分布で近似できる根拠になる。
- **ベクトルへの拡張**：$(\bar{X}, \frac{1}{n}\sum X_i^2) \xrightarrow{p} (\mu, E[X^2])$ と連続関数 $g(a, b) = b - a^2$ から、標本分散の一致性が得られる。

## デルタ法との違い

連続写像定理は「極限の分布（または値）」を教えてくれますが、$g(\bar{X})$ が $g(\mu)$ に **どのくらいの速さで、どんな揺らぎで** 近づくかは教えてくれません。$\sqrt{n}(g(\bar{X}) - g(\mu))$ の漸近分布が必要なときは、$g$ の微分可能性を使うデルタ法を用います。

## 試験での問われ方

統計検定準1級・1級では、推定量の一致性の証明（大数の法則と組み合わせる）、検定統計量の漸近分布、スルツキーの定理と並べて「どの定理で正当化されるか」を問う出題があります。記述の正誤問題では、$g$ が連続でない場合に結論が成り立たない例も問われます。

## よくある誤り

- $g$ が極限の点で不連続なのに適用する（例：$X_n \xrightarrow{p} 0$ で $g(x) = 1/x$）。
- 連続写像定理で期待値も収束すると考える。$E[g(X_n)] \to E[g(X)]$ は一般には成り立たず、別の条件（一様可積分性など）が必要。
- 分布収束する 2 つの列の和に適用する。連続写像定理を使うには、2 つの列を組にしたベクトルが同時に分布収束している必要がある。
