---
term: 注意機構
reading: ちゅういきこう
en: attention mechanism
aliases: [アテンション, Attention, Scaled Dot-Product Attention, Self-Attention, Multi-Head Attention]
exams: [jdla-e]
summary: クエリとキーの類似度から重みを計算し、その重みで値（バリュー）を加重平均する仕組み。入力のどの部分に注目するかをデータに応じて動的に決める。
related: [transformer, softmax-function, lstm]
formula: '\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\!\left(\frac{QK^{\mathsf T}}{\sqrt{d_k}}\right) V'
---
## 基本的な考え方

各クエリ $\boldsymbol q$ について、すべてのキー $\boldsymbol k_j$ との類似度（スコア）を計算し、ソフトマックス関数で正規化した重み $a_j$ で値 $\boldsymbol v_j$ を加重平均します。もともとは seq2seq の翻訳モデルで、デコーダが各時刻にエンコーダのどの位置を参照するかを学習するために導入されました。

## Scaled Dot-Product Attention

Transformer で使われる形式で、スコアを内積 $\boldsymbol q^{\mathsf T}\boldsymbol k$ で計算し、$\sqrt{d_k}$ で割ります。$d_k$ が大きいと内積の分散が $d_k$ に比例して大きくなり、ソフトマックス関数が飽和して勾配が小さくなるため、スケーリングで分散を 1 程度に保ちます。

## 種類

- **Self-Attention**：$Q, K, V$ をすべて同じ系列から作る。系列内の任意の 2 位置を 1 ステップで関係づけられる。
- **Source-Target Attention（Cross-Attention）**：クエリをデコーダ側、キーと値をエンコーダ側から作る。
- **Masked Attention**：デコーダで未来の位置を参照しないよう、スコアの該当位置を $-\infty$ にしてからソフトマックス関数を適用する。
- **Multi-Head Attention**：$Q, K, V$ を $h$ 個の部分空間に線形射影し、それぞれで注意を計算して連結・射影する。異なる種類の関係を同時に捉えられる。

## 計算量

系列長 $n$、次元 $d$ のとき、Self-Attention の計算量は $O(n^2 d)$ です。長い系列では系列長の 2 乗のコストが問題になり、Vision Transformer の Shifted window（Swin Transformer）のような局所的な注意などの工夫があります。

## 試験での問われ方

E資格では、Attention の式の穴埋め、$\sqrt{d_k}$ で割る理由、マスクの作り方とソフトマックス関数の軸、Multi-Head Attention のパラメータ数や形状の計算が問われます。
