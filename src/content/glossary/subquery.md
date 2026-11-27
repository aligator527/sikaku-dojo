---
term: '副問合せ'
reading: ふくといあわせ
en: 'subquery'
aliases: ['サブクエリ', '副問い合わせ', '相関副問合せ']
exams: [toukei-dse]
summary: 'SQL 文の中に入れ子にして書いた SELECT 文。その結果を、条件の値の一覧、比較の基準値、あるいは一時的な表として外側の文で使う。'
related: [sql, sql-null, sql-join, group-by]
---
## 使われる場所

- **WHERE 句**：`WHERE amount > (SELECT AVG(amount) FROM orders)`（平均より大きい注文）、`WHERE id IN (SELECT customer_id FROM orders)`（注文のある会員）
- **FROM 句**：副問合せの結果を表として使う（導出表）。集計した結果をさらに集計するときに使う。例：顧客ごとの注文回数を数え、その分布を集計する。
- **SELECT 句**：1 行 1 列を返すスカラー副問合せ。

結果が 1 つの値になるもの（スカラー副問合せ）は `=` や `>` で比較でき、複数の行を返すものは `IN`・`EXISTS`・`ANY`・`ALL` と組み合わせます。

## 相関副問合せ

外側の行の値を参照する副問合せを相関副問合せといいます。

```sql
SELECT name FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
```

外側の各行について副問合せが評価される（と考えてよい）ので、「各部署で平均点より高い社員」のように、行ごとに基準の変わる条件を書けます。

## 注意

- `NOT IN` の副問合せの結果に NULL が含まれると、条件が TRUE になる行がなくなり、結果が 0 行になります。`NOT EXISTS` を使えばこの問題は起きません。
- 同じ処理を JOIN やウィンドウ関数で書けることも多く、処理速度はデータベースの実行計画によります。
- FROM 句の副問合せは WITH 句（共通表式）で名前を付けて書くと読みやすくなります。

## 試験での問われ方

統計検定データサイエンスエキスパートでは、副問合せを含む SQL 文の実行結果を表から求める問題が出ます。とくに、NULL を含む列に対する NOT IN、FROM 句の副問合せで集計を 2 段階に行う例が典型です。

## よくある誤り

- 複数の行を返す副問合せを `=` で比較する。
- NOT IN と NOT EXISTS は常に同じ結果を返すと考える（NULL があると異なる）。
