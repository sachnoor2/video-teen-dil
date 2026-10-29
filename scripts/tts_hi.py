#!/usr/bin/env python3
"""Multi-character Hindi narration for a cartoon.

Piper ships two Hindi voices (hi_IN-pratham-medium, male; hi_IN-priyamvada-medium,
female). A cartoon needs more than two people, so each character gets its own
combination of base voice, speaking pace (piper --length-scale) and pitch.

Pitch is moved with ffmpeg: asetrate changes pitch and speed together, then
atempo puts the duration back, so the character is higher or lower but still
speaks at its written pace. That is the standard cartoon-voice trick, and it
turns two clean Hindi voices into five clearly different characters.

Contract is identical to the template's tts.py / tts_kokoro.py: one WAV per
scene into public/audio/, then src/manifest.json written from the MEASURED
audio, never from a hand-typed duration.
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
AUDIO_DIR = ROOT / "public" / "audio"
MANIFEST = ROOT / "src" / "manifest.json"
NARRATION = ROOT / "narration.json"


def envelope(path: Path, fps: int) -> str:
    """One digit per video frame: how loud the voice is, 0-9. Drives the mouth."""
    import numpy as np

    with wave.open(str(path), "rb") as f:
        sr = f.getframerate()
        raw = f.readframes(f.getnframes())
    x = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
    win = max(1, int(sr / fps))
    rms = []
    for i in range(0, len(x), win):
        chunk = x[i:i + win]
        rms.append(float(np.sqrt((chunk ** 2).mean())) if len(chunk) else 0.0)
    if not rms:
        return "0"
    peak = float(np.percentile(rms, 95)) or 1.0
    out = []
    for v in rms:
        level = min(1.0, v / peak)
        out.append(str(int(round(level * 9))))
    return "".join(out)


def wav_seconds(path: Path) -> float:
    with wave.open(str(path), "rb") as f:
        return f.getnframes() / float(f.getframerate())


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--piper", required=True, help="path to the piper binary")
    ap.add_argument("--voices-dir", default=".voices", help="folder holding the .onnx voices")
    ap.add_argument("--narration", default=str(NARRATION))
    args = ap.parse_args()

    if not Path(args.piper).exists():
        sys.exit(f"piper binary not found at {args.piper}")
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        sys.exit("ffmpeg is required for the per-character pitch shaping")

    script = json.loads(Path(args.narration).read_text())
    characters = script["characters"]
    fps = int(script.get("fps", 30))
    pad = float(script.get("pad", 0.75))
    min_seconds = float(script.get("minSeconds", 4.0))
    voices_dir = Path(args.voices_dir)

    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    scenes = []
    total_frames = 0
    total_seconds = 0.0

    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        for item in script["scenes"]:
            scene_id = item["id"]
            text = " ".join(item["text"].split())
            who = item.get("character", "narrator")
            if who not in characters:
                sys.exit(f"scene {scene_id} names unknown character {who!r}")
            cfg = characters[who]
            model = voices_dir / cfg["model"]
            if not model.exists():
                sys.exit(f"missing voice model {model}")

            raw = tmp / f"{scene_id}.raw.wav"
            out = AUDIO_DIR / f"{scene_id}.wav"

            piper = subprocess.run(
                [
                    args.piper,
                    "-m", str(model),
                    "-f", str(raw),
                    "--length_scale", str(cfg.get("lengthScale", 1.0)),
                    "--sentence_silence", "0.22",
                ],
                input=text.encode("utf-8"),
                capture_output=True,
            )
            if piper.returncode != 0 or not raw.exists():
                sys.exit(f"piper failed on {scene_id}: {piper.stderr.decode('utf-8', 'replace')[:600]}")

            pitch = float(cfg.get("pitch", 1.0))
            gain = float(cfg.get("gain", 1.0))
            # asetrate shifts pitch and speed; atempo restores the duration.
            af = (
                f"asetrate=22050*{pitch:.5f},aresample=22050,"
                f"atempo={1.0 / pitch:.6f},volume={gain:.2f}"
            )
            ff = subprocess.run(
                [ffmpeg, "-y", "-hide_banner", "-loglevel", "error",
                 "-i", str(raw), "-af", af,
                 "-ar", "22050", "-ac", "1", str(out)],
                capture_output=True,
            )
            if ff.returncode != 0 or not out.exists():
                sys.exit(f"ffmpeg pitch shift failed on {scene_id}: {ff.stderr.decode('utf-8', 'replace')[:600]}")

            seconds = wav_seconds(out)
            frames = max(int(round(min_seconds * fps)), int(round((seconds + pad) * fps)))
            scenes.append({
                "id": scene_id,
                "audio": f"audio/{scene_id}.wav",
                "character": who,
                "seconds": round(seconds, 3),
                "frames": frames,
                "env": envelope(out, fps),
            })
            total_frames += frames
            total_seconds += seconds
            print(f"  {scene_id:<14} {who:<9} {seconds:6.2f}s -> {frames:4d} frames "
                  f"({frames / fps:5.2f}s on screen)")

    manifest = {
        "fps": fps,
        "engine": "piper-multivoice-hi",
        "lang": "hi",
        "totalSeconds": round(total_seconds, 3),
        "totalFrames": total_frames,
        "scenes": scenes,
    }
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n")
    (AUDIO_DIR / "list.txt").write_text("".join(f"file '{s['id']}.wav'\n" for s in scenes))

    print(f"\nnarration: {total_seconds:.1f}s of speech across {len(scenes)} scenes")
    print(f"video:     {total_frames} frames at {fps}fps = {total_frames / fps:.1f}s "
          f"({total_frames / fps / 60:.2f} min)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
