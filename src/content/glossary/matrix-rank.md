---
term: '階数'
reading: かいすう
en: 'rank'
aliases: ['行列のランク', 'フルランク', 'ランク落ち']
exams: [suken-1, toukei-dse, jdla-e, toukei-1, toukei-jun1]
summary: '行列の一次独立な列（行）ベクトルの最大個数。列空間の次元に等しく、連立一次方程式の解の存在や自由度を決める。'
related: [linear-independence, elementary-row-operations, determinant, singular-value-decomposition, projection-matrix]
formula: '\operatorname{rank}A + \dim\ker A = n \quad (A \text{ は } m \times n \text{ 行列})'
---
## 定義

$m \times n$ 行列 $A$ の**階数**（ランク）$\operatorname{rank}A$ は、$A$ の列ベクトルのうち一次独立なものの最大個数です。行ベクトルで数えても同じ値になり、列空間（像）$\operatorname{Im}A$ の次元に等しくなります。行基本変形で階段行列にしたときの、零でない行（主成分）の個数として計算するのが基本です。

$\operatorname{rank}A = \min(m, n)$ のとき**フルランク**といい、特に $\operatorname{rank}A = n$（列が一次独立）を列フルランクといいます。$n$ 次正方行列では $\operatorname{rank}A = n \iff \det A \ne 0 \iff A$ が正則です。

## 主な性質

- 次元定理：$\operatorname{rank}A + \dim\ker A = n$（$n$ は列の数）
- $\operatorname{rank}(AB) \le \min(\operatorname{rank}A, \operatorname{rank}B)$。正則行列を掛けても階数は変わりません。
- $\operatorname{rank}(A^{\top}A) = \operatorname{rank}A$。このため $X$ が列フルランクなら $X^{\top}X$ は正則です。
- 階数は 0 でない特異値の個数に等しい（特異値分解）。対称行列なら 0 でない固有値の個数（重複を含む）です。

## 連立一次方程式との関係

$A\boldsymbol{x} = \boldsymbol{b}$ が解をもつのは、$\operatorname{rank}A = \operatorname{rank}[A \mid \boldsymbol{b}]$（拡大係数行列の階数）のときに限ります。解があるとき、その自由度（任意定数の個数）は $n - \operatorname{rank}A$ です。

例えば $\begin{pmatrix} 1 & 2 & 3 \\ 2 & 4 & 6 \\ 1 & 0 & 1 \end{pmatrix}$ は第 2 行が第 1 行の 2 倍なので階数は 2 で、$A\boldsymbol{x} = \boldsymbol{0}$ の解は 1 個のパラメータで表されます。

## 試験での問われ方

数検1級では、文字を含む行列の階数を場合分けして求める、拡大係数行列の階数から解の存在と自由度を判定する、次元定理を使って像と核の次元を示す問題が出ます。統計検定データサイエンスエキスパートや1級では、計画行列が列フルランクでないと最小二乗推定量が一意に定まらないこと（多重共線性やダミー変数の入れすぎ）が問われます。E資格のシラバス 2026 では、行列のランクは前提知識（グレー網掛けで出題対象外）で、出題対象の潜在的意味インデキシング（LSI）などの低ランク近似を理解する土台になります。

## よくある誤り

- 行基本変形の途中で列も入れ替え、どの変数が自由変数かを見失う（階数そのものは変わりません）。
- 文字を含む行列で、ある値で 0 になる要素で割ってしまい、特別な場合の階数を見落とす。
- $\operatorname{rank}(A + B) = \operatorname{rank}A + \operatorname{rank}B$ のような成り立たない等式を使う。成り立つのは $\operatorname{rank}(A + B) \le \operatorname{rank}A + \operatorname{rank}B$ です。
