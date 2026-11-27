---
term: 留数定理
reading: りゅうすうていり
en: residue theorem
aliases: [留数]
exams: [suken-1]
summary: 閉曲線に沿った複素積分が、内部にある孤立特異点の留数の総和の 2πi 倍に等しいという定理。実積分の計算に応用される。
related: [taylor-expansion, laurent-series]
formula: '\oint_C f(z)\,dz = 2\pi i \sum_{k} \operatorname{Res}_{z = a_k} f(z)'
---
## 内容

$f(z)$ が単純閉曲線 $C$ とその内部で、有限個の孤立特異点 $a_1, \ldots, a_m$ を除いて正則であるとき、

$$\oint_C f(z)\,dz = 2\pi i\sum_{k=1}^m \operatorname{Res}_{z=a_k} f(z)$$

が成り立ちます（$C$ は反時計回り）。**留数** $\operatorname{Res}_{z=a} f$ は、$a$ のまわりのローラン展開 $\sum_{n=-\infty}^{\infty} c_n(z-a)^n$ における $c_{-1}$ です。

## 留数の求め方

- 1 位の極：$\operatorname{Res}_{z=a} f = \lim_{z\to a}(z-a)f(z)$。$f = p/q$（$q(a) = 0,\ q'(a) \ne 0$）なら $p(a)/q'(a)$。
- $k$ 位の極：$\operatorname{Res}_{z=a} f = \dfrac{1}{(k-1)!}\lim_{z\to a}\dfrac{d^{k-1}}{dz^{k-1}}\left\{(z-a)^k f(z)\right\}$。
- 真性特異点：ローラン展開を直接求めて $c_{-1}$ を読み取る。

## 実積分への応用

1. **有理関数** $\int_{-\infty}^{\infty} P(x)/Q(x)\,dx$（分母の次数が 2 以上大きい）：上半円の閉曲線をとり、上半平面の極の留数の和を $2\pi i$ 倍する。
2. **三角関数の有理式** $\int_0^{2\pi} R(\cos\theta, \sin\theta)\,d\theta$：$z = e^{i\theta}$ と置いて単位円上の積分にする。
3. **フーリエ型** $\int_{-\infty}^\infty f(x)e^{ikx}dx$：ジョルダンの補題で半円上の積分を評価する。

## 試験での問われ方

数検1級の2次で、広義積分の値を留数定理で求める問題として出題されます。積分路の設定、留数の計算、半円上の積分が 0 に収束することの評価までを論述する必要があります。

## よくある誤り

- 積分路の外にある極の留数まで加えてしまう。
- 時計回りの積分路で符号を逆にし忘れる。
- 偶関数の $\int_0^\infty$ を求めるのに、実軸全体の積分を 2 で割り忘れる。
