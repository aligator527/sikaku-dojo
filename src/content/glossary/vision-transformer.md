---
term: 'Vision Transformer'
reading: びじょんとらんすふぉーまー
en: 'Vision Transformer'
aliases: ['ViT']
exams: [jdla-e, toukei-dse]
summary: '画像を固定サイズのパッチに分割し、各パッチを単語のようなトークンとして Transformer のエンコーダで処理する画像認識モデル。2020 年に提案された。'
related: [transformer, self-attention, swin-transformer, positional-encoding, cnn]
formula: '\text{パッチ数} = \frac{H}{P} \times \frac{W}{P},\qquad \text{系列長} = \frac{HW}{P^2} + 1'
---
## 仕組み

1. 画像（$H \times W \times C$）を $P \times P$ のパッチに分割し、各パッチを $P^2 C$ 次元のベクトルに平坦化する。
2. 線形射影で $D$ 次元に変換する（パッチ埋め込み）。カーネルサイズ・ストライドとも $P$ の畳み込みと同じ計算です。
3. 先頭に学習可能な CLS トークンを加え、学習可能な位置埋め込みを足す。
4. Transformer のエンコーダ（Layer Normalization、Multi-Head Self-Attention、MLP）を重ねる。
5. CLS トークンの最終層の出力を MLP ヘッドに入れて分類する。

## 計算例

ViT-Base/16（$P = 16$、$D = 768$）に $384 \times 384$ の RGB 画像を入れると、パッチは $24 \times 24 = 576$ 個で、CLS トークンを加えた系列長は 577 です。1 パッチは $16 \times 16 \times 3 = 768$ 次元です。画像を大きくすると系列長が増え、Self-Attention の計算量はその 2 乗で増えます。

## CNN との比較

- CNN は局所性と重み共有という画像向けの仮定（帰納バイアス）を構造に組み込んでいますが、ViT はそれが弱く、最初の層から画像全体を参照できます。
- そのため、データが少ないと CNN に劣り、大規模なデータ（JFT-300M など）で事前学習すると CNN を上回ります。ImageNet 程度のデータで学習するには、強いデータ拡張や CNN の教師からの知識蒸留（DeiT）が使われます。

## Swin Transformer

画像を重ならない窓（window）に分け、窓の中だけで Self-Attention を計算します。次の層では窓の位置をずらす Shifted window にして、隣の窓との情報のやり取りを可能にします。パッチを段階的に統合して解像度を下げる階層構造を持ち、計算量は画像サイズにほぼ比例します。物体検出やセグメンテーションのバックボーンとしても使われます。

## 試験での問われ方

E資格（シラバス 2026 のキーワード：Shifted window、CLS token、Position embedding）では、パッチ数・系列長・パッチ埋め込みのパラメータ数の計算、CLS トークンの役割、CNN との帰納バイアスの違い、Swin Transformer の窓の仕組みが出題されます。

## よくある誤り

- 系列長に CLS トークンの 1 を足し忘れる。
- パッチ埋め込みのパラメータ数でバイアスを数え忘れる。
- ViT は少ないデータでも CNN より常に高精度だと考える。
- Swin Transformer は画像全体で Self-Attention を計算すると考える（窓の中だけで計算する）。
