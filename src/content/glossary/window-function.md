---
term: 'ウィンドウ関数'
reading: うぃんどうかんすう
en: 'window function'
aliases: ['分析関数']
exams: [toukei-dse]
summary: 'SQL で、行をまとめずに残したまま、各行と関係する行の範囲（ウィンドウ）について集計値や順位を計算する関数。累計、移動平均、グループ内の順位や構成比などを求めるのに使う。'
related: [group-by, sql, sql-join]
---
## 書き方

```sql
SELECT store, day, sales,
       SUM(sales) OVER (PARTITION BY store ORDER BY day) AS cum_sales,
       RANK()     OVER (PARTITION BY store ORDER BY sales DESC) AS rk
FROM daily;
```

- `PARTITION BY`：ウィンドウを分けるグループ（GROUP BY と違い、行はまとめられない）
- `ORDER BY`：ウィンドウ内の行の順序
- フレーム指定：`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW`（直前 2 行と現在行、3 行の移動平均など）。`ORDER BY` を書いて範囲を省略すると、先頭から現在行（と同じ値の行）までになります。

## 主な関数

- 集計関数を窓に適用：`SUM`・`AVG`・`COUNT`・`MAX`・`MIN`（累計や移動平均、グループ全体の合計）
- 順位：`ROW_NUMBER`（同順位なしの通し番号）、`RANK`（同順位の後を飛ばす）、`DENSE_RANK`（同順位の後を詰める）
- 前後の行：`LAG`・`LEAD`（前日比などの計算）

## 計算例

点数が 90, 85, 85, 80 の 4 人について、点数の高い順の順位は次のとおりです。

| 点数 | ROW_NUMBER | RANK | DENSE_RANK |
| --- | --- | --- | --- |
| 90 | 1 | 1 | 1 |
| 85 | 2 | 2 | 2 |
| 85 | 3 | 2 | 2 |
| 80 | 4 | 4 | 3 |

店舗 A の 1〜3 日目の売上が 10, 20, 30 のとき、`SUM(sales) OVER (PARTITION BY store ORDER BY day)` は 10, 30, 60、これを `SUM(sales) OVER (PARTITION BY store)`（店舗の合計 60）で割った累積構成比は 0.17, 0.5, 1 です。

## GROUP BY との違い

GROUP BY はグループごとに 1 行にまとめますが、ウィンドウ関数は元の行数を保ったまま、各行に集計値を付け加えます。「各店舗の売上と、その店舗の平均売上との差」のように、行ごとの値とグループの集計値を並べたいときに便利です。ウィンドウ関数は SELECT 句で評価されるので、その結果で行を絞るには、副問合せや WITH 句で包んでから WHERE を使います。

## 試験での問われ方

統計検定データサイエンスエキスパートでは、RANK と DENSE_RANK の違い、PARTITION BY と ORDER BY を指定した累計・構成比の値を、表から計算させる問題が出ます。

## よくある誤り

- `ORDER BY` を付けた `SUM(...) OVER` がグループ全体の合計を返すと考える（既定のフレームでは先頭から現在行までの累計になる）。
- ウィンドウ関数の結果を同じ SELECT 文の WHERE 句で使う。
