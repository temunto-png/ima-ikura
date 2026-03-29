"""
月次データ収集スクリプト
- M0: 卵価格（e-Stat API 小売物価統計）
- M1: 電気代
- M2: 手取りの実質価値（CPI + 毎月勤労統計）
- M3: 住宅ローン金利
- M4: 食品価格
"""

import json
import httpx
import os
from datetime import datetime, timezone, timedelta
from pathlib import Path

JST = timezone(timedelta(hours=9))
DATA_DIR = Path(__file__).parent.parent / "src" / "data"
ESTAT_APP_ID = os.environ.get("ESTAT_APP_ID", "")

# e-Stat API 統計表ID
ESTAT_STATS = {
    "cpi": "00200573",       # 消費者物価指数
    "wage": "00450071",      # 毎月勤労統計
    "retail": "00200571",    # 小売物価統計調査
}


def fetch_estat(stats_code: str, params: dict = None) -> dict:
    """e-Stat API からデータを取得"""
    if not ESTAT_APP_ID:
        print(f"[WARN] ESTAT_APP_ID 未設定。統計{stats_code}スキップ。")
        return {}

    url = "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData"
    base_params = {
        "appId": ESTAT_APP_ID,
        "statsDataId": stats_code,
        "limit": 10,
    }
    if params:
        base_params.update(params)

    resp = httpx.get(url, params=base_params, timeout=60)
    resp.raise_for_status()
    return resp.json()


def main():
    monthly_path = DATA_DIR / "monthly.json"

    # 既存データ読み込み
    if monthly_path.exists():
        with open(monthly_path, "r", encoding="utf-8") as f:
            existing = json.load(f)
    else:
        existing = {"items": {}}

    now = datetime.now(JST).isoformat()

    # TODO: e-Stat APIからの実データ取得を実装
    # MVP段階ではサンプルデータを保持
    print("[INFO] 月次データ: e-Stat APIパーサー未完全実装。既存データを保持。")

    existing["updated_at"] = now

    with open(monthly_path, "w", encoding="utf-8") as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)

    print(f"[OK] monthly.json 更新完了: {now}")


if __name__ == "__main__":
    main()
