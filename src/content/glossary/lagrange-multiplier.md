---
term: ラグランジュの未定乗数法
reading: らぐらんじゅのみていじょうすうほう
en: method of Lagrange multipliers
aliases: [未定乗数法, ラグランジュ乗数, ラグランジュ関数]
exams: [suken-1, jdla-e, toukei-dse]
summary: 等式制約 g(x) = 0 の下で f(x) の極値を求めるとき、∇f = λ∇g を満たす点を候補とする方法。λ をラグランジュ乗数という。
related: [hessian-matrix, gradient-descent, positive-definite-matrix]
formula: 'L(\boldsymbol{x}, \lambda) = f(\boldsymbol{x}) - \lambda g(\boldsymbol{x}),\qquad \nabla_{\boldsymbol{x}} L = \boldsymbol{0},\ g(\boldsymbol{x}) = 0'
---
## 内容

$g(\boldsymbol x) = 0$ の下で $f(\boldsymbol x)$ が点 $\boldsymbol a$ で極値をとり、$\nabla g(\boldsymbol a) \ne \boldsymbol 0$ ならば、ある定数 $\lambda$ が存在して

$$\nabla f(\boldsymbol a) = \lambda\,\nabla g(\boldsymbol a)$$

が成り立ちます。ラグランジュ関数 $L = f - \lambda g$ の停留条件として覚えるのが一般的です。

## 直感的な意味

制約曲線（曲面）に沿って動くとき、$f$ が極値をとる点では $f$ の等高線が制約曲線に接します。接している点では 2 つの勾配ベクトルが平行になる、というのが $\nabla f = \lambda\nabla g$ の意味です。

## 使い方の注意

- この条件は**必要条件**にすぎず、得られるのは極値の「候補」です。最大・最小を決めるには、制約集合が有界閉集合であること（最大値・最小値の存在）を示して候補の値を比較するか、縁付きヘッセ行列などで判定します。
- $\nabla g = \boldsymbol 0$ となる点（特異点）は別に調べる必要があります。

## 機械学習との関係

- **サポートベクターマシン**：マージン最大化は不等式制約付きの最適化で、ラグランジュ乗数（KKT 条件）を使って双対問題に変換します。乗数が正になるデータ点がサポートベクターです。
- **主成分分析**：$\|\boldsymbol w\| = 1$ の下で分散 $\boldsymbol w^{\mathsf T}\Sigma\boldsymbol w$ を最大化すると $\Sigma\boldsymbol w = \lambda\boldsymbol w$ となり、固有値問題に帰着します。

## 試験での問われ方

数検1級の2次では、条件付き最大・最小を論証つきで求める問題として出ます。E資格では、前提知識（シラバス 2026 でグレー網掛け）の SVM の双対問題や PCA の導出の背景として現れます。
