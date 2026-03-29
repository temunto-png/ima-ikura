import { useState, useEffect, useRef } from 'react'
import cumulativeData from '../data/cumulative.json'

export default function CumulativeCounter() {
  const { base_amount, daily_increment } = cumulativeData
  const [amount, setAmount] = useState(base_amount)
  const [popping, setPopping] = useState(false)
  const prevAmount = useRef(base_amount)

  // 3秒ごとに微増アニメーション
  useEffect(() => {
    const interval = setInterval(() => {
      setAmount((prev) => prev + 1)
      setPopping(true)
      setTimeout(() => setPopping(false), 300)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const formatted = amount.toLocaleString('ja-JP')

  // 年間負担額（日次増分 × 365）
  const annualExtra = daily_increment * 365
  const annualFormatted = Math.round(annualExtra / 10000).toLocaleString('ja-JP')

  // 年初からの経過割合（進捗バー用）
  const now = new Date()
  const yearStart = new Date(now.getFullYear(), 0, 1)
  const yearEnd = new Date(now.getFullYear() + 1, 0, 1)
  const yearProgress = Math.min(
    ((now.getTime() - yearStart.getTime()) / (yearEnd.getTime() - yearStart.getTime())) * 100,
    100
  )

  return (
    <section className="animate-fade-in-up mx-4 mt-4">
      {/* メインカード */}
      <div
        className="relative overflow-hidden rounded-2xl p-5 text-white"
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1a1a 60%, #1a1a2d 100%)',
        }}
      >
        {/* 装飾：右上の大きな薄い¥ */}
        <span
          className="pointer-events-none absolute right-3 top-1 font-number font-black select-none"
          style={{
            fontSize: '7rem',
            lineHeight: 1,
            color: 'rgba(255,255,255,0.04)',
            letterSpacing: '-0.04em',
          }}
          aria-hidden
        >
          ¥
        </span>

        <p className="relative text-xs mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
          今年あなたが去年より多く払った額（推計）
        </p>

        {/* 金額 */}
        <div className="relative flex items-baseline gap-1 my-1">
          <span
            className={`font-number font-black tracking-tight tabular-nums leading-none ${popping ? 'animate-number-pop' : ''}`}
            style={{ fontSize: '2.75rem', color: '#fff' }}
          >
            ¥{formatted}
          </span>
        </div>

        {/* 年間総額の補足 */}
        <p className="relative text-xs mt-1 mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
          このペースで行くと今年は約<span className="font-number font-bold text-white/70">{annualFormatted}万円</span>の追加負担
        </p>

        {/* 進捗バー */}
        <div className="relative">
          <div className="flex justify-between text-[10px] mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <span>1月</span>
            <span>{now.getMonth() + 1}月</span>
            <span>12月</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${yearProgress}%`,
                background: 'linear-gradient(90deg, #ff6b6b, #f0932b)',
              }}
            />
          </div>
        </div>

        {/* 出典 */}
        <p className="relative mt-3 text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
          ※ 総務省 消費者物価指数（前年比+{cumulativeData.source_cpi_yoy_pct}%）をもとに算出。
          1世帯あたりの年間支出から日割りで計算しています。
        </p>
      </div>
    </section>
  )
}
