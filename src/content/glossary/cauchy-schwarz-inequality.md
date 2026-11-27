---
term: 'コーシー・シュワルツの不等式'
reading: こーしー・しゅわるつのふとうしき
en: 'Cauchy-Schwarz inequality'
aliases: ['シュワルツの不等式']
exams: [toukei-1, suken-1, toukei-2]
summary: '内積の絶対値は 2 つのベクトルのノルムの積以下である、という不等式。相関係数が −1 以上 1 以下であることなど、多くの評価の基礎になる。'
related: [norm, correlation-coefficient, fisher-information]
formula: '\Bigl(\sum_{i=1}^n a_i b_i\Bigr)^2 \le \Bigl(\sum_{i=1}^n a_i^2\Bigr)\Bigl(\sum_{i=1}^n b_i^2\Bigr)'
---
## 内容

実数列について

$$\Bigl(\sum_{i=1}^n a_i b_i\Bigr)^2 \le \Bigl(\sum_{i=1}^n a_i^2\Bigr)\Bigl(\sum_{i=1}^n b_i^2\Bigr)$$

が成り立ち、等号は $(a_i)$ と $(b_i)$ が比例する（一方が他方の定数倍）ときに限ります。内積を使えば $|\langle \boldsymbol{x}, \boldsymbol{y}\rangle| \le \|\boldsymbol{x}\|\,\|\boldsymbol{y}\|$ です。同じ形の不等式が、積分 $\left(\int fg\right)^2 \le \int f^2 \int g^2$ や期待値 $(E[XY])^2 \le E[X^2]\,E[Y^2]$ でも成り立ちます。

## 証明の考え方

任意の実数 $t$ について $\sum (a_i t - b_i)^2 \ge 0$ です。左辺は $t$ の 2 次式 $At^2 - 2Bt + C$（$A = \sum a_i^2$、$B = \sum a_i b_i$、$C = \sum b_i^2$）なので、つねに 0 以上であるためには判別式が 0 以下、つまり $B^2 \le AC$ が必要です。これがそのまま不等式になります（$A = 0$ の場合は自明）。

## 統計での使われ方

- 相関係数：$X - E[X]$ と $Y - E[Y]$ に適用すると $\operatorname{Cov}(X, Y)^2 \le V[X]\,V[Y]$、つまり $-1 \le \rho \le 1$ が出ます。等号は $Y$ が $X$ の 1 次式のときです。
- クラメール・ラオの不等式：推定量とスコア関数の共分散に適用して、不偏推定量の分散の下限を導きます。
- 最大値問題：$x + 2y + 2z$ を $x^2 + y^2 + z^2 = 1$ の下で最大化すると、$(x + 2y + 2z)^2 \le (1 + 4 + 4)(x^2 + y^2 + z^2) = 9$ より最大値は 3 です。等号は $(x, y, z) = (1/3, 2/3, 2/3)$ のときです。

## 試験での問われ方

統計検定1級では、相関係数の範囲やクラメール・ラオの下限を導く途中で使い、等号条件から有効推定量の形を決める問題が出ます。数検1級では、条件付き最大・最小問題の別解や不等式の証明に使います。

## よくある誤り

- 等号成立条件を「$a_i = b_i$」と書く。正しくは比例関係（$b_i = c\,a_i$ または $a_i = 0$）です。
- 2 乗を外した形 $\sum a_i b_i \le \sum a_i^2 \sum b_i^2$ と覚え違える。正しくは $|\sum a_i b_i| \le \sqrt{\sum a_i^2}\sqrt{\sum b_i^2}$ です。
- 最大値を求めるとき、等号を実現する点が条件を満たすか確かめ忘れる。
