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
