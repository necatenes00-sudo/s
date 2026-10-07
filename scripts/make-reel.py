#!/usr/bin/env python3
"""Render the original, silent Demir Digital studio reel from local concept artwork.
Requires Python/Pillow and ffmpeg; run from repository root. No network is used.
"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import math, subprocess

ROOT = Path(__file__).resolve().parents[1]
MEDIA = ROOT / 'public' / 'media'
W, H, FPS = 1280, 720, 24
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
regular = ImageFont.truetype(FONT, 18)
small = ImageFont.truetype(FONT, 13)
headline = ImageFont.truetype(BOLD, 76)
brand = ImageFont.truetype(BOLD, 21)
shots = [
    ('demir', 'DESIGN + TECHNOLOGY', ['Built to', 'stand apart.']),
    ('limon', 'LIMON / HOSPITALITY CONCEPT', ['Feel', 'the space.']),
    ('seyban', 'SEYBAN / AUTOMOTIVE CONCEPT', ['Engineered', 'to move.']),
    ('ciger', 'CIGER / AGRICULTURE CONCEPT', ['Rooted in', 'tomorrow.']),
]
images = [Image.open(MEDIA / f'{name}.webp').convert('RGB') for name, _, _ in shots]
# The editorial shade allows the original render to remain visible while providing
# stable contrast for the typography throughout each slow camera move.
gradient = Image.new('RGBA', (W, H))
pixels = gradient.load()
for x in range(W):
    opacity = round(210 * (1 - x / W) ** 1.55 + 17)
    for y in range(H):
        pixels[x, y] = (3, 8, 10, min(255, opacity + int(24 * abs(y / H - .5))))

def shot_frame(index, progress):
    original = images[index]
    scale = max(W / original.width, H / original.height) * (1.05 + progress * .055)
    rw, rh = round(original.width * scale), round(original.height * scale)
    resized = original.resize((rw, rh), Image.Resampling.LANCZOS)
    left = round((rw - W) * (.46 + .1 * progress))
    top = round((rh - H) * .47)
    frame = resized.crop((left, top, left + W, top + H)).convert('RGBA')
    frame.alpha_composite(gradient)
    return frame

def compose(frame_number):
    time = frame_number / FPS
    index = min(3, int(time / 2))
    progress = (time - index * 2) / 2
    frame = shot_frame(index, progress)
    if index and progress < .14:
        previous = shot_frame(index - 1, 1)
        frame = Image.blend(previous, frame, progress / .14)
    d = ImageDraw.Draw(frame)
    white, cyan = (239, 243, 240, 255), (147, 236, 224, 255)
    d.text((62, 48), 'DEMIR DIGITAL', font=brand, fill=white)
    d.text((1010, 52), 'DESIGN STUDY / 2026', font=small, fill=white)
    d.line((62, 93, 1218, 93), fill=(220, 239, 232, 90), width=1)
    opacity = min(1, max(0, (progress - .06) / .20))
    easing = 1 - (1 - opacity) ** 3
    layer = Image.new('RGBA', (W, H))
    ld = ImageDraw.Draw(layer)
    y = 273 + round(28 * (1 - easing))
    ld.text((60, y - 57), shots[index][1], font=regular, fill=cyan)
    for n, line in enumerate(shots[index][2]):
        ld.text((56, y + n * 83), line, font=headline, fill=white)
    layer.putalpha(layer.getchannel('A').point(lambda a: round(a * opacity)))
    frame.alpha_composite(layer)
    d = ImageDraw.Draw(frame)
    d.text((62, 650), 'INDEPENDENT DIGITAL STUDIO', font=small, fill=white)
    d.text((1060, 650), f'0{index + 1}   /   04', font=small, fill=white)
    d.line((62, 690, 1218, 690), fill=(220, 239, 232, 75), width=1)
    d.line((62, 690, 62 + round(1156 * frame_number / (FPS * 8 - 1)), 690), fill=cyan, width=2)
    return frame.convert('RGB')

output = MEDIA / 'showreel.webm'
command = ['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pixel_format', 'rgb24', '-video_size', f'{W}x{H}', '-framerate', str(FPS), '-i', '-', '-an', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '37', '-row-mt', '1', '-threads', '3', '-pix_fmt', 'yuv420p', str(output)]
process = subprocess.Popen(command, stdin=subprocess.PIPE)
for i in range(FPS * 8):
    frame = compose(i)
    if i == 25:
        frame.save(MEDIA / 'reel-poster.webp', 'WEBP', quality=86, method=6)
    process.stdin.write(frame.tobytes())
process.stdin.close()
if process.wait() != 0:
    raise RuntimeError('ffmpeg failed')
print(f'{output}: {output.stat().st_size:,} bytes, 8 seconds, 1280×720, 24 fps')
