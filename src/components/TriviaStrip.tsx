type Props = {
  text: string
  emoji?: string
}

export default function TriviaStrip({ text, emoji = '💡' }: Props) {
  return (
    <div className="animate-fade-in-up mx-4 mt-6 flex gap-3 items-start">
      {/* 左アクセントライン */}
      <div
        className="shrink-0 mt-0.5 w-0.5 self-stretch rounded-full"
        style={{ background: 'linear-gradient(180deg, #f9ca24, #f0932b)' }}
      />
      <p className="text-sm text-text-muted leading-relaxed">
        <span className="mr-1">{emoji}</span>
        {text}
      </p>
    </div>
  )
}
