"""
日次データ収集スクリプト
- D1: ドル円（ExchangeRate-API）
- D2: BTC恐怖・強欲指数（Alternative.me）
"""

import json
import httpx
from datetime import datetime, timezone, timedelta
from pathlib import Path

JST = timezone(timedelta(hours=9))
DATA_DIR = Path(__file__).parent.parent / "src" / "data"


def fetch_usdjpy() -> float:
    """ExchangeRate-API からドル円レートを取得"""
    url = "https://open.er-api.com/v6/latest/USD"
    resp = httpx.get(url, timeout=30)
    resp.raise_for_status()
    data = resp.json()
    rate = data["rates"]["JPY"]
    return round(rate, 1)


def fetch_btc_fear_greed() -> tuple[int, int]:
    """Alternative.me から BTC Fear & Greed Index を取得"""
    url = "https://api.alternative.me/fng/?limit=2"
    resp = httpx.get(url, timeout=30)
    resp.raise_for_status()
    data = resp.json()["data"]
    current = int(data[0]["value"])
    previous = int(data[1]["value"])
    return current, previous


def main():
    daily_path = DATA_DIR / "daily.json"

    # 既存データを読み込み（前回値を保持するため）
    if daily_path.exists():
        with open(daily_path, "r", encoding="utf-8") as f:
            existing = json.load(f)
    else:
        existing = {"items": {}}

    now = datetime.now(JST).isoformat()

    # --- ドル円 ---
    try:
        usdjpy_current = fetch_usdjpy()
        usdjpy_prev = existing.get("items", {}).get("usdjpy", {}).get("current", usdjpy_current)
        usdjpy_diff = round(usdjpy_current - usdjpy_prev, 1)
        usdjpy_diff_pct = round((usdjpy_diff / usdjpy_prev) * 100, 2) if usdjpy_prev else 0
        year_start = existing.get("items", {}).get("usdjpy", {}).get("year_start", usdjpy_current)

        usdjpy_data = {
            "current": usdjpy_current,
            "previous": usdjpy_prev,
            "diff": usdjpy_diff,
            "diff_pct": usdjpy_diff_pct,
            "direction": "up" if usdjpy_diff >= 0 else "down",
            "year_start": year_start,
            "label": "ドル円",
            "unit": "円",
        }
    except Exception as e:
        print(f"[WARN] ドル円取得失敗: {e}")
        usdjpy_data = existing.get("items", {}).get("usdjpy", {})

    # --- BTC Fear & Greed ---
    try:
        btc_current, btc_prev = fetch_btc_fear_greed()
        btc_diff = btc_current - btc_prev
        btc_diff_pct = round((btc_diff / btc_prev) * 100, 2) if btc_prev else 0

        btc_data = {
            "current": btc_current,
            "previous": btc_prev,
            "diff": btc_diff,
            "diff_pct": btc_diff_pct,
            "direction": "up" if btc_diff >= 0 else "down",
            "label": "BTC恐怖・強欲指数",
            "unit": "",
        }
    except Exception as e:
        print(f"[WARN] BTC指数取得失敗: {e}")
        btc_data = existing.get("items", {}).get("btc_fear_greed", {})

    result = {
        "updated_at": now,
        "items": {
            "usdjpy": usdjpy_data,
            "btc_fear_greed": btc_data,
        },
    }

    with open(daily_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"[OK] daily.json 更新完了: {now}")


if __name__ == "__main__":
    main()
