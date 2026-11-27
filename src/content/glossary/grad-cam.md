---
term: 'Grad-CAM'
reading: ぐらどかむ
en: 'Grad-CAM (gradient-weighted class activation mapping)'
aliases: ['Guided Grad-CAM', 'Gradient-weighted Class Activation Mapping']
exams: [jdla-e]
summary: 'CNN の最後の畳み込み層の特徴マップを、対象クラスのスコアの勾配の平均で重み付けして足し合わせ、ReLU をかけてヒートマップにする手法。判断の根拠となった画像上の領域を示す。'
related: [feature-map, cnn, integrated-gradients, shap, pooling]
formula: '\alpha_k^c = \frac{1}{HW}\sum_{i, j}\frac{\partial y^c}{\partial A^k_{ij}},\qquad L^c_{\text{Grad-CAM}} = \mathrm{ReLU}\left(\sum_{k}\alpha_k^c A^k\right)'
---
## 計算手順

1. 画像を CNN に入力し、最後の畳み込み層の特徴マップ $A^k$（$k = 1, \dots, K$、各 $H \times W$）と、クラス $c$ のスコア $y^c$（ソフトマックス関数を適用する前の値）を求める。
2. $y^c$ の $A^k$ に関する勾配を逆伝播で求め、チャネルごとに空間方向で平均して重み $\alpha_k^c$ とする（勾配の Global Average Pooling）。
3. 特徴マップの重み付き和 $\sum_k \alpha_k^c A^k$ に ReLU を適用する。クラス $c$ のスコアを **上げる** 方向に働く領域だけを残すためです。
4. 得られた $H \times W$ のマップを入力画像の大きさに拡大し、画像に重ねて表示する。

## 計算例

2 チャネルで、重みが $\alpha^c = (0.5,\ -0.2)$、特徴マップが

$$A^1 = \begin{pmatrix} 1 & 0 \\ 2 & 1 \end{pmatrix},\qquad A^2 = \begin{pmatrix} 0 & 3 \\ 1 & 0 \end{pmatrix}$$

のとき、$0.5A^1 - 0.2A^2 = \begin{pmatrix} 0.5 & -0.6 \\ 0.8 & 0.5 \end{pmatrix}$ で、ReLU をかけると $\begin{pmatrix} 0.5 & 0 \\ 0.8 & 0.5 \end{pmatrix}$ になります。左下の領域が最も強く判断に寄与していると読みます。

## CAM との関係

CAM（Class Activation Mapping）は、最後の畳み込み層の後に Global Average Pooling と全結合層だけを置いた構造を前提に、全結合層の重みをそのままチャネルの重みとして使う方法です。Grad-CAM は重みを勾配から求めるので、ネットワークの構造を変えずに、さまざまな CNN（全結合層を持つもの、画像キャプションなど）に使えます。

## 特徴と限界

- 最後の畳み込み層の解像度（例：$7 \times 7$）で計算するので、ヒートマップは粗くなります。画素単位の細かな勾配（Guided Backpropagation）と掛け合わせた Guided Grad-CAM で、細かさとクラスの識別性を両立させます。
- モデルが「どこを見たか」は分かりますが、「なぜそう判断したか」の因果的な説明ではありません。背景や透かしなど、本来関係のない部分に反応していることを見つけるのに役立ちます。

## 試験での問われ方

E資格（シラバス 2026 の判断根拠の可視化：XAI、Grad-CAM、Integrated Gradients）では、重み $\alpha_k^c$ の計算（勾配の空間平均）、ReLU を適用する理由、NumPy による実装の穴埋めが出題されます。CAM はシラバス 2026 でキーワードから削除されましたが、Grad-CAM との違いとして選択肢に現れることがあります。

## よくある誤り

- 重みを特徴マップそのものの平均から求める（勾配の平均を使う）。
- 重み付き和に勾配のマップを使う（重みを掛けるのは特徴マップ $A^k$）。
- ReLU を省き、スコアを下げる方向の領域まで含めてしまう。
- ソフトマックス関数を適用した後の確率の勾配を使う（通常はその前のスコア）。
