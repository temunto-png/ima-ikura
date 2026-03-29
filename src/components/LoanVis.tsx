/**
 * 住宅ローン比較ボックス
 * 金利差による返済額の違いを可視化
 */
type Props = {
  loanAmount?: number
  yearsAgoRate?: number
  currentRate?: number
  loanYears?: number
}

export default function LoanVis({
  loanAmount = 35000000,
  yearsAgoRate = 0.5,
  currentRate = 1.85,
  loanYears = 35,
}: Props) {
  // 月々返済額を計算（元利均等返済）
  const calcMonthly = (principal: number, annualRate: number, years: number) => {
    const monthlyRate = annualRate / 100 / 12
    const n = years * 12
    if (monthlyRate === 0) return principal / n
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) /
      (Math.pow(1 + monthlyRate, n) - 1)
  }

  const monthlyBefore = Math.round(calcMonthly(loanAmount, yearsAgoRate, loanYears))
  const monthlyNow = Math.round(calcMonthly(loanAmount, currentRate, loanYears))
  const monthlyDiff = monthlyNow - monthlyBefore
  const totalDiff = monthlyDiff * loanYears * 12

  return (
    <div className="bg-white rounded-2xl p-5 border border-border">
      <h3 className="text-sm font-bold mb-4">
        住宅ローン {(loanAmount / 10000).toLocaleString()}万円・{loanYears}年の場合
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {/* 以前の金利 */}
        <div className="bg-bg rounded-xl p-4">
          <p className="text-[11px] text-text-muted mb-1">去年の金利 {yearsAgoRate}%</p>
          <p className="font-number text-lg font-bold text-text">
            月{monthlyBefore.toLocaleString()}円
          </p>
        </div>

        {/* いまの金利 */}
        <div className="bg-pink/5 rounded-xl p-4 border border-pink/20">
          <p className="text-[11px] text-pink font-bold mb-1">いま {currentRate}%</p>
          <p className="font-number text-lg font-bold text-pink">
            月{monthlyNow.toLocaleString()}円
          </p>
        </div>
      </div>

      <div className="mt-3 bg-red/5 rounded-lg px-3 py-2">
        <p className="text-xs text-text">
          📈 月々 <span className="font-number font-bold text-red">+{monthlyDiff.toLocaleString()}円</span>
          <span className="text-text-muted">
            、{loanYears}年で<span className="font-number font-bold text-red">約{Math.round(totalDiff / 10000).toLocaleString()}万円</span>の差
          </span>
        </p>
      </div>

      <p className="text-[10px] text-text-faint mt-2">
        ※ 元利均等返済・ボーナス払いなしで試算。実際の返済額は条件により異なります。
      </p>
    </div>
  )
}
