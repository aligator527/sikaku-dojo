---
term: 連鎖律
reading: れんさりつ
en: chain rule
aliases: [合成関数の微分, チェインルール]
exams: [suken-1, jdla-e]
summary: 合成関数の導関数は、各段階の導関数の積で求められるという法則。多変数では偏導関数の積和（ヤコビ行列の積）になり、誤差逆伝播法の基礎となる。
related: [backpropagation, jacobian, gradient-descent]
formula: '\frac{\partial z}{\partial x} = \sum_{j} \frac{\partial z}{\partial y_j}\frac{\partial y_j}{\partial x}'
---
## 内容

1 変数では $z = f(y),\ y = g(x)$ のとき $\dfrac{dz}{dx} = \dfrac{dz}{dy}\dfrac{dy}{dx}$ です。多変数で $z$ が $y_1, \ldots, y_m$ を通じて $x$ に依存するときは、すべての経路について和をとります。

$$\frac{\partial z}{\partial x} = \sum_{j=1}^m \frac{\partial z}{\partial y_j}\frac{\partial y_j}{\partial x}$$

ベクトルで書けば、ヤコビ行列の積 $J_{z\circ y}(x) = J_z(y)\,J_y(x)$ です。

## 深層学習との関係

ニューラルネットワークは関数の合成なので、損失 $L$ のパラメータに関する勾配は連鎖律で計算できます。出力側から $\partial L/\partial(\text{各層の出力})$ を順に掛け合わせていくのが**誤差逆伝播法**です。計算グラフで 1 つの変数が複数の経路に分岐している場合、逆伝播では各経路から来た勾配を**足し合わせます**。

## 典型的な計算

- シグモイド関数 $\sigma(u)$ の微分は $\sigma(u)(1 - \sigma(u))$。$u = wx + b$ なら $\partial\sigma/\partial w = \sigma(1-\sigma)\,x$。
- 深いネットワークでは勾配が多数の項の積になるため、各項が 1 より小さいと積が指数的に小さくなり（勾配消失）、1 より大きいと発散します（勾配爆発）。

## 試験での問われ方

数検1級では多変数関数の変数変換（極座標への変換など）や偏微分方程式の書き換えで使います。E資格では、計算グラフ上の各ノードの局所勾配から指定されたパラメータの勾配を求める問題として頻出です。

## よくある誤り

- 分岐した経路の勾配を足し忘れる（片方の経路だけで計算する）。
- 行列の場合に積の順序や転置を誤る。形状（shape）を書き出して確認するのが確実です。
