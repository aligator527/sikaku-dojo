---
term: '共分散'
reading: きょうぶんさん
en: 'covariance'
exams: [toukei-2, toukei-jun1, toukei-1, toukei-dse, jdla-e]
summary: '2 つの変数の偏差の積の平均。一方が平均より大きいとき他方も大きい傾向があれば正、逆の傾向があれば負になる。'
related: [correlation-coefficient, variance, covariance-matrix, scatter-plot]
formula: '\mathrm{Cov}(X, Y) = E\left[(X-\mu_X)(Y-\mu_Y)\right] = E[XY] - E[X]E[Y]'
---
## 定義

確率変数 $X, Y$ について $\mathrm{Cov}(X, Y) = E[(X - \mu_X)(Y - \mu_Y)]$ を共分散といいます。2 変数のデータ $(x_i, y_i)$ では

$$s_{xy} = \frac{1}{n}\sum_{i=1}^{n}(x_i - \bar{x})(y_i - \bar{y})$$

です（$n-1$ で割る流儀もあります）。$\sum (x_i - \bar{x})(y_i - \bar{y})$ を偏差積和と呼びます。

## 直感的な意味

散布図を平均 $(\bar{x}, \bar{y})$ を通る縦横の線で 4 つに分けると、右上と左下の点は偏差の積が正、左上と右下の点は負になります。右上・左下に点が多ければ共分散は正、左上・右下に多ければ負です。

## 性質

- $\mathrm{Cov}(X, X) = V[X]$、$\mathrm{Cov}(X, Y) = \mathrm{Cov}(Y, X)$。
- 1 次変換：$\mathrm{Cov}(aX + b,\ cY + d) = ac\,\mathrm{Cov}(X, Y)$。単位を変えると値が変わるので、関係の強さの比較には相関係数 $\mathrm{Cov}(X, Y)/(\sigma_X\sigma_Y)$ を使う。
- 双線形性：$\mathrm{Cov}(X + Y, Z) = \mathrm{Cov}(X, Z) + \mathrm{Cov}(Y, Z)$。
- $X, Y$ が独立なら $\mathrm{Cov}(X, Y) = 0$。逆は成り立たない。例：$X \sim N(0, 1)$、$Y = X^2$ では $\mathrm{Cov}(X, Y) = E[X^3] = 0$ だが、$Y$ は $X$ で完全に決まる。

## 計算例

$(x, y) = (1, 2), (2, 4), (3, 3), (4, 6), (5, 5)$ では $\bar{x} = 3$、$\bar{y} = 4$ で、偏差の積は $4, 0, 0, 2, 2$、その平均は $8/5 = 1.6$ です。$E[XY] - E[X]E[Y] = 13.6 - 12 = 1.6$ でも同じ値になります。

## 試験での問われ方

統計検定2級では、表からの共分散と相関係数の計算、単位変換（cm から m など）で共分散と相関係数がどう変わるか、$V[X + Y]$ や $V[X - Y]$ に共分散の項を入れる計算が典型です。準1級・1級では、分散共分散行列による線形結合の分散 $V[a^\top X] = a^\top \Sigma a$、条件付き期待値を使った共分散の計算、推定量どうしの共分散が問われます。

## よくある誤り

- 共分散の大きさだけで関係の強さを比べる。単位や散らばりに依存するので、相関係数に直してから比べる。
- 共分散が 0 なら独立と考える。0 が意味するのは「直線的な関係がない」ことだけである（同時分布が 2 変量正規分布の場合に限り、独立と同値になる）。
- 和の分散で $2\,\mathrm{Cov}(X, Y)$ を足し忘れる、または差の分散で符号を誤る。
