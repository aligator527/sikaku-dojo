---
term: '赤池情報量規準'
reading: あかいけじょうほうりょうきじゅん
en: 'Akaike information criterion'
aliases: ['AIC']
exams: [toukei-jun1, toukei-1, toukei-dse]
summary: '最大対数尤度とパラメータ数から計算する、モデルの予測の良さを評価する指標。値が小さいほど良いモデルと判断する。'
related: [maximum-likelihood-estimation, cross-validation, overfitting, coefficient-of-determination]
formula: '\mathrm{AIC} = -2\log L(\hat{\theta}) + 2k,\qquad \mathrm{BIC} = -2\log L(\hat{\theta}) + k\log n'
---
### 定義

最大対数尤度を $\log L(\hat{\theta})$、推定したパラメータ数を $k$ とすると、$\mathrm{AIC} = -2\log L(\hat{\theta}) + 2k$ です。赤池弘次が 1970 年代に提案しました。当てはまりの良さ（第 1 項）とモデルの複雑さ（第 2 項）のバランスで、モデルを選びます。

### 考え方

AIC は、真の分布とモデルの近さをカルバック・ライブラー情報量で測ったときの、将来のデータに対する予測の良さ（期待平均対数尤度）を推定するものです。最大対数尤度は同じデータでパラメータを推定しているため楽観的に偏っており、その偏りがおよそ $k$ であることから罰則項 $2k$ が生じます。

### BIC との比較

$\mathrm{BIC} = -2\log L(\hat{\theta}) + k\log n$ は、モデルの事後確率（周辺尤度）の近似から導かれます。$n \geq 8$ では BIC の罰則の方が重く、より単純なモデルを選びやすくなります。BIC は真のモデルが候補に含まれるとき、それを選ぶ確率が 1 に近づく（一致性）一方、AIC は予測の良さを重視します。

### 試験での問われ方

準1級では AIC・BIC の計算とモデルの比較、DSE ではモデル評価指標（Mallows の $C_p$、交差検証との関係）、1級では導出の考え方が問われます。

### よくある誤り

- 値が大きいほど良いと考える。
- 異なるデータ（観測数が違う、目的変数を変換した）で計算した AIC を比較する。
- AIC の差が小さいモデル間の優劣を、決定的なものとして扱う。
