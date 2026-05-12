/**
 * Howl Effect — Steampunk gears, sparkles, crystals, rising steam.
 * 17-second cycle, layered animations.
 */

import type { ArtState } from '../types'
import { ParticlePool } from '../particle-pool'
import { createOverlayContainer, createSVG } from '../utils'

export function createHowlOverlay(state: ArtState): void {
	const { element, color } = state
	const overlay = createOverlayContainer('howl-overlay')
	const svg = createSVG()

	const gearsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
	const gearConfigs = [
		{ cx: 15, cy: 20, r: 8, teeth: 12, speed: 0.5 },
		{ cx: 85, cy: 25, r: 6, teeth: 10, speed: -0.7 },
		{ cx: 30, cy: 80, r: 10, teeth: 16, speed: 0.4 },
		{ cx: 75, cy: 75, r: 7, teeth: 12, speed: -0.6 },
	]

	const gears = gearConfigs.map(config => {
		const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
		g.style.transformOrigin = `${config.cx}% ${config.cy}%`
		g.style.willChange = 'transform'

		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
		path.setAttribute('d', createGearPath(config.cx, config.cy, config.r, config.teeth))
		path.setAttribute('fill', color)
		path.setAttribute('opacity', '0.3')
		path.style.mixBlendMode = 'screen'

		g.appendChild(path)
		gearsGroup.appendChild(g)
		return { element: g, speed: config.speed }
	})

	const sparklesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
	const sparkles: NonNullable<ArtState['howl']>['sparkles'] = []

	for (let i = 0; i < 6; i++) {
		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
		const x = 10 + Math.random() * 80
		const y = 10 + Math.random() * 80
		const size = 0.3 + Math.random() * 0.5

		const sparklePath = `M ${x},${y - size} L ${x + size * 0.3},${y} L ${x},${y + size} L ${x - size * 0.3},${y} Z`
		path.setAttribute('d', sparklePath)
		path.setAttribute('fill', color)
		path.style.mixBlendMode = 'screen'
		path.style.willChange = 'opacity, transform'

		sparklesGroup.appendChild(path)
		sparkles.push({
			element: path,
			baseX: x,
			baseY: y,
			phase: Math.random() * Math.PI * 2,
			speed: 0.5 + Math.random() * 1.5,
		})
	}

	const crystalsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
	const crystals: NonNullable<ArtState['howl']>['crystals'] = []

	for (let i = 0; i < 4; i++) {
		const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
		const x = 20 + Math.random() * 60
		const y = 20 + Math.random() * 60
		const size = 0.8 + Math.random() * 1.2

		polygon.setAttribute(
			'points',
			`${x},${y - size} ${x + size * 0.6},${y} ${x},${y + size} ${x - size * 0.6},${y}`,
		)
		polygon.setAttribute('fill', color)
		polygon.style.mixBlendMode = 'screen'
		polygon.style.willChange = 'transform, opacity'

		crystalsGroup.appendChild(polygon)
		crystals.push({
			element: polygon,
			baseX: x,
			baseY: y,
			phase: Math.random() * Math.PI * 2,
			rotSpeed: 0.5 + Math.random(),
		})
	}

	svg.appendChild(gearsGroup)
	svg.appendChild(sparklesGroup)
	svg.appendChild(crystalsGroup)
	overlay.appendChild(svg)
	element.appendChild(overlay)

	const steamFactory = () => {
		const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
		circle.setAttribute('fill', color)
		circle.style.mixBlendMode = 'screen'
		circle.style.willChange = 'transform, opacity'
		svg.appendChild(circle)
		return circle
	}

	state.overlayElement = overlay
	state.howl = {
		gears,
		sparkles,
		steamPool: new ParticlePool(steamFactory, 12),
		steamParticles: [],
		wisps: [],
		crystals,
		lastSteamSpawn: performance.now(),
		startTime: performance.now(),
	}
}

export function animateHowl(state: ArtState, currentTime: number): void {
	if (!state.howl) return

	const { gears, sparkles, crystals, steamPool, steamParticles, startTime } = state.howl
	const elapsed = currentTime - startTime
	const cycleProgress = (elapsed % 17000) / 17000

	gears.forEach(gear => {
		const rotation = (elapsed / 80) * gear.speed
		gear.element.style.transform = `rotate(${rotation.toFixed(1)}deg)`
	})

	sparkles.forEach(sparkle => {
		const twinkle = Math.sin((cycleProgress * sparkle.speed + sparkle.phase) * Math.PI * 2)
		const opacity = 0.15 + twinkle * 0.25

		const floatX = Math.sin((elapsed / 2000) * sparkle.speed + sparkle.phase) * 0.3
		const floatY = Math.cos((elapsed / 2000) * sparkle.speed + sparkle.phase) * 0.2

		sparkle.element.setAttribute('opacity', opacity.toFixed(3))
		sparkle.element.style.transform = `translate(${floatX.toFixed(2)}px, ${floatY.toFixed(2)}px)`
	})

	crystals.forEach(crystal => {
		const floatX = Math.sin((elapsed / 3500) * crystal.rotSpeed + crystal.phase) * 1.5
		const floatY = Math.cos((elapsed / 4000) * crystal.rotSpeed + crystal.phase) * 1.2
		const rotation = (elapsed / 120) * crystal.rotSpeed

		const pulse = Math.sin((cycleProgress + crystal.phase / (Math.PI * 2)) * Math.PI * 2)
		const opacity = 0.12 + pulse * 0.18

		crystal.element.style.transform = `translate(${floatX.toFixed(1)}px, ${floatY.toFixed(1)}px) rotate(${rotation.toFixed(1)}deg)`
		crystal.element.setAttribute('opacity', opacity.toFixed(3))
	})

	if (currentTime - state.howl.lastSteamSpawn > 600 && steamPool.activeCount < 12) {
		const steam = steamPool.acquire()
		steamParticles.push({
			element: steam,
			x: 10 + Math.random() * 80,
			y: 105,
			vx: (Math.random() - 0.5) * 0.15,
			vy: -0.25 - Math.random() * 0.25,
			life: 1,
			scale: 0.5 + Math.random(),
		})
		state.howl.lastSteamSpawn = currentTime
	}

	for (let i = steamParticles.length - 1; i >= 0; i--) {
		const p = steamParticles[i]

		p.x += p.vx
		p.y += p.vy
		p.life -= 0.008
		p.scale! += 0.02

		p.element.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px)`
		p.element.setAttribute('r', p.scale!.toFixed(2))
		p.element.setAttribute('opacity', (p.life * 0.18).toFixed(3))

		if (p.life <= 0 || p.y < -10) {
			steamPool.release(p.element)
			steamParticles.splice(i, 1)
		}
	}
}

function createGearPath(cx: number, cy: number, r: number, teeth: number): string {
	const toothHeight = r * 0.2
	const innerR = r - toothHeight
	let path = ''

	for (let i = 0; i < teeth; i++) {
		const a1 = (i / teeth) * Math.PI * 2
		const a2 = ((i + 0.4) / teeth) * Math.PI * 2
		const a3 = ((i + 0.6) / teeth) * Math.PI * 2
		const a4 = ((i + 1) / teeth) * Math.PI * 2

		if (i === 0) path += `M ${cx + innerR * Math.cos(a1)},${cy + innerR * Math.sin(a1)} `
		path += `L ${cx + r * Math.cos(a2)},${cy + r * Math.sin(a2)} L ${cx + r * Math.cos(a3)},${cy + r * Math.sin(a3)} L ${cx + innerR * Math.cos(a4)},${cy + innerR * Math.sin(a4)} `
	}

	return path + 'Z'
}
