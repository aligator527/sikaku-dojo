---
term: '平方剰余'
reading: へいほうじょうよ
en: 'quadratic residue'
aliases: ['平方非剰余', 'ルジャンドル記号', '平方剰余の相互法則']
exams: [suken-1]
summary: '素数 p を法として x² ≡ a となる x が存在するような a のこと。存在するかどうかはルジャンドル記号で表し、相互法則などで計算する。'
related: [congruence, fermats-little-theorem, chinese-remainder-theorem]
formula: '\left(\frac{a}{p}\right) \equiv a^{\frac{p-1}{2}} \pmod{p},\qquad \left(\frac{p}{q}\right)\left(\frac{q}{p}\right) = (-1)^{\frac{p-1}{2}\cdot\frac{q-1}{2}}'
---
## 定義

奇素数 $p$ と、$p$ で割り切れない整数 $a$ について、$x^2 \equiv a \pmod p$ が解をもつとき $a$ を $p$ の**平方剰余**、もたないとき**平方非剰余**といいます。**ルジャンドル記号**を

$$\left(\frac{a}{p}\right) = \begin{cases} 1 & (a \text{ が平方剰余}) \\ -1 & (a \text{ が平方非剰余}) \end{cases}$$

と定めます（$p \mid a$ なら 0）。$1, 2, \ldots, p-1$ のうち平方剰余と平方非剰余はちょうど $\frac{p-1}{2}$ 個ずつです。例えば $p = 11$ の平方剰余は $1, 3, 4, 5, 9$ です。

## 計算の道具

- オイラーの基準：$\left(\frac{a}{p}\right) \equiv a^{(p-1)/2} \pmod p$
- 乗法性：$\left(\frac{ab}{p}\right) = \left(\frac{a}{p}\right)\left(\frac{b}{p}\right)$、$a \equiv b$ なら記号の値も同じ
- 第 1 補充法則：$\left(\frac{-1}{p}\right) = (-1)^{(p-1)/2}$。$-1$ が平方剰余 $\iff p \equiv 1 \pmod 4$
- 第 2 補充法則：$\left(\frac{2}{p}\right) = (-1)^{(p^2-1)/8}$。$2$ が平方剰余 $\iff p \equiv \pm 1 \pmod 8$
- 相互法則：異なる奇素数 $p, q$ について $\left(\frac{p}{q}\right)\left(\frac{q}{p}\right) = (-1)^{\frac{p-1}{2}\cdot\frac{q-1}{2}}$。$p, q$ の少なくとも一方が $\bmod 4$ で 1 なら $\left(\frac{p}{q}\right) = \left(\frac{q}{p}\right)$、両方 3 なら符号が反転します。

## 計算例

$\left(\frac{3}{11}\right)$ は、$3, 11$ がともに $\bmod 4$ で 3 なので $\left(\frac{3}{11}\right) = -\left(\frac{11}{3}\right) = -\left(\frac{2}{3}\right) = -(-1) = 1$。実際 $5^2 = 25 \equiv 3 \pmod{11}$ です。

## 応用

- $x^2 \equiv a \pmod p$ の解の個数（0 個か 2 個）の判定と、合成数の法への拡張（中国剰余定理と組み合わせる）
- 「$p = x^2 + y^2$ と書ける素数は $p = 2$ か $p \equiv 1 \pmod 4$」などの整数論の定理の証明
- 素数の無限性の変種（$4k + 1$ 型の素数が無数にある、など）の証明

## 試験での問われ方

数検1級では、ルジャンドル記号の値を相互法則と補充法則で計算する、合同方程式 $x^2 \equiv a$ の解の有無や個数を判定する、オイラーの基準や補充法則を証明する問題が出ます。

## よくある誤り

- 相互法則を使うとき、両方が $\bmod 4$ で 3 の場合の符号の反転を忘れる。
- ルジャンドル記号の「分子」に合成数が来たとき、素因数に分解せずに相互法則を適用する（分母は奇素数でなければなりません）。
- 平方剰余の個数を数えるとき、$x$ と $p - x$ が同じ値を与えることを忘れて $p - 1$ 個とする。
