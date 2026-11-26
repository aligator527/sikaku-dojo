---
exam: ipa-st
section: am1
topics: [am1-technology]
source:
  kind: past
  label: 令和7年度 春期 高度試験 午前I 問11
  year: 2025
  url: https://www.ipa.go.jp/shiken/mondai-kaiotu/nl10bi0000009lh8-att/2025r07h_koudo_am1_qs.pdf
  note: 出典：令和7年度 春期 高度試験・情報処理安全確保支援士試験 午前I 問11（IPA）。午前I は ITストラテジスト試験を含む高度試験と情報処理安全確保支援士試験に共通の問題です。正解は IPA 公表の解答例によります。
difficulty: 1
format: single
stem: |
  無線 LAN のアクセスポイントや IP 電話機などに，LAN ケーブルを利用して給電も行う仕組みはどれか。
choices:
  - PLC
  - PoE
  - UPS
  - USB
answer: 2
---
PoE（Power over Ethernet）は、イーサネットの LAN ケーブル（ツイストペアケーブル）で、データ通信と同時に電力も供給する技術です。IEEE 802.3af・802.3at・802.3bt として標準化されています。電源コンセントのない天井や壁面にも、無線 LAN のアクセスポイント、IP 電話機、ネットワークカメラなどを設置しやすくなります。

### 各選択肢の検討

- **ア**：PLC（Power Line Communication：電力線通信）は、電力線（電灯線）を通信回線として使い、データを送る技術です。LAN ケーブルで給電する PoE とは逆の発想です。
- **イ（正解）**：LAN ケーブルを使って機器に給電する仕組みが PoE です。
- **ウ**：UPS（Uninterruptible Power Supply：無停電電源装置）は、停電や瞬断のときにバッテリから電力を供給し、機器を安全に停止させるための装置です。
- **エ**：USB は周辺機器を接続するシリアルインタフェースです。USB ケーブルで給電（バスパワー）もできますが、LAN ケーブルを利用する仕組みではありません。

### ポイント

- PoE では、給電する側の機器（PoE 対応スイッチなど）を PSE、受電する側の機器を PD と呼びます。
- 給電能力は規格によって異なり、802.3af が最大 15.4 W、802.3at（PoE+）が最大 30 W、802.3bt では最大 60 W・90 W（いずれも給電側の出力）です。
