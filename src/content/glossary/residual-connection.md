---
term: 残差接続
reading: ざんさせつぞく
en: residual connection
aliases: [スキップ接続, skip connection, ResNet, Residual Block, 残差ブロック]
exams: [jdla-e]
summary: 層の入力を出力に足し合わせる接続。層は入力との差分（残差）だけを学習すればよくなり、非常に深いネットワークでも学習が進む。ResNet で導入された。
related: [vanishing-gradient, batch-normalization, transformer, convolution]
formula: '\boldsymbol{y} = F(\boldsymbol{x}) + \boldsymbol{x}'
---
## 仕組み

いくつかの層からなるブロックの変換を $F(\boldsymbol x)$ とするとき、出力を $\boldsymbol y = F(\boldsymbol x) + \boldsymbol x$ とします。目標の写像 $H(\boldsymbol x)$ を直接学習する代わりに、残差 $F(\boldsymbol x) = H(\boldsymbol x) - \boldsymbol x$ を学習することになります。最適な写像が恒等写像に近い場合、$F$ を 0 に近づけるだけでよいので学習が容易になります。

## 勾配の流れ

逆伝播では $\dfrac{\partial L}{\partial \boldsymbol x} = \dfrac{\partial L}{\partial \boldsymbol y}\left(\dfrac{\partial F}{\partial \boldsymbol x} + I\right)$ となり、恒等写像の項 $I$ を通じて勾配が減衰せずに入力側へ伝わります。これにより、100 層を超えるネットワークでも勾配消失が起きにくくなりました。

## ResNet のブロック構造

- **基本ブロック**：3×3 畳み込みを 2 層重ね、入力を足す。
- **ボトルネック構造**：1×1 畳み込みでチャネル数を減らし、3×3 畳み込みを行い、1×1 畳み込みで元に戻す。深いモデル（ResNet-50 以上）で計算量を抑える。
- 入力と出力の形状（チャネル数・空間サイズ）が異なるときは、ショートカット側に 1×1 畳み込みなどを入れて形状を合わせます。
- **WideResNet**：層を深くする代わりにチャネル数（幅）を増やした派生モデル。

## 他のモデルでの利用

Transformer の各サブ層、U-Net のエンコーダとデコーダを結ぶスキップコネクション（こちらは足し算ではなく連結）、WaveNet の Residual Block など、現在の深層学習モデルの多くが残差接続または類似の接続を使っています。

## 試験での問われ方

E資格では、残差接続が勾配消失を緩和する理由、ボトルネック構造のパラメータ数の比較、形状が合わない場合の処理が問われます。
