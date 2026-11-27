---
term: 'ラベル平滑化'
reading: らべるへいかつか
en: 'label smoothing'
aliases: ['label smoothing', 'ラベルスムージング']
exams: [jdla-e]
summary: '分類の目標を one-hot ベクトルではなく、正解クラスの確率を少し下げて他のクラスに均等に配った分布にする正則化手法。モデルの過信を抑える。'
related: [cross-entropy, softmax-function, regularization, logit, data-augmentation]
formula: 't_k = (1 - \varepsilon)\,\delta_{ky} + \frac{\varepsilon}{K}'
---
## 定義

クラス数 $K$、正解クラス $y$、平滑化の強さ $\varepsilon$（0.1 程度）に対し、目標分布を

$$t_k = (1 - \varepsilon)\,\delta_{ky} + \frac{\varepsilon}{K}$$

とし、交差エントロピー $-\sum_k t_k\log p_k$（$p_k$ はモデルの予測確率）で学習します（$\delta_{ky}$ は $k = y$ のとき 1）。正解クラスの目標は $1 - \varepsilon + \varepsilon/K$、それ以外は $\varepsilon/K$ になります。PyTorch の `nn.CrossEntropyLoss(label_smoothing=0.1)` はこの定義です。他のクラスに $\varepsilon/(K-1)$ を配り、正解を $1 - \varepsilon$ とする定義もあります。

## なぜ効くのか

one-hot の目標では、損失を 0 に近づけるためにロジットの差を限りなく大きくし続けようとします。その結果、予測確率がほぼ 1 に張りついた過信の強いモデルになり、汎化や確率の較正が悪くなります。ラベル平滑化では目標分布 $\boldsymbol t$ 自体が最小点になるので、ロジットの差は有限の値で止まります。

## 計算例

$K = 5$、$\varepsilon = 0.1$ なら、目標は正解クラスが $0.9 + 0.02 = 0.92$、他の 4 クラスが $0.02$ ずつです。損失を最小にする出力は $p_k = t_k$ なので、正解クラスと他のクラスのロジットの差は

$$\log\frac{0.92}{0.02} = \log 46 \approx 3.83$$

で止まります。

## 性質と注意

- 損失は $H(\boldsymbol t) + D_{\mathrm{KL}}(\boldsymbol t \parallel \boldsymbol p)$ に分解でき、最小値は 0 ではなく $H(\boldsymbol t)$ です。損失の値を平滑化なしの場合と直接比べられません。
- 画像分類や Transformer の機械翻訳などで広く使われます。
- 教師モデルの出力を目標にする知識蒸留では、ラベル平滑化した教師はクラス間の類似の情報が薄れ、蒸留の効果が下がることがあると報告されています。
- 2026 年版の E資格シラバスのキーワードには含まれていませんが、正則化の「目標を変える」方法として問われることがあります。

## 試験での問われ方

目標分布の各成分の計算、最小にするロジットの差の計算、過信を抑える仕組み、正則化の分類（データ・目標・手続き）が問われます。

## よくある誤り

- 正解クラスの目標を $1 - \varepsilon$ とし、$\varepsilon/K$ の加算を忘れる（定義による違いを問題文で確かめる）。
- 平滑化した損失の最小値が 0 になると考える。
- ラベル平滑化を、入力の画像をぼかすデータ拡張と混同する。
