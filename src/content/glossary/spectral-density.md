---
term: 'スペクトル密度'
reading: すぺくとるみつど
en: 'spectral density'
aliases: ['スペクトル密度関数', 'パワースペクトル', 'ピリオドグラム']
exams: [toukei-1, toukei-dse]
summary: '定常時系列の分散が、どの周波数の変動にどれだけ配分されているかを表す関数。自己共分散関数のフーリエ変換で、周波数領域での時系列解析の基本になる。'
related: [autocovariance-function, stationarity, white-noise, arma-model]
formula: 'f(\lambda) = \frac{1}{2\pi}\sum_{h=-\infty}^{\infty}\gamma(h)e^{-ih\lambda} = \frac{1}{2\pi}\Bigl\{\gamma(0) + 2\sum_{h=1}^{\infty}\gamma(h)\cos h\lambda\Bigr\},\quad -\pi \leq \lambda \leq \pi'
---
## 定義と性質

自己共分散が絶対総和可能（$\sum\lvert\gamma(h)\rvert < \infty$）な弱定常過程について、冒頭の式で定めた $f(\lambda)$ をスペクトル密度といいます（係数 $1/(2\pi)$ の付け方は本によって異なります）。

- $\gamma(h)$ が偶関数なので、$f(\lambda)$ は実数値の偶関数で、$f(\lambda) \geq 0$。
- 逆変換 $\gamma(h) = \int_{-\pi}^{\pi}e^{ih\lambda}f(\lambda)\,d\lambda$ が成り立ち、特に $V[X_t] = \gamma(0) = \int_{-\pi}^{\pi}f(\lambda)\,d\lambda$。分散を周波数ごとに分解したもの、と読めます。
- 周波数 $\lambda$ の成分は周期 $2\pi/\lambda$ の変動にあたる。$\lambda = 0$ 付近が大きければゆっくりした変動（長期の波）が、$\lambda = \pi$ 付近が大きければ符号が交互に変わる細かい変動が強い。

## 代表的なスペクトル

| 過程 | スペクトル密度 |
|---|---|
| ホワイトノイズ | $\sigma^2/(2\pi)$（平坦） |
| MA(1) $X_t = \varepsilon_t + \theta\varepsilon_{t-1}$ | $\dfrac{\sigma^2}{2\pi}(1 + 2\theta\cos\lambda + \theta^2)$ |
| AR(1) $X_t = \phi X_{t-1} + \varepsilon_t$ | $\dfrac{\sigma^2}{2\pi}\cdot\dfrac{1}{1 - 2\phi\cos\lambda + \phi^2}$ |
| ARMA | $\dfrac{\sigma^2}{2\pi}\dfrac{\lvert\theta(e^{-i\lambda})\rvert^2}{\lvert\phi(e^{-i\lambda})\rvert^2}$ |

AR(1) で $\phi = 0.8$ なら $f(0)/f(\pi) = (1 + \phi)^2/(1 - \phi)^2 = 81$ で、低い周波数に分散が集中し、隣り合う値が似た滑らかな系列になります。$\phi < 0$ なら逆に高い周波数が強くなります。

## 線形フィルタ

$Y_t = \sum_j a_jX_{t-j}$ のスペクトルは $f_Y(\lambda) = \lvert A(e^{-i\lambda})\rvert^2f_X(\lambda)$（$A(z) = \sum_j a_jz^j$）です。1 階差分 $A(z) = 1 - z$ では $\lvert A\rvert^2 = 2(1 - \cos\lambda)$ で、$\lambda = 0$ の成分（トレンド）を消します。季節差分や移動平均による平滑化の効果も、この形で周波数ごとに調べられます。

## 推定：ピリオドグラム

データの離散フーリエ変換の絶対値の 2 乗 $I(\lambda) = \dfrac{1}{2\pi n}\Bigl\lvert\sum_{t=1}^{n}x_te^{-it\lambda}\Bigr\rvert^2$ をピリオドグラムといいます。$n \to \infty$ で期待値は $f(\lambda)$ に近づきますが、分散はおよそ $f(\lambda)^2$ のまま小さくならず、一致推定量になりません。そのため、近くの周波数で平均する（スペクトル窓による平滑化）、データを区切って平均する、AR モデルを当てはめてそのスペクトルを使う、といった方法で推定します。

## 試験での問われ方

統計検定1級（確率過程と時系列解析）では、MA・AR 過程のスペクトル密度の導出、逆変換による分散との関係、フィルタを通したスペクトルの変化、ピリオドグラムの性質が記述式で問われます。

## よくある誤り

- ピリオドグラムは $n$ を大きくすれば真のスペクトルに収束すると考える（分散が減らない）。
- $1/(2\pi)$ の係数の有無が違う定義を混ぜて計算する。
- スペクトルの大きい周波数を、周期ではなく周波数そのものの値で「周期」と読み違える（周期は $2\pi/\lambda$）。
