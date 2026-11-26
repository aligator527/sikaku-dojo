---
exam: ipa-st
section: am1
topics: [am1-technology]
source:
  kind: past
  label: 令和7年度 春期 高度試験 午前I 問5
  year: 2025
  url: https://www.ipa.go.jp/shiken/mondai-kaiotu/nl10bi0000009lh8-att/2025r07h_koudo_am1_qs.pdf
  note: 出典：令和7年度 春期 高度試験・情報処理安全確保支援士試験 午前I 問5（IPA）。午前I は ITストラテジスト試験を含む高度試験と情報処理安全確保支援士試験に共通の問題です。正解は IPA 公表の解答例によります。
difficulty: 2
format: single
stem: |
  二つのシステム A，B の稼働率をそれぞれ $\alpha_{\mathrm{A}}$（$0 < \alpha_{\mathrm{A}} < 1$），$\alpha_{\mathrm{B}}$（$0 < \alpha_{\mathrm{B}} < 1$），MTBF をそれぞれ $\mathrm{MTBF_A}$，$\mathrm{MTBF_B}$，MTTR をそれぞれ $\mathrm{MTTR_A}$，$\mathrm{MTTR_B}$ としたとき，これらの関係として，常に成り立つものはどれか。
choices:
  - '$\alpha_{\mathrm{A}} = \alpha_{\mathrm{B}}$ ならば，$\mathrm{MTBF_A} = \mathrm{MTBF_B}$ であり，かつ $\mathrm{MTTR_A} = \mathrm{MTTR_B}$ である。'
  - '$\alpha_{\mathrm{A}} = \alpha_{\mathrm{B}}$ ならば，$\mathrm{MTTR_A} / \mathrm{MTBF_A} = \mathrm{MTTR_B} / \mathrm{MTBF_B}$ である。'
  - '$\alpha_{\mathrm{A}} > \alpha_{\mathrm{B}}$ ならば，$\mathrm{MTBF_A} > \mathrm{MTBF_B}$ であり，かつ $\mathrm{MTTR_A} > \mathrm{MTTR_B}$ である。'
  - '$\alpha_{\mathrm{A}} > \alpha_{\mathrm{B}}$ ならば，$\mathrm{MTTR_A} / \mathrm{MTBF_A} > \mathrm{MTTR_B} / \mathrm{MTBF_B}$ である。'
answer: 2
---
稼働率は $\alpha = \dfrac{\mathrm{MTBF}}{\mathrm{MTBF} + \mathrm{MTTR}}$ です。分母と分子を MTBF で割ると

$$
\alpha = \frac{1}{1 + \mathrm{MTTR} / \mathrm{MTBF}}
$$

となり、稼働率は比 $\mathrm{MTTR}/\mathrm{MTBF}$ だけで決まり、この比が小さいほど高くなります。したがって $\alpha_{\mathrm{A}} = \alpha_{\mathrm{B}}$ と $\mathrm{MTTR_A}/\mathrm{MTBF_A} = \mathrm{MTTR_B}/\mathrm{MTBF_B}$ は同値で、常に成り立ちます。

### 各選択肢の検討

- **ア**：稼働率が等しくても、MTBF と MTTR がそれぞれ等しいとは限りません。例えば MTBF 90 時間・MTTR 10 時間と、MTBF 900 時間・MTTR 100 時間は、どちらも稼働率 0.9 です。
- **イ（正解）**：稼働率は $\mathrm{MTTR}/\mathrm{MTBF}$ の値だけで決まるので、稼働率が等しければこの比も等しくなります。
- **ウ**：稼働率が高くても、MTBF と MTTR がともに大きいとは限りません。例えば A が MTBF 10 時間・MTTR 0.1 時間（稼働率約 0.990）、B が MTBF 100 時間・MTTR 10 時間（稼働率約 0.909）なら、$\alpha_{\mathrm{A}} > \alpha_{\mathrm{B}}$ でも MTBF も MTTR も A のほうが小さくなります。
- **エ**：不等号の向きが逆です。比 $\mathrm{MTTR}/\mathrm{MTBF}$ が小さいほど稼働率は高いので、$\alpha_{\mathrm{A}} > \alpha_{\mathrm{B}}$ ならば $\mathrm{MTTR_A}/\mathrm{MTBF_A} < \mathrm{MTTR_B}/\mathrm{MTBF_B}$ です。

### ポイント

- MTBF（平均故障間隔）は長いほど、MTTR（平均修復時間）は短いほど稼働率が上がります。稼働率を決めるのは両者の**比**であり、個々の値ではありません。
- 「常に成り立つもの」を問われたら、反例を一つ作れるかどうかで選択肢を消していくと確実です。
