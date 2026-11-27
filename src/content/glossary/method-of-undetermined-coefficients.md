---
term: '未定係数法'
reading: みていけいすうほう
en: 'method of undetermined coefficients'
exams: [suken-1]
summary: '定数係数の線形微分方程式（や漸化式）の特殊解を、右辺と同じ形の式に未知の係数を置いて代入し、係数を比較して求める方法。'
related: [second-order-linear-differential-equation, characteristic-equation, recurrence-relation]
formula: 'r(x) = e^{\alpha x}P_m(x) \ \Rightarrow\ y_p = x^{s}e^{\alpha x}(A_m x^m + \cdots + A_1 x + A_0)'
---
## 方法

定数係数の線形微分方程式 $y'' + ay' + by = r(x)$ で、右辺 $r(x)$ が多項式・指数関数・三角関数（とそれらの積）のとき、特殊解を次の形に仮定して代入し、係数を比較します。

| 右辺 $r(x)$ | 仮定する特殊解 |
| --- | --- |
| $m$ 次多項式 | $m$ 次多項式 $A_mx^m + \cdots + A_0$ |
| $e^{\alpha x}$ | $Ae^{\alpha x}$ |
| $\cos\beta x$ または $\sin\beta x$ | $A\cos\beta x + B\sin\beta x$ |
| $e^{\alpha x} \times$ 多項式・三角関数 | 同じ形の積 |

ただし、仮定した式が同次方程式の解になってしまう場合（$\alpha$ や $\beta i$ が特性根である場合）は、特性根としての重複度 $s$ だけ $x^s$ を掛けます。

## 計算例

- $y'' - 3y' + 2y = 4x$：$y_p = Ax + B$ を代入すると $-3A + 2(Ax + B) = 4x$ から $A = 2$、$B = 3$。$y_p = 2x + 3$ です。
- $y'' - 3y' + 2y = e^x$：$1$ は特性根（$\lambda^2 - 3\lambda + 2 = 0$ の根）なので、$Ae^x$ ではなく $y_p = Axe^x$ と置きます。代入すると $-Ae^x = e^x$ で $A = -1$、$y_p = -xe^x$ です。
- $y'' + y = \cos x$（共鳴）：$\pm i$ が特性根なので $y_p = x(A\cos x + B\sin x)$ と置き、$A = 0$、$B = \frac{1}{2}$ から $y_p = \frac{x}{2}\sin x$。振幅が $x$ に比例して増えます。

## 漸化式への応用

非同次の線形漸化式 $a_{n+1} = 2a_n + 3^n$ でも、特殊解を $A\cdot 3^n$ と置いて $A = 1$ が求まります。右辺が $2^n$ のように特性根と一致するときは $An\cdot 2^n$ と置く点も微分方程式と同じです。

## 試験での問われ方

数検1級では、2 階・高階の定数係数線形微分方程式の一般解を求める問題で、特殊解の形の設定が問われます。共鳴（右辺が同次解と同じ形）の場合を正しく扱えるかが典型的な採点ポイントです。

## よくある誤り

- 右辺が同次方程式の解と同じ形なのに $x$ を掛け忘れ、係数が決まらない（$0 = e^x$ のような矛盾が出る）。
- 右辺が $\cos\beta x$ だけのとき、仮定から $\sin\beta x$ の項を落とす（$y'$ の項があると両方必要です）。
- 右辺が $\tan x$ や $\frac{1}{x}$ のように、この方法の対象外の関数に使う。その場合は定数変化法を使います。
