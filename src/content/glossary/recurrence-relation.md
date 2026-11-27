---
term: '漸化式'
reading: ぜんかしき
en: 'recurrence relation'
aliases: ['線形漸化式']
exams: [suken-1, toukei-jun1, toukei-1, toukei-dse]
summary: '数列の項を、それより前の項を使って表す関係式。定数係数の線形漸化式は特性方程式で一般項が求まり、積分や確率の計算にも現れる。'
related: [characteristic-equation, fibonacci-sequence, method-of-undetermined-coefficients, integration-by-parts]
formula: 'a_{n+2} = pa_{n+1} + qa_n,\quad t^2 = pt + q \text{ の根 } \alpha \ne \beta \ \Rightarrow\ a_n = A\alpha^n + B\beta^n'
---
## 定義

数列 $\{a_n\}$ の各項を、それより前の項で表す式を**漸化式**といいます。初項（必要な個数の初期値）と漸化式を与えれば数列は 1 つに決まります。

## 線形漸化式の解き方

- **1 項間** $a_{n+1} = ra_n + c$（$r \ne 1$）：不動点 $\alpha = \frac{c}{1 - r}$ を引くと $a_{n+1} - \alpha = r(a_n - \alpha)$ なので、$a_n = \alpha + r^{n}(a_0 - \alpha)$ です。
- **2 項間（3 項間漸化式）** $a_{n+2} = pa_{n+1} + qa_n$：$a_n = t^n$ を代入した特性方程式 $t^2 = pt + q$ の根を $\alpha, \beta$ として、
  - $\alpha \ne \beta$ なら $a_n = A\alpha^n + B\beta^n$
  - 重根 $\alpha$ なら $a_n = (A + Bn)\alpha^n$
  
  とし、$A, B$ を初期値から決めます。
- **非同次** $a_{n+2} = pa_{n+1} + qa_n + f(n)$：1 つの特殊解（未定係数法で求める）に、同次方程式の一般解を加えます。

行列で書くと $\begin{pmatrix} a_{n+1} \\ a_n \end{pmatrix} = \begin{pmatrix} p & q \\ 1 & 0 \end{pmatrix}\begin{pmatrix} a_n \\ a_{n-1} \end{pmatrix}$ で、特性方程式はこの行列の固有方程式です。

## 計算例

$a_{n+2} = 5a_{n+1} - 6a_n$、$a_0 = 1$、$a_1 = 4$ では、特性方程式 $t^2 - 5t + 6 = 0$ の根が 2, 3 なので $a_n = A\cdot 2^n + B\cdot 3^n$。$A + B = 1$、$2A + 3B = 4$ から $A = -1$、$B = 2$ で、$a_n = 2\cdot 3^n - 2^n$ です（$a_2 = 14$ で確かめられます）。

## 他の分野での漸化式

- **積分**：$I_n = \int_0^{\pi/2}\sin^nx\,dx$ の $I_n = \frac{n-1}{n}I_{n-2}$ のように、部分積分から得られます。
- **行列式**：三重対角行列の行列式 $D_n$ は、余因子展開から 3 項間漸化式を満たします。
- **確率**：ランダムウォークの破産確率や、「表が 2 回続くまでの回数」の期待値は、最初の 1 回で場合分けして漸化式を立てます。
- **数値計算**：ニュートン法などの反復法は漸化式そのもので、収束の議論は漸化式の極限の議論です。計算機で漸化式を前向きに使うと誤差が拡大することがあり、安定性に注意が必要です。

## 試験での問われ方

数検1級では、積分や行列式で定義された数列の漸化式を導いて一般項や極限を求める問題、3 項間漸化式の一般項、漸化式で定まる数列の極限の証明が頻出です。統計検定では、確率や期待値を漸化式で求める問題、AR モデルの自己相関が満たす漸化式（ユール・ウォーカー方程式）として現れます。

## よくある誤り

- 特性方程式の根に重根があるとき、$A\alpha^n + B\alpha^n$ としてしまう。
- 添字のずれ（$a_0$ から始まるか $a_1$ から始まるか）を確認せずに、初期値で係数を決める。
- 極限が存在すると仮定して $\alpha = f(\alpha)$ を解き、存在そのものを示さないまま答える。
