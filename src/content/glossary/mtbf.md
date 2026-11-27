---
term: 'MTBF'
reading: えむてぃーびーえふ
en: 'mean time between failures'
aliases: ['平均故障間隔', 'MTTF', '平均故障寿命']
exams: [toukei-1, ipa-st, shindanshi]
summary: '修理しながら使う機器が、故障してから次に故障するまでの動作時間の平均（MTBF、平均故障間隔）。修理しない部品が故障するまでの時間の平均は MTTF（平均故障寿命）と呼び、どちらも信頼度関数の積分で求まる。'
related: [availability, weibull-distribution, bathtub-curve, exponential-distribution, life-test]
formula: '\mathrm{MTTF} = E[T] = \int_0^{\infty} R(t)\,dt,\qquad \text{指数分布なら}\ \mathrm{MTTF} = \frac{1}{\lambda}'
---
## 定義

- **MTTF**（mean time to failure, 平均故障寿命）：修理しない（使い捨ての）部品やシステムが、使い始めてから故障するまでの時間の期待値。
- **MTBF**（mean time between failures, 平均故障間隔）：修理して使い続ける機器の、故障と故障の間の動作時間の平均。修理で新品同様に戻るなら、MTTF と同じ値になります。

寿命 $T \geq 0$ の期待値は、信頼度 $R(t) = P(T > t)$ を使って $E[T] = \int_0^{\infty} R(t)\,dt$ と書けます（部分積分、または $T = \int_0^{\infty} 1\{T > t\}\,dt$ の期待値から）。

## 代表的な値

| 寿命の分布・構成 | MTTF |
| --- | --- |
| 指数分布（故障率 $\lambda$） | $1/\lambda$ |
| ワイブル分布（$m, \eta$） | $\eta\,\Gamma(1 + 1/m)$ |
| 指数分布 $n$ 個の直列系 | $1/(n\lambda)$ |
| 指数分布 2 個の並列系 | $\dfrac{1}{\lambda} + \dfrac{1}{2\lambda} = \dfrac{3}{2\lambda}$ |
| 2-out-of-3 系（3 個中 2 個以上で動作） | $\dfrac{3}{2\lambda} - \dfrac{2}{3\lambda} = \dfrac{5}{6\lambda}$ |

2-out-of-3 系は、短い時間では単体より信頼度が高いものの、MTTF は単体（$1/\lambda$）より短くなります。

## 推定

寿命が指数分布に従うとき、寿命試験で $r$ 個の故障と総試験時間 $T_{\mathrm{tot}}$（全試料の動作時間の合計）が得られれば、MTBF の最尤推定値は $\hat{\theta} = T_{\mathrm{tot}}/r$ です。定数打切りでは $2T_{\mathrm{tot}}/\theta \sim \chi^2(2r)$ を使って信頼区間を作ります。

## 稼働率との関係

修理にかかる平均時間を MTTR（平均修復時間）とすると、修理系の稼働率（アベイラビリティ）は

$$A = \frac{\mathrm{MTBF}}{\mathrm{MTBF} + \mathrm{MTTR}}$$

です。MTBF は故障しにくさ（信頼性）、MTTR は直しやすさ（保守性）を表します。

## 試験での問われ方

統計検定1級（理工学）では、信頼度の積分による MTTF の計算（冗長系を含む）、打切りのある寿命試験からの MTBF の最尤推定と信頼下限が出題されます。ITストラテジスト試験や中小企業診断士試験では、MTBF と MTTR から稼働率を求める計算や、直列・並列構成の稼働率の問題として登場します。

## よくある誤り

- 冗長化すれば MTTF は必ず長くなると考える（2-out-of-3 系は単体より短い）。
- 故障率 $\lambda$ と MTBF を取り違える（指数分布では逆数の関係）。
- 平均寿命を「半数が故障する時間」（中央値）と同じだと考える。指数分布では中央値は $\log 2/\lambda \approx 0.69/\lambda$ です。
