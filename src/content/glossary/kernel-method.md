---
term: 'カーネル法'
reading: かーねるほう
en: 'kernel method'
aliases: ['カーネルトリック', 'RBFカーネル', '多項式カーネル', 'カーネルSVM']
exams: [toukei-dse, jdla-e]
summary: 'データを高次元の特徴空間に写して線形の手法を適用するとき、写像を明示的に計算せず、特徴空間での内積をカーネル関数で直接計算する手法の総称。'
related: [support-vector-machine, positive-definite-matrix, principal-component-analysis, ridge-regression]
formula: 'k(\boldsymbol x, \boldsymbol z) = \langle \phi(\boldsymbol x), \phi(\boldsymbol z) \rangle,\qquad k_{\mathrm{RBF}}(\boldsymbol x, \boldsymbol z) = \exp\left(-\gamma\|\boldsymbol x - \boldsymbol z\|^2\right)'
---
## カーネルトリック

SVM の双対問題やリッジ回帰の解のように、データが内積 $\boldsymbol x_i^{\top}\boldsymbol x_j$ の形でしか現れないアルゴリズムでは、写像 $\phi$ で特徴空間に移した後の内積 $\langle\phi(\boldsymbol x_i), \phi(\boldsymbol x_j)\rangle$ をカーネル関数 $k(\boldsymbol x_i, \boldsymbol x_j)$ に置き換えるだけで、特徴空間での線形手法（元の空間では非線形な手法）が使えます。特徴空間の次元が非常に高くても、計算はデータ数 $n$ に対する $n \times n$ のグラム行列で済みます。

## 代表的なカーネル

- **線形カーネル**：$\boldsymbol x^{\top}\boldsymbol z$
- **多項式カーネル**：$(\boldsymbol x^{\top}\boldsymbol z + c)^d$。2 次元の入力で $(\boldsymbol x^{\top}\boldsymbol z + 1)^2$ は、$\phi(\boldsymbol x) = (1, \sqrt{2}x_1, \sqrt{2}x_2, x_1^2, x_2^2, \sqrt{2}x_1x_2)$ の 6 次元の特徴空間の内積に一致します。$p$ 次元の入力の 2 次の多項式カーネルなら、特徴空間の次元は $\binom{p + 2}{2}$ です（$p = 3$ で 10）。
- **ガウス（RBF）カーネル**：$\exp(-\gamma\|\boldsymbol x - \boldsymbol z\|^2)$。対応する特徴空間は無限次元です。$\gamma$ が大きいほど各点の影響範囲が狭くなり、境界が複雑になって過学習しやすくなります。

## カーネルの条件

関数 $k$ がある特徴空間の内積として表せるのは、任意の点の組についてグラム行列 $K_{ij} = k(\boldsymbol x_i, \boldsymbol x_j)$ が対称な半正定値行列になるとき（正定値カーネル）です。正定値カーネルの和・正の定数倍・積もまた正定値カーネルになります。

## 使われる手法

サポートベクターマシンのほか、カーネルリッジ回帰、カーネル主成分分析、ガウス過程回帰などがあります。データ数 $n$ が大きいと、$n \times n$ のグラム行列の計算と記憶（$O(n^2)$）や逆行列の計算（$O(n^3)$）が重くなるのが弱点です。

## 試験での問われ方

統計検定データサイエンスエキスパートでは、多項式カーネルに対応する特徴写像の次元や成分を求める問題、カーネルトリックの意味を選ぶ問題、RBF カーネルの $\gamma$ と SVM の $C$ を変えたときの境界の変化が出ます。E資格のシラバス 2026 では、サポートベクターマシンとカーネル法は前提知識（グレー網掛けで出題対象外）です。

## よくある誤り

- カーネル法では写像 $\phi(\boldsymbol x)$ を実際に計算してから内積をとると考える。
- 任意の類似度関数をカーネルとして使えると考える（半正定値性が必要）。
- 畳み込みニューラルネットワークの「カーネル（フィルタ）」と混同する。
