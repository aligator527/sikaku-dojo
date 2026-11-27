---
term: '勾配'
reading: こうばい
en: 'gradient'
aliases: ['勾配ベクトル']
exams: [jdla-e, toukei-dse, suken-1, toukei-1]
summary: '多変数関数の各変数についての偏導関数を並べたベクトル。関数が最も急に増加する方向を向き、大きさはその方向の変化率を表す。'
related: [gradient-descent, hessian-matrix, chain-rule, backpropagation]
formula: '\nabla f(\boldsymbol{x}) = \left(\frac{\partial f}{\partial x_1}, \ldots, \frac{\partial f}{\partial x_n}\right)^{\top}'
---
## 定義

$n$ 変数関数 $f(\boldsymbol{x})$ の**勾配**は、偏導関数を並べたベクトル

$$\nabla f(\boldsymbol{x}) = \left(\frac{\partial f}{\partial x_1}, \ldots, \frac{\partial f}{\partial x_n}\right)^{\top}$$

です（$\operatorname{grad} f$ とも書きます）。$f$ が全微分可能なら、単位ベクトル $\boldsymbol{u}$ 方向の方向微分係数は $\nabla f \cdot \boldsymbol{u}$ で、これが最大になるのは $\boldsymbol{u}$ が $\nabla f$ と同じ向きのときです。

## 性質

- 勾配は等高線（等高面）$f(\boldsymbol{x}) = c$ に直交します。陰関数で表された曲面 $F(x, y, z) = 0$ の接平面の法線ベクトルが $\nabla F$ になるのはこのためです。
- 極値をとる点では $\nabla f = \boldsymbol{0}$ です（停留点）。
- よく使う公式：$\nabla(\boldsymbol{b}^{\top}\boldsymbol{x}) = \boldsymbol{b}$、$\nabla(\boldsymbol{x}^{\top}A\boldsymbol{x}) = (A + A^{\top})\boldsymbol{x}$（$A$ が対称なら $2A\boldsymbol{x}$）、$\nabla\|\boldsymbol{y} - X\boldsymbol{\beta}\|^2 = -2X^{\top}(\boldsymbol{y} - X\boldsymbol{\beta})$。

## 計算例

$f(x, y) = x^2 + 3xy$ なら $\nabla f = (2x + 3y,\ 3x)^{\top}$ で、点 $(1, 1)$ では $(5, 3)^{\top}$ です。この点から最も速く $f$ が増える方向は $(5, 3)$ 方向で、その変化率は $\sqrt{34}$ です。

## 機械学習での役割

勾配降下法は、損失関数の勾配の逆向きにパラメータを動かして最小化します。深層学習では誤差逆伝播法（連鎖律）で全パラメータについての勾配を効率よく計算します。勾配が極端に小さく（大きく）なる現象が勾配消失（勾配爆発）です。

## 試験での問われ方

E資格では、損失関数や各層の出力についての勾配の計算、勾配降下法の更新式、勾配の形状（パラメータと同じ形）を問う問題が多く出ます。統計検定データサイエンスエキスパートでは、二次関数や残差平方和の勾配を求めて最小点や更新後の値を計算します。数検1級では接平面・法線や条件付き極値の問題で使います。

## よくある誤り

- 勾配の向きに進むと関数が減ると考える。勾配は増加方向なので、最小化では $-\nabla f$ の向きに進みます。
- $\nabla(\boldsymbol{x}^{\top}A\boldsymbol{x})$ を、$A$ が対称でないときにも $2A\boldsymbol{x}$ とする。
- 勾配が $\boldsymbol{0}$ の点を必ず最小点だと判断する。極大点や鞍点の可能性があります。
