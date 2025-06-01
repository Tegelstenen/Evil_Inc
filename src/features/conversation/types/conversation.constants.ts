// State configurations
export const IDLE_STATE = {
	ZOOM_FACTOR: 1,
	TURBULENCE_STRENGTH: 0.15,
	TURBULENCE_FACTOR: 0.25,
	TURBULENCE_FREQUENCY: 1.5,
	TIME_FACTOR: 0.15, // Much slower for dormant/idle state
	BASE_SWIRL_STRENGTH: 0.3,
	SWIRL_TIME_MULT: 2.0,
	DUST_CLUSTERING: 0.6,
	FBM_OCTAVES: 6,
	dustColors: [
		[0.0, 0.0, 0.0], // Transparent (no dust)
		[0.08, 0.06, 0.04], // Very dark brown
		[0.12, 0.09, 0.06], // Dark brown
		[0.18, 0.14, 0.1], // Medium dark brown
		[0.25, 0.2, 0.15], // Brown
		[0.32, 0.27, 0.2], // Medium brown
		[0.4, 0.35, 0.28], // Light brown
		[0.48, 0.42, 0.35], // Tan brown
		[0.55, 0.5, 0.42], // Light tan
		[0.62, 0.57, 0.48], // Dusty tan
		[0.68, 0.63, 0.54], // Light dusty tan
		[0.74, 0.69, 0.6], // Very light tan
		[0.8, 0.75, 0.66], // Pale tan
		[0.85, 0.8, 0.72], // Very pale tan
		[0.88, 0.84, 0.78], // Almost white tan
		[0.9, 0.87, 0.82], // Light dust
		[0.92, 0.89, 0.85], // Very light dust
		[0.94, 0.91, 0.88], // Pale dust
		[0.96, 0.94, 0.91], // Very pale dust
		[0.98, 0.96, 0.94], // Almost white dust
	],
} as const;

export const LISTEN_STATE = {
	ZOOM_FACTOR: 1,
	TURBULENCE_STRENGTH: 0.15,
	TURBULENCE_FACTOR: 0.25,
	TURBULENCE_FREQUENCY: 1.5,
	TIME_FACTOR: 0.2, // Faster for active/listening state
	BASE_SWIRL_STRENGTH: 0.3,
	SWIRL_TIME_MULT: 2.0,
	DUST_CLUSTERING: 0.6,
	FBM_OCTAVES: 6,
	dustColors: [
		[0.0, 0.0, 0.0], // Transparent (no dust)
		[0.22, 0.08, 0.02], // Very dark orange (brighter)
		[0.32, 0.14, 0.04], // Dark orange (brighter)
		[0.42, 0.2, 0.06], // Deep orange (brighter)
		[0.52, 0.26, 0.08], // Dark burnt orange (brighter)
		[0.62, 0.33, 0.12], // Burnt orange (brighter)
		[0.72, 0.4, 0.16], // Medium orange (brighter)
		[0.82, 0.48, 0.2], // Orange (brighter)
		[0.88, 0.56, 0.24], // Bright orange (brighter)
		[0.93, 0.63, 0.3], // Light orange (brighter)
		[0.96, 0.7, 0.36], // Warm orange (brighter)
		[0.98, 0.76, 0.43], // Light warm orange (brighter)
		[0.99, 0.82, 0.5], // Pale orange (brighter)
		[1.0, 0.87, 0.58], // Very pale orange (brighter)
		[1.0, 0.91, 0.66], // Light peachy orange (brighter)
		[1.0, 0.94, 0.73], // Peach orange (brighter)
		[1.0, 0.96, 0.8], // Light peach (brighter)
		[1.0, 0.97, 0.86], // Very light peach (brighter)
		[1.0, 0.98, 0.92], // Pale peach (brighter)
		[1.0, 0.99, 0.96], // Almost white dust
	],
} as const;
