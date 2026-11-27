---
term: 'Self-Attention'
reading: せるふあてんしょん
en: 'self-attention'
aliases: ['自己注意', '自己注意機構', 'セルフアテンション', 'Self Attention']
exams: [jdla-e, toukei-dse]
summary: '同じ系列から作ったクエリ・キー・値で注意を計算し、各位置の表現を系列内の全位置の情報の加重平均で更新する仕組み。Transformer の中心となる層。'
related: [attention-mechanism, transformer, masked-self-attention, positional-encoding, softmax-function]
formula: 'Q = XW_Q,\quad K = XW_K,\quad V = XW_V,\qquad \mathrm{SelfAttn}(X) = \mathrm{softmax}\!\left(\frac{QK^{\mathsf T}}{\sqrt{d_k}}\right)V'
---
## 計算

系列の各位置の表現を並べた行列 $X$（$n \times d_{\mathrm{model}}$）から、学習可能な重みでクエリ $Q$、キー $K$、値 $V$ を作ります。スコア行列 $QK^{\mathsf T}/\sqrt{d_k}$（$n \times n$）の各行にソフトマックス関数を適用して重みとし、$V$ の加重平均をとります。出力の $i$ 行目は「位置 $i$ から見て、系列のどの位置がどれだけ関係するか」に応じて全位置の情報を集めたものです。

Source-Target Attention（クロスアテンション）ではクエリとキー・値を別の系列から作りますが、Self-Attention ではすべて同じ系列 $X$ から作る点が違います。

## 性質

| 観点 | Self-Attention | RNN | 畳み込み（カーネル幅 $k$） |
| --- | --- | --- | --- |
| 1 層の計算量 | $O(n^2 d)$ | $O(n d^2)$ | $O(k n d^2)$ |
| 逐次的な演算 | $O(1)$（並列計算できる） | $O(n)$ | $O(1)$ |
| 2 位置間の最大経路長 | $O(1)$ | $O(n)$ | $O(n/k)$（dilated なら $O(\log_k n)$） |

- 任意の 2 位置を 1 ステップで結べるので、長距離の依存関係を捉えやすくなります。
- 系列長 $n$ の 2 乗の計算量とメモリが必要で、長い系列では負担が大きくなります（局所的な注意、Swin Transformer の窓、FlashAttention などの工夫があります）。
- 入力の位置を並べ替えると出力も同じように並べ替わるだけ（置換同変）で、順序の情報を持ちません。そのため位置エンコーディングを加えます。

## Multi-Head での使い方

Transformer では、$d_{\mathrm{model}}$ 次元を $h$ 個のヘッドに分け（各ヘッド $d_k = d_{\mathrm{model}}/h$）、ヘッドごとに Self-Attention を計算して連結し、出力の射影 $W_O$ を掛けます。$W_Q, W_K, W_V, W_O$ はいずれも $d_{\mathrm{model}} \times d_{\mathrm{model}}$ にまとめられるので、パラメータ数はヘッド数によらず $4d_{\mathrm{model}}^2$（とバイアス）です。$d_{\mathrm{model}} = 512$ なら $4 \times 512^2 = 1{,}048{,}576$ 個です。

## マスク

- **パディングマスク**：長さをそろえるために足したパディングの位置をキーとして参照しないよう、スコアを $-\infty$ にします。
- **因果マスク**：デコーダや GPT では、未来の位置を参照しないよう上三角をマスクします（Masked Self-Attention）。

## 試験での問われ方

E資格では、スコア・重み・出力の手計算、$\sqrt{d_k}$ で割る理由、Q・K・V の出どころ、RNN との計算量・経路長の比較、Multi-Head Attention のパラメータ数と形状、PyTorch による実装の穴埋めが出題されます。

## よくある誤り

- Self-Attention は計算量が系列長に比例すると考える（2 乗に比例）。
- ソフトマックス関数をスコア行列の列方向（キーではなくクエリの軸）に適用する。
- ヘッド数を増やすとパラメータ数が比例して増えると考える（$d_k$ を $d_{\mathrm{model}}/h$ にする通常の構成では変わらない）。
- 位置エンコーディングなしでも語順を区別できると考える。
