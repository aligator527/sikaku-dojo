---
term: ヤコビアン
reading: やこびあん
en: Jacobian
aliases: [ヤコビ行列, ヤコビ行列式, 関数行列式]
exams: [suken-1, jdla-e, toukei-1]
summary: 多変数関数の偏導関数を並べた行列（ヤコビ行列）、またはその行列式。変数変換で面積・体積要素が何倍になるかを表す。
related: [determinant, chain-rule, backpropagation]
formula: 'dx\,dy = \left|\frac{\partial(x, y)}{\partial(u, v)}\right| du\,dv,\qquad \frac{\partial(x, y)}{\partial(u, v)} = \begin{vmatrix} x_u & x_v \\ y_u & y_v \end{vmatrix}'
---
## 定義

写像 $\boldsymbol f: \mathbb R^n \to \mathbb R^m$ の各成分の偏導関数を並べた $m \times n$ 行列 $J = \left(\partial f_i/\partial x_j\right)$ を**ヤコビ行列**といい、$m = n$ のときの行列式 $\det J$ を**ヤコビアン**（ヤコビ行列式）といいます。文脈によってヤコビ行列そのものをヤコビアンと呼ぶこともあります。

## 重積分の変数変換

$x = x(u, v),\ y = y(u, v)$ と変換するとき、面積要素は $dx\,dy = |\det J|\,du\,dv$ となります。代表例は極座標で、$x = r\cos\theta,\ y = r\sin\theta$ のヤコビアンは $r$ なので $dx\,dy = r\,dr\,d\theta$ です。3 次元の球座標では $r^2\sin\theta$ になります。

## 確率密度の変数変換

確率ベクトル $\boldsymbol X$ を $\boldsymbol Y = \boldsymbol g(\boldsymbol X)$（全単射）と変換すると、密度は $f_{\boldsymbol Y}(\boldsymbol y) = f_{\boldsymbol X}(\boldsymbol g^{-1}(\boldsymbol y))\,\left|\det \dfrac{\partial \boldsymbol g^{-1}}{\partial \boldsymbol y}\right|$ となります。統計検定1級の頻出事項で、フローベース生成モデルもこの式に基づきます。

## 深層学習との関係

連鎖律は「ヤコビ行列の積」として書けます。誤差逆伝播法は、出力側から勾配ベクトルとヤコビ行列の積（vector-Jacobian product）を順に計算する方法と見なせます。ソフトマックス関数のヤコビ行列 $\mathrm{diag}(\boldsymbol y) - \boldsymbol y\boldsymbol y^{\mathsf T}$ も頻出です。

## よくある誤り

- 変数変換で絶対値を付け忘れる。
- 逆変換のヤコビアン $\partial(u,v)/\partial(x,y)$ と取り違える（両者は互いに逆数）。
