---
term: 'Layer Normalization'
reading: れいやーのーまらいぜーしょん
en: 'layer normalization'
aliases: ['層正規化', 'レイヤー正規化', 'LayerNorm', 'Pre-LN', 'Post-LN']
exams: [jdla-e, toukei-dse]
summary: '1 つのサンプル（系列では各トークン）の特徴量の方向で平均と分散を計算して正規化する手法。ミニバッチに依存しないので、RNN や Transformer で使われる。'
related: [batch-normalization, group-normalization, transformer, residual-connection]
formula: '\hat{x}_i = \frac{x_i - \mu}{\sqrt{\sigma^2 + \varepsilon}},\quad \mu = \frac1d\sum_{i=1}^{d}x_i,\quad \sigma^2 = \frac1d\sum_{i=1}^{d}(x_i - \mu)^2,\qquad y_i = \gamma_i\hat{x}_i + \beta_i'
---
## 仕組み

1 サンプルの特徴量ベクトル $\boldsymbol x = (x_1, \dots, x_d)$ の成分から平均 $\mu$ と分散 $\sigma^2$ を求め、各成分を正規化したうえで、成分ごとの学習可能なスケール $\gamma_i$ とシフト $\beta_i$ を掛けて足します。画像の形状 $(N, C, H, W)$ なら、サンプルごとに $(C, H, W)$ の全体で統計量をとります。Transformer では各トークンの $d_{\mathrm{model}}$ 次元のベクトルごとに計算します。

## Batch Normalization との違い

| | Batch Normalization | Layer Normalization |
| --- | --- | --- |
| 統計量をとる方向 | ミニバッチ内のサンプル方向（特徴ごと） | サンプル内の特徴方向（サンプルごと） |
| バッチサイズの影響 | 小さいと不安定 | 受けない |
| 推論時 | 学習中の移動平均を使う | 入力から毎回計算（学習時と同じ） |
| 向いている場面 | CNN | RNN、Transformer |

BN を RNN に使うと時刻ごとに統計量が必要になり、学習時より長い系列に対応できません。系列長が可変で、トークンごとに独立に処理したい Transformer では LN が標準です。学習可能なパラメータ $\gamma, \beta$ は LN にもあります（特徴の次元ごとに 1 組、計 $2d$ 個）。

## Transformer での配置

- **Post-LN**：$\boldsymbol x_{l+1} = \mathrm{LN}\bigl(\boldsymbol x_l + F(\boldsymbol x_l)\bigr)$。原論文の配置で、深くすると学習が不安定になりやすく、ウォームアップが重要です。
- **Pre-LN**：$\boldsymbol x_{l+1} = \boldsymbol x_l + F\bigl(\mathrm{LN}(\boldsymbol x_l)\bigr)$。残差の経路に LN が挟まらず恒等写像が残るので、勾配が安定します。GPT-2 以降の多くの大規模言語モデルが採用し、最後に LN を 1 つ置きます。

なお、平均を引かず二乗平均平方根だけで割る簡略版の **RMSNorm** も、大規模言語モデルで Pre-LN の位置によく使われます。

## 試験での問われ方

E資格では、BN・LN・Instance Normalization・Group Normalization の統計量をとる軸の違い、Transformer や RNN で LN が使われる理由、推論時の振る舞い、Pre-LN と Post-LN の違いが出題されます。

## よくある誤り

- LN もミニバッチ全体で統計量を計算すると考える（それは BN）。
- LN には学習可能なパラメータがないと考える。
- Transformer の原論文が Pre-LN だと覚える（原論文は Post-LN）。
- 推論時に LN も移動平均を使うと考える。
