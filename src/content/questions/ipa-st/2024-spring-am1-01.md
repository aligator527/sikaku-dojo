---
exam: ipa-st
section: am1
topics: [am1-technology]
source:
  kind: past
  label: 令和6年度 春期 高度試験 午前I 問1
  year: 2024
  url: https://www.ipa.go.jp/shiken/mondai-kaiotu/m42obm000000afqx-att/2024r06h_koudo_am1_qs.pdf
  note: 出典：令和6年度 春期 高度試験・情報処理安全確保支援士試験 午前I 問1（IPA）。午前I は ITストラテジスト試験を含む高度試験と情報処理安全確保支援士試験に共通の問題です。正解は IPA 公表の解答例によります。
difficulty: 3
format: single
stem: |
  ATM（現金自動預払機）が 1 台ずつ設置してある二つの支店を統合し，統合後の支店には ATM を 1 台設置する。統合後の ATM の平均待ち時間を求める式はどれか。ここで，待ち時間は M/M/1 の待ち行列モデルに従い，平均待ち時間にはサービス時間を含まず，ATM を 1 台に統合しても十分に処理できるものとする。

  〔条件〕

  (1)　統合後の平均サービス時間：$T_{\mathrm{S}}$

  (2)　統合前の ATM の利用率：両支店とも $\rho$

  (3)　統合後の利用者数：統合前の両支店の利用者数の合計
choices:
  - '$\dfrac{\rho}{1-\rho} \times T_{\mathrm{S}}$'
  - '$\dfrac{\rho}{1-2\rho} \times T_{\mathrm{S}}$'
  - '$\dfrac{2\rho}{1-\rho} \times T_{\mathrm{S}}$'
  - '$\dfrac{2\rho}{1-2\rho} \times T_{\mathrm{S}}$'
answer: 4
---
M/M/1 モデルの平均待ち時間（サービス時間を含まない）は、利用率を $\rho'$ とすると $\dfrac{\rho'}{1-\rho'} \times T_{\mathrm{S}}$ です。利用率は「平均到着率 × 平均サービス時間」なので、統合で利用者数（到着率）が両支店の合計、つまり 2 倍になり、平均サービス時間が変わらなければ、統合後の利用率は $2\rho$ になります。

### 計算

$$
\rho' = 2\rho \quad\Longrightarrow\quad \text{平均待ち時間} = \frac{\rho'}{1-\rho'} \times T_{\mathrm{S}} = \frac{2\rho}{1-2\rho} \times T_{\mathrm{S}}
$$

「1 台に統合しても十分に処理できる」という前提は、$2\rho < 1$ であることを意味します。

### 各選択肢の検討

- **ア**：統合前の 1 台当たりの平均待ち時間の式です。利用者数が 2 倍になったことが反映されていません。
- **イ**：分母だけを $1 - 2\rho$ にしています。分子の利用率も $2\rho$ に置き換える必要があります。
- **ウ**：分子だけを $2\rho$ にしています。分母の利用率も $2\rho$ に置き換える必要があります。
- **エ（正解）**：統合後の利用率 $2\rho$ を M/M/1 の公式に当てはめた式です。

### ポイント

- 利用率 $\rho$ ＝ 平均到着率 $\lambda$ × 平均サービス時間 $T_{\mathrm{S}}$、平均待ち時間 $W_q = \dfrac{\rho}{1-\rho} T_{\mathrm{S}}$、平均応答時間（待ち時間＋サービス時間）$W = \dfrac{1}{1-\rho} T_{\mathrm{S}}$ を区別して覚えましょう。
- 利用率が 1 に近づくと待ち時間は急増します。例えば $\rho = 0.3$ のとき、統合前の待ち時間は約 $0.43\,T_{\mathrm{S}}$ ですが、統合後は $0.6 / 0.4 = 1.5\,T_{\mathrm{S}}$ と 3.5 倍になります。
