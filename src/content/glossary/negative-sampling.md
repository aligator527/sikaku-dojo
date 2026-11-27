---
term: 'ネガティブサンプリング'
reading: ねがてぃぶさんぷりんぐ
en: 'negative sampling'
aliases: ['負例サンプリング', 'Negative Sampling', 'negative sampling']
exams: [jdla-e, toukei-dse]
summary: '語彙全体にわたるソフトマックス関数の計算を避けるため、実際の正例の組と、ノイズ分布から抽出した少数の負例の組を見分ける 2 値分類に置き換えて学習する方法。Word2vec で使われる。'
related: [word2vec, sigmoid-function, softmax-function, contrastive-learning]
formula: 'L = -\log\sigma\left(\boldsymbol u_o^{\mathsf T}\boldsymbol v_c\right) - \sum_{k=1}^{K}\log\sigma\left(-\boldsymbol u_k^{\mathsf T}\boldsymbol v_c\right),\qquad P_n(w) \propto f(w)^{3/4}'
---
## 背景

skip-gram で中心語 $c$ から文脈語 $o$ を予測するとき、ソフトマックス関数を使うと分母に語彙全体（数十万語）の和が必要で、1 回の更新ごとに語彙数に比例する計算がかかります。ネガティブサンプリングはこれを、$K + 1$ 個の 2 値分類に置き換えます。

## 方法

- **正例**：実際にウィンドウ内で共起した（中心語 $c$, 文脈語 $o$）の組。$\sigma(\boldsymbol u_o^{\mathsf T}\boldsymbol v_c)$ を 1 に近づける。
- **負例**：ノイズ分布 $P_n$ から抽出した $K$ 個の単語 $k$ との組。$\sigma(\boldsymbol u_k^{\mathsf T}\boldsymbol v_c)$ を 0 に近づける、つまり $\sigma(-\boldsymbol u_k^{\mathsf T}\boldsymbol v_c)$ を 1 に近づける。

$\boldsymbol v_c$ は中心語の入力側の埋め込み、$\boldsymbol u$ は出力側の埋め込みです。上の損失を最小化すると、更新されるのは $\boldsymbol v_c$ と $K + 1$ 個の $\boldsymbol u$ だけになります。$K$ は小さなデータでは 5〜20、大きなデータでは 2〜5 程度が使われます。

## ノイズ分布

負例は、単語の出現頻度 $f(w)$ の $3/4$ 乗に比例する確率で抽出します。頻度が 81 と 1 の 2 単語なら、そのままでは確率が約 $0.988$ と $0.012$ ですが、$3/4$ 乗すると $27$ と $1$ になり、確率は約 $0.964$ と $0.036$ です。頻度の高い単語ばかりが負例になるのを和らげ、まれな単語も適度に選ばれるようにします。

## 関連する考え方

- 正例と多数の負例を見分けて表現を学ぶ発想は、対照学習（InfoNCE 損失）にも共通しています。
- 語彙全体のソフトマックスを近似する別の方法に、単語を二分木の葉に置く階層的ソフトマックスがあります。
- 推薦システムでも、ユーザーが選ばなかったアイテムを負例として抽出する同様の方法が使われます。

## 試験での問われ方

E資格（シラバス 2026 の WordEmbedding：ネガティブサンプリング）では、ネガティブサンプリングの目的（ソフトマックスの計算量の削減）、損失の式と実装（負例の内積の符号）、ノイズ分布が出題されます。統計検定データサイエンスエキスパートでも、テキストの分散表現の学習の工夫として登場します。

## よくある誤り

- 負例の項で内積の符号を反転し忘れ、$\log\sigma(\boldsymbol u_k^{\mathsf T}\boldsymbol v_c)$ を最大化してしまう。
- 負例を頻度に比例してそのまま抽出すると考える（$3/4$ 乗で補正する）。
- ネガティブサンプリングでも、語彙全体のソフトマックス関数を計算すると考える。
