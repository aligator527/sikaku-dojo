---
term: 'ユークリッド距離'
reading: ゆーくりっどきょり
en: 'Euclidean distance'
aliases: ['L2距離']
exams: [toukei-dse, jdla-e, toukei-jun1, toukei-1]
summary: '2 点の各座標の差の 2 乗和の平方根で表す、ふつうの意味での直線距離。クラスタリングや k 近傍法など、距離にもとづく多くの手法の基本になる。'
related: [manhattan-distance, mahalanobis-distance, cosine-similarity, k-means, k-nearest-neighbors]
formula: 'd(\boldsymbol x, \boldsymbol y) = \|\boldsymbol x - \boldsymbol y\|_2 = \sqrt{\sum_{j=1}^{p}(x_j - y_j)^2}'
---
## 定義

$p$ 次元の 2 点 $\boldsymbol x$、$\boldsymbol y$ の差のベクトルの L2 ノルムです。たとえば $\boldsymbol x = (1, 2, 3)$、$\boldsymbol y = (4, 6, 3)$ なら、$\sqrt{3^2 + 4^2 + 0^2} = 5$ です。

## ミンコフスキー距離との関係

$$d_q(\boldsymbol x, \boldsymbol y) = \left(\sum_{j}|x_j - y_j|^q\right)^{1/q}\quad (q \geq 1)$$

をミンコフスキー距離（L$q$ 距離）といい、$q = 2$ がユークリッド距離、$q = 1$ がマンハッタン距離、$q \to \infty$ の極限が各座標の差の最大値（チェビシェフ距離）です。上の例では、それぞれ 5、7、4 になります。

## 性質と注意

- **尺度に敏感**：単位の大きい変数（年収を円で測る、など）が距離を支配します。距離を使う前に標準化や min-max 正規化で尺度をそろえるのが基本です。
- **相関を考えない**：変数どうしが強く相関していると、同じ情報を二重に数えることになります。相関を考慮するにはマハラノビス距離を使います。
- **2 乗距離の分解**：$\|\boldsymbol x - \boldsymbol y\|^2 = \|\boldsymbol x\|^2 + \|\boldsymbol y\|^2 - 2\boldsymbol x^{\top}\boldsymbol y$ と内積で書けます。長さ 1 に正規化したベクトルどうしなら $\|\boldsymbol x - \boldsymbol y\|^2 = 2(1 - \cos\theta)$ で、ユークリッド距離による近さとコサイン類似度による近さの順序が一致します。
- **高次元**：次元が高くなると、点どうしの距離の差が相対的に小さくなります（次元の呪い）。

## 使われる手法

$k$ 平均法（クラスター内平方和は中心からのユークリッド距離の 2 乗の和）、ウォード法、$k$ 近傍法、RBF カーネル、多次元尺度構成法などが、ユークリッド距離を前提にしています。

## 試験での問われ方

統計検定データサイエンスエキスパートでは、座標の表から点どうしの距離を計算してクラスタリングや $k$ 近傍法の判定を行う問題、標準化の有無で最近傍が入れ替わる例が出ます。E資格でも、ノルムと距離の計算、コサイン類似度との関係が問われます。

## よくある誤り

- 尺度の違う変数をそのまま使う。
- $k$ 平均法などの計算で、距離そのものと距離の 2 乗を取り違える。
