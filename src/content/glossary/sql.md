---
term: 'SQL'
reading: えすきゅーえる
en: 'SQL'
aliases: ['SELECT文']
exams: [toukei-dse, ipa-st, shindanshi]
summary: '関係データベースで、表（テーブル）の定義、データの検索・追加・更新・削除、権限の管理などを行うための標準的な言語。分析では SELECT 文による抽出と集計が中心になる。'
related: [sql-join, group-by, sql-null, window-function, subquery]
---
## 文の種類

- **データ操作言語（DML）**：SELECT（検索）、INSERT（追加）、UPDATE（更新）、DELETE（削除）
- **データ定義言語（DDL）**：CREATE TABLE、ALTER TABLE、DROP TABLE など。主キー・外部キー・NOT NULL などの制約もここで定める
- **データ制御言語（DCL）**：GRANT、REVOKE（権限の付与・取消）。トランザクションの COMMIT、ROLLBACK もあわせて扱うことが多い

## SELECT 文の構成と評価の順序

```sql
SELECT   dept, AVG(score) AS avg_score
FROM     exams
WHERE    year = 2026
GROUP BY dept
HAVING   COUNT(*) >= 5
ORDER BY avg_score DESC;
```

句は書く順と評価される順が異なり、概念的には

1. FROM（JOIN を含む）で対象の表を決める
2. WHERE で行を絞る
3. GROUP BY でグループにまとめる
4. HAVING でグループを絞る
5. SELECT で出力する列を計算する（ウィンドウ関数もここ）
6. DISTINCT で重複を除く
7. ORDER BY で並べ替える（指定しなければ行の順序は保証されない）

の順に処理されます。そのため、SELECT で付けた別名は WHERE では使えず、集計関数の条件は WHERE ではなく HAVING に書きます。

## 宣言的な言語

SQL は「何を取り出したいか」を書く宣言的な言語で、「どの順に処理するか」はデータベース管理システムが索引や統計情報を使って決めます（実行計画）。同じ結果を返す書き方が何通りもあり、結合・副問合せ・ウィンドウ関数のどれを使うかで、読みやすさや処理速度が変わります。

## 試験での問われ方

統計検定データサイエンスエキスパートでは、小さな表と SQL 文を示して実行結果を選ぶ・数値で答える問題が出ます。GROUP BY と HAVING、内部結合と外部結合、NULL の扱い、副問合せ、ウィンドウ関数がよく問われます。ITストラテジストの午前 I や中小企業診断士の経営情報システムでも、SQL 文の意味や参照制約の働きが出題されます。

## よくある誤り

- 集計結果に対する条件を WHERE に書く。
- ORDER BY のない SELECT の結果に決まった順序があると考える。
- `= NULL` で NULL の行を探す（`IS NULL` を使う）。
