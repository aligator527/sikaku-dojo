---
term: 'BPTT'
reading: びーぴーてぃーてぃー
en: 'backpropagation through time'
aliases: ['Back Propagation Through Time', 'Backpropagation Through Time', '通時的誤差逆伝播法', 'Truncated BPTT', 'truncated BPTT']
exams: [jdla-e]
summary: 'RNN を時間方向に展開して 1 つの深いネットワークとみなし、誤差逆伝播法で勾配を求める方法。共有された重みの勾配は全時刻の勾配の和になる。'
related: [rnn, backpropagation, vanishing-gradient, gradient-clipping, lstm]
formula: '\frac{\partial L}{\partial W_h} = \sum_{t=1}^{T}\frac{\partial L}{\partial \boldsymbol h_t}\,\frac{\partial^{+}\boldsymbol h_t}{\partial W_h},\qquad \frac{\partial L}{\partial \boldsymbol h_{t-1}} = \frac{\partial L_{t-1}}{\partial \boldsymbol h_{t-1}} + \frac{\partial L}{\partial \boldsymbol h_t}\frac{\partial \boldsymbol h_t}{\partial \boldsymbol h_{t-1}}'
---
## 仕組み

RNN の計算 $\boldsymbol h_t = f(W_x\boldsymbol x_t + W_h\boldsymbol h_{t-1})$ を時刻 $1, \dots, T$ について並べると、各時刻が 1 つの層にあたる深いネットワークになります。これに通常の誤差逆伝播法を適用するのが BPTT です。

- 損失は各時刻の損失の和 $L = \sum_t L_t$ とすることが多く、隠れ状態 $\boldsymbol h_t$ への勾配は「その時刻の出力からの勾配」と「次の時刻 $\boldsymbol h_{t+1}$ から戻ってくる勾配」の和になります。
- 重み $W_x, W_h$ は全時刻で共有されているので、その勾配は各時刻で計算した勾配の **和** です（上の式の $\partial^{+}$ は、その時刻の式だけを通した直接の偏微分を表します）。

## 計算例

スカラーの線形 RNN $h_t = w h_{t-1} + u x_t$（$h_0 = 0$）に $x = (1, 2, 1)$ を入れ、$L = h_3$ とします。$w = 0.5$、$u = 1$ では $h_1 = 1$、$h_2 = 2.5$、$h_3 = 2.25$ です。

$$h_3 = u(w^2 x_1 + w x_2 + x_3) \;\Rightarrow\; \frac{\partial L}{\partial u} = w^2 + 2w + 1 = 2.25,\qquad \frac{\partial L}{\partial w} = u(2w x_1 + x_2) = 3$$

$\partial L/\partial w$ は、時刻 3 の直接の寄与 $h_2 = 2.5$ と、時刻 2 の寄与が $w$ 倍されて伝わった $0.5 \times h_1 = 0.5$ の和になっています。

## 勾配消失・爆発

$\partial\boldsymbol h_t / \partial\boldsymbol h_k$（$k < t$）はヤコビ行列 $\partial\boldsymbol h_{s}/\partial\boldsymbol h_{s-1}$ の $t - k$ 個の積になるので、その大きさが 1 より小さければ指数的に消え、大きければ爆発することがあります。長い系列ほど深刻で、LSTM・GRU、勾配クリッピングで対処します。

## Truncated BPTT

系列が非常に長いと、全時刻の中間結果を保存するメモリと計算量が大きくなります。そこで系列を一定の長さのチャンクに区切り、

- 順伝播では隠れ状態を次のチャンクに引き継ぐ（文脈は保つ）。
- 逆伝播はチャンクの中だけで打ち切る。

とするのが Truncated BPTT です。PyTorch では、次のチャンクに渡す前に隠れ状態を `h.detach()` で計算グラフから切り離します。切り離さないと、前のチャンクまで逆伝播しようとしてエラーになったり、計算グラフが伸び続けたりします。打ち切った長さより長い依存関係は直接には学習できません。

## 試験での問われ方

E資格（シラバス 2026 のキーワード）では、展開した計算グラフでの勾配の計算、共有重みの勾配が和になること、勾配消失・爆発との関係、Truncated BPTT の実装（`detach` の位置）が出題されます。

## よくある誤り

- 共有された重みの勾配を最後の時刻の分だけで計算する（全時刻の和をとる）。
- Truncated BPTT で、隠れ状態を毎回 0 に戻してしまう（文脈が失われる）。
- `detach` の代わりに `clone` を使えば計算グラフが切れると考える。
