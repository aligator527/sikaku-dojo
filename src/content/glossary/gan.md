---
term: 'GAN'
reading: ぎゃん
en: 'generative adversarial network'
aliases: ['敵対的生成ネットワーク', 'Generative Adversarial Network', 'DCGAN', 'Wasserstein GAN', 'WGAN', 'Conditional GAN', 'CycleGAN', 'モード崩壊', 'mode collapse']
exams: [jdla-e, toukei-dse]
summary: '偽物のデータを作る生成器と、本物か偽物かを見分ける識別器を競わせて学習する生成モデル。最終的に、生成器は本物と見分けのつかないデータを作れるようになる。'
related: [js-divergence, vae, diffusion-model, transposed-convolution, cross-entropy]
formula: '\min_G \max_D\ V(D, G) = E_{\boldsymbol x \sim p_{\mathrm{data}}}\left[\log D(\boldsymbol x)\right] + E_{\boldsymbol z \sim p(\boldsymbol z)}\left[\log\bigl(1 - D(G(\boldsymbol z))\bigr)\right]'
---
## 仕組み

- **生成器** $G$：ノイズ $\boldsymbol z$（正規分布や一様分布から抽出）を入力して、データ $G(\boldsymbol z)$ を生成する。
- **識別器** $D$：入力が本物のデータである確率 $D(\boldsymbol x) \in (0, 1)$ を出力する。

識別器は本物に 1、偽物に 0 を出すように $V$ を最大化し、生成器は識別器をだますように $V$ を最小化します。実際には両者を交互に更新します。識別器の学習は、本物と偽物を見分ける 2 値分類のバイナリクロスエントロピーの最小化と同じです。

## 理論的な性質

生成器を固定したときの最適な識別器は

$$D^\ast(\boldsymbol x) = \frac{p_{\mathrm{data}}(\boldsymbol x)}{p_{\mathrm{data}}(\boldsymbol x) + p_g(\boldsymbol x)}$$

で、これを代入すると $V(D^\ast, G) = -\log 4 + 2D_{\mathrm{JS}}(p_{\mathrm{data}} \parallel p_g)$ となります。生成器の学習は JS ダイバージェンスの最小化にあたり、$p_g = p_{\mathrm{data}}$ のとき最小になって $D^\ast = 1/2$ です。

## 学習の難しさと工夫

- **勾配の飽和**：学習初期は識別器が偽物を簡単に見抜き $D(G(\boldsymbol z)) \approx 0$ となるため、$\log(1 - D(G(\boldsymbol z)))$ の勾配が小さくなります（$D = 0.1$ での $D$ に関する傾きは $-1/0.9 \approx -1.1$）。そこで生成器は $-\log D(G(\boldsymbol z))$ を最小化する形（non-saturating loss）に変えるのが普通です（同じ点での傾きは $-1/0.1 = -10$）。
- **モード崩壊**：生成器がデータ分布の一部のモードに対応する似たサンプルばかりを作るようになる現象です。
- **WGAN（Wasserstein GAN）**：JS ダイバージェンスの代わりに Wasserstein 距離を使い、識別器（critic）の出力にシグモイド関数を使わず、critic を 1-リプシッツ連続な関数に制約します（重みのクリッピングや勾配ペナルティ）。分布が重ならないときも意味のある勾配が得られ、学習が安定します。

## 派生モデル

- **DCGAN**：プーリングと全結合層を使わず、ストライド付きの畳み込み（識別器）と転置畳み込み（生成器）、Batch Normalization を使って学習を安定させた。
- **Conditional GAN**：クラスラベルなどの条件 $\boldsymbol y$ を生成器と識別器の **両方** に与え、条件に合ったデータを生成する。対応する画像の組で学習する pix2pix もこの一種です。
- **CycleGAN**：対応する組のないデータで画像の変換（馬 ↔ シマウマなど）を学習する。変換して元に戻すと元の画像に戻るようにするサイクル一貫性損失を使います。

## 試験での問われ方

E資格（シラバス 2026：生成器、識別器、モード崩壊、Wasserstein GAN、DCGAN、Conditional GAN、CycleGAN）では、価値関数と最適な識別器、JS ダイバージェンスとの関係、損失の実装、モード崩壊、各派生モデルの特徴が出題されます。統計検定データサイエンスエキスパートでも、VAE・拡散モデルとの比較が問われます。

## よくある誤り

- Conditional GAN で、条件を識別器だけ（または生成器だけ）に与えると考える。
- CycleGAN が対応する画像のペアを必要とすると考える（不要。必要なのは pix2pix）。
- 識別器が完全に見分けられるほど生成器の学習が進むと考える（勾配が消えて学習が進みにくくなる）。
