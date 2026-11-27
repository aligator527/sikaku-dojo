# コンテンツ執筆ガイド

資格道場の教材はすべて `src/content/` 以下のテキストファイルです。スキーマは
[`src/content.config.ts`](../src/content.config.ts) で定義され、ビルド時に検証されます。
`pnpm astro sync` でスキーマ違反を確認できます（ビルドしなくても検証できます）。

```
src/content/
├── exams/<exam-id>.yaml           資格の基本情報・出題分野
├── questions/<exam-id>/<slug>.md   問題（front matter = 構造、本文 = 解説）
├── glossary/<slug>.md             用語集（複数資格で共有）
├── guides/<exam-id>.md            対策方法
├── resources/<group>.yaml         外部リンク集
├── mocks/<mock-id>.yaml           模擬試験の定義
└── formulas/<exam-id>.yaml        公式集（任意）
```

## 共通ルール

- 文体は **です・ます調**。問題文だけは本試験の文体（である調・命令形）に合わせる。
- 数式は KaTeX。インライン `$...$`、ディスプレイ `$$...$$`。
- YAML 内で数式を書くときは **ブロックスカラー（`|`）か一重引用符** を使う。
  二重引用符だと `\` がエスケープ扱いになり壊れる。
- 選択肢の本文にラベル（ア、①、A など）を書かない。ラベルは資格ごとの `choiceStyle` に従って自動で付く。
- 事実（試験時間・合格基準・日程）は公式サイトで確認し、`officialLinks` に出典を残す。
  変わりやすい情報（受験料・日程）は書きすぎず、公式へのリンクで済ませる。
- UI に絵文字を使わない。本文中でも装飾目的の絵文字は使わない。

## 著作権と出典（重要）

| `source.kind` | 意味                             | 条件                                                                    |
| ------------- | -------------------------------- | ----------------------------------------------------------------------- |
| `past`        | 過去問をそのまま掲載             | 主催者が転載を認めている場合のみ（例: IPA）。`label` に正式な出典を書く |
| `adapted`     | 過去問の論点を基にした改題・類題 | 本文は独自に書き起こす。`label` に元になった回、`url` に公式 PDF        |
| `original`    | 資格道場のオリジナル問題         | 出典不要                                                                |

統計検定・日商簿記・数検・E資格・中小企業診断士の過去問は **本文を転載しない**。
`adapted` か `original` で書き、必要なら公式の過去問ページを `resources` に載せる。

IPA の過去問を `past` として掲載する場合、`label` は
`令和5年度 春期 ITストラテジスト試験 午前II 問1` の形式にし、`url` に問題冊子 PDF を入れる。

## exams/<exam-id>.yaml

ファイル名が資格 ID になる（例: `toukei-2.yaml` → `toukei-2`）。資格を追加・改名したら `pnpm og` で
共有用画像（`public/og/<資格ID>.png`）を作り直す。

```yaml
name: 統計検定2級
shortName: 統計2級
family: toukei # src/config/catalog.ts の FAMILIES
category: statistics # src/config/catalog.ts の CATEGORIES
level: 2級
order: 20 # 一覧での並び順（小さいほど先）
status: published # published | draft | planned（planned は「準備中」表示）
summary: 大学基礎課程で習得すべき統計学の知識と、その応用力を問う試験。
organizer:
  name: 一般財団法人 統計質保証推進協会
  url: https://www.toukei-kentei.jp/
format:
  method: CBT
  duration: 90分
  questions: 35問程度
  answerStyle: 4〜5肢選択
  passing: 100点満点中60点以上
  schedule: 通年（CBT 方式、随時受験）
  notes:
    - 電卓の持ち込み可（関数電卓は不可）
choiceStyle: circled # katakana(ア) | circled(①) | alpha(A) | number(1)
sections: # 試験区分・科目（ない場合は省略可）
  - id: main
    name: 本試験
topics: # 出題分野。id は英小文字とハイフン
  - id: descriptive
    name: データの記述と要約
    group: データの分析
  - id: probability
    name: 確率と確率分布
    group: 確率
officialLinks:
  - label: 統計検定2級 試験内容
    url: https://www.toukei-kentei.jp/exam/grade2/
updatedAt: 2026-11-26
```

## questions/<exam-id>/<slug>.md

- フォルダ名は front matter の `exam` と一致させる。
- slug: オリジナルは `o-001` から連番。IPA の過去問は `2023-spring-am2-01` のように回・区分・番号。
- `topics` には、その資格の `exams/*.yaml` に定義された topic id だけを使う。
- 本文（front matter の下）が **解説**。正解の記号は画面に自動表示されるので、本文は
  「なぜその答えになるか」から書き始める。

### 解説の構成

```markdown
（結論と考え方を 2〜4 文で）

### 計算 / 各選択肢の検討

（計算過程、または選択肢ごとの正誤理由）

### ポイント

（覚えておくべき公式・典型的な誤り）
```

### 形式ごとの front matter

**single（単一選択）** — `answer` は 1 始まりの番号。

```yaml
---
exam: toukei-2
section: main
topics: [descriptive]
source:
  kind: original
difficulty: 1 # 1=基礎 2=標準 3=発展
format: single
stem: |
  次のデータの中央値を求めよ。

  $$3,\ 8,\ 5,\ 10,\ 7$$
choices:
  - '$5$'
  - '$7$'
  - '$6.6$'
  - '$8$'
answer: 2
---
データを小さい順に並べると $3, 5, 7, 8, 10$ となり、中央の 3 番目の値は $7$ です。
```

**multiple（複数選択）** — `answer: [1, 3]`

**numeric（数値入力）**

```yaml
format: numeric
answer:
  value: 0.25
  tolerance: 0.005 # 許容誤差（絶対値）。0 で完全一致
  unit: '' # 任意（円、% など）
inputHint: 小数第3位を四捨五入して小数第2位まで答えよ。
```

**journal（仕訳）** — 日商簿記の仕訳問題。勘定科目は `accounts` から選ばせる。

```yaml
format: journal
accounts: [現金, 当座預金, 売掛金, 買掛金, 売上, 仕入, 支払手数料]
answer:
  debit:
    - { account: 仕入, amount: 300000 }
  credit:
    - { account: 買掛金, amount: 300000 }
```

借方・貸方それぞれ、勘定科目ごとの合計金額が一致すれば正解（行の順序は問わない）。

**essay（記述・論述）** — 自己採点。

```yaml
format: essay
modelAnswer: |
  模範解答（Markdown）
rubric:
  - 採点ポイント1
  - 採点ポイント2
charLimit: 100
```

### 共有資料（事例・データ表）

`passage:`（Markdown）に書くと、問題文の上に枠付きで表示される。
同じ事例を使う小問は、それぞれのファイルに同じ `passage` を持たせる。

### 問題作成の品質基準

- **本番と同じ形にする。** 選択肢の数・ラベル（`choiceStyle`）・数値入力か記述かは、その資格の本試験に合わせる。
  論述式の試験は、本番の大問を小問（数値・選択・記述）に分け、共通の設定は `passage` に書く。
- **難易度の配分**は、基礎（1）3割・標準（2）5割・発展（3）2割を目安にする。準1級・1級などの上位級は 2:5:3、最上位級は 1:5:4 程度まで発展問題を増やす。
- **誤答の選択肢は典型的な誤りから作る。** $n$ と $n-1$ の取り違え、片側と両側、符号、単位、定義の混同など。
  「各選択肢の検討」で 1 つずつ誤りの理由を書く。正解が 2 つ考えられる選択肢は作らない。
- **正解の位置を偏らせない。** 選択肢は並べ替えないで表示されるので、正解の番号が ① やアに集中しないよう、
  資格全体でほぼ均等にする（数値の昇順など並びに意味がある場合を除く）。
- **数値は必ずスクリプトで検算する**（例: `uv run --no-project --with scipy --with sympy python check.py`）。
  検算用のスクリプトはリポジトリに入れない。
- **数表の値**は統計検定の付表と同じ精度にそろえる（標準正規分布は $z$ を小数第2位まで、
  $t$・$\chi^2$・$F$ のパーセント点は小数第3位まで）。サイトの「付表」ページと同じ値になる。
- **数値入力の許容誤差**は、答えさせる桁の 1 単位を目安にする（小数第2位までなら `tolerance: 0.01`）。
  整数で答える問題は `tolerance: 0`。分数・百分率・全角数字の入力は自動で解釈される。
- **同じ論点を水増ししない。** 同じ分野の中でも、問う知識・計算・状況を変える。
- **法令・会計基準・シラバスは最新に合わせる**（改訂予定があるものは解説の「ポイント」で注記する）。
- 内部リンク（サイト内の URL）は本文に書かない。ベースパスが環境で変わるため。
- 書き終えたら `pnpm validate --exam <exam-id>`（= `node scripts/validate-content.mjs --exam <exam-id>`）で
  エラーを 0 にする。KaTeX のコンパイル、YAML の書き方、選択肢へのラベル混入、重複も検査される。

### IPA 過去問の小問

午後I（科目B-1）のように 1 つの事例に複数の設問がある場合は、設問ごとに 1 ファイルにし、
事例文を各ファイルの `passage` に同じ内容で入れる。ファイル名は `2025-spring-pm1-01-2-1`
（問1 設問2 (1)）、`label` は `令和7年度 春期 ITストラテジスト試験 午後I 問1 設問2(1)` の形式。
`modelAnswer` には IPA 公表の解答例を出典付きで載せ、`rubric` に採点の観点を書く。

## glossary/<slug>.md

slug は英語のケバブケース（`standard-deviation`）。複数資格で共有する。

```markdown
---
term: 標準偏差
reading: ひょうじゅんへんさ # ひらがなのみ（50音索引に使う）
en: standard deviation
aliases: [SD]
exams: [toukei-2, toukei-jun1]
summary: データの散らばりの大きさを表す指標。分散の正の平方根。
related: [variance] # 他の用語の slug（存在するものだけ）
formula: 's = \sqrt{\frac{1}{n}\sum_{i=1}^{n}(x_i-\bar{x})^2}'
---

## 定義

本文（定義、直感的な意味、試験での問われ方、よくある誤り）。見出しは ## から。
```

- `term` と `aliases` は **問題文で実際に使われる表記** にする。問題ページの「関連する用語」と、
  用語ページの「この用語が登場する問題」は、この表記を問題文・解説から探して自動で作られる
  （長い表記が優先、英字は単語単位、`exams` に挙げた試験の問題だけが対象）。
- 用語名・別名は用語集全体で重複させない。`node scripts/validate-content.mjs --glossary` で
  読み・試験 ID・関連語・KaTeX・重複を検査できる。

## guides/<exam-id>.md

```markdown
---
exam: toukei-2
title: 統計検定2級の対策
summary: 一冊の教科書を軸に、計算問題を手で解けるようにする。
studyHours: 50〜100時間（統計学の初学者）
roadmap:
  - title: 基礎固め
    period: 1〜3週目
    detail: 記述統計と確率を教科書で一周する。
updatedAt: 2026-11-26
---

## 試験の特徴

## 学習の進め方

## 本番のコツ
```

## resources/<group>.yaml

```yaml
title: 統計学
items:
  - title: 統計検定 公式サイト
    url: https://www.toukei-kentei.jp/
    publisher: 統計質保証推進協会
    lang: ja # ja | en
    kind: official # official | textbook | article | video | course | tool | pastExam | community
    cost: free # free | paid | partial
    exams: [toukei-2, toukei-jun1]
    description: 試験概要・出題範囲表・サンプル問題。
```

URL は実在を確認したものだけを載せる。書籍は出版社の書籍ページへリンクする。

## mocks/<mock-id>.yaml

```yaml
exam: toukei-2
title: 実力診断テスト（20問）
description: 全分野からランダムに出題します。
durationMin: 50
passingRate: 0.6
order: 10
blueprint: # 毎回ランダムに抽出
  - topics: [descriptive, probability]
    count: 6
  - count: 14 # topics 省略 = 全分野
```

`blueprint` の代わりに `questions: [toukei-2/o-001, ...]` で固定セットにもできる。

## formulas/<exam-id>.yaml

資格ごとの公式集。ファイルがある資格にだけ「公式集」タブが表示され、印刷すると A4 2段組の一覧になる。
ファイル名は資格 ID と同じにする。

```yaml
exam: toukei-2
title: 統計検定2級 公式集
intro: 試験でよく使う公式を分野別にまとめました。記号は本文の定義に従います。
updatedAt: 2026-11-26
sections:
  - title: 記述統計
    topics: [descriptive] # その資格の topic id（演習へのリンクになる）
    items:
      - name: 標本平均
        tex: '\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i' # $ なし、ディスプレイ数式として表示
        note: 外れ値の影響を受けやすい。 # 任意。Markdown（インライン数式可）
        term: mean # 任意。用語集の slug（存在するものだけ）
```

- 1 項目に 1 つの式。条件（「$n$ が十分大きいとき」など）と、取り違えやすい点は `note` に書く。
- 公式の羅列ではなく、本番で実際に使う形（検定統計量・信頼区間・期待値の公式など）を優先する。
- `pnpm validate --exam <exam-id>` で KaTeX と用語集の参照も検査される。

## exams/<exam-id>.yaml の補助項目

| 項目              | 内容                                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------------------- |
| `tools: [tables]` | 演習・模擬試験・問題ページに「付表」ボタンを出す（統計系）                                                    |
| `notice`          | 資格のすべてのページの先頭に表示する注意書き（Markdown）。制度の廃止・改定など                                |
| `tier`            | 資格ロードマップでの段（1 入門〜4 上級）                                                                      |
| `pathways`        | ロードマップの線。`to`（資格 ID）、`kind`（`next` = 次のステップ / `related` = 範囲が重なる）、`note`（理由） |
