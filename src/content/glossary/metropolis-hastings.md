---
term: 'メトロポリス・ヘイスティングス法'
reading: めとろぽりす・へいすてぃんぐすほう
en: 'Metropolis–Hastings algorithm'
aliases: ['メトロポリス法', 'MH法', 'メトロポリス・ヘイスティングス']
exams: [toukei-jun1, toukei-1, toukei-dse]
summary: '提案分布から候補を発生させ、目標密度と提案密度の比で決まる採択確率で候補に移るか現在地に留まるかを決める MCMC の基本アルゴリズム。'
related: [mcmc, gibbs-sampling, detailed-balance, markov-chain, rejection-sampling]
formula: '\alpha(\theta, \theta^*) = \min\left\{1,\ \frac{\pi(\theta^*)\,q(\theta \mid \theta^*)}{\pi(\theta)\,q(\theta^* \mid \theta)}\right\}'
---
## 手順

目標の密度 $\pi(\theta)$（定数倍まで分かればよい）と、現在値 $\theta$ から候補を出す提案分布 $q(\theta^* \mid \theta)$ を用意します。

1. 候補 $\theta^* \sim q(\cdot \mid \theta^{(t)})$ を発生させる。
2. 採択確率 $\alpha(\theta^{(t)}, \theta^*)$ を計算し、確率 $\alpha$ で $\theta^{(t+1)} = \theta^*$、そうでなければ $\theta^{(t+1)} = \theta^{(t)}$ とする。

棄却されたときも現在値をもう一度記録するのが要点です。この推移は詳細つり合い条件 $\pi(\theta)p(\theta \to \theta^*) = \pi(\theta^*)p(\theta^* \to \theta)$ を満たすので、$\pi$ が定常分布になります。$\pi$ は比の形でしか現れないので、正規化定数は不要です。

## 主な種類

| 種類 | 提案分布 | 採択確率 |
|---|---|---|
| メトロポリス法（ランダムウォーク型） | 対称：$q(\theta^* \mid \theta) = q(\theta \mid \theta^*)$（例：$\theta^* = \theta + N(0, s^2)$） | $\min\{1,\ \pi(\theta^*)/\pi(\theta)\}$ |
| 独立型 | 現在値によらない $q(\theta^*)$ | $\min\left\{1,\ \dfrac{\pi(\theta^*)q(\theta)}{\pi(\theta)q(\theta^*)}\right\}$ |

対称でない提案分布では、提案密度の比（ヘイスティングスの補正）を必ず掛けます。

## 計算例

目標が標準正規分布 $\pi(\theta) \propto e^{-\theta^2/2}$、ランダムウォーク型の提案とします。現在値 $\theta = 1$ から候補 $\theta^* = 2$ が出たら、採択確率は $e^{-(4 - 1)/2} = e^{-1.5} \approx 0.22$ です。候補 $\theta^* = 0.5$ なら比が 1 を超えるので必ず採択します。

## 提案の幅の調整

- 幅 $s$ が小さすぎる：ほとんど採択されるが少しずつしか動かず、自己相関が高い。
- 幅 $s$ が大きすぎる：密度の低い所への候補ばかりで棄却が続き、同じ値に長く留まる。
- 目安として、1 次元では採択率 0.4〜0.5 程度、高次元では 0.23 程度がよいとされる。採択率は高いほど良いわけではない。

## 試験での問われ方

統計検定準1級では、採択確率の計算（対称・非対称な提案分布）、棄却時の扱い、正規化定数が不要な理由、詳細つり合いの確認が問われます。データサイエンスエキスパートでは、提案分布の幅と採択率・自己相関の関係を問う正誤問題が出ます。

## よくある誤り

- 非対称な提案分布でも $\pi(\theta^*)/\pi(\theta)$ だけで採択を決める。
- 棄却したら次の候補が出るまで記録しない（棄却サンプリングと混同している）。
- 採択率が 1 に近いほど効率が良いと考える。
