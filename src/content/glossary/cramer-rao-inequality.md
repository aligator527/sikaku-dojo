---
term: 'クラーメル・ラオの不等式'
reading: くらーめる・らおのふとうしき
en: 'Cramér-Rao inequality'
aliases: ['クラーメル・ラオの下限', 'クラメール・ラオの不等式', 'クラメール・ラオの下限']
exams: [toukei-jun1, toukei-1, toukei-dse]
summary: '正則条件のもとで、不偏推定量の分散はフィッシャー情報量の逆数より小さくできないことを示す不等式。その下限をクラーメル・ラオの下限という。'
related: [fisher-information, unbiased-estimator, efficient-estimator, maximum-likelihood-estimation, umvue]
formula: 'V[\hat{\theta}] \geq \frac{1}{n I(\theta)},\qquad V[T] \geq \frac{\{g''(\theta)\}^2}{n I(\theta)}\quad (E[T] = g(\theta))'
---
## 内容

$X_1, \ldots, X_n$ が独立に密度 $f(x; \theta)$ に従い、微分と積分の交換などの正則条件が成り立つとき、$\theta$ の任意の不偏推定量 $\hat{\theta}$ について

$$V[\hat{\theta}] \geq \frac{1}{nI(\theta)},\qquad I(\theta) = E\left[\left(\frac{\partial}{\partial\theta}\log f(X; \theta)\right)^2\right]$$

が成り立ちます。$g(\theta)$ の不偏推定量 $T$ なら下限は $g'(\theta)^2/(nI(\theta))$ です。

## 証明の考え方

スコア $U = \sum_i \frac{\partial}{\partial\theta}\log f(X_i; \theta)$ は期待値 0、分散 $nI(\theta)$ をもちます。不偏性 $E[T] = g(\theta)$ を $\theta$ で微分すると $\mathrm{Cov}(T, U) = g'(\theta)$ となり、コーシー・シュワルツの不等式 $\mathrm{Cov}(T, U)^2 \leq V[T]\,V[U]$ から下限が得られます。等号は $T$ が $U$ の 1 次式のとき、すなわち $U = a(\theta)(T - g(\theta))$ と書けるときに限って成り立ちます。

## 例

| 分布と母数 | 下限 $1/(nI)$ | 不偏推定量の分散 | 判定 |
| --- | --- | --- | --- |
| ポアソン $\lambda$ | $\lambda/n$ | $V[\bar{X}] = \lambda/n$ | 下限に一致（有効推定量） |
| 正規 $\mu$（$\sigma^2$ 既知） | $\sigma^2/n$ | $V[\bar{X}] = \sigma^2/n$ | 下限に一致 |
| 正規 $\sigma^2$（$\mu$ 未知） | $2\sigma^4/n$ | $V[s^2] = 2\sigma^4/(n-1)$ | 下限より大きい |

最後の例の $s^2$ は不偏推定量の中で分散最小（一様最小分散不偏推定量）ですが、それでも下限には届きません。下限は「必ず達成できる値」ではない点に注意します。

## 試験での問われ方

統計検定1級では、フィッシャー情報量を計算して下限を求め、与えられた不偏推定量が下限に達するか（有効推定量か）を判定する問題、不等式の証明、等号成立条件の議論が頻出です。準1級では、最尤推定量の漸近分散が下限に一致すること（漸近有効性）が問われます。

## よくある誤り

- 1 観測あたりの $I(\theta)$ と $n$ 観測の情報量 $nI(\theta)$ を取り違える。
- 一様分布 $U(0, \theta)$ のように台が母数に依存する分布にも適用する（正則条件を満たさず、下限より分散の小さい不偏推定量が存在する）。
- 偏りのある推定量にも $1/(nI)$ を下限として使う。
