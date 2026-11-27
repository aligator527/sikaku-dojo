---
term: '平均二乗誤差'
reading: へいきんにじょうごさ
en: 'mean squared error'
aliases: ['MSE', 'RMSE', '二乗平均平方根誤差']
exams: [toukei-dse, jdla-e, toukei-jun1, toukei-1]
summary: '予測値（または推定量）と真の値の差の 2 乗の平均。回帰モデルの評価指標や推定量のよさの基準として使い、その平方根を RMSE という。'
related: [mean-absolute-error, bias-variance-tradeoff, unbiased-estimator, generalization-error, coefficient-of-determination]
formula: '\mathrm{MSE} = \frac{1}{n}\sum_{i=1}^{n}(y_i - \hat{y}_i)^2,\qquad \mathrm{RMSE} = \sqrt{\mathrm{MSE}}'
---
## 2 つの使われ方

### 予測の評価指標

テストデータ $n$ 件の実測値 $y_i$ と予測値 $\hat{y}_i$ について、上の式で計算します。RMSE は平方根をとって目的変数と同じ単位に戻したものです。誤差を 2 乗するので、大きな誤差（外れ値）に強く反応します。

### 推定量の平均二乗誤差

パラメータ $\theta$ の推定量 $\hat{\theta}$ については $E[(\hat{\theta} - \theta)^2]$ を平均二乗誤差といい、

$$E[(\hat{\theta} - \theta)^2] = V[\hat{\theta}] + \left(E[\hat{\theta}] - \theta\right)^2$$

と「分散 $+$ バイアスの 2 乗」に分かれます。不偏推定量では分散に一致します。少しバイアスを許して分散を大きく減らすと MSE が小さくなることがあり、リッジ回帰などの縮小推定の根拠になります。

## 計算例

5 件の予測誤差 $y_i - \hat{y}_i$ が $1, -2, 0, 3, -2$ のとき、$\mathrm{MSE} = (1 + 4 + 0 + 9 + 4)/5 = 3.6$、$\mathrm{RMSE} = \sqrt{3.6} \approx 1.90$ です。同じデータの MAE は $1.6$ で、RMSE $\geq$ MAE が常に成り立ちます。

## 性質

- 予測値を定数 $c$ にする場合、MSE を最小にする $c$ は平均値です（MAE なら中央値）。
- 線形回帰で最小二乗法が最小にするのは訓練データの MSE（残差平方和 $/n$）です。テストデータの MSE は汎化誤差の推定値です。
- 決定係数とは、同じデータで $R^2 = 1 - \mathrm{MSE}/(\text{目的変数の分散})$ の関係があります（分母をそろえた場合）。

## 試験での問われ方

統計検定データサイエンスエキスパートとE資格では、予測値の表から MSE・RMSE・MAE を計算して比べる問題、外れ値があるときの指標の違いが出ます。統計検定準1級・1級では、推定量の MSE を分散とバイアスに分解して比べる問題（例：分母を $n$ と $n - 1$ にした分散の推定量の比較）が典型です。

## よくある誤り

- RMSE を「誤差の絶対値の平均」と混同する。
- 不偏推定量の方が常に MSE が小さいと考える。
- 異なる単位・尺度の目的変数どうしで RMSE をそのまま比べる。
