import commentsData from '../data/comments.json'
import { formatValue, accentTextClass, accentBadgeClass } from '../lib/format'

type Props = {
  id: string
  label: string
  current: number | string
  previous: number | string
  unit: string
  diffPct: number | null
  direction: 'up' | 'down'
  equivalent?: string
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
  const textColor = accentTextClass(accentColor)
  const badgeColor = accentBadgeClass(accentColor)
  const comment = (commentsData.comments as Record<string, string>)[id] ?? ''

  // CSS変数からカラー値を取得するためのマッピング
  const colorVarMap: Record<string, string> = {
    red: 'rgba(255,107,107,',
    orange: 'rgba(240,147,43,',
    purple: 'rgba(108,92,231,',
    pink: 'rgba(232,67,147,',
    blue: 'rgba(9,132,227,',
    green: 'rgba(0,184,148,',
  }
  const baseRgba = colorVarMap[accentColor] ?? colorVarMap.red

  return (
    <section
      className="animate-fade-in-up mx-4 mt-6 bg-white rounded-2xl overflow-hidden shadow-sm"
      style={{ border: `1px solid ${baseRgba}0.12)` }}
    >
      {/* アクセントカラートップバー */}
      <div
        className="h-0.5 w-full"
        style={{
          background: `linear-gradient(90deg, var(--color-${accentColor}), ${baseRgba}0.3))`,
        }}
      />

      <div className="p-5">
        {/* PR表記 + ラベル行 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isPR && (
              <span className="text-[9px] font-bold text-text-faint border border-text-faint/20 rounded px-1 py-0.5 leading-none">
                PR
              </span>
            )}
            <h3 className="text-sm font-bold">{label}</h3>
          </div>
          {diffPct != null && diffPct !== 0 && (
            <span className={`font-number text-xs font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
              {arrow} {Math.abs(diffPct).toFixed(1)}%
            </span>
          )}
        </div>

        {/* 前 → いま */}
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-text-faint line-through font-number text-sm">
            {formatValue(previous, unit)}
          </span>
          <span className="text-text-faint text-xs">→</span>
          <span className={`font-number text-2xl font-black leading-none ${textColor}`}>
            {formatValue(current, unit)}
          </span>
        </div>

        {/* 金額換算 */}
        {equivalent && (
          <p
            className="text-xs mb-2 font-medium"
            style={{ color: `var(--color-${accentColor})` }}
          >
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
            className="block w-full text-center text-white text-sm font-bold py-3 rounded-xl transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, var(--color-${accentColor}), ${baseRgba}0.75))`,
            }}
          >
            {ctaText} →
          </a>
        )}
      </div>
    </section>
  )
}
