import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";

export function TitleSequence(props:{
  val:string
}) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({
    fps,
    frame,
    durationInFrames: fps *5,
    config: {
      damping: 200,
    },
  });

  return (
    
      <div
      style={{
        top:`calc(50% - ${enter * 40}%)`,
      }}
      className="w-full bg-black z-20 -translate-y-1/2 flex flex-col items-center justify-center absolute py-4 px-12">
        <h1 className="text-white text-center leading-relaxed text-8xl font-medium text-balance ">
            {props.val}
        </h1>
        
      </div>
    
  );
}
