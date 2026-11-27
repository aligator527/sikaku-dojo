---
term: '判別分析'
reading: はんべつぶんせき
en: 'discriminant analysis'
aliases: ['線形判別', '線形判別分析', '判別関数', 'フィッシャーの線形判別', '二次判別', '誤判別率']
exams: [toukei-jun1, toukei-1, toukei-dse]
summary: '所属する群が分かっている観測データから、新しい観測をどの群に分類するかの規則（判別関数）を作る手法。2 群の分散共分散行列が等しい正規分布なら、線形判別関数が最適な規則になる。'
related: [mahalanobis-distance, logistic-regression, principal-component-analysis, cross-validation, normal-distribution]
formula: 'z(\mathbf{x}) = (\boldsymbol{\mu}_1 - \boldsymbol{\mu}_2)^\top\Sigma^{-1}\left\{\mathbf{x} - \frac{1}{2}(\boldsymbol{\mu}_1 + \boldsymbol{\mu}_2)\right\} > \log\frac{\pi_2}{\pi_1}\ \Rightarrow\ G_1\ \text{に判別}'
---
## フィッシャーの線形判別

2 群 $G_1, G_2$ の観測 $\mathbf{x}$ を 1 次元の得点 $z = \mathbf{a}^\top\mathbf{x}$ に縮約するとき、群間の平均の差の 2 乗と群内の分散の比

$$\frac{\{\mathbf{a}^\top(\boldsymbol{\mu}_1 - \boldsymbol{\mu}_2)\}^2}{\mathbf{a}^\top\Sigma\mathbf{a}}$$

を最大にする方向は $\mathbf{a} \propto \Sigma^{-1}(\boldsymbol{\mu}_1 - \boldsymbol{\mu}_2)$ です（$\Sigma$ は共通の群内分散共分散行列）。この $z$ を線形判別関数といい、2 群の平均の中点を境に分類します。

## 確率モデルからの導出

各群が $N(\boldsymbol{\mu}_g, \Sigma)$（共通の $\Sigma$）に従い、事前確率が $\pi_1, \pi_2$ なら、事後確率が大きい方へ分類する規則（誤判別の確率を最小にする規則）は冒頭の式の形になり、フィッシャーの方法と一致します。事前確率が等しければしきい値は 0、誤判別の損失が群によって違えば、しきい値に損失の比を加えます。

- **分散共分散行列が群で異なる**：判別関数に $\mathbf{x}$ の 2 次の項が残り、境界が 2 次曲線になる（二次判別）。
- **マハラノビス距離による判別**：$(\mathbf{x} - \boldsymbol{\mu}_g)^\top\Sigma^{-1}(\mathbf{x} - \boldsymbol{\mu}_g)$ が小さい方の群に分類する規則は、事前確率が等しく $\Sigma$ が共通のとき線形判別と同じ。

## 計算例と誤判別率

$\boldsymbol{\mu}_1 = (2, 1)^\top$、$\boldsymbol{\mu}_2 = (0, 0)^\top$、$\Sigma = \begin{pmatrix}1 & 0.5\\ 0.5 & 1\end{pmatrix}$ なら $\Sigma^{-1}(\boldsymbol{\mu}_1 - \boldsymbol{\mu}_2) = (2, 0)^\top$ で、判別関数は $z = 2(x_1 - 1)$、つまり $x_1 > 1$ なら $G_1$ です。$x_2$ は $x_1$ との相関を通じて情報がすでに含まれているため、係数が 0 になります。

2 群の平均のマハラノビス距離は $\Delta^2 = (\boldsymbol{\mu}_1 - \boldsymbol{\mu}_2)^\top\Sigma^{-1}(\boldsymbol{\mu}_1 - \boldsymbol{\mu}_2) = 4$ で、事前確率が等しいときの誤判別率は

$$\Phi\!\left(-\frac{\Delta}{2}\right) = \Phi(-1) \approx 0.159$$

です。$\Delta$ が大きいほど 2 群はよく分かれます。

## 実際に使うときの注意

- 母数は標本平均とプールした分散共分散行列で推定する。
- 判別規則を作ったデータでそのまま誤判別率を数える（見かけの誤判別率）と楽観的になるので、交差検証（1 つ抜き法）やテストデータで評価する。
- 正規性が疑わしい、説明変数に質的変数が多い場合は、ロジスティック回帰による判別も使われる。

## 試験での問われ方

統計検定準1級・1級では、平均ベクトルと共通の分散共分散行列から判別関数としきい値を求める問題、事前確率や誤判別の損失を変えたときのしきい値、マハラノビス距離と誤判別率の計算、二次判別との違いが出ます。データサイエンスエキスパートでは分類手法の一つとして、ロジスティック回帰などと比較されます。

## よくある誤り

- 判別係数を $\boldsymbol{\mu}_1 - \boldsymbol{\mu}_2$ そのものとし、$\Sigma^{-1}$ を掛け忘れる。
- 事前確率が異なるのに、しきい値を 0（平均の中点）のままにする。
- 見かけの誤判別率を、新しいデータに対する誤判別率の推定値として報告する。
