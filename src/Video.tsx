import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { manifest } from "./manifest";
import { SCENES } from "./shots";
import { Stage3D } from "./r3d/stage";
import { CastMember, Prop3D } from "./r3d/cast";
import { VoiceContext } from "./r3d/voice";
import { TitleCard } from "./ui";
import { theme } from "./theme";

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = Math.min(1, frame / Math.max(1, durationInFrames - 1));
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 8, background: "rgba(3,20,34,.45)" }}>
        <div style={{ width: `${p * 100}%`, height: "100%", background: `linear-gradient(90deg, ${theme.teal}, ${theme.gold})` }} />
      </div>
    </AbsoluteFill>
  );
};

/** One scene = one spoken line, cut into one or more camera shots. */
const SceneShots: React.FC<{ sceneId: string; total: number; env: string; speaker: string }> = ({
  sceneId,
  total,
  env,
  speaker,
}) => {
  const def = SCENES[sceneId];
  if (!def) return null;
  const n = def.shots.length;
  const each = Math.floor(total / n);
  let at = 0;

  return (
    <>
      {def.shots.map((shot, i) => {
        const dur = i === n - 1 ? total - at : each;
        const start = at;
        at += dur;
        return (
          <Sequence key={`${sceneId}-${i}`} from={start} durationInFrames={dur} name={`${sceneId} shot ${i + 1}`}>
            <VoiceContext.Provider value={{ env, offset: start }}>
              <Stage3D cam={shot.cam} dur={dur} mood={shot.mood} shake={shot.shake} punch={shot.punch}>
                {shot.gap ? <Prop3D p={shot.gap} kind="gap" dur={dur} /> : null}
                {shot.net ? <Prop3D p={shot.net} kind="net" dur={dur} /> : null}
                {shot.cast.map((c, j) => (
                  <CastMember key={j} c={c} dur={dur} speaker={speaker} />
                ))}
              </Stage3D>
            </VoiceContext.Provider>
          </Sequence>
        );
      })}
    </>
  );
};

export const Video: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{ background: theme.waterDeep }}>
      {manifest.scenes.map((scene) => {
        const start = from;
        from += scene.frames;
        const def = SCENES[scene.id];
        if (!def) return null;
        return (
          <Sequence
            key={scene.id}
            from={start}
            durationInFrames={scene.frames}
            name={`${scene.id} · ${scene.character} · ${scene.seconds.toFixed(1)}s`}
          >
            <Audio src={staticFile(scene.audio)} />
            <SceneShots sceneId={scene.id} total={scene.frames} env={scene.env ?? ""} speaker={scene.character} />
            {def.title ? <TitleCard main={def.title.main} sub={def.title.sub} /> : null}
          </Sequence>
        );
      })}
      <ProgressBar />
    </AbsoluteFill>
  );
};
