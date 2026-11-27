---
term: 'レーマン・シェフェの定理'
reading: れーまん・しぇふぇのていり
en: 'Lehmann-Scheffé theorem'
exams: [toukei-1]
summary: '完備十分統計量の関数である不偏推定量は、一様最小分散不偏推定量（UMVUE）であり、しかも一意であるという定理。'
related: [umvue, rao-blackwell-theorem, sufficient-statistic, unbiased-estimator]
formula: 'E_{\theta}[h(S)] = g(\theta)\ \ (\forall\theta),\ S\ \text{complete sufficient} \ \Longrightarrow\ h(S)\ \text{is the UMVUE of } g(\theta)'
---
## 完備性

統計量 $S$ が完備であるとは、どんな関数 $u$ についても

$$E_{\theta}[u(S)] = 0\ \ (\text{すべての } \theta) \ \Longrightarrow\ P_{\theta}(u(S) = 0) = 1\ \ (\text{すべての } \theta)$$

が成り立つことをいいます。$S$ の関数で期待値が恒等的に 0 になるものは 0 しかない、つまり $S$ の関数による不偏推定量は 1 つしかない、という意味です。完備かつ十分な統計量を完備十分統計量と呼びます。

## 定理の内容

$S$ が完備十分統計量で、$h(S)$ が $g(\theta)$ の不偏推定量なら、$h(S)$ は $g(\theta)$ の UMVUE で、ほとんど確実に一意です。

理由：任意の不偏推定量 $T$ をラオ・ブラックウェル化した $E[T \mid S]$ は $S$ の関数で不偏、分散は $T$ 以下です。完備性から $S$ の関数の不偏推定量は $h(S)$ だけなので、$E[T \mid S] = h(S)$ となり、$V[h(S)] \leq V[T]$ が得られます。

## 完備十分統計量の例

- 1 母数の指数型分布族（ベルヌーイ・ポアソン・指数・正規の平均など）：$\sum X_i$ は完備十分統計量。一般に、自然母数の空間が内点をもつ指数型分布族では、自然な十分統計量が完備。
- 正規分布 $N(\mu, \sigma^2)$（両方未知）：$(\bar{X}, s^2)$。
- 一様分布 $U(0, \theta)$：$\max_i X_i$。$E[\max X_i] = n\theta/(n+1)$ なので UMVUE は $\frac{n+1}{n}\max_i X_i$。

## 例：一様分布の完備性

$M = \max X_i$ の密度は $nm^{n-1}/\theta^n$（$0 < m < \theta$）です。$E[u(M)] = 0$ がすべての $\theta$ で成り立てば、$\int_0^{\theta} u(m)m^{n-1}\,dm = 0$ を $\theta$ で微分して $u(\theta)\theta^{n-1} = 0$、すなわち $u \equiv 0$ となり、完備であることが分かります。

## 試験での問われ方

統計検定1級の統計数理では、完備性の証明（上のような微分による議論や、べき級数の係数比較）、完備十分統計量の関数として UMVUE を構成する問題、その分散の計算が出題されます。

## よくある誤り

- 十分統計量なら完備だと考える（たとえば $U(\theta, \theta + 1)$ の $(\min X_i, \max X_i)$ は十分だが完備でない）。
- 完備十分統計量の関数であれば、不偏でなくても UMVUE だと考える。
- 不偏推定量が存在しない母数の関数にも UMVUE があると考える（ベルヌーイ分布の $1/p$ など）。
