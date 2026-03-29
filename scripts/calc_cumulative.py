"""
累計カウンター計算スクリプト
CPI前年比からベース値と日割りインクリメントを算出
"""

import json
from datetime import datetime, timezone, timedelta
from pathlib import Path

JST = timezone(timedelta(hours=9))
DATA_DIR = Path(__file__).parent.parent / "src" / "data"

# 総務省 家計調査: 2人以上世帯の年間消費支出（概算）
ANNUAL_EXPENDITURE = 3_600_000  # 約360万円


def main():
    cumulative_path = DATA_DIR / "cumulative.json"
    monthly_path = DATA_DIR / "monthly.json"

    # 月次データからCPI上昇率を取得
    cpi_yoy_pct = 3.2  # デフォルト値
    if monthly_path.exists():
        with open(monthly_path, "r", encoding="utf-8") as f:
            monthly = json.load(f)
        cpi_item = monthly.get("items", {}).get("cpi", {})
        if cpi_item.get("diff_pct") is not None:
            cpi_yoy_pct = cpi_item["diff_pct"]

    # 年間の追加負担額 = 年間消費支出 × CPI上昇率
    annual_extra = round(ANNUAL_EXPENDITURE * (cpi_yoy_pct / 100))
    daily_increment = round(annual_extra / 365)

    now = datetime.now(JST)
    year_start = datetime(now.year, 1, 1, tzinfo=JST)
    days_passed = (now - year_start).days
    base_amount = daily_increment * days_passed

    result = {
        "updated_at": now.isoformat(),
        "base_amount": base_amount,
        "daily_increment": daily_increment,
        "year": now.year,
        "source_cpi_yoy_pct": cpi_yoy_pct,
        "note": "前年同月CPI上昇率をベースに日割り算出",
    }

    with open(cumulative_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"[OK] cumulative.json 更新完了: base={base_amount}, daily={daily_increment}")


if __name__ == "__main__":
    main()
