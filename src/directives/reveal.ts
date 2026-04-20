/**
 * Reveal Directive - Animated show/hide with zero layout shift
 *
 * Uses Blackbird spring physics for natural, organic motion.
 * Element stays in DOM to prevent layout shift.
 *
 * Usage:
 * ```ts
 * // Basic - uses 'smooth' preset
 * html`<div ${reveal(this.isVisible)}>Content</div>`
 *
 * // With preset - 'snappy' for quick interactions
 * html`<div ${reveal(this.isVisible, { preset: 'snappy' })}>Content</div>`
 *
 * // With custom max height
 * html`<div ${reveal(this.items.length > 1, { maxHeight: '200px' })}>Content</div>`
 *
 * // Bouncy for playful UI
 * html`<div ${reveal(this.showCelebration, { preset: 'bouncy' })}>🎉 Congrats!</div>`
 * ```
 *
 * Presets:
 * - 'smooth' (default): Apple-style, subtle overshoot - 500ms
 * - 'snappy': Quick with minimal overshoot - 300ms
 * - 'bouncy': Playful with noticeable overshoot - 600ms
 * - 'gentle': Slow, smooth, no overshoot - 700ms
 *
 * @see packages/schmancy/src/utils/animation.ts for Blackbird system
 */

import { noChange } from 'lit'
import { AsyncDirective, directive } from 'lit/async-directive.js'
import type { ElementPart, PartInfo } from 'lit/directive.js'
import { PartType } from 'lit/directive.js'
import {
	SPRING_SMOOTH,
	SPRING_SNAPPY,
	SPRING_BOUNCY,
	SPRING_GENTLE,
	getEasing,
	type AnimationPreset,
} from '../utils/animation'
import { reducedMotion$ } from './reduced-motion'

export type RevealPreset = 'smooth' | 'snappy' | 'bouncy' | 'gentle'

export interface RevealOptions {
	/** Animation preset (default: 'smooth') */
	preset?: RevealPreset
	/** Max height when revealed (default: '10rem') */
	maxHeight?: string
	/** Custom duration override in ms (uses preset duration if not specified) */
	duration?: number
	/** Custom easing override (uses preset easing if not specified) */
	easing?: string
}

const PRESETS: Record<RevealPreset, AnimationPreset> = {
	smooth: SPRING_SMOOTH,
	snappy: SPRING_SNAPPY,
	bouncy: SPRING_BOUNCY,
	gentle: SPRING_GENTLE,
}

class RevealDirective extends AsyncDirective {
	private initialized = false
	private element: HTMLElement | null = null

	constructor(partInfo: PartInfo) {
		super(partInfo)
		if (partInfo.type !== PartType.ELEMENT) {
			throw new Error('reveal() can only be used on elements')
		}
	}

	render(_show?: boolean, _options?: RevealOptions) {
		return noChange
	}

	override update(part: ElementPart, [show = false, options = {}]: [boolean | undefined, RevealOptions?]) {
		const element = part.element as HTMLElement
		this.element = element

		const { preset = 'smooth', maxHeight = '10rem', duration, easing } = options

		// Get the preset configuration
		const presetConfig = PRESETS[preset]

		// Determine actual duration and easing
		const actualDuration = duration ?? presetConfig.duration
		const actualEasing = easing ?? getEasing(presetConfig)

		const reducedMotion = reducedMotion$.value

		// Set up transitions on first run or when preset changes
		if (!this.initialized) {
			this.setupElement(element, actualDuration, actualEasing, reducedMotion)
			this.initialized = true
		}

		// Apply show/hide styles with spring physics
		if (show) {
			element.style.maxHeight = maxHeight
			element.style.opacity = '1'
			element.style.transform = 'translateY(0) scale(1)'
			element.style.pointerEvents = ''
			element.style.paddingTop = ''
			element.style.paddingBottom = ''
			element.style.marginTop = ''
			element.style.marginBottom = ''
			element.removeAttribute('aria-hidden')
			element.removeAttribute('inert')
		} else {
			element.style.maxHeight = '0'
			element.style.opacity = '0'
			element.style.transform = 'translateY(-8px) scale(0.98)'
			element.style.pointerEvents = 'none'
			element.style.paddingTop = '0'
			element.style.paddingBottom = '0'
			element.style.marginTop = '0'
			element.style.marginBottom = '0'
			element.setAttribute('aria-hidden', 'true')
			element.setAttribute('inert', '')
		}

		return noChange
	}

	private setupElement(element: HTMLElement, duration: number, easing: string, reducedMotion: boolean): void {
		element.style.overflow = 'hidden'

		if (reducedMotion) {
			// Instant transitions for reduced motion
			element.style.transition = 'none'
		} else {
			// Spring physics transitions — include padding/margin so hidden elements take zero space
			element.style.transition = [
				`max-height ${duration}ms ${easing}`,
				`opacity ${duration}ms ${easing}`,
				`transform ${duration}ms ${easing}`,
				`padding ${duration}ms ${easing}`,
				`margin ${duration}ms ${easing}`,
			].join(', ')
		}
	}

	override disconnected(): void {
		if (this.element) {
			this.element.style.willChange = ''
		}
	}

	override reconnected(): void {
		// State preserved in inline styles — no action needed
	}
}

export const reveal = directive(RevealDirective)
