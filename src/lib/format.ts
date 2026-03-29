/**
 * 数値を日本語表記にフォーマットする共通ユーティリティ
 *
 * 10,000以上: 万単位に変換（例: 45600 → "4.6万円"）
 * それ以外: 日本語ロケールのカンマ区切り（例: 1234 → "1,234円"）
 */
export function formatValue(v: number | string, unit: string): string {
  if (typeof v === "string") return v + unit
  if (Math.abs(v) >= 10000) {
    return (v / 10000).toFixed(1) + "万" + unit
  }
  return v.toLocaleString("ja-JP") + unit
}

/** アクセントカラー → テキストクラス（例: "red" → "text-red"） */
export function accentTextClass(color: string): string {
  const map: Record<string, string> = {
    red: "text-red",
    orange: "text-orange",
    purple: "text-purple",
    pink: "text-pink",
    blue: "text-blue",
    green: "text-green",
  }
  return map[color] ?? "text-red"
}

/** アクセントカラー → バッジ背景+テキストクラス（例: "red" → "bg-red/10 text-red"） */
export function accentBadgeClass(color: string): string {
  const map: Record<string, string> = {
    red: "bg-red/10 text-red",
    orange: "bg-orange/10 text-orange",
    purple: "bg-purple/10 text-purple",
    pink: "bg-pink/10 text-pink",
    blue: "bg-blue/10 text-blue",
    green: "bg-green/10 text-green",
  }
  return map[color] ?? "bg-red/10 text-red"
}
