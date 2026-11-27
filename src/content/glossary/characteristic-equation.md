---
term: '特性方程式'
reading: とくせいほうていしき
en: 'characteristic equation'
aliases: ['固有多項式', '特性多項式', '特性根']
exams: [suken-1, jdla-e, toukei-jun1, toukei-1, toukei-dse]
summary: '行列・定数係数線形微分方程式・線形漸化式などの性質を決める代数方程式。行列では det(λI − A) = 0 で、その根が固有値になる。'
related: [eigenvalue, cayley-hamilton-theorem, second-order-linear-differential-equation, recurrence-relation, determinant]
formula: '\varphi_A(\lambda) = \det(\lambda I - A) = 0'
---
## 行列の特性方程式

$n$ 次正方行列 $A$ に対して、$\varphi_A(\lambda) = \det(\lambda I - A)$ を**固有多項式**（特性多項式）、$\varphi_A(\lambda) = 0$ を**特性方程式**（固有方程式）といいます。その根（特性根）が固有値です。2 次正方行列では

$$\varphi_A(\lambda) = \lambda^2 - (\operatorname{tr}A)\lambda + \det A$$

となり、一般に固有値の和はトレース、積は行列式に等しくなります。また $\varphi_A(A) = O$ が成り立ちます（ケーリー・ハミルトンの定理）。$\det(A - \lambda I)$ と書く流儀もありますが、$(-1)^n$ 倍の違いだけで根は同じです。

## 微分方程式・漸化式の特性方程式

- 定数係数の線形微分方程式 $y'' + ay' + by = 0$ に $y = e^{\lambda x}$ を代入すると $\lambda^2 + a\lambda + b = 0$ が得られます。相異なる実根 $\lambda_1, \lambda_2$ なら一般解は $C_1e^{\lambda_1 x} + C_2e^{\lambda_2 x}$、重根 $\lambda$ なら $(C_1 + C_2x)e^{\lambda x}$、複素根 $\alpha \pm \beta i$ なら $e^{\alpha x}(C_1\cos\beta x + C_2\sin\beta x)$ です。
- 線形漸化式 $a_{n+2} = pa_{n+1} + qa_n$ に $a_n = t^n$ を代入すると $t^2 = pt + q$ です。相異なる根 $\alpha, \beta$ なら $a_n = A\alpha^n + B\beta^n$ になります。

どちらも、1 階の連立系に書き直したときの係数行列（コンパニオン行列）の固有多項式です。例えば $y'' + ay' + by = 0$ は $(y, y')$ についての行列 $\begin{pmatrix} 0 & 1 \\ -b & -a \end{pmatrix}$ の系で、その固有多項式が $\lambda^2 + a\lambda + b$ になります。

## 時系列での特性方程式

統計の AR($p$) モデル $x_t = \phi_1 x_{t-1} + \cdots + \phi_p x_{t-p} + \varepsilon_t$ では、$1 - \phi_1 z - \cdots - \phi_p z^p = 0$ を特性方程式と呼び、すべての根の絶対値が 1 より大きい（単位円の外にある）ことが定常性の条件です。

## 試験での問われ方

数検1級では、固有多項式から固有値を求める計算、定数係数線形微分方程式の一般解、線形漸化式や三重対角行列の行列式の漸化式を特性方程式で解く問題が頻出です。統計検定準1級・1級では AR モデルの定常性の判定として出題されます。E資格のシラバス 2026 では固有値分解は前提知識（グレー網掛けで出題対象外）で、特性方程式は固有値・固有ベクトルを求める入口として押さえておく位置づけです。

## よくある誤り

- 微分方程式で重根のときに $C_1e^{\lambda x} + C_2e^{\lambda x}$ と書く（独立な解が 1 つしかない）。正しくは $x e^{\lambda x}$ を加えます。
- AR モデルの定常条件を「根が単位円の内側」と覚える。$1 - \phi_1 z - \cdots$ の形では外側です（$\lambda^p - \phi_1\lambda^{p-1} - \cdots$ の形なら内側）。
- 2 次正方行列の固有多項式で、$\lambda$ の 1 次の係数の符号（$-\operatorname{tr}A$）を誤る。
