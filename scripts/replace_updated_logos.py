"""Replace website logos when PPTX has a clearly newer lockup; export named pack."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(r"c:\Users\alemuzjuarez\apc-web")
MEDIA = ROOT / "_pptx_logos_extract" / "ppt" / "media"
BACKUP = ROOT / "_logo_compare" / "replaced_backups"
NAMED = ROOT / "_logo_compare" / "pptx_named"


def to_rgb(im: Image.Image) -> Image.Image:
    if im.mode in ("RGBA", "LA"):
        bg = Image.new("RGB", im.size, (255, 255, 255))
        bg.paste(im.convert("RGBA"), mask=im.split()[-1])
        return bg
    if im.mode == "P":
        return to_rgb(im.convert("RGBA"))
    return im.convert("RGB") if im.mode != "RGB" else im


def main() -> None:
    BACKUP.mkdir(parents=True, exist_ok=True)
    NAMED.mkdir(parents=True, exist_ok=True)

    replacements = [
        # SHECO: PPT uses current SHECO wordmark branding
        (MEDIA / "image2.jpeg", ROOT / "public/images/Logos/sheco.png", "png"),
        # Lear: PPT uses full LEAR CORPORATION lockup with ®
        (MEDIA / "image27.jpeg", ROOT / "public/images/Backgrounds/Lear.jpg", "jpg"),
    ]

    for src, dest, fmt in replacements:
        if not src.exists():
            print(f"MISSING source {src}")
            continue
        bak = BACKUP / dest.name
        bak.write_bytes(dest.read_bytes())
        img = Image.open(src)
        if fmt == "png":
            to_rgb(img).save(dest, "PNG", optimize=True)
        else:
            to_rgb(img).save(dest, "JPEG", quality=95, optimize=True)
        with Image.open(dest) as saved:
            print(f"Replaced {dest.relative_to(ROOT)} from {src.name} -> {saved.size}")

    mapping = {
        "mercedes-benz": "image1.jpeg",
        "sheco": "image2.jpeg",
        "evonik-industries": "image3.jpg",
        "stresscrete": "image4.png",
        "airbus-mobile": "image5.png",
        "phifer": "image6.jpeg",
        "alabama-power": "image7.jpeg",
        "brose": "image8.jpeg",
        "summer-classics": "image9.jpeg",
        "vulcan-painters": "image10.gif",
        "austal": "image11.png",
        "ssab": "image12.png",
        "blg": "image13.png",
        "toyota-alabama": "image14.png",
        "msa": "image15.png",
        "precision-coil-rotor": "image16.png",
        "photo-coils-worker": "image17.png",
        "fayette-fabrication": "image18.jpeg",
        "regions": "image19.png",
        "blox": "image20.jpeg",
        "sas": "image21.png",
        "smp": "image22.png",
        "springhill-medical": "image23.jpeg",
        "wayne-farms": "image24.png",
        "sc-badge": "image25.png",
        "steris": "image26.png",
        "lear-corporation": "image27.jpeg",
        "jay-industrial-repair": "image28.png",
        "sherwin-williams": "image29.png",
        "autocar": "image30.png",
        "posco-aapc": "image31.png",
        "metal-solutions-gh": "image32.jpeg",
        "amg": "image33.png",
        "soil-kit": "image34.png",
        "ua-culverhouse-a": "image35.jpeg",
        "ua-culverhouse-wordmark": "image36.jpeg",
        "apc-vertical": "image37.jpeg",
        "showa": "image38.png",
        "plasma-processes": "image39.png",
        "deep-south-cake": "image40.jpeg",
        "tapestry-hilton": "image41.png",
        "westervelt": "image42.png",
        "mtm": "image43.png",
        "tenneco": "image44.png",
        "thermal-6": "image45.png",
    }

    for name, fname in mapping.items():
        src = MEDIA / fname
        if not src.exists():
            print(f"missing {fname}")
            continue
        out = NAMED / f"{name}{src.suffix.lower()}"
        out.write_bytes(src.read_bytes())

    print(f"Named pack: {len(list(NAMED.glob('*')))} files")


if __name__ == "__main__":
    main()
