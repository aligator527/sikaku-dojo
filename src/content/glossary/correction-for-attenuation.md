---
term: '希薄化の修正'
reading: きはくかのしゅうせい
en: 'correction for attenuation'
aliases: ['希薄化の修正公式', '相関の希薄化']
exams: [toukei-1]
summary: '測定誤差によって弱められた（希薄化した）2 つの変数の相関係数を、それぞれの信頼性係数で割って、真の得点どうしの相関を推定する方法。'
related: [reliability-coefficient, classical-test-theory, attenuation-bias, correlation-coefficient]
formula: '\hat{\rho}_{T_X T_Y} = \frac{r_{XY}}{\sqrt{\rho_{XX^{\prime}}\,\rho_{YY^{\prime}}}}'
---
## 定義

古典的テスト理論で $X = T_X + E_X$、$Y = T_Y + E_Y$ とし、誤差は真の得点とも互いにも無相関とします。すると $\mathrm{Cov}(X, Y) = \mathrm{Cov}(T_X, T_Y)$ なので

$$\mathrm{Corr}(X, Y) = \frac{\mathrm{Cov}(T_X, T_Y)}{\sigma_X\sigma_Y} = \mathrm{Corr}(T_X, T_Y)\cdot\frac{\sigma_{T_X}}{\sigma_X}\cdot\frac{\sigma_{T_Y}}{\sigma_Y} = \mathrm{Corr}(T_X, T_Y)\sqrt{\rho_{XX'}\rho_{YY'}}$$

となります。観測された相関は、真の相関に信頼性係数の幾何平均を掛けた分だけ小さくなります（相関の希薄化）。これを逆に解いたのが上の修正公式です。

## 性質

- $|\mathrm{Corr}(T_X, T_Y)| \leq 1$ より、観測される相関には上限 $|r_{XY}| \leq \sqrt{\rho_{XX'}\rho_{YY'}}$ があります。妥当性係数（基準との相関）が信頼性で頭打ちになる理由です。
- 一方だけ（例えば基準 $Y$ だけ）を修正することもあり、そのときは $r_{XY}/\sqrt{\rho_{YY'}}$ です。
- 信頼性係数を過小に推定すると（$\alpha$ 係数は下限なので起こりうる）、修正後の相関が過大になり、1 を超えることもあります。
- 回帰分析での同じ現象が、説明変数の測定誤差による減衰バイアスです。

## 計算例

学力テストと教師の評定の相関が $r_{XY} = 0.40$、信頼性係数がそれぞれ $0.80$ と $0.50$ なら

$$\hat{\rho}_{T_XT_Y} = \frac{0.40}{\sqrt{0.80 \times 0.50}} = \frac{0.40}{0.632} \approx 0.63$$

です。真の得点どうしでは、観測値よりかなり強い関連があると推定されます。

## 試験での問われ方

統計検定1級（人文科学）では、上の関係式の導出と、相関係数と 2 つの信頼性係数から真の得点の相関を求める計算問題が典型です。社会科学の測定誤差（減衰バイアス）の問題と同じ構造なので、両方を結びつけて理解しておくとよいでしょう。

## よくある誤り

- 信頼性係数の平方根を取らずに、$r_{XY}/(\rho_{XX'}\rho_{YY'})$ とする。
- 修正した相関を、実際に観測される得点どうしの予測の精度として使う（予測に使えるのは観測得点の相関です）。
- 修正後の値が 1 を超えたのを、そのまま報告する（信頼性の推定に問題がある兆候です）。
