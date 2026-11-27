---
term: '実対称行列'
reading: じつたいしょうぎょうれつ
en: 'real symmetric matrix'
aliases: ['対称行列', 'スペクトル分解', 'スペクトル定理']
exams: [suken-1, toukei-dse, jdla-e, toukei-1, toukei-2]
summary: '成分が実数で転置しても変わらない行列（Aᵀ = A）。固有値はすべて実数で、直交行列によって対角化できる（スペクトル定理）。'
related: [orthogonal-matrix, eigenvalue, quadratic-form, positive-definite-matrix, principal-component-analysis]
formula: 'A = Q\Lambda Q^{\top} = \sum_{i=1}^n \lambda_i\,\boldsymbol{q}_i\boldsymbol{q}_i^{\top}\quad (Q^{\top}Q = I)'
---
## 定義

$A^{\top} = A$ を満たす行列を**対称行列**といい、成分が実数のものを**実対称行列**といいます。分散共分散行列、相関行列、ヘッセ行列、二次形式の係数行列はすべて実対称行列です。

## スペクトル定理

実対称行列には次の性質があります。

1. 固有値はすべて実数
2. 異なる固有値に属する固有ベクトルは直交する
3. 直交行列 $Q$ で $Q^{\top}AQ = \Lambda = \operatorname{diag}(\lambda_1, \ldots, \lambda_n)$ と対角化できる（重複固有値があっても可能）

3 を書き直した

$$A = \sum_{i=1}^n \lambda_i\,\boldsymbol{q}_i\boldsymbol{q}_i^{\top}$$

を**スペクトル分解**といいます。各 $\boldsymbol{q}_i\boldsymbol{q}_i^{\top}$ は固有ベクトル方向への射影行列です。2 の証明は、$\lambda\,\boldsymbol{y}^{\top}\boldsymbol{x} = \boldsymbol{y}^{\top}A\boldsymbol{x} = (A\boldsymbol{y})^{\top}\boldsymbol{x} = \mu\,\boldsymbol{y}^{\top}\boldsymbol{x}$ から $(\lambda - \mu)\boldsymbol{y}^{\top}\boldsymbol{x} = 0$ を導くのが定番です。

## 計算例

$A = \begin{pmatrix} 5 & 2 \\ 2 & 2 \end{pmatrix}$ の固有値は $6$ と $1$、固有ベクトルは $(2, 1)$ と $(1, -2)$ で、確かに直交します。正規化した $\boldsymbol{q}_1 = (2, 1)/\sqrt{5}$、$\boldsymbol{q}_2 = (1, -2)/\sqrt{5}$ を並べた $Q$ で $Q^{\top}AQ = \operatorname{diag}(6, 1)$ です。重複固有値があるときは、その固有空間の中でグラム・シュミットの直交化を行って正規直交基底を選びます。

## 応用

- 主成分分析：分散共分散行列のスペクトル分解で、固有ベクトルが主成分の方向、固有値が主成分の分散
- 二次形式の標準形と、正定値性の判定（固有値の符号）
- $A^k = Q\Lambda^kQ^{\top}$、$A^{1/2} = Q\Lambda^{1/2}Q^{\top}$（正定値の場合）、白色化変換 $\Sigma^{-1/2}$

## 試験での問われ方

数検1級では、固有値が実数であることや固有ベクトルの直交性の証明、3 次の実対称行列を直交行列で対角化する計算が頻出です。統計検定データサイエンスエキスパートでは、分散共分散行列の固有値分解と主成分分析、対称行列の性質を選ばせる問題が出ます。E資格のシラバス 2026 では、固有値分解や主成分分析は前提知識（グレー網掛けで出題対象外）です。

## よくある誤り

- 重複固有値の固有ベクトルを適当に選び、直交性を確かめないまま $Q$ に並べる。
- 固有ベクトルを正規化せずに $Q$ を作り、$Q^{-1} = Q^{\top}$ を使ってしまう。
- 対称でない行列にもスペクトル分解（直交行列による対角化）が使えると考える。
