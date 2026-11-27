---
term: '重みの初期化'
reading: おもみのしょきか
en: 'weight initialization'
aliases: ['Xavierの初期化', 'Xavier法', 'Glorotの初期化', 'Glorot法', 'Heの初期化', 'He法', 'Kaiming法', 'Kaimingの初期化']
exams: [jdla-e]
summary: '学習を始める前の重みの値の決め方。各層の出力と勾配の分散が層を通っても保たれるように、入力ユニット数に応じた分散の乱数で重みを初期化する。'
related: [relu, sigmoid-function, vanishing-gradient, fully-connected-layer]
formula: '\text{Xavier: } \mathrm{Var}(w) = \frac{1}{n_{\mathrm{in}}}\ \left(\text{または } \frac{2}{n_{\mathrm{in}} + n_{\mathrm{out}}}\right),\qquad \text{He: } \mathrm{Var}(w) = \frac{2}{n_{\mathrm{in}}}'
---
## なぜ工夫が必要か

- **すべて 0（同じ値）にすると**：同じ層のユニットがすべて同じ出力・同じ勾配を持ち、何回更新しても区別がつきません（対称性の問題）。乱数で対称性を破る必要があります。
- **分散が小さすぎると**：層を重ねるごとに出力が 0 に縮み、勾配も消えます。
- **分散が大きすぎると**：出力が発散したり、シグモイド関数や tanh が飽和したりして、やはり学習が進みません。

## 考え方

入力 $x_i$ と重み $w_i$ が独立で平均 0 なら、$y = \sum_{i=1}^{n_{\mathrm{in}}} w_i x_i$ の分散は

$$\mathrm{Var}(y) = n_{\mathrm{in}}\,\mathrm{Var}(w)\,\mathrm{Var}(x)$$

です。層を通っても分散を保つには $n_{\mathrm{in}}\mathrm{Var}(w) = 1$、つまり $\mathrm{Var}(w) = 1/n_{\mathrm{in}}$ とします。

## 主な方法

| 方法 | 重みの分散 | 想定する活性化関数 |
| --- | --- | --- |
| Xavier（Glorot） | $1/n_{\mathrm{in}}$、または順伝播と逆伝播の折衷で $2/(n_{\mathrm{in}} + n_{\mathrm{out}})$ | シグモイド関数・tanh など原点付近で線形に近いもの |
| He（Kaiming） | $2/n_{\mathrm{in}}$ | ReLU 系 |

ReLU は負の入力を 0 にするので、出力の 2 乗平均が入力の分散の半分になります。それを補うため、He の初期化は Xavier の 2 倍の分散を使います。一様分布で初期化する場合は、分散が同じになるよう範囲を決めます（Xavier なら $\pm\sqrt{6/(n_{\mathrm{in}} + n_{\mathrm{out}})}$）。

## 計算例

入力 512 ユニット・ReLU の全結合層に He の初期化を正規分布で使うと、標準偏差は $\sqrt{2/512} = 0.0625$ です。10 層の ReLU ネットワークで比べると、He の初期化では出力の大きさ（2 乗平均）がほぼ保たれますが、分散 $1/n_{\mathrm{in}}$ で初期化すると 1 層ごとに 2 乗平均がおよそ半分になり、10 層で $2^{-10} \approx 1/1000$ 程度まで縮みます。

## 試験での問われ方

E資格（シラバスのキーワード：Xavier 法／Glorot 法、Kaiming 法／He 法）では、活性化関数に合う初期化の選択、標準偏差や一様分布の範囲の計算、0 で初期化してはいけない理由が出題されます。バイアスは 0 で初期化してよいことも押さえておきます。

## よくある誤り

- 重みをすべて 0 で初期化すればよいと考える（バイアスは 0 でよいが、重みは不可）。
- He の初期化の分散 $2/n_{\mathrm{in}}$ と標準偏差 $\sqrt{2/n_{\mathrm{in}}}$ を取り違える。
- ReLU のネットワークに Xavier の初期化を使っても深さに関係なく問題ないと考える。
- $n_{\mathrm{in}}$ と $n_{\mathrm{out}}$ を逆にする（基本は入力側のユニット数）。
