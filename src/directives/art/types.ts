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
		groups: Array<{
			element: HTMLDivElement
			appearDelay: number
			twinkleDuration: number
			twinkleDelay: number
		}>
		startTime: number
	}
}
