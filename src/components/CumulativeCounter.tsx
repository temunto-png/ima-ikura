import { useState, useEffect } from 'react'
import cumulativeData from '../data/cumulative.json'

export default function CumulativeCounter() {
  // base_amount は GitHub Actions 実行時点（当日 06:00 JST）の年初来累計額
  // クライアントでは base_amount をそのまま初期値として使用する
  // （daily_increment * daysPassed を再計算すると二重カウントになるため）
  const { base_amount } = cumulativeData

  const [amount, setAmount] = useState(base_amount)

  // 3秒ごとに微増アニメーション（演出用: 視覚的に数字が動いて見えるように1円ずつ加算）
  useEffect(() => {
    const interval = setInterval(() => {
      setAmount((prev) => prev + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const formatted = amount.toLocaleString('ja-JP')

  return (
    <section className="bg-text text-white rounded-2xl mx-4 mt-4 p-5">
      <p className="text-text-faint text-xs mb-1">
        今年あなたが去年より多く払った額（推計）
      </p>
      <div className="flex items-baseline gap-1">
        <span className="font-number text-4xl font-bold tracking-tight tabular-nums">
          ¥{formatted}
        </span>
      </div>
      <p className="text-text-faint text-[11px] mt-2">
        ※ 総務省 消費者物価指数（前年比+{cumulativeData.source_cpi_yoy_pct}%）をもとに算出。
        1世帯あたりの年間支出から日割りで計算しています。
      </p>
    </section>
  )
}
