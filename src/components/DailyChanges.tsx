import dailyData from '../data/daily.json'
import commentsData from '../data/comments.json'

type DailyItem = {
  current: number
  previous: number
  diff: number
  diff_pct: number | null
  direction: 'up' | 'down'
  label: string
  unit: string
  year_start?: number
}

function formatNumber(n: number): string {
  if (Math.abs(n) >= 10000) {
    return (n / 10000).toFixed(1) + '万'
  }
  return n.toLocaleString('ja-JP', { maximumFractionDigits: 1 })
}

function ChangeCard({ id, item }: { id: string; item: DailyItem }) {
  const isUp = item.direction === 'up'
  const arrow = isUp ? '↑' : '↓'
  const colorClass = isUp ? 'text-red' : 'text-green'
  const bgClass = isUp ? 'bg-red/5' : 'bg-green/5'
  const comment = (commentsData.comments as Record<string, string>)[id] ?? ''

  return (
    <div className={`rounded-xl p-4 ${bgClass}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold">{item.label}</span>
        {item.diff_pct != null && (
          <span className={`font-number text-xs font-bold px-2 py-0.5 rounded-full ${isUp ? 'bg-red/10 text-red' : 'bg-green/10 text-green'}`}>
            {arrow} {Math.abs(item.diff_pct).toFixed(1)}%
          </span>
        )}
      </div>

      {/* 前 → いま */}
      <div className="flex items-baseline gap-2">
        <span className="text-text-muted text-sm line-through font-number">
          {formatNumber(item.previous)}{item.unit}
        </span>
        <span className="text-text-faint text-xs">→</span>
        <span className={`font-number text-xl font-bold ${colorClass}`}>
          {formatNumber(item.current)}{item.unit}
        </span>
      </div>

      {/* AIコメント */}
      {comment && (
        <p className="text-text-muted text-[11px] mt-2">{comment}</p>
      )}
    </div>
  )
}

export default function DailyChanges() {
  const items = dailyData.items as Record<string, DailyItem>

  return (
    <section className="mx-4 mt-6">
      <h2 className="text-sm font-bold text-text mb-3">
        📊 きのう → きょう
      </h2>
      <div className="space-y-3">
        {Object.entries(items).map(([id, item]) => (
          <ChangeCard key={id} id={id} item={item} />
        ))}
      </div>
    </section>
  )
}
