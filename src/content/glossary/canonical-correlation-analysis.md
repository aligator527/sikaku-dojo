---
term: '正準相関分析'
reading: せいじゅんそうかんぶんせき
en: 'canonical correlation analysis'
aliases: ['正準相関', '正準相関係数', '正準変量']
exams: [toukei-jun1, toukei-1]
summary: '2 組の変数群のそれぞれの線形結合（正準変量）を、互いの相関が最大になるように求めて、変数群どうしの関連を少数の相関（正準相関係数）に要約する多変量解析の手法。'
related: [correlation-coefficient, principal-component-analysis, coefficient-of-determination, discriminant-analysis, eigenvalue]
formula: '\rho_1 = \max_{\mathbf{a},\,\mathbf{b}}\ \mathrm{Corr}(\mathbf{a}^\top\mathbf{x},\ \mathbf{b}^\top\mathbf{y}),\qquad \Sigma_{xx}^{-1}\Sigma_{xy}\Sigma_{yy}^{-1}\Sigma_{yx}\,\mathbf{a} = \rho^2\,\mathbf{a}'
---
## 定義

$p$ 個の変数 $\mathbf{x}$（たとえば学力テストの科目）と $q$ 個の変数 $\mathbf{y}$（たとえば生活習慣の項目）があるとき、合成変数 $u = \mathbf{a}^\top\mathbf{x}$、$v = \mathbf{b}^\top\mathbf{y}$ の相関が最大になるように $\mathbf{a}, \mathbf{b}$ を選びます。得られた $u, v$ を第 1 正準変量、その相関 $\rho_1$ を第 1 正準相関係数といいます。続いて、それまでの正準変量と無相関という条件のもとで相関を最大にして第 2、第 3 の組を求め、全部で $\min(p, q)$ 組が得られます。

## 求め方

分散共分散行列を $\Sigma_{xx},\ \Sigma_{yy},\ \Sigma_{xy}$ とすると、$\rho^2$ は行列 $\Sigma_{xx}^{-1}\Sigma_{xy}\Sigma_{yy}^{-1}\Sigma_{yx}$ の固有値で、$\mathbf{a}$ はその固有ベクトルです。$\mathbf{b}$ は $\Sigma_{yy}^{-1}\Sigma_{yx}\mathbf{a}$ に比例します。正準相関係数は、各変数の尺度を変えても（線形変換しても）変わりません。

## 片方が 1 変数の場合

$\mathbf{x}$ が 1 変数 $x$ なら、正準相関係数は $x$ を $\mathbf{y}$ に回帰したときの重相関係数 $R$ に一致します。標準化した $y_1, y_2$ と $x$ の相関が $r_1 = 0.6,\ r_2 = 0.5$、$y_1$ と $y_2$ の相関が $r_{12} = 0.4$ なら

$$\rho^2 = R^2 = \frac{r_1^2 + r_2^2 - 2r_1r_2r_{12}}{1 - r_{12}^2} = \frac{0.36 + 0.25 - 0.24}{0.84} \approx 0.440$$

で、$\rho \approx 0.664$ です。正準変量 $v$ の係数は、回帰係数 $(0.476,\ 0.310)$ に比例します。

## ほかの手法との関係

| 手法 | 正準相関分析との関係 |
|---|---|
| 重回帰分析 | 一方の群が 1 変数の場合 |
| 判別分析 | 一方の群を所属群のダミー変数にした場合 |
| 主成分分析 | 1 組の変数群の中で分散を最大化する（正準相関は 2 群の間の相関を最大化する） |

## 検定と解釈

$\rho_k = \cdots = \rho_{\min(p,q)} = 0$ の検定には、ウィルクスのラムダ $\Lambda = \prod_k(1 - \hat{\rho}_k^2)$ を使ったバートレットのカイ二乗近似が使われます。解釈には、正準変量の係数よりも、元の変数と正準変量の相関（正準負荷量）の方が安定して読み取りやすいとされます。

## 試験での問われ方

統計検定準1級・1級では、片方が 1 変数の場合に正準相関係数を重相関係数として計算する問題、正準相関の数（$\min(p, q)$）や尺度不変性、固有値問題としての定式化が問われます。

## よくある誤り

- 正準相関係数の個数を $p + q$ や $\max(p, q)$ とする。
- 正準変量の係数の大小だけで変数の重要度を判断する（変数間の相関が強いと係数は不安定になる）。
- 固有値 $\rho^2$ をそのまま正準相関係数とする（正準相関係数は平方根）。
