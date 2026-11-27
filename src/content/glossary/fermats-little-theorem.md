---
term: 'フェルマーの小定理'
reading: ふぇるまーのしょうていり
en: 'Fermat''s little theorem'
aliases: ['オイラーの定理', 'オイラー関数']
exams: [suken-1]
summary: '素数 p と p で割り切れない整数 a について a^(p−1) ≡ 1 (mod p) が成り立つという定理。一般の法 n ではオイラーの定理 a^φ(n) ≡ 1 (mod n) に拡張される。'
related: [congruence, chinese-remainder-theorem, quadratic-residue, inclusion-exclusion-principle]
formula: 'a^{p-1} \equiv 1 \pmod{p},\qquad a^{\varphi(n)} \equiv 1 \pmod{n}\quad (\gcd(a, n) = 1)'
---
## 内容

$p$ が素数で $a$ が $p$ の倍数でなければ

$$a^{p-1} \equiv 1 \pmod p$$

です。両辺に $a$ を掛けた $a^p \equiv a \pmod p$ は、すべての整数 $a$ で成り立ちます。

証明の定番は、$a, 2a, \ldots, (p-1)a$ を $p$ で割った余りが $1, 2, \ldots, p-1$ の並べ替えになることを示し、すべて掛け合わせて $(p-1)!\,a^{p-1} \equiv (p-1)!$ から $(p-1)!$ を約す方法です。二項定理で $(a + 1)^p \equiv a^p + 1$ を示し、$a$ についての帰納法を使う方法もあります。

## オイラー関数とオイラーの定理

$n$ 以下の正の整数のうち $n$ と互いに素なものの個数を**オイラー関数** $\varphi(n)$ といいます。$n$ の相異なる素因数を $p_1, \ldots, p_r$ とすると

$$\varphi(n) = n\prod_{i=1}^r\left(1 - \frac{1}{p_i}\right)$$

で、例えば $\varphi(12) = 12\cdot\frac{1}{2}\cdot\frac{2}{3} = 4$（1, 5, 7, 11）です。$\gcd(a, n) = 1$ なら

$$a^{\varphi(n)} \equiv 1 \pmod n$$

が成り立ちます（**オイラーの定理**）。$n = p$ のとき $\varphi(p) = p - 1$ でフェルマーの小定理になります。

## 使い方

- べき乗の余り：$3^{100}$ を 7 で割った余りは、$3^6 \equiv 1$ と $100 = 6\cdot 16 + 4$ から $3^{100} \equiv 3^4 = 81 \equiv 4 \pmod 7$ です。
- 位数：$a^k \equiv 1$ となる最小の $k$（$a$ の位数）は $p - 1$（一般には $\varphi(n)$）の約数です。
- 素数判定：$a^{n-1} \not\equiv 1 \pmod n$ なら $n$ は合成数です。ただし逆は成り立たず、$561 = 3\cdot 11\cdot 17$ はすべての $a$（$\gcd(a, 561) = 1$）で $a^{560} \equiv 1$ を満たす合成数（カーマイケル数）です。
- RSA 暗号の正しさの根拠もオイラーの定理です。

関連して、素数 $p$ について $(p-1)! \equiv -1 \pmod p$（ウィルソンの定理）も成り立ちます。

## 試験での問われ方

数検1級では、べき乗の余りの計算、オイラー関数の値、位数の性質、定理そのものやウィルソンの定理の証明が出題されます。

## よくある誤り

- $a$ が $p$ の倍数の場合にも $a^{p-1} \equiv 1$ を使う。
- 合成数の法 $n$ で $a^{n-1} \equiv 1$ を使う。合成数では指数は $\varphi(n)$ で、$a$ と $n$ が互いに素である必要があります。
- フェルマーの小定理の逆（$a^{n-1} \equiv 1$ なら $n$ は素数）が成り立つと考える。
