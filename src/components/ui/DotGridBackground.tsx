import { useEffect, useRef } from "react";

/**
 * Full-bleed, mouse-reactive dot-grid background.
 * Drop it as the first child of a `relative` section, absolutely
 * positioned behind your content — e.g.:
 *
 *   <section className="relative overflow-hidden">
 *     <DotGridBackground />
 *     <div className="relative z-10">...your content...</div>
 *   </section>
 *
 * Dots sit on a transparent canvas so your page's own bg-background
 * shows through; only the dots themselves are drawn.
 */

const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

varying vec2 v_texCoord;

void main() {
  // Normalize so dots stay circular regardless of aspect ratio
  float minDim = min(u_resolution.x, u_resolution.y);
  vec2 uv = v_texCoord * u_resolution / minDim;
  vec2 mouse = u_mouse / minDim;

  // Grid density — higher = smaller, tighter dots
  float gridSize = 100.0;

  vec2 cellUv = fract(uv * gridSize) - 0.5;
  vec2 cellId = floor(uv * gridSize);

  // Distance from this dot's cursor to the mouse, used to drive glow/size
  float distToMouse = distance(uv, mouse);
  float mouseGlow = smoothstep(0.16, 0.0, distToMouse);

  // Gentle ambient breathing so the grid isn't static when idle
  float breathe = sin(u_time * 0.6 + cellId.x * 0.6 + cellId.y * 0.6) * 0.5 + 0.5;

  float baseRadius = 0.035 + breathe * 0.015;
  float radius = mix(baseRadius, 0.12, mouseGlow);

  float dot = 1.0 - smoothstep(radius, radius + 0.03, length(cellUv));

  // Brand color — Maple Matrix primary orange (#f97316)
  vec3 dotColor = vec3(0.976, 0.451, 0.086);

 float baseAlpha = 0.08 + breathe * 0.03;
  float alpha = dot * mix(baseAlpha, 0.9, mouseGlow);

  gl_FragColor = vec4(dotColor, alpha);
}
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

export default function DotGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext("webgl", { alpha: true }) ||
      canvas.getContext("experimental-webgl", {
        alpha: true,
      })) as WebGLRenderingContext | null;
    if (!gl) return;

    function syncSize() {
      const w = canvas!.clientWidth || 1280;
      const h = canvas!.clientHeight || 720;
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
      }
    }

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(syncSize)
        : null;
    resizeObserver?.observe(canvas);
    syncSize();

    const program = gl.createProgram()!;
    gl.attachShader(
      program,
      compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER),
    );
    gl.attachShader(
      program,
      compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER),
    );
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const positionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    function handleMouseMove(event: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = (event.clientX - rect.left) / rect.width;
      const ny = 1.0 - (event.clientY - rect.top) / rect.height;
      mouse.x = nx * canvas!.width;
      mouse.y = ny * canvas!.height;
    }
    window.addEventListener("mousemove", handleMouseMove);

    let rafId = 0;
    function render(t: number) {
      if (!resizeObserver) syncSize();
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      if (uTime) gl!.uniform1f(uTime, t * 0.001);
      if (uResolution)
        gl!.uniform2f(uResolution, canvas!.width, canvas!.height);
      if (uMouse) gl!.uniform2f(uMouse, mouse.x, mouse.y);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(render);
    }
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver?.disconnect();
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
