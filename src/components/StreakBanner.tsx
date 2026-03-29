import streakData from '../data/streaks.json'

type Streak = {
  direction: 'up' | 'down'
  days: number
  record: number
  prev_record: number
  label: string
}

function StreakItem({ streak, index }: { streak: Streak; index: number }) {
  const isFire = streak.direction === 'up'
  const isRecord = streak.days >= streak.record && streak.days >= 10
  const isHot = streak.days >= 7
  const emoji = isFire ? '🔥' : '❄️'
  const dirLabel = isFire ? '連続値上がり' : '連続値下がり'

  return (
    <div
      className={`animate-fade-in-up relative overflow-hidden flex items-center gap-3 rounded-xl px-4 py-3 delay-${(index + 1) * 100}`}
      style={
        isHot && isFire
          ? {
              background: 'linear-gradient(135deg, rgba(255,107,107,0.08) 0%, rgba(240,147,43,0.05) 100%)',
              border: '1px solid rgba(255,107,107,0.2)',
            }
          : isHot && !isFire
          ? {
              background: 'linear-gradient(135deg, rgba(9,132,227,0.08) 0%, rgba(108,92,231,0.05) 100%)',
              border: '1px solid rgba(9,132,227,0.2)',
            }
          : {
              background: '#fff',
              border: '1px solid #f0f0f0',
            }
      }
    >
      {/* 炎アイコン */}
      <span className="text-2xl shrink-0">{emoji}</span>

      {/* テキスト */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-sm">{streak.label}</span>
          {isRecord && (
            <span
              className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full"
              style={{
                background: 'linear-gradient(90deg, #ff6b6b, #f0932b)',
                animation: 'pulse-badge 1.8s ease-in-out infinite',
              }}
            >
              NEW RECORD
            </span>
          )}
        </div>
        <p className="text-text-muted text-xs">
          {dirLabel}{streak.days >= 3 && streak.days < 7 && ' 🎯'}
        </p>
      </div>

      {/* 大きなストリーク数 */}
      <div className="text-right shrink-0">
        <span
          className="font-number font-black leading-none"
          style={{
            fontSize: '2rem',
            color: isFire ? '#ff6b6b' : '#0984e3',
          }}
        >
          {streak.days}
        </span>
        <p className="text-text-faint text-[10px] font-number">日</p>
      </div>
    </div>
  )
}

export default function StreakBanner() {
  const streaks = Object.values(streakData.streaks) as Streak[]
  const activeStreaks = streaks.filter((s) => s.days >= 3)

  if (activeStreaks.length === 0) return null

  return (
    <section className="mx-4 mt-6">
      <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">
        連続記録
      </h2>
      <div className="space-y-2">
        {activeStreaks.map((streak, i) => (
          <StreakItem key={streak.label} streak={streak} index={i} />
        ))}
      </div>
    </section>
  )
}
