import { directive, PartInfo, PartType, ElementPart } from 'lit/directive.js'
import { AsyncDirective } from 'lit/async-directive.js'
import { noChange } from 'lit'

export interface FlipOptions {
	/** Source element to animate from (uses element's bounding rect) */
	sourceElement?: HTMLElement
	/** Click position - can be MouseEvent, TouchEvent, or {x, y} coordinates */
	position?: { x: number; y: number } | MouseEvent | TouchEvent
	/** Animation duration in ms (total for both stages) */
	duration?: number
	/** CSS easing function */
	easing?: string
	/** Whether to animate scale (default: true) */
	scale?: boolean
	/** Enable blackbird two-stage arc animation (default: true) */
	blackbird?: boolean
}

/** Extract x,y coordinates from various position inputs */
function extractPosition(pos: FlipOptions['position']): { x: number; y: number } | null {
	if (!pos) return null

	if ('clientX' in pos) {
		// MouseEvent
		return { x: pos.clientX, y: pos.clientY }
	} else if ('touches' in pos && pos.touches.length) {
		// TouchEvent
		return { x: pos.touches[0].clientX, y: pos.touches[0].clientY }
	} else if ('x' in pos && 'y' in pos) {
		// Position object
		return { x: pos.x, y: pos.y }
	}

	return null
}

/**
 * Calculate arc control point for bird-like curved trajectory
 * Birds arc UP when taking off and arc DOWN when landing
 */
function calculateArcPoint(
	start: { x: number; y: number },
	end: { x: number; y: number },
	arcDirection: 'up' | 'down' = 'up',
	intensity: number = 0.3,
): { x: number; y: number } {
	const midX = (start.x + end.x) / 2
	const midY = (start.y + end.y) / 2
	const distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2))

	// Arc height proportional to distance, but capped
	const arcHeight = Math.min(distance * intensity, 150)

	return {
		x: midX,
		y: arcDirection === 'up' ? midY - arcHeight : midY + arcHeight,
	}
}

class FlipDirective extends AsyncDirective {
	private element?: HTMLElement
	private hasAnimated = false

	constructor(partInfo: PartInfo) {
		super(partInfo)
		if (partInfo.type !== PartType.ELEMENT) {
			throw new Error('flip directive can only be used on elements')
		}
	}

	render(_options?: FlipOptions) {
		return noChange
	}

	update(part: ElementPart, [options]: [FlipOptions?]) {
		this.element = part.element as HTMLElement

		// Animate if we have either a source element or position
		const hasSource = options?.sourceElement || options?.position
		if (!this.hasAnimated && hasSource) {
			this.hasAnimated = true
			this.animateIn(options)
		}

		return noChange
	}

	private animateIn(options?: FlipOptions) {
		if (!this.element) return

		// Check reduced motion preference
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

		const totalDuration = options?.duration ?? 600
		const animateScale = options?.scale !== false
		const useBlackbird = options?.blackbird !== false

		// Get positions
		const clickPos = extractPosition(options?.position)
		const sourceRect = options?.sourceElement?.getBoundingClientRect()

		const animate = () => {
			const targetRect = this.element!.getBoundingClientRect()
			const targetCenter = {
				x: targetRect.left + targetRect.width / 2,
				y: targetRect.top + targetRect.height / 2,
			}

			// Determine source point
			let sourceCenter: { x: number; y: number }
			let sourceScale = { x: 0.1, y: 0.1 }

			if (sourceRect) {
				sourceCenter = {
					x: sourceRect.left + sourceRect.width / 2,
					y: sourceRect.top + sourceRect.height / 2,
				}
				if (animateScale) {
					sourceScale = {
						x: sourceRect.width / targetRect.width,
						y: sourceRect.height / targetRect.height,
					}
				}
			} else if (clickPos) {
				sourceCenter = clickPos
			} else {
				sourceCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
			}

			// Calculate deltas from target (where element is) to source (where we start)
			const sourceDelta = {
				x: sourceCenter.x - targetCenter.x,
				y: sourceCenter.y - targetCenter.y,
			}

			if (useBlackbird && clickPos && sourceRect) {
				// TWO-STAGE BLACKBIRD ANIMATION
				// Stage 1: Source element → Click position (takeoff arc - UP)
				// Stage 2: Click position → Final destination (landing arc - DOWN)

				const clickDelta = {
					x: clickPos.x - targetCenter.x,
					y: clickPos.y - targetCenter.y,
				}

				// Calculate arc control points
				const takeoffArc = calculateArcPoint(sourceCenter, clickPos, 'up', 0.4)
				const landingArc = calculateArcPoint(clickPos, targetCenter, 'down', 0.3)

				// Arc deltas relative to target
				const takeoffArcDelta = {
					x: takeoffArc.x - targetCenter.x,
					y: takeoffArc.y - targetCenter.y,
				}
				const landingArcDelta = {
					x: landingArc.x - targetCenter.x,
					y: landingArc.y - targetCenter.y,
				}

				// Intermediate scale at click position
				const midScale = 0.3

				// Create keyframes for two-stage arc animation
				// 0% → 25% → 50% → 75% → 100%
				// Source → Takeoff Arc → Click → Landing Arc → Final
				this.element!.animate(
					[
						{
							// 0% - Start at source element
							transform: `translate(${sourceDelta.x}px, ${sourceDelta.y}px) scale(${sourceScale.x}, ${sourceScale.y})`,
							opacity: 0.6,
							offset: 0,
						},
						{
							// 25% - Peak of takeoff arc (bird lifts up)
							transform: `translate(${takeoffArcDelta.x}px, ${takeoffArcDelta.y}px) scale(${midScale * 0.7})`,
							opacity: 0.8,
							offset: 0.25,
						},
						{
							// 50% - At click position (transition point)
							transform: `translate(${clickDelta.x}px, ${clickDelta.y}px) scale(${midScale})`,
							opacity: 0.9,
							offset: 0.5,
						},
						{
							// 75% - Landing arc (bird descends toward target)
							transform: `translate(${landingArcDelta.x}px, ${landingArcDelta.y}px) scale(0.6)`,
							opacity: 0.95,
							offset: 0.75,
						},
						{
							// 100% - Final position
							transform: 'translate(0, 0) scale(1)',
							opacity: 1,
							offset: 1,
						},
					],
					{
						duration: totalDuration,
						easing: 'cubic-bezier(0.34, 1.2, 0.64, 1)', // Slight overshoot for organic feel
						fill: 'forwards',
					},
				)
			} else if (useBlackbird && clickPos) {
				// SINGLE-STAGE with arc (click position to final)
				const arcPoint = calculateArcPoint(clickPos, targetCenter, 'down', 0.35)
				const arcDelta = {
					x: arcPoint.x - targetCenter.x,
					y: arcPoint.y - targetCenter.y,
				}

				this.element!.animate(
					[
						{
							transform: `translate(${sourceDelta.x}px, ${sourceDelta.y}px) scale(0.1)`,
							opacity: 0,
							offset: 0,
						},
						{
							transform: `translate(${arcDelta.x}px, ${arcDelta.y}px) scale(0.5)`,
							opacity: 0.8,
							offset: 0.5,
						},
						{
							transform: 'translate(0, 0) scale(1)',
							opacity: 1,
							offset: 1,
						},
					],
					{
						duration: totalDuration,
						easing: 'cubic-bezier(0.34, 1.2, 0.64, 1)',
						fill: 'forwards',
					},
				)
			} else {
				// SIMPLE animation (fallback)
				this.element!.animate(
					[
						{
							transform: `translate(${sourceDelta.x}px, ${sourceDelta.y}px) scale(${sourceScale.x}, ${sourceScale.y})`,
							opacity: 0,
						},
						{ transform: 'translate(0, 0) scale(1, 1)', opacity: 1 },
					],
					{
						duration: totalDuration,
						easing: options?.easing ?? 'cubic-bezier(0.34, 1.56, 0.64, 1)',
						fill: 'forwards',
					},
				)
			}
		}

		// Handle image loading
		if (this.element instanceof HTMLImageElement) {
			if (this.element.complete) {
				requestAnimationFrame(animate)
			} else {
				this.element.onload = () => requestAnimationFrame(animate)
			}
		} else {
			requestAnimationFrame(animate)
		}
	}
}

export const flip = directive(FlipDirective)
