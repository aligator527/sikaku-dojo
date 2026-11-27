---
term: '変数変換'
reading: へんすうへんかん
en: 'transformation of random variables'
exams: [toukei-jun1, toukei-1, toukei-dse, suken-1, jdla-e]
summary: '確率変数 X の関数 Y = g(X) の分布を、X の分布から求める方法。連続型では密度に変換の微分（多変数ではヤコビアン）の絶対値を掛ける。'
related: [jacobian, probability-density-function, cumulative-distribution-function, joint-distribution, chi-square-distribution]
formula: 'f_Y(y) = f_X\left(g^{-1}(y)\right)\left|\frac{d}{dy}g^{-1}(y)\right|'
---
## 1 変数の場合

$g$ が単調で微分可能なら、$Y = g(X)$ の密度は上の式で求まります。確率は「区間の幅」にも依存するので、$x$ から $y$ への変換で幅が何倍になるかを表す $|dx/dy|$ を掛ける必要があります。

単調でない変換では、$y = g(x)$ となる $x$ が複数あるので、それぞれの寄与を足し合わせます。迷ったときは、分布関数 $F_Y(y) = P(g(X) \leq y)$ を直接計算して微分する **分布関数法** が確実です。

## 計算例

- $X \sim U(0, 1)$、$Y = -\log X$：$x = e^{-y}$、$|dx/dy| = e^{-y}$ なので $f_Y(y) = e^{-y}$（$y > 0$）。$Y$ は平均 1 の指数分布。
- $X \sim N(0, 1)$、$Y = X^2$：$x = \pm\sqrt{y}$ の 2 つの寄与を足して $f_Y(y) = 2\phi(\sqrt{y}) \cdot \dfrac{1}{2\sqrt{y}} = \dfrac{1}{\sqrt{2\pi y}}e^{-y/2}$。自由度 1 のカイ二乗分布。
- $X \sim N(\mu, \sigma^2)$、$Y = e^X$：対数正規分布 $f_Y(y) = \dfrac{1}{y\sigma\sqrt{2\pi}}\exp\left\{-\dfrac{(\log y - \mu)^2}{2\sigma^2}\right\}$。

## 多変数の場合

$(U, V) = g(X, Y)$ が 1 対 1 なら

$$f_{U,V}(u, v) = f_{X,Y}\big(x(u, v),\ y(u, v)\big)\left|\frac{\partial(x, y)}{\partial(u, v)}\right|$$

です。和や比など 1 つの変数だけが必要なときは、補助の変数を加えて 2 変数の変換にし、あとで周辺化します。

**例**：$X, Y$ が独立に $\mathrm{Exp}(1)$ に従うとき、$U = X + Y$、$V = X/(X + Y)$ とすると $x = uv$、$y = u(1 - v)$、ヤコビアンの絶対値は $u$ で、$f_{U,V}(u, v) = ue^{-u}$（$u > 0$、$0 < v < 1$）。$U \sim \mathrm{Ga}(2, 1)$、$V \sim U(0, 1)$ で、両者は独立です。

和だけなら、畳み込みの公式 $f_{X+Y}(z) = \int f_X(x)f_Y(z - x)\,dx$ も使えます。

## 試験での問われ方

統計検定準1級・1級では、1 変数の変換（対数・逆数・2 乗）による密度の導出、2 変数の変換による和・差・比・積の分布、カイ二乗分布・t 分布・F 分布・ベータ分布の導出、極座標変換（ボックス・ミュラー法）が繰り返し出題されます。統計検定データサイエンスエキスパートでは、乱数生成（逆関数法）の基礎として現れます。

## よくある誤り

- $|dx/dy|$（ヤコビアン）を掛け忘れる。
- 単調でない変換で、片側の枝の寄与だけを数える。
- 変換後の変数の値の範囲（台）を書き忘れる、または誤る。
- $dy/dx$ と $dx/dy$ を取り違える。掛けるのは「新しい変数で古い変数を微分したもの」の絶対値。
