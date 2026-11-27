---
term: 'ラッソ'
reading: らっそ
en: 'lasso'
aliases: ['lasso', 'Lasso', 'LASSO', 'ラッソ回帰']
exams: [toukei-dse, toukei-jun1, toukei-1, jdla-e]
summary: '線形回帰の残差平方和に、回帰係数の絶対値の和（L1 ノルム）に比例する罰則を加えて最小化する推定法。一部の係数がちょうど 0 になるので、推定と変数選択を同時に行える。'
related: [ridge-regression, elastic-net, regularization, weight-decay, cross-validation]
formula: '\hat{\boldsymbol\beta}_{\mathrm{lasso}} = \arg\min_{\boldsymbol\beta}\left\{\|\boldsymbol y - X\boldsymbol\beta\|^2 + \lambda\|\boldsymbol\beta\|_1\right\},\qquad \|\boldsymbol\beta\|_1 = \sum_{j=1}^{p}|\beta_j|'
---
## 定義

lasso（least absolute shrinkage and selection operator）は、罰則に係数の絶対値の和を使う正則化つきの回帰です。リッジ回帰と同じく、説明変数を標準化し、切片には罰則をかけないのが普通です。$\lambda$ が大きいほど 0 になる係数が増えます。

## なぜ係数が 0 になるか

制約付き問題として見ると、「$\sum_j |\beta_j| \leq t$」という角のある領域（2 次元ではひし形）の中で残差平方和の等高線（楕円）が最初に触れる点が解になります。等高線は角、つまり座標軸上の点で触れやすいので、一部の係数がちょうど 0 になります。リッジ回帰の制約領域は円なので、角がなく 0 になりません。

計画行列が直交（$X^{\top}X = I$）なら、最小二乗推定値 $b_j$ から

$$\hat\beta_j = \mathrm{sign}(b_j)\left(|b_j| - \frac{\lambda}{2}\right)_{+}$$

と求まります（軟閾値処理）。$|b_j| \leq \lambda/2$ の係数は 0 に、それ以外は一律 $\lambda/2$ だけ 0 に近づきます。目的関数を $\frac{1}{2}\|\boldsymbol y - X\boldsymbol\beta\|^2 + \lambda\|\boldsymbol\beta\|_1$ と書く流儀では、しきい値は $\lambda$ になります。

## 性質と注意

- 目的関数は凸ですが、絶対値が 0 で微分できないため閉じた解はなく、座標降下法や LARS で解きます。
- $p > n$ のときでも推定でき、選ばれる変数は最大でも $n$ 個です。
- 強く相関する変数の組からは、そのうち 1 つだけを選びがちで、どれが選ばれるかが不安定です。この点を改めたのがエラスティックネットです。
- 係数に平均 0 のラプラス分布の事前分布を置いたときの MAP 推定値にあたります。
- 選ばれた変数について通常の検定や信頼区間をそのまま使うと、選択の影響で楽観的になります。

$\lambda$ は交差検証で選び、交差検証誤差が最小の $\lambda$ のほか、最小値から標準誤差 1 つ分以内で最も大きい $\lambda$ を選ぶ「1 標準誤差ルール」もよく使われます。

## 試験での問われ方

統計検定データサイエンスエキスパートと準1級では、直交計画での推定値（軟閾値処理）の計算、リッジ回帰との違い、交差検証による $\lambda$ の選び方、相関の強い変数があるときの挙動が出ます。E資格のシラバス 2026 では Lasso 回帰そのものは前提知識（グレー網掛けで出題対象外）ですが、深層学習の正則化（パラメータノルムペナルティー）として、L1 正則化がスパースな解を生む理由が問われます。

## よくある誤り

- しきい値を罰則の書き方（$\lambda$ か $\lambda/2$ か）を確かめずに使う。
- ラッソで 0 にならなかった変数を「因果的に重要な変数」と解釈する。
