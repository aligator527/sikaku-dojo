---
term: '中国剰余定理'
reading: ちゅうごくじょうよていり
en: 'Chinese remainder theorem'
aliases: ['中国の剰余定理', '連立合同式']
exams: [suken-1]
summary: '互いに素な法 m₁, …, mₖ についての連立合同式 x ≡ aᵢ (mod mᵢ) が、積 M = m₁⋯mₖ を法としてただ 1 つの解をもつという定理。'
related: [congruence, fermats-little-theorem]
formula: 'x \equiv \sum_{i=1}^{k} a_i M_i y_i \pmod{M},\qquad M_i = \frac{M}{m_i},\quad M_i y_i \equiv 1 \pmod{m_i}'
---
## 内容

$m_1, \ldots, m_k$ がどの 2 つも互いに素なら、連立合同式

$$x \equiv a_1 \pmod{m_1},\quad \ldots,\quad x \equiv a_k \pmod{m_k}$$

は $M = m_1m_2\cdots m_k$ を法としてただ 1 つの解をもちます。言い換えると、$\bmod M$ の余りと、各 $m_i$ での余りの組は 1 対 1 に対応します。

## 解の作り方

$M_i = M/m_i$ とおくと $\gcd(M_i, m_i) = 1$ なので、$M_iy_i \equiv 1 \pmod{m_i}$ となる $y_i$（逆元）があります。

$$x = a_1M_1y_1 + \cdots + a_kM_ky_k$$

は、$j \ne i$ の項が $m_i$ の倍数になることから、すべての合同式を満たします。

## 計算例

「3 で割ると 2 余り、5 で割ると 3 余り、7 で割ると 2 余る数」（孫子算経の問題）を求めます。$M = 105$ で、

- $M_1 = 35 \equiv 2 \pmod 3$ より $y_1 = 2$
- $M_2 = 21 \equiv 1 \pmod 5$ より $y_2 = 1$
- $M_3 = 15 \equiv 1 \pmod 7$ より $y_3 = 1$

なので $x = 2\cdot 35\cdot 2 + 3\cdot 21\cdot 1 + 2\cdot 15\cdot 1 = 233 \equiv 23 \pmod{105}$ です。

手計算では、1 つ目の条件から $x = 3t + 2$ とおいて 2 つ目に代入し、と順に絞り込む方法も便利です。

## 応用

- 合成数を法とする合同方程式を、素数べきを法とする方程式に分解して解く。$f(x) \equiv 0 \pmod{m_1m_2}$ の解の個数は、各法での解の個数の積です。
- オイラー関数の乗法性 $\varphi(mn) = \varphi(m)\varphi(n)$（$\gcd(m, n) = 1$）の証明。
- 大きな数の計算を、小さな法での計算に分けて行う（RSA 暗号の復号の高速化など）。

## 試験での問われ方

数検1級では、連立合同式を解く計算問題、合成数を法とする合同方程式の解の個数を求める問題、定理の証明（存在と一意性）が出ます。

## よくある誤り

- 法が互いに素でない場合にも定理をそのまま使う。$x \equiv 1 \pmod 4$、$x \equiv 2 \pmod 6$ は、偶奇が矛盾するので解がありません。互いに素でないときは、共通の約数について条件が両立するかを確かめます。
- $y_i$ を $M_i$ の $\bmod m_i$ での逆元ではなく、$m_i$ の逆元として計算する。
- 解を $\bmod M$ で答えず、1 つの値だけを答える。
