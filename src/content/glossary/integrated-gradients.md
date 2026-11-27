---
term: 'Integrated Gradients'
reading: いんてぐれーてっどぐらでぃえんつ
en: 'Integrated Gradients'
aliases: ['統合勾配']
exams: [jdla-e]
summary: '基準となる入力（ベースライン）から実際の入力までの直線の経路に沿って勾配を積分し、入力との差を掛けて各特徴量の寄与を求める手法。寄与の合計が出力の変化に一致する。'
related: [grad-cam, shap, lime, backpropagation]
formula: '\mathrm{IG}_i(\boldsymbol x) = (x_i - x''_i)\int_0^1 \frac{\partial F}{\partial x_i}\bigl(\boldsymbol x'' + \alpha(\boldsymbol x - \boldsymbol x'')\bigr)\,d\alpha'
---
## 考え方

入力の点での勾配だけを見る方法（saliency map、勾配 × 入力）は、出力が飽和している（ReLU やシグモイド関数で勾配がほぼ 0 の）特徴量の寄与を見落とします。Integrated Gradients は、何も情報がない状態を表すベースライン $\boldsymbol x'$（黒い画像、すべて 0 の埋め込みなど）から入力 $\boldsymbol x$ まで少しずつ変えたときの勾配を全部足し合わせることで、この問題を避けます。

## 完全性

微積分の基本定理（線積分）から、

$$\sum_i \mathrm{IG}_i(\boldsymbol x) = F(\boldsymbol x) - F(\boldsymbol x')$$

が成り立ちます（completeness）。寄与の合計が、ベースラインから入力に変えたときの出力の変化にちょうど一致するので、寄与を出力の内訳として読めます。

## 計算例

$F(\boldsymbol x) = x_1 x_2$、入力 $\boldsymbol x = (2, 3)$、ベースライン $\boldsymbol x' = (0, 0)$ とします。経路は $(2\alpha,\ 3\alpha)$ です。

$$\mathrm{IG}_1 = 2\int_0^1 3\alpha\,d\alpha = 3,\qquad \mathrm{IG}_2 = 3\int_0^1 2\alpha\,d\alpha = 3$$

合計 $6$ は $F(\boldsymbol x) - F(\boldsymbol x') = 6$ と一致します。入力の点での「勾配 × 入力」は $(3 \times 2,\ 2 \times 3) = (6, 6)$ で合計 12 となり、出力の変化と一致しません。

## 実装

積分はリーマン和で近似します。$\alpha = k/m$（$k = 1, \dots, m$、$m$ は 20〜300 程度）の点で勾配を計算して平均し、$(\boldsymbol x - \boldsymbol x')$ を要素ごとに掛けます。勾配は誤差逆伝播法で求めるので、微分可能なモデルが対象です。完全性がどれだけ成り立っているかで、近似の精度を確かめられます。

## 注意点

- 結果はベースラインの選び方に依存します。黒い画像を基準にすると、黒い画素の寄与は常に 0 になります。
- 寄与は「モデルがどう出力を作ったか」の説明であり、現実の因果関係を示すものではありません。

## 試験での問われ方

E資格（シラバス 2026 で「判断根拠の可視化」に追加されたキーワード）では、簡単な関数での IG の計算、完全性の確認、勾配そのものや勾配 × 入力との違い、Grad-CAM との手法の違いが出題されます。

## よくある誤り

- 経路に沿った勾配の積分に、$(x_i - x'_i)$ を掛け忘れる。
- 入力の点での勾配だけで計算してしまう。
- 寄与の合計が $F(\boldsymbol x)$ そのものになると考える（ベースラインでの出力との差）。
