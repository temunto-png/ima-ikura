import dailyData from '../data/daily.json'
import { formatValue } from '../lib/format'

type TickerItem = {
  label: string
  value: string
  direction: 'up' | 'down'
}

export default function Ticker() {
  const items: TickerItem[] = Object.values(dailyData.items).map((item) => ({
    label: item.label,
    value: formatValue(item.current, item.unit),
    direction: item.direction as 'up' | 'down',
  }))

  return (
    <div className="bg-text text-white overflow-hidden py-1.5">
      <div className="flex animate-[scroll_20s_linear_infinite] whitespace-nowrap">
        {/* 2回繰り返してシームレスに見せる。重複するため index サフィックスで key を一意化 */}
        {[...items, ...items].map((item, i) => (
          <span key={`${item.label}-${i}`} className="inline-flex items-center gap-1.5 mx-4 text-xs font-number">
            <span className="text-text-faint">{item.label}</span>
            <span className="font-bold">{item.value}</span>
            <span className={item.direction === 'up' ? 'text-red' : 'text-green'}>
              {item.direction === 'up' ? '▲' : '▼'}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
