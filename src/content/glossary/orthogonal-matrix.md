---
term: '直交行列'
reading: ちょっこうぎょうれつ
en: 'orthogonal matrix'
aliases: ['直交変換']
exams: [suken-1, jdla-e, toukei-dse, toukei-1, toukei-jun1]
summary: '転置行列が逆行列になる実正方行列（QᵀQ = I）。列ベクトルは正規直交基底をなし、表す変換は長さと角度を保つ回転や鏡映である。'
related: [real-symmetric-matrix, singular-value-decomposition, gram-schmidt-process, determinant]
formula: 'Q^{\top}Q = QQ^{\top} = I \iff Q^{-1} = Q^{\top}'
---
## 定義

実正方行列 $Q$ が $Q^{\top}Q = I$ を満たすとき**直交行列**といいます。$Q^{-1} = Q^{\top}$ なので $QQ^{\top} = I$ も成り立ちます。列ベクトル（行ベクトル）が互いに直交する単位ベクトル、つまり正規直交基底になっていることと同値です。直交行列で表される線形変換を**直交変換**といいます。

## 性質

- 内積・長さを保つ：$(Q\boldsymbol{x})^{\top}(Q\boldsymbol{y}) = \boldsymbol{x}^{\top}\boldsymbol{y}$、$\|Q\boldsymbol{x}\| = \|\boldsymbol{x}\|$
- $\det Q = \pm 1$。$+1$ なら回転、$-1$ なら鏡映を含む変換です。
- 固有値の絶対値は 1（実固有値なら $\pm 1$）
- 直交行列どうしの積、直交行列の逆行列（転置）も直交行列

2 次元の回転 $\begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix}$ は $\det = 1$、直線に関する鏡映 $\begin{pmatrix} \cos 2\theta & \sin 2\theta \\ \sin 2\theta & -\cos 2\theta \end{pmatrix}$ は $\det = -1$ です。単位ベクトル $\boldsymbol{v}$ に垂直な超平面に関する鏡映 $I - 2\boldsymbol{v}\boldsymbol{v}^{\top}$（ハウスホルダー変換）も直交行列で、QR 分解の計算に使われます。

## 使われる場面

- 実対称行列の対角化 $Q^{\top}AQ = \Lambda$（二次形式の標準形、主成分分析の回転）
- 特異値分解 $A = U\Sigma V^{\top}$ の $U, V$
- QR 分解 $A = QR$（グラム・シュミットの直交化の行列表現）
- 標準正規分布に従う独立な確率変数のベクトルは、直交変換しても同じ分布に従う（回転対称性）。正規標本の $\bar{X}$ と $S^2$ の独立性の証明にも使われます。

## 試験での問われ方

数検1級では、実対称行列を直交行列で対角化する計算、直交行列の固有値や行列式の性質の証明、回転・鏡映の表現行列を求める問題が出ます。統計検定データサイエンスエキスパートでは、特異値分解・主成分分析の性質（直交行列はノルムを変えない）として問われます。E資格のシラバス 2026 では、これらは前提知識（グレー網掛けで出題対象外）です。

## よくある誤り

- 列ベクトルが直交しているだけで直交行列とする。各列の長さが 1 であることも必要です。
- 直交行列の行列式は必ず 1 だと思う。$-1$ の場合（鏡映）もあります。
- 直交行列の固有値は $\pm 1$ に限ると考える。回転行列のように複素数の固有値 $e^{\pm i\theta}$ をもつことがあります。
