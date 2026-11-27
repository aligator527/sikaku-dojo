---
term: '条件付き確率'
reading: じょうけんつきかくりつ
en: 'conditional probability'
exams: [toukei-2, toukei-jun1, toukei-1, toukei-dse, suken-1]
summary: '事象 B が起きたという条件のもとで、事象 A が起きる確率。A と B が同時に起きる確率を B の確率で割って求める。'
related: [bayes-theorem]
formula: 'P(A \mid B) = \frac{P(A \cap B)}{P(B)}\qquad (P(B) > 0)'
---
## 定義

$P(B) > 0$ のとき、$P(A \mid B) = P(A \cap B)/P(B)$ を、$B$ が起きたもとでの $A$ の条件付き確率といいます。標本空間を $B$ に制限して確率を測り直す、と考えると分かりやすくなります。

## 関連する公式

- 乗法定理：$P(A \cap B) = P(B)\,P(A \mid B)$
- 独立：$P(A \mid B) = P(A)$、つまり $P(A \cap B) = P(A)P(B)$
- 全確率の公式：$B_1, \ldots, B_k$ が標本空間の分割なら $P(A) = \sum_j P(A \mid B_j)P(B_j)$
- 確率変数への拡張：条件付き期待値について $E[X] = E[E[X \mid Y]]$、$V[X] = E[V[X \mid Y]] + V[E[X \mid Y]]$

## 試験での問われ方

2級ではくじ引き・検査・不良品の問題として、ベイズの定理と組み合わせて出題されます。準1級・1級では、条件付き分布・条件付き期待値・全分散の公式を使った計算や導出が問われます。

## よくある誤り

- $P(A \mid B)$ と $P(B \mid A)$ を取り違える（陽性のときに病気である確率と、病気のときに陽性になる確率は別物）。
- 「排反」と「独立」を混同する。$P(A), P(B) > 0$ で排反なら $P(A \cap B) = 0 \neq P(A)P(B)$ なので独立ではない。
