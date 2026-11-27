---
term: 交差エントロピー
reading: こうさえんとろぴー
en: cross entropy
aliases: [クロスエントロピー, 交差エントロピー誤差, クロスエントロピー誤差, バイナリクロスエントロピー]
exams: [jdla-e, toukei-dse]
summary: 真の分布 p のもとで、分布 q に基づく符号の平均符号長を表す量。分類問題の損失関数として使われ、最小化は KL ダイバージェンスの最小化と同じ意味を持つ。
related: [softmax-function, activation-function]
formula: 'H(p, q) = -\sum_{k} p_k \log q_k = H(p) + D_{\mathrm{KL}}(p \parallel q)'
---
## 定義

離散分布 $p, q$ に対して $H(p, q) = -\sum_k p_k\log q_k$ を**交差エントロピー**といいます。エントロピー $H(p) = -\sum_k p_k\log p_k$ と KL ダイバージェンス $D_{\mathrm{KL}}(p\parallel q) = \sum_k p_k\log(p_k/q_k)$ を使うと $H(p, q) = H(p) + D_{\mathrm{KL}}(p\parallel q)$ と分解でき、$D_{\mathrm{KL}} \ge 0$ より $H(p, q) \ge H(p)$ です。

## 損失関数としての交差エントロピー

多クラス分類では、正解の one-hot ベクトル $\boldsymbol t$ を $p$、モデルの出力（ソフトマックス関数の出力）$\boldsymbol y$ を $q$ として

$$L = -\sum_k t_k\log y_k = -\log y_{\text{正解}}$$

を最小化します。$H(\boldsymbol t)$ は定数なので、これは KL ダイバージェンスの最小化、また正解ラベルの対数尤度の最大化（最尤推定）と同じです。2 値分類では $L = -\{t\log y + (1-t)\log(1-y)\}$（バイナリクロスエントロピー）を使います。

## 勾配

ソフトマックス関数（2 値ならシグモイド関数）と組み合わせると、ロジット $\boldsymbol z$ に関する勾配は

$$\frac{\partial L}{\partial \boldsymbol z} = \boldsymbol y - \boldsymbol t$$

と簡潔になります。二乗誤差＋シグモイド関数の組み合わせでは勾配に $\sigma'(z)$ が掛かり、出力が飽和すると学習が遅くなるのに対し、交差エントロピーではそれが起こりません。

## パープレキシティ

言語モデルの評価に使うパープレキシティは、1 トークンあたりの交差エントロピー（自然対数）を $H$ として $e^{H}$ です。「次のトークンを平均何択で迷っているか」と解釈できます。

## 試験での問われ方

E資格では、値の計算（底 2 ならビット、自然対数ならナット）、KL ダイバージェンスとの関係、ソフトマックス関数との組み合わせの勾配、PyTorch の `nn.CrossEntropyLoss` がロジットを受け取ることが問われます。

## よくある誤り

- $H(p, q)$ と $H(q, p)$ は一般に異なる（非対称）。
- $\log 0$ を避けるため、実装では確率に小さな値を足すか、ロジットから log-softmax で直接計算します。
