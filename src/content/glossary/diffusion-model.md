---
term: '拡散モデル'
reading: かくさんもでる
en: 'diffusion model'
aliases: ['DDPM', 'Diffusion Model', 'diffusion model', 'ノイズ除去拡散確率モデル']
exams: [jdla-e, toukei-dse]
summary: 'データに少しずつノイズを加えて最終的に純粋なノイズにする過程を考え、その逆にノイズを少しずつ取り除く過程をニューラルネットワークで学習する生成モデル。'
related: [vae, gan, u-net, normal-distribution, large-language-model]
formula: '\boldsymbol x_t = \sqrt{\bar\alpha_t}\,\boldsymbol x_0 + \sqrt{1 - \bar\alpha_t}\,\boldsymbol\varepsilon,\qquad L = E\left[\left\|\boldsymbol\varepsilon - \boldsymbol\varepsilon_\theta(\boldsymbol x_t, t)\right\|^2\right]'
---
## 拡散過程（ノイズを加える）

DDPM では、データ $\boldsymbol x_0$ に 1 ステップごとに分散 $\beta_t$ のガウスノイズを加えます。

$$q(\boldsymbol x_t \mid \boldsymbol x_{t-1}) = \mathcal N\left(\sqrt{1 - \beta_t}\,\boldsymbol x_{t-1},\ \beta_t I\right)$$

$\alpha_t = 1 - \beta_t$、$\bar\alpha_t = \prod_{s=1}^{t}\alpha_s$ とおくと、正規分布の性質から任意の時刻の $\boldsymbol x_t$ を $\boldsymbol x_0$ から 1 回で作れます（上の式）。$\sqrt{1 - \beta_t}$ を掛けて縮めているので、ノイズを加えても分散が発散しません。

$T = 1000$、$\beta_t$ を $10^{-4}$ から $0.02$ まで線形に増やす設定では、$\bar\alpha_{500} \approx 0.079$（$\boldsymbol x_0$ の係数 $\approx 0.28$、ノイズの係数 $\approx 0.96$）、$\bar\alpha_{1000} \approx 4 \times 10^{-5}$ で、最後はほぼ標準正規分布になります。

## 逆過程（ノイズを除く）と学習

逆向きの $p_\theta(\boldsymbol x_{t-1} \mid \boldsymbol x_t)$ を正規分布で近似し、その平均をネットワークで表します。DDPM では、$\boldsymbol x_t$ と時刻 $t$ から **加えられたノイズ** $\boldsymbol\varepsilon$ を予測するネットワーク $\boldsymbol\varepsilon_\theta$ を、上の二乗誤差で学習します。学習の 1 ステップは

1. データ $\boldsymbol x_0$、時刻 $t$（一様に選ぶ）、ノイズ $\boldsymbol\varepsilon \sim \mathcal N(\boldsymbol 0, I)$ を選ぶ。
2. $\boldsymbol x_t$ を作り、$\boldsymbol\varepsilon_\theta(\boldsymbol x_t, t)$ と $\boldsymbol\varepsilon$ の二乗誤差で更新する。

です。ネットワークには、時刻の埋め込みを入れた U-Net（最近は Transformer）がよく使われます。

## 生成

$\boldsymbol x_T \sim \mathcal N(\boldsymbol 0, I)$ から始め、学習した逆過程で $t = T, T-1, \dots, 1$ とノイズを少しずつ取り除いて $\boldsymbol x_0$ を得ます。ステップ数が多いので、GAN や VAE より生成に時間がかかります。ステップを飛ばす DDIM などの高速化があります。

## 発展

- **潜在拡散モデル**：画像そのものではなく、オートエンコーダで圧縮した潜在空間で拡散を行い、計算量を減らす（Stable Diffusion）。
- **条件付き生成**：テキストの埋め込みなどを条件として与え、条件の有無の予測の差を強調する classifier-free guidance で、条件に沿った画像を生成する。
- 学習が安定し、モード崩壊が起きにくく、多様で高品質なサンプルが得られることから、画像生成の主流になりました。

## 試験での問われ方

E資格（シラバス 2026 の識別モデルと生成モデル：拡散モデル）では、$\boldsymbol x_t$ を $\boldsymbol x_0$ から直接作る式の実装、ノイズを予測する損失、生成の遅さ、GAN・VAE との比較が出題されます。統計検定データサイエンスエキスパートでは、出題範囲表の「生成 AI の基礎と展望」に拡散モデルが挙がっており、ノイズを加える過程と取り除く過程の仕組みや、拡散過程の式の意味が問われます。

## よくある誤り

- $\boldsymbol x_t$ の式で $\bar\alpha_t$ の平方根をとり忘れる、または $\bar\alpha_t$ の代わりに $\alpha_t$ を使う。
- ネットワークが予測するのはノイズを除いた画像そのものだけだと考える（DDPM はノイズを予測する）。
- 拡散過程（ノイズを加える側）にも学習するパラメータがあると考える（固定のスケジュール）。
