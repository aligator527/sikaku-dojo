---
term: ヘッセ行列
reading: へっせぎょうれつ
en: Hessian matrix
aliases: [ヘシアン, ヘッシアン]
exams: [suken-1, jdla-e]
summary: 多変数関数の 2 階偏導関数を並べた対称行列。停留点が極大・極小・鞍点のどれかを判定し、関数の曲率を表す。
related: [positive-definite-matrix, eigenvalue, taylor-expansion, gradient-descent]
formula: 'H(f) = \left(\frac{\partial^2 f}{\partial x_i \partial x_j}\right)_{i,j}'
---
## 定義

$C^2$ 級の関数 $f(x_1, \ldots, x_n)$ の 2 階偏導関数を並べた $n \times n$ 行列 $H = (\partial^2 f/\partial x_i\partial x_j)$ を**ヘッセ行列**といいます。$C^2$ 級なら偏微分の順序を交換できるので対称行列です。

## 極値の判定

$\nabla f(\boldsymbol a) = \boldsymbol 0$（停留点）のとき、

- $H(\boldsymbol a)$ が正定値 → 極小
- $H(\boldsymbol a)$ が負定値 → 極大
- 正と負の固有値を持つ → 鞍点（極値ではない）
- 0 の固有値を持つ → この方法では判定できない

2 変数では $D = f_{xx}f_{yy} - f_{xy}^2$ を使い、$D > 0$ かつ $f_{xx} > 0$ で極小、$D > 0$ かつ $f_{xx} < 0$ で極大、$D < 0$ で鞍点です。

## 深層学習との関係

- 損失関数のヘッセ行列の固有値は各方向の曲率を表します。最大固有値と最小固有値の比（条件数）が大きいと、勾配降下法は谷の壁の間を振動して進みにくくなります（Pathological Curvature）。モメンタムや適応的学習率はこの問題への対策です。
- 高次元の損失関数では、極小点よりも鞍点が多いと考えられています。
- ニュートン法は $\boldsymbol\theta \leftarrow \boldsymbol\theta - H^{-1}\nabla f$ で更新しますが、パラメータ数 $n$ に対して $H$ が $n^2$ 要素になるため、大規模なニューラルネットワークでは直接は使われません。

## よくある誤り

- 2 変数の判定で $D = 0$ の場合を極値なしと決めつける（判定不能であり、別途調べる必要がある）。
- 停留点であることを確認せずにヘッセ行列だけで判定する。
