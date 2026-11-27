---
term: '条件数'
reading: じょうけんすう
en: 'condition number'
exams: [toukei-dse, jdla-e, toukei-1, toukei-jun1]
summary: '行列（問題）が入力の誤差をどれだけ拡大するかを表す数。2-ノルムでは最大特異値と最小特異値の比で、大きいほど数値的に不安定になる。'
related: [singular-value-decomposition, norm, inverse-matrix, gradient-descent, multicollinearity]
formula: '\kappa(A) = \|A\|\,\|A^{-1}\|,\qquad \kappa_2(A) = \frac{\sigma_{\max}(A)}{\sigma_{\min}(A)}'
---
## 定義

正則行列 $A$ の**条件数**は $\kappa(A) = \|A\|\,\|A^{-1}\|$ です。行列の 2-ノルム（スペクトルノルム）を使うと

$$\kappa_2(A) = \frac{\sigma_{\max}(A)}{\sigma_{\min}(A)}$$

と最大・最小の特異値の比になり、対称な正定値行列なら最大固有値と最小固有値の比 $\lambda_{\max}/\lambda_{\min}$ です。つねに $\kappa(A) \ge 1$ で、直交行列なら 1、特異（正則でない）行列では無限大とみなします。

## 誤差の拡大

連立方程式 $A\boldsymbol{x} = \boldsymbol{b}$ で $\boldsymbol{b}$ に誤差 $\delta\boldsymbol{b}$ が入ると、解の誤差 $\delta\boldsymbol{x}$ は

$$\frac{\|\delta\boldsymbol{x}\|}{\|\boldsymbol{x}\|} \le \kappa(A)\,\frac{\|\delta\boldsymbol{b}\|}{\|\boldsymbol{b}\|}$$

で抑えられます。つまり条件数は相対誤差の最大の拡大率で、$\kappa \approx 10^k$ なら最大でおよそ $k$ 桁の精度が失われます。例えば $\operatorname{diag}(10, 0.1)$ の条件数は 100 です。

## 統計・機械学習での意味

- 回帰分析：説明変数どうしの相関が強いと $X^{\top}X$ の最小固有値が 0 に近づき、条件数が大きくなります。推定値が不安定になる多重共線性の数値的な表れです。$X^{\top}X$ の条件数は $X$ の条件数の 2 乗になるので、正規方程式を直接解くより QR 分解や特異値分解を使うほうが安定です。
- リッジ回帰：$X^{\top}X + \lambda I$ の条件数は $(\lambda_{\max} + \lambda)/(\lambda_{\min} + \lambda)$ に下がります。
- 勾配降下法：二次関数 $\frac{1}{2}\boldsymbol{w}^{\top}A\boldsymbol{w}$ の最小化では、ヘッセ行列 $A$ の条件数が大きいほど等高線が細長い楕円になってジグザグに進み、収束が遅くなります。標準化などの前処理や、モメンタム・適応的学習率の手法はこれを和らげます。

## 試験での問われ方

統計検定データサイエンスエキスパートでは、特異値から条件数を計算する、条件数と解の誤差の関係、正則化や標準化による改善を選ぶ問題が出ます。E資格では、モメンタムの項目にある Pathological Curvature の背景として、ヘッセ行列の固有値の比と勾配降下法の収束の速さの関係が問われます。

## よくある誤り

- 条件数を行列式の大きさで判断する。行列全体を定数倍すると行列式は大きく変わりますが、条件数は変わりません。
- 一般の行列で、条件数を固有値の比で計算する。2-ノルムの条件数は特異値の比です（対称行列なら固有値の絶対値の比と一致）。
- 条件数が小さいほど問題が悪いと逆に覚える。
