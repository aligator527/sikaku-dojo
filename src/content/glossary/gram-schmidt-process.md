---
term: 'グラム・シュミットの直交化'
reading: ぐらむ・しゅみっとのちょっこうか
en: 'Gram-Schmidt process'
aliases: ['グラム・シュミット法', 'グラム・シュミットの直交化法']
exams: [suken-1, toukei-dse]
summary: '一次独立なベクトルの組から、同じ部分空間を張る正規直交基底を順に作る手続き。各ベクトルからそれまでの方向の成分を引いて正規化する。'
related: [orthogonal-matrix, linear-independence, projection-matrix, real-symmetric-matrix]
formula: '\boldsymbol{w}_k = \boldsymbol{v}_k - \sum_{j=1}^{k-1}(\boldsymbol{v}_k \cdot \boldsymbol{u}_j)\,\boldsymbol{u}_j,\qquad \boldsymbol{u}_k = \frac{\boldsymbol{w}_k}{\|\boldsymbol{w}_k\|}'
---
## 手順

一次独立なベクトル $\boldsymbol{v}_1, \ldots, \boldsymbol{v}_k$ から、次のように正規直交系 $\boldsymbol{u}_1, \ldots, \boldsymbol{u}_k$ を作ります。

1. $\boldsymbol{u}_1 = \boldsymbol{v}_1 / \|\boldsymbol{v}_1\|$
2. $\boldsymbol{w}_2 = \boldsymbol{v}_2 - (\boldsymbol{v}_2 \cdot \boldsymbol{u}_1)\boldsymbol{u}_1$、$\boldsymbol{u}_2 = \boldsymbol{w}_2 / \|\boldsymbol{w}_2\|$
3. 以下同様に、$\boldsymbol{v}_j$ から $\boldsymbol{u}_1, \ldots, \boldsymbol{u}_{j-1}$ 方向への正射影を引いてから正規化

各段階で $\boldsymbol{u}_1, \ldots, \boldsymbol{u}_j$ が張る空間は $\boldsymbol{v}_1, \ldots, \boldsymbol{v}_j$ が張る空間と一致します。$\boldsymbol{w}_j = \boldsymbol{0}$ になったら、$\boldsymbol{v}_j$ がそれまでのベクトルに一次従属だったことを意味します。

## 計算例

$\boldsymbol{v}_1 = (1, 1, 0)$、$\boldsymbol{v}_2 = (1, 0, 1)$ とします。$\boldsymbol{u}_1 = \frac{1}{\sqrt{2}}(1, 1, 0)$、$\boldsymbol{v}_2 \cdot \boldsymbol{u}_1 = \frac{1}{\sqrt{2}}$ なので

$$\boldsymbol{w}_2 = (1, 0, 1) - \tfrac{1}{2}(1, 1, 0) = \left(\tfrac{1}{2}, -\tfrac{1}{2}, 1\right),\qquad \boldsymbol{u}_2 = \tfrac{1}{\sqrt{6}}(1, -1, 2)$$

です。$\boldsymbol{u}_1 \cdot \boldsymbol{u}_2 = 0$ を確かめておくと計算ミスが防げます。正規化の前に $\boldsymbol{w}_2$ を定数倍して $(1, -1, 2)$ としてから割ると楽です。

## QR 分解との関係

行列 $A$ の列にこの手順を適用すると、$A = QR$（$Q$ は正規直交な列をもつ行列、$R$ は上三角行列）という QR 分解が得られます。最小二乗法を $R\boldsymbol{\beta} = Q^{\top}\boldsymbol{y}$ として解くと、$X^{\top}X$ を作らないので数値的に安定です。ただし素朴な手順は丸め誤差で直交性が崩れやすく、実用では修正グラム・シュミット法やハウスホルダー変換が使われます。

## 試験での問われ方

数検1級では、与えられたベクトルや多項式（関数の内積 $\int fg\,dx$）から正規直交基底を作る計算、実対称行列の重複固有値の固有空間で正規直交な固有ベクトルを選ぶ場面で使います。統計検定データサイエンスエキスパートでは、QR 分解や直交化の性質を問う問題が出ます。

## よくある誤り

- 射影を引くとき、正規化前の $\boldsymbol{w}_j$ で割り忘れる（$\boldsymbol{u}_j$ ではなく $\boldsymbol{w}_j$ を使うなら $\frac{\boldsymbol{v}_k \cdot \boldsymbol{w}_j}{\boldsymbol{w}_j \cdot \boldsymbol{w}_j}\boldsymbol{w}_j$ を引く）。
- 最後の正規化を忘れ、直交基底のまま正規直交基底と答える。
- ベクトルの順番を変えても同じ基底になると考える。順番を変えると一般に別の正規直交基底になります。
