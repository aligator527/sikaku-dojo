---
term: '部分積分'
reading: ぶぶんせきぶん
en: 'integration by parts'
aliases: ['部分積分法']
exams: [suken-1, toukei-1, toukei-jun1]
summary: '積の微分公式 (fg)′ = f′g + fg′ を積分した公式で、∫f g′ dx を ∫f′g dx に置き換えて計算する方法。'
related: [integration-by-substitution, gamma-function, improper-integral, recurrence-relation]
formula: '\int_a^b f(x)g''(x)\,dx = \bigl[f(x)g(x)\bigr]_a^b - \int_a^b f''(x)g(x)\,dx'
---
## 公式

積の微分 $(fg)' = f'g + fg'$ を積分すると

$$\int f(x)g'(x)\,dx = f(x)g(x) - \int f'(x)g(x)\,dx$$

が得られます。定積分では第 1 項が $[f g]_a^b$ になります。「微分すると簡単になるもの」を $f$、「積分しやすいもの」を $g'$ に選ぶのがコツで、多項式×指数関数、多項式×三角関数、多項式×対数関数などに使います。

## 計算例

- $\displaystyle\int xe^x\,dx = xe^x - \int e^x\,dx = (x - 1)e^x + C$
- $\displaystyle\int \log x\,dx = \int 1\cdot\log x\,dx = x\log x - \int x\cdot\frac{1}{x}\,dx = x\log x - x + C$（$g' = 1$ とみる）
- $\int e^x\sin x\,dx$ のように 2 回部分積分すると元の積分が再び現れる場合は、それを未知数として方程式を解きます。結果は $\frac{1}{2}e^x(\sin x - \cos x) + C$ です。

## 漸化式・特殊関数への応用

- ガンマ関数：$\Gamma(s + 1) = \int_0^\infty t^s e^{-t}dt = [-t^se^{-t}]_0^\infty + s\int_0^\infty t^{s-1}e^{-t}dt = s\Gamma(s)$
- ウォリス積分：$I_n = \int_0^{\pi/2}\sin^n x\,dx$ は $I_n = \frac{n-1}{n}I_{n-2}$ を満たします。
- 統計：非負の確率変数で $E[X] = \int_0^\infty P(X > x)\,dx$ を示すときや、正規分布の高次モーメント $E[Z^{2k}] = (2k-1)E[Z^{2k-2}]$ を導くときに使います。

## 試験での問われ方

数検1級では、不定積分・定積分の計算そのもののほか、積分で定義された数列の漸化式を導く問題、広義積分で境界項 $[fg]$ が 0 に収束することを示す問題が頻出です。統計検定1級・準1級では、期待値や分散を密度関数の積分から計算する際に使います。

## よくある誤り

- 符号を誤り、$\int f'g$ の前を $+$ にする。
- 広義積分で、境界項 $[fg]$ の極限（$t^se^{-t} \to 0$ など）を確かめずに 0 とする、または計算し忘れる。
- $f$ と $g'$ の選び方を逆にして、かえって複雑な積分を作る（$\int xe^x dx$ で $f = e^x$ とするなど）。
