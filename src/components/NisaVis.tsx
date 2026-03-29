/**
 * NISA比較ボックス
 * NISAやっている人 vs やっていない人の差を可視化
 */
type Props = {
  monthlyAmount?: number
  years?: number
  annualReturn?: number
}

export default function NisaVis({
  monthlyAmount = 30000,
  years = 5,
  annualReturn = 0.05,
}: Props) {
  // 積立計算（複利）
  const months = years * 12
  const monthlyRate = annualReturn / 12
  let nisaTotal = 0
  for (let i = 0; i < months; i++) {
    nisaTotal = (nisaTotal + monthlyAmount) * (1 + monthlyRate)
  }
  nisaTotal = Math.round(nisaTotal)
  const depositTotal = monthlyAmount * months
  const profit = nisaTotal - depositTotal

  // 貯金だけの場合（利息ほぼゼロ）
  const savingsTotal = depositTotal

  const diff = nisaTotal - savingsTotal

  return (
    <div className="bg-white rounded-2xl p-5 border border-border">
      <h3 className="text-sm font-bold mb-4">
        月{(monthlyAmount / 10000).toFixed(0)}万円を{years}年続けたら
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {/* 貯金だけ */}
        <div className="bg-bg rounded-xl p-4 text-center">
          <p className="text-[11px] text-text-muted mb-1">貯金だけ</p>
          <p className="font-number text-xl font-bold text-text">
            {(savingsTotal / 10000).toFixed(0)}万円
          </p>
          <p className="text-[10px] text-text-faint mt-1">利益 0円</p>
        </div>

        {/* NISA */}
        <div className="bg-blue/5 rounded-xl p-4 text-center border border-blue/20">
          <p className="text-[11px] text-blue font-bold mb-1">NISA</p>
          <p className="font-number text-xl font-bold text-blue">
            {(nisaTotal / 10000).toFixed(0)}万円
          </p>
          <p className="text-[10px] text-green mt-1">
            +{(profit / 10000).toFixed(0)}万円の利益
          </p>
        </div>
      </div>

      <div className="mt-3 bg-yellow/10 rounded-lg px-3 py-2">
        <p className="text-xs text-text">
          💰 差額 <span className="font-number font-bold">{(diff / 10000).toFixed(0)}万円</span>
          <span className="text-text-muted">
            （{years}年で旅行{Math.floor(diff / 50000)}回分）
          </span>
        </p>
      </div>

      <p className="text-[10px] text-text-faint mt-2">
        ※ 年利{(annualReturn * 100).toFixed(0)}%で試算。運用益は非課税（NISA枠内）。元本保証なし。
      </p>
    </div>
  )
}
