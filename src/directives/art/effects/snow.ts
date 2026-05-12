/**
 * Snow Effect — Peaceful winter snowfall with snow/leaf shapes.
 * Same physics pattern as samwa effect but tuned for slower, floatier fall.
 */

import type { ArtState, FallingParticle } from '../types'
import { ParticlePool } from '../particle-pool'
import { createOverlayContainer, createSVG } from '../utils'

const SNOW_COLORS = [
	'#FFFFFF',
	'#F8FCFF',
	'#E8F4FF',
	'#F0F8FF',
	'#FAFEFF',
	'#E0F0FF',
	'#D4A574',
	'#C19A6B',
	'#8B4513',
	'#CD853F',
]

const SNOWFLAKE_SHAPES = [
	'M 2,0 L 2.15,1.7 L 3.7,0.8 L 2.3,2 L 3.7,3.2 L 2.15,2.3 L 2,4 L 1.85,2.3 L 0.3,3.2 L 1.7,2 L 0.3,0.8 L 1.85,1.7 Z',
	'M 2,0.2 L 2.2,1.6 L 3.4,0.6 L 2.4,1.8 L 3.8,2 L 2.4,2.2 L 3.4,3.4 L 2.2,2.4 L 2,3.8 L 1.8,2.4 L 0.6,3.4 L 1.6,2.2 L 0.2,2 L 1.6,1.8 L 0.6,0.6 L 1.8,1.6 Z',
	'M 2,0.3 L 2.3,1.2 L 3.2,0.8 L 2.6,1.6 L 3.6,1.8 L 2.7,2.1 L 3.3,2.8 L 2.4,2.5 L 2,3.7 L 1.6,2.5 L 0.7,2.8 L 1.3,2.1 L 0.4,1.8 L 1.4,1.6 L 0.8,0.8 L 1.7,1.2 Z',
	'M 2,0.4 L 2.12,1.8 L 3.6,2 L 2.12,2.2 L 2,3.6 L 1.88,2.2 L 0.4,2 L 1.88,1.8 Z',
	'M 2,0.5 C 2.8,0.8 3.2,1.4 3.4,2 C 3.2,2.6 2.8,3.2 2,3.5 C 1.2,3.2 0.8,2.6 0.6,2 C 0.8,1.4 1.2,0.8 2,0.5 Z',
	'M 2,0.2 L 2.1,1.5 L 2.8,0.5 L 2.25,1.6 L 3.5,1.2 L 2.35,1.85 L 3.8,2 L 2.35,2.15 L 3.5,2.8 L 2.25,2.4 L 2.8,3.5 L 2.1,2.5 L 2,3.8 L 1.9,2.5 L 1.2,3.5 L 1.75,2.4 L 0.5,2.8 L 1.65,2.15 L 0.2,2 L 1.65,1.85 L 0.5,1.2 L 1.75,1.6 L 1.2,0.5 L 1.9,1.5 Z',
	'M 2,0.4 C 2.6,1 3,1.6 3.1,2.2 C 3,2.8 2.6,3.2 2,3.6 C 1.4,3.2 1,2.8 0.9,2.2 C 1,1.6 1.4,1 2,0.4 Z',
	'M 2,0.8 L 2.15,1.7 L 3.2,2 L 2.15,2.3 L 2,3.2 L 1.85,2.3 L 0.8,2 L 1.85,1.7 Z',
]

const PARTICLE_SIZES = [
	{ scale: 0.7, fallSpeed: 0.03, windSensitivity: 2.8, tumbleSpeed: 0.15 },
	{ scale: 1.0, fallSpeed: 0.05, windSensitivity: 2.2, tumbleSpeed: 0.2 },
	{ scale: 1.4, fallSpeed: 0.07, windSensitivity: 1.6, tumbleSpeed: 0.15 },
]

const DEPTH_LAYERS = [
	{ opacity: 0.2, blur: 0.8 },
	{ opacity: 0.35, blur: 0.3 },
	{ opacity: 0.55, blur: 0 },
]

const SPAWN_ZONES = [
	{ x: 0, xRange: 20, vx: 0.2 },
	{ x: 20, xRange: 20, vx: 0.1 },
	{ x: 40, xRange: 20, vx: 0 },
	{ x: 60, xRange: 20, vx: -0.1 },
	{ x: 80, xRange: 20, vx: -0.2 },
]

export function createSnowOverlay(state: ArtState): void {
	const { element } = state
	const overlay = createOverlayContainer('snow-overlay')
	const svg = createSVG()

	overlay.appendChild(svg)
	element.appendChild(overlay)

	let shapeIndex = 0
	const particleFactory = () => {
		const particle = document.createElementNS('http://www.w3.org/2000/svg', 'path')
		const idx = shapeIndex % SNOWFLAKE_SHAPES.length
		const colorIdx = Math.floor(Math.random() * SNOW_COLORS.length)

		particle.setAttribute('d', SNOWFLAKE_SHAPES[idx])
		particle.setAttribute('fill', SNOW_COLORS[colorIdx])
		particle.setAttribute('opacity', '0')
		particle.style.mixBlendMode = 'soft-light'
		particle.style.willChange = 'transform, opacity'
		particle.style.transform = 'translate(-100px, -100px)'

		svg.appendChild(particle)
		shapeIndex++
		return particle
	}

	state.overlayElement = overlay
	state.snow = {
		snowflakePool: new ParticlePool(particleFactory, 20),
		fallingSnowflakes: [],
		windStrength: 0,
		windDirection: 1,
		windPhase: Math.random() * Math.PI * 2,
		lastWindGust: performance.now(),
		lastSpawn: performance.now(),
		startTime: performance.now(),
	}
}

export function animateSnow(state: ArtState, currentTime: number): void {
	if (!state.snow) return

	const { intensity = 1, speed = 1 } = state
	const { snowflakePool, fallingSnowflakes } = state.snow

	if (intensity <= 0) {
		for (const flake of fallingSnowflakes) {
			flake.element.setAttribute('opacity', '0')
		}
		return
	}

	const timeSinceWind = currentTime - state.snow.lastWindGust
	const gustInterval = (8000 + Math.random() * 8000) / speed

	if (timeSinceWind > gustInterval) {
		const isStrongGust = Math.random() < 0.15
		state.snow.windStrength = isStrongGust ? 0.8 : 0.3 + Math.random() * 0.3
		state.snow.windDirection = Math.random() > 0.5 ? 1 : -1
		state.snow.lastWindGust = currentTime
	}

	const windOscillation = Math.sin(currentTime * 0.0005) * 0.08
	state.snow.windStrength = Math.max(0, state.snow.windStrength - 0.003 + windOscillation * 0.001)

	const spawnInterval = (1200 + Math.random() * 1500) / speed
	const maxFlakes = Math.max(2, Math.round(12 * intensity))

	if (currentTime - state.snow.lastSpawn > spawnInterval && snowflakePool.activeCount < maxFlakes) {
		const flake = snowflakePool.acquire()

		const zoneIndex = Math.floor(Math.random() * SPAWN_ZONES.length)
		const zone = SPAWN_ZONES[zoneIndex]

		const sizeIndex = Math.floor(Math.random() * PARTICLE_SIZES.length)
		const depthIndex = Math.floor(Math.random() * DEPTH_LAYERS.length)
		const sizeProps = PARTICLE_SIZES[sizeIndex]

		const newFlake: FallingParticle = {
			element: flake,
			x: zone.x + Math.random() * zone.xRange,
			y: -5 - Math.random() * 15,
			vx: zone.vx * 0.5 + (Math.random() - 0.5) * 0.1,
			vy: sizeProps.fallSpeed * (0.85 + Math.random() * 0.3),
			life: 1,
			rotation: Math.random() * 360,
			phase: Math.random() * Math.PI * 2,
			sizeIndex,
			depthIndex,
			tumbleDirection: Math.random() > 0.5 ? 1 : -1,
			flutterAmplitude: 0.06 + Math.random() * 0.1,
			flutterFrequency: 0.008 + Math.random() * 0.005,
			spawnTime: currentTime,
		}

		fallingSnowflakes.push(newFlake)
		state.snow.lastSpawn = currentTime
	}

	const windStrength = state.snow.windStrength
	const windDirection = state.snow.windDirection

	for (let i = fallingSnowflakes.length - 1; i >= 0; i--) {
		const p = fallingSnowflakes[i]
		const sizeProps = PARTICLE_SIZES[p.sizeIndex]
		const depthProps = DEPTH_LAYERS[p.depthIndex]

		const windEffect = windStrength * windDirection * sizeProps.windSensitivity * 0.4

		const flutterOffset = Math.sin(p.y * p.flutterFrequency + p.phase) * p.flutterAmplitude
		const secondaryWave =
			Math.sin(p.y * p.flutterFrequency * 0.5 + p.phase * 1.3) * p.flutterAmplitude * 0.3

		p.vx += windEffect * 0.006
		p.vx += (flutterOffset + secondaryWave) * 0.015
		p.vx *= 0.985

		const verticalWind = Math.sin(currentTime * 0.0002 * speed + p.phase) * 0.015
		p.vy = (sizeProps.fallSpeed + verticalWind) * speed

		p.x += p.vx
		p.y += p.vy

		const baseRotationSpeed = sizeProps.tumbleSpeed * p.tumbleDirection * 0.4
		const windRotation = windStrength * windDirection * 0.3
		p.rotation += baseRotationSpeed + windRotation + flutterOffset * 0.5

		const age = currentTime - p.spawnTime
		const fadeInDuration = 1000
		const fadeOutStart = 75

		let opacity = depthProps.opacity * intensity

		if (age < fadeInDuration) {
			opacity *= age / fadeInDuration
		}

		if (p.y > fadeOutStart) {
			const fadeProgress = (p.y - fadeOutStart) / (110 - fadeOutStart)
			opacity *= 1 - fadeProgress
		}

		const scale = sizeProps.scale * (0.8 + depthProps.opacity)

		p.element.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px) rotate(${p.rotation.toFixed(0)}deg) scale(${scale.toFixed(2)})`
		p.element.style.filter = depthProps.blur > 0 ? `blur(${depthProps.blur}px)` : ''
		p.element.setAttribute('opacity', Math.max(0, opacity).toFixed(3))

		if (p.y > 110 || p.x < -10 || p.x > 110) {
			snowflakePool.release(p.element)
			fallingSnowflakes.splice(i, 1)
		}
	}
}
