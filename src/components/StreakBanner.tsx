import streakData from '../data/streaks.json'

type Streak = {
  direction: 'up' | 'down'
  days: number
  record: number
  prev_record: number
  label: string
}

function StreakItem({ streak }: { streak: Streak }) {
  const isRecord = streak.days >= streak.record && streak.days >= 10
  const emoji = streak.direction === 'up' ? '🔥' : '❄️'
  const dirLabel = streak.direction === 'up' ? '連続値上がり' : '連続値下がり'

  return (
    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm">
      <span className="text-2xl">{emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm">{streak.label}</span>
          {isRecord && (
            <span className="text-[10px] font-bold text-white bg-red px-1.5 py-0.5 rounded-full animate-pulse">
              NEW RECORD
            </span>
          )}
        </div>
        <p className="text-text-muted text-xs">
          {dirLabel} <span className="font-number font-bold text-text">{streak.days}日</span>
          {streak.days >= 3 && streak.days < 10 && ' 🎯'}
        </p>
      </div>
      <div className="font-number text-2xl font-bold text-text">
        {streak.days}
      </div>
    </div>
  )
}

export default function StreakBanner() {
  const streaks = Object.values(streakData.streaks) as Streak[]
  // 3日以上のストリークのみ表示
  const activeStreaks = streaks.filter((s) => s.days >= 3)

  if (activeStreaks.length === 0) return null

  return (
    <section className="mx-4 mt-6">
      <h2 className="text-sm font-bold text-text mb-3">
        🔥 連続記録
      </h2>
      <div className="space-y-2">
        {activeStreaks.map((streak) => (
          <StreakItem key={streak.label} streak={streak} />
        ))}
      </div>
    </section>
  )
}
