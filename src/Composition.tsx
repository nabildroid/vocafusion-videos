import { Audio, AbsoluteFill, Sequence, staticFile } from "remotion";
import { TitleSequence } from "./sequences/titleSequence";
import { LevelSequence } from "./sequences/levelSequance";
import { TextSequence } from "./sequences/textSequence";

import { z } from "zod";

export const SequanceSchema = z.object({
  title: z.string().default("Hi"),
  level: z.string().default("Level A1"),
  content: z
    .string()
    .default(
      "Life is not always easy. There will be times when no one is there to guide you. No one will push you to wake up early. No one will remind you to chase your dreams. You must be the one to take action. You must learn to rely on yourself. Because if you wait for others, you will wait forever. People have their own struggles, their own lives. They may love you, but they cannot live for you. You must be strong enough to face challenges alone",
    ),
});

export type ISequenceSchema = z.infer<typeof SequanceSchema>;

export const MyComposition = (props: ISequenceSchema) => {
  return (
    <AbsoluteFill className="bg-black">
      <Sequence name="Title">
        <TitleSequence val={props.title} />
      </Sequence>

      <Sequence name="Level">
        <LevelSequence val={props.level} />
      </Sequence>

      <Sequence name="Text">
        
        <TextSequence val={props.content} />
      </Sequence>

      
      <Sequence name="ImproveAudio" from={15}>
        <Audio src={staticFile("improve.mp3")} />
      </Sequence>
      <Sequence name="Music" from={30 * 2}>
        <Audio src={staticFile("music.mp3")} />
      </Sequence>
    </AbsoluteFill>
  );
};
