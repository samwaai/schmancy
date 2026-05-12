/**
 * Missed Punch directive — shattering glass effect for incomplete attendance.
 *
 * Renders an animated shattering/fragmenting overlay when an employee has only
 * one punch on a past date, indicating they forgot to punch out.
 *
 * Visual: glass shards/fragments flying outward with a crack pattern.
 */

import type { ElementPart } from 'lit'
import { noChange } from 'lit'
import { AsyncDirective, directive } from 'lit/async-directive.js'

export interface MissedPunchOptions {
	active: boolean
	color?: string
	width?: number
}

interface Shard {
	element: SVGPolygonElement
	x: number
	y: number
	vx: number
	vy: number
	rotation: number
	rotationSpeed: number
	scale: number
	opacity: number
}

interface MissedPunchState {
	active: boolean
	color: string
	width: number
	element: HTMLElement
	overlayElement?: HTMLDivElement
	svg?: SVGSVGElement
	shards: Shard[]
	cracks: SVGPathElement[]
	animationId?: number
	isVisible: boolean
	observer?: IntersectionObserver
	startTime: number
}

const SHARD_COUNT = 8

class MissedPunchDirective extends AsyncDirective {
	private state: MissedPunchState | null = null

	render(_options: MissedPunchOptions) {
		return noChange
	}

	override update(part: ElementPart, [options]: [MissedPunchOptions]) {
		const element = part.element as HTMLElement
		const { active, color = 'var(--md-sys-color-error, #ef4444)', width = 150 } = options

		if (!active && this.state) {
			this.cleanup()
			return noChange
		}

		if (!active) {
			return noChange
		}

		if (this.state && (this.state.color !== color || this.state.width !== width)) {
			this.cleanup()
		}

		if (!this.state) {
			this.state = {
				active: true,
				color,
				width,
				element,
				shards: [],
				cracks: [],
				isVisible: true,
				startTime: performance.now(),
			}

			const computedStyle = getComputedStyle(element)
			if (computedStyle.position === 'static') {
				element.style.position = 'relative'
			}

			this.createOverlay()
			this.setupVisibilityObserver()
			this.startAnimation()
		}

		return noChange
	}

	private createOverlay() {
		if (!this.state) return

		const { element, color, width } = this.state

		const overlay = document.createElement('div')
		overlay.className = 'missed-punch-overlay'
		Object.assign(overlay.style, {
			position: 'absolute',
			top: '50%',
			left: '0',
			width: `${width}px`,
			height: '40px',
			transform: 'translateY(-50%)',
			pointerEvents: 'none',
			overflow: 'visible',
			zIndex: '4',
		})

		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
		svg.setAttribute('width', '100%')
		svg.setAttribute('height', '100%')
		svg.setAttribute('viewBox', `0 0 ${width} 40`)
		svg.setAttribute('preserveAspectRatio', 'xMinYMid meet')
		Object.assign(svg.style, {
			position: 'absolute',
			top: '0',
			left: '0',
			width: '100%',
			height: '100%',
			overflow: 'visible',
		})

		// Crack lines emanating from origin
		const cracks: SVGPathElement[] = []
		const crackAngles = [-15, 0, 15, -30, 30, -8, 8]

		for (const angle of crackAngles) {
			const crack = document.createElementNS('http://www.w3.org/2000/svg', 'path')
			const rad = (angle * Math.PI) / 180
			const length = 30 + Math.random() * 40

			let d = 'M 0,20'
			let x = 0
			let y = 20
			const segments = 4 + Math.floor(Math.random() * 3)

			for (let i = 0; i < segments; i++) {
				const segLen = length / segments
				x += Math.cos(rad) * segLen + (Math.random() - 0.5) * 4
				y += Math.sin(rad) * segLen + (Math.random() - 0.5) * 3
				d += ` L ${x.toFixed(1)},${y.toFixed(1)}`
			}

			crack.setAttribute('d', d)
			crack.setAttribute('stroke', color)
			crack.setAttribute('stroke-width', '1.5')
			crack.setAttribute('fill', 'none')
			crack.setAttribute('opacity', '0')
			crack.style.willChange = 'opacity, stroke-dashoffset'

			const pathLength = length * 1.2
			crack.setAttribute('stroke-dasharray', pathLength.toString())
			crack.setAttribute('stroke-dashoffset', pathLength.toString())

			cracks.push(crack)
			svg.appendChild(crack)
		}

		// Glass shards with gradient for light reflection
		const shards: Shard[] = []
		const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')

		for (let i = 0; i < SHARD_COUNT; i++) {
			const gradientId = `shard-gradient-${i}`
			const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient')
			gradient.setAttribute('id', gradientId)
			gradient.setAttribute('x1', '0%')
			gradient.setAttribute('y1', '0%')
			gradient.setAttribute('x2', '100%')
			gradient.setAttribute('y2', '100%')

			const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
			stop1.setAttribute('offset', '0%')
			stop1.setAttribute('stop-color', 'white')
			stop1.setAttribute('stop-opacity', '0.9')

			const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
			stop2.setAttribute('offset', '40%')
			stop2.setAttribute('stop-color', color)
			stop2.setAttribute('stop-opacity', '0.8')

			const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
			stop3.setAttribute('offset', '100%')
			stop3.setAttribute('stop-color', color)
			stop3.setAttribute('stop-opacity', '0.4')

			gradient.appendChild(stop1)
			gradient.appendChild(stop2)
			gradient.appendChild(stop3)
			defs.appendChild(gradient)

			const shard = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')

			const size = 5 + Math.random() * 7
			const points = this.generateShardPoints(size)
			shard.setAttribute('points', points)
			shard.setAttribute('fill', `url(#${gradientId})`)
			shard.setAttribute('stroke', 'white')
			shard.setAttribute('stroke-width', '0.5')
			shard.setAttribute('stroke-opacity', '0.6')
			shard.setAttribute('opacity', '0')
			shard.style.willChange = 'transform, opacity'
			shard.style.filter = 'drop-shadow(0 0 2px rgba(255,255,255,0.5))'

			const angle = (Math.random() - 0.3) * Math.PI * 0.6 // Mostly rightward
			const speed = 1.0 + Math.random() * 1.5

			shards.push({
				element: shard,
				x: 0,
				y: 20,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed,
				rotation: 0,
				rotationSpeed: (Math.random() - 0.5) * 10,
				scale: 0.6 + Math.random() * 0.6,
				opacity: 0,
			})

			svg.appendChild(shard)
		}

		svg.insertBefore(defs, svg.firstChild)

		// Sparkle/glint particles
		for (let i = 0; i < 6; i++) {
			const sparkle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
			sparkle.setAttribute('r', '1.5')
			sparkle.setAttribute('fill', 'white')
			sparkle.setAttribute('opacity', '0')
			sparkle.setAttribute('data-sparkle', i.toString())
			sparkle.style.willChange = 'transform, opacity'
			svg.appendChild(sparkle)
		}

		// "!" warning symbol
		const warning = document.createElementNS('http://www.w3.org/2000/svg', 'text')
		warning.setAttribute('x', (width - 15).toString())
		warning.setAttribute('y', '25')
		warning.setAttribute('fill', color)
		warning.setAttribute('font-size', '16')
		warning.setAttribute('font-weight', 'bold')
		warning.setAttribute('opacity', '0.6')
		warning.textContent = '!'
		warning.style.animation = 'missed-pulse 1.5s ease-in-out infinite'
		svg.appendChild(warning)

		// Pulsing keyframe (shared, lazy-injected once per document)
		if (!document.getElementById('missed-punch-styles')) {
			const style = document.createElement('style')
			style.id = 'missed-punch-styles'
			style.textContent = `
				@keyframes missed-pulse {
					0%, 100% { opacity: 0.4; transform: scale(1); }
					50% { opacity: 0.8; transform: scale(1.1); }
				}
			`
			document.head.appendChild(style)
		}

		overlay.appendChild(svg)
		element.appendChild(overlay)

		this.state.overlayElement = overlay
		this.state.svg = svg
		this.state.shards = shards
		this.state.cracks = cracks
	}

	private generateShardPoints(size: number): string {
		const numPoints = 3 + Math.floor(Math.random() * 2) // 3-4 points
		const points: string[] = []

		for (let i = 0; i < numPoints; i++) {
			const angle = (i / numPoints) * Math.PI * 2 + Math.random() * 0.5
			const r = size * (0.5 + Math.random() * 0.5)
			const x = Math.cos(angle) * r
			const y = Math.sin(angle) * r
			points.push(`${x.toFixed(1)},${y.toFixed(1)}`)
		}

		return points.join(' ')
	}

	private setupVisibilityObserver() {
		if (!this.state || typeof IntersectionObserver === 'undefined') return

		this.state.observer = new IntersectionObserver(
			entries => {
				if (!this.state) return
				const isVisible = entries[0].isIntersecting

				if (isVisible && !this.state.isVisible) {
					this.state.isVisible = true
					this.startAnimation()
				} else if (!isVisible && this.state.isVisible) {
					this.state.isVisible = false
					if (this.state.animationId) {
						cancelAnimationFrame(this.state.animationId)
						this.state.animationId = undefined
					}
				}
			},
			{ threshold: 0 },
		)

		this.state.observer.observe(this.state.element)
	}

	private startAnimation() {
		if (!this.state || !this.state.isVisible) return

		const { cracks } = this.state
		for (let i = 0; i < cracks.length; i++) {
			const crack = cracks[i]
			crack.setAttribute('stroke-dashoffset', '0')
			crack.setAttribute('opacity', '0.5')
		}

		const animate = (currentTime: number) => {
			if (!this.state || !this.state.isVisible) return

			const elapsed = currentTime - this.state.startTime
			const { shards, width } = this.state

			// Continuous shard animation — each shard has its own cycle
			for (let i = 0; i < shards.length; i++) {
				const shard = shards[i]
				const shardCycleDuration = 2500 + i * 200 // Stagger cycle durations
				const shardProgress = ((elapsed + i * 300) % shardCycleDuration) / shardCycleDuration

				shard.x = shardProgress * shard.vx * width * 0.5
				shard.y = 20 + shardProgress * shard.vy * 25 + shardProgress * shardProgress * 20
				shard.rotation += shard.rotationSpeed * 0.3

				let opacity = 0.85
				if (shardProgress < 0.1) {
					opacity = shardProgress * 8.5
				} else if (shardProgress > 0.8) {
					opacity = (1 - shardProgress) * 4.25
				}

				shard.element.style.transform = `translate(${shard.x.toFixed(1)}px, ${shard.y.toFixed(1)}px) rotate(${shard.rotation.toFixed(0)}deg) scale(${shard.scale})`
				shard.element.setAttribute('opacity', opacity.toFixed(2))
			}

			// Continuous sparkles
			const sparkles = this.state.svg?.querySelectorAll('[data-sparkle]')
			if (sparkles) {
				sparkles.forEach((sparkle, i) => {
					const sparkleCycle = 1500 + i * 150
					const sparkleProgress = ((elapsed + i * 200) % sparkleCycle) / sparkleCycle

					const sparkleX = 5 + sparkleProgress * width * 0.6
					const sparkleY = 18 + Math.sin(sparkleProgress * Math.PI * 4) * 10
					const sparkleOpacity = Math.sin(sparkleProgress * Math.PI) * 0.8

					sparkle.setAttribute('cx', sparkleX.toFixed(1))
					sparkle.setAttribute('cy', sparkleY.toFixed(1))
					sparkle.setAttribute('opacity', Math.max(0, sparkleOpacity).toFixed(2))
				})
			}

			// Pulse the cracks subtly
			const crackPulse = Math.sin(elapsed / 800) * 0.15 + 0.45
			for (const crack of cracks) {
				crack.setAttribute('opacity', crackPulse.toFixed(2))
			}

			this.state.animationId = requestAnimationFrame(animate)
		}

		this.state.animationId = requestAnimationFrame(animate)
	}

	private cleanup() {
		if (!this.state) return

		if (this.state.animationId) {
			cancelAnimationFrame(this.state.animationId)
		}

		if (this.state.observer) {
			this.state.observer.disconnect()
		}

		if (this.state.overlayElement) {
			this.state.overlayElement.remove()
		}

		this.state = null
	}

	override disconnected() {
		this.cleanup()
	}
}

export const missedPunch = directive(MissedPunchDirective)
