type Props = {
  text: string
  emoji?: string
}

export default function TriviaStrip({ text, emoji = '💡' }: Props) {
  return (
    <div className="mx-4 mt-6 bg-yellow/10 border border-yellow/20 rounded-xl px-4 py-3">
      <p className="text-sm text-text">
        <span className="mr-1.5">{emoji}</span>
        {text}
      </p>
    </div>
  )
}
