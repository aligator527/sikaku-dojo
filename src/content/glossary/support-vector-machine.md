---
term: 'サポートベクターマシン'
reading: さぽーとべくたーましん
en: 'support vector machine'
aliases: ['SVM', 'ソフトマージン', 'ハードマージン', 'マージン最大化', 'ヒンジ損失']
exams: [toukei-dse, jdla-e]
summary: '2 つのクラスを分ける超平面のうち、最も近いデータ点（サポートベクター）までの距離（マージン）が最大になるものを選ぶ分類手法。カーネル法と組み合わせて非線形な境界も作れる。'
related: [kernel-method, logistic-regression, lagrange-multiplier, k-nearest-neighbors]
formula: '\min_{\boldsymbol w, b, \boldsymbol\xi}\ \frac{1}{2}\|\boldsymbol w\|^2 + C\sum_{i=1}^{n}\xi_i\quad \text{s.t.}\quad y_i(\boldsymbol w^{\top}\boldsymbol x_i + b) \geq 1 - \xi_i,\ \ \xi_i \geq 0'
---
## ハードマージン

ラベルを $y_i \in \{-1, +1\}$ とし、判別関数を $f(\boldsymbol x) = \boldsymbol w^{\top}\boldsymbol x + b$ とします。データが線形分離可能なら、すべての点で $y_i f(\boldsymbol x_i) \geq 1$ を満たす中で $\|\boldsymbol w\|^2/2$ を最小にします。境界から最も近い点までの距離は $1/\|\boldsymbol w\|$、両側を合わせたマージンの幅は $2/\|\boldsymbol w\|$ なので、これはマージンの最大化と同じです。

### 例

クラス $-1$ の点 $(1, 1)$ とクラス $+1$ の点 $(3, 3)$ だけなら、解は $\boldsymbol w = (0.5, 0.5)$、$b = -2$ で、境界は $x_1 + x_2 = 4$ です。マージンの幅は $2/\|\boldsymbol w\| = 2\sqrt{2}$ で、2 点間の距離に一致します。

## ソフトマージン

分離できないデータや外れ値に対応するため、制約の破れを表すスラック変数 $\xi_i$ を入れ、上の式のように罰則 $C\sum\xi_i$ を加えます。$C$ が大きいほど誤分類を許さず（ハードマージンに近い）、境界が複雑になってバリアンスが大きくなります。$C$ が小さいほどマージンを広くとり、誤分類を多く許します。

この問題は、ヒンジ損失 $\max(0, 1 - y_i f(\boldsymbol x_i))$ の和に L2 正則化を加えた $\sum_i \max(0, 1 - y_i f(\boldsymbol x_i)) + \frac{1}{2C}\|\boldsymbol w\|^2$ の最小化と同じです。$y_i f(\boldsymbol x_i) \geq 1$ の点は損失が 0 で、境界の決定に影響しません。

## 双対問題とサポートベクター

ラグランジュの未定乗数法で双対問題に直すと、

$$\max_{\boldsymbol\alpha}\ \sum_i \alpha_i - \frac{1}{2}\sum_{i,j}\alpha_i\alpha_j y_i y_j\,\boldsymbol x_i^{\top}\boldsymbol x_j\quad \text{s.t.}\quad 0 \leq \alpha_i \leq C,\ \sum_i \alpha_i y_i = 0$$

となり、$\boldsymbol w = \sum_i \alpha_i y_i \boldsymbol x_i$ です。$\alpha_i > 0$ となる点（マージンの上か内側、あるいは誤分類された点）がサポートベクターで、それ以外の点を取り除いても解は変わりません。データが内積 $\boldsymbol x_i^{\top}\boldsymbol x_j$ の形でしか現れないので、カーネル関数に置き換えて非線形にできます。

## 試験での問われ方

統計検定データサイエンスエキスパートでは、少数の点にハードマージン SVM を当てはめて境界やマージンの幅を求める問題、$C$ の大小と過学習の関係、どの点がサポートベクターになるか、ヒンジ損失との同値性が出ます。E資格のシラバス 2026 では、サポートベクターマシンを含む古典的な教師あり学習はグレー網掛け（出題対象外の前提知識）です。マージン最大化・ソフトマージン・カーネル法の考え方は、前提として理解しておく位置づけです。

## よくある誤り

- マージンの幅を $1/\|\boldsymbol w\|$ とする（片側の距離。両側の幅は $2/\|\boldsymbol w\|$）。
- $C$ を大きくすると正則化が強まると考える（逆。$C$ は誤分類への罰則の重み）。
- SVM の出力をそのまま確率として使う（確率が必要なら較正する）。
