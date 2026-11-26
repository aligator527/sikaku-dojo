---
term: 特異値分解
reading: とくいちぶんかい
en: singular value decomposition
aliases: [SVD, 特異値, 特異ベクトル]
exams: [jdla-e]
summary: 任意の m×n 行列を、直交行列・非負の対角行列・直交行列の積 A = UΣVᵀ に分解すること。Σ の対角成分を特異値という。
related: [eigenvalue, positive-definite-matrix]
formula: 'A = U \Sigma V^{\mathsf T},\quad U^{\mathsf T}U = I_m,\ V^{\mathsf T}V = I_n,\ \Sigma = \operatorname{diag}(\sigma_1, \ldots, \sigma_r, 0, \ldots)'
---
## 定義

任意の実 $m \times n$ 行列 $A$ は、$m$ 次直交行列 $U$、$n$ 次直交行列 $V$、対角成分が非負で降順の $m \times n$ 行列 $\Sigma$ を用いて $A = U\Sigma V^{\mathsf T}$ と分解できます。$\sigma_1 \ge \sigma_2 \ge \cdots \ge 0$ を**特異値**、$U$ の列を左特異ベクトル、$V$ の列を右特異ベクトルといいます。

## 固有値分解との関係

$A^{\mathsf T}A = V\Sigma^{\mathsf T}\Sigma V^{\mathsf T}$、$AA^{\mathsf T} = U\Sigma\Sigma^{\mathsf T}U^{\mathsf T}$ なので、特異値は $A^{\mathsf T}A$（半正定値対称行列）の固有値の非負の平方根、右特異ベクトルはその固有ベクトルです。固有値分解は正方行列にしか使えませんが、特異値分解は長方行列にも使えます。0 でない特異値の個数は $A$ のランクに等しくなります。

## 応用

- **低ランク近似**：上位 $k$ 個の特異値だけを残した $A_k = \sum_{i=1}^k \sigma_i\boldsymbol u_i\boldsymbol v_i^{\mathsf T}$ は、フロベニウスノルムの意味で最良のランク $k$ 近似（エッカート・ヤングの定理）。画像圧縮やモデル軽量化に使われます。
- **主成分分析**：中心化したデータ行列の右特異ベクトルが主成分の方向になります。
- **潜在的意味インデキシング（LSI）**：単語文書行列を特異値分解して、意味的な次元を取り出します。

## 試験での問われ方

E資格では、固有値分解と特異値分解の関係、特異値と $A^{\mathsf T}A$ の固有値の関係、低ランク近似や主成分分析との対応が問われます。

## よくある誤り

- 特異値は $A^{\mathsf T}A$ の固有値そのものではなく、その**平方根**。
- 特異値は常に非負。負の固有値を持つ対称行列でも、特異値は固有値の絶対値になる。
