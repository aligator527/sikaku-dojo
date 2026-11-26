---
term: テイラー展開
reading: ていらーてんかい
en: Taylor expansion
aliases: [テイラー級数, マクローリン展開, テイラーの定理]
exams: [suken-1, jdla-e, toukei-1]
summary: 関数をある点のまわりで、その点での導関数の値を係数とするべき級数（多項式）で表すこと。a = 0 の場合をマクローリン展開という。
related: [hessian-matrix, gradient-descent, residue-theorem]
formula: 'f(x) = \sum_{k=0}^{n-1} \frac{f^{(k)}(a)}{k!}(x-a)^k + \frac{f^{(n)}(\xi)}{n!}(x-a)^n'
---
## 定義

$f$ が $n$ 回微分可能なとき、$a$ と $x$ の間のある $\xi$ を用いて

$$f(x) = \sum_{k=0}^{n-1}\frac{f^{(k)}(a)}{k!}(x-a)^k + \frac{f^{(n)}(\xi)}{n!}(x-a)^n$$

と書けます（**テイラーの定理**、最後の項はラグランジュの剰余項）。剰余項が $n \to \infty$ で 0 に収束するとき、$f$ は無限級数（テイラー級数）で表されます。

## 代表的なマクローリン展開

- $e^x = \sum_{k\ge0} x^k/k!$（すべての $x$）
- $\sin x = \sum_{k\ge0} (-1)^k x^{2k+1}/(2k+1)!$、$\cos x = \sum_{k\ge0} (-1)^k x^{2k}/(2k)!$
- $\log(1+x) = \sum_{k\ge1} (-1)^{k-1}x^k/k$（$-1 < x \le 1$）
- $(1+x)^\alpha = \sum_{k\ge0}\binom{\alpha}{k}x^k$（$|x| < 1$）

## 多変数の場合

$f(\boldsymbol x + \boldsymbol h) \approx f(\boldsymbol x) + \nabla f(\boldsymbol x)^{\mathsf T}\boldsymbol h + \tfrac12\boldsymbol h^{\mathsf T}H(\boldsymbol x)\boldsymbol h$ です（$H$ はヘッセ行列）。1 次の項までの近似が勾配降下法の根拠であり、2 次の項まで使うとニュートン法になります。

## 試験での問われ方

- **数検1級**：極限 $\lim_{x\to0}$ の計算（$\sin x - x + x^3/6$ など）、近似値の計算、級数の収束半径、剰余項の評価。
- **E資格**：勾配降下法・ニュートン法の導出、学習率が大きすぎると発散する理由（2 次の項の影響）、GELU などの近似式。
- **統計検定1級**：デルタ法（推定量の関数の漸近分散）の導出。

## よくある誤り

- 係数の $k!$ を忘れる。
- 展開が収束する範囲（収束半径）を確認せずに代入する。$\log(1+x)$ は $|x| > 1$ では使えません。
