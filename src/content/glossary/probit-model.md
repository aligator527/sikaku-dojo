---
term: 'プロビットモデル'
reading: ぷろびっともでる
en: 'probit model'
aliases: ['プロビット回帰', 'プロビット分析', 'プロビット']
exams: [toukei-jun1, toukei-1]
summary: '2 値の目的変数について、成功確率を説明変数の線形結合を標準正規分布の分布関数に通した値で表すモデル。正規分布に従う潜在変数がしきい値を超えると成功になる、という解釈をもつ。'
related: [logistic-regression, generalized-linear-model, link-function, standard-normal-distribution, maximum-likelihood-estimation]
formula: 'P(Y = 1 \mid \mathbf{x}) = \Phi(\beta_0 + \beta_1 x_1 + \cdots + \beta_p x_p),\qquad \Phi^{-1}(p) = \mathbf{x}^\top\boldsymbol{\beta}'
---
## モデル

成功確率 $p = P(Y = 1 \mid \mathbf{x})$ を、標準正規分布の分布関数 $\Phi$ を使って $p = \Phi(\mathbf{x}^\top\boldsymbol{\beta})$ と表します。一般化線形モデルとしては、二項分布とプロビットリンク $g(p) = \Phi^{-1}(p)$ の組合せです。

## 潜在変数による解釈

観測できない連続量 $Y^* = \mathbf{x}^\top\boldsymbol{\beta} + \varepsilon$、$\varepsilon \sim N(0, 1)$ があり、$Y^* > 0$ のとき $Y = 1$ になると考えると

$$P(Y = 1) = P(\varepsilon > -\mathbf{x}^\top\boldsymbol{\beta}) = \Phi(\mathbf{x}^\top\boldsymbol{\beta})$$

です。$\varepsilon$ の分散を 1 に固定するのは、$Y^*$ の尺度が観測からは決まらない（係数と誤差の標準偏差の比しか識別できない）ためです。$\varepsilon$ をロジスティック分布にするとロジスティック回帰になります。

## 計算例

$\beta_0 = -1,\ \beta_1 = 0.5$ のとき、$x = 3$ での成功確率は $\Phi(0.5) \approx 0.691$ です。$x$ を少し増やしたときの確率の増え方（限界効果）は $\phi(\mathbf{x}^\top\boldsymbol{\beta})\beta_1 = \phi(0.5) \times 0.5 \approx 0.176$ で、$x$ の値によって変わります。確率がちょうど 0.5 になる $x$ は $-\beta_0/\beta_1 = 2$ です（用量反応の分析では 50% 有効量 ED50、50% 致死量 LD50 と呼ぶ）。

## ロジスティック回帰との比較

| | プロビット | ロジット |
|---|---|---|
| 誤差の分布 | 標準正規（分散 1） | 標準ロジスティック（分散 $\pi^2/3$、標準偏差約 1.81） |
| 係数の解釈 | 潜在変数の標準偏差単位の変化 | $e^{\beta}$ がオッズ比 |
| 係数の大きさ | — | プロビットのおよそ 1.6〜1.8 倍 |
| 予測確率 | ほぼ同じ（裾でわずかに違う） | |

予測の結果はほとんど変わらず、オッズ比で解釈したいならロジット、潜在変数の正規性を前提にした議論（多変量への拡張、順序プロビット、選択モデル）をしたいならプロビット、と使い分けます。

## 推定

最尤法で推定します。対数尤度は $\sum_i\{y_i\log\Phi(\eta_i) + (1 - y_i)\log(1 - \Phi(\eta_i))\}$ で、プロビットは正準リンクではないため、スコア方程式はロジットほど簡単にはなりません。

## 試験での問われ方

統計検定準1級では、推定された係数から予測確率や 50% 点を求める問題、潜在変数による解釈、ロジットとの係数の大きさの違いが問われます。1級では尤度・スコアの導出や限界効果が記述式で出ることがあります。

## よくある誤り

- プロビットの係数をオッズ比として解釈する。
- 限界効果が $x$ によらず $\beta_1$ だと考える（$\phi(\eta)$ が掛かる）。
- 誤差の分散を 1 に固定していることを忘れ、ロジットとプロビットの係数を直接比べる。
