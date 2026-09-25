"""Extract the supplied identity's outlined logo. Requires pypdf.

Usage: python scripts/extract-brand-assets.py /path/to/brand.pdf
The source PDF stays outside the website; only small vector assets are published.
"""
import sys
from pathlib import Path
from pypdf import PdfReader

source = PdfReader(sys.argv[1])
out = Path(__file__).resolve().parents[1] / "public/images/brand"
out.mkdir(parents=True, exist_ok=True)
matrix = (1, 0, 0, 1, 0, 0)
color = None
stack, paths, commands, points = [], [], [], []

def point(x, y):
    a, b, c, d, e, f = matrix
    return (a * x + c * y + e, 1080 - (b * x + d * y + f))

def number(value):
    return f"{value:.4f}".rstrip("0").rstrip(".")

for args, operator in source.pages[2].get_contents().operations:
    args = [float(v) for v in args] if operator in (b"cm", b"rg", b"m", b"l", b"c") else args
    if operator == b"q":
        stack.append((matrix, color))
    elif operator == b"Q":
        matrix, color = stack.pop()
    elif operator == b"cm":
        a,b,c,d,e,f = matrix
        A,B,C,D,E,F = args
        matrix = (a*A+c*B,b*A+d*B,a*C+c*D,b*C+d*D,a*E+c*F+e,b*E+d*F+f)
    elif operator == b"rg":
        color = tuple(args)
    elif operator in (b"m", b"l", b"c"):
        coords = [point(args[i], args[i+1]) for i in range(0, len(args), 2)]
        points.extend(coords)
        commands.append(operator.decode().upper()+" ".join(number(n) for p in coords for n in p))
    elif operator == b"h":
        commands.append("Z")
    elif operator in (b"f", b"f*", b"n"):
        if operator != b"n" and color == (1, 1, 1) and commands:
            paths.append((" ".join(commands), points))
        commands, points = [], []

assert len(paths) == 20, "Identity PDF changed: review logo extraction before publishing."
all_points = [p for _, pts in paths for p in pts]
x0, y0 = min(p[0] for p in all_points), min(p[1] for p in all_points)
x1, y1 = max(p[0] for p in all_points), max(p[1] for p in all_points)
view = f"{number(x0-2)} {number(y0-2)} {number(x1-x0+4)} {number(y1-y0+4)}"
gradient = '<defs><linearGradient id="brand" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#00c6ff"/><stop offset="1" stop-color="#2c51f4"/></linearGradient></defs>'
for name, fill in (("logo-full", "#0b1020"), ("logo-full-dark", "#ffffff")):
    artwork = "".join(f'<path fill="{fill if i < 18 else "url(#brand)"}" d="{d}"/>' for i,(d,_) in enumerate(paths))
    (out / f"{name}.svg").write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view}">{gradient}{artwork}</svg>\n')

# The final two outlined shapes form the distinctive leading N/smile emblem.
mark = paths[-2:]
pts = [p for _, ps in mark for p in ps]
mx,my = min(p[0] for p in pts),min(p[1] for p in pts)
mw,mh = max(p[0] for p in pts)-mx,max(p[1] for p in pts)-my
mark_paths = "".join(f'<path d="{d}"/>' for d,_ in mark)
(out / "logo-mark.svg").write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{mx-2} {my-2} {mw+4} {mh+4}">{gradient}<g fill="url(#brand)">{mark_paths}</g></svg>\n')
scale = 46 / max(mw,mh)
tx,ty = (64-mw*scale)/2-mx*scale,(64-mh*scale)/2-my*scale
icon = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#2c51f4"/><g fill="white" transform="translate({tx} {ty}) scale({scale})">{mark_paths}</g></svg>\n'
(out.parents[1] / "icon.svg").write_text(icon)
print(f"Extracted {len(paths)} original outlined paths; logo bounds {view}")
