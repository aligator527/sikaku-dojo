---
term: 'KLダイバージェンス'
reading: けーえるだいばーじぇんす
en: 'Kullback–Leibler divergence'
aliases: ['カルバック・ライブラー情報量', 'カルバック・ライブラー・ダイバージェンス', '相対エントロピー']
exams: [jdla-e, toukei-dse, toukei-jun1, toukei-1]
summary: '2 つの確率分布 p と q の隔たりを、p のもとでの対数尤度比の期待値で測る量。0 以上で、p = q のときだけ 0 になるが、対称ではない。'
related: [entropy, cross-entropy, js-divergence, mutual-information, maximum-likelihood-estimation]
formula: 'D_{\mathrm{KL}}(p \parallel q) = \sum_{x} p(x)\log\frac{p(x)}{q(x)} = H(p, q) - H(p)'
---
## 定義

同じ集合の上の分布 $p, q$ について

$$D_{\mathrm{KL}}(p \parallel q) = \sum_{x} p(x)\log\frac{p(x)}{q(x)} = E_{x \sim p}\left[\log p(x) - \log q(x)\right]$$

と定めます。連続分布では和を積分に置き換えます。「$p$ を正しい分布としたとき、$q$ で代用すると平均でどれだけ余分な情報量（符号長）がかかるか」と解釈でき、交差エントロピーとエントロピーの差 $H(p, q) - H(p)$ に等しくなります。

## 性質

- **非負性**：$D_{\mathrm{KL}}(p \parallel q) \ge 0$。等号は $p = q$ のときだけです（ギブスの不等式）。
- **非対称性**：一般に $D_{\mathrm{KL}}(p \parallel q) \ne D_{\mathrm{KL}}(q \parallel p)$ で、三角不等式も満たさないため距離（計量）ではありません。
- $p(x) > 0$ なのに $q(x) = 0$ となる $x$ があると無限大になります。
- 正規分布どうしでは閉じた式
  $$D_{\mathrm{KL}}\left(\mathcal N(\mu_1, \sigma_1^2) \parallel \mathcal N(\mu_2, \sigma_2^2)\right) = \log\frac{\sigma_2}{\sigma_1} + \frac{\sigma_1^2 + (\mu_1 - \mu_2)^2}{2\sigma_2^2} - \frac12$$
  があり、特に
  $$D_{\mathrm{KL}}\left(\mathcal N(\mu, \sigma^2) \parallel \mathcal N(0, 1)\right) = \tfrac12\left(\mu^2 + \sigma^2 - 1 - \log\sigma^2\right)$$
  は VAE の損失の正則化項として使われます。

## 計算例

$p = \left(\tfrac12, \tfrac12\right)$、$q = \left(\tfrac14, \tfrac34\right)$ とすると（自然対数）

$$D_{\mathrm{KL}}(p \parallel q) = \tfrac12\log 2 + \tfrac12\log\tfrac23 = \tfrac12\log\tfrac43 \approx 0.144,\qquad D_{\mathrm{KL}}(q \parallel p) \approx 0.131$$

で、向きによって値が変わります。

## 機械学習での使われ方

- **最尤推定**：データの経験分布 $\hat p$ からモデル $q_\theta$ への $D_{\mathrm{KL}}(\hat p \parallel q_\theta)$ の最小化は、平均対数尤度の最大化（交差エントロピーの最小化）と同じです。$H(\hat p)$ は $\theta$ によらないためです。
- **前向きと逆向き**：$D_{\mathrm{KL}}(p \parallel q)$ を $q$ について最小化すると、$p$ の山をすべて覆おうとする広い $q$ になり（mode covering）、$D_{\mathrm{KL}}(q \parallel p)$ では 1 つの山に集中した $q$ になりやすくなります（mode seeking）。変分推論は後者を使います。
- 知識蒸留（教師と生徒の出力分布）、相互情報量（同時分布と周辺分布の積の KL）、方策最適化の制約などにも現れます。

## 試験での問われ方

E資格では離散分布での計算、正規分布の閉じた式、非対称性、交差エントロピーとの関係、VAE や知識蒸留での役割が出題されます。統計検定準1級・1級では「カルバック・ライブラー情報量」として、最尤推定や AIC の導出の背景に登場します。

## よくある誤り

- 対称だと考え、$p$ と $q$ を入れ替えても同じ値だとする。
- 期待値をとる分布を取り違える（$D_{\mathrm{KL}}(p \parallel q)$ の重みは $p$）。
- 正規分布の式で $\log(\sigma_2/\sigma_1)$ を分散の比の対数 $\log(\sigma_2^2/\sigma_1^2)$ にしてしまう。
- 交差エントロピーの最小化と KL の最小化が別の答えを与えると考える（$p$ を固定すれば同じ）。
