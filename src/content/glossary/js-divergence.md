---
term: 'JSダイバージェンス'
reading: じぇーえすだいばーじぇんす
en: 'Jensen–Shannon divergence'
aliases: ['ジェンセン・シャノン・ダイバージェンス', 'Jensen-Shannon ダイバージェンス']
exams: [jdla-e]
summary: '2 つの分布それぞれと、その平均の分布との KL ダイバージェンスを平均した量。対称で、値は 0 以上 log 2 以下に収まる。'
related: [kl-divergence, entropy, gan]
formula: 'D_{\mathrm{JS}}(p \parallel q) = \frac12 D_{\mathrm{KL}}(p \parallel m) + \frac12 D_{\mathrm{KL}}(q \parallel m),\qquad m = \frac{p + q}{2}'
---
## 定義

分布 $p, q$ の平均 $m = \tfrac12(p + q)$ を作り、$p$ と $q$ のそれぞれから $m$ への KL ダイバージェンスを平均します。

$$D_{\mathrm{JS}}(p \parallel q) = \frac12 D_{\mathrm{KL}}(p \parallel m) + \frac12 D_{\mathrm{KL}}(q \parallel m)$$

エントロピーを使って $D_{\mathrm{JS}}(p \parallel q) = H(m) - \tfrac12\left(H(p) + H(q)\right)$ とも書けます。

## KL ダイバージェンスとの違い

| | KL ダイバージェンス | JS ダイバージェンス |
| --- | --- | --- |
| 対称性 | なし | あり（$p$ と $q$ を入れ替えても同じ） |
| 値の範囲 | $0$ 以上、無限大もありうる | $0$ 以上 $\log 2$ 以下（底 2 なら 1 以下） |
| 台が重ならないとき | 無限大 | $\log 2$ |

$m$ は $p$ と $q$ のどちらの台も含むので、$p(x) > 0$ かつ $q(x) = 0$ の点があっても有限の値になります。なお、JS ダイバージェンスの平方根は距離の公理を満たします。

## 計算例

台がまったく重ならない $p = (1, 0)$、$q = (0, 1)$ では $m = \left(\tfrac12, \tfrac12\right)$ で、$D_{\mathrm{KL}}(p \parallel m) = D_{\mathrm{KL}}(q \parallel m) = \log 2$ なので $D_{\mathrm{JS}} = \log 2$（1 ビット）です。台が重ならない限り、2 つの分布が近くても遠くても値が $\log 2$ のまま変わらない点が、次の GAN の問題につながります。

## GAN との関係

元の GAN の価値関数 $V(D, G)$ で識別器を最適 $D^\ast(x) = \dfrac{p_{\mathrm{data}}(x)}{p_{\mathrm{data}}(x) + p_g(x)}$ にすると、

$$V(D^\ast, G) = -\log 4 + 2\,D_{\mathrm{JS}}(p_{\mathrm{data}} \parallel p_g)$$

となり、生成器の学習は JS ダイバージェンスの最小化にあたります。高次元では本物の分布と生成分布の台がほとんど重ならず、JS ダイバージェンスが $\log 2$ に張りついて勾配が得られにくくなります。これを避けるために Wasserstein 距離を使うのが WGAN です。

## 試験での問われ方

E資格では、離散分布での計算、対称性と上限、KL ダイバージェンスとの違い、GAN の目的関数との関係が問われます。計算では平均の分布 $m$ を正しく作ることと、$0\log 0 = 0$ の扱いがポイントです。

## よくある誤り

- $\tfrac12\left(D_{\mathrm{KL}}(p \parallel q) + D_{\mathrm{KL}}(q \parallel p)\right)$（対称化 KL）と同じものだと考える。
- 上限を 1 と覚え、自然対数で計算したときの上限 $\log 2 \approx 0.693$ と混同する。
- 最適な識別器のもとでの価値関数の定数項 $-\log 4$ を落とす。
