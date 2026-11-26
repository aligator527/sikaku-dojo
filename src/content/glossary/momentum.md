---
term: モーメンタム
reading: もーめんたむ
en: momentum
aliases: [Momentum, 慣性項, Nesterov Accelerated Gradient, NAG]
exams: [jdla-e]
summary: 過去の更新方向を指数移動平均で蓄積し、慣性のように更新に加える勾配降下法の改良。振動を抑えて谷に沿った方向の進みを速める。
related: [gradient-descent, adam, hessian-matrix]
formula: '\boldsymbol{v}_{t+1} = \alpha\,\boldsymbol{v}_t - \eta\,\nabla L(\boldsymbol{\theta}_t),\qquad \boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t + \boldsymbol{v}_{t+1}'
---
## 定義

速度 $\boldsymbol v$ を導入し、$\boldsymbol v \leftarrow \alpha\boldsymbol v - \eta\nabla L$、$\boldsymbol\theta \leftarrow \boldsymbol\theta + \boldsymbol v$ と更新します。$\alpha$（0.9 程度がよく使われる）はモーメンタム係数で、過去の勾配が指数的に減衰しながら足し合わされます。勾配が一定なら、実効的な学習率は $\eta/(1-\alpha)$ 倍（$\alpha = 0.9$ で 10 倍）に近づきます。

## 効果

損失曲面が細長い谷になっている場合（Pathological Curvature）、素朴な勾配降下法は谷の壁の間を往復します。モメンタムでは、往復する成分は符号が交互に変わるため打ち消し合い、谷底に沿った一定方向の成分は蓄積されるため、振動を抑えつつ速く進めます。

## Nesterov Accelerated Gradient（NAG）

現在位置ではなく、慣性で進んだ先の位置 $\boldsymbol\theta + \alpha\boldsymbol v$ で勾配を評価します。

$$\boldsymbol v \leftarrow \alpha\boldsymbol v - \eta\nabla L(\boldsymbol\theta + \alpha\boldsymbol v),\qquad \boldsymbol\theta \leftarrow \boldsymbol\theta + \boldsymbol v$$

「行き過ぎ」を先読みして補正できるため、通常のモメンタムより振動が小さくなりやすいとされます。

## 試験での問われ方

E資格では、更新式の穴埋め（どの位置で勾配を評価するか）、$\alpha$ の役割、AdaGrad・RMSProp・Adam との比較が問われます。Adam の 1 次モーメント $m_t$ はモメンタムと同じ発想です。

## よくある誤り

- 実装によって式の形が異なる（$\boldsymbol v \leftarrow \alpha\boldsymbol v + \nabla L$、$\boldsymbol\theta \leftarrow \boldsymbol\theta - \eta\boldsymbol v$ とする PyTorch の SGD など）。どちらも本質は同じですが、学習率の掛かる位置に注意します。
