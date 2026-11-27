---
term: 'IPsec'
reading: あいぴーせっく
en: 'IP Security'
aliases: ['IPsec-VPN']
exams: [ipa-st]
summary: 'IP パケットの暗号化と認証をネットワーク層で行うプロトコル群。IPv4 と IPv6 の両方で使え、拠点間をインターネット経由で結ぶ VPN などに使われる。'
related: [tls, osi-reference-model, common-key-cryptography]
---
## 定義

IPsec は、ネットワーク層（IP 層）で IP パケットを保護するためのプロトコルの集まりです。ネットワーク層で暗号化するので、その上で動くアプリケーションは IPsec を意識せずに、すべての通信を保護できます。

## 構成要素

| 要素 | 役割 |
| --- | --- |
| ESP（Encapsulating Security Payload） | パケットの暗号化と認証（改ざん検知） |
| AH（Authentication Header） | 認証（改ざん検知）だけを行い、暗号化はしない |
| IKE（Internet Key Exchange） | 通信に使う鍵や暗号方式を、通信相手と安全に取り決める |

## 二つのモード

- **トランスポートモード**：IP パケットのデータ部分だけを保護する。端末どうしの通信で使う。
- **トンネルモード**：元の IP パケット全体を暗号化し、新しい IP ヘッダを付けて送る。拠点の VPN 装置どうしを結ぶ IPsec-VPN で使う。

## VPN での使われ方

インターネット VPN では、拠点間を常時結ぶ場合に IPsec-VPN、外出先の端末から Web ブラウザなどで接続する場合に TLS を使う SSL-VPN がよく使われます。L2TP はそれ自体に暗号化機能がないので、L2TP/IPsec のように IPsec と組み合わせます。

## 試験での問われ方

- **ITストラテジスト試験**：科目A-1 で、IPv6 の通信をネットワーク層で暗号化するときに使うもの（PPP・SSH・TLS との比較）や、VPN のプロトコル（IPsec・L2TP・TLS）の OSI 基本参照モデル上の位置関係が問われています。IPsec はネットワーク層、L2TP はデータリンク層、TLS はトランスポート層の上と整理します。

## よくある誤り

- AH でも通信内容が暗号化されると考える。暗号化するのは ESP です。
- TLS と IPsec の階層を逆にする。IPsec のほうが下位の層で動きます。
- IPsec を使うには各アプリケーションの対応が必要だと考える。ネットワーク層で動くので、アプリケーションの変更は要りません。
