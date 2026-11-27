---
term: 'Masked Self-Attention'
reading: ますくとせるふあてんしょん
en: 'masked (causal) self-attention'
aliases: ['Masked Attention', 'Masked Multi-Head Attention', 'Causal Attention', '因果マスク', 'マスク付き自己注意']
exams: [jdla-e]
summary: '各位置が自分より後ろ（未来）の位置を参照しないよう、スコア行列の上三角を −∞ にしてからソフトマックス関数を適用する Self-Attention。Transformer のデコーダや GPT で使う。'
related: [self-attention, transformer, gpt, seq2seq, softmax-function]
formula: 'M_{ij} = \begin{cases} 0 & (j \le i) \\ -\infty & (j > i) \end{cases},\qquad \mathrm{softmax}\!\left(\frac{QK^{\mathsf T}}{\sqrt{d_k}} + M\right)V'
---
## 目的

言語モデルや翻訳のデコーダは、位置 $i$ のトークンを、それより前のトークンだけから予測しなければなりません。学習時には正解の系列全体を一度に入力して全位置を並列に計算します（教師強制）が、そのままでは Self-Attention が未来の正解を参照して「カンニング」できてしまいます。そこで、クエリ $i$ がキー $j > i$ を参照しないようにマスクをかけます。

## 計算

スコア行列 $S = QK^{\mathsf T}/\sqrt{d_k}$ の上三角（$j > i$）に $-\infty$（実装では非常に大きな負の数）を足し、**行ごと**にソフトマックス関数を適用します。$e^{-\infty} = 0$ なので、未来の位置の重みはちょうど 0 になり、残りの位置の重みの和は 1 になります。

スケーリング後のスコアが

$$S = \begin{pmatrix} 1 & 2 & 0 \\ 0 & 1 & 3 \\ 2 & 0 & 1 \end{pmatrix}$$

のとき、マスク後の重みは

$$\begin{pmatrix} 1 & 0 & 0 \\ 0.269 & 0.731 & 0 \\ 0.665 & 0.090 & 0.245 \end{pmatrix}$$

です。1 行目は自分自身だけを参照するので重みは 1 になります。

## 実装上の注意

- ソフトマックス関数の **後** で未来の位置の重みを 0 にする（0/1 のマスクを掛ける）のではなく、ソフトマックス関数の **前** にスコアへ $-\infty$ を足します。後から 0 にすると重みの和が 1 になりません。
- PyTorch では `torch.triu(torch.ones(n, n), diagonal=1).bool()` のような上三角の真偽値行列を作り、`masked_fill` で $-\infty$ を入れます。
- パディングマスク（パディング位置のキーを参照しない）と組み合わせて使うこともあります。
- 推論時は 1 トークンずつ生成し、過去の位置のキーと値を保存して再利用します（KV キャッシュ）。

## どこで使われるか

- Transformer のデコーダの最初のサブ層（Masked Multi-Head Attention）。2 番目のサブ層の Source-Target Attention はエンコーダの出力を参照するので、因果マスクは不要です。
- GPT などのデコーダのみのモデルのすべての層。
- BERT のようなエンコーダのみのモデルは双方向に参照するので、因果マスクを使いません（MLM で隠すのは入力トークンで、注意のマスクとは別物です）。

## 試験での問われ方

E資格（シラバスのキーワード：Masked Attention）では、マスク後の注意の重みの計算、マスクの形（上三角か下三角か、対角を含むか）、マスクを入れるタイミング、BERT と GPT の違いが出題されます。

## よくある誤り

- 対角成分（自分自身）まで隠してしまう。
- ソフトマックス関数の後で未来の重みを 0 にして、和が 1 にならない重みを使う。
- BERT の MLM のマスクと、注意の因果マスクを同じものだと考える。
