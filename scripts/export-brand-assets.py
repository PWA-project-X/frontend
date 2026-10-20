"""Export web-optimized Miniverso brand assets from Logo_Miniverso.zip."""

from __future__ import annotations

import io
import zipfile
from pathlib import Path

from PIL import Image

ZIP_PATH = Path(r"c:\Users\pedro\Downloads\Logo_Miniverso.zip")
PUBLIC = Path(__file__).resolve().parents[1] / "public"
BRAND_DIR = PUBLIC / "brand"
ICONS_DIR = PUBLIC / "icons"
BG = (7, 11, 20, 255)  # #070b14


def content_bbox(img: Image.Image, alpha_thresh: int = 8):
    alpha = img.split()[-1]
    mask = alpha.point(lambda p: 255 if p > alpha_thresh else 0)
    return mask.getbbox()


def crop_content(img: Image.Image, padding: int = 0, alpha_thresh: int = 8) -> Image.Image:
    bbox = content_bbox(img, alpha_thresh)
    if not bbox:
        return img
    left, top, right, bottom = bbox
    left = max(0, left - padding)
    top = max(0, top - padding)
    right = min(img.width, right + padding)
    bottom = min(img.height, bottom + padding)
    return img.crop((left, top, right, bottom))


def resize_width(img: Image.Image, width: int) -> Image.Image:
    w, h = img.size
    ratio = width / w
    return img.resize((width, max(1, int(h * ratio))), Image.Resampling.LANCZOS)


def fit_square(
    img: Image.Image, size: int, bg_color: tuple[int, int, int, int], margin_ratio: float = 0.18
) -> Image.Image:
    cropped = crop_content(img, padding=2)
    canvas = Image.new("RGBA", (size, size), bg_color)
    avail = int(size * (1 - 2 * margin_ratio))
    cw, ch = cropped.size
    scale = min(avail / cw, avail / ch)
    nw, nh = max(1, int(cw * scale)), max(1, int(ch * scale))
    resized = cropped.resize((nw, nh), Image.Resampling.LANCZOS)
    x = (size - nw) // 2
    y = (size - nh) // 2
    canvas.alpha_composite(resized, (x, y))
    return canvas


def load_pngs() -> dict[str, Image.Image]:
    pngs: dict[str, Image.Image] = {}
    with zipfile.ZipFile(ZIP_PATH) as zf:
        for name in zf.namelist():
            if name.lower().endswith(".png"):
                key = Path(name).name
                with zf.open(name) as fh:
                    pngs[key] = Image.open(io.BytesIO(fh.read())).convert("RGBA")
    return pngs


def main() -> None:
    BRAND_DIR.mkdir(parents=True, exist_ok=True)
    ICONS_DIR.mkdir(parents=True, exist_ok=True)

    pngs = load_pngs()
    print("Loaded:", sorted(pngs.keys()))

    white = crop_content(pngs["logotipo branco horizontal.png"], padding=8)
    white_web = resize_width(white, 1040)
    white_web.save(BRAND_DIR / "logo-white-horizontal.png", optimize=True)
    print("logo-white-horizontal", white_web.size)

    white_2x = resize_width(white, 2080)
    white_2x.save(BRAND_DIR / "logo-white-horizontal@2x.png", optimize=True)
    print("logo-white-horizontal@2x", white_2x.size)

    outline = crop_content(pngs["delineado-miniverso-branco.png"], padding=16)
    outline_web = resize_width(outline, 1200)
    outline_web.save(BRAND_DIR / "logo-outline-white.png", optimize=True)
    print("logo-outline-white", outline_web.size)

    isotipo = pngs["isotipo.png"]
    iso_cropped = crop_content(isotipo, padding=8)
    iso_web = resize_width(iso_cropped, 512)
    iso_web.save(BRAND_DIR / "isotipo.png", optimize=True)
    print("isotipo", iso_web.size)

    iso_auth = resize_width(iso_cropped, 160)
    iso_auth.save(BRAND_DIR / "isotipo-sm.png", optimize=True)
    print("isotipo-sm", iso_auth.size)

    fit_square(isotipo, 192, BG, margin_ratio=0.16).save(
        ICONS_DIR / "icon-192.png", optimize=True
    )
    fit_square(isotipo, 512, BG, margin_ratio=0.16).save(
        ICONS_DIR / "icon-512.png", optimize=True
    )
    fit_square(isotipo, 180, BG, margin_ratio=0.14).save(
        ICONS_DIR / "apple-touch-icon.png", optimize=True
    )
    fit_square(isotipo, 48, BG, margin_ratio=0.12).save(
        PUBLIC / "favicon.png", optimize=True
    )
    fit_square(isotipo, 32, BG, margin_ratio=0.12).save(
        PUBLIC / "favicon-32.png", optimize=True
    )
    print("icons and favicons written")
    print("done")


if __name__ == "__main__":
    main()
