---
term: ソフトマックス関数
reading: そふとまっくすかんすう
en: softmax function
aliases: [softmax, ソフトマックス]
exams: [jdla-e]
summary: 実数ベクトルを、各成分が正で総和が 1 になる確率ベクトルに変換する関数。多クラス分類の出力層や注意機構の重みの計算に使う。
related: [cross-entropy, activation-function, attention-mechanism]
formula: '\mathrm{softmax}(\boldsymbol{z})_k = \frac{\exp(z_k)}{\sum_{j=1}^{K}\exp(z_j)}'
---
## 定義と性質

$K$ 次元のベクトル $\boldsymbol z$（ロジット）に対して $y_k = e^{z_k}/\sum_j e^{z_j}$ と定めます。

- 各成分は正で、総和は 1。最大のロジットを持つクラスの確率が最大になる（大小関係を保つ）。
- すべての成分に同じ定数を加えても値は変わらない：$\mathrm{softmax}(\boldsymbol z + c\boldsymbol 1) = \mathrm{softmax}(\boldsymbol z)$。
- $K = 2$ のとき、$y_1 = \sigma(z_1 - z_2)$ とシグモイド関数に帰着する。
- 偏導関数（ヤコビ行列）は $\partial y_i/\partial z_j = y_i(\delta_{ij} - y_j)$。

## 数値計算上の注意

$e^{z_k}$ は $z_k$ が大きいとオーバーフローします。定数を加えても値が変わらない性質を使い、$\max_j z_j$ を引いてから計算します。損失計算では $\log\mathrm{softmax}$ を直接 log-sum-exp で計算すると安定です（PyTorch の `F.cross_entropy` はロジットを受け取り内部でこれを行います）。

## 温度パラメータ

$\mathrm{softmax}(\boldsymbol z/T)$ の $T$ を温度といいます。$T \to 0$ で最大成分だけが 1 の one-hot に近づき、$T \to \infty$ で一様分布に近づきます。知識蒸留や、言語モデルの生成時のサンプリングの多様性調整に使われます。

## 試験での問われ方

E資格では、ソフトマックス関数と交差エントロピー誤差を組み合わせたときの勾配 $\boldsymbol y - \boldsymbol t$、オーバーフロー対策のコード、温度パラメータの効果、Attention の重み計算（キー方向で正規化する）が問われます。

## よくある誤り

- 正規化する軸（`dim` / `axis`）を誤る。バッチ次元ではなくクラス次元（Attention ではキー次元）で正規化します。
- `nn.CrossEntropyLoss` にソフトマックス後の確率を渡してしまう（二重にソフトマックスがかかる）。
