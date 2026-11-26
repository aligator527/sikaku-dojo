---
exam: ipa-st
section: am1
topics: [am1-technology, security]
source:
  kind: past
  label: 令和6年度 春期 高度試験 午前I 問14
  year: 2024
  url: https://www.ipa.go.jp/shiken/mondai-kaiotu/m42obm000000afqx-att/2024r06h_koudo_am1_qs.pdf
  note: 出典：令和6年度 春期 高度試験・情報処理安全確保支援士試験 午前I 問14（IPA）。午前I は ITストラテジスト試験を含む高度試験と情報処理安全確保支援士試験に共通の問題です。正解は IPA 公表の解答例によります。
difficulty: 1
format: single
stem: |
  自社製品の脆弱性に起因するリスクに対応するための社内機能として，最も適切なものはどれか。
choices:
  - CSIRT
  - PSIRT
  - SOC
  - WHOIS データベースの技術連絡担当
answer: 2
---
PSIRT（Product Security Incident Response Team）は、自社が開発・提供する製品やサービスの脆弱性に対応する組織内の機能です。外部からの脆弱性情報を受け付け、影響を調査し、修正プログラムの作成や利用者への情報公開・注意喚起などを行います。

### 各選択肢の検討

- **ア**：CSIRT（Computer Security Incident Response Team）は、自組織の情報システムで発生したセキュリティインシデントに対応する組織です。対象は自組織のシステムで、自社製品の脆弱性ではありません。
- **イ（正解）**：自社製品の脆弱性に起因するリスクへの対応を担うのが PSIRT です。
- **ウ**：SOC（Security Operation Center）は、ネットワークや機器のログを常時監視し、攻撃の検知・分析・通知を行う組織です。
- **エ**：WHOIS データベースの技術連絡担当は、ドメイン名や IP アドレスの登録情報に記載される技術的な問合せ窓口です。製品の脆弱性に対応する機能ではありません。

### ポイント

- 「CSIRT は自組織のシステム」「PSIRT は自社の製品・サービス」「SOC は監視」と、対象と役割で区別しましょう。
- 日本では、IPA と JPCERT/CC が「情報セキュリティ早期警戒パートナーシップ」を運用し、発見された脆弱性の情報を製品開発者と調整して公表しています。
