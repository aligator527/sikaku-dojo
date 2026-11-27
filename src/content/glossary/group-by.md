---
term: 'GROUP BY'
reading: ぐるーぷばい
en: 'GROUP BY clause'
aliases: ['HAVING', '集計関数', '集約関数']
exams: [toukei-dse, shindanshi]
summary: 'SQL の SELECT 文で、指定した列の値が同じ行をまとめて 1 つのグループとし、グループごとに SUM・COUNT・AVG などの集計関数を計算する句。集計後のグループの絞り込みは HAVING 句で行う。'
related: [sql, sql-join, sql-null, window-function]
---
## 使い方

```sql
SELECT   dept, COUNT(*) AS n, AVG(score) AS mean_score
FROM     scores
WHERE    score IS NOT NULL
GROUP BY dept
HAVING   COUNT(*) >= 3;
```

`dept` の値ごとに 1 行の結果が出力されます。主な集計関数は COUNT・SUM・AVG・MAX・MIN です。

## WHERE と HAVING

| 句 | 評価の時点 | 対象 | 集計関数 |
| --- | --- | --- | --- |
| WHERE | グループ化の前 | 個々の行 | 使えない |
| HAVING | グループ化の後 | グループ | 使える |

「1 件あたり 1,000 円以上の注文だけを集計する」なら WHERE、「合計が 1 万円以上の顧客だけを出力する」なら HAVING です。

## SELECT に書ける列

GROUP BY を使うとき、SELECT に書けるのは、GROUP BY に指定した列、集計関数、定数だけです。グループ内で値が 1 つに決まらない列を書くと、標準 SQL ではエラーになります（一部のデータベースは任意の 1 行の値を返すので注意）。

## NULL の扱い

- `COUNT(*)` は行数を数え、`COUNT(列)` はその列が NULL でない行数を数えます。
- SUM・AVG・MAX・MIN は NULL を無視して計算します。AVG の分母も NULL でない行数です。
- GROUP BY の列が NULL の行は、NULL どうしで 1 つのグループにまとめられます。

## 試験での問われ方

統計検定データサイエンスエキスパートでは、小さな表に GROUP BY・HAVING・ORDER BY を含む SQL を実行した結果を選ぶ問題、WHERE と HAVING の違い、COUNT(*) と COUNT(列) の違いを問う問題が出ます。中小企業診断士の経営情報システムでも、SQL の集計の基本として出題されます。

## よくある誤り

- 集計関数を使った条件を WHERE に書く。
- AVG が NULL を 0 として平均すると考える（NULL の行は分母にも入らない）。
