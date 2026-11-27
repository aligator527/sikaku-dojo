---
term: LSTM
reading: えるえすてぃーえむ
en: long short-term memory
aliases: [長短期記憶, Long Short-Term Memory, 忘却ゲート]
exams: [jdla-e]
summary: 入力ゲート・忘却ゲート・出力ゲートとメモリーセルを持つ RNN。セル状態を加法的に更新することで、長い系列でも勾配が消失しにくい。
related: [vanishing-gradient, attention-mechanism, transformer, rnn, gru]
formula: '\boldsymbol{c}_t = \boldsymbol{f}_t \odot \boldsymbol{c}_{t-1} + \boldsymbol{i}_t \odot \tilde{\boldsymbol{c}}_t,\qquad \boldsymbol{h}_t = \boldsymbol{o}_t \odot \tanh(\boldsymbol{c}_t)'
---
## 構造

時刻 $t$ の入力 $\boldsymbol x_t$ と直前の隠れ状態 $\boldsymbol h_{t-1}$ から、次の 4 つを計算します（$\sigma$ はシグモイド関数）。

| 名前 | 式 | 役割 |
| --- | --- | --- |
| 忘却ゲート $\boldsymbol f_t$ | $\sigma(W_f\boldsymbol x_t + U_f\boldsymbol h_{t-1} + \boldsymbol b_f)$ | 過去のセル状態をどれだけ残すか |
| 入力ゲート $\boldsymbol i_t$ | $\sigma(W_i\boldsymbol x_t + U_i\boldsymbol h_{t-1} + \boldsymbol b_i)$ | 新しい情報をどれだけ書き込むか |
| セル候補 $\tilde{\boldsymbol c}_t$ | $\tanh(W_c\boldsymbol x_t + U_c\boldsymbol h_{t-1} + \boldsymbol b_c)$ | 書き込む内容 |
| 出力ゲート $\boldsymbol o_t$ | $\sigma(W_o\boldsymbol x_t + U_o\boldsymbol h_{t-1} + \boldsymbol b_o)$ | セル状態のどれだけを出力するか |

ゲートの値は $(0, 1)$ の範囲で、要素ごとの積 $\odot$ によって情報の通過量を調整します。

## 勾配が消失しにくい理由

単純な RNN では、時刻を遡るたびに重み行列と活性化関数の微分が掛かり、勾配が指数的に減衰します。LSTM のセル状態は $\boldsymbol c_t = \boldsymbol f_t \odot \boldsymbol c_{t-1} + \cdots$ と加法的に更新されるため、$\partial\boldsymbol c_t/\partial\boldsymbol c_{t-1}$ は主に $\boldsymbol f_t$ で決まり、忘却ゲートが 1 に近ければ勾配がほぼそのまま過去へ伝わります。

## パラメータ数

入力次元 $D$、隠れ次元 $H$ のとき、4 つのブロックそれぞれが $H \times D$、$H \times H$ の重みとバイアスを持つので $4\{H(D+H) + H\}$ です。PyTorch の `nn.LSTM` はバイアスを 2 組（`bias_ih`、`bias_hh`）持つため $4\{H(D+H) + 2H\}$ になります。

## GRU

リセットゲートと更新ゲートの 2 つのゲートで、セル状態と隠れ状態を 1 つにまとめた簡略版です。パラメータは LSTM の約 4 分の 3 で、性能は多くのタスクで同程度とされます。

## 試験での問われ方

E資格では、各ゲートの式の穴埋め、勾配消失を防ぐ仕組み、パラメータ数の計算、GRU との違い、双方向 RNN や seq2seq での使われ方が問われます。
