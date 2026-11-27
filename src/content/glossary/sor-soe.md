---
term: "SoR・SoE"
reading: えすおーあーる・えすおーいー
en: "systems of record, systems of engagement"
aliases: ["SoR", "SoE", "SoI", "Systems of Record", "Systems of Engagement"]
exams: [ipa-st]
summary: "企業の情報システムを、取引や業務の結果を正確に記録する SoR と、顧客とのつながりや関係性を深める SoE に分けて捉える考え方。"
related: [digital-transformation, information-system-strategy, customer-experience]
---
## 定義

SoR と SoE は、G. ムーアが示した企業システムの分類です。

| 区分 | 目的 | 特徴 | 例 |
| --- | --- | --- | --- |
| SoR（Systems of Record） | 取引・業務の結果を正確に記録し、業務を効率化する | 安定性・正確性・信頼性を重視。要件が比較的固定的 | 会計、販売管理、在庫管理、勘定系 |
| SoE（Systems of Engagement） | データの活用を通じて顧客や取引先とのつながり・関係性を深める | 変化への迅速な対応を重視。試行錯誤を繰り返す | EC サイト、スマートフォンアプリ、SNS 連携 |

SoR と SoE から集めたデータを分析して洞察を得るシステムを、SoI（Systems of Insight）と呼ぶこともあります。

## 戦略上の意味

- SoR はウォーターフォール型で堅実に作り、SoE はアジャイル開発やクラウドサービスを活用して素早く改善する、というように開発・運用の進め方を使い分けます（いわゆるバイモーダル）。
- SoE で得た顧客接点のデータを SoR の基幹データと API で連携させることで、新しいサービスを生み出せます。DX では両者の連携の設計が重要になります。

## 試験での問われ方

- **ITストラテジスト試験**：午前II で SoE の説明が問われました。選択肢には、システム基盤、定型業務を処理・記録するシステム（SoR）、財務報告のための取引データ管理などが並びます。午後では、基幹システムの刷新と顧客向けデジタルサービスの企画を両立させる場面の背景知識になります。

## よくある誤り

- 定型業務の処理と記録による省力化を SoE と考える。それは SoR です。
- SoE があれば SoR は不要になると考える。SoE は正確なデータを持つ SoR と連携して初めて価値を生みます。
