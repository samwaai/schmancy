/**
 * Error Effect — Electrical/warning glow on edges with static particles and lightning bolts.
 * 2.5-second main pulse cycle.
 */

import type { ArtState } from '../types'
import { ParticlePool } from '../particle-pool'
import { createOverlayContainer, createSVG } from '../utils'

export function createErrorOverlay(state: ArtState): void {
	const { element, color } = state
	const overlay = createOverlayContainer('error-overlay')
	const svg = createSVG()

	const edgeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
	const edges = [
		{ x: 0, y: 0, width: 100, height: 0.5 },
		{ x: 0, y: 99.5, width: 100, height: 0.5 },
		{ x: 0, y: 0, width: 0.5, height: 100 },
		{ x: 99.5, y: 0, width: 0.5, height: 100 },
	]

	const edgeElements = edges.map(edge => {
		const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
		rect.setAttribute('x', edge.x.toString())
		rect.setAttribute('y', edge.y.toString())
		rect.setAttribute('width', edge.width.toString())
		rect.setAttribute('height', edge.height.toString())
		rect.setAttribute('fill', color)
		rect.style.mixBlendMode = 'screen'
		rect.style.willChange = 'opacity'
		edgeGroup.appendChild(rect)
		return rect
	})

	const staticGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
	const staticParticles: NonNullable<ArtState['error']>['staticParticles'] = []

	for (let i = 0; i < 4; i++) {
		const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
		circle.setAttribute('r', '0.3')
		circle.setAttribute('fill', color)
		circle.style.mixBlendMode = 'screen'
		circle.style.willChange = 'opacity'
		staticGroup.appendChild(circle)
		staticParticles.push({ element: circle, edge: i % 4 })
	}

	svg.appendChild(edgeGroup)
	svg.appendChild(staticGroup)
	overlay.appendChild(svg)
	element.appendChild(overlay)

	const boltFactory = () => {
		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
		path.setAttribute('stroke', color)
		path.setAttribute('stroke-width', '0.5')
		path.setAttribute('fill', 'none')
		path.style.mixBlendMode = 'screen'
		path.style.willChange = 'opacity'
		svg.appendChild(path)
		return path
	}

	state.overlayElement = overlay
	state.error = {
		edges: edgeElements,
		staticParticles,
		boltPool: new ParticlePool(boltFactory, 5),
		lightningBolts: [],
		lastLightningSpawn: performance.now(),
		startTime: performance.now(),
	}
}

export function animateError(state: ArtState, currentTime: number): void {
	if (!state.error) return

	const { edges, staticParticles, boltPool, lightningBolts, startTime } = state.error
	const elapsed = currentTime - startTime
	const cycleProgress = (elapsed % 2500) / 2500

	const edgePulse = Math.sin(cycleProgress * Math.PI * 4) * 0.5 + 0.5
	const edgeOpacity = 0.08 + edgePulse * 0.17
	edges.forEach(edge => edge.setAttribute('opacity', edgeOpacity.toFixed(3)))

	staticParticles.forEach((particle, index) => {
		const particlePhase = (cycleProgress + index * 0.125) % 1.0
		let x = 0,
			y = 0

		switch (particle.edge) {
			case 0:
				x = Math.random() * 100
				y = Math.random() * 5
				break
			case 1:
				x = 95 + Math.random() * 5
				y = Math.random() * 100
				break
			case 2:
				x = Math.random() * 100
				y = 95 + Math.random() * 5
				break
			case 3:
				x = Math.random() * 5
				y = Math.random() * 100
				break
		}

		particle.element.setAttribute('cx', x.toString())
		particle.element.setAttribute('cy', y.toString())

		const flicker = Math.sin(particlePhase * Math.PI * 2) * 0.5 + 0.5
		particle.element.setAttribute('opacity', (flicker * 0.35).toFixed(3))
	})

	if (currentTime - state.error.lastLightningSpawn > 1500 && boltPool.activeCount < 3) {
		const bolt = boltPool.acquire()
		const edge = Math.floor(Math.random() * 4)
		let startX = 0,
			startY = 0,
			endX = 0,
			endY = 0

		switch (edge) {
			case 0:
				startX = Math.random() * 100
				startY = 0
				endX = Math.random() * 100
				endY = 50
				break
			case 1:
				startX = 100
				startY = Math.random() * 100
				endX = 70
				endY = Math.random() * 100
				break
			case 2:
				startX = Math.random() * 100
				startY = 100
				endX = Math.random() * 100
				endY = 50
				break
			case 3:
				startX = 0
				startY = Math.random() * 100
				endX = 30
				endY = Math.random() * 100
				break
		}

		bolt.setAttribute('d', createLightningPath(startX, startY, endX, endY))
		lightningBolts.push({ element: bolt, x: 0, y: 0, vx: 0, vy: 0, life: 1 })
		state.error.lastLightningSpawn = currentTime
	}

	for (let i = lightningBolts.length - 1; i >= 0; i--) {
		const bolt = lightningBolts[i]
		bolt.life -= 0.05
		const opacity = bolt.life > 0.8 ? 0.7 : bolt.life * 0.875
		bolt.element.setAttribute('opacity', Math.max(0, opacity).toFixed(3))

		if (bolt.life <= 0) {
			boltPool.release(bolt.element)
			lightningBolts.splice(i, 1)
		}
	}
}

function createLightningPath(startX: number, startY: number, endX: number, endY: number): string {
	const segments = 4
	let path = `M ${startX.toFixed(1)},${startY.toFixed(1)}`

	const deltaX = (endX - startX) / segments
	const deltaY = (endY - startY) / segments

	let currentX = startX
	let currentY = startY

	for (let i = 1; i < segments; i++) {
		const jag = 3 + Math.random() * 5
		const perpX = -deltaY * jag * (Math.random() - 0.5)
		const perpY = deltaX * jag * (Math.random() - 0.5)

		currentX += deltaX + perpX
		currentY += deltaY + perpY
		path += ` L ${currentX.toFixed(1)},${currentY.toFixed(1)}`
	}

	return path + ` L ${endX.toFixed(1)},${endY.toFixed(1)}`
}
