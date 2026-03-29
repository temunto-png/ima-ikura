export default function Header() {
  const today = new Date()
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']
  const dayStr = weekdays[today.getDay()]

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        {/* ロゴ */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red to-yellow flex items-center justify-center">
            <span className="text-white font-bold text-sm">¥</span>
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="text-text font-black text-lg leading-none">いま</span>
            <span className="text-red font-black text-lg leading-none">いくら</span>
          </div>
          <span className="text-text-faint text-[8px] ml-1 hidden sm:inline">ima-ikura.com</span>
        </div>

        {/* 日付 */}
        <time className="font-number text-text-muted text-sm">
          {dateStr}（{dayStr}）
        </time>
      </div>
    </header>
  )
}
