/**
 * Working Snake Directive - Animated trail indicating active work
 *
 * Creates a visual "snake" effect emanating from a punch point when
 * an employee is currently working (single check-in, no check-out yet).
 *
 * The animation creates a visual illusion of forward motion - dots flow
 * rightward with a subtle sine wave oscillation, representing time passing.
 *
 * Follows patterns from art.ts:
 * - RequestAnimationFrame for smooth 60fps
 * - Intersection Observer to pause when off-screen
 * - GPU-accelerated CSS transforms
 * - Object pooling for performance
 *
 * @example
 * ```ts
 * html`
 *   <div ${workingSnake({ active: true, color: 'var(--md-sys-color-primary)' })}>
 *     <div class="punch-dot"></div>
 *   </div>
 * `
 * ```
 */

import type { ElementPart } from 'lit'
import { noChange } from 'lit'
import { AsyncDirective, directive } from 'lit/async-directive.js'

export interface WorkingSnakeOptions {
	/** Whether the snake animation is active */
	active: boolean
	/** CSS color value for the snake segments */
	color?: string
	/** Width in pixels the snake should travel */
	travelWidth?: number
}

interface Segment {
	element: SVGCircleElement
	progress: number // 0 to 1 - position along the path
	phase: number // offset for sine wave
}

interface SnakeState {
	active: boolean
	color: string
	travelWidth: number
	element: HTMLElement
	overlayElement?: HTMLDivElement
	svg?: SVGSVGElement
	segments: Segment[]
	animationId?: number
	isVisible: boolean
	observer?: IntersectionObserver
	startTime: number
}

const SEGMENT_COUNT = 10
const CYCLE_DURATION = 3000 // 3 seconds for full cycle
const SINE_AMPLITUDE = 3 // vertical oscillation in pixels
const HEAD_RADIUS = 4
const TAIL_RADIUS = 1.5

class WorkingSnakeDirective extends AsyncDirective {
	private state: SnakeState | null = null

	render(_options: WorkingSnakeOptions) {
		return noChange
	}

	override update(part: ElementPart, [options]: [WorkingSnakeOptions]) {
		const element = part.element as HTMLElement
		// Auto-calculate travelWidth to use 100% of container if not specified
		const calculatedWidth = element.offsetWidth || element.clientWidth
		const { active, color = 'var(--md-sys-color-primary)', travelWidth = calculatedWidth } = options

		// If becoming inactive, cleanup
		if (!active && this.state) {
			this.cleanup()
			return noChange
		}

		// If not active and no state, nothing to do
		if (!active) {
			return noChange
		}

		// If options changed, recreate
		if (this.state && (this.state.color !== color || this.state.travelWidth !== travelWidth)) {
			this.cleanup()
		}

		// Initialize if needed
		if (!this.state) {
			this.state = {
				active: true,
				color,
				travelWidth,
				element,
				segments: [],
				isVisible: true,
				startTime: performance.now(),
			}

			// Ensure element has relative positioning for absolute overlay
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

		const { element, color, travelWidth } = this.state

		// Create overlay container - starts from the punch point
		const overlay = document.createElement('div')
		overlay.className = 'working-snake-overlay'
		overlay.style.cssText = `
			position: absolute;
			top: 50%;
			left: 0;
			width: ${travelWidth}px;
			height: 20px;
			transform: translateY(-50%);
			pointer-events: none;
			overflow: visible;
			z-index: 5;
		`

		// Create SVG
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
		svg.setAttribute('width', '100%')
		svg.setAttribute('height', '100%')
		svg.setAttribute('viewBox', `0 0 ${travelWidth} 20`)
		svg.setAttribute('preserveAspectRatio', 'none')
		svg.style.cssText = `
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			overflow: visible;
		`

		// Create segments (circles)
		const segments: Segment[] = []
		for (let i = 0; i < SEGMENT_COUNT; i++) {
			const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')

			// Calculate radius - head is bigger, tail is smaller
			const normalizedIndex = i / (SEGMENT_COUNT - 1)
			const radius = HEAD_RADIUS - normalizedIndex * (HEAD_RADIUS - TAIL_RADIUS)

			circle.setAttribute('r', radius.toString())
			circle.setAttribute('fill', color)
			circle.setAttribute('cy', '10') // Center vertically in 20px height
			circle.style.willChange = 'transform, opacity'

			// Stagger initial progress and phase for organic movement
			const progress = (i / SEGMENT_COUNT) * 0.5 // Start staggered
			const phase = (i / SEGMENT_COUNT) * Math.PI * 2

			segments.push({ element: circle, progress, phase })
			svg.appendChild(circle)
		}

		overlay.appendChild(svg)
		element.appendChild(overlay)

		this.state.overlayElement = overlay
		this.state.svg = svg
		this.state.segments = segments
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
			{ threshold: 0 }
		)

		this.state.observer.observe(this.state.element)
	}

	private startAnimation() {
		if (!this.state || !this.state.isVisible) return

		const animate = (currentTime: number) => {
			if (!this.state || !this.state.isVisible) return

			const elapsed = currentTime - this.state.startTime
			const cycleProgress = (elapsed % CYCLE_DURATION) / CYCLE_DURATION

			const { segments, travelWidth } = this.state

			// Animate each segment
			for (let i = 0; i < segments.length; i++) {
				const segment = segments[i]

				// Each segment is offset in the cycle
				const segmentOffset = i / SEGMENT_COUNT
				let progress = (cycleProgress + segmentOffset) % 1

				// Ease the progress for more organic feel (ease-out)
				const easedProgress = 1 - Math.pow(1 - progress, 2)

				// Calculate x position
				const x = easedProgress * travelWidth

				// Calculate y position with sine wave
				const sineWave = Math.sin(progress * Math.PI * 4 + segment.phase) * SINE_AMPLITUDE
				const y = 10 + sineWave

				// Calculate opacity - fade out as it travels
				const baseOpacity = i === 0 ? 0.9 : 0.7 - (i / SEGMENT_COUNT) * 0.55
				const fadeOut = 1 - easedProgress * 0.7
				const opacity = baseOpacity * fadeOut

				// Head has subtle pulse
				let scale = 1
				if (i === 0) {
					const pulse = Math.sin(currentTime / 200) * 0.1 + 1
					scale = pulse
				}

				// Apply transforms
				segment.element.setAttribute('cx', x.toFixed(1))
				segment.element.setAttribute('cy', y.toFixed(1))
				segment.element.setAttribute('opacity', Math.max(0.1, opacity).toFixed(2))

				if (scale !== 1) {
					segment.element.style.transform = `scale(${scale.toFixed(2)})`
					segment.element.style.transformOrigin = `${x}px ${y}px`
				}
			}

			this.state.animationId = requestAnimationFrame(animate)
		}

		this.state.animationId = requestAnimationFrame(animate)
	}

	private cleanup() {
		if (!this.state) return

		// Cancel animation
		if (this.state.animationId) {
			cancelAnimationFrame(this.state.animationId)
		}

		// Disconnect observer
		if (this.state.observer) {
			this.state.observer.disconnect()
		}

		// Remove overlay
		if (this.state.overlayElement) {
			this.state.overlayElement.remove()
		}

		this.state = null
	}

	override disconnected() {
		this.cleanup()
	}
}

export const workingSnake = directive(WorkingSnakeDirective)
