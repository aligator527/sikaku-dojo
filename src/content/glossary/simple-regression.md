---
term: '単回帰分析'
reading: たんかいきぶんせき
en: 'simple linear regression'
aliases: ['単回帰', '単回帰モデル']
exams: [toukei-2, toukei-jun1, toukei-1, toukei-dse]
summary: '1 つの説明変数 x で目的変数 y を直線 y = β₀ + β₁x で説明する回帰分析。散布図に最もよく当てはまる直線を最小二乗法で求める。'
related: [regression-coefficient, correlation-coefficient, coefficient-of-determination, least-squares-method, residual]
formula: '\hat{\beta}_1 = \frac{S_{xy}}{S_{xx}},\qquad \hat{\beta}_0 = \bar{y} - \hat{\beta}_1\bar{x},\qquad \mathrm{SE}(\hat{\beta}_1) = \frac{\hat{\sigma}}{\sqrt{S_{xx}}}'
---
## モデルと推定

単回帰モデルは $Y_i = \beta_0 + \beta_1 x_i + \varepsilon_i$（$\varepsilon_i$ は独立に $N(0, \sigma^2)$）です。最小二乗法による推定値は

$$\hat{\beta}_1 = \frac{S_{xy}}{S_{xx}} = r\,\frac{s_y}{s_x},\qquad \hat{\beta}_0 = \bar{y} - \hat{\beta}_1\bar{x}$$

で、回帰直線は点 $(\bar{x}, \bar{y})$ を通ります。誤差分散は $\hat{\sigma}^2 = S_e/(n-2)$ で推定します（推定した係数が 2 個なので自由度 $n - 2$）。

## 推測

- 傾きの検定：$t = \hat{\beta}_1/\mathrm{SE}(\hat{\beta}_1)$、$\mathrm{SE}(\hat{\beta}_1) = \hat{\sigma}/\sqrt{S_{xx}}$ で、$H_0: \beta_1 = 0$ のもと $t(n-2)$ に従う。
- 傾きの信頼区間：$\hat{\beta}_1 \pm t_{\alpha/2}(n-2)\,\mathrm{SE}(\hat{\beta}_1)$。
- 相関係数との関係：$t = r\sqrt{n-2}/\sqrt{1 - r^2}$ で、傾きの t 検定と無相関の検定は同じ結果になる。たとえば $n = 12$、$r = 0.6$ なら $t = 0.6\sqrt{10}/0.8 \approx 2.37$。
- 決定係数：$R^2 = r^2$。
- $x_0$ における平均の推定と予測：平均 $E[Y \mid x_0]$ の標準誤差は $\hat{\sigma}\sqrt{1/n + (x_0 - \bar{x})^2/S_{xx}}$、新しい観測値の予測ではこれに誤差の分を加えて $\hat{\sigma}\sqrt{1 + 1/n + (x_0 - \bar{x})^2/S_{xx}}$。$x_0$ が $\bar{x}$ から離れるほど区間は広がる。

## 試験での問われ方

統計検定2級では、平均・分散・共分散や相関係数から回帰直線を求める計算、出力表からの予測値と係数の t 検定、決定係数と相関係数の関係が最頻出です。準1級・1級では、推定量の期待値・分散の導出、予測区間、$x$ と $y$ を入れ替えた回帰との関係、平均への回帰が問われます。

## よくある誤り

- 誤差分散の推定で $n - 1$ や $n$ で割る（単回帰では $n - 2$）。
- $y$ を $x$ に回帰した傾き $\hat{\beta}_1$ の逆数を、$x$ を $y$ に回帰した傾きとする（正しくは $r\,s_x/s_y$ で、$|r| < 1$ なら一致しない）。
- 平均の信頼区間と、個々の観測値の予測区間を取り違える（予測区間の方が広い）。
