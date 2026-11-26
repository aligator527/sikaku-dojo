---
exam: ipa-st
section: am1
topics: [am1-technology, security]
source:
  kind: past
  label: 令和7年度 春期 高度試験 午前I 問15
  year: 2025
  url: https://www.ipa.go.jp/shiken/mondai-kaiotu/nl10bi0000009lh8-att/2025r07h_koudo_am1_qs.pdf
  note: 出典：令和7年度 春期 高度試験・情報処理安全確保支援士試験 午前I 問15（IPA）。午前I は ITストラテジスト試験を含む高度試験と情報処理安全確保支援士試験に共通の問題です。プロトコルの位置関係を示す図は Web 表示用に表で表しています（問題の内容は改変していません）。正解は IPA 公表の解答例によります。
difficulty: 2
format: single
stem: |
  VPN で使用されるプロトコルである IPsec，L2TP，TLS の，OSI 基本参照モデルにおける相対的な位置関係はどれか。

  | OSI 基本参照モデル | A | B | C | D |
  | :---: | :---: | :---: | :---: | :---: |
  | 上位層（アプリケーション層）側 | IPsec | IPsec | TLS | TLS |
  | ↕ | L2TP | TLS | IPsec | L2TP |
  | 下位層（物理層）側 | TLS | L2TP | L2TP | IPsec |
choices:
  - A
  - B
  - C
  - D
answer: 3
---
三つのプロトコルが動作する層は、TLS がトランスポート層の上（TCP とアプリケーションの間）、IPsec がネットワーク層（第 3 層）、L2TP がデータリンク層（第 2 層）です。上位から順に TLS → IPsec → L2TP と並ぶ C が正解です。

### 各選択肢の検討

- **ア**：A は上下が完全に逆です。TLS が最も下位、IPsec が最も上位になっています。
- **イ**：B は IPsec を TLS より上位に置いています。IPsec は IP パケットを保護するネットワーク層のプロトコルで、TCP の上で動作する TLS より下位です。
- **ウ（正解）**：TLS（トランスポート層の上）、IPsec（ネットワーク層）、L2TP（データリンク層）の順です。
- **エ**：D は L2TP を IPsec より上位に置いています。L2TP は PPP フレーム（第 2 層）をトンネリングするプロトコルで、IPsec より下位です。

### ポイント

- L2TP 自体には暗号化の機能がないため、L2TP/IPsec のように IPsec と組み合わせて使います。TLS を使う VPN は SSL-VPN と呼ばれます。
- VPN のプロトコルは「第 2 層：L2TP・PPTP」「第 3 層：IPsec」「第 4 層より上：TLS（SSL）」と層で整理しておくと、位置関係の問題に対応できます。
