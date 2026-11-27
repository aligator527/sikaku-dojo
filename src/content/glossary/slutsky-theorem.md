---
term: 'スルツキーの定理'
reading: するつきーのていり
en: 'Slutsky''s theorem'
aliases: ['スルツキーの補題']
exams: [toukei-jun1, toukei-1]
summary: '分布収束する確率変数の列と、定数に確率収束する列を組み合わせた和・積・商が、極限どうしの和・積・商に分布収束することを保証する定理。'
related: [convergence-in-distribution, convergence-in-probability, central-limit-theorem, delta-method, continuous-mapping-theorem]
formula: 'X_n \xrightarrow{d} X,\ Y_n \xrightarrow{p} c \;\Longrightarrow\; X_n + Y_n \xrightarrow{d} X + c,\quad X_n Y_n \xrightarrow{d} cX,\quad \frac{X_n}{Y_n} \xrightarrow{d} \frac{X}{c}\ (c \neq 0)'
---
## 内容

$X_n \xrightarrow{d} X$、$Y_n \xrightarrow{p} c$（$c$ は定数）なら、上の 3 つの収束が成り立ちます。「定数に確率収束する部分は、極限ではその定数で置き換えてよい」と覚えておくと使いやすくなります。

## 代表的な使い方：未知の分散を推定値で置き換える

中心極限定理 $\sqrt{n}(\bar{X} - \mu)/\sigma \xrightarrow{d} N(0, 1)$ は未知の $\sigma$ を含みます。標本標準偏差 $s$ は $\sigma$ に確率収束するので $\sigma/s \xrightarrow{p} 1$ で、スルツキーの定理から

$$\frac{\sqrt{n}(\bar{X} - \mu)}{s} = \frac{\sqrt{n}(\bar{X} - \mu)}{\sigma} \cdot \frac{\sigma}{s} \xrightarrow{d} N(0, 1)$$

が得られます。母集団が正規分布でなくても、大標本では $\bar{x} \pm 1.96\,s/\sqrt{n}$ で母平均の近似的な 95% 信頼区間が作れる根拠です。母比率の区間 $\hat{p} \pm 1.96\sqrt{\hat{p}(1-\hat{p})/n}$ も同じ理屈で正当化されます。

## 連続写像定理との組合せ

$g$ が連続なら $X_n \xrightarrow{d} X$ から $g(X_n) \xrightarrow{d} g(X)$ が従います（連続写像定理）。たとえば上の統計量の 2 乗は $\chi^2(1)$ に分布収束します。デルタ法も、テイラー展開した剰余項をスルツキーの定理で消すことで証明されます。

## 試験での問われ方

統計検定準1級・1級では、未知の母数を一致推定量で置き換えた統計量の漸近分布、ワルド型の検定統計量・信頼区間の正当化、デルタ法の証明の一部として出題されます。記述式で「どの定理を使ったか」を明示させることもあります。

## よくある誤り

- $Y_n$ が定数ではなく確率変数 $Y$ に分布収束する場合にも適用する。その場合 $X_n + Y_n$ の極限分布は $X$ と $Y$ の同時分布に依存し、一般には定まらない。
- 商の形で $c = 0$ の場合にも使う。
- 確率収束が必要な部分を、分布収束しか示さずに置き換える。
