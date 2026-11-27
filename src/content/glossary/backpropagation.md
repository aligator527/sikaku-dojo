---
term: 誤差逆伝播法
reading: ごさぎゃくでんぱほう
en: backpropagation
aliases: [バックプロパゲーション, 逆伝播, 自動微分, 計算グラフ]
exams: [jdla-e, toukei-dse]
summary: ニューラルネットワークの損失の勾配を、連鎖律に従って出力側から入力側へ順に局所勾配を掛け合わせて効率よく計算する方法。
related: [chain-rule, gradient-descent, vanishing-gradient, jacobian]
formula: '\frac{\partial L}{\partial W} = X^{\mathsf T}\frac{\partial L}{\partial Y},\quad \frac{\partial L}{\partial X} = \frac{\partial L}{\partial Y}W^{\mathsf T}\qquad (Y = XW + \boldsymbol{b})'
---
## 考え方

順伝播で各層の出力を計算して保存しておき、逆伝播では損失 $L$ から出発して、各ノードで「上流から来た勾配 × そのノードの局所勾配」を計算して下流へ渡します。各パラメータの勾配を個別に数値微分するより圧倒的に効率がよく、計算量は順伝播と同程度です。これはリバースモードの**自動微分**の一例です。

## 代表的なノードの逆伝播

| ノード | 順伝播 | 逆伝播（上流の勾配を $\delta$ とする） |
| --- | --- | --- |
| 加算 | $z = x + y$ | $x, y$ にそのまま $\delta$ |
| 乗算 | $z = xy$ | $x$ へ $\delta y$、$y$ へ $\delta x$（入れ替え） |
| 全結合 | $Y = XW + \boldsymbol b$ | $dW = X^{\mathsf T}\delta$、$dX = \delta W^{\mathsf T}$、$d\boldsymbol b = \sum_n \delta_n$ |
| ReLU | $y = \max(0, x)$ | $x > 0$ なら $\delta$、そうでなければ 0 |
| シグモイド | $y = \sigma(x)$ | $\delta\,y(1-y)$ |
| Softmax＋交差エントロピー | $L = -\sum t_k\log y_k$ | $\boldsymbol y - \boldsymbol t$ |

分岐（1 つの値が複数の経路で使われる）がある場合、逆伝播では各経路からの勾配を足し合わせます。

## RNN での逆伝播

時間方向に展開したネットワークに誤差逆伝播法を適用するものを BPTT（Back Propagation Through Time）といいます。系列が長いと勾配が多数の積になり、勾配消失・勾配爆発が起きやすくなります。

## 試験での問われ方

E資格では、計算グラフ上の勾配計算、NumPy で書かれた逆伝播のコードの穴埋め（転置の位置・和をとる軸）、各活性化関数の微分が頻出です。

## よくある誤り

- 行列の勾配で転置の位置や積の順序を誤る。勾配は元の変数と同じ形状になることを使って確認します。
- バイアスの勾配でミニバッチ方向の和をとり忘れる。
