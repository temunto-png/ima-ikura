/**
 * おにぎり比較ビジュアライゼーション
 * 手取りの実質価値を「おにぎり何個買えるか」で表現
 */
type Props = {
  yearBefore: number
  yearNow: number
  itemName?: string
  itemPrice?: number
}

export default function SalaryVis({
  yearBefore = 380,
  yearNow = 350,
  itemName = 'おにぎり',
  itemPrice = 150,
}: Props) {
  const countBefore = Math.floor((yearBefore * 10000) / itemPrice)
  const countNow = Math.floor((yearNow * 10000) / itemPrice)
  const diff = countBefore - countNow

  const renderOnigiri = (count: number, max: number) => {
    const display = Math.min(count, max)
    return Array.from({ length: display }, (_, i) => (
      <span key={i} className="text-sm">🍙</span>
    ))
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-border">
      <h3 className="text-sm font-bold mb-4">
        同じ月給で買える{itemName}の数
      </h3>

      <div className="space-y-4">
        {/* 3年前 */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-muted">3年前</span>
            <span className="font-number text-sm font-bold">{countBefore.toLocaleString()}個</span>
          </div>
          <div className="flex flex-wrap gap-0.5">
            {renderOnigiri(countBefore, 20)}
          </div>
        </div>

        {/* いま */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-muted">いま</span>
            <span className="font-number text-sm font-bold text-red">{countNow.toLocaleString()}個</span>
          </div>
          <div className="flex flex-wrap gap-0.5">
            {renderOnigiri(countNow, 20)}
          </div>
        </div>
      </div>

      <p className="text-text-muted text-[11px] mt-3 border-t border-border pt-3">
        💡 {itemName}{itemPrice}円で計算。{diff > 0 ? `${diff}個分（約${(diff * itemPrice).toLocaleString()}円）少なくなった` : '変わりなし'}
      </p>
    </div>
  )
}
