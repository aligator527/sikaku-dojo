---
term: '全結合層'
reading: ぜんけつごうそう
en: 'fully connected layer'
aliases: ['Affineレイヤ', 'Affine層', '線形層', '密結合層']
exams: [jdla-e, toukei-dse]
summary: '入力のすべてのユニットと出力のすべてのユニットを重みでつなぐ層。入力ベクトルに重み行列を掛けてバイアスを足すアフィン変換 Y = XW + b を計算する。'
related: [backpropagation, activation-function, weight-initialization, convolution]
formula: 'Y = XW + \boldsymbol b,\qquad \frac{\partial L}{\partial W} = X^{\mathsf T}\frac{\partial L}{\partial Y},\quad \frac{\partial L}{\partial X} = \frac{\partial L}{\partial Y}W^{\mathsf T}'
---
## 計算

ミニバッチの入力を $X$（形状 $N \times D_{\mathrm{in}}$）、重みを $W$（$D_{\mathrm{in}} \times D_{\mathrm{out}}$）、バイアスを $\boldsymbol b$（長さ $D_{\mathrm{out}}$）とすると

$$Y = XW + \boldsymbol b$$

です。$\boldsymbol b$ は各行にブロードキャストして足します。多層パーセプトロンは、全結合層と活性化関数を交互に重ねたものです。

## パラメータ数

$$\text{パラメータ数} = D_{\mathrm{in}} \times D_{\mathrm{out}} + D_{\mathrm{out}}$$

たとえば 784 次元の入力を 100 ユニットに変換する層は $784 \times 100 + 100 = 78{,}500$ 個です。入力の次元に比例して増えるので、画像を平らにして全結合層に入れるとパラメータが非常に多くなります。畳み込み層は局所結合と重み共有によってこれを抑えたものです。

## 逆伝播

上流から来た勾配を $\dfrac{\partial L}{\partial Y}$（$N \times D_{\mathrm{out}}$）とすると

- $\dfrac{\partial L}{\partial W} = X^{\mathsf T}\dfrac{\partial L}{\partial Y}$（$D_{\mathrm{in}} \times D_{\mathrm{out}}$）
- $\dfrac{\partial L}{\partial \boldsymbol b} = \displaystyle\sum_{n=1}^{N}\left(\frac{\partial L}{\partial Y}\right)_{n}$（バッチ方向の和）
- $\dfrac{\partial L}{\partial X} = \dfrac{\partial L}{\partial Y}W^{\mathsf T}$（$N \times D_{\mathrm{in}}$）

形状が合うように転置の位置を決めると覚えられます。バイアスの勾配はバッチ方向に足し合わせる点が見落とされやすいところです。

## ライブラリでの表し方

PyTorch の `nn.Linear(in_features, out_features)` は重みを形状 `(out_features, in_features)` で持ち、$Y = XW^{\mathsf T} + \boldsymbol b$ を計算します。数式の $W$ と転置の関係になっている点に注意します。

## 試験での問われ方

E資格では、NumPy による順伝播・逆伝播の実装の穴埋め、パラメータ数の計算、出力の形状、PyTorch の重みの形状が出題されます。CNN の最後で特徴マップを平らにして全結合層に入れるときの入力次元の計算もよく問われます。

## よくある誤り

- パラメータ数にバイアスの $D_{\mathrm{out}}$ 個を数え忘れる。
- バイアスの勾配をバッチ方向に合計せず、形状 $(N, D_{\mathrm{out}})$ のまま扱う。
- $\dfrac{\partial L}{\partial W} = \dfrac{\partial L}{\partial Y}X^{\mathsf T}$ のように掛ける順序を逆にする。
- 線形変換だけを何層重ねても、全体は 1 つの線形変換にしかならないことを忘れる（間に活性化関数が必要）。
