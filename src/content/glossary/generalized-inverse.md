---
term: '一般逆行列'
reading: いっぱんぎゃくぎょうれつ
en: 'generalized inverse'
aliases: ['擬似逆行列', '疑似逆行列', 'ムーア・ペンローズ逆行列', 'ムーア・ペンローズの擬似逆行列']
exams: [toukei-dse, jdla-e, toukei-1]
summary: '正方でない行列や正則でない行列に対して、逆行列の役割を一般化した行列。特に 4 条件で一意に定まるものをムーア・ペンローズ逆行列 A⁺ という。'
related: [inverse-matrix, singular-value-decomposition, least-squares-method, matrix-rank]
formula: 'A^{+} = V\Sigma^{+}U^{\top}\quad (A = U\Sigma V^{\top}),\qquad \Sigma^{+} = \operatorname{diag}(1/\sigma_1, \ldots, 1/\sigma_r, 0, \ldots, 0)'
---
## 定義

$m \times n$ 行列 $A$ に対して $AGA = A$ を満たす $n \times m$ 行列 $G$ を、$A$ の**一般逆行列**といいます（一般には一意ではありません）。さらに次の 4 条件をすべて満たす $G$ はただ 1 つに定まり、**ムーア・ペンローズ逆行列**（擬似逆行列）$A^{+}$ と呼ばれます。

1. $AA^{+}A = A$
2. $A^{+}AA^{+} = A^{+}$
3. $(AA^{+})^{\top} = AA^{+}$
4. $(A^{+}A)^{\top} = A^{+}A$

$A$ が正則なら $A^{+} = A^{-1}$ です。

## 求め方

特異値分解 $A = U\Sigma V^{\top}$ から、0 でない特異値だけを逆数にして $A^{+} = V\Sigma^{+}U^{\top}$ とします。特別な場合は次のとおりです。

- 列フルランク（$\operatorname{rank}A = n$）：$A^{+} = (A^{\top}A)^{-1}A^{\top}$
- 行フルランク（$\operatorname{rank}A = m$）：$A^{+} = A^{\top}(AA^{\top})^{-1}$
- 階数 1 の $A = \boldsymbol{u}\boldsymbol{v}^{\top}$：$A^{+} = \dfrac{A^{\top}}{\|\boldsymbol{u}\|^2\|\boldsymbol{v}\|^2}$。例えば $A = \begin{pmatrix} 1 & 2 \\ 2 & 4 \\ 0 & 0 \end{pmatrix}$ なら $A^{+} = \dfrac{1}{25}\begin{pmatrix} 1 & 2 & 0 \\ 2 & 4 & 0 \end{pmatrix}$ です。

## 最小二乗法との関係

$\boldsymbol{x} = A^{+}\boldsymbol{b}$ は、$\|A\boldsymbol{x} - \boldsymbol{b}\|$ を最小にする $\boldsymbol{x}$ のうちノルム $\|\boldsymbol{x}\|$ が最小のもの（最小ノルム最小二乗解）です。$AA^{+}$ は $A$ の列空間への直交射影、$A^{+}A$ は行空間への直交射影になります。パラメータ数がデータ数より多い回帰（過剰パラメータ化）では解が無数にあり、勾配降下法を 0 から始めると最小ノルム解に収束することが知られています。

## 試験での問われ方

統計検定データサイエンスエキスパートでは、ランク落ちした計画行列や過剰パラメータ化された回帰での最小ノルム解、4 条件の性質が問われます。E資格のシラバス 2026 では、特異値分解を含む線形代数は前提知識（グレー網掛けで出題対象外）で、擬似逆行列も直接の出題範囲ではありません。

## よくある誤り

- 特異値分解から作るとき、0 の特異値まで逆数にしようとする（0 は 0 のまま残します）。
- 列フルランクでない行列に $(A^{\top}A)^{-1}A^{\top}$ を使う。$A^{\top}A$ が正則でないので使えません。
- $(AB)^{+} = B^{+}A^{+}$ が常に成り立つと考える。一般には成り立ちません。
