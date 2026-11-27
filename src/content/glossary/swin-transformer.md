---
term: 'Swin Transformer'
reading: すうぃんとらんすふぉーまー
en: 'Swin Transformer'
aliases: ['Shifted window', 'Shifted Window', 'Shifted Window Attention']
exams: [jdla-e]
summary: '画像を小さな窓に分け、窓の中だけで Self-Attention を計算し、層ごとに窓の位置をずらして隣の窓と情報をやり取りする階層型の Vision Transformer。'
related: [vision-transformer, self-attention, transformer, cnn]
formula: '\Omega(\text{MSA}) = 4hwC^2 + 2(hw)^2C,\qquad \Omega(\text{W-MSA}) = 4hwC^2 + 2M^2hwC'
---
## 仕組み

- **窓（window）での注意**：パッチ（トークン）の格子を $M \times M$（例：$7 \times 7$）の重ならない窓に分け、Self-Attention を窓の中だけで計算します（W-MSA）。
- **ずらした窓（Shifted window）**：次の層では、窓の区切りを $\lfloor M/2 \rfloor$ パッチずつずらして計算します（SW-MSA）。前の層で別々の窓だった領域どうしがつながり、層を重ねると広い範囲の情報が伝わります。
- **階層構造**：最初は $4 \times 4$ 画素のパッチから始め、段階ごとに隣り合う $2 \times 2$ のパッチを統合（patch merging）して解像度を半分、チャネル数を 2 倍にします。CNN のように解像度の違う特徴マップが得られるので、物体検出やセグメンテーションのバックボーンにも使えます。
- 位置の情報は、窓の中の相対位置に応じたバイアスを注意のスコアに足して与えます。

## 計算量

トークンが $h \times w$ 個、チャネル数 $C$ のとき、画像全体での Self-Attention（MSA）は $(hw)^2$ に比例する項を含みますが、窓の中だけの注意（W-MSA）は $hw$ に比例します（上の式）。たとえば $h = w = 56$、$C = 96$、$M = 7$ では、MSA が約 $2.0 \times 10^9$、W-MSA が約 $1.5 \times 10^8$ で、1 桁以上小さくなります。$56 \times 56 = 3136$ 個のトークンは、49 個ずつの 64 個の窓に分かれます。

## ViT との違い

| | ViT | Swin Transformer |
| --- | --- | --- |
| 注意の範囲 | 全パッチ | 窓の中（ずらしながら） |
| 計算量 | トークン数の 2 乗 | トークン数にほぼ比例 |
| 特徴マップ | 単一の解像度 | 階層的（複数の解像度） |
| 分類の出力 | CLS トークン | 最終段の特徴の平均（Global Average Pooling） |

## 試験での問われ方

E資格（シラバス 2026 の Vision Transformer のキーワード：Shifted window）では、窓の中だけで注意を計算する理由（計算量）、窓をずらす目的（窓どうしの情報のやり取り）、階層構造、ViT との違いが出題されます。

## よくある誤り

- Swin Transformer は画像全体で Self-Attention を計算すると考える。
- 窓をずらすのはデータ拡張のためだと考える（窓の間で情報を伝えるため）。
- 計算量が ViT と同じくトークン数の 2 乗で増えると考える。
