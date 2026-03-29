type CardItem = {
  label: string
  value: string
  subtext?: string
  emoji?: string
}

type Props = {
  items: CardItem[]
}

export default function CompactCard({ items }: Props) {
  return (
    <div className="mx-4 mt-4 grid grid-cols-2 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-white rounded-xl p-4 border border-border"
        >
          <div className="flex items-center gap-1.5 mb-1">
            {item.emoji && <span className="text-sm">{item.emoji}</span>}
            <span className="text-[11px] text-text-muted truncate">{item.label}</span>
          </div>
          <p className="font-number text-lg font-bold text-text">{item.value}</p>
          {item.subtext && (
            <p className="text-[10px] text-text-faint mt-0.5">{item.subtext}</p>
          )}
        </div>
      ))}
    </div>
  )
}
