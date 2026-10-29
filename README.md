# तीन दिल — Teen Dil

A five minute Hindi cartoon about a small octopus who is embarrassed by his own body
until the night it saves the whole reef.

1920×1080, 30 fps, ~5.07 minutes. Built with Remotion; the scenes are CSS 3D — a
perspective camera, real depth layers (`translateZ`), and characters shaded with
radial gradients so they read as volumes rather than flat cut-outs.

## Cast and voices

Two clean Hindi Piper voices are shaped into five distinct characters. Each character
is a base voice plus its own pace (`--length-scale`) and pitch (ffmpeg `asetrate` +
`atempo`, so the pitch moves but the written pace is kept). Every line has its own
WAV, so one scene can be Moti and the next the barracuda.

| Character | Base voice | Pace | Pitch |
|---|---|---|---|
| सूत्रधार (narrator) | `hi_IN-pratham-medium` | 1.06 | 0.96 |
| मोती (young octopus) | `hi_IN-priyamvada-medium` | 0.97 | 1.14 |
| दादी कछुई (grandmother turtle) | `hi_IN-priyamvada-medium` | 1.18 | 0.87 |
| चिमटी (clownfish friend) | `hi_IN-priyamvada-medium` | 0.94 | 1.28 |
| टूथू (barracuda) | `hi_IN-pratham-medium` | 1.07 | 0.83 |

## Structure

```
narration.json          the script: 27 scenes, each tagged with its character
scripts/tts_hi.py       per-character voice shaping → public/audio/*.wav → src/manifest.json
src/three.tsx           3D stage, sea, octopus, turtle, fish, barracuda, crab, net, speech bubbles
src/scenes.tsx          one component per scene, exported as SCENES
src/Video.tsx           sequences the scenes and drops each scene's audio underneath
.github/workflows/render.yml   voices → typecheck → render → verify → artifact
```

Scene length is derived from the measured audio, never typed by hand: `tts_hi.py`
writes `frames = round((seconds + pad) * fps)` into the manifest.

## Render

Push to `main` (or run the workflow manually). The artifact `teen-dil` holds the MP4
and the joined narration track.

## The story

Ordinary world → the mockery → the grandmother's explanation of the three hearts, the
blue blood, the tasting arms → her warning about nets → the storm, the net, the friend
trapped → the barracuda flees → Moti flattens through a gap, camouflages, untangles the
net with eight arms → the three hearts carry him → the net is hauled up → rescue,
apology, celebration → recap.

The facts are real (two branchial hearts plus one systemic, haemocyanin-based blue
blood, chemoreceptors on the arms, hearts that stop during jetting) but they are there
to serve the story, not the other way round.
