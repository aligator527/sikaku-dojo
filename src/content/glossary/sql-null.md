---
term: 'NULL'
reading: ぬる
en: 'NULL'
aliases: ['3値論理', '三値論理']
exams: [toukei-dse, ipa-st]
summary: '関係データベースで、値が存在しない・不明であることを表す特別な印。どんな値との比較も真でも偽でもない「不明（UNKNOWN）」になるため、SQL の条件判定や集計で独特の振る舞いをする。'
related: [sql, group-by, sql-join, subquery]
---
## 3 値論理

SQL の条件式は、真（TRUE）・偽（FALSE）・不明（UNKNOWN）の 3 つの値をとります。NULL を含む比較は、`NULL = NULL` も含めてすべて UNKNOWN です。WHERE 句や ON 句は条件が TRUE の行だけを残すので、UNKNOWN の行は除かれます。

| | TRUE | UNKNOWN | FALSE |
| --- | --- | --- | --- |
| AND UNKNOWN | UNKNOWN | UNKNOWN | FALSE |
| OR UNKNOWN | TRUE | UNKNOWN | UNKNOWN |

NOT UNKNOWN も UNKNOWN です。NULL かどうかは `IS NULL`・`IS NOT NULL` で調べ、NULL を別の値に置き換えるには `COALESCE(列, 0)` を使います。

## NOT IN の落とし穴

```sql
SELECT name FROM employees
WHERE id NOT IN (SELECT manager_id FROM departments);
```

「部署の責任者になっていない社員」を求めるつもりの文です。責任者が未定で `manager_id` が NULL の部署が 1 つでもあると、`id NOT IN (1, 2, NULL)` は `id <> 1 AND id <> 2 AND id <> NULL` となり、最後の項が UNKNOWN なので全体が TRUE になることはありません。そのため、該当する社員がいても結果は 0 行になります。`NOT EXISTS` を使うか、副問合せで `WHERE manager_id IS NOT NULL` と除いておきます。

## 集計での扱い

- `COUNT(*)` は NULL を含む行も数え、`COUNT(列)` は NULL を除いて数えます。
- SUM・AVG・MAX・MIN は NULL を無視します。全部 NULL なら結果も NULL です。
- 算術演算に NULL が入ると結果は NULL です（`価格 * NULL` は NULL）。

## 欠測値との関係

データ分析で NULL は欠測値として現れます。NULL の行を除いて平均をとると、欠測が無作為でない場合に偏った値になります。0 で埋めるのも、本当に 0 である場合を除いて誤りのもとです。

## 試験での問われ方

統計検定データサイエンスエキスパートでは、NULL を含む表に NOT IN や外部結合、COUNT・AVG を使った SQL の実行結果を求める問題が出ます。ITストラテジストの午前 I でも、外部キーと NULL の関係などデータベースの基礎として扱われます。

## よくある誤り

- `WHERE 列 = NULL` で NULL の行が取り出せると考える。
- NOT IN の副問合せに NULL があっても、NULL 以外の値で正しく判定されると考える。
