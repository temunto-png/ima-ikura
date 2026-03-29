"""
ストリーク計算スクリプト
日次/週次データの連続上昇・下降をカウント

使い方:
  python scripts/calc_streaks.py                   # 日次・週次のみ
  python scripts/calc_streaks.py --include-monthly  # 月次（卵）も含む
"""

import json
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

JST = timezone(timedelta(hours=9))
DATA_DIR = Path(__file__).parent.parent / "src" / "data"

# 月次データのうちストリーク対象とする指標
# 卵は小売物価統計の旬報（月3回更新）のため月次ワークフロー実行時に更新
MONTHLY_STREAK_KEYS = {"tamago"}


def update_streak(streaks: dict, key: str, direction: str, label: str) -> dict:
    """ストリークを更新"""
    existing = streaks.get(key, {
        "direction": direction,
        "days": 0,
        "record": 0,
        "prev_record": 0,
        "label": label,
    })

    if existing["direction"] == direction:
        existing["days"] += 1
    else:
        existing["direction"] = direction
        existing["days"] = 1

    if existing["days"] > existing["record"]:
        existing["prev_record"] = existing["record"]
        existing["record"] = existing["days"]

    existing["label"] = label
    return existing


def main():
    include_monthly = "--include-monthly" in sys.argv

    streaks_path = DATA_DIR / "streaks.json"
    daily_path = DATA_DIR / "daily.json"
    weekly_path = DATA_DIR / "weekly.json"
    monthly_path = DATA_DIR / "monthly.json"

    # 既存ストリーク読み込み
    if streaks_path.exists():
        with open(streaks_path, "r", encoding="utf-8") as f:
            streak_data = json.load(f)
    else:
        streak_data = {"streaks": {}}

    streaks = streak_data.get("streaks", {})

    # 日次データからストリーク更新
    if daily_path.exists():
        with open(daily_path, "r", encoding="utf-8") as f:
            daily = json.load(f)
        for key, item in daily.get("items", {}).items():
            if item.get("direction"):
                streaks[key] = update_streak(
                    streaks, key, item["direction"], item.get("label", key)
                )

    # 週次データからストリーク更新
    if weekly_path.exists():
        with open(weekly_path, "r", encoding="utf-8") as f:
            weekly = json.load(f)
        for key, item in weekly.get("items", {}).items():
            if item.get("direction"):
                streaks[key] = update_streak(
                    streaks, key, item["direction"], item.get("label", key)
                )

    # 月次データからストリーク更新（--include-monthly フラグ時のみ）
    # 月次ワークフロー（monthly.yml）から呼ばれたときのみ実行し、
    # 毎日の日次ワークフローでは更新しない（月次データが変わっていないため）
    if include_monthly and monthly_path.exists():
        with open(monthly_path, "r", encoding="utf-8") as f:
            monthly = json.load(f)
        for key, item in monthly.get("items", {}).items():
            if key in MONTHLY_STREAK_KEYS and item.get("direction"):
                streaks[key] = update_streak(
                    streaks, key, item["direction"], item.get("label", key)
                )
        print(f"[INFO] 月次ストリーク更新: {', '.join(MONTHLY_STREAK_KEYS)}")

    now = datetime.now(JST).isoformat()
    result = {
        "updated_at": now,
        "streaks": streaks,
    }

    with open(streaks_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"[OK] streaks.json 更新完了: {now}")


if __name__ == "__main__":
    main()
