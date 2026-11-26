---
exam: ipa-st
section: am2
topics: [security]
source:
  kind: past
  label: 令和3年度 春期 ITストラテジスト試験 午前II 問24
  year: 2021
  url: https://www.ipa.go.jp/shiken/mondai-kaiotu/gmcbt8000000d5ru-att/2021r03h_st_am2_qs.pdf
  note: 出典：令和3年度 春期 ITストラテジスト試験 午前II 問24（IPA）。正解は IPA 公表の解答例によります。
difficulty: 1
format: single
stem: |
  ディジタル証明書が失効しているかどうかをオンラインで確認するためのプロトコルはどれか。
choices:
  - CHAP
  - LDAP
  - OCSP
  - SNMP
answer: 3
---
OCSP（Online Certificate Status Protocol）は、ディジタル証明書が失効していないかを、OCSP レスポンダ（認証局などが運営するサーバ）に問い合わせてリアルタイムに確認するためのプロトコルです。証明書のシリアル番号を指定して問い合わせると、「有効（good）」「失効（revoked）」「不明（unknown）」のいずれかの状態が、レスポンダのディジタル署名付きで返されます。

### 各選択肢の検討

- **ア**：CHAP（Challenge Handshake Authentication Protocol）は、PPP 接続などで使われる、チャレンジレスポンス方式の利用者認証プロトコルです。パスワードを平文で送らずに認証できます。
- **イ**：LDAP（Lightweight Directory Access Protocol）は、利用者や機器などの情報を管理するディレクトリサービスにアクセスするためのプロトコルです。
- **ウ（正解）**：証明書の失効状態をオンラインで確認するプロトコルは OCSP です。
- **エ**：SNMP（Simple Network Management Protocol）は、ネットワーク機器の状態の監視や設定などの管理に使うプロトコルです。

### ポイント

- 証明書の失効を確認する方法には、認証局が定期的に発行する失効リスト（CRL）をダウンロードして照合する方法と、OCSP で個別に問い合わせる方法があります。OCSP は CRL より新しい情報を、少ない通信量で得られます。
- Web サーバが OCSP の応答を取得しておき、TLS の接続時にクライアントへ渡す仕組みを OCSP ステープリングといいます。
