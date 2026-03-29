"""
Claude API Haiku コメント自動生成スクリプト
各指標に30字ワンライナーを生成

最適化: データファイルの updated_at が前回生成時と同じ場合はスキップ
（APIコスト削減: 未更新ファイルの再生成を回避）
"""

import json
import os
import httpx
from datetime import datetime
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "src" / "data"
API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")


def generate_comment(label: str, current, previous, direction: str) -> str:
    """Claude Haiku APIで30字コメントを生成"""
    if not API_KEY:
        print("[WARN] ANTHROPIC_API_KEY が未設定。スキップ。")
        return ""

    prompt = f"""以下の経済指標について、一般の人向けに30字以内のワンライナーコメントを1つだけ書いてください。
カジュアルな口語体で、専門用語を使わず、感情や生活実感を込めてください。

指標: {label}
前回: {previous}
今回: {current}
方向: {"上昇" if direction == "up" else "下落"}

コメントのみを出力してください。"""

    resp = httpx.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "x-api-key": API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        json={
            "model": "claude-haiku-4-5-20251001",
            "max_tokens": 100,
            "messages": [{"role": "user", "content": prompt}],
        },
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()["content"][0]["text"].strip()


def main():
    comments_path = DATA_DIR / "comments.json"

    # 既存コメントと生成元タイムスタンプを読み込む
    if comments_path.exists():
        with open(comments_path, "r", encoding="utf-8") as f:
            existing = json.load(f)
    else:
        existing = {}

    comments = existing.get("comments", {})
    # generated_from: {ファイル名: 前回生成時のデータ updated_at}
    generated_from: dict[str, str] = existing.get("generated_from", {})

    data_files = {
        "daily": DATA_DIR / "daily.json",
        "weekly": DATA_DIR / "weekly.json",
        "monthly": DATA_DIR / "monthly.json",
    }

    total_generated = 0
    total_skipped = 0

    for file_key, data_path in data_files.items():
        if not data_path.exists():
            continue

        with open(data_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        data_updated_at = data.get("updated_at", "")
        prev_generated_at = generated_from.get(file_key, "")

        # データが更新されていない場合はスキップ
        if data_updated_at and data_updated_at == prev_generated_at:
            item_count = len(data.get("items", {}))
            print(
                f"[SKIP] {file_key}.json: 前回生成時 ({prev_generated_at}) から未更新。"
                f"{item_count}件スキップ。"
            )
            total_skipped += item_count
            continue

        print(
            f"[INFO] {file_key}.json: 更新検出 "
            f"({prev_generated_at or 'なし'} → {data_updated_at})。コメント生成中..."
        )

        has_error = False
        for key, item in data.get("items", {}).items():
            try:
                comment = generate_comment(
                    item.get("label", key),
                    item.get("current", ""),
                    item.get("previous", item.get("year_ago", "")),
                    item.get("direction", "up"),
                )
                if comment:
                    # 最大50字でトリミング（APIの応答が長すぎる場合の安全対策）
                    comments[key] = comment[:50]
                    total_generated += 1
                    print(f"  [{key}] {comment[:50]}")
            except Exception as e:
                print(f"  [WARN] {key} コメント生成失敗: {e}")
                has_error = True

        # エラーがあった場合は generated_from を更新しない
        # → 次回実行時に再試行される
        if not has_error:
            generated_from[file_key] = data_updated_at
        else:
            print(f"  [WARN] {file_key}.json: エラーあり。次回実行で再試行します。")

    result = {
        "updated_at": datetime.now().isoformat(),
        "generated_from": generated_from,
        "comments": comments,
    }

    with open(comments_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(
        f"[OK] comments.json 更新完了 — "
        f"生成: {total_generated}件 / スキップ: {total_skipped}件"
    )


if __name__ == "__main__":
    main()
