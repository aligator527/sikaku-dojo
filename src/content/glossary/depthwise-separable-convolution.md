---
term: 'depthwise separable畳み込み'
reading: でぷすわいずせぱらぶるたたみこみ
en: 'depthwise separable convolution'
aliases: ['深さ方向分離可能畳み込み', 'depthwise separable convolution', 'Depthwise Separable Convolution']
exams: [jdla-e]
summary: '通常の畳み込みを、チャネルごとに空間方向だけを畳み込む depth-wise 畳み込みと、1×1 でチャネル方向だけを混ぜる point-wise 畳み込みに分けたもの。パラメータ数と計算量を大きく減らせる。'
related: [pointwise-convolution, convolution, cnn, receptive-field]
formula: '\frac{K^2 C_{\mathrm{in}} + C_{\mathrm{in}} C_{\mathrm{out}}}{K^2 C_{\mathrm{in}} C_{\mathrm{out}}} = \frac{1}{C_{\mathrm{out}}} + \frac{1}{K^2}'
---
## 構成

通常の $K\times K$ 畳み込みは、空間方向（縦横）とチャネル方向の混ぜ合わせを同時に行います。depthwise separable 畳み込みはこれを 2 段に分けます。

1. **depth-wise 畳み込み**：入力の各チャネルに、それぞれ専用の $K\times K$ フィルタを 1 枚ずつ適用する（チャネル間は混ぜない）。パラメータ数は $K^2 C_{\mathrm{in}}$。
2. **point-wise 畳み込み（$1\times1$ 畳み込み）**：各画素の $C_{\mathrm{in}}$ 次元のベクトルに全結合層を適用するのと同じで、チャネル方向だけを混ぜる。パラメータ数は $C_{\mathrm{in}} C_{\mathrm{out}}$。

## パラメータ数の比較

$C_{\mathrm{in}} = 64$、$C_{\mathrm{out}} = 128$、$K = 3$（バイアスなし）の場合：

| 構成 | パラメータ数 |
| --- | --- |
| 通常の畳み込み | $9 \times 64 \times 128 = 73{,}728$ |
| depth-wise | $9 \times 64 = 576$ |
| point-wise | $64 \times 128 = 8{,}192$ |
| 合計 | $8{,}768$（通常の約 $0.119$ 倍） |

比は $\dfrac{1}{C_{\mathrm{out}}} + \dfrac{1}{K^2} = \dfrac{1}{128} + \dfrac19 \approx 0.119$ です。出力の縦横サイズが同じなら、乗算回数も同じ比率で減ります。

## $1\times1$ 畳み込みの役割

- 空間サイズを変えずにチャネル数を増減できる（ResNet のボトルネック構造、Inception のチャネル削減）。
- 各画素で独立に非線形変換を加えられる。
- 受容野は広がりません。

## グループ化畳み込み

入力チャネルを $G$ グループに分け、グループ内だけで畳み込む方法です。パラメータ数は通常の $1/G$ になります。$G = C_{\mathrm{in}}$（かつ各グループの出力が 1 チャネル）としたものが depth-wise 畳み込みにあたります。ResNeXt などで使われます。

## 使われるモデル

MobileNet は depthwise separable 畳み込みを基本単位とし、スマートフォンなどのエッジデバイスで動く軽量なモデルを実現しました。MobileNetV2 では、point-wise でいったんチャネルを増やしてから depth-wise を行い、再び減らす逆残差（inverted residual）構造を使います。Xception、EfficientNet なども同じ考え方を取り入れています。

## 試験での問われ方

E資格（シラバス 2026 の「特別な畳み込み」：point-wise 畳み込み、depth-wise 畳み込み、グループ化畳み込み）では、パラメータ数・計算量の計算と削減率、$1\times1$ 畳み込みの効果、MobileNet との関係が出題されます。

## よくある誤り

- depth-wise 畳み込みのパラメータ数に $C_{\mathrm{out}}$ を掛けてしまう。
- $1\times1$ 畳み込みは何も計算しない（恒等写像）と考える。チャネル方向の全結合にあたる。
- $1\times1$ 畳み込みで受容野が広がると考える。
