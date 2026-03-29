import { useState, useEffect } from 'react'

type Props = {
  question: string
  options: string[]
  id: string
}

export default function PollCard({ question, options, id }: Props) {
  const storageKey = `poll_${id}`
  const votesKey = `poll_votes_${id}`
  const [selected, setSelected] = useState<number | null>(null)
  const [votes, setVotes] = useState<number[]>(options.map(() => 0))

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved !== null) {
      const parsed = parseInt(saved, 10)
      // 範囲チェック: 不正値（NaN, 負数, 選択肢数以上）は無視
      if (Number.isInteger(parsed) && parsed >= 0 && parsed < options.length) {
        setSelected(parsed)
      } else {
        localStorage.removeItem(storageKey)
      }
    }
    const savedVotes = localStorage.getItem(votesKey)
    if (savedVotes) {
      try {
        const parsed = JSON.parse(savedVotes)
        if (Array.isArray(parsed) && parsed.length === options.length && parsed.every(v => typeof v === 'number' && Number.isFinite(v) && v >= 0)) {
          setVotes(parsed)
        } else {
          // 不正なデータはリセット
          localStorage.removeItem(votesKey)
        }
      } catch {
        // JSONパース失敗は無視してダミー値で初期化
        localStorage.removeItem(votesKey)
      }
    }
    if (!savedVotes) {
      // 初期のダミー投票数
      const dummy = options.map(() => Math.floor(Math.random() * 50) + 10)
      setVotes(dummy)
      localStorage.setItem(votesKey, JSON.stringify(dummy))
    }
  }, [])

  const totalVotes = votes.reduce((a, b) => a + b, 0)

  const handleVote = (index: number) => {
    if (selected !== null) return
    const newVotes = [...votes]
    newVotes[index]++
    setVotes(newVotes)
    setSelected(index)
    localStorage.setItem(storageKey, String(index))
    localStorage.setItem(votesKey, JSON.stringify(newVotes))
  }

  return (
    <section className="mx-4 mt-6 bg-white rounded-2xl p-5 shadow-sm border border-border">
      <h3 className="text-sm font-bold mb-3">🗳️ {question}</h3>
      <div className="space-y-2">
        {options.map((option, i) => {
          const pct = totalVotes > 0 ? Math.round((votes[i] / totalVotes) * 100) : 0
          const isSelected = selected === i

          return (
            <button
              key={i}
              onClick={() => handleVote(i)}
              disabled={selected !== null}
              className={`w-full text-left rounded-xl px-4 py-3 text-sm transition-all relative overflow-hidden ${
                isSelected
                  ? 'border-2 border-blue bg-blue/5'
                  : selected !== null
                  ? 'border border-border bg-bg'
                  : 'border border-border hover:border-blue/30 bg-white cursor-pointer'
              }`}
            >
              {selected !== null && (
                <div
                  className="absolute inset-y-0 left-0 bg-blue/10 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              )}
              <div className="relative flex justify-between items-center">
                <span>{option}</span>
                {selected !== null && (
                  <span className="font-number text-xs font-bold text-text-muted">
                    {pct}%
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
      {selected !== null && (
        <p className="text-text-faint text-[11px] mt-2 text-right">
          {totalVotes}人が回答
        </p>
      )}
    </section>
  )
}
