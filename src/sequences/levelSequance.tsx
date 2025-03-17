import { spring, useCurrentFrame, useVideoConfig } from "remotion";

export function LevelSequence(props:{
  val:string
}) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({
    fps,
    frame,
    durationInFrames: fps*2,
    delay:fps,
    config: {
      damping: 200,
    },
  });

  return (
    <div
      style={{
        top: `15%`,
        scale: 1-enter,
      }}
      className="text-black bg-white rounded-xl px-12 py-6 font-black text-7xl  absolute -translate-x-1/2 left-1/2"
    >
      {props.val}
    </div>
  );
}
