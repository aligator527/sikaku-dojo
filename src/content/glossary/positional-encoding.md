---
term: '位置エンコーディング'
reading: いちえんこーでぃんぐ
en: 'positional encoding'
aliases: ['Positional Encoding', '位置埋め込み', 'Position Embedding', 'Positional Embedding', 'position embedding']
exams: [jdla-e, toukei-dse]
summary: '順序の情報を持たない Self-Attention に語順を伝えるため、各トークンの埋め込みベクトルに位置ごとに決まるベクトルを足すもの。正弦波で作る方法と学習する方法がある。'
related: [transformer, self-attention, vision-transformer, bert]
formula: 'PE_{(pos,\,2i)} = \sin\!\left(\frac{pos}{10000^{2i/d_{\mathrm{model}}}}\right),\qquad PE_{(pos,\,2i+1)} = \cos\!\left(\frac{pos}{10000^{2i/d_{\mathrm{model}}}}\right)'
---
## なぜ必要か

Self-Attention と位置ごとの Feed-Forward Network は、入力トークンの順序を入れ替えると出力も同じように入れ替わるだけ（置換同変）です。このままでは「犬が猫を追う」と「猫が犬を追う」を区別できません。RNN や CNN と違って構造そのものに順序の情報がないので、位置の情報を入力に加えます。

## 正弦波による位置エンコーディング

Transformer の原論文では、上の式で位置 $pos$ の $d_{\mathrm{model}}$ 次元のベクトルを作り、トークンの埋め込み（$\sqrt{d_{\mathrm{model}}}$ 倍したもの）に **足し** ます。連結ではないので次元は変わりません。

- 次元の組 $(2i, 2i+1)$ ごとに周波数 $\omega_i = 1/10000^{2i/d_{\mathrm{model}}}$ が決まり、波長は $2\pi$ から $10000 \cdot 2\pi$ まで幾何級数的に長くなります。低い次元ほど細かく、高い次元ほどゆっくり変化します。
- 学習するパラメータはなく、学習時より長い系列にも式で値を作れます。
- 加法定理から、同じ周波数の組 $(\sin\omega\,pos,\ \cos\omega\,pos)$ は
  $$\begin{pmatrix} \sin\omega(pos + k) \\ \cos\omega(pos + k) \end{pmatrix} = \begin{pmatrix} \cos\omega k & \sin\omega k \\ -\sin\omega k & \cos\omega k \end{pmatrix}\begin{pmatrix} \sin\omega\,pos \\ \cos\omega\,pos \end{pmatrix}$$
  と、$pos$ によらず相対位置 $k$ だけで決まる回転で移り合います。相対的な位置関係を線形変換で扱いやすい形になっています。

例：$d_{\mathrm{model}} = 4$、$pos = 1$ では $(\sin 1,\ \cos 1,\ \sin 0.01,\ \cos 0.01) \approx (0.841,\ 0.540,\ 0.010,\ 1.000)$ です。

## 学習可能な位置埋め込み

BERT や Vision Transformer は、位置ごとのベクトルをパラメータとして学習します（Position Embedding）。表現力は高い一方、学習時の最大長を超える位置には対応できません。BERT ではさらに、文 A・文 B を区別するセグメント埋め込みも足します。

## 相対位置の表現

大規模言語モデルでは、クエリとキーを位置に応じた角度で回転させ、内積が相対位置だけに依存するようにする RoPE（Rotary Position Embedding）や、注意のスコアに距離に応じたバイアスを足す方法も使われます。

## 試験での問われ方

E資格では、位置エンコーディングが必要な理由（置換同変性）、埋め込みへの加え方（加算）、正弦波の式の値の計算、相対位置が回転で表せる性質、学習可能な位置埋め込みとの違いが出題されます。

## よくある誤り

- 位置エンコーディングを埋め込みに連結すると考える（原論文は加算）。
- 原論文の正弦波の位置エンコーディングを学習可能なパラメータだと考える。
- エンコーダは順に処理するので位置エンコーディングは不要と考える。
- 周波数の指数を $i/d_{\mathrm{model}}$ とする（正しくは $2i/d_{\mathrm{model}}$）。
