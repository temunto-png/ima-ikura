"""
OGP画像自動生成スクリプト
Pillow で 1200x630px のOGPカードを生成
"""

import json
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "src" / "data"
OGP_DIR = Path(__file__).parent.parent / "public" / "ogp"

try:
    from PIL import Image, ImageDraw, ImageFont
    HAS_PILLOW = True
except ImportError:
    HAS_PILLOW = False


def create_ogp_card(
    title: str,
    value_before: str,
    value_after: str,
    diff_pct: str,
    output_path: Path,
):
    """OGPカード画像を生成"""
    if not HAS_PILLOW:
        print("[WARN] Pillow未インストール。OGP生成スキップ。")
        return

    W, H = 1200, 630
    # 白基調（デザインルール: ダークテーマ禁止）
    img = Image.new("RGB", (W, H), "#ffffff")
    draw = ImageDraw.Draw(img)

    # フォントの読み込み（フォールバック）
    try:
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 72)
        font_mid = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 36)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
    except OSError:
        font_large = ImageFont.load_default()
        font_mid = ImageFont.load_default()
        font_small = ImageFont.load_default()

    # ブランドカラーのアクセントバー（上部）
    for i in range(8):
        r = int(255 * (1 - i / 8) + 106 * (i / 8))
        g = int(107 * (1 - i / 8) + 202 * (i / 8))
        b = int(107 * (1 - i / 8) + 36 * (i / 8))
        draw.rectangle([(0, i * 2), (W, i * 2 + 2)], fill=f"#{r:02x}{g:02x}{b:02x}")

    # タイトル（白背景なので濃色テキスト）
    draw.text((60, 80), title, fill="#1a1a2e", font=font_mid)

    # 前 → いま
    draw.text((60, 200), value_before, fill="#9ca3af", font=font_mid)
    draw.text((60, 260), "→", fill="#d1d5db", font=font_mid)
    draw.text((60, 320), value_after, fill="#ff6b6b", font=font_large)

    # %バッジ
    draw.text((W - 300, 320), diff_pct, fill="#ff6b6b", font=font_mid)

    # ロゴ
    draw.text((W - 300, H - 80), "ima-ikura.com", fill="#9ca3af", font=font_small)

    img.save(output_path, "PNG")
    print(f"  [OK] {output_path.name}")


def main():
    OGP_DIR.mkdir(parents=True, exist_ok=True)

    daily_path = DATA_DIR / "daily.json"
    if daily_path.exists():
        with open(daily_path, "r", encoding="utf-8") as f:
            daily = json.load(f)

        for key, item in daily.get("items", {}).items():
            create_ogp_card(
                title=item.get("label", key),
                value_before=str(item.get("previous", "")),
                value_after=str(item.get("current", "")),
                diff_pct=f"{item.get('diff_pct', 0):+.1f}%",
                output_path=OGP_DIR / f"{key}.png",
            )

    # デフォルトOGP
    create_ogp_card(
        title="いまいくら",
        value_before="きょうの値段",
        value_after="きょうの暮らし",
        diff_pct="",
        output_path=OGP_DIR / "default.png",
    )

    print("[OK] OGP画像生成完了")


if __name__ == "__main__":
    main()
