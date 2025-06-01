"use client";

import { useEffect, useRef } from "react";

import { IDLE_STATE, LISTEN_STATE } from "../types";

interface DustCloudProps {
	isActive: boolean;
	isTalking: boolean;
	talkingIntensity: number; // 0-255 range (from getByteFrequencyData)
}

function buildFragmentShader(): string {
	// Use a fixed number of octaves for the shader
	const fbmOctavesInt = 6;

	// Convert both color palettes to GLSL arrays
	const idleColorsArray = IDLE_STATE.dustColors
		.map((c) => `vec3(${c[0]}, ${c[1]}, ${c[2]})`)
		.join(",\n  ");

	const listenColorsArray = LISTEN_STATE.dustColors
		.map((c) => `vec3(${c[0]}, ${c[1]}, ${c[2]})`)
		.join(",\n  ");

	return `#version 300 es

precision highp float;
out vec4 outColor;

uniform vec2 uResolution;
uniform float uTime;
uniform float uRandomSeed1;
uniform float uRandomSeed2;
uniform float uIntensity;
uniform float uActiveState; // 0.0 = idle, 1.0 = active/listen
uniform float uZoomFactor;
uniform float uTurbulenceStrength;
uniform float uTurbulenceFactor;
uniform float uTurbulenceFreq;
uniform float uTimeFactor;
uniform float uSwirlStrength;
uniform float uSwirlTimeMult;
uniform float uDustClustering;

#define NUM_COLORS 20

// Both color palettes
vec3 idleColors[NUM_COLORS] = vec3[](
  ${idleColorsArray}
);

vec3 listenColors[NUM_COLORS] = vec3[](
  ${listenColorsArray}
);

// ----------------------------------------------------------
// Perlin-like noise
// ----------------------------------------------------------
vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float noise2D(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,
    0.366025403784439,
    -0.577350269189626,
    0.024390243902439
  );

  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);

  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod(i, 289.0);
  vec3 p = permute(
    permute(i.y + vec3(0.0, i1.y, 1.0)) +
    i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
    0.5 - vec3(
      dot(x0, x0),
      dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)
    ),
    0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.792843 - 0.853734 * (a0 * a0 + h * h);

  vec3 g;
  g.x  = a0.x  * x0.x + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;

  return 130.0 * dot(m, g);
}

// ----------------------------------------------------------
// Fractional Brownian Motion
// ----------------------------------------------------------
float fbm(vec2 st) {
  float value = 0.0;
  float amplitude = 0.5;
  float freq = 1.0;
  for (int i = 0; i < ${fbmOctavesInt}; i++) {
    value += amplitude * noise2D(st * freq);
    freq *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

// Turbulence function for more chaotic dust movement
float turbulence(vec2 st) {
  float value = 0.0;
  float amplitude = 0.5;
  float freq = 1.0;
  for (int i = 0; i < ${fbmOctavesInt}; i++) {
    value += amplitude * abs(noise2D(st * freq));
    freq *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  // Normalize coords to [-1,1]
  vec2 uv = (gl_FragCoord.xy / uResolution.xy) * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;

  // Use dynamic zoom factor
  uv *= uZoomFactor;

  // Use dynamic time factor
  float t = uTime * uTimeFactor;
  
  // Add randomness when intensity is high (talking mode)
  float randomOffset1 = uRandomSeed1 * uIntensity * 0.3;
  float randomOffset2 = uRandomSeed2 * uIntensity * 0.3;
  float intensityFactor = 1.0 + uIntensity * 0.5;

  // Create turbulent movement with randomness during speech
  float turbX = uTurbulenceStrength * intensityFactor * turbulence(uv * uTurbulenceFreq + vec2(t + randomOffset1, randomOffset2));
  float turbY = uTurbulenceStrength * intensityFactor * turbulence(uv * uTurbulenceFreq + vec2(randomOffset2, t + randomOffset1));
  
  // Add additional chaotic movement with random seeds
  turbX += uTurbulenceFactor * intensityFactor * noise2D(uv * 2.5 + vec2(t * 0.7 + randomOffset1, t * 0.3 + randomOffset2));
  turbY += uTurbulenceFactor * intensityFactor * noise2D(uv * 2.5 + vec2(t * 0.3 + randomOffset2, t * 0.7 + randomOffset1));
  
  uv.x += turbX;
  uv.y += turbY;

  // Gentle swirl for dust particles
  float r = length(uv);
  float angle = atan(uv.y, uv.x);
  float swirlStrength = uSwirlStrength * exp(-r * 0.5);

  angle += swirlStrength * sin(t * uSwirlTimeMult + r * 3.0);
  uv = vec2(cos(angle), sin(angle)) * r;

  // Create dust clustering effect (clean forward progression)
  float dustNoise = fbm(uv * 3.0); // No random offsets
  float clusterNoise = fbm(uv * 1.5 + vec2(t * 0.2, -t * 0.15)); // Clean time progression
  
  // Combine noises for dust-like appearance
  float dustDensity = dustNoise + uDustClustering * clusterNoise;
  
  // Add fine detail (clean forward motion)
  dustDensity += 0.3 * turbulence(uv * 8.0 + vec2(t, -t * 0.5));

  // Convert to [0..1] and apply power curve for more realistic dust distribution
  float noiseVal = 0.5 * (dustDensity + 1.0);
  noiseVal = pow(noiseVal, 1.5); // Make sparse areas more sparse

  // Discrete palette sampling
  float idx = clamp(noiseVal, 0.0, 1.0) * float(NUM_COLORS - 1);
  int iLow = int(floor(idx));
  int iHigh = int(min(float(iLow + 1), float(NUM_COLORS - 1)));
  float f = fract(idx);

  // Interpolate between idle and listen color palettes
  vec3 idleColorLow = idleColors[iLow];
  vec3 idleColorHigh = idleColors[iHigh];
  vec3 idleColor = mix(idleColorLow, idleColorHigh, f);
  
  vec3 listenColorLow = listenColors[iLow];
  vec3 listenColorHigh = listenColors[iHigh];
  vec3 listenColor = mix(listenColorLow, listenColorHigh, f);
  
  // Blend between idle and listen colors based on active state
  vec3 color = mix(idleColor, listenColor, uActiveState);

  // Create alpha based on dust density - more transparent overall
  float alpha = 1.0;
  if (iLow <= 2) {
    // Very sparse dust areas are more transparent
    alpha = mix(0.0, 0.4, float(iLow) / 2.0);
  } else if (iLow <= 5) {
    // Light dust areas
    alpha = mix(0.4, 0.7, float(iLow - 2) / 3.0);
  } else {
    // Denser dust areas
    alpha = mix(0.7, 0.9, float(iLow - 5) / float(NUM_COLORS - 6));
  }

  // Apply distance-based transparency for more realistic look
  float distanceFade = 1.0 - smoothstep(0.5, 2.0, length(uv * 0.5));
  alpha *= distanceFade;

  outColor = vec4(color, alpha);
}
`;
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

const DustCloud: React.FC<DustCloudProps> = ({
	isActive = true,
	isTalking = false,
	talkingIntensity = 0,
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	// Use refs to store current prop values so they update in the render loop
	const isActiveRef = useRef(isActive);
	const isTalkingRef = useRef(isTalking);
	const talkingIntensityRef = useRef(talkingIntensity);

	// Update refs when props change
	isActiveRef.current = isActive;
	isTalkingRef.current = isTalking;
	talkingIntensityRef.current = talkingIntensity;

	useEffect(() => {
		const canvas = canvasRef.current!;
		if (!canvas) return;

		// Build final fragment shader (no longer config-dependent)
		const fsSource = buildFragmentShader();

		const gl = canvas.getContext("webgl2", { alpha: true })!;
		if (!gl) {
			console.error("WebGL2 is not supported by your browser.");
			return;
		}

		// Enable blending for transparency
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		// Transparent background
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

		// Uniform locations
		const uResolutionLoc = gl.getUniformLocation(program, "uResolution");
		const uTimeLoc = gl.getUniformLocation(program, "uTime");
		const uRandomSeed1Loc = gl.getUniformLocation(program, "uRandomSeed1");
		const uRandomSeed2Loc = gl.getUniformLocation(program, "uRandomSeed2");
		const uIntensityLoc = gl.getUniformLocation(program, "uIntensity");
		const uActiveStateLoc = gl.getUniformLocation(program, "uActiveState");
		const uZoomFactorLoc = gl.getUniformLocation(program, "uZoomFactor");
		const uTurbulenceStrengthLoc = gl.getUniformLocation(
			program,
			"uTurbulenceStrength",
		);
		const uTurbulenceFactorLoc = gl.getUniformLocation(
			program,
			"uTurbulenceFactor",
		);
		const uTurbulenceFreqLoc = gl.getUniformLocation(
			program,
			"uTurbulenceFreq",
		);
		const uTimeFactorLoc = gl.getUniformLocation(program, "uTimeFactor");
		const uSwirlStrengthLoc = gl.getUniformLocation(program, "uSwirlStrength");
		const uSwirlTimeMultLoc = gl.getUniformLocation(program, "uSwirlTimeMult");
		const uDustClusteringLoc = gl.getUniformLocation(
			program,
			"uDustClustering",
		);

		const startTime = performance.now();
		let accumulatedTime = 0; // Track accumulated time for smooth progression
		let lastFrameTime = startTime;
		let smoothedIntensity = 0; // Smoothed intensity for continuous transitions
		let targetIntensity = 0; // Target intensity to smooth towards
		let smoothedActiveState = isActiveRef.current ? 1.0 : 0.0; // Smoothed active state
		let targetActiveState = isActiveRef.current ? 1.0 : 0.0; // Target active state
		let animationFrameId: number;

		function render() {
			const currentTime = performance.now();
			const deltaTime = (currentTime - lastFrameTime) * 0.001; // Time since last frame in seconds
			lastFrameTime = currentTime;

			// Smooth intensity transitions to avoid jumping
			if (isActiveRef.current && isTalkingRef.current) {
				// Normalize audio intensity from 0-255 range to 0-1 range
				const normalizedIntensity =
					Math.max(0, Math.min(255, talkingIntensityRef.current)) / 255;
				targetIntensity = normalizedIntensity;
			} else {
				targetIntensity = 0;
			}

			// Smooth active state transitions
			targetActiveState = isActiveRef.current ? 1.0 : 0.0;

			// Smoothly interpolate both intensity and active state
			const smoothingSpeed = 8.0; // Higher = faster transitions, Lower = smoother
			smoothedIntensity +=
				(targetIntensity - smoothedIntensity) * smoothingSpeed * deltaTime;
			smoothedActiveState +=
				(targetActiveState - smoothedActiveState) * smoothingSpeed * deltaTime;

			// Interpolate parameters between idle and listen states
			const idleConfig = IDLE_STATE;
			const listenConfig = LISTEN_STATE;

			const currentZoomFactor =
				idleConfig.ZOOM_FACTOR +
				smoothedActiveState *
					(listenConfig.ZOOM_FACTOR - idleConfig.ZOOM_FACTOR);
			const currentTurbulenceStrength =
				idleConfig.TURBULENCE_STRENGTH +
				smoothedActiveState *
					(listenConfig.TURBULENCE_STRENGTH - idleConfig.TURBULENCE_STRENGTH);
			const currentTurbulenceFactor =
				idleConfig.TURBULENCE_FACTOR +
				smoothedActiveState *
					(listenConfig.TURBULENCE_FACTOR - idleConfig.TURBULENCE_FACTOR);
			const currentTurbulenceFreq =
				idleConfig.TURBULENCE_FREQUENCY +
				smoothedActiveState *
					(listenConfig.TURBULENCE_FREQUENCY - idleConfig.TURBULENCE_FREQUENCY);
			const currentTimeFactor =
				idleConfig.TIME_FACTOR +
				smoothedActiveState *
					(listenConfig.TIME_FACTOR - idleConfig.TIME_FACTOR);
			const currentSwirlStrength =
				idleConfig.BASE_SWIRL_STRENGTH +
				smoothedActiveState *
					(listenConfig.BASE_SWIRL_STRENGTH - idleConfig.BASE_SWIRL_STRENGTH);
			const currentSwirlTimeMult =
				idleConfig.SWIRL_TIME_MULT +
				smoothedActiveState *
					(listenConfig.SWIRL_TIME_MULT - idleConfig.SWIRL_TIME_MULT);
			const currentDustClustering =
				idleConfig.DUST_CLUSTERING +
				smoothedActiveState *
					(listenConfig.DUST_CLUSTERING - idleConfig.DUST_CLUSTERING);

			// Always update accumulated time smoothly with dynamic time factor and talking intensity
			const maxTimeFactor = currentTimeFactor * 20.0; // Increased multiplier since we removed other effects
			const dynamicTimeFactor =
				currentTimeFactor +
				smoothedIntensity * (maxTimeFactor - currentTimeFactor);

			// Accumulate time directly without normalization to avoid jumps
			accumulatedTime += deltaTime * dynamicTimeFactor;

			// No random seeds needed for simple talking mode (pure speed modulation)
			const randomSeed1 = 0; // Not used for clean forward progression
			const randomSeed2 = 0; // Not used for clean forward progression

			// Resize canvas to fill window dimensions within the render loop
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
			gl.uniform1f(uTimeLoc, accumulatedTime);
			gl.uniform1f(uRandomSeed1Loc, randomSeed1);
			gl.uniform1f(uRandomSeed2Loc, randomSeed2);
			gl.uniform1f(uIntensityLoc, smoothedIntensity);
			gl.uniform1f(uActiveStateLoc, smoothedActiveState);
			gl.uniform1f(uZoomFactorLoc, currentZoomFactor);
			gl.uniform1f(uTurbulenceStrengthLoc, currentTurbulenceStrength);
			gl.uniform1f(uTurbulenceFactorLoc, currentTurbulenceFactor);
			gl.uniform1f(uTurbulenceFreqLoc, currentTurbulenceFreq);
			gl.uniform1f(uTimeFactorLoc, currentTimeFactor);
			gl.uniform1f(uSwirlStrengthLoc, currentSwirlStrength);
			gl.uniform1f(uSwirlTimeMultLoc, currentSwirlTimeMult);
			gl.uniform1f(uDustClusteringLoc, currentDustClustering);

			gl.drawArrays(gl.TRIANGLES, 0, 6);
			animationFrameId = requestAnimationFrame(render);
		}

		// Initial canvas sizing and viewport setup
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		gl.viewport(0, 0, canvas.width, canvas.height);

		render();

		// Listen for window resizing
		const handleResize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			gl.viewport(0, 0, canvas.width, canvas.height);
		};
		window.addEventListener("resize", handleResize);

		return () => {
			// Cancel the animation frame
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
			}

			// Remove resize listener
			window.removeEventListener("resize", handleResize);

			// Clean up WebGL resources
			gl.deleteProgram(program);
			gl.deleteBuffer(vbo);
			gl.deleteVertexArray(vao);

			// Clear the canvas
			gl.clear(gl.COLOR_BUFFER_BIT);
		};
	}, []); // Empty dependency array - no more re-rendering on prop changes!

	return (
		<div className="relative h-screen w-full overflow-hidden bg-black">
			<canvas
				ref={canvasRef}
				className="absolute inset-0"
				style={{ background: "transparent" }}
			/>
		</div>
	);
};

export default DustCloud;
