---
term: 'ARMAモデル'
reading: あーまもでる
en: 'ARMA model'
aliases: ['ARMA', '自己回帰移動平均モデル']
exams: [toukei-jun1, toukei-1, toukei-dse]
summary: '自己回帰（AR）の部分と移動平均（MA）の部分を組み合わせた定常時系列のモデル。少ないパラメータで多様な自己相関の形を表せる。'
related: [ar-model, ma-model, invertibility, arima-model, autocorrelation-function]
formula: '\phi(B)X_t = \theta(B)\varepsilon_t,\qquad \phi(B) = 1 - \phi_1 B - \cdots - \phi_p B^p,\quad \theta(B) = 1 + \theta_1 B + \cdots + \theta_q B^q'
---
## 定義

ARMA($p, q$) モデルは

$$X_t = \phi_1 X_{t-1} + \cdots + \phi_p X_{t-p} + \varepsilon_t + \theta_1\varepsilon_{t-1} + \cdots + \theta_q\varepsilon_{t-q}$$

です（平均 0 の場合。$B$ はラグ作用素 $BX_t = X_{t-1}$）。

- **定常条件**：$\phi(z) = 0$ の根がすべて単位円の外。このとき MA($\infty$) 表現 $X_t = \sum_{j \geq 0}\psi_j\varepsilon_{t-j}$ をもつ。
- **反転可能条件**：$\theta(z) = 0$ の根がすべて単位円の外。このとき AR($\infty$) 表現をもつ。
- **共通根**：$\phi(z)$ と $\theta(z)$ に共通の因子があると約分でき、より低い次数のモデルと同じになる（たとえば $\phi = -\theta$ の ARMA(1,1) はホワイトノイズ）。

## ARMA(1,1) の性質

$X_t = \phi X_{t-1} + \varepsilon_t + \theta\varepsilon_{t-1}$ では

$$\gamma(0) = \frac{1 + 2\phi\theta + \theta^2}{1 - \phi^2}\sigma^2,\qquad \rho(1) = \frac{(1 + \phi\theta)(\phi + \theta)}{1 + 2\phi\theta + \theta^2},\qquad \rho(h) = \phi\,\rho(h-1)\ \ (h \geq 2)$$

です。ラグ 1 の値は MA の部分で決まり、その後は AR(1) と同じ比率 $\phi$ で減衰します。MA($\infty$) 表現の係数は $\psi_0 = 1$、$\psi_j = \phi^{j-1}(\phi + \theta)$（$j \geq 1$）です。

計算例：$\phi = 0.5,\ \theta = 0.4$ なら $\gamma(0) = 1.56\sigma^2/0.75 = 2.08\sigma^2$、$\rho(1) = 1.2 \times 0.9/1.56 \approx 0.692$、$\rho(2) \approx 0.346$。

## モデルの作り方（ボックス・ジェンキンス法）

1. **同定**：系列が定常か確かめ（必要なら差分）、自己相関・偏自己相関の形から $p, q$ の候補を挙げる。両方とも減衰していれば ARMA を考える。
2. **推定**：最尤法（または条件付き最小二乗法）で係数を推定する。
3. **診断**：残差がホワイトノイズか（コレログラム、リュン・ボックス検定）を確かめ、AIC・BIC で候補を比べる。

同じ当てはまりなら、パラメータの少ないモデルを選ぶ（倹約の原理）。高次の AR で近似するより、低次の ARMA の方が少ないパラメータで済むことがよくあります。

## 試験での問われ方

統計検定準1級・1級では、ARMA(1,1) の自己相関・分散の計算、定常性と反転可能性の判定、MA($\infty$) 表現の係数、AIC による次数選択の結果の読み取りが出題されます。データサイエンスエキスパートでは、時系列予測モデルの候補として解釈が問われます。

## よくある誤り

- 定常条件を MA 側の多項式で、反転可能条件を AR 側の多項式で判定する（逆）。
- ARMA(1,1) の自己相関がラグ 1 から $\phi^h$ で減衰すると考える（$\rho(1)$ は $\phi$ と異なり、比率 $\phi$ で減るのはラグ 2 以降）。
- 共通根があるのに、そのまま高い次数のモデルとして推定する（推定が不安定になる）。
