---
term: 'ノルム'
reading: のるむ
en: 'norm'
aliases: ['ユークリッドノルム', 'スペクトルノルム', 'フロベニウスノルム']
exams: [jdla-e, toukei-dse, suken-1, toukei-1]
summary: 'ベクトルや行列の「大きさ」を測る量。正値性・斉次性・三角不等式を満たし、L1・L2 ノルムやスペクトルノルムなどがある。'
related: [singular-value-decomposition, weight-decay, cauchy-schwarz-inequality]
formula: '\|\boldsymbol{x}\|_p = \Bigl(\sum_{i=1}^n |x_i|^p\Bigr)^{1/p},\qquad \|A\|_2 = \sigma_{\max}(A)'
---
## 定義

ベクトル空間上の関数 $\|\cdot\|$ が、次の 3 つを満たすとき**ノルム**といいます。

1. $\|\boldsymbol{x}\| \ge 0$、等号は $\boldsymbol{x} = \boldsymbol{0}$ のときだけ
2. $\|c\boldsymbol{x}\| = |c|\,\|\boldsymbol{x}\|$
3. $\|\boldsymbol{x} + \boldsymbol{y}\| \le \|\boldsymbol{x}\| + \|\boldsymbol{y}\|$（三角不等式）

## ベクトルのノルム

- L1 ノルム：$\|\boldsymbol{x}\|_1 = \sum |x_i|$
- L2 ノルム（ユークリッドノルム）：$\|\boldsymbol{x}\|_2 = \sqrt{\sum x_i^2} = \sqrt{\boldsymbol{x}^{\top}\boldsymbol{x}}$
- 最大値ノルム：$\|\boldsymbol{x}\|_\infty = \max |x_i|$

例えば $\boldsymbol{x} = (1, -2, 2)$ では $\|\boldsymbol{x}\|_1 = 5$、$\|\boldsymbol{x}\|_2 = 3$、$\|\boldsymbol{x}\|_\infty = 2$ です。L1 と L2 は正則化項（ラッソ、リッジ・重み減衰）にそのまま現れます。なお非零成分の個数を「L0 ノルム」と呼ぶことがありますが、斉次性を満たさないので厳密にはノルムではありません。

## 行列のノルム

- スペクトルノルム（行列の 2-ノルム）：$\|A\|_2 = \max_{\|\boldsymbol{x}\|_2 = 1}\|A\boldsymbol{x}\|_2 = \sigma_{\max}(A)$（最大特異値）
- フロベニウスノルム：$\|A\|_F = \sqrt{\sum_{i,j} a_{ij}^2} = \sqrt{\operatorname{tr}(A^{\top}A)} = \sqrt{\sum \sigma_i^2}$

例えば $A = \begin{pmatrix} 3 & 0 \\ 4 & 5 \end{pmatrix}$ では特異値が $3\sqrt{5}, \sqrt{5}$ なので、$\|A\|_2 = 3\sqrt{5}$、$\|A\|_F = \sqrt{50} = 5\sqrt{2}$ です。スペクトルノルムは $\|A\boldsymbol{x}\| \le \|A\|_2\|\boldsymbol{x}\|$ を満たし、条件数やリプシッツ定数の評価に使われます。

## 試験での問われ方

E資格では、ベクトルの L1・L2 ノルムの計算、正則化項としての性質（L1 はスパースな解を生む）、勾配クリッピングでのノルムの使い方、スペクトルノルムやフロベニウスノルムと特異値の関係が問われます。統計検定データサイエンスエキスパートでは、条件数や低ランク近似の誤差の評価でノルムを使います。

## よくある誤り

- L2 ノルムと、その 2 乗（二乗和）を取り違える。リッジ回帰の罰則は $\|\boldsymbol{\beta}\|_2^2$ です。
- スペクトルノルムを最大固有値の絶対値とする。一般の行列では最大特異値で、一致するのは対称行列などの場合です。
- フロベニウスノルムを成分の絶対値の和と覚える。2 乗和の平方根です。
