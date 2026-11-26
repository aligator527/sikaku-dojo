---
exam: ipa-st
section: am1
topics: [am1-technology]
source:
  kind: past
  label: 令和7年度 春期 高度試験 午前I 問10
  year: 2025
  url: https://www.ipa.go.jp/shiken/mondai-kaiotu/nl10bi0000009lh8-att/2025r07h_koudo_am1_qs.pdf
  note: 出典：令和7年度 春期 高度試験・情報処理安全確保支援士試験 午前I 問10（IPA）。午前I は ITストラテジスト試験を含む高度試験と情報処理安全確保支援士試験に共通の問題です。空欄 a は［ a ］で表しています。正解は IPA 公表の解答例によります。
difficulty: 1
format: single
stem: |
  SQL 文に示す参照制約が存在する“商品”表と“受注”表とがある。“商品”表の行を削除したとき，削除した行の商品コードと同じ値の商品コードをもつ“受注”表の行を自動的に削除する SQL 文として，a に入れる字句はどれか。

  〔SQL 文〕

  ```
  CREATE TABLE 商品 (
      商品コード  CHAR(4) PRIMARY KEY ,
      商品名      VARCHAR(64)
  )

  CREATE TABLE 受注 (
      受注番号    INTEGER PRIMARY KEY ,
      商品コード  CHAR(4) ,
      受注個数    INTEGER ,
      納品日      CHAR(8) ,
      FOREIGN KEY (商品コード) REFERENCES 商品(商品コード)
      ON DELETE ［ a ］
  )
  ```
choices:
  - CASCADE
  - RESTRICT
  - SET DEFAULT
  - SET NULL
answer: 1
---
外部キーの参照動作 `ON DELETE CASCADE` を指定すると、被参照表（“商品”表）の行が削除されたとき、その行を参照している参照表（“受注”表）の行も連鎖的に自動で削除されます。問題文の「同じ値の商品コードをもつ“受注”表の行を自動的に削除する」がそのまま CASCADE の動作です。

### 各選択肢の検討

- **ア（正解）**：CASCADE は、被参照行の削除を参照している行にも波及させ、まとめて削除します。
- **イ**：RESTRICT は、参照している行が存在する場合、被参照行の削除を拒否（エラーに）します。“受注”表の行は削除されません。
- **ウ**：SET DEFAULT は、参照している行の外部キー（商品コード）の値を列の既定値に置き換えます。行そのものは残ります。
- **エ**：SET NULL は、参照している行の外部キーの値を NULL にします。行そのものは残ります。

### ポイント

- 参照動作は `ON DELETE`（削除時）と `ON UPDATE`（更新時）に指定でき、CASCADE・SET NULL・SET DEFAULT・RESTRICT・NO ACTION があります。指定しない場合は NO ACTION となり、参照されている行は削除できません。
- 「連鎖的に削除・更新する」なら CASCADE、「参照側を残して外部キーだけ変える」なら SET NULL／SET DEFAULT、「操作を拒否する」なら RESTRICT／NO ACTION と覚えましょう。
