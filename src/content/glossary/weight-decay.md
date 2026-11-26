---
term: 重み減衰
reading: おもみげんすい
en: weight decay
aliases: [weight decay, L2正則化, L1正則化, パラメータノルムペナルティー]
exams: [jdla-e]
summary: 重みの大きさに比例して毎回の更新で重みを 0 に近づける正則化手法。SGD では損失に L2 ノルムの罰則項を加えることと等価。
related: [dropout, adam, gradient-descent]
formula: 'J(\boldsymbol{w}) = L(\boldsymbol{w}) + \frac{\lambda}{2}\|\boldsymbol{w}\|_2^2 \;\Rightarrow\; \boldsymbol{w} \leftarrow (1 - \eta\lambda)\boldsymbol{w} - \eta\nabla L(\boldsymbol{w})'
---
## 定義

損失に $\tfrac{\lambda}{2}\|\boldsymbol w\|_2^2$ を加えると、その勾配 $\lambda\boldsymbol w$ により、SGD の更新式は $\boldsymbol w \leftarrow (1-\eta\lambda)\boldsymbol w - \eta\nabla L$ になります。毎回、重みが一定の割合 $(1-\eta\lambda)$ で縮むことから**重み減衰**と呼ばれます。重みが大きくなりすぎるのを防ぎ、なめらかな関数を学習させることで過学習を抑えます。

## L1 正則化との違い

| | L2 正則化（Ridge） | L1 正則化（Lasso） |
| --- | --- | --- |
| 罰則項 | $\tfrac{\lambda}{2}\sum w_i^2$ | $\lambda\sum \lvert w_i \rvert$ |
| 勾配 | $\lambda w_i$（重みに比例） | $\lambda\,\mathrm{sign}(w_i)$（一定量） |
| 解の性質 | 全体的に小さくなるが 0 にはなりにくい | 多くの重みがちょうど 0 になる（スパース） |

L1 正則化はスパース表現や特徴選択に、L2 正則化は多重共線性への対策（Ridge 回帰）にも使われます。両方を組み合わせたものを Elastic Net といいます。

## Adam との組み合わせ（AdamW）

Adam のような適応的な手法では、L2 罰則項の勾配も $\sqrt{\hat v}$ で割られるため、「L2 正則化 ＝ 重み減衰」の等価性が成り立ちません。重み減衰を勾配の正規化とは別に $\boldsymbol w \leftarrow \boldsymbol w - \eta\lambda\boldsymbol w$ として適用する方法を AdamW（decoupled weight decay）といいます。

## 試験での問われ方

E資格では、正則化項を加えたときの更新式、L1 と L2 の性質の違い（スパース性）、正則化係数の大小による過学習・過少適合の傾向、AdamW の位置づけが問われます。

## よくある誤り

- $\tfrac{\lambda}{2}$ の $\tfrac12$ は微分で消えるための係数。罰則項を $\lambda\|\boldsymbol w\|^2$ と定義した場合は勾配が $2\lambda\boldsymbol w$ になる。
- バイアス項やバッチ正規化の $\gamma, \beta$ には重み減衰を適用しないのが一般的。
