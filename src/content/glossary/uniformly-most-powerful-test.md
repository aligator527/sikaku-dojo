---
term: '一様最強力検定'
reading: いちようさいきょうりょくけんてい
en: 'uniformly most powerful test'
aliases: ['UMP検定']
exams: [toukei-jun1, toukei-1]
summary: '有意水準 α の検定のうち、対立仮説に含まれるすべての母数の値について、同時に検出力が最大になる検定。'
related: [neyman-pearson-lemma, statistical-power, one-sided-test, sufficient-statistic, likelihood-ratio-test]
formula: 'P_{\theta}(\phi^{*}\ \text{rejects}) \geq P_{\theta}(\phi\ \text{rejects})\quad \text{for all } \theta \in \Theta_1'
---
## 定義

複合対立仮説 $H_1: \theta \in \Theta_1$ に対して、有意水準 $\alpha$ の検定 $\phi^{*}$ が、他のどの水準 $\alpha$ の検定 $\phi$ よりも、すべての $\theta \in \Theta_1$ で検出力が高い（または等しい）とき、$\phi^{*}$ を一様最強力検定（UMP 検定）といいます。対立仮説の値ごとに最強力検定を求めたとき、その棄却域がすべて同じになる場合に存在します。

## 存在する場合：単調尤度比

統計量 $T(\mathbf{x})$ について、$\theta_1 > \theta_0$ ならいつも尤度比 $L(\theta_1)/L(\theta_0)$ が $T$ の非減少関数になるとき、その分布族は単調尤度比をもつといいます。このとき、片側の仮説 $H_0: \theta \leq \theta_0$ 対 $H_1: \theta > \theta_0$ には、$T \geq c$ で棄却する一様最強力検定が存在します（カーリン・ルビンの定理）。

1 母数の指数型分布族 $f(x; \theta) = h(x)\exp\{\eta(\theta)T(x) - A(\theta)\}$ は、$\eta$ が単調増加なら単調尤度比をもちます。

| 分布 | 統計量 $T$ | 右片側の UMP 検定の棄却域 |
| --- | --- | --- |
| 正規 $N(\mu, \sigma^2)$（$\sigma^2$ 既知） | $\sum X_i$ | $\bar{X} \geq \mu_0 + z_{\alpha}\sigma/\sqrt{n}$ |
| ポアソン $Po(\lambda)$ | $\sum X_i$ | $\sum X_i \geq c$ |
| 指数分布（平均 $\theta$） | $\sum X_i$ | $\sum X_i \geq c$ |
| 一様 $U(0, \theta)$ | $\max_i X_i$ | $\max_i X_i \geq c$ |

## 存在しない場合

両側の対立仮説 $H_1: \theta \neq \theta_0$ では、$\theta > \theta_0$ に強い検定（右側に棄却域）と $\theta < \theta_0$ に強い検定（左側に棄却域）が異なるため、一般に一様最強力検定は存在しません。その場合は、検出力が有意水準を下回らない検定（不偏検定）に限ったうえで最強力なもの（一様最強力不偏検定）を考えます。コーシー分布の位置母数のように、片側でも存在しない例もあります。

## 試験での問われ方

統計検定1級では、ネイマン・ピアソンの補題で最強力検定を作り、その棄却域が対立仮説の値によらないことから一様最強力性を示す問題が典型です。単調尤度比の確認、棄却限界の決定、検出力関数の計算も合わせて問われます。準1級では、片側検定には UMP 検定があるが両側検定には一般にない、という事実が問われます。

## よくある誤り

- 最強力検定（単純対立仮説に対して最適）と一様最強力検定（複合対立仮説のすべての値で最適）を混同する。
- 両側検定にも一様最強力検定があると考える。
- 単調尤度比の向き（尤度比が $T$ の増加関数か減少関数か）を確かめずに棄却域の向きを決める。
