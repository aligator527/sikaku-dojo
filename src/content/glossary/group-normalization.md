---
term: 'Group Normalization'
reading: ぐるーぷのーまらいぜーしょん
en: 'group normalization'
aliases: ['グループ正規化', 'GroupNorm']
exams: [jdla-e]
summary: 'サンプルごとに、チャネルをいくつかのグループに分け、グループ内のチャネルと空間方向で平均と分散を計算して正規化する手法。バッチサイズに依存しない。'
related: [batch-normalization, layer-normalization, cnn]
formula: '\hat{x}_{n,c,h,w} = \frac{x_{n,c,h,w} - \mu_{n,g}}{\sqrt{\sigma_{n,g}^2 + \varepsilon}},\qquad g = \left\lfloor \frac{c}{C/G} \right\rfloor'
---
## 仕組み

入力の形状を $(N, C, H, W)$、グループ数を $G$ とします。チャネルを $C/G$ 個ずつの $G$ グループに分け、サンプル $n$・グループ $g$ の組ごとに、そのグループの $C/G \times H \times W$ 個の値から平均 $\mu_{n,g}$ と分散 $\sigma_{n,g}^2$ を計算して正規化します。最後にチャネルごとの学習可能なスケール $\gamma_c$ とシフト $\beta_c$ を適用します。

たとえば入力が $(8, 32, 16, 16)$ で $G = 8$ なら、各グループは $4 \times 16 \times 16 = 1024$ 個の値からなり、統計量は $8 \times 8 = 64$ 組計算されます。

## 他の正規化との関係

統計量をとる軸で整理すると、次のようになります。

| 手法 | 統計量をとる範囲（1 組あたり） |
| --- | --- |
| Batch Normalization | 全サンプルの $(N, H, W)$（チャネルごと） |
| Layer Normalization | 1 サンプルの $(C, H, W)$ |
| Instance Normalization | 1 サンプル・1 チャネルの $(H, W)$ |
| Group Normalization | 1 サンプル・1 グループの $(C/G, H, W)$ |

$G = 1$ なら Layer Normalization、$G = C$ なら Instance Normalization と同じ計算になり、Group Normalization はその中間です。Instance Normalization は画像ごと・チャネルごとのコントラストの違いを消すので、スタイル変換などで使われます。

## 利点

- サンプルの軸をまたがないので、バッチサイズが 1〜2 のような小さい場合でも安定します。高解像度の画像を扱う物体検出やセグメンテーションでは 1 GPU あたりのバッチサイズが小さくなりがちで、BN の代わりに使われます。
- 学習時と推論時で計算が同じで、移動平均を保持する必要がありません。

## 試験での問われ方

E資格（シラバス 2026 の正規化のキーワード：Batch・Layer・Instance・Group Normalization）では、NumPy 実装で平均をとる軸を選ぶ問題、各手法の統計量の範囲、$G$ を極端にしたときにどの手法と一致するか、小さいバッチで BN より有利な理由が出題されます。

## よくある誤り

- 平均をとる軸にサンプルの軸 0 を含めてしまう（それではバッチに依存する）。
- グループの軸まで平均して Layer Normalization と同じ計算にしてしまう。
- $G = C$ のときを Layer Normalization、$G = 1$ のときを Instance Normalization と逆に覚える。
