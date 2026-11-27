---
term: '双対問題'
reading: そうついもんだい
en: 'dual problem'
aliases: ['双対定理', '強双対定理', '弱双対定理', '主問題', '双対変数']
exams: [suken-1, toukei-dse, jdla-e]
summary: '最適化問題（主問題）から、制約ごとに乗数（双対変数）を置いて作るもう一つの最適化問題。線形計画では両者の最適値が一致する（双対定理）。'
related: [linear-programming, shadow-price, complementary-slackness, kkt-conditions, lagrange-multiplier]
formula: '(\mathrm{P})\ \max\{\boldsymbol{c}^{\top}\boldsymbol{x} \mid A\boldsymbol{x} \le \boldsymbol{b},\ \boldsymbol{x} \ge \boldsymbol{0}\}\quad (\mathrm{D})\ \min\{\boldsymbol{b}^{\top}\boldsymbol{y} \mid A^{\top}\boldsymbol{y} \ge \boldsymbol{c},\ \boldsymbol{y} \ge \boldsymbol{0}\}'
---
## 定義

線形計画の**主問題**

$$(\mathrm{P})\quad \text{最大化 } \boldsymbol{c}^{\top}\boldsymbol{x}\quad \text{制約 } A\boldsymbol{x} \le \boldsymbol{b},\ \boldsymbol{x} \ge \boldsymbol{0}$$

に対して、各制約に**双対変数** $y_i \ge 0$ を対応させた

$$(\mathrm{D})\quad \text{最小化 } \boldsymbol{b}^{\top}\boldsymbol{y}\quad \text{制約 } A^{\top}\boldsymbol{y} \ge \boldsymbol{c},\ \boldsymbol{y} \ge \boldsymbol{0}$$

を**双対問題**といいます。係数行列が転置され、目的関数の係数と制約の右辺が入れ替わり、最大化が最小化に変わります。双対問題の双対は主問題に戻ります。

## 双対定理

- **弱双対定理**：(P) の任意の実行可能解 $\boldsymbol{x}$ と (D) の任意の実行可能解 $\boldsymbol{y}$ について $\boldsymbol{c}^{\top}\boldsymbol{x} \le \boldsymbol{b}^{\top}\boldsymbol{y}$。証明は $\boldsymbol{c}^{\top}\boldsymbol{x} \le (A^{\top}\boldsymbol{y})^{\top}\boldsymbol{x} = \boldsymbol{y}^{\top}A\boldsymbol{x} \le \boldsymbol{y}^{\top}\boldsymbol{b}$ の 1 行です。
- **強双対定理**（双対定理）：一方に最適解があれば他方にもあり、最適値は等しい。

弱双対定理から、$\boldsymbol{c}^{\top}\boldsymbol{x} = \boldsymbol{b}^{\top}\boldsymbol{y}$ となる実行可能解の組が見つかれば、両方とも最適だと分かります（最適性の証明書）。一方が非有界なら、他方は実行不可能です。

## 計算例

$x + y \le 4$、$x + 3y \le 6$、$x, y \ge 0$ で $x + 2y$ を最大化する問題の双対は

$$\text{最小化 } 4u + 6v\quad \text{制約 } u + v \ge 1,\ u + 3v \ge 2,\ u, v \ge 0$$

です。主問題の最適解 $(3, 1)$ では $x, y > 0$ なので、相補性条件から双対の 2 つの制約は等号になり、$u = v = \frac{1}{2}$。双対の最適値は $4\cdot\frac{1}{2} + 6\cdot\frac{1}{2} = 5$ で、主問題の最適値 5 と一致します。

## 意味と広がり

双対変数 $y_i$ は、制約 $i$ の資源を 1 単位増やしたときの最適値の増加量（シャドウプライス）を表します。非線形の最適化でも、ラグランジュ関数を使って双対問題を定義でき、凸な問題ではスレーター条件の下で強双対性が成り立ちます。サポートベクターマシンを双対問題で解くとカーネル法が使えるのは、その応用例です。

## 試験での問われ方

数検1級では、与えられた線形計画問題の双対問題を書く、弱双対定理を証明する、双対問題を解いて主問題の最適値を求める、相補性条件から最適解を確かめる問題が出ます。統計検定データサイエンスエキスパートでは、双対変数の経済的な意味や双対定理の内容を選ぶ問題が出ます。

## よくある誤り

- 双対を作るとき、係数行列を転置し忘れる。
- 主問題の制約が等式や $\ge$ のときも、双対変数を一律に非負とする（等式制約なら符号自由、最大化問題の $\ge$ 制約なら非正になります）。
- 弱双対定理の不等号の向きを逆にする（最大化問題の値は、双対の最小化問題の値以下）。
