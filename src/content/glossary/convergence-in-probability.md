---
term: '確率収束'
reading: かくりつしゅうそく
en: 'convergence in probability'
exams: [toukei-2, toukei-jun1, toukei-1, toukei-dse]
summary: '確率変数の列が、ある値（または確率変数）から一定以上離れる確率が 0 に近づくという収束の概念。推定量の一致性や大数の弱法則はこの意味で述べられる。'
related: [convergence-in-distribution, law-of-large-numbers, slutsky-theorem, chebyshev-inequality, unbiased-estimator]
formula: 'X_n \xrightarrow{p} c \iff \lim_{n \to \infty} P\left(|X_n - c| > \varepsilon\right) = 0\quad (\forall \varepsilon > 0)'
---
## 定義

任意の $\varepsilon > 0$ について $P(|X_n - X| > \varepsilon) \to 0$（$n \to \infty$）となるとき、$X_n$ は $X$ に確率収束するといい、$X_n \xrightarrow{p} X$ や $\operatorname{plim} X_n = X$ と書きます。統計学では、極限が定数 $c$（母数）の場合がほとんどです。

## 確率収束を示す方法

- **平均二乗誤差が 0 に近づく**：$E[(X_n - c)^2] \to 0$ なら、チェビシェフ（マルコフ）の不等式 $P(|X_n - c| > \varepsilon) \leq E[(X_n - c)^2]/\varepsilon^2$ により確率収束する。推定量なら「バイアス → 0 かつ分散 → 0」で十分。
- **大数の法則**：独立同一分布の標本平均は母平均に確率収束する。
- **連続写像定理**：$X_n \xrightarrow{p} c$ で $g$ が $c$ で連続なら $g(X_n) \xrightarrow{p} g(c)$。

**例**：$n$ で割る標本分散 $\hat{\sigma}^2 = \frac{1}{n}\sum X_i^2 - \bar{X}^2$ は、大数の法則で $\frac{1}{n}\sum X_i^2 \xrightarrow{p} E[X^2]$、$\bar{X} \xrightarrow{p} \mu$ と連続写像定理から $\sigma^2$ に確率収束します。偏りはあっても一致推定量です。

## 他の収束との関係

| 収束の種類 | 意味 |
| --- | --- |
| 概収束（ほとんど確実な収束） | 確率 1 で、数列として $X_n(\omega) \to X(\omega)$ |
| 平均二乗収束 | $E[(X_n - X)^2] \to 0$ |
| 確率収束 | 上の定義 |
| 分布収束 | 分布関数が収束する |

概収束 ⇒ 確率収束、平均二乗収束 ⇒ 確率収束、確率収束 ⇒ 分布収束 が成り立ち、逆は一般に成り立ちません。ただし、定数への分布収束は確率収束と同値です。

## 試験での問われ方

統計検定準1級・1級では、推定量の一致性の証明（平均二乗誤差やチェビシェフの不等式を使う）、収束の種類の包含関係と反例、スルツキーの定理・連続写像定理と組み合わせた漸近分布の導出が出題されます。統計検定2級でも、一致性の意味として「標本サイズを大きくすると推定量が母数に近づく」ことが問われます。

## よくある誤り

- 確率収束を「$X_n$ の期待値が $c$ に近づく」ことと混同する。期待値が近づいても散らばりが残れば確率収束しない。
- 不偏推定量なら一致推定量、またはその逆と考える。不偏性と一致性は別の性質。
- 確率収束から平均二乗収束や概収束が従うと考える。
