"""
週次データ収集スクリプト
- W1: ガソリン県境価格差（資源エネルギー庁 石油製品価格調査）
"""

import json
from datetime import datetime, timezone, timedelta
from pathlib import Path

JST = timezone(timedelta(hours=9))
DATA_DIR = Path(__file__).parent.parent / "src" / "data"

# 注意: 実際の実装では資源エネルギー庁のExcelファイルをダウンロードしてパースする
# MVP段階ではサンプルデータを使用し、後日Excelパーサーを実装


def main():
    weekly_path = DATA_DIR / "weekly.json"

    # 既存データ読み込み
    if weekly_path.exists():
        with open(weekly_path, "r", encoding="utf-8") as f:
            existing = json.load(f)
    else:
        existing = {"items": {}}

    now = datetime.now(JST).isoformat()

    # TODO: 資源エネルギー庁 Excel DL + パース実装
    # URL: https://www.enecho.meti.go.jp/statistics/petroleum_and_lpgas/pl007/results.html
    # 現在はフォールバック（既存データをそのまま保持）
    print("[INFO] ガソリン価格: 資源エネルギー庁Excelパーサー未実装。既存データを保持。")

    existing["updated_at"] = now

    with open(weekly_path, "w", encoding="utf-8") as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)

    print(f"[OK] weekly.json 更新完了: {now}")


if __name__ == "__main__":
    main()
