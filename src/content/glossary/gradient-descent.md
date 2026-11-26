---
term: 勾配降下法
reading: こうばいこうかほう
en: gradient descent
aliases: [最急降下法, 確率的勾配降下法, SGD, ミニバッチ学習]
exams: [jdla-e]
summary: 目的関数の勾配の逆方向にパラメータを少しずつ動かして最小値を探す反復法。ミニバッチで勾配を近似するものを確率的勾配降下法（SGD）という。
related: [momentum, adam, backpropagation, hessian-matrix, taylor-expansion]
formula: '\boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t - \eta\,\nabla_{\boldsymbol{\theta}} L(\boldsymbol{\theta}_t)'
---
## 定義

損失関数 $L(\boldsymbol\theta)$ を最小化するために、学習率 $\eta > 0$ を用いて $\boldsymbol\theta \leftarrow \boldsymbol\theta - \eta\nabla L(\boldsymbol\theta)$ を繰り返します。勾配 $\nabla L$ は関数値が最も急に増える方向なので、その逆向きに進むと（$\eta$ が十分小さければ）関数値が減少します。これは 1 次のテイラー近似 $L(\boldsymbol\theta + \boldsymbol h) \approx L(\boldsymbol\theta) + \nabla L^{\mathsf T}\boldsymbol h$ から導かれます。

## 3 つの方式

- **バッチ（最急降下法）**：全訓練データで勾配を計算する。正確だが 1 回の更新が重い。
- **確率的勾配降下法（SGD）**：1 サンプルずつ勾配を計算して更新する。
- **ミニバッチ SGD**：数十〜数百件のミニバッチで勾配を推定する。深層学習の標準で、単に SGD と呼ぶことも多い。勾配のノイズは局所解や鞍点から抜け出す助けにもなります。

## 学習率の影響

- 大きすぎる：振動・発散する。
- 小さすぎる：収束が遅く、平坦な領域や鞍点で停滞する。
- 学習の進行に合わせて学習率を下げるスケジューリング（ステップ減衰、コサイン減衰、ウォームアップなど）が使われます。

## 改良手法

モメンタム、Nesterov Accelerated Gradient、AdaGrad、RMSProp、Adam など。損失曲面の曲率が方向によって大きく異なる（ヘッセ行列の条件数が大きい）場合に、素朴な勾配降下法は谷を横切る方向に振動して進みにくくなることが、改良の主な動機です。

## 試験での問われ方

E資格では、更新式の穴埋め、学習率の大小による挙動、バッチサイズと汎化性能の関係、改良手法との比較が問われます。
