import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
// import { OpenSans } from "..";

export function TextSequence(props: { val: string }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = interpolate(frame, [0, durationInFrames], [0, 1]);

  return (
    <div
      style={{
        transform: `translateY(${enter * -110}%)`,
        // fontFamily: OpenSans,
      }}
      className=" px-28 top-[70%] antialiased absolute text-balance text-center text-white text-6xl font-medium leading-relaxed"
    >
      {props.val.split(".").map((line, i) => (
        <>
          <p key={i}>{line}</p>
          <br />
        </>
      ))}
    </div>
  );
}
