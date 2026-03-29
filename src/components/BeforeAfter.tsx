import { formatValue } from '../lib/format'

type Props = {
  label: string
  before: number | string
  after: number | string
  unit: string
  diffPct?: number | null
  direction?: 'up' | 'down'
  accentColor?: string
}

export default function BeforeAfter({
  label,
  before,
  after,
  unit,
  diffPct,
  direction = 'up',
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
  const textColor = colorMap[accentColor] ?? 'text-red'

  return (
    <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-border">
      <span className="text-sm font-bold truncate mr-3">{label}</span>
      <div className="flex items-baseline gap-2 shrink-0">
        <span className="text-text-muted text-sm line-through font-number">
          {formatValue(before, unit)}
        </span>
        <span className="text-text-faint text-xs">→</span>
        <span className={`font-number text-lg font-bold ${textColor}`}>
          {formatValue(after, unit)}
        </span>
        {diffPct != null && (
          <span className={`font-number text-[11px] font-bold ${textColor}`}>
            {arrow}{Math.abs(diffPct).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  )
}
