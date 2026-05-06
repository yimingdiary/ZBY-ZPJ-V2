import json
import shutil
from pathlib import Path

from PIL import Image, ImageSequence


ROOT = Path(__file__).resolve().parent
PREVIEW_DIR = ROOT / "preview"
OUTPUT_DIR = ROOT / "preview-optimized"
MANIFEST_FILE = ROOT / "preview-optimized-manifest.json"
IMAGE_EXTENSIONS = {".gif", ".jpeg", ".jpg", ".png", ".webp"}
BACKGROUND_NAMES = {"背景.png", "背景.jpg", "背景.jpeg", "背景.webp"}
ALPHA_THRESHOLD = 8


def relative_preview_key(directory):
    return f"/preview/{directory.name}"


def asset_path(directory, name):
    return f"/preview-optimized/{directory.name}/{name}"


def alpha_bbox(image):
    rgba = image.convert("RGBA")
    alpha = rgba.getchannel("A").point(lambda value: 255 if value > ALPHA_THRESHOLD else 0)
    return alpha.getbbox()


def union_bbox(boxes):
    boxes = [box for box in boxes if box]
    if not boxes:
        return None
    return (
        min(box[0] for box in boxes),
        min(box[1] for box in boxes),
        max(box[2] for box in boxes),
        max(box[3] for box in boxes),
    )


def save_background(source, target):
    with Image.open(source) as image:
        target_name = f"{source.stem}.jpg"
        target = target / target_name
        target.parent.mkdir(parents=True, exist_ok=True)
        image.convert("RGB").save(target, "JPEG", quality=82, optimize=True, progressive=True)
        return {
            "fileName": source.name,
            "optimized": asset_path(target.parent, target_name),
            "kind": "background",
            "width": image.width,
            "height": image.height,
        }


def save_cropped_image(source, target_dir):
    with Image.open(source) as image:
        box = alpha_bbox(image)
        if not box:
            return None

        left, top, right, bottom = box
        target_name = f"{source.stem}-crop.png"
        target = target_dir / target_name
        target.parent.mkdir(parents=True, exist_ok=True)
        cropped = image.convert("RGBA").crop(box)
        cropped.save(target, "PNG", optimize=True)
        return {
            "fileName": source.name,
            "optimized": asset_path(target_dir, target_name),
            "kind": "positioned",
            "left": left,
            "top": top,
            "width": right - left,
            "height": bottom - top,
            "sourceWidth": image.width,
            "sourceHeight": image.height,
        }


def frame_alpha_bbox(frame):
    return alpha_bbox(frame.convert("RGBA"))


def save_cropped_gif(source, target_dir):
    with Image.open(source) as image:
        frames = [frame.copy().convert("RGBA") for frame in ImageSequence.Iterator(image)]
        box = union_bbox(frame_alpha_bbox(frame) for frame in frames)
        if not box:
            return None

        left, top, right, bottom = box
        target_name = f"{source.stem}-crop.gif"
        target = target_dir / target_name
        target.parent.mkdir(parents=True, exist_ok=True)
        duration = image.info.get("duration", 80)
        loop = image.info.get("loop", 0)
        disposal = image.info.get("disposal", 2)
        cropped_frames = [frame.crop(box) for frame in frames]
        cropped_frames[0].save(
            target,
            save_all=True,
            append_images=cropped_frames[1:],
            duration=duration,
            loop=loop,
            disposal=disposal,
            optimize=True,
            transparency=0,
        )
        return {
            "fileName": source.name,
            "optimized": asset_path(target_dir, target_name),
            "kind": "positioned",
            "left": left,
            "top": top,
            "width": right - left,
            "height": bottom - top,
            "sourceWidth": image.width,
            "sourceHeight": image.height,
        }


def optimize_file(source, target_dir):
    suffix = source.suffix.lower()
    if source.name.endswith("-mobile-still.png"):
        return None
    if source.name in BACKGROUND_NAMES:
        return save_background(source, target_dir)
    if suffix == ".gif":
        return save_cropped_gif(source, target_dir)
    if suffix == ".png":
        return save_cropped_image(source, target_dir)
    return None


def main():
    if OUTPUT_DIR.exists():
        shutil.rmtree(OUTPUT_DIR)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    manifest = {}
    if not PREVIEW_DIR.exists():
        MANIFEST_FILE.write_text("{}\n", encoding="utf-8")
        return

    for directory in sorted(PREVIEW_DIR.iterdir(), key=lambda item: item.name):
        if not directory.is_dir():
            continue
        target_dir = OUTPUT_DIR / directory.name
        entries = {}
        for source in sorted(directory.iterdir(), key=lambda item: item.name):
            if not source.is_file() or source.suffix.lower() not in IMAGE_EXTENSIONS:
                continue
            entry = optimize_file(source, target_dir)
            if entry:
                entries[source.name] = entry
        if entries:
            manifest[relative_preview_key(directory)] = entries

    MANIFEST_FILE.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {MANIFEST_FILE.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
