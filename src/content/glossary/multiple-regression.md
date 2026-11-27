---
term: '重回帰分析'
reading: じゅうかいきぶんせき
en: 'multiple regression'
aliases: ['重回帰', '重回帰モデル']
exams: [toukei-2, toukei-jun1, toukei-1, toukei-dse]
summary: '2 つ以上の説明変数で目的変数を説明する線形回帰分析。各係数は、他の説明変数を一定にしたときのその変数の効果を表す。'
related: [regression-coefficient, multicollinearity, coefficient-of-determination, least-squares-method, regression-analysis]
formula: '\mathbf{y} = X\boldsymbol{\beta} + \boldsymbol{\varepsilon},\qquad \hat{\boldsymbol{\beta}} = (X^{\top}X)^{-1}X^{\top}\mathbf{y},\qquad V[\hat{\boldsymbol{\beta}}] = \sigma^2(X^{\top}X)^{-1}'
---
## モデル

$p$ 個の説明変数をもつ重回帰モデルは

$$Y_i = \beta_0 + \beta_1 x_{i1} + \cdots + \beta_p x_{ip} + \varepsilon_i$$

で、行列では $\mathbf{y} = X\boldsymbol{\beta} + \boldsymbol{\varepsilon}$（$X$ は先頭列がすべて 1 の $n \times (p+1)$ 行列）と書きます。最小二乗推定量は $\hat{\boldsymbol{\beta}} = (X^{\top}X)^{-1}X^{\top}\mathbf{y}$、誤差分散の不偏推定量は $\hat{\sigma}^2 = S_e/(n - p - 1)$ です。

## 偏回帰係数の意味

係数 $\beta_j$ は「他の説明変数の値を固定したときに、$x_j$ が 1 増えたときの $Y$ の平均の変化」です。$x_j$ を他の説明変数に回帰した残差で $y$ を説明したときの傾きにも等しくなります（フリッシュ・ウォー・ラヴェルの定理）。そのため、単回帰の係数と重回帰の同じ変数の係数は、説明変数どうしに相関があれば一般に異なります。

## 出力表の読み方

| 項目 | 意味 | 自由度 |
| --- | --- | --- |
| 各係数の t 値 | 係数 ÷ 標準誤差。$H_0: \beta_j = 0$ の検定 | $n - p - 1$ |
| F 値 | $H_0: \beta_1 = \cdots = \beta_p = 0$ の検定 | $(p,\ n - p - 1)$ |
| 決定係数 $R^2$ | 当てはまりの良さ | — |
| 自由度調整済み決定係数 | 説明変数の数を考慮した $R^2$ | — |

$F = \dfrac{R^2/p}{(1 - R^2)/(n - p - 1)}$ の関係があります。

## 注意点

- 多重共線性：説明変数どうしの相関が強いと係数の標準誤差が大きくなり、符号が直感と逆になることもある。VIF で確認する。
- 変数の数：説明変数を増やすと $R^2$ は必ず増えるので、自由度調整済み決定係数・AIC・交差検証で比べる。
- 交互作用や 2 乗項を加えると、効果が他の変数の値に依存する関係も表せる。

## 試験での問われ方

統計検定2級では、出力表から予測値の計算、係数の解釈、t 検定・F 検定の判定、自由度の数え方が頻出です。準1級・1級では、行列による導出、推定量の分散共分散行列、部分 F 検定によるモデルの比較、回帰診断、変数選択が問われます。

## よくある誤り

- 残差の自由度を $n - p$ とする（定数項を含めて $p + 1$ 個の係数を推定するので $n - p - 1$）。
- 偏回帰係数を、他の変数を無視した単純な関連の強さと解釈する。
- 単位の異なる変数の係数の大きさを直接比べて、影響の大小を判断する（比べるなら標準化偏回帰係数を使う）。
