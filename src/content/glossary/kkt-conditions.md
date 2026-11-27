---
term: 'KKT条件'
reading: けーけーてぃーじょうけん
en: 'Karush-Kuhn-Tucker conditions'
aliases: ['カルーシュ・クーン・タッカー条件', 'KKT']
exams: [toukei-dse]
summary: '不等式制約つきの最適化問題で、最適解が満たすべき条件。勾配の釣り合い、制約の充足、乗数の非負性、相補性条件からなる。'
related: [lagrange-multiplier, convex-function, gradient]
formula: '\nabla f(\boldsymbol{x}^*) + \sum_i \mu_i \nabla g_i(\boldsymbol{x}^*) = \boldsymbol{0},\quad g_i(\boldsymbol{x}^*) \le 0,\quad \mu_i \ge 0,\quad \mu_i\, g_i(\boldsymbol{x}^*) = 0'
---
## 定義

問題「$g_i(\boldsymbol{x}) \le 0\ (i = 1, \ldots, m)$ の下で $f(\boldsymbol{x})$ を最小化する」に対し、ラグランジュ関数 $L(\boldsymbol{x}, \boldsymbol{\mu}) = f(\boldsymbol{x}) + \sum_i \mu_i g_i(\boldsymbol{x})$ を考えます。点 $\boldsymbol{x}^*$ と乗数 $\mu_i$ が次の 4 つを満たすことを **KKT 条件**（カルーシュ・クーン・タッカー条件）といいます。

1. 停留条件：$\nabla f(\boldsymbol{x}^*) + \sum_i \mu_i \nabla g_i(\boldsymbol{x}^*) = \boldsymbol{0}$
2. 主実行可能性：$g_i(\boldsymbol{x}^*) \le 0$
3. 双対実行可能性：$\mu_i \ge 0$
4. 相補性条件：$\mu_i\, g_i(\boldsymbol{x}^*) = 0$

等式制約 $h_j(\boldsymbol{x}) = 0$ があれば、符号の制約がない乗数 $\lambda_j$ をつけて停留条件に加えます。等式制約だけならラグランジュの未定乗数法と同じです。

## 意味

相補性条件により、効いていない制約（$g_i < 0$）の乗数は 0、乗数が正なら制約は等号で効いています。$\mu_i$ は制約を緩めたときに目的関数がどれだけ改善するかを表し、線形計画法のシャドウプライスに対応します。

制約の勾配に関する正則条件（制約想定）の下で、KKT 条件は局所最適解の**必要条件**です。$f$ と $g_i$ が凸なら**十分条件**にもなり、スレーター条件（すべての $g_i(\boldsymbol{x}) < 0$ を満たす点がある）が成り立てば必要十分になります。

## 計算例

$x \le 1$ の下で $f(x) = (x - 2)^2$ を最小化します。$g(x) = x - 1$ として、停留条件は $2(x - 2) + \mu = 0$ です。$\mu = 0$ とすると $x = 2$ で制約に反するので、制約が効いて $x = 1$、このとき $\mu = 2 \ge 0$ となり、KKT 条件を満たします。最小値は $f(1) = 1$ です。

## 試験での問われ方

統計検定データサイエンスエキスパートでは、予算などの不等式制約つき最適化で KKT 条件を正しく述べた選択肢を選ぶ、相補性条件から効いている制約を判断する、サポートベクターマシンの双対問題の背景として問われます。

## よくある誤り

- 乗数の符号条件 $\mu_i \ge 0$ を忘れる、または最大化問題と最小化問題で符号の向きを取り違える。
- 非凸な問題でも KKT 条件を満たせば最適だと考える。非凸では必要条件にすぎません。
- 効いていない制約の乗数を 0 にし忘れ、連立方程式が解けなくなる。
