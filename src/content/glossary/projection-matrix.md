---
term: '射影行列'
reading: しゃえいぎょうれつ
en: 'projection matrix'
aliases: ['正射影', '直交射影', '冪等行列', 'べき等行列']
exams: [suken-1, toukei-dse, toukei-1, toukei-jun1]
summary: 'ベクトルをある部分空間へ写す（射影する）線形変換を表す行列。P² = P を満たし、さらに対称なら直交射影を表す。'
related: [least-squares-method, eigenvalue, singular-value-decomposition]
formula: 'P = X(X^{\top}X)^{-1}X^{\top},\qquad P^2 = P,\quad P^{\top} = P'
---
## 定義

正方行列 $P$ が $P^2 = P$ を満たすとき、$P$ を**冪等行列**（射影行列）といいます。一度射影したベクトルをもう一度射影しても変わらない、という性質を式にしたものです。さらに $P^{\top} = P$ も満たすとき、$P$ は像 $\operatorname{Im}P$ への**直交射影**（正射影）を表し、$\boldsymbol{x} - P\boldsymbol{x}$ は $\operatorname{Im}P$ と直交します。

列フルランクの $n \times p$ 行列 $X$ の列空間への直交射影は

$$P = X(X^{\top}X)^{-1}X^{\top}$$

です。単位ベクトル $\boldsymbol{u}$ が張る直線への射影なら $P = \boldsymbol{u}\boldsymbol{u}^{\top}$ になります。

## 性質

- 固有値は 0 か 1 だけで、$\operatorname{rank}P = \operatorname{tr}P$ が成り立ちます。上の $P$ では $\operatorname{tr}P = p$ です。
- $I - P$ も射影行列で、直交補空間への射影を表します。$P(I - P) = O$ です。
- 全成分が 1 のベクトル $\boldsymbol{1}$ への射影は $\frac{1}{n}\boldsymbol{1}\boldsymbol{1}^{\top}$（各成分を平均に置き換える）で、$I - \frac{1}{n}\boldsymbol{1}\boldsymbol{1}^{\top}$ は中心化行列になります。

## 回帰分析との関係

最小二乗法の予測値 $\hat{\boldsymbol{y}} = X\hat{\boldsymbol{\beta}}$ は、$\boldsymbol{y}$ を $X$ の列空間へ直交射影したもので、$\hat{\boldsymbol{y}} = P\boldsymbol{y}$ と書けます（回帰ではこの $P$ をハット行列とも呼びます）。残差 $\boldsymbol{e} = (I - P)\boldsymbol{y}$ は予測値と直交し、$\boldsymbol{e}^{\top}\hat{\boldsymbol{y}} = 0$ です。残差平方和の自由度 $n - p$ は $\operatorname{tr}(I - P)$ から出てきます。

## 試験での問われ方

統計検定データサイエンスエキスパートでは、$X(X^{\top}X)^{-1}X^{\top}$ が対称かつ冪等であること、トレースや固有値、残差との直交性を選ばせる問題が出ます。統計検定1級・準1級では、二次形式 $\boldsymbol{y}^{\top}(I - P)\boldsymbol{y}$ の分布（カイ二乗分布の自由度）を導く場面で使います。数検1級では $A^2 = A$ を満たす行列について、像と核の直和分解や $\operatorname{rank}A = \operatorname{tr}A$ を証明させる問題があります。

## よくある誤り

- 冪等であれば必ず直交射影だと考える。直交射影には対称性 $P^{\top} = P$ も必要です。
- 射影行列は正則だと思い込む。$P = I$ のとき以外は固有値 0 をもつので正則ではありません。
- 固有値 1 の個数（ランク）を $n - p$ と取り違える。$n - p$ は $I - P$ のランクです。
