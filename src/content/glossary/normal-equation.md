---
term: '正規方程式'
reading: せいきほうていしき
en: 'normal equation'
exams: [toukei-2, toukei-jun1, toukei-1, toukei-dse]
summary: '最小二乗法で、残差平方和を各係数で偏微分して 0 とおいた連立 1 次方程式。行列では XᵀXβ = Xᵀy と書け、その解が最小二乗推定量になる。'
related: [least-squares-method, regression-analysis, multicollinearity, residual]
formula: 'X^{\top}X\,\hat{\boldsymbol{\beta}} = X^{\top}\mathbf{y}'
---
## 導出

残差平方和 $S(\boldsymbol{\beta}) = (\mathbf{y} - X\boldsymbol{\beta})^{\top}(\mathbf{y} - X\boldsymbol{\beta})$ を $\boldsymbol{\beta}$ で微分すると $-2X^{\top}(\mathbf{y} - X\boldsymbol{\beta})$ です。これを 0 とおいた

$$X^{\top}X\,\boldsymbol{\beta} = X^{\top}\mathbf{y}$$

を正規方程式といいます。$X^{\top}X$ が正則（$X$ の列が一次独立）なら、解は $\hat{\boldsymbol{\beta}} = (X^{\top}X)^{-1}X^{\top}\mathbf{y}$ と一意に定まります。

## 単回帰の場合

$y = \beta_0 + \beta_1 x$ では

$$\begin{cases} n\beta_0 + \beta_1\sum x_i = \sum y_i \\ \beta_0\sum x_i + \beta_1\sum x_i^2 = \sum x_i y_i \end{cases}$$

で、1 本目から $\bar{y} = \beta_0 + \beta_1\bar{x}$（回帰直線が平均の点を通る）、両式から $\hat{\beta}_1 = S_{xy}/S_{xx}$ が得られます。

## 幾何学的な意味

正規方程式は $X^{\top}(\mathbf{y} - X\hat{\boldsymbol{\beta}}) = \mathbf{0}$、つまり「残差ベクトルが $X$ のすべての列と直交する」ことを表しています。当てはめ値 $\hat{\mathbf{y}} = X\hat{\boldsymbol{\beta}}$ は、$\mathbf{y}$ を $X$ の列空間へ正射影したもので、射影行列（ハット行列）$H = X(X^{\top}X)^{-1}X^{\top}$ を使うと $\hat{\mathbf{y}} = H\mathbf{y}$ です。定数項の列 $\mathbf{1}$ と直交することから、残差の和が 0 になります。

## 解が一意に定まらない場合

説明変数の間に完全な一次従属関係がある（ダミー変数をカテゴリーの数だけ入れた、同じ変数を単位を変えて重複して入れた）と、$X^{\top}X$ は特異になり、解が無数に存在します。ほぼ従属に近い（多重共線性）場合も、$X^{\top}X$ の逆行列の要素が大きくなり、推定が不安定になります。リッジ回帰は $X^{\top}X + \lambda I$ とすることでこれを安定させます。

## 試験での問われ方

統計検定2級では、単回帰の正規方程式から係数を求める計算が出ます。準1級・1級・データサイエンスエキスパートでは、行列微分による導出、射影としての解釈、$X^{\top}X$ が特異になる条件、数値計算での解き方（逆行列を直接求めず QR 分解やコレスキー分解を使う）が問われます。

## よくある誤り

- 微分の結果の符号や転置を誤り、$XX^{\top}$ と書く。
- 正規方程式の「正規」を正規分布と関係があると考える（直交（normal）を意味し、誤差の分布の仮定は不要）。
- $X^{\top}X$ が特異でも逆行列で解けると考える。
