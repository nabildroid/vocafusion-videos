import "./index.css";
import { AbsoluteFill, Composition } from "remotion";
import { MyComposition, SequanceSchema } from "./Composition";

const fps = 30;
const durationsInSecons = 0 + 7-3;
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TikTok"
        component={MyComposition}
        schema={SequanceSchema}
        durationInFrames={durationsInSecons * fps}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          title: "take responsibility of your self 💛💛",
          level: "Level A1",
          content:
            "Life is not always easy. There will be times when no one is there to guide you. No one will push you to wake up early. No one will remind you to chase your dreams. You must be the one to take action. You must learn to rely on yourself. Because if you wait for others, you will wait forever. People have their own struggles, their own lives. They may love you, but they cannot live for you. You must be strong enough to face challenges alone",
        }}
      />
    </>
  );
};
