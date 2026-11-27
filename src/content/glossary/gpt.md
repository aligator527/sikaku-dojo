---
term: 'GPT'
reading: じーぴーてぃー
en: 'GPT (Generative Pre-trained Transformer)'
aliases: ['GPT-2', 'GPT-3', 'GPT-n', 'Generative Pre-trained Transformer']
exams: [jdla-e, toukei-dse]
summary: 'Transformer のデコーダだけを積み重ね、前のトークン列から次のトークンを予測するタスクで事前学習した自己回帰型の言語モデルの系列。プロンプトだけで多様なタスクをこなす。'
related: [transformer, masked-self-attention, large-language-model, bert, pre-training]
formula: 'L = -\sum_{t=1}^{T}\log p_\theta\left(w_t \mid w_1, \dots, w_{t-1}\right)'
---
## 構造と事前学習

OpenAI が開発したモデルの系列で、因果マスク付きの Self-Attention（Masked Self-Attention）を持つデコーダのブロックを積み重ねます。大量のテキストに対し、各位置で次のトークンを予測する（next token prediction）損失、つまり系列の負の対数尤度を最小化して学習します。正解ラベルを人手で付ける必要がない自己教師あり学習です。

## 規模の拡大と能力

| モデル | 年 | パラメータ数 | 特徴 |
| --- | --- | --- | --- |
| GPT（GPT-1） | 2018 | 約 1.2 億 | 事前学習＋タスクごとのファインチューニング |
| GPT-2 | 2019 | 約 15 億 | ファインチューニングなしの Zero-shot での応用を示す |
| GPT-3 | 2020 | 約 1750 億 | プロンプトに例を示す Few-shot（in-context learning） |

GPT-3 以降では、モデルの重みを更新せず、プロンプトにタスクの説明（Zero-shot）や少数の入出力例（Few-shot）を書くだけで新しいタスクを解かせる使い方（Prompt Based Learning）が広まりました。さらに、指示に従うように追加学習するインストラクションチューニングや、人間のフィードバックによる強化学習（RLHF）を経て、対話型の AI として使われています。

## 生成（デコーディング）

推論時は、1 トークンずつ生成して入力の末尾に加えることを繰り返します（自己回帰）。次のトークンの選び方には、

- 貪欲法（最も確率の高いトークンを選ぶ）、ビームサーチ
- 温度付きのサンプリング、上位 $k$ 個から選ぶ top-k、累積確率 $p$ までの候補から選ぶ top-p（nucleus）サンプリング

があります。生成を速くするため、過去の位置のキーと値を保存して再利用します（KV キャッシュ）。

## 試験での問われ方

E資格（シラバス 2026 の GPT-n：基盤モデル、Next token prediction、Few Shot learning、Zero Shot learning、Prompt Based Learning、RAG）では、BERT との構造・事前学習の違い、Few-shot がパラメータ更新を伴わないこと、生成時のデコーディングの実装、因果マスクの役割が出題されます。統計検定データサイエンスエキスパートでも、生成 AI の仕組みとして登場します。

## よくある誤り

- Few-shot learning を、少数の例でファインチューニングすることだと考える（GPT-3 の文脈ではプロンプトに例を示すだけ）。
- GPT がエンコーダのみの双方向モデルだと考える（それは BERT）。
- 生成時にも全トークンを一度に並列に出力できると考える（学習時は並列、生成時は逐次）。
