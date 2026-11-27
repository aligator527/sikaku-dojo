---
term: '対照学習'
reading: たいしょうがくしゅう
en: 'contrastive learning'
aliases: ['Contrastive learning', 'Contrastive Learning', 'contrastive learning', 'InfoNCE', 'InfoNCE損失']
exams: [jdla-e, toukei-dse]
summary: '似ているべき組（正例）の表現を近づけ、そうでない組（負例）の表現を遠ざけるように学習する方法。ラベルなしで画像や文の表現を学ぶ自己教師あり学習の代表的な手法。'
related: [self-supervised-learning, softmax-temperature, mutual-information, data-augmentation, cross-entropy]
formula: 'L_i = -\log\frac{\exp\bigl(\mathrm{sim}(\boldsymbol z_i, \boldsymbol z_i^{+})/\tau\bigr)}{\sum_{k \ne i}\exp\bigl(\mathrm{sim}(\boldsymbol z_i, \boldsymbol z_k)/\tau\bigr)}'
---
## 考え方

ラベルがなくても、「同じ画像を別々に加工した 2 枚は同じものを写している」「画像とその説明文は対応している」といった関係は分かります。そうした組を正例、ミニバッチ内の他のサンプルとの組を負例として、正例の類似度が負例より高くなるように表現を学習します。

## InfoNCE 損失

上の式は、アンカー $\boldsymbol z_i$ の正例 $\boldsymbol z_i^{+}$ を、正例と負例を合わせた候補の中から当てる「多クラス分類の交差エントロピー」の形をしています。$\mathrm{sim}$ はコサイン類似度、$\tau$ は温度で、分母の $k$ はアンカー自身を除くすべての候補（正例 1 つと負例）を動きます。

例：正例との類似度 $0.8$、負例 2 つとの類似度 $0.2$ と $0.1$、$\tau = 0.5$ なら、スコアは $1.6,\ 0.4,\ 0.2$ で、損失は $-\log\dfrac{e^{1.6}}{e^{1.6} + e^{0.4} + e^{0.2}} \approx 0.437$ です。$\tau$ を小さくすると、似た負例との差をより強く罰するようになります。InfoNCE の最小化は、2 つのビューの表現の相互情報量の下界を大きくすることと解釈されます。

## 代表的な手法

- **SimCLR**：1 枚の画像に 2 種類のランダムなデータ拡張をかけて正例の組を作り、バッチ内の他の画像を負例とする。バッチサイズ $N$ なら 1 つのアンカーに対し負例は $2(N - 1)$ 個です。強いデータ拡張と大きなバッチが重要です。
- **MoCo**：負例の表現をキューにためて、小さなバッチでも多くの負例を使う。
- **CLIP**：画像と説明文の組を正例とし、画像エンコーダとテキストエンコーダを同時に学習する。$N$ 組から作る $N \times N$ の類似度行列で、対角成分（正しい組）を当てます。学習後は「a photo of a …」のような文との類似度でゼロショット分類ができます。

## 距離学習との関係

距離学習（metric learning）でも同じ発想を使います。2 サンプルを比べる Siamese network の contrastive loss、アンカー・正例・負例の 3 サンプルを使う Triplet loss $\max\bigl(0,\ d(\boldsymbol a, \boldsymbol p) - d(\boldsymbol a, \boldsymbol n) + m\bigr)$（$m$ はマージン）などがあります。

## 試験での問われ方

E資格では、InfoNCE 損失の実装（類似度行列とラベルの作り方、温度）、正例と負例の作り方、Triplet loss の計算が出題されます。統計検定データサイエンスエキスパートでは、CLIP の学習とゼロショット分類など、画像と言語の基盤モデルの学習方法として登場します。

## よくある誤り

- 対照学習には人手のクラスラベルが必要だと考える。
- InfoNCE の分母から正例を除いてしまう（正例も候補に含める）。
- Triplet loss で、負例との距離が十分大きくても損失が残ると考える（マージンを超えれば 0）。
