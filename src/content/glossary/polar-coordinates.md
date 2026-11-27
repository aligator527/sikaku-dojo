---
term: '極座標'
reading: きょくざひょう
en: 'polar coordinates'
aliases: ['極座標変換']
exams: [suken-1, toukei-1, toukei-dse]
summary: '平面上の点を原点からの距離 r と偏角 θ で表す座標。x = r cos θ, y = r sin θ で、重積分では dx dy = r dr dθ となる。'
related: [jacobian, multiple-integral, gaussian-integral, holomorphic-function]
formula: 'x = r\cos\theta,\quad y = r\sin\theta,\qquad dx\,dy = r\,dr\,d\theta'
---
## 定義

平面の点 $(x, y)$ を、原点からの距離 $r \ge 0$ と、$x$ 軸の正の向きからの角 $\theta$（偏角）で

$$x = r\cos\theta,\qquad y = r\sin\theta$$

と表すのが**極座標**です。$r = \sqrt{x^2 + y^2}$ で、$\theta$ は $2\pi$ の整数倍を除いて決まります。ヤコビアンは $\dfrac{\partial(x, y)}{\partial(r, \theta)} = r$ なので、重積分では $dx\,dy = r\,dr\,d\theta$ になります。3 次元の極座標（球座標）$x = r\sin\theta\cos\varphi$、$y = r\sin\theta\sin\varphi$、$z = r\cos\theta$ では $dx\,dy\,dz = r^2\sin\theta\,dr\,d\theta\,d\varphi$ です。

## 使われる場面

- **円・扇形の領域の重積分**：$x^2 + y^2$ を含む被積分関数や円板上の積分が簡単になります。ガウス積分 $\int e^{-x^2}dx = \sqrt{\pi}$ の導出が代表例です。
- **曲線**：極方程式 $r = f(\theta)$ で表された曲線の囲む面積は $\frac{1}{2}\int r^2\,d\theta$、長さは $\int\sqrt{r^2 + (dr/d\theta)^2}\,d\theta$ です。
- **2 変数関数の極限**：$(x, y) \to (0, 0)$ を $r \to 0$ に置き換え、$\theta$ によらず評価できれば極限が存在します。
- **確率**：独立な標準正規分布に従う $X, Y$ を極座標で表すと、$R^2 = X^2 + Y^2$ は平均 2 の指数分布（自由度 2 のカイ二乗分布）に、$\Theta$ は $[0, 2\pi)$ の一様分布に従い、互いに独立です。正規乱数を作るボックス・ミュラー法の原理です。
- **複素数**：$z = re^{i\theta}$（極形式）で、積は「絶対値の積・偏角の和」になります。

## 計算例

円板 $x^2 + y^2 \le a^2$ 上の $\iint\sqrt{a^2 - x^2 - y^2}\,dx\,dy$ は

$$\int_0^{2\pi}\!\!\int_0^a\sqrt{a^2 - r^2}\,r\,dr\,d\theta = 2\pi\cdot\frac{a^3}{3} = \frac{2}{3}\pi a^3$$

で、半球の体積と一致します。

## 試験での問われ方

数検1級では、極座標を使った重積分・広義重積分、立体の体積、2 変数関数の極限・連続性の判定が出ます。統計検定1級やデータサイエンスエキスパートでは、2 変量正規分布の確率（象限確率や原点からの距離の分布）を極座標で計算する問題があります。

## よくある誤り

- ヤコビアン $r$ を掛け忘れる。
- 円 $x^2 + y^2 \le 2ax$ のように中心が原点でない領域で、$r$ の範囲を $0 \le r \le a$ としてしまう（正しくは $0 \le r \le 2a\cos\theta$、$-\frac{\pi}{2} \le \theta \le \frac{\pi}{2}$）。
- 2 変数の極限で、特定の $\theta$ だけを調べて極限が存在すると判断する。
