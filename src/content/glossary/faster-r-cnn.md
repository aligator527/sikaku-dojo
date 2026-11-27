---
term: 'Faster R-CNN'
reading: ふぁすたーあーるしーえぬえぬ
en: 'Faster R-CNN'
aliases: ['RoI Pooling', 'ROI Pooling']
exams: [jdla-e]
summary: '候補領域の生成を Region Proposal Network（RPN）で行い、候補ごとに特徴を切り出して分類と位置の補正をする 2 ステージの物体検出手法。R-CNN、Fast R-CNN を発展させたもの。'
related: [rpn, object-detection, mask-r-cnn, iou, nms]
formula: 'x = x_a + t_x w_a,\quad y = y_a + t_y h_a,\quad w = w_a e^{t_w},\quad h = h_a e^{t_h}'
---
## R-CNN 系列の発展

| 手法 | 候補領域 | 特徴の計算 | 分類・位置補正 |
| --- | --- | --- | --- |
| R-CNN（2014） | Selective Search（約 2000 個） | 候補ごとに画像を切り出して CNN に通す | SVM と回帰 |
| Fast R-CNN（2015） | Selective Search | 画像全体を CNN に 1 回通し、RoI Pooling で候補の特徴を切り出す | ソフトマックスと回帰を 1 つのネットワークで同時に学習 |
| Faster R-CNN（2015） | RPN（CNN で予測） | Fast R-CNN と同じで、特徴マップを RPN と共有 | 同上 |

R-CNN は候補ごとに CNN を計算するので非常に遅く、Fast R-CNN で特徴の計算を共有し、Faster R-CNN で候補領域の生成もニューラルネットワークにして、全体を end-to-end に学習できるようにしました。

## 処理の流れ

1. バックボーン（VGG、ResNet など）で画像全体の特徴マップを作る。
2. RPN が特徴マップの各位置のアンカーについて「物体らしさ」と位置のずれを予測し、候補領域（RoI）を出す。NMS で数百個程度に絞る。
3. 各 RoI に対応する特徴マップの領域を RoI Pooling で固定サイズ（例：$7\times7$）に切り出す。
4. 全結合層で、クラス（背景を含む）の分類と、ボックスの位置・大きさの補正を行う。

## ボックスの表し方

ボックスは基準となる箱（アンカーや候補領域）からのオフセット $t_x = (x - x_a)/w_a$、$t_y = (y - y_a)/h_a$、$t_w = \log(w/w_a)$、$t_h = \log(h/h_a)$ で予測します。幅・高さを対数で表すので、予測値を指数関数で戻すと必ず正になり、大きさの比率として扱えます。たとえばアンカー $(x_a, y_a, w_a, h_a) = (50, 50, 100, 50)$ に $(t_x, t_y, t_w, t_h) = (0.1,\ 0.2,\ \log 1.5,\ \log 2)$ なら、予測は $(60, 60, 150, 100)$ です。

## RoI Pooling の問題点

RoI の座標を特徴マップの格子に丸め、さらに分割した区画の境界も丸めるので、元の画像上の位置と少しずれます。分類にはあまり影響しませんが、画素単位の正確さが必要なマスク予測では問題になり、Mask R-CNN では丸めをしない RoI Align に置き換えられました。

## 試験での問われ方

E資格（シラバス 2026：Faster R-CNN、Bounding Box、ROI、2 ステージ検出、Selective Search、Fast R-CNN、RPN、ROI Pooling）では、R-CNN から Faster R-CNN への改良点、オフセットからボックスを復元する計算、RoI Pooling の役割と問題点が出題されます。

## よくある誤り

- Faster R-CNN も Selective Search で候補を出すと考える（RPN に置き換えた）。
- 幅・高さのオフセットを差（$w - w_a$）で表すと考える（比の対数）。
- Faster R-CNN を 1 ステージ検出器に分類する。
