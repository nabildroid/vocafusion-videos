import { Audio, AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { TitleSequence } from "./sequences/titleSequence";
import { LevelSequence } from "./sequences/levelSequance";
import { TextSequence } from "./sequences/textSequence";
import { useEffect, useRef } from "react";

import { z } from "zod";

// WebGL Shader Effect Component
const ShaderEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const gl = canvas.getContext('webgl');
    if (!gl) return;
    
    // Vertex shader
    const vsSource = `
      attribute vec4 position;
      void main() {
          gl_Position = position;
      }
    `;
    
    // Fragment shader
    const fsSource = `
      precision mediump float;
      uniform vec2 resolution;
      uniform float time;

      void main() {
          vec2 uv = gl_FragCoord.xy/resolution;
          vec3 color = 0.5 + 0.5*cos(time+uv.xyx+vec3(0,2,4));
          gl_FragColor = vec4(color, 0.2); // Using 0.2 alpha for subtle effect
      }
    `;
    
    // Create shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertexShader) return;
    gl.shaderSource(vertexShader, vsSource);
    gl.compileShader(vertexShader);
    
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) return;
    gl.shaderSource(fragmentShader, fsSource);
    gl.compileShader(fragmentShader);
    
    // Create program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    // Create buffers for a full-screen triangle
    const positions = new Float32Array([-1, -1, 3, -1, -1, 3]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    
    // Resize canvas to match container
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    
    // Set uniforms
    gl.useProgram(program);
    const resolutionLoc = gl.getUniformLocation(program, 'resolution');
    gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
    
    const timeLoc = gl.getUniformLocation(program, 'time');
    gl.uniform1f(timeLoc, frame * 0.03); // Use frame for animation
    
    // Set attributes
    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    
    // Enable blending for transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    
  }, [frame]); // Re-render on frame change
  
  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 100,
        pointerEvents: 'none',
      }}
    />
  );
};

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
      
      {/* Add shader overlay */}
      <ShaderEffect />
    </AbsoluteFill>
  );
};
