---
term: 'RNN'
reading: あーるえぬえぬ
en: 'recurrent neural network'
aliases: ['リカレントニューラルネットワーク', '再帰型ニューラルネットワーク', '回帰型ニューラルネットワーク', 'Elman RNN']
exams: [jdla-e, toukei-dse]
summary: '前の時刻の隠れ状態を次の時刻の入力に戻す再帰的な構造を持ち、同じ重みを各時刻で使い回して系列データを処理するニューラルネットワーク。'
related: [lstm, gru, bptt, seq2seq, vanishing-gradient]
formula: '\boldsymbol h_t = \tanh\left(W_x\boldsymbol x_t + W_h\boldsymbol h_{t-1} + \boldsymbol b\right),\qquad \boldsymbol y_t = W_y\boldsymbol h_t + \boldsymbol c'
---
## 構造

時刻 $t$ の入力 $\boldsymbol x_t$ と、1 つ前の隠れ状態 $\boldsymbol h_{t-1}$ から新しい隠れ状態 $\boldsymbol h_t$ を計算します。

$$\boldsymbol h_t = \tanh\left(W_x\boldsymbol x_t + W_h\boldsymbol h_{t-1} + \boldsymbol b\right)$$

$\boldsymbol h_t$ はそれまでの入力の要約（記憶）の役割を持ち、必要に応じて各時刻の出力 $\boldsymbol y_t$ を作ります。重み $W_x, W_h$ はすべての時刻で共有されるので、系列の長さによらずパラメータ数は一定です。時間方向に展開すると、時刻の数だけ層を重ねた深いネットワークとみなせます。

## パラメータ数

入力次元 $D$、隠れ状態の次元 $H$ のとき、$W_x$（$H \times D$）、$W_h$（$H \times H$）、バイアスで $H(D + H) + H$ 個です。PyTorch の `nn.RNN` はバイアスを 2 組持つので $H(D + H) + 2H$ で、$D = 10$、$H = 20$ なら $20 \times 30 + 40 = 640$ 個です。

## 学習と勾配の問題

学習は時間方向に展開して誤差逆伝播を行う BPTT で行います。時刻を遡るたびに $W_h^{\mathsf T}$ と $\tanh$ の微分が掛かるので、勾配は

- $W_h$ の大きさ（最大特異値など）が 1 より小さいと指数的に小さくなり（勾配消失）、長期の依存関係を学習できません。
- 1 より大きいと指数的に大きくなることがあります（勾配爆発）。

スカラーの線形 RNN $h_t = w h_{t-1} + x_t$ では $\partial h_T / \partial h_0 = w^T$ で、$w = 0.5$ なら 10 時刻で約 $0.001$、$w = 1.5$ なら約 $57.7$ になります。勾配爆発には勾配クリッピング、勾配消失にはゲート機構を持つ LSTM・GRU が対策になります。

## 構成のバリエーション

- **入出力の対応**：系列 → 1 つの出力（文の分類）、系列 → 系列（品詞タグ付け、言語モデル）、系列 → 別の系列（翻訳：seq2seq）。
- **双方向 RNN**：系列を先頭から読む RNN と末尾から読む RNN を並べ、各時刻で両方の隠れ状態を連結します。各位置で前後両方の文脈を使えますが、未来の入力が必要なので、逐次生成（言語モデルの生成など）には使えません。
- **多層（スタック）RNN**：ある層の隠れ状態の列を次の層の入力にします。

## Transformer との比較

RNN は時刻の順に逐次計算するので並列化しにくく、離れた位置の情報は時刻の数だけステップを経由して伝わります。Self-Attention は全位置を並列に計算でき、任意の 2 位置を 1 ステップで結べるため、現在の大規模な言語モデルでは Transformer が主流です。

## 試験での問われ方

E資格では、順伝播の手計算、パラメータ数、PyTorch の `nn.RNN`・`nn.LSTM` の出力 `output` と `h_n` の形状、勾配消失・爆発の原因と対策、双方向 RNN の性質、Self-Attention との計算量の比較が出題されます。

## よくある誤り

- 時刻ごとに別の重みを持つと考え、パラメータ数を系列長に比例させる。
- 双方向 RNN を、次の単語を予測する言語モデルの生成にそのまま使えると考える。
- 勾配クリッピングで勾配消失も解決できると考える。
