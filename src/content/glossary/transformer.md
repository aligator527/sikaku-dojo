---
term: Transformer
reading: とらんすふぉーまー
en: Transformer
aliases: [トランスフォーマー, Positional Encoding, 位置エンコーディング]
exams: [jdla-e]
summary: 再帰も畳み込みも使わず、注意機構（Self-Attention）と位置ごとの全結合層を積み重ねた系列変換モデル。2017 年に提案され、BERT・GPT などの大規模言語モデルや Vision Transformer の基盤となった。
related: [attention-mechanism, residual-connection, batch-normalization, lstm, softmax-function]
formula: 'PE_{(pos,\,2i)} = \sin\!\left(\frac{pos}{10000^{2i/d_{\mathrm{model}}}}\right),\quad PE_{(pos,\,2i+1)} = \cos\!\left(\frac{pos}{10000^{2i/d_{\mathrm{model}}}}\right)'
---
## 構成

論文 "Attention Is All You Need"（Vaswani ら, 2017）で提案されたエンコーダ・デコーダ構造です。

- **エンコーダ層**：Multi-Head Self-Attention → 位置ごとの全結合層（Feed-Forward Network）。各サブ層に残差接続と Layer Normalization を付ける。
- **デコーダ層**：Masked Multi-Head Self-Attention → Source-Target Attention（エンコーダ出力をキー・値に使う）→ Feed-Forward Network。
- **Positional Encoding**：Attention は入力の順序を区別しないため、位置の情報を埋め込みベクトルに加える。原論文では上の正弦波の式を使い、学習可能な位置埋め込み（BERT など）を使うモデルもある。

## RNN と比べた利点

- 系列の全位置を並列に計算できるので、GPU で効率よく学習できる。
- 任意の 2 位置が 1 ステップで直接結びつくため、長距離の依存関係を捉えやすい（RNN では距離に比例したステップを経由する）。

一方、Self-Attention の計算量は系列長の 2 乗に比例します。

## 派生モデル

- **BERT**：エンコーダのみ。Masked Language Modeling と Next Sentence Prediction で事前学習し、下流タスクでファインチューニングする。
- **GPT 系**：デコーダのみ（Masked Self-Attention）。Next token prediction（自己回帰）で事前学習し、Few-shot / Zero-shot の Prompt Based Learning が可能。
- **Vision Transformer（ViT）**：画像をパッチに分割してトークン列として扱い、CLS トークンの出力で分類する。

## 試験での問われ方

E資格では、エンコーダ・デコーダの構成要素、各 Attention の Q・K・V の出どころ、マスクの役割、Positional Encoding の必要性、BERT と GPT の事前学習タスクの違いが問われます。
