---
term: バッチ正規化
reading: ばっちせいきか
en: batch normalization
aliases: [Batch Normalization, BN, Layer Normalization, 層正規化]
exams: [jdla-e]
summary: ミニバッチ内の統計量で各チャネル（特徴）の入力を平均 0・分散 1 に正規化し、学習可能なスケール γ とシフト β を掛ける手法。学習を安定・高速化する。
related: [dropout, vanishing-gradient, residual-connection, transformer]
formula: '\hat{x} = \frac{x - \mu_{\mathcal{B}}}{\sqrt{\sigma_{\mathcal{B}}^2 + \varepsilon}},\qquad y = \gamma\,\hat{x} + \beta'
---
## 仕組み

学習時は、ミニバッチ $\mathcal B$ 内の平均 $\mu_{\mathcal B}$ と分散 $\sigma^2_{\mathcal B}$ で正規化し、$\gamma, \beta$ で表現力を戻します。同時に、平均と分散の指数移動平均（running mean / running variance）を記録しておき、推論時はそれを使って正規化します。推論時の出力が同じバッチ内の他のデータに依存しないようにするためです。

## 統計量をとる軸

畳み込み層の出力 $(N, C, H, W)$ に対して、正規化手法は「どの軸で平均・分散をとるか」で区別されます。

| 手法 | 平均・分散をとる範囲 | 主な用途 |
| --- | --- | --- |
| Batch Normalization | チャネルごとに $(N, H, W)$ | CNN（バッチサイズが十分大きい場合） |
| Layer Normalization | サンプルごとに $(C, H, W)$ | RNN、Transformer |
| Instance Normalization | サンプル・チャネルごとに $(H, W)$ | スタイル変換 |
| Group Normalization | サンプルごとにチャネルのグループと $(H, W)$ | 小さなバッチでの物体検出など |

## 効果と注意点

- 学習率を大きくしても安定しやすく、初期値への依存が小さくなります。弱い正則化の効果もあります。
- バッチサイズが小さいと統計量の推定が不安定になります。系列長が可変のデータや、バッチ内のサンプル同士を独立に扱いたい場合は Layer Normalization が使われます。
- 学習可能なパラメータは $\gamma, \beta$ のみで、チャネル数 $C$ に対して $2C$ 個です。running mean / variance はバッファで、勾配では更新されません。

## 試験での問われ方

E資格では、各正規化手法の正規化の軸、学習時と推論時の違い、パラメータ数、正規化を入れる位置が問われます。

## よくある誤り

- 推論時にもミニバッチの統計量を使うと考える（`eval()` では移動平均を使う）。
- バッチ正規化の直前の層のバイアスは $\beta$ と重複するため、省略されることが多い。
