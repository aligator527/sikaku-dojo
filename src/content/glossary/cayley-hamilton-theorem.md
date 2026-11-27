---
term: 'ケーリー・ハミルトンの定理'
reading: けーりー・はみるとんのていり
en: 'Cayley-Hamilton theorem'
aliases: ['ハミルトン・ケーリーの定理']
exams: [suken-1]
summary: '正方行列 A の固有多項式 φ(λ) = det(λI − A) に A 自身を代入すると零行列になる、という定理。行列のべき乗や逆行列の計算に使う。'
related: [characteristic-equation, eigenvalue, inverse-matrix, trace]
formula: '\varphi_A(A) = O,\qquad A^2 - (\operatorname{tr}A)\,A + (\det A)\,I = O\ \ (2\text{ 次})'
---
## 内容

$n$ 次正方行列 $A$ の固有多項式を $\varphi_A(\lambda) = \det(\lambda I - A) = \lambda^n + c_{n-1}\lambda^{n-1} + \cdots + c_0$ とすると、

$$\varphi_A(A) = A^n + c_{n-1}A^{n-1} + \cdots + c_0 I = O$$

が成り立ちます。2 次正方行列では $A^2 - (\operatorname{tr}A)A + (\det A)I = O$ です。

「$\lambda$ に $A$ を代入すれば $\det(AI - A) = \det O = 0$」という議論は誤りです（左辺は行列、右辺はスカラーで、代入の意味が違います）。正しい証明には、余因子行列を使って $(\lambda I - A)\operatorname{adj}(\lambda I - A) = \varphi_A(\lambda)I$ の両辺を $\lambda$ の多項式として比較する方法や、三角化を使う方法があります。

## 使い方

1. **べき乗**：$x^n$ を $\varphi_A(x)$ で割って $x^n = \varphi_A(x)q(x) + r(x)$ とすると、$A^n = r(A)$ です。余り $r(x)$ の係数は、$\varphi_A$ の根（固有値）を代入して決めます。
2. **逆行列**：$c_0 = (-1)^n\det A \ne 0$ なら $A(A^{n-1} + \cdots + c_1 I) = -c_0 I$ から $A^{-1}$ を $A$ の多項式で表せます。
3. **次数下げ**：$A$ の高次の多項式を、$n - 1$ 次以下の多項式に直せます。

## 計算例

$A = \begin{pmatrix} 3 & 1 \\ -2 & 0 \end{pmatrix}$ では $\operatorname{tr}A = 3$、$\det A = 2$ なので $A^2 - 3A + 2I = O$ です。$x^n = (x - 1)(x - 2)q(x) + ax + b$ とおき、$x = 1, 2$ を代入すると $a + b = 1$、$2a + b = 2^n$ より $a = 2^n - 1$、$b = 2 - 2^n$。よって

$$A^n = (2^n - 1)A + (2 - 2^n)I$$

です。固有値が重根 $\alpha$ のときは、$x = \alpha$ の代入に加えて両辺を微分してから代入します。

## 試験での問われ方

数検1級では、余りの計算による $A^n$ の導出、$A$ の高次多項式の値、逆行列を $A$ の多項式で表す問題が出ます。定理の証明（とくに誤った証明の指摘）を問う記述問題もあります。

## よくある誤り

- 定数項を $c_0$ のまま行列の式に書き、$I$ を掛け忘れる。
- 2 次の場合の式で、$\operatorname{tr}A$ の項の符号を $+$ にする。
- $\varphi_A(A) = O$ から、$A$ の満たす最小次数の多項式（最小多項式）が必ず固有多項式であると考える。最小多項式は固有多項式の約数で、次数が低いこともあります。
