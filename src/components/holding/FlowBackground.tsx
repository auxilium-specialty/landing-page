import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const VERTEX = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

/**
 * Domain-warped noise: the noise field is pushed around by two more noise
 * fields, each drifting on its own, so the light pools, curls and runs in every
 * direction like water rather than sliding one way. Colors stay within the
 * brand gradient (--brand-deep, --brand-mid, --brand-light), so the cream text
 * keeps its contrast wherever the light moves.
 */
const FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 r;
uniform float t;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 p = gl_FragCoord.xy / r.y * 0.85;
  vec2 q = vec2(fbm(p + vec2(0.0, t * 0.05)), fbm(p + vec2(5.2, 1.3) - vec2(t * 0.04, 0.0)));
  vec2 w = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 0.035),
                fbm(p + 3.0 * q + vec2(8.3, 2.8) - t * 0.03));
  float f = fbm(p + 3.0 * w);

  vec3 deep = vec3(0.110, 0.267, 0.224);
  vec3 mid = vec3(0.153, 0.380, 0.318);
  vec3 light = vec3(0.255, 0.486, 0.424);
  vec3 col = mix(deep, mid, smoothstep(0.2, 0.6, f));
  col = mix(col, light, smoothstep(0.45, 0.9, f + 0.3 * w.x - 0.1));
  gl_FragColor = vec4(col, 1.0);
}
`;

/** The field is soft, so drawing it at a fraction of the CSS size looks the same and costs far less. */
const SCALE = 0.5;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

function link(gl: WebGLRenderingContext) {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

/**
 * The holding page's background: the brand gradient flowing like water, drawn
 * with WebGL. Where WebGL is unavailable, or while the browser has taken the
 * context away (as it may for a background tab, until it gives it back), the
 * slow CSS gradient drift (.holding-flow) shows instead. Under reduced motion
 * the field is drawn once and holds still.
 */
export function FlowBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stop = () => {};

    const start = () => {
      stop();
      const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
      const program = gl && !gl.isContextLost() ? link(gl) : null;
      if (!gl || !program) return;
      gl.useProgram(program);

      // One triangle larger than the screen covers every pixel.
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, "p");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      const uRes = gl.getUniformLocation(program, "r");
      const uTime = gl.getUniformLocation(program, "t");

      const t0 = performance.now();
      let now = t0;
      let frame = 0;
      const draw = () => {
        gl.uniform2f(uRes, canvas.width, canvas.height);
        // Wrapped so the shader never works with a large, imprecise time value.
        gl.uniform1f(uTime, ((now - t0) / 1000) % 3600);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };
      // Resizing clears the canvas, so every resize draws straight away.
      const resize = () => {
        canvas.width = Math.max(1, Math.round(canvas.clientWidth * SCALE));
        canvas.height = Math.max(1, Math.round(canvas.clientHeight * SCALE));
        gl.viewport(0, 0, canvas.width, canvas.height);
        draw();
      };
      const loop = (time: number) => {
        now = time;
        draw();
        frame = requestAnimationFrame(loop);
      };

      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(canvas);
      if (!still) frame = requestAnimationFrame(loop);
      setReady(true);
      stop = () => {
        cancelAnimationFrame(frame);
        ro.disconnect();
      };
    };

    const onLost = (e: Event) => {
      e.preventDefault(); // asks the browser to restore the context later
      stop();
      setReady(false);
    };
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", start);
    start();

    // The context is left alive: the canvas keeps it for its lifetime, and a
    // remount (React's development double-mount included) reuses it.
    return () => {
      stop();
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", start);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="holding-flow absolute" />
      <canvas
        ref={canvasRef}
        className={cn(
          "absolute inset-0 h-full w-full transition-opacity duration-700",
          ready ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
