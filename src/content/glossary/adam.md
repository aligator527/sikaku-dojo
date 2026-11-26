---
term: Adam
reading: あだむ
en: Adam (adaptive moment estimation)
aliases: [AdamW, RMSProp, AdaGrad, 適応的学習率]
exams: [jdla-e]
summary: 勾配の 1 次モーメント（平均）と 2 次モーメント（2 乗の平均）の指数移動平均を使い、パラメータごとに学習率を調整する最適化手法。バイアス補正を行う。
related: [gradient-descent, momentum, weight-decay]
formula: '\hat{m}_t = \frac{m_t}{1-\beta_1^t},\quad \hat{v}_t = \frac{v_t}{1-\beta_2^t},\quad \theta_t = \theta_{t-1} - \eta\,\frac{\hat{m}_t}{\sqrt{\hat{v}_t} + \varepsilon}'
---
## 更新式

勾配 $g_t$ に対して

$$m_t = \beta_1 m_{t-1} + (1-\beta_1)g_t,\qquad v_t = \beta_2 v_{t-1} + (1-\beta_2)g_t^2$$

を計算し、バイアス補正した $\hat m_t, \hat v_t$ で $\theta_t = \theta_{t-1} - \eta\,\hat m_t/(\sqrt{\hat v_t} + \varepsilon)$ と更新します。原論文の推奨値は $\eta = 0.001$、$\beta_1 = 0.9$、$\beta_2 = 0.999$、$\varepsilon = 10^{-8}$ です。

## 系譜

- **AdaGrad**：勾配の 2 乗の**累積和** $h \leftarrow h + g^2$ で学習率を割る。よく更新されるパラメータほど学習率が下がるが、累積し続けるため学習率が 0 に近づいて学習が止まりやすい。
- **RMSProp**：累積和の代わりに**指数移動平均**を使い、AdaGrad の学習率の単調減少を緩和する。
- **Adam**：RMSProp の 2 次モーメントに、モメンタム（1 次モーメント）を組み合わせ、さらにバイアス補正を加えたもの。

## バイアス補正の意味

$m_0 = v_0 = 0$ から始めるため、学習初期の $m_t, v_t$ は 0 側に偏ります。$1 - \beta^t$ で割ると、勾配が一定の場合に $\hat m_t = g$、$\hat v_t = g^2$ となり偏りが消えます。$t$ が大きくなると補正係数は 1 に近づきます。

## AdamW

Adam で L2 正則化項を損失に加えると、その勾配も $\sqrt{\hat v_t}$ で割られてしまい、重み減衰として期待どおりに働きません。重み減衰を勾配の正規化から切り離して $\theta \leftarrow \theta - \eta\lambda\theta$ を別に適用するのが AdamW です。

## 試験での問われ方

E資格では、更新式の穴埋め、バイアス補正の計算、AdaGrad・RMSProp との違い、各ハイパーパラメータの役割が頻出です。
