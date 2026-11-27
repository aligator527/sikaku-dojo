---
term: 'Docker'
reading: どっかー
en: 'Docker'
aliases: ['Dockerfile', 'Docker イメージ', 'Dockerイメージ', 'Docker コンテナ', 'Dockerコンテナ']
exams: [jdla-e, shindanshi]
summary: 'アプリケーションと、その実行に必要なライブラリや設定をまとめたイメージを作り、ホスト OS のカーネルを共有する軽量なコンテナとして動かすためのソフトウェア。'
related: [virtualization, gpu]
---
## 基本の用語

- **イメージ**：OS のユーザー空間、ライブラリ、アプリケーション、設定をまとめた読み取り専用のひな形。複数の層（レイヤ）を重ねた構造です。
- **コンテナ**：イメージから起動した実行中の環境。同じイメージから何個でも同じ環境を作れます。
- **Dockerfile**：イメージの作り方を書いたテキスト。`docker build` でイメージを作ります。
- **レジストリ**：イメージを保存・共有する場所（Docker Hub など）。

## Dockerfile の例

```dockerfile
FROM nvidia/cuda:12.4.1-cudnn-runtime-ubuntu22.04
RUN apt-get update && apt-get install -y python3-pip
COPY requirements.txt /app/
RUN pip install -r /app/requirements.txt
COPY . /app
WORKDIR /app
CMD ["python3", "train.py"]
```

`FROM` で土台のイメージ（ここでは CUDA と cuDNN の入った Ubuntu）を指定し、`RUN` でライブラリを入れ、`COPY` でファイルをイメージに取り込み、`CMD` でコンテナの起動時に実行するコマンドを決めています。

`RUN` や `COPY` などの命令ごとにレイヤが作られ、変更のない命令のレイヤはキャッシュが再利用されます。変更の少ない `requirements.txt` のインストールを先に、頻繁に変わるソースコードのコピーを後に書くと、作り直しが速くなります。`RUN` はイメージを作るときに、`CMD` はコンテナを起動するときに実行されます。

## 仮想マシンとの違い

仮想マシンはハイパーバイザの上でゲスト OS ごと動かしますが、Docker のコンテナはゲスト OS を起動せず、ホスト OS のカーネルを共有します。そのため軽量で起動が速い一方、ホストと異なるカーネルを必要とする環境は動かせず、分離の強さは仮想マシンに劣ります。

## 深層学習での利点と GPU の利用

- ライブラリのバージョン（CUDA、cuDNN、PyTorch など）を固定した環境を、開発用の PC・学習用のサーバ・本番環境で同じように再現できます。
- コンテナから GPU を使うには、ホストに GPU のドライバと NVIDIA Container Toolkit を入れ、`docker run --gpus all …` のように起動します。GPU ドライバはホスト側のものを使い、CUDA のライブラリはイメージに含めるのが一般的です。
- 学習したモデルを推論サーバとしてコンテナで配布すれば、環境の違いによる不具合を減らせます。

## 試験での問われ方

E資格（シラバス 2026 の環境構築：コンテナ型仮想化、Docker、Dockerfile）では、仮想マシンとコンテナの違い（カーネルの共有）、Dockerfile の各命令の意味と実行されるタイミング、レイヤとキャッシュ、GPU を使うための設定が出題されます。

## よくある誤り

- コンテナごとにゲスト OS が起動すると考える。
- `RUN` と `CMD` の実行タイミングを取り違える。
- コンテナの中に GPU ドライバ一式を入れればホストのドライバは不要だと考える。
