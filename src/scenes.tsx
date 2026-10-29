import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import {
  Barracuda,
  Bubbles,
  Crab,
  Fish,
  Heart,
  Layer,
  Narr,
  Net,
  Octo,
  RockGap,
  Say,
  Sea,
  Stage,
  Turtle,
  Vignette,
} from "./three";
import { body, display, theme } from "./theme";

export type SceneProps = { dur: number };

/** A slow camera drift + dolly, so every shot reads as a space, not a flat card. */
const cam = (frame: number, dur: number) => ({
  yaw: Math.sin(frame / 105) * 4.5,
  pitch: -1.5 + Math.sin(frame / 138) * 1.2,
  zoom: 4 + (34 * frame) / Math.max(1, dur),
});

/* 01 — title ------------------------------------------------------- */
const S01Title: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c = cam(frame, dur);
  return (
    <Stage {...c} ui={<>
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: 130,
      textAlign: "center",
      opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      transform: `translateY(${interpolate(frame, [0, 24], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
    }}
  >
    <div
      style={{
        fontFamily: body,
        fontWeight: 800,
        fontSize: 156,
        lineHeight: 1.05,
        color: theme.gold,
        textShadow:
          "0 8px 0 rgba(120,60,10,.35), 0 24px 54px rgba(0,0,0,.6), 0 0 90px rgba(253,230,138,.5)",
      }}
    >
      तीन दिल
    </div>
    <div
      style={{
        marginTop: 6,
        fontFamily: body,
        fontWeight: 600,
        fontSize: 52,
        color: theme.cream,
        opacity: interpolate(frame, [12, 30], [0, 0.95], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        textShadow: "0 6px 22px rgba(0,0,0,.6)",
      }}
    >
      एक छोटे ऑक्टोपस की कहानी
    </div>
  </div>
      </>}>
      <Sea mood="day" />
      <Bubbles n={24} />
      <Layer z={-300}>
        <Octo y={250} scale={1.35} mood="calm" />
      </Layer>
      <Vignette strength={0.45} />
    </Stage>
  );
};

/* 02 — the reef ---------------------------------------------------- */
const S02Reef: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c = cam(frame, dur);
  return (
    <Stage {...c} ui={<><Narr text="लाल चट्टानों के बीच रहता था मोती।" /></>}>
      <Sea mood="day" />
      <Bubbles n={28} />
      <Layer z={-250}>
        <Fish x={-520} y={-160} scale={0.7} flip phase={0.4} />
        <Fish x={540} y={-70} scale={0.55} colour={theme.teal} phase={2.1} />
        <Fish x={-380} y={104} scale={0.45} colour="#f7c948" phase={3.4} />
      </Layer>
      <Layer z={120}>
        <Octo y={130} scale={0.95} mood="calm" />
      </Layer>
      <Vignette strength={0.4} />
    </Stage>
  );
};

/* 03 — morning camouflage ----------------------------------------- */
const S03Morning: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c = cam(frame, dur);
  const s = interpolate(frame, [24, 76], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <Stage {...c} ui={<><Say name="मोती" text="कोई मुझे देखे, तो मैं पत्थर बन जाता हूँ।" x={140} y={104} w={820} /></>}>
      <Sea mood="day" />
      <Bubbles n={22} />
      <Layer z={-200}>
        <RockGap x={-40} y={140} scale={1.05} />
      </Layer>
      <Layer z={150}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            filter: `saturate(${1 - 0.9 * s}) brightness(${1 - 0.32 * s})`,
          }}
        >
          <Octo y={210} scale={0.95} mood="calm" />
        </div>
      </Layer>
      <Layer z={-300}>
        <Fish x={560} y={-140} scale={0.5} colour="#f7c948" flip phase={1.4} />
      </Layer>
      <Vignette strength={0.4} />
    </Stage>
  );
};

/* 04 — Chimti, his friend ----------------------------------------- */
const S04Friend: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c = cam(frame, dur);
  const hop = Math.abs(Math.sin(frame / 13)) * 18;
  return (
    <Stage {...c} ui={<><Say
        name="चिमटी"
        colour={theme.coralDeep}
        text="मोती! आज तुम किस रंग के हो? मुझे तुम्हारा हर रंग पसंद है।"
        x={140}
        y={104}
        w={880}
      /></>}>
      <Sea mood="day" />
      <Bubbles n={26} />
      <Layer z={-120}>
        <Fish x={-470} y={-110 - hop} scale={0.6} stripe phase={0.9} />
      </Layer>
      <Layer z={140}>
        <Octo x={260} y={230} scale={0.95} mood="happy" />
      </Layer>
      <Vignette strength={0.36} />
    </Stage>
  );
};

/* 05 — three hearts ------------------------------------------------ */
const S05Hearts: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c = cam(frame, dur);
  return (
    <Stage {...c} ui={<><Say name="मोती" text="मेरे तीन दिल हैं! एक यहाँ, दो यहाँ।" x={120} y={104} w={820} /></>}>
      <Sea mood="dusk" />
      <Bubbles n={20} />
      <Layer z={100}>
        <Octo y={230} scale={1.2} mood="calm" showHearts />
      </Layer>
      <Vignette strength={0.4} />
    </Stage>
  );
};

/* 06 — the barracuda mocks ---------------------------------------- */
const S06Mock: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c = cam(frame, dur);
  return (
    <Stage {...c} ui={<><Say name="टूथू" colour={theme.rockLight} text="तुम इस समुद्र के सबसे बेतुके जीव हो!" x={120} y={104} w={860} /></>}>
      <Sea mood="dusk" />
      <Bubbles n={18} />
      <Layer z={-100}>
        <Octo x={-430} y={200} scale={0.72} mood="sad" />
      </Layer>
      <Layer z={160}>
        <Barracuda x={210} y={-60} scale={0.95} flip phase={1.2} />
      </Layer>
      <Vignette strength={0.45} />
    </Stage>
  );
};

/* 07 — grandmother turtle explains -------------------------------- */
const S07Dadi: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c = cam(frame, dur);
  return (
    <Stage {...c} ui={<><Say
        name="दादी कछुई"
        colour="#5f7f45"
        text="दो दिल गलफड़ों को खून पहुँचाते हैं। तीसरा दिल बाकी शरीर को।"
        x={140}
        y={104}
        w={900}
      /></>}>
      <Sea mood="day" />
      <Bubbles n={22} />
      <Layer z={-120}>
        <Octo x={-400} y={230} scale={0.78} mood="calm" />
      </Layer>
      <Layer z={140}>
        <Turtle x={330} y={150} scale={0.95} />
      </Layer>
      <Vignette strength={0.4} />
    </Stage>
  );
};

/* 08 — blue blood -------------------------------------------------- */
const S08Blood: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c = cam(frame, dur);
  return (
    <Stage {...c} ui={<><Say
        name="दादी कछुई"
        colour="#5f7f45"
        text="तेरा खून नीला है, क्योंकि उसमें लोहे की जगह ताँबा है।"
        x={140}
        y={104}
        w={880}
      /></>}>
      <Sea mood="night" />
      <Bubbles n={18} />
      <Layer z={-80}>
        <Octo x={420} y={200} scale={0.8} mood="calm" />
      </Layer>
      <Layer z={220}>
        {[0, 1, 2].map((i) => (
          <Heart
            key={i}
            x={600 + i * 140}
            y={430 + (i === 1 ? 40 : 0)}
            size={i === 1 ? 96 : 82}
            delay={i * 6}
            colour={theme.blue}
          />
        ))}
      </Layer>
      <Vignette strength={0.55} />
    </Stage>
  );
};

/* 09 — tasting arms ------------------------------------------------ */
const S09Taste: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c = cam(frame, dur);
  return (
    <Stage {...c} ui={<><Say name="मोती" text="मेरे हाथ चख भी सकते हैं! हज़ारों स्वाद केंद्र।" x={140} y={104} w={860} /></>}>
      <Sea mood="day" />
      <Bubbles n={24} />
      <Layer z={160}>
        <Octo y={210} scale={1.15} mood="happy" />
      </Layer>
      <Layer z={300}>
        {[
          [-300, 470],
          [-190, 520],
          [200, 505],
          [310, 455],
        ].map(([tx, ty], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 960 + tx,
              top: ty,
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 30%, #fff7ea, #f0b429)",
              boxShadow: "0 0 22px rgba(253,230,138,.85)",
              opacity: 0.5 + 0.5 * Math.abs(Math.sin(frame / 18 + i)),
            }}
          />
        ))}
      </Layer>
      <Vignette strength={0.38} />
    </Stage>
  );
};

/* 10 — eight arms, with suckers ----------------------------------- */
const S10Arms: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c = cam(frame, dur);
  return (
    <Stage {...c} ui={<><Say name="मोती" text="आठ हाथ, और हर हाथ पर चूसने वाले कप।" x={140} y={104} w={820} /></>}>
      <Sea mood="dusk" />
      <Bubbles n={20} />
      <Layer z={140}>
        <Octo y={190} scale={1.05} mood="calm" />
      </Layer>
      <Layer z={320}>
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (-104 + i * 29.5) * (Math.PI / 180);
          const wig = Math.sin(frame / 13 + i * 0.85) * 10;
          const ang = a + (wig * Math.PI) / 180;
          const r = 250;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 960 + Math.sin(ang) * r * 1.05,
                top: 540 + 130 + Math.cos(ang) * r * 0.55,
                width: 22,
                height: 22,
                borderRadius: "50%",
                border: "3px solid rgba(255,240,220,.85)",
                background: "rgba(255,240,220,.28)",
                opacity: 0.55 + 0.45 * Math.abs(Math.sin(frame / 14 + i * 0.7)),
              }}
            />
          );
        })}
      </Layer>
      <Vignette strength={0.42} />
    </Stage>
  );
};

/* 11 — the third heart stops -------------------------------------- */
const S11Stop: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c = cam(frame, dur);
  return (
    <Stage {...c} ui={<><Say
        name="दादी कछुई"
        colour="#5f7f45"
        text="तेज़ तैरने पर तीसरा दिल रुक जाता है। इसीलिए तू रेंगता है।"
        x={140}
        y={104}
        w={900}
      /></>}>
      <Sea mood="dusk" />
      <Bubbles n={20} />
      <Layer z={120}>
        <Octo y={250} scale={1.05} mood="calm" />
      </Layer>
      <Layer z={300}>
        <Heart x={865} y={300} size={92} delay={0} colour={theme.coral} />
        <Heart x={965} y={300} size={92} delay={6} colour={theme.coral} />
        <Heart x={1065} y={300} size={92} delay={10} colour={theme.coral} dim />
      </Layer>
      <Vignette strength={0.42} />
    </Stage>
  );
};

/* 12 — Dadi's warning --------------------------------------------- */
const S12Warning: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c = cam(frame, dur);
  return (
    <Stage {...c} ui={<><Say
        name="दादी कछुई"
        colour="#5f7f45"
        text="जाल में जितना हिलोगे, उतना उलझोगे। शांत रहना, और रास्ता ढूँढना।"
        x={140}
        y={104}
        w={920}
      /></>}>
      <Sea mood="dusk" />
      <Bubbles n={16} />
      <Layer z={-160}>
        <Net y={-430} w={1500} h={520} rotate={-3} opacity={0.22} />
      </Layer>
      <Layer z={-120}>
        <Octo x={-400} y={240} scale={0.78} mood="calm" />
      </Layer>
      <Layer z={140}>
        <Turtle x={340} y={170} scale={0.9} phase={0.7} />
      </Layer>
      <Vignette strength={0.5} />
    </Stage>
  );
};

/* 13 — the storm and the net -------------------------------------- */
const S13Storm: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c = cam(frame, dur);
  const drop = interpolate(frame, [10, 90], [-700, 60], { extrapolateRight: "clamp" });
  return (
    <Stage {...c} ui={<><Narr text="उस रात जाल चट्टानों पर गिरा।" /></>}>
      <Sea mood="storm" />
      <Bubbles n={30} speed={1.6} />
      <Layer z={0}>
        <Net y={drop} rotate={-4} />
        <Fish x={-90} y={110} scale={0.6} stripe phase={0.2} />
        <Fish x={90} y={150} scale={0.5} colour="#f7c948" phase={1.7} />
        <Fish x={-30} y={190} scale={0.45} colour={theme.teal} phase={2.9} />
      </Layer>
      <Vignette strength={0.7} />
    </Stage>
  );
};

/* 14 — Chimti is trapped ------------------------------------------ */
const S14Trapped: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c = cam(frame, dur);
  return (
    <Stage {...c} ui={<><Say
        name="चिमटी"
        colour={theme.coralDeep}
        text="मोती! मैं फँस गई! रस्सी मेरे पंखों में उलझ गई है!"
        x={140}
        y={104}
        w={880}
      /></>}>
      <Sea mood="storm" />
      <Bubbles n={24} speed={1.4} />
      <Layer z={0}>
        <Net y={104} rotate={3} />
        <Fish x={40} y={140} scale={0.62} stripe phase={0.6} />
      </Layer>
      <Vignette strength={0.68} />
    </Stage>
  );
};

/* 15 — the barracuda runs away ------------------------------------ */
const S15Flee: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c = cam(frame, dur);
  return (
    <Stage {...c} ui={<><Say
        name="टूथू"
        colour={theme.rockLight}
        text="मैं यहाँ नहीं रुकता। यह जाल मेरे दाँतों से बड़ा है!"
        x={140}
        y={104}
        w={860}
      /></>}>
      <Sea mood="storm" />
      <Bubbles n={22} speed={1.3} />
      <Layer z={-100}>
        <Octo x={-520} y={230} scale={0.7} mood="scared" />
      </Layer>
      <Layer z={180}>
        <Barracuda x={260} y={-30} scale={0.9} phase={0.8} />
      </Layer>
      <Vignette strength={0.66} />
    </Stage>
  );
};

/* 16 — Moti decides ----------------------------------------------- */
const S16Plan: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c = cam(frame, dur);
  return (
    <Stage {...c} ui={<><Say
        name="मोती"
        text="मेरे पास हड्डियाँ नहीं हैं। जिस छेद से मछली नहीं निकले, उससे मैं निकलूँगा।"
        x={140}
        y={104}
        w={900}
      /></>}>
      <Sea mood="dusk" />
      <Bubbles n={20} />
      <Layer z={-200}>
        <RockGap x={330} y={120} scale={0.9} />
      </Layer>
      <Layer z={160}>
        <Octo x={-430} y={220} scale={0.85} mood="calm" />
      </Layer>
      <Vignette strength={0.46} />
    </Stage>
  );
};

/* 17 — squeezing through the gap ---------------------------------- */
const S17Squeeze: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c = cam(frame, dur);
  const flat = interpolate(frame, [20, 70], [0, 0.92], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = interpolate(frame, [30, 150], [-560, 330], { extrapolateRight: "clamp" });
  return (
    <Stage {...c} ui={<><Narr text="मोती रस्सी जैसा पतला होकर अंदर सरक गया।" /></>}>
      <Sea mood="dusk" />
      <Bubbles n={18} />
      <Layer z={-200}>
        <RockGap x={330} y={120} scale={0.9} />
      </Layer>
      <Layer z={160}>
        <Octo x={x} y={230} scale={0.8} mood="calm" flat={flat} />
      </Layer>
      <Vignette strength={0.5} />
    </Stage>
  );
};

/* 18 — inside the net, in the dark -------------------------------- */
const S18Inside: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c = cam(frame, dur);
  const torch = 0.35 + 0.25 * Math.sin(frame / 26);
  return (
    <Stage {...c} ui={<><Say name="मोती" text="अंधेरा था। मैंने हाथों से गाँठ पहचानी। हर गाँठ का एक सिरा होता है।" x={140} y={104} w={940} /></>}>
      <Sea mood="storm" />
      <Bubbles n={14} speed={0.8} />
      <Layer z={-100}>
        <Octo y={250} scale={1.0} mood="scared" />
      </Layer>
      <Layer z={260}>
        <Net y={0} w={1700} h={900} rotate={6} opacity={0.85} />
      </Layer>
      <Layer z={400}>
        <div
          style={{
            position: "absolute",
            left: 560,
            top: 250,
            width: 800,
            height: 620,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(255,240,200,${torch * 0.22}) 0%, rgba(0,0,0,0) 68%)`,
          }}
        />
      </Layer>
      <Vignette strength={0.82} />
    </Stage>
  );
};

/* 19 — camouflage ------------------------------------------------ */
const S19Colour: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c = cam(frame, dur);
  const s = interpolate(frame, [40, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <Stage {...c} ui={<><Say name="मोती" text="मैंने रंग बदला। केकड़े ने मुझे नहीं पहचाना।" x={140} y={104} w={840} /></>}>
      <Sea mood="dusk" />
      <Bubbles n={18} />
      <Layer z={-200}>
        <RockGap x={420} y={130} scale={0.95} />
      </Layer>
      <Layer z={160}>
        <div style={{ position: "absolute", inset: 0, filter: `saturate(${1 - 0.85 * s}) brightness(${1 - 0.3 * s})` }}>
          <Octo x={-60} y={230} scale={0.95} mood="calm" />
        </div>
      </Layer>
      <Layer z={260}>
        <Crab x={420} y={-30} scale={0.8} />
      </Layer>
      <Vignette strength={0.5} />
    </Stage>
  );
};

/* 20 — eight arms untangle the net -------------------------------- */
const S20ArmsWork: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c = cam(frame, dur);
  return (
    <Stage {...c} ui={<><Say name="मोती" text="आठ हाथ, आठ काम। दो ने रस्सी पकड़ी, दो ने गाँठ खोली।" x={140} y={104} w={880} /></>}>
      <Sea mood="dusk" />
      <Bubbles n={20} />
      <Layer z={-150}>
        <Net y={-20} w={900} h={520} rotate={-6} opacity={0.55} />
      </Layer>
      <Layer z={180}>
        <Octo y={250} scale={1.0} mood="calm" />
      </Layer>
      <Vignette strength={0.48} />
    </Stage>
  );
};

/* 21 — three hearts working --------------------------------------- */
const S21HeartsWork: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c = cam(frame, dur);
  const glow = 0.35 + 0.25 * Math.abs(Math.sin(frame / 9));
  return (
    <Stage {...c} ui={<><Narr text="तीनों दिल ज़ोर से धड़के — वह थका नहीं।" /></>}>
      <Sea mood="dusk" />
      <Bubbles n={22} />
      <Layer z={100}>
        <Octo y={250} scale={1.1} mood="calm" />
      </Layer>
      <Layer z={320}>
        <div
          style={{
            position: "absolute",
            left: 700,
            top: 210,
            width: 520,
            height: 420,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(239,68,68,${glow}) 0%, rgba(239,68,68,0) 70%)`,
          }}
        />
        <Heart x={850} y={260} size={120} delay={0} colour="#ef4444" />
        <Heart x={960} y={300} size={110} delay={4} colour="#ef4444" />
        <Heart x={1060} y={260} size={100} delay={8} colour="#ef4444" />
      </Layer>
      <Vignette strength={0.46} />
    </Stage>
  );
};

/* 22 — the net is hauled up --------------------------------------- */
const S22Pulling: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c = cam(frame, dur);
  const lift = interpolate(frame, [0, dur], [110, -420]);
  const shake = Math.sin(frame / 3) * 6;
  return (
    <Stage {...c} ui={<><Narr text="तभी जाल ऊपर खिंचने लगा। मोती के पास कुछ ही पल थे।" /></>}>
      <Sea mood="storm" />
      <Bubbles n={40} speed={2.4} />
      <Layer z={0}>
        <Net y={lift} rotate={5} />
        <Fish x={-110 + shake} y={120} scale={0.6} stripe phase={0.4} />
        <Fish x={120 - shake} y={160} scale={0.5} colour="#f7c948" phase={2.2} />
        <Fish x={10} y={205} scale={0.45} colour={theme.teal} phase={3.1} />
      </Layer>
      <Vignette strength={0.75} />
    </Stage>
  );
};

/* 23 — Chimti is free --------------------------------------------- */
const S23Free: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c = cam(frame, dur);
  const hop = Math.abs(Math.sin(frame / 12)) * 26;
  return (
    <Stage {...c} ui={<><Say
        name="चिमटी"
        colour={theme.coralDeep}
        text="मैं निकल गई! मोती, तुम अजीब नहीं हो!"
        x={140}
        y={104}
        w={820}
      /></>}>
      <Sea mood="day" />
      <Bubbles n={30} />
      <Layer z={-120}>
        <Fish x={200} y={-80 - hop} scale={0.62} stripe phase={0.3} />
      </Layer>
      <Layer z={140}>
        <Octo x={-320} y={240} scale={0.95} mood="happy" />
      </Layer>
      <Vignette strength={0.36} />
    </Stage>
  );
};

/* 24 — the apology ------------------------------------------------- */
const S24Sorry: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c = cam(frame, dur);
  return (
    <Stage {...c} ui={<><Say
        name="टूथू"
        colour={theme.rockLight}
        text="माफ़ी माँगता हूँ। तुम्हारे तीन दिलों ने वह किया, जो मेरे दाँत नहीं कर सके।"
        x={140}
        y={104}
        w={900}
      /></>}>
      <Sea mood="day" />
      <Bubbles n={22} />
      <Layer z={120}>
        <Barracuda x={180} y={180} scale={0.9} flip phase={2.2} />
      </Layer>
      <Layer z={-100}>
        <Octo x={-460} y={230} scale={0.72} mood="calm" />
      </Layer>
      <Vignette strength={0.38} />
    </Stage>
  );
};

/* 25 — the reef celebrates ---------------------------------------- */
const S25Celebrate: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c = cam(frame, dur);
  return (
    <Stage {...c} ui={<><Narr text="उस रात पूरी चट्टान गाती रही।" /></>}>
      <Sea mood="dusk" />
      <Bubbles n={40} speed={1.5} />
      <Layer z={-260}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const ang = frame / 46 + (i * Math.PI) / 3;
          return (
            <Fish
              key={i}
              x={Math.cos(ang) * 560}
              y={Math.sin(ang) * 210 - 60}
              z={0}
              scale={0.42 + (i % 3) * 0.06}
              colour={["#ff8a3d", "#f7c948", theme.teal, "#ff8a3d", "#f7c948", theme.teal][i]}
              stripe={i % 2 === 0}
              phase={i}
            />
          );
        })}
      </Layer>
      <Layer z={120}>
        <Octo y={200} scale={1.05} mood="happy" showHearts />
      </Layer>
      <Layer z={-420}>
        <Barracuda x={700} y={-330} scale={0.55} flip phase={1.9} />
      </Layer>
      <Vignette strength={0.44} />
    </Stage>
  );
};

/* 26 — grandmother's line ----------------------------------------- */
const S26Proud: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c = cam(frame, dur);
  return (
    <Stage {...c} ui={<><Say
        name="दादी कछुई"
        colour="#5f7f45"
        text="तीन दिल, नीला खून, आठ हाथ। यह गलती नहीं है। यह डिज़ाइन है।"
        x={140}
        y={104}
        w={900}
      /></>}>
      <Sea mood="day" />
      <Bubbles n={24} />
      <Layer z={-120}>
        <Octo x={-380} y={250} scale={0.9} mood="happy" />
      </Layer>
      <Layer z={140}>
        <Turtle x={340} y={170} scale={0.92} phase={1.4} />
      </Layer>
      <Vignette strength={0.36} />
    </Stage>
  );
};

/* 27 — recap ------------------------------------------------------- */
const S27Recap: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c = cam(frame, dur);
  return (
    <Stage {...c} ui={<><Narr text="हर अजीब चीज़, किसी न किसी दिन, किसी की जान बचाती है।" /></>}>
      <Sea mood="dusk" />
      <Bubbles n={26} />
      <Layer z={-260}>
        <Turtle x={-560} y={-120} scale={0.6} phase={0.5} />
        <Fish x={560} y={-140} scale={0.5} stripe phase={1.1} />
        <Barracuda x={620} y={120} scale={0.55} flip phase={2.4} />
      </Layer>
      <Layer z={120}>
        <Octo y={190} scale={1.05} mood="happy" showHearts />
      </Layer>
      <Vignette strength={0.42} />
    </Stage>
  );
};

export const SCENES: Record<string, React.FC<SceneProps>> = {
  "01-title": S01Title,
  "02-reef": S02Reef,
  "03-morning": S03Morning,
  "04-friend": S04Friend,
  "05-hearts": S05Hearts,
  "06-mock": S06Mock,
  "07-dadi": S07Dadi,
  "08-blood": S08Blood,
  "09-taste": S09Taste,
  "10-arms": S10Arms,
  "11-stop": S11Stop,
  "12-warning": S12Warning,
  "13-storm": S13Storm,
  "14-trapped": S14Trapped,
  "15-flee": S15Flee,
  "16-plan": S16Plan,
  "17-squeeze": S17Squeeze,
  "18-inside": S18Inside,
  "19-colour": S19Colour,
  "20-arms-work": S20ArmsWork,
  "21-hearts-work": S21HeartsWork,
  "22-pulling": S22Pulling,
  "23-free": S23Free,
  "24-sorry": S24Sorry,
  "25-celebrate": S25Celebrate,
  "26-proud": S26Proud,
  "27-recap": S27Recap,
};
