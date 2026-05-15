/**
 * Art Directive Types
 *
 * Type definitions for the art directive animation system.
 */

import type { ParticlePool } from './particle-pool'

export type ArtEffect = 'funkhaus' | 'samwa' | 'howl' | 'error' | 'snow' | 'starfield'

export interface ArtOptions {
	name: ArtEffect
	color: string
	/** Animation intensity: 0 = none, 0.5 = subtle, 1 = full (default: 1) */
	intensity?: number
	/** Animation speed multiplier: 0.5 = half speed, 1 = normal, 2 = double (default: 1) */
	speed?: number
	/** Particle density multiplier: 0.5 = sparse, 1 = baseline, 2 = dense (default: 1; starfield only) */
	density?: number
}

export interface Particle<T extends SVGElement = SVGElement> {
	element: T
	x: number
	y: number
	vx: number
	vy: number
	life: number
	rotation?: number
	scale?: number
	phase?: number
}

/** Extended physics particle used by samwa + snow effects. */
export interface FallingParticle {
	element: SVGPathElement
	x: number
	y: number
	vx: number
	vy: number
	life: number
	rotation: number
	phase: number
	sizeIndex: number
	depthIndex: number
	tumbleDirection: number
	flutterAmplitude: number
	flutterFrequency: number
	spawnTime: number
}

export interface ArtState {
	effect: ArtEffect
	color: string
	intensity: number
	speed: number
	density: number
	element: HTMLElement
	overlayElement?: HTMLElement
	animationId?: number
	isVisible: boolean
	observer?: IntersectionObserver

	funkhaus?: {
		panes: Array<{ element: SVGRectElement; diagonalIndex: number }>
		maxDiagonal: number
		startTime: number
	}

	samwa?: {
		leafPool: ParticlePool<SVGPathElement>
		fallingLeaves: FallingParticle[]
		windStrength: number
		windDirection: number
		lastWindTime: number
		lastLeafSpawn: number
		startTime: number
	}

	howl?: {
		gears: Array<{ element: SVGElement; speed: number }>
		sparkles: Array<{
			element: SVGPathElement
			baseX: number
			baseY: number
			phase: number
			speed: number
		}>
		steamPool: ParticlePool<SVGCircleElement>
		steamParticles: Particle<SVGCircleElement>[]
		wisps: SVGPathElement[]
		crystals: Array<{
			element: SVGPolygonElement
			baseX: number
			baseY: number
			phase: number
			rotSpeed: number
		}>
		lastSteamSpawn: number
		startTime: number
	}

	error?: {
		edges: SVGRectElement[]
		staticParticles: Array<{ element: SVGCircleElement; edge: number }>
		boltPool: ParticlePool<SVGPathElement>
		lightningBolts: Particle<SVGPathElement>[]
		lastLightningSpawn: number
		startTime: number
	}

	snow?: {
		snowflakePool: ParticlePool<SVGPathElement>
		fallingSnowflakes: FallingParticle[]
		windStrength: number
		windDirection: number
		windPhase: number
		lastWindGust: number
		lastSpawn: number
		startTime: number
	}

	starfield?: {
		canvas: HTMLCanvasElement
		ctx: CanvasRenderingContext2D
		/** Pre-rendered glow sprites, cool→warm. Drawn per star so no per-frame gradient is built. */
		sprites: HTMLCanvasElement[]
		/** Pre-rendered entrance nebula bloom, drawn once per frame at a computed alpha. */
		nebula: HTMLCanvasElement
		starCount: number
		/** Structure-of-arrays star table — cache-friendly, zero allocation per frame. */
		sx: Float32Array
		sy: Float32Array
		sr: Float32Array
		sphase: Float32Array
		stwinkle: Float32Array
		/** 0 = far (drifts least, dimmest) → 1 = near (drifts most, brightest). */
		sdepth: Float32Array
		/** Index into `sprites` — fixes each star's colour temperature for its life. */
		sbucket: Uint8Array
		/** Per-star entrance delay (s) so the field reveals far→near in waves. */
		sappear: Float32Array
		/** Fixed comet pool. `life <= 0` marks a free slot; no array churn. */
		cx: Float32Array
		cy: Float32Array
		cvx: Float32Array
		cvy: Float32Array
		clife: Float32Array
		cometCount: number
		/** ms timestamp of the next comet spawn — gates the rare streak. */
		nextCometAt: number
		/** Capped device-pixel-ratio; bounds backing-store fill cost on retina. */
		dpr: number
		/** Cached device-pixel canvas size; a change is the only resize trigger. */
		deviceWidth: number
		deviceHeight: number
		/** Static-render once, then idle the RAF loop. */
		reducedMotion: boolean
		drawnStatic: boolean
		/** Previous frame ms — frame-rate-independent comet motion + jump clamp. */
		lastFrame: number
		startTime: number
	}
}
