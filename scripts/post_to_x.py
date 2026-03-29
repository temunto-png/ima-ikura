"""
X (Twitter) API v2 自動投稿スクリプト
速報カードを自動投稿
"""

import json
import os
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "src" / "data"

# X API v2 認証情報（環境変数から取得）
X_API_KEY = os.environ.get("X_API_KEY", "")
X_API_SECRET = os.environ.get("X_API_SECRET", "")
X_ACCESS_TOKEN = os.environ.get("X_ACCESS_TOKEN", "")
X_ACCESS_SECRET = os.environ.get("X_ACCESS_SECRET", "")


def post_tweet(text: str) -> bool:
    """X API v2 でツイートを投稿"""
    if not all([X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET]):
        print("[WARN] X API認証情報が未設定。投稿スキップ。")
        return False

    try:
        import tweepy

        client = tweepy.Client(
            consumer_key=X_API_KEY,
            consumer_secret=X_API_SECRET,
            access_token=X_ACCESS_TOKEN,
            access_token_secret=X_ACCESS_SECRET,
        )
        response = client.create_tweet(text=text)
        print(f"[OK] ツイート投稿成功: {response.data['id']}")
        return True
    except ImportError:
        print("[WARN] tweepy未インストール。pip install tweepy を実行してください。")
        return False
    except Exception as e:
        print(f"[ERROR] ツイート投稿失敗: {e}")
        return False


def format_daily_tweet() -> str:
    """日次データからツイート文面を生成"""
    daily_path = DATA_DIR / "daily.json"
    comments_path = DATA_DIR / "comments.json"

    try:
        with open(daily_path, "r", encoding="utf-8") as f:
            daily = json.load(f)
        with open(comments_path, "r", encoding="utf-8") as f:
            comments = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"[ERROR] データファイル読み込み失敗: {e}")
        return ""

    lines = ["📊 きょうの値段\n"]

    for key, item in daily.get("items", {}).items():
        arrow = "↑" if item["direction"] == "up" else "↓"
        label = item.get("label", key)
        current = item.get("current", "")
        unit = item.get("unit", "")
        diff_pct = item.get("diff_pct", 0)

        lines.append(f"{label}: {current}{unit} ({arrow}{abs(diff_pct):.1f}%)")

        comment = comments.get("comments", {}).get(key, "")
        if comment:
            lines.append(f"  → {comment}")

    lines.append("\n▶ いまいくら")
    lines.append("ima-ikura.com")

    return "\n".join(lines)


def main():
    tweet_text = format_daily_tweet()
    if not tweet_text:
        print("[ERROR] ツイート文面を生成できませんでした。投稿スキップ。")
        return
    print("--- ツイート内容 ---")
    print(tweet_text)
    print(f"--- ({len(tweet_text)}文字) ---")

    post_tweet(tweet_text)


if __name__ == "__main__":
    main()
