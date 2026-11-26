---
exam: ipa-st
section: am2
topics: [security]
source:
  kind: past
  label: 令和5年度 春期 ITストラテジスト試験 午前II 問25
  year: 2023
  url: https://www.ipa.go.jp/shiken/mondai-kaiotu/ps6vr70000010d6y-att/2023r05h_st_am2_qs.pdf
  note: 出典：令和5年度 春期 ITストラテジスト試験 午前II 問25（IPA）。正解は IPA 公表の解答例によります。
difficulty: 1
format: single
stem: |
  サイバー攻撃に関する脅威に対処するために，非合法な手段を使わずに入手できる公開情報について，収集，分析及び活用が進んでいる。公開情報を収集，分析し，得られる知見，若しくは知見を得るために公開情報を収集，分析する活動，方法などを指すものはどれか。
choices:
  - IoC
  - OSINT
  - SIEM
  - TTP
answer: 2
---
OSINT（Open Source Intelligence）は、Web サイト、報道、SNS、公開されている技術資料や登録情報など、合法的に入手できる公開情報を収集・分析して得られる知見、及びその活動や方法を指します。サイバーセキュリティの分野では、攻撃者の動向の把握や、自組織の情報が外部にどれだけ公開されているかの確認などに活用されています。

### 各選択肢の検討

- **ア**：IoC（Indicators of Compromise：侵害指標）は、不正アクセスやマルウェア感染の痕跡を示す情報です。攻撃に使われた IP アドレス、ドメイン名、ファイルのハッシュ値などが当たります。
- **イ（正解）**：公開情報を収集・分析して得られる知見や、そのための活動・方法は、OSINT です。
- **ウ**：SIEM（Security Information and Event Management）は、各種機器のログを一元的に収集し、相関分析によってセキュリティ上の脅威を検知する仕組みです。
- **エ**：TTP（Tactics, Techniques and Procedures：戦術・技術・手順）は、攻撃者の行動の特徴を体系的に表したものです。MITRE ATT&CK などで整理されています。

### ポイント

- OSINT のキーワードは「公開情報」と「合法的な入手」です。攻撃者も標的の下調べに OSINT を使うため、自組織が公開している情報を定期的に点検することも重要です。
- IoC は「痕跡」、TTP は「手口」、SIEM は「ログの統合分析の仕組み」、OSINT は「公開情報の収集・分析」と整理しておきましょう。
