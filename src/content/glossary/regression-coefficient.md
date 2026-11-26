---
term: '回帰係数'
reading: かいきけいすう
en: 'regression coefficient'
aliases: ['偏回帰係数', '回帰直線の傾き']
exams: [toukei-2, toukei-jun1, toukei-1, toukei-dse]
summary: '回帰モデルで、説明変数が 1 単位増えたときに、目的変数の予測値（条件付き平均）がどれだけ変化するかを表す係数。'
related: [coefficient-of-determination, multicollinearity, correlation-coefficient, confounding]
formula: '\hat{\beta}_1 = \frac{S_{xy}}{S_{xx}} = r\,\frac{s_y}{s_x},\qquad \hat{\beta}_0 = \bar{y} - \hat{\beta}_1\bar{x}'
---
### 単回帰

最小二乗法による回帰直線 $\hat{y} = \hat{\beta}_0 + \hat{\beta}_1 x$ の傾きは

$$\hat{\beta}_1 = \frac{S_{xy}}{S_{xx}} = r\,\frac{s_y}{s_x},\qquad \hat{\beta}_0 = \bar{y} - \hat{\beta}_1\bar{x}$$

で、回帰直線は必ず点 $(\bar{x}, \bar{y})$ を通ります。

### 重回帰（偏回帰係数）

重回帰 $y = \beta_0 + \beta_1 x_1 + \cdots + \beta_k x_k + \varepsilon$ の係数 $\beta_j$ は、「他の説明変数の値を一定にしたときの $x_j$ の効果」を表します。推定値は $\hat{\beta} = (X^{\top}X)^{-1}X^{\top}y$ で、各係数は t 検定（自由度 $n - k - 1$）で検定します。

- ダミー変数の係数は、基準カテゴリーとの差を表す。
- 目的変数を対数変換したモデルでは、係数 $\beta$ は近似的に「1 単位あたり $100\beta$ % の変化」を表す。
- 単位の異なる変数の影響を比べるには、標準化偏回帰係数を使う。

### 試験での問われ方

2級では出力表からの予測値の計算、係数の解釈、信頼区間と t 検定が中心です。準1級では多重共線性、変数選択、交互作用項、1級ではガウス・マルコフの定理（最良線形不偏推定量）などが問われます。

### よくある誤り

- 回帰係数を因果効果と解釈する（観察データでは交絡の影響を受ける）。
- 単回帰と重回帰で同じ変数の係数が一致すると考える（他の変数を加えると係数は変わりうる。省略変数バイアス）。
- $y$ を $x$ に回帰した傾きの逆数が、$x$ を $y$ に回帰した傾きになると考える（実際は $r\,s_x/s_y$）。
