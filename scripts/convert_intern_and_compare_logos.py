"""Convert intern images to JPG and build PPT vs website logo comparison sheets."""
from __future__ import annotations

import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
import pillow_heif

pillow_heif.register_heif_opener()

ROOT = Path(r"c:\Users\alemuzjuarez\apc-web")


def to_rgb(img: Image.Image) -> Image.Image:
    if img.mode in ("RGBA", "LA"):
        bg = Image.new("RGB", img.size, (255, 255, 255))
        alpha = img.split()[-1]
        bg.paste(img.convert("RGBA"), mask=alpha)
        return bg
    if img.mode == "P":
        return to_rgb(img.convert("RGBA"))
    if img.mode != "RGB":
        return img.convert("RGB")
    return img


def resize_max(img: Image.Image, max_side: int) -> Image.Image:
    w, h = img.size
    if max(w, h) <= max_side:
        return img
    scale = max_side / max(w, h)
    return img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)


def convert_intern_images() -> list[Path]:
    src = ROOT / "_intern_images_preview"
    dest = ROOT / "public" / "images" / "Internships" / "this-could-be-you"
    dest.mkdir(parents=True, exist_ok=True)
    for p in dest.glob("*"):
        if p.is_file():
            p.unlink()

    outs: list[Path] = []
    for f in sorted(src.iterdir()):
        if not f.is_file():
            continue
        if f.name.startswith("._"):
            continue
        if f.suffix.lower() not in {".jpg", ".jpeg", ".png", ".heic", ".webp"}:
            print(f"SKIP unsupported: {f.name}")
            continue
        # Duplicates
        if f.name == "Screenshot.png":
            print(f"SKIP duplicate: {f.name}")
            continue
        if f.name == "IMG_2625.JPEG" and (src / "IMG_2625.jpg").exists():
            print(f"SKIP duplicate larger JPEG: {f.name}")
            continue

        stem = f.stem.replace("\u202f", " ").replace("\xa0", " ").strip()
        slug = re.sub(r"[^a-zA-Z0-9]+", "-", stem).strip("-").lower() or f"image-{len(outs)+1}"
        out = dest / f"{slug}.jpg"

        img = resize_max(to_rgb(Image.open(f)), 2400)
        img.save(out, "JPEG", quality=85, optimize=True)
        outs.append(out)
        print(f"OK {f.name} -> {out.relative_to(ROOT)} {img.size} {out.stat().st_size}")

    print(f"Converted {len(outs)} intern images")
    return outs


def fit_tile(img: Image.Image, box: tuple[int, int], bg=(255, 255, 255)) -> Image.Image:
    tw, th = box
    canvas = Image.new("RGB", (tw, th), bg)
    fitted = img.copy()
    fitted.thumbnail((tw - 12, th - 12), Image.Resampling.LANCZOS)
    x = (tw - fitted.width) // 2
    y = (th - fitted.height) // 2
    canvas.paste(fitted, (x, y))
    return canvas


def contact_sheet(
    items: list[tuple[str, Path]],
    out: Path,
    cols: int = 5,
    tile: tuple[int, int] = (280, 180),
    label_h: int = 36,
) -> None:
    if not items:
        return
    tw, th = tile
    rows = (len(items) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * tw, rows * (th + label_h)), (245, 245, 245))
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("arial.ttf", 12)
    except OSError:
        font = ImageFont.load_default()

    for i, (label, path) in enumerate(items):
        r, c = divmod(i, cols)
        x, y = c * tw, r * (th + label_h)
        try:
            img = to_rgb(Image.open(path))
        except Exception as e:  # noqa: BLE001
            img = Image.new("RGB", tile, (220, 220, 220))
            print(f"WARN open failed {path}: {e}")
        sheet.paste(fit_tile(img, tile), (x, y))
        # truncate label
        text = label if len(label) <= 36 else label[:33] + "..."
        draw.text((x + 6, y + th + 8), text, fill=(20, 20, 20), font=font)

    out.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out, "JPEG", quality=90, optimize=True)
    print(f"Wrote {out.relative_to(ROOT)}")


def export_pptx_logos() -> list[tuple[str, Path]]:
    media = ROOT / "_pptx_logos_extract" / "ppt" / "media"
    dest = ROOT / "_logo_compare" / "pptx"
    dest.mkdir(parents=True, exist_ok=True)
    for p in dest.glob("*"):
        if p.is_file():
            p.unlink()

    items: list[tuple[str, Path]] = []
    for f in sorted(media.iterdir(), key=lambda p: (
        int(re.search(r"(\d+)", p.stem).group(1)) if re.search(r"(\d+)", p.stem) else 0,
        p.name,
    )):
        if not f.is_file():
            continue
        if f.suffix.lower() not in {".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"}:
            continue
        out = dest / f"{f.stem}.jpg"
        img = to_rgb(Image.open(f))
        # Keep small logos at native size for fidelity, but save as jpg
        img.save(out, "JPEG", quality=95, optimize=True)
        items.append((f.name, out))
        print(f"PPTX {f.name} -> {out.name} {img.size}")
    return items


def collect_website_logos() -> list[tuple[str, Path]]:
    logos_root = ROOT / "public" / "images" / "Logos"
    # Focus on company logos used on site (exclude Partners college folder for this compare)
    paths: list[Path] = []
    for p in sorted(logos_root.rglob("*")):
        if not p.is_file():
            continue
        if "Partners" in p.parts:
            continue
        if p.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}:
            continue
        # skip svg for PIL compare sheet
        if p.suffix.lower() == ".svg":
            continue
        paths.append(p)

    # Also Lear used from Backgrounds
    lear = ROOT / "public" / "images" / "Backgrounds" / "Lear.jpg"
    if lear.exists():
        paths.append(lear)

    items: list[tuple[str, Path]] = []
    for p in paths:
        rel = str(p.relative_to(ROOT / "public" / "images")).replace("\\", "/")
        items.append((rel, p))
    return items


def main() -> None:
    print("=== Convert intern images ===")
    convert_intern_images()

    print("\n=== Export PPTX logos ===")
    pptx_items = export_pptx_logos()
    contact_sheet(
        [(name, path) for name, path in pptx_items],
        ROOT / "_logo_compare" / "pptx_contact_sheet.jpg",
        cols=5,
    )

    print("\n=== Website company logos sheet ===")
    web_items = collect_website_logos()
    contact_sheet(
        web_items,
        ROOT / "_logo_compare" / "website_contact_sheet.jpg",
        cols=4,
    )

    # Also dump sizes for side-by-side later
    print("\nWebsite logos:")
    for label, path in web_items:
        try:
            with Image.open(path) as im:
                print(f"  {label}: {im.size} {path.stat().st_size}B")
        except Exception as e:  # noqa: BLE001
            print(f"  {label}: ERROR {e}")


if __name__ == "__main__":
    main()
