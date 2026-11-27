---
term: '方策勾配法'
reading: ほうさくこうばいほう
en: 'policy gradient method'
aliases: ['Policy Gradient', 'policy gradient', 'REINFORCE', 'Actor-Critic', 'Actor-Critic法', 'A3C']
exams: [jdla-e, toukei-dse]
summary: '方策をパラメータ θ で直接表し、期待収益 J(θ) の勾配を推定して θ を更新する強化学習の手法。連続値の行動や確率的な方策を自然に扱える。'
related: [reinforcement-learning, action-value-function, q-learning, dqn]
formula: '\nabla_\theta J(\theta) = E_{\pi_\theta}\left[\nabla_\theta\log\pi_\theta(a \mid s)\,Q^{\pi_\theta}(s, a)\right]'
---
## 考え方

価値ベースの手法（Q 学習など）は行動価値を学んでから最大の行動を選びますが、方策勾配法は方策 $\pi_\theta(a \mid s)$（例：ニューラルネットワークの出力のソフトマックス、連続値なら正規分布の平均と分散）を直接学習します。方策勾配定理により、期待収益の勾配は上の式で表されます。「収益が大きかった行動の確率を上げ、小さかった行動の確率を下げる」向きに $\theta$ を動かす、という意味です。

## REINFORCE

$Q^{\pi}(s_t, a_t)$ を、実際のエピソードで得られた時刻 $t$ 以降の割引報酬和 $G_t$ で置き換えます。

$$\nabla_\theta J(\theta) \approx \sum_t \nabla_\theta\log\pi_\theta(a_t \mid s_t)\,G_t$$

この推定は不偏ですが、エピソードごとに $G_t$ が大きくばらつくので分散が大きく、学習が不安定になりがちです。状態だけに依存するベースライン $b(s)$（状態価値 $V(s)$ など）を引いて $G_t - b(s_t)$ を使うと、不偏性を保ったまま分散を減らせます。

## Actor-Critic 法

- **Actor**：方策 $\pi_\theta(a \mid s)$ を出力して行動を選ぶ。
- **Critic**：状態価値 $V(s)$ などを推定し、Actor の行動を評価する。

Actor は、Critic から計算したアドバンテージ $A(s, a) = Q(s, a) - V(s)$（「平均より良かったか」。TD 誤差 $r + \gamma V(s') - V(s)$ で推定できる）を重みにして方策勾配で更新します。モンテカルロの $G_t$ より分散が小さくなります。

## A3C

Asynchronous Advantage Actor-Critic の略です。複数のワーカーがそれぞれの環境で並列に経験を集め、アドバンテージを使った Actor-Critic の勾配を、共有するパラメータに **非同期に** 反映します。ワーカーごとに異なる状況を経験するのでデータの相関が自然に弱まり、経験再生を使わずに学習が安定します。その後、方策の更新幅を制限して安定させる PPO などが広く使われるようになりました。

## 試験での問われ方

E資格（シラバス 2026 の A3C：方策勾配法、Actor-Critic 法）では、方策勾配の式、REINFORCE の推定の性質（不偏だが高分散）、ベースラインの効果、Actor と Critic の役割、A3C が経験再生を使わない理由が出題されます。

## よくある誤り

- Actor と Critic の役割を逆にする（方策を出すのが Actor）。
- 方策勾配法は行動価値を学んでから最大の行動を選ぶ手法だと考える（それは価値ベース）。
- A3C は経験再生のバッファから学習すると考える（並列の非同期な学習で相関を断つ）。
- ベースラインを引くと勾配の推定に偏りが生じると考える（状態だけに依存するなら不偏）。
