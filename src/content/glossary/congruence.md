---
term: '合同式'
reading: ごうどうしき
en: 'congruence'
aliases: ['合同方程式', '1次合同式']
exams: [suken-1]
summary: '整数 a と b を m で割った余りが等しいことを a ≡ b (mod m) と表す式。足し算・引き算・掛け算は普通の等式と同じように扱える。'
related: [chinese-remainder-theorem, fermats-little-theorem, quadratic-residue]
formula: 'a \equiv b \pmod{m} \iff m \mid a - b'
---
## 定義と計算規則

$m$ を正の整数とし、$a - b$ が $m$ で割り切れるとき $a \equiv b \pmod m$ と書き、「$a$ と $b$ は $m$ を法として合同」といいます。$a \equiv b$、$c \equiv d \pmod m$ なら

$$a \pm c \equiv b \pm d,\qquad ac \equiv bd,\qquad a^k \equiv b^k \pmod m$$

が成り立ちます。割り算は一般にはできず、$ac \equiv bc \pmod m$ から言えるのは $a \equiv b \pmod{m/\gcd(c, m)}$ です。$\gcd(c, m) = 1$ なら $c$ で割れます。

## 1 次合同式

$ax \equiv b \pmod m$ は、$d = \gcd(a, m)$ が $b$ を割り切るときに限り解をもち、そのとき解は $\bmod m$ でちょうど $d$ 個あります。$\gcd(a, m) = 1$ なら、$a$ の逆元 $a^{-1}$（$aa^{-1} \equiv 1$ となる数）を掛けて $x \equiv a^{-1}b$ と解けます。逆元は拡張ユークリッドの互除法で $au + mv = 1$ となる $u$ を求めて得ます。

例：$7x \equiv 3 \pmod{12}$。$7\cdot 7 = 49 \equiv 1$ なので $7^{-1} \equiv 7$、$x \equiv 21 \equiv 9 \pmod{12}$ です（$7\cdot 9 = 63 = 5\cdot 12 + 3$）。

1 次不定方程式 $ax + by = c$ の整数解も、$ax \equiv c \pmod b$ を解くことと同じです。

## 高次の合同方程式

$f(x) \equiv 0 \pmod{m}$ は、$m = p_1^{e_1}\cdots p_r^{e_r}$ と分解し、中国剰余定理で各 $p_i^{e_i}$ の場合に帰着させます。素数 $p$ を法とする $k$ 次の合同方程式の解は、最高次の係数が $p$ の倍数でなければ高々 $k$ 個です（ラグランジュの定理）。素数べき $p^e$ の場合は、$\bmod p$ の解を持ち上げていきます（ヘンゼルの補題）。

## よく使う性質

- 平方数は $\bmod 4$ で 0 か 1、$\bmod 3$ で 0 か 1、奇数の平方は $\bmod 8$ で 1。これを使って、不定方程式に整数解がない（$x^2 + y^2 = 3z^2$ なら $x = y = z = 0$ 以外にない）ことを示せます。
- べき乗の余りは、フェルマーの小定理やオイラーの定理で指数を小さくしてから計算します。

## 試験での問われ方

数検1級では、1 次合同式・連立合同式・高次の合同方程式の解、べき乗の余り、合同式を使った整数問題の証明（解の非存在、無限に存在すること）が出題されます。

## よくある誤り

- 合同式の両辺を、法と互いに素でない数で割る。
- $ax \equiv b \pmod m$ の解の個数を、$\gcd(a, m)$ を確かめずに 1 個とする。
- 負の数の余りの扱い（$-1 \equiv m - 1$）を誤る。
