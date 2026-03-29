import commentsData from '../data/comments.json'
import { formatValue } from '../lib/format'

type Props = {
  id: string
  label: string
  current: number | string
  previous: number | string
  unit: string
  diffPct: number | null
  direction: 'up' | 'down'
  /** 金額換算テキスト（例: 「ランチ19,000回分」） */
  equivalent?: string
  /** アフィリエイト系 */
  ctaText?: string
  ctaUrl?: string
  isPR?: boolean
  accentColor?: string
}

export default function StoryCard({
  id,
  label,
  current,
  previous,
  unit,
  diffPct,
  direction,
  equivalent,
  ctaText,
  ctaUrl,
  isPR = false,
  accentColor = 'red',
}: Props) {
  const isUp = direction === 'up'
  const arrow = isUp ? '↑' : '↓'
  const colorMap: Record<string, string> = {
    red: 'text-red',
    orange: 'text-orange',
    purple: 'text-purple',
    pink: 'text-pink',
    blue: 'text-blue',
    green: 'text-green',
  }
  const badgeBgMap: Record<string, string> = {
    red: 'bg-red/10 text-red',
    orange: 'bg-orange/10 text-orange',
    purple: 'bg-purple/10 text-purple',
    pink: 'bg-pink/10 text-pink',
    blue: 'bg-blue/10 text-blue',
    green: 'bg-green/10 text-green',
  }
  const textColor = colorMap[accentColor] ?? 'text-red'
  const badgeColor = badgeBgMap[accentColor] ?? 'bg-red/10 text-red'
  const comment = (commentsData.comments as Record<string, string>)[id] ?? ''

  return (
    <section className="mx-4 mt-6 bg-white rounded-2xl p-5 shadow-sm border border-border">
      {/* PR表記 */}
      {isPR && (
        <span className="text-[10px] text-text-faint border border-text-faint/30 rounded px-1.5 py-0.5 mb-2 inline-block">
          PR
        </span>
      )}

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold">{label}</h3>
        {diffPct != null && (
          <span className={`font-number text-xs font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
            {arrow} {Math.abs(diffPct).toFixed(1)}%
          </span>
        )}
      </div>

      {/* 前 → いま */}
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-text-muted line-through font-number text-base">
          {formatValue(previous, unit)}
        </span>
        <span className="text-text-faint">→</span>
        <span className={`font-number text-2xl font-bold ${textColor}`}>
          {formatValue(current, unit)}
        </span>
      </div>

      {/* 金額換算 */}
      {equivalent && (
        <p className="text-text-muted text-xs mb-2">
          💰 {equivalent}
        </p>
      )}

      {/* AIコメント */}
      {comment && (
        <p className="text-text-muted text-[11px] mb-3">{comment}</p>
      )}

      {/* CTA */}
      {ctaText && ctaUrl && (
        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className={`block w-full text-center text-white text-sm font-bold py-3 rounded-xl transition-opacity hover:opacity-90`}
          style={{
            background: `linear-gradient(135deg, var(--color-${accentColor}), var(--color-${accentColor === 'red' ? 'orange' : accentColor}))`,
          }}
        >
          {ctaText} →
        </a>
      )}
    </section>
  )
}
