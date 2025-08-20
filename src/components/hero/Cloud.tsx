"use client";
import { useEffect, useRef } from "react";

function buildFragmentShader(): string {
	const speed = 0.5;
	const fbmOctavesInt = 6;

	const idleColorsArray = [
		[0.1, 0.1, 0.15],
		[0.15, 0.15, 0.2],
		[0.2, 0.2, 0.25],
		[0.25, 0.25, 0.3],
		[0.3, 0.3, 0.35],
		[0.35, 0.35, 0.4],
		[0.4, 0.4, 0.45],
		[0.45, 0.45, 0.5],
		[0.5, 0.5, 0.55],
		[0.55, 0.55, 0.6],
		[0.6, 0.6, 0.65],
		[0.65, 0.65, 0.7],
		[0.7, 0.7, 0.75],
		[0.75, 0.75, 0.8],
		[0.8, 0.8, 0.85],
		[0.85, 0.85, 0.9],
		[0.9, 0.9, 0.95],
		[0.95, 0.95, 1.0],
		[1.0, 1.0, 1.0],
		[0.9, 0.9, 0.95],
	]
		.map((c) => `vec3(${c[0]}, ${c[1]}, ${c[2]})`)
		.join(",\n  ");

	return `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 uResolution;
uniform float uTime;

#define NUM_COLORS 20
vec3 idleColors[NUM_COLORS] = vec3[](
  ${idleColorsArray}
);

vec3 permute(vec3 x){return mod(((x*34.0)+1.0)*x,289.0);}
float noise2D(vec2 v){
  const vec4 C = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i = floor(v + dot(v,C.yy));
  vec2 x0 = v - i + dot(i,C.xx);
  vec2 i1 = (x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
  i = mod(i,289.0);
  vec3 p = permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
  vec3 m = max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m*m*m;
  vec3 x = 2.*fract(p*C.www)-1.;
  vec3 h = abs(x)-0.5;
  vec3 ox = floor(x+0.5);
  vec3 a0 = x-ox;
  m *= 1.792843-0.853734*(a0*a0+h*h);
  vec3 g; g.x = a0.x*x0.x+h.x*x0.y; g.yz = a0.yz*x12.xz+h.yz*x12.yw;
  return 130.*dot(m,g);
}

float fbm(vec2 st){
  float val=0., amp=0.5, freq=1.;
  for(int i=0;i<${fbmOctavesInt};i++){val+=amp*noise2D(st*freq);freq*=2.;amp*=0.5;}
  return val;
}

float turbulence(vec2 st){
  float val=0., amp=0.5, freq=1.;
  for(int i=0;i<${fbmOctavesInt};i++){val+=amp*abs(noise2D(st*freq));freq*=2.;amp*=0.5;}
  return val;
}

void main(){
  vec2 uv = (gl_FragCoord.xy/uResolution.xy)*2.-1.;
  uv.x *= uResolution.x/uResolution.y;
  uv *= 2.0;

  float t = uTime*${speed};

  uv += vec2(0.05*turbulence(uv*1.5 + vec2(t,0.)), 0.05*turbulence(uv*1.5 + vec2(0.,t)));

  float r = length(uv);
  float angle = atan(uv.y,uv.x);
  angle += 0.1*exp(-r*0.5)*sin(t*0.3+r*3.);
  uv = vec2(cos(angle),sin(angle))*r;

  float dustNoise = fbm(uv*3.);
  float clusterNoise = fbm(uv*1.5+vec2(t*0.2,-t*0.15));
  float dustDensity = dustNoise + 0.5*clusterNoise + 0.3*turbulence(uv*8.+vec2(t,-t*0.5));

  float noiseVal = pow(0.5*(dustDensity+1.0),1.5);

  float idx = clamp(noiseVal,0.,1.)*float(NUM_COLORS-1);
  int iLow=int(floor(idx));
  int iHigh=int(min(float(iLow+1),float(NUM_COLORS-1)));
  float f = fract(idx);
  vec3 color = mix(idleColors[iLow], idleColors[iHigh], f);

  float alpha = mix(0.5, 0.9, noiseVal); // Ensure alpha never too low
  alpha *= 1.0 - smoothstep(0.8,2.5,length(uv*0.4));
  alpha = max(alpha,0.4); // Minimum opacity

  color = mix(color, vec3(0.5,0.5,0.55), 0.15); // Slight gray to reduce teal leaks

  outColor = vec4(color, alpha);
}`;
}

const vertexShaderSource = `#version 300 es
precision mediump float;

in vec2 aPosition;

void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

function createShaderProgram(
	gl: WebGL2RenderingContext,
	vsSource: string,
	fsSource: string,
): WebGLProgram | null {
	const vertexShader = gl.createShader(gl.VERTEX_SHADER);
	if (!vertexShader) return null;

	gl.shaderSource(vertexShader, vsSource);
	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error("Vertex shader error:", gl.getShaderInfoLog(vertexShader));
		gl.deleteShader(vertexShader);
		return null;
	}

	const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	if (!fragmentShader) {
		gl.deleteShader(vertexShader);
		return null;
	}

	gl.shaderSource(fragmentShader, fsSource);
	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error(
			"Fragment shader error:",
			gl.getShaderInfoLog(fragmentShader),
		);
		gl.deleteShader(vertexShader);
		gl.deleteShader(fragmentShader);
		return null;
	}

	const program = gl.createProgram();
	if (!program) {
		gl.deleteShader(vertexShader);
		gl.deleteShader(fragmentShader);
		return null;
	}

	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error(
			"Could not link WebGL program:",
			gl.getProgramInfoLog(program),
		);
		gl.deleteShader(vertexShader);
		gl.deleteShader(fragmentShader);
		gl.deleteProgram(program);
		return null;
	}

	return program;
}

export default function DustCloud() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current!;
		if (!canvas) return;

		const fsSource = buildFragmentShader();
		const gl = canvas.getContext("webgl2", { alpha: true })!;
		if (!gl) {
			console.error("WebGL2 is not supported by your browser.");
			return;
		}

		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.clearColor(0, 0, 0, 0);

		const program = createShaderProgram(gl, vertexShaderSource, fsSource);
		if (!program) {
			console.error("Failed to create shader program.");
			return;
		}

		gl.useProgram(program);

		// Full-screen quad
		const quadVertices = new Float32Array([
			-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
		]);

		const vao = gl.createVertexArray();
		gl.bindVertexArray(vao);

		const vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

		const aPositionLoc = gl.getAttribLocation(program, "aPosition");
		gl.enableVertexAttribArray(aPositionLoc);
		gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);

		// Only need resolution and time uniforms
		const uResolutionLoc = gl.getUniformLocation(program, "uResolution");
		const uTimeLoc = gl.getUniformLocation(program, "uTime");

		const startTime = performance.now();
		let animationFrameId: number;

		function render() {
			const currentTime = performance.now();
			const time = (currentTime - startTime) * 0.001; // Convert to seconds

			// Auto-resize canvas
			if (
				canvas.width !== window.innerWidth ||
				canvas.height !== window.innerHeight
			) {
				canvas.width = window.innerWidth;
				canvas.height = window.innerHeight;
				gl.viewport(0, 0, canvas.width, canvas.height);
			}

			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.useProgram(program);
			gl.bindVertexArray(vao);

			gl.uniform2f(uResolutionLoc, canvas.width, canvas.height);
			gl.uniform1f(uTimeLoc, time);

			gl.drawArrays(gl.TRIANGLES, 0, 6);
			animationFrameId = requestAnimationFrame(render);
		}

		// Initial canvas sizing
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		gl.viewport(0, 0, canvas.width, canvas.height);

		render();

		const handleResize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			gl.viewport(0, 0, canvas.width, canvas.height);
		};
		window.addEventListener("resize", handleResize);

		return () => {
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
			}
			window.removeEventListener("resize", handleResize);
			gl.deleteProgram(program);
			gl.deleteBuffer(vbo);
			gl.deleteVertexArray(vao);
			gl.clear(gl.COLOR_BUFFER_BIT);
		};
	}, []);

	return (
		<div className="relative h-screen w-full overflow-hidden bg-black">
			<canvas
				ref={canvasRef}
				className="absolute inset-0"
				style={{ background: "transparent" }}
			/>
		</div>
	);
}
