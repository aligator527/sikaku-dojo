---
term: '勾配クリッピング'
reading: こうばいくりっぴんぐ
en: 'gradient clipping'
aliases: ['勾配のクリッピング', 'Gradient Clipping']
exams: [jdla-e]
summary: '勾配のノルムが閾値を超えたとき、向きを保ったまま大きさを閾値まで縮める操作。主に RNN の勾配爆発による学習の発散を防ぐ。'
related: [vanishing-gradient, rnn, lstm, bptt]
formula: '\boldsymbol g \leftarrow \begin{cases} \dfrac{c}{\|\boldsymbol g\|}\,\boldsymbol g & (\|\boldsymbol g\| > c) \\ \boldsymbol g & (\|\boldsymbol g\| \le c) \end{cases}'
---
## 方法

**ノルムによるクリッピング**（標準的な方法）：全パラメータの勾配をまとめた 1 本のベクトル $\boldsymbol g$ の L2 ノルムを計算し、閾値 $c$ を超えていれば $\boldsymbol g \leftarrow \dfrac{c}{\|\boldsymbol g\|}\boldsymbol g$ と縮めます。向きは変わらず、ノルムがちょうど $c$ になります。

**値によるクリッピング**：勾配の各要素を $[-c, c]$ の範囲に切り詰めます。簡単ですが、要素ごとに縮め方が違うので勾配の向きが変わってしまいます。

## 計算例

$\boldsymbol g = (6, 8)$、閾値 $c = 5$ のとき、$\|\boldsymbol g\| = 10 > 5$ なので

$$\boldsymbol g \leftarrow \frac{5}{10}(6, 8) = (3, 4)$$

です。値によるクリッピングでは $(5, 5)$ となり、向きが $(6, 8)$ と変わります。

## なぜ必要か

RNN の BPTT では、時刻を遡るたびに同じ重み行列（のヤコビ行列）が掛かるので、その大きさが 1 を超えると勾配が指数的に大きくなります（勾配爆発）。損失の地形に崖のような急な部分があると、1 回の更新でパラメータが遠くに飛ばされて学習が崩れます。クリッピングで 1 回の更新量に上限を設けると、これを防げます。Transformer の学習でも、安定化のために勾配ノルムを 1.0 などで切ることがよくあります。

## 実装

PyTorch では、`loss.backward()` で勾配を計算した後、`optimizer.step()` の前に

```python
torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
```

を呼びます。混合精度学習で損失スケーリングを使う場合は、スケールを戻してからクリッピングします。

## 試験での問われ方

E資格では、ノルムによるクリッピングの計算、値によるクリッピングとの違い、勾配爆発と勾配消失のどちらへの対策か、実装の呼び出し順序が出題されます。

## よくある誤り

- 勾配クリッピングが勾配消失にも効くと考える（効くのは勾配爆発。勾配消失には LSTM・GRU や残差接続などで対処）。
- L2 ノルムではなく L1 ノルムやノルムの 2 乗で割る。
- パラメータ（重み）そのものを切り詰める操作と混同する。
- `optimizer.step()` の後にクリッピングして効果がない実装にする。
