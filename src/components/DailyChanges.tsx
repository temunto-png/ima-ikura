import dailyData from '../data/daily.json'
import commentsData from '../data/comments.json'
import { formatValue } from '../lib/format'

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

function ChangeCard({ id, item, index }: { id: string; item: DailyItem; index: number }) {
  const isUp = item.direction === 'up'
  const arrow = isUp ? '↑' : '↓'
  const comment = (commentsData.comments as Record<string, string>)[id] ?? ''

  return (
    <div
      className={`animate-fade-in-up relative overflow-hidden rounded-xl delay-${(index + 1) * 100}`}
      style={{
        background: isUp
          ? 'linear-gradient(135deg, rgba(255,107,107,0.07) 0%, rgba(255,107,107,0.03) 100%)'
          : 'linear-gradient(135deg, rgba(0,184,148,0.07) 0%, rgba(0,184,148,0.03) 100%)',
        border: `1px solid ${isUp ? 'rgba(255,107,107,0.15)' : 'rgba(0,184,148,0.15)'}`,
      }}
    >
      {/* 左アクセントバー */}
      <div
        className="absolute inset-y-0 left-0 w-0.5 rounded-r-full"
        style={{
          background: isUp
            ? 'linear-gradient(180deg, #ff6b6b, rgba(255,107,107,0.3))'
            : 'linear-gradient(180deg, #00b894, rgba(0,184,148,0.3))',
        }}
      />

      <div className="pl-4 pr-4 pt-3 pb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-text">{item.label}</span>
          {item.diff_pct != null && (
            <span
              className="font-number text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                background: isUp ? 'rgba(255,107,107,0.12)' : 'rgba(0,184,148,0.12)',
                color: isUp ? '#ff6b6b' : '#00b894',
              }}
            >
              {arrow} {Math.abs(item.diff_pct).toFixed(1)}%
            </span>
          )}
        </div>

        {/* 前 → いま */}
        <div className="flex items-baseline gap-2">
          <span className="text-text-faint text-sm line-through font-number">
            {formatValue(item.previous, item.unit)}
          </span>
          <span className="text-text-faint text-xs">→</span>
          <span
            className="font-number text-2xl font-black leading-none"
            style={{ color: isUp ? '#ff6b6b' : '#00b894' }}
          >
            {formatValue(item.current, item.unit)}
          </span>
        </div>

        {/* AIコメント */}
        {comment && (
          <p className="text-text-muted text-[11px] mt-1.5">{comment}</p>
        )}
      </div>
    </div>
  )
}

export default function DailyChanges() {
  const items = dailyData.items as Record<string, DailyItem>

  return (
    <section className="mx-4 mt-6">
      <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">
        きのう → きょう
      </h2>
      <div className="space-y-2">
        {Object.entries(items).map(([id, item], i) => (
          <ChangeCard key={id} id={id} item={item} index={i} />
        ))}
      </div>
    </section>
  )
}
