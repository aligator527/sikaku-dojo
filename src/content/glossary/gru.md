---
term: 'GRU'
reading: じーあーるゆー
en: 'gated recurrent unit'
aliases: ['Gated Recurrent Unit', 'ゲート付き回帰型ユニット', 'リセットゲート', '更新ゲート']
exams: [jdla-e]
summary: 'リセットゲートと更新ゲートの 2 つのゲートで隠れ状態を更新する RNN。LSTM のメモリーセルと出力ゲートを省いた簡略版で、パラメータが約 3/4 で済む。'
related: [lstm, rnn, vanishing-gradient, sigmoid-function]
formula: '\boldsymbol h_t = (1 - \boldsymbol z_t) \odot \boldsymbol h_{t-1} + \boldsymbol z_t \odot \tilde{\boldsymbol h}_t,\qquad \tilde{\boldsymbol h}_t = \tanh\bigl(W\boldsymbol x_t + U(\boldsymbol r_t \odot \boldsymbol h_{t-1}) + \boldsymbol b\bigr)'
---
## 構造

時刻 $t$ の入力 $\boldsymbol x_t$ と直前の隠れ状態 $\boldsymbol h_{t-1}$ から、次の 3 つを計算します（$\sigma$ はシグモイド関数、$\odot$ は要素ごとの積）。

| 名前 | 式 | 役割 |
| --- | --- | --- |
| リセットゲート $\boldsymbol r_t$ | $\sigma(W_r\boldsymbol x_t + U_r\boldsymbol h_{t-1} + \boldsymbol b_r)$ | 候補を作るときに過去の状態をどれだけ使うか |
| 更新ゲート $\boldsymbol z_t$ | $\sigma(W_z\boldsymbol x_t + U_z\boldsymbol h_{t-1} + \boldsymbol b_z)$ | 過去の状態と候補を混ぜる割合 |
| 候補 $\tilde{\boldsymbol h}_t$ | $\tanh\bigl(W\boldsymbol x_t + U(\boldsymbol r_t \odot \boldsymbol h_{t-1}) + \boldsymbol b\bigr)$ | 新しい状態の候補 |

最後に $\boldsymbol h_t = (1 - \boldsymbol z_t)\odot\boldsymbol h_{t-1} + \boldsymbol z_t\odot\tilde{\boldsymbol h}_t$ と混ぜます。$\boldsymbol z_t$ と $1 - \boldsymbol z_t$ をどちらに掛けるかは文献や実装で逆になることがあり（PyTorch の `nn.GRU` は $\boldsymbol z_t$ を $\boldsymbol h_{t-1}$ 側に掛ける）、問題文の式に従って読みます。

## ゲートの働き

- **更新ゲート**：上の式で $\boldsymbol z_t \approx \boldsymbol 0$ なら $\boldsymbol h_t \approx \boldsymbol h_{t-1}$ となり、状態をそのまま引き継ぎます。このとき $\partial\boldsymbol h_t / \partial\boldsymbol h_{t-1}$ が単位行列に近くなり、勾配が時間方向にほとんど減衰せずに伝わります。LSTM の忘却ゲートと入力ゲートを 1 つにまとめた役割です。
- **リセットゲート**：$\boldsymbol r_t \approx \boldsymbol 0$ なら、候補 $\tilde{\boldsymbol h}_t$ は過去の状態を無視して現在の入力だけから作られます。$\boldsymbol h_t$ そのものが 0 になるわけではありません。

## LSTM との比較

| | LSTM | GRU |
| --- | --- | --- |
| ゲート | 忘却・入力・出力の 3 つ | リセット・更新の 2 つ |
| 次の時刻に渡す状態 | 隠れ状態とメモリーセル | 隠れ状態のみ |
| 重みのブロック数 | 4 | 3 |

パラメータ数は、入力次元 $D$、隠れ次元 $H$ のとき $3\{H(D + H) + H\}$ で、LSTM の $4\{H(D + H) + H\}$ の 3/4 です。$D = 10$、$H = 20$ では、バイアスを 2 組持つ PyTorch の実装で GRU が $3 \times (600 + 40) = 1920$ 個、LSTM が $2560$ 個です。性能は多くのタスクで同程度とされます。

## 試験での問われ方

E資格（シラバスのゲート機構：GRU、リセットゲート）では、各ゲートの役割、ゲートの値が 0 や 1 に近いときの振る舞い、勾配消失を緩和する理由、LSTM とのパラメータ数の比較が出題されます。

## よくある誤り

- リセットゲートが 0 だと隠れ状態そのものが 0 になると考える。
- GRU にもメモリーセルと出力ゲートがあると考える。
- パラメータ数を LSTM の 4/3 倍と逆に覚える。
