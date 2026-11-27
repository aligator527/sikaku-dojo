---
term: 'VAE'
reading: ぶいえーいー
en: 'variational autoencoder'
aliases: ['変分オートエンコーダ', '変分自己符号化器', 'Variational Autoencoder', 'Reparameterization Trick', '再パラメータ化トリック']
exams: [jdla-e, toukei-dse]
summary: 'エンコーダが潜在変数の分布（平均と分散）を出力し、そこからサンプリングした潜在変数をデコーダで復元する生成モデル。対数尤度の下界（ELBO）を最大化して学習する。'
related: [autoencoder, kl-divergence, gan, diffusion-model, normal-distribution]
formula: '\log p_\theta(\boldsymbol x) \ge E_{q_\phi(\boldsymbol z \mid \boldsymbol x)}\left[\log p_\theta(\boldsymbol x \mid \boldsymbol z)\right] - D_{\mathrm{KL}}\left(q_\phi(\boldsymbol z \mid \boldsymbol x) \parallel p(\boldsymbol z)\right)'
---
## 構成

- **事前分布**：潜在変数 $\boldsymbol z$ は標準正規分布 $p(\boldsymbol z) = \mathcal N(\boldsymbol 0, I)$ に従うと仮定する。
- **エンコーダ**（近似事後分布）：入力 $\boldsymbol x$ から平均 $\boldsymbol\mu$ と分散 $\boldsymbol\sigma^2$（実装では $\log\boldsymbol\sigma^2$）を出力し、$q_\phi(\boldsymbol z \mid \boldsymbol x) = \mathcal N(\boldsymbol\mu, \mathrm{diag}(\boldsymbol\sigma^2))$ とする。
- **デコーダ**：$\boldsymbol z$ から $p_\theta(\boldsymbol x \mid \boldsymbol z)$ のパラメータ（画素の平均など）を出力する。

生成するときはエンコーダを使わず、$\boldsymbol z \sim \mathcal N(\boldsymbol 0, I)$ をデコーダに入れます。

## 損失（ELBO）

対数尤度 $\log p_\theta(\boldsymbol x)$ は直接計算できないので、その下界である変分下限（ELBO）を最大化します。損失はその符号を反転した

$$L = \underbrace{-E_{q}\left[\log p_\theta(\boldsymbol x \mid \boldsymbol z)\right]}_{\text{再構成誤差}} + \underbrace{D_{\mathrm{KL}}\left(q_\phi(\boldsymbol z \mid \boldsymbol x) \parallel \mathcal N(\boldsymbol 0, I)\right)}_{\text{正則化項}}$$

です。正則化項は正規分布どうしなので閉じた式で計算でき、潜在変数の各次元 $j$ について

$$D_{\mathrm{KL}} = \sum_j \frac12\left(\mu_j^2 + \sigma_j^2 - 1 - \log\sigma_j^2\right)$$

です。たとえば $\boldsymbol\mu = (1, 0)$、$\boldsymbol\sigma^2 = (1, 0.5)$ なら $0.5 + 0.097 \approx 0.597$ です。下界と真の対数尤度の差は $D_{\mathrm{KL}}(q_\phi(\boldsymbol z \mid \boldsymbol x) \parallel p_\theta(\boldsymbol z \mid \boldsymbol x))$ で、近似事後分布が真の事後分布に近いほど小さくなります。

## 再パラメータ化トリック

$\boldsymbol z$ を $q_\phi$ から直接サンプリングすると、その操作を通して $\boldsymbol\mu, \boldsymbol\sigma$ に勾配を伝えられません。そこで

$$\boldsymbol z = \boldsymbol\mu + \boldsymbol\sigma \odot \boldsymbol\varepsilon,\qquad \boldsymbol\varepsilon \sim \mathcal N(\boldsymbol 0, I)$$

と書き直し、乱数 $\boldsymbol\varepsilon$ をネットワークの外から与えます。$\boldsymbol z$ は $\boldsymbol\mu, \boldsymbol\sigma$ の微分可能な関数になるので、誤差逆伝播法で学習できます。

## 特徴

- KL 項によって潜在空間が標準正規分布の近くに整えられ、潜在変数を少しずつ動かすと出力も滑らかに変わります（補間ができる）。
- 学習は安定していますが、生成した画像は GAN よりぼやけやすい傾向があります。
- KL 項が強すぎると、デコーダが潜在変数を無視する（事後分布の崩壊）ことがあります。

## 試験での問われ方

E資格（シラバス 2026：VAE、Reparameterization Trick、変分下限）では、損失の 2 つの項の意味、KL 項の閉じた式の計算、再パラメータ化トリックの式と必要な理由、オートエンコーダ・GAN・拡散モデルとの違いが出題されます。統計検定データサイエンスエキスパートの出題範囲表には GAN と拡散モデルが挙げられており、VAE はそれらとの比較の選択肢として登場することがあります。

## よくある誤り

- 再パラメータ化トリックで $\boldsymbol z = \boldsymbol\mu + \boldsymbol\sigma^2\boldsymbol\varepsilon$ と分散を掛けてしまう（標準偏差を掛ける）。
- 変分下限を最小化すると考える（最大化する。損失としてはその符号反転を最小化）。
- KL 項の向きを $D_{\mathrm{KL}}(p(\boldsymbol z) \parallel q(\boldsymbol z \mid \boldsymbol x))$ とする。
