---
term: 'ベータ分布'
reading: べーたぶんぷ
en: 'beta distribution'
exams: [toukei-jun1, toukei-1, toukei-dse, suken-1, jdla-e]
summary: '0 から 1 の間の値をとる連続分布で、2 つの正の母数によって形が大きく変わる。確率や割合のモデルとして、また二項分布の母数の共役事前分布として使う。'
related: [gamma-distribution, uniform-distribution, binomial-distribution, order-statistic, gamma-function]
formula: 'f(x) = \frac{x^{\alpha-1}(1-x)^{\beta-1}}{B(\alpha, \beta)}\ (0 < x < 1),\qquad E[X] = \frac{\alpha}{\alpha+\beta}'
---
## 定義

$\alpha, \beta > 0$ について、上の密度をもつ分布をベータ分布 $\mathrm{Beta}(\alpha, \beta)$ といいます。正規化定数のベータ関数は $B(\alpha, \beta) = \int_0^1 x^{\alpha-1}(1-x)^{\beta-1}\,dx = \Gamma(\alpha)\Gamma(\beta)/\Gamma(\alpha + \beta)$ です。

## 性質

- 期待値 $\dfrac{\alpha}{\alpha + \beta}$、分散 $\dfrac{\alpha\beta}{(\alpha + \beta)^2(\alpha + \beta + 1)}$。
- 最頻値 $\dfrac{\alpha - 1}{\alpha + \beta - 2}$（$\alpha, \beta > 1$）。
- 形：$\alpha = \beta$ なら $1/2$ について対称。$\mathrm{Beta}(1, 1)$ は一様分布、$\alpha, \beta < 1$ なら U 字型、$\alpha > \beta$ なら右寄りの山。
- $X \sim \mathrm{Beta}(\alpha, \beta)$ なら $1 - X \sim \mathrm{Beta}(\beta, \alpha)$。

## 現れる場面

- **一様分布の順序統計量**：$U(0, 1)$ からの $n$ 個の標本の $k$ 番目に小さい値は $\mathrm{Beta}(k,\ n - k + 1)$ に従う。
- **ガンマ分布の比**：独立な $X \sim \mathrm{Ga}(\alpha, \lambda)$、$Y \sim \mathrm{Ga}(\beta, \lambda)$ について $X/(X + Y) \sim \mathrm{Beta}(\alpha, \beta)$。
- **ベイズ推定**：成功確率 $p$ の事前分布を $\mathrm{Beta}(\alpha, \beta)$ とし、$n$ 回中 $x$ 回成功を観測すると、事後分布は $\mathrm{Beta}(\alpha + x,\ \beta + n - x)$。事後平均 $\dfrac{\alpha + x}{\alpha + \beta + n}$ は、事前平均と標本比率 $x/n$ の加重平均になる。

## 計算例

$\mathrm{Beta}(3, 5)$ の期待値は $3/8 = 0.375$、分散は $15/(64 \times 9) \approx 0.026$ です。

一様な事前分布 $\mathrm{Beta}(1, 1)$ のもとで 10 回中 2 回の成功を観測すると、事後分布は $\mathrm{Beta}(1 + 2,\ 1 + 8) = \mathrm{Beta}(3, 9)$ で、事後平均は $3/12 = 0.25$ です。最尤推定値 $0.2$ より、事前平均 $0.5$ の側に少し寄っています。

## 試験での問われ方

統計検定準1級・1級では、ベータ関数を使った積分によるモーメントの計算、順序統計量の分布、二項分布との共役性による事後分布・事後平均の導出、ガンマ分布との関係が出題されます。統計検定データサイエンスエキスパートでも、クリック率などの割合のベイズ推定に関連して現れます。

## よくある誤り

- 期待値を $\alpha/\beta$ とする（正しくは $\alpha/(\alpha + \beta)$）。
- 事後分布の母数の更新で、成功数と失敗数を逆に足す。
- 正規化定数を $\Gamma(\alpha + \beta)/(\Gamma(\alpha)\Gamma(\beta))$ と $B(\alpha, \beta)$ のどちらで書いているかを混同し、逆数のまま使う。
