---
term: 'Word2vec'
reading: わーどつーべっく
en: 'Word2vec'
aliases: ['word2vec', 'skip-gram', 'Skip-gram', 'skip gram', 'CBOW']
exams: [jdla-e, toukei-dse]
summary: '文脈の単語と中心の単語の間の予測を通して、単語を数百次元の密なベクトル（分散表現）に変換する方法。CBOW と skip-gram の 2 つのモデルがある。2013 年に提案された。'
related: [word-embedding, negative-sampling, n-gram, bag-of-words, sigmoid-function]
formula: '\log\sigma\left(\boldsymbol u_o^{\mathsf T}\boldsymbol v_c\right) + \sum_{k=1}^{K}\log\sigma\left(-\boldsymbol u_k^{\mathsf T}\boldsymbol v_c\right)'
---
## 考え方

「似た文脈に現れる単語は似た意味を持つ」という分布仮説に基づきます。文中の各単語について、前後 $m$ 語（ウィンドウ）の単語との関係を予測するタスクを解かせ、その過程で得られる重みを単語のベクトルとして使います。予測そのものではなく、学習された埋め込みが目的です。

## 2 つのモデル

- **CBOW（Continuous Bag-of-Words）**：周辺の単語の埋め込みの平均から、中心の単語を予測する。学習が速い。
- **skip-gram**：中心の単語から、周辺の各単語を予測する。出現頻度の低い単語の表現が比較的よく学習される。

どちらも、入力側の埋め込み行列（語彙数 $V$ × 次元 $d$）と出力側の埋め込み行列を持つ浅いネットワークです。$V = 10{,}000$、$d = 300$ ならそれぞれ 300 万、合計 600 万個のパラメータです。入力の one-hot ベクトルに埋め込み行列を掛ける操作は、行を 1 つ取り出すだけなので、実装では表引き（Embedding 層）で行います。

## ネガティブサンプリング

出力側で語彙全体のソフトマックス関数を計算すると、語彙数に比例するコストがかかります。ネガティブサンプリングでは、実際に共起した（中心語, 文脈語）の組を正例、ノイズ分布から抽出した $K$ 個の単語との組を負例として、それらを見分ける 2 値分類に置き換えます。$\boldsymbol v_c$ を中心語の入力側の埋め込み、$\boldsymbol u_o$ を実際に共起した文脈語の出力側の埋め込み、$\boldsymbol u_k$ を負例 $k$ の出力側の埋め込みとして、上の式を最大化（符号を反転して最小化）します。ノイズ分布は出現頻度の $3/4$ 乗に比例させるのが一般的です。

例：$\boldsymbol u_o^{\mathsf T}\boldsymbol v_c = 2$、負例 1 個で $\boldsymbol u_1^{\mathsf T}\boldsymbol v_c = 0$ なら、損失は $-\log\sigma(2) - \log\sigma(0) \approx 0.127 + 0.693 = 0.820$ です。

## 得られる表現の性質

- 意味の近い単語はベクトルも近くなり（コサイン類似度が高い）、「king − man + woman ≈ queen」のような加法的な関係が現れることがあります。
- 1 単語に 1 つのベクトルなので、多義語（「銀行」と「土手」の bank）を文脈で区別できません。文脈ごとに表現が変わる BERT などの文脈化埋め込みはこの弱点を解消しました。

## 試験での問われ方

E資格（シラバス 2026 の WordEmbedding：Word2vec、skip-gram、CBOW、ネガティブサンプリング）では、CBOW と skip-gram の入出力の違い、ネガティブサンプリングの目的と損失の実装、one-hot 表現との違いが出題されます。

## よくある誤り

- CBOW と skip-gram の予測の向きを逆に覚える。
- ネガティブサンプリングの損失で、負例の内積の符号を反転し忘れる（$\log\sigma(-\boldsymbol u_k^{\mathsf T}\boldsymbol v_c)$）。
- Word2vec の埋め込みは one-hot 表現と同じく語彙数の次元を持つと考える（低次元で密）。
