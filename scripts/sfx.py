#!/usr/bin/env python3
"""Synthesise the cartoon's sound effects, then mix them under each line.

A cartoon is punctuated by sound: a pop when a character appears, a whoosh when
one dashes, a thud when something lands. Nothing here is sampled — every cue is
built from sine tones and filtered noise with ffmpeg, so the repo stays tiny and
the mix is deterministic.

    python3 scripts/sfx.py --out public/sfx
"""

from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

SR = 44100

# name -> ffmpeg lavfi source chain producing 1 second (or the given length)
CUES = {
    # short bright pop for an appearance / a bubble
    "pop": "sine=frequency=760:duration=0.09,volume=0.55,afade=t=out:st=0.03:d=0.06",
    # two-note ding for a realisation
    "ding": "sine=frequency=880:duration=0.5,volume=0.35,afade=t=out:st=0.12:d=0.38",
    # airy sweep for a dash
    "whoosh": (
        "anoisesrc=color=pink:duration=0.45:amplitude=0.6,"
        "highpass=f=300,lowpass=f=2600,volume=0.5,"
        "afade=t=in:st=0:d=0.12,afade=t=out:st=0.22:d=0.23"
    ),
    # heavy landing
    "thud": "sine=frequency=72:duration=0.3,volume=0.9,afade=t=out:st=0.02:d=0.28",
    # water burst
    "splash": (
        "anoisesrc=color=white:duration=0.6:amplitude=0.8,"
        "lowpass=f=1800,volume=0.45,"
        "afade=t=in:st=0:d=0.03,afade=t=out:st=0.2:d=0.4"
    ),
    # teeth clack
    "snap": "sine=frequency=1500:duration=0.05,volume=0.5,afade=t=out:st=0.01:d=0.04",
    # two-beat heart
    "heartbeat": (
        "sine=frequency=58:duration=0.14,volume=1.0,afade=t=out:st=0.03:d=0.11,"
        "adelay=180|180"
    ),
    # rope and net under strain
    "creak": (
        "anoisesrc=color=brown:duration=0.8:amplitude=0.5,"
        "bandpass=f=420:width_type=h:w=180,volume=0.5,"
        "tremolo=f=9:d=0.6,afade=t=out:st=0.5:d=0.3"
    ),
    # low menace
    "rumble": "anoisesrc=color=brown:duration=1.0:amplitude=0.7,lowpass=f=180,volume=0.55,afade=t=out:st=0.5:d=0.5",
    # rubbery squeeze
    "squeeze": "sine=frequency=300:duration=0.7,volume=0.4,afade=t=in:st=0:d=0.1,afade=t=out:st=0.3:d=0.4,vibrato=f=14:d=0.4",
    # crab claws
    "click": "sine=frequency=2100:duration=0.035,volume=0.4,afade=t=out:st=0.008:d=0.027",
    # a small crowd cheering: three stacked tones in one expression source
    "cheer": (
        "aevalsrc=0.18*sin(2*PI*523*t)+0.14*sin(2*PI*659*t)+0.1*sin(2*PI*784*t):d=0.8:s=44100,"
        "afade=t=in:st=0:d=0.08,afade=t=out:st=0.45:d=0.35"
    ),
}


def build(name: str, chain: str, out_dir: Path) -> Path:
    dest = out_dir / f"{name}.wav"
    cmd = [
        "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
        "-f", "lavfi", "-i", chain,
        "-ar", str(SR), "-ac", "1", str(dest),
    ]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0 or not dest.exists():
        sys.exit(f"sfx {name} failed: {r.stderr[:400]}")
    return dest


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="public/sfx")
    args = ap.parse_args()
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)
    for name, chain in CUES.items():
        p = build(name, chain, out_dir)
        print(f"  {name:<10} {p.stat().st_size // 1024} KB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
