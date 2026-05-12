/**
 * Samwa Effect — Ambient geometric particles with gentle physics.
 * Color-responsive palette derived from the passed `color` prop; organic wind system.
 */

import type { ArtState, FallingParticle } from '../types'
import { ParticlePool } from '../particle-pool'
import { createOverlayContainer, createSVG } from '../utils'

function hexToRgb(hex: string): [number, number, number] {
	const h = hex.replace('#', '')
	const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16)
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function lighten(r: number, g: number, b: number, amount: number): string {
	const lr = Math.round(r + (255 - r) * amount)
	const lg = Math.round(g + (255 - g) * amount)
	const lb = Math.round(b + (255 - b) * amount)
	return `#${((1 << 24) | (lr << 16) | (lg << 8) | lb).toString(16).slice(1)}`
}

function generatePalette(baseColor: string): string[] {
	const [r, g, b] = hexToRgb(baseColor)
	return [
		lighten(r, g, b, 0.92),
		lighten(r, g, b, 0.8),
		lighten(r, g, b, 0.65),
		lighten(r, g, b, 0.5),
		lighten(r, g, b, 0.35),
		lighten(r, g, b, 0.18),
		baseColor,
	]
}

const SHAPES = [
	'M 2,0.4 A 1.6,1.6 0 1,1 2,3.6 A 1.6,1.6 0 1,1 2,0.4 Z',
	'M 2,0.2 L 3.8,2 L 2,3.8 L 0.2,2 Z',
	'M 2,0.3 L 3.5,1.15 L 3.5,2.85 L 2,3.7 L 0.5,2.85 L 0.5,1.15 Z',
	'M 2,0.3 L 3.7,3.4 L 0.3,3.4 Z',
	'M 1.4,0.4 L 2.6,0.4 L 2.6,1.4 L 3.6,1.4 L 3.6,2.6 L 2.6,2.6 L 2.6,3.6 L 1.4,3.6 L 1.4,2.6 L 0.4,2.6 L 0.4,1.4 L 1.4,1.4 Z',
	'M 2,0 A 2,2 0 1,1 2,4 A 2,2 0 1,1 2,0 Z M 2,0.8 A 1.2,1.2 0 1,0 2,3.2 A 1.2,1.2 0 1,0 2,0.8 Z',
	'M 0.4,1.6 L 3.6,1.6 L 3.6,2.4 L 0.4,2.4 Z',
]

const PARTICLE_SIZES = [
	{ scale: 0.8, fallSpeed: 0.12, windSensitivity: 2.2, tumbleSpeed: 0.6 },
	{ scale: 1.2, fallSpeed: 0.18, windSensitivity: 1.6, tumbleSpeed: 0.5 },
	{ scale: 1.6, fallSpeed: 0.25, windSensitivity: 1.2, tumbleSpeed: 0.35 },
]

const DEPTH_LAYERS = [
	{ opacity: 0.12, blur: 0.8 },
	{ opacity: 0.2, blur: 0.3 },
	{ opacity: 0.3, blur: 0 },
]

const SPAWN_ZONES = [
	{ x: 0, xRange: 15, vx: 0.3 },
	{ x: 15, xRange: 25, vx: 0.1 },
	{ x: 40, xRange: 20, vx: 0 },
	{ x: 60, xRange: 25, vx: -0.1 },
	{ x: 85, xRange: 15, vx: -0.3 },
]

export function createSamwaOverlay(state: ArtState): void {
	const { element, color } = state
	const overlay = createOverlayContainer('samwa-overlay')
	const svg = createSVG()

	overlay.appendChild(svg)
	element.appendChild(overlay)

	const palette = generatePalette(color)

	let shapeIndex = 0
	const particleFactory = () => {
		const particle = document.createElementNS('http://www.w3.org/2000/svg', 'path')
		const idx = shapeIndex % SHAPES.length
		particle.setAttribute('d', SHAPES[idx])
		particle.setAttribute('fill', palette[idx])
		particle.setAttribute('opacity', '0')
		if (idx === 5) particle.setAttribute('fill-rule', 'evenodd')
		particle.style.mixBlendMode = 'soft-light'
		particle.style.willChange = 'transform, opacity'
		particle.style.transform = 'translate(-100px, -100px)'
		svg.appendChild(particle)
		shapeIndex++
		return particle
	}

	state.overlayElement = overlay
	state.samwa = {
		leafPool: new ParticlePool(particleFactory, 18),
		fallingLeaves: [],
		windStrength: 0,
		windDirection: 1,
		lastWindTime: performance.now(),
		lastLeafSpawn: performance.now(),
		startTime: performance.now(),
	}
}

export function animateSamwa(state: ArtState, currentTime: number): void {
	if (!state.samwa) return

	const { intensity: effectIntensity = 1, speed = 1 } = state
	const { leafPool, fallingLeaves } = state.samwa

	if (effectIntensity <= 0) {
		for (const leaf of fallingLeaves) {
			leaf.element.setAttribute('opacity', '0')
		}
		return
	}

	const timeSinceWind = currentTime - state.samwa.lastWindTime

	const gustInterval = (4000 + Math.random() * 4000) / speed
	if (timeSinceWind > gustInterval) {
		const isStrongGust = Math.random() < 0.3
		state.samwa.windStrength = isStrongGust ? 1.5 : 0.8 + Math.random() * 0.4
		state.samwa.windDirection = Math.random() > 0.5 ? 1 : -1
		state.samwa.lastWindTime = currentTime
	}

	const windOscillation = Math.sin(currentTime * 0.001) * 0.1
	state.samwa.windStrength = Math.max(0, state.samwa.windStrength - 0.008 + windOscillation * 0.002)

	const spawnInterval = (800 + Math.random() * 1200) / speed
	const maxLeaves = Math.max(1, Math.round(12 * effectIntensity))
	if (currentTime - state.samwa.lastLeafSpawn > spawnInterval && leafPool.activeCount < maxLeaves) {
		const leaf = leafPool.acquire()

		const zoneWeights = [0.25, 0.15, 0.2, 0.15, 0.25]
		let zoneRoll = Math.random()
		let zoneIndex = 0
		for (let i = 0; i < zoneWeights.length; i++) {
			zoneRoll -= zoneWeights[i]
			if (zoneRoll <= 0) {
				zoneIndex = i
				break
			}
		}
		const zone = SPAWN_ZONES[zoneIndex]

		const sizeIndex = Math.floor(Math.random() * PARTICLE_SIZES.length)
		const depthIndex = Math.floor(Math.random() * DEPTH_LAYERS.length)
		const sizeProps = PARTICLE_SIZES[sizeIndex]

		const newLeaf: FallingParticle = {
			element: leaf,
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
			flutterAmplitude: 0.15 + Math.random() * 0.25,
			flutterFrequency: 0.012 + Math.random() * 0.008,
			spawnTime: currentTime,
		}

		fallingLeaves.push(newLeaf)
		state.samwa.lastLeafSpawn = currentTime
	}

	const windStrength = state.samwa.windStrength
	const windDirection = state.samwa.windDirection

	for (let i = fallingLeaves.length - 1; i >= 0; i--) {
		const p = fallingLeaves[i]
		const sizeProps = PARTICLE_SIZES[p.sizeIndex]
		const depthProps = DEPTH_LAYERS[p.depthIndex]

		const windEffect = windStrength * windDirection * sizeProps.windSensitivity * 0.6

		const flutterOffset = Math.sin(p.y * p.flutterFrequency + p.phase) * p.flutterAmplitude
		const secondaryWave =
			Math.sin(p.y * p.flutterFrequency * 0.5 + p.phase * 1.3) * p.flutterAmplitude * 0.4
		const tertiaryWave =
			Math.sin(p.y * p.flutterFrequency * 0.25 + p.phase * 0.7) * p.flutterAmplitude * 0.2

		p.vx += windEffect * 0.01
		p.vx += (flutterOffset + secondaryWave + tertiaryWave) * 0.025
		p.vx *= 0.97

		const verticalWind = Math.sin(currentTime * 0.0003 * speed + p.phase) * 0.03
		p.vy = (sizeProps.fallSpeed + verticalWind) * speed

		p.x += p.vx
		p.y += p.vy

		const baseRotationSpeed = sizeProps.tumbleSpeed * p.tumbleDirection * 0.7
		const windRotation = windStrength * windDirection * 0.8
		p.rotation += baseRotationSpeed + windRotation + flutterOffset

		const age = currentTime - p.spawnTime
		const fadeInDuration = 600
		const fadeOutStart = 80

		let opacity = depthProps.opacity * effectIntensity

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
			leafPool.release(p.element)
			fallingLeaves.splice(i, 1)
		}
	}
}
