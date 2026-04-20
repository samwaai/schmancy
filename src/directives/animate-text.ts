/**
 * animateText directive - Applies text animations to any element
 *
 * Usage:
 *   <span ${animateText({ animation: 'blur-reveal', stagger: 60 })}>Hello world</span>
 *   <span ${animateText({ animation: 'cyber-glitch', preset: 'snappy' })}>SAMWA</span>
 *
 * Supports: typewriter, fade-up, word-reveal, blur-reveal, cyber-glitch
 * Presets: 'smooth' (default), 'snappy', 'bouncy', 'gentle'
 * Waits for element visibility (opacity > 0.5) before starting animation.
 * Restores original textContent after animation completes.
 */
import { noChange } from 'lit'
import { AsyncDirective, directive } from 'lit/async-directive.js'
import type { ElementPart } from 'lit/directive.js'
import { Subject, interval, timer, fromEvent, combineLatest, from, defer, EMPTY, type Observable } from 'rxjs'
import { map, distinctUntilChanged, filter, startWith, take, delay, takeUntil, tap, takeWhile, switchMap, catchError, finalize } from 'rxjs/operators'
import {
	SPRING_SMOOTH,
	SPRING_SNAPPY,
	SPRING_BOUNCY,
	SPRING_GENTLE,
	type AnimationPreset,
} from '../utils/animation'

export type AnimationType = 'typewriter' | 'fade-up' | 'word-reveal' | 'blur-reveal' | 'cyber-glitch'
export type AnimationPresetName = 'smooth' | 'snappy' | 'bouncy' | 'gentle'

const PRESETS: Record<AnimationPresetName, AnimationPreset> = {
	smooth: SPRING_SMOOTH,
	snappy: SPRING_SNAPPY,
	bouncy: SPRING_BOUNCY,
	gentle: SPRING_GENTLE,
}

export interface AnimateTextOptions {
	animation: AnimationType
	delay?: number // ms to wait after becoming visible (default: 0)
	duration?: number // animation duration in ms (overrides preset)
	stagger?: number // ms between characters/words (default: 50)
	preset?: AnimationPresetName // spring physics preset (default: 'snappy')
	/**
	 * Provide text explicitly instead of reading from element.textContent.
	 * REQUIRED when the element contains Lit bindings (${...}), because
	 * animateText replaces innerHTML which destroys Lit's ChildPart markers.
	 */
	text?: string
	/** Re-animate every time the element re-enters the viewport (default: false) */
	restart?: boolean
}

class AnimateTextDirective extends AsyncDirective {
	private element: HTMLElement | null = null
	private originalContent: string = ''
	private animations: Animation[] = []
	private disconnecting$ = new Subject<void>()
	private initialized = false

	render(_options: AnimateTextOptions) {
		return noChange
	}

	override update(part: ElementPart, [options]: [AnimateTextOptions]) {
		this.element = part.element as HTMLElement

		// Initialize only once
		if (!this.initialized) {
			this.initialized = true

			// Recreate the Subject if it was completed by a previous cleanup()
			if (this.disconnecting$.closed) {
				this.disconnecting$ = new Subject<void>()
			}

			// Use explicit text if provided (avoids Lit ChildPart conflicts),
			// otherwise read from the element's existing textContent.
			if (options.text !== undefined) {
				this.originalContent = options.text
				this.element.textContent = options.text
			} else {
				this.originalContent = this.element.textContent || ''
			}

			this.element.style.willChange = 'transform, opacity'

			// Start hidden for all animations except typewriter (which reveals char by char)
			if (options.animation === 'typewriter') {
				this.element.textContent = ''
			} else {
				this.element.style.opacity = '0'
			}

			this.initialize(options)
		}

		return noChange
	}

	override disconnected(): void {
		this.cleanup()
	}

	override reconnected(): void {
		// Re-apply GPU hints if element reconnects
		if (this.element) {
			this.element.style.willChange = 'transform, opacity'
		}
	}

	private initialize(options: AnimateTextOptions): void {
		const { animation, delay: delayMs = 0, duration, stagger, preset = 'snappy', restart = false } = options

		// Get preset config for duration/easing defaults
		const presetConfig = PRESETS[preset]
		const actualDuration = duration ?? presetConfig.duration
		const actualStagger = stagger ?? (animation === 'cyber-glitch' ? 30 : 50)

		const visible$ = this.createVisibilityObservable$()

		const pipeline$ = restart
			? visible$.pipe(
				switchMap(visible =>
					visible
						? timer(delayMs).pipe(
							switchMap(() => this.runAnimation$(animation, actualDuration, actualStagger, presetConfig)),
						)
						: defer(() => {
							this.resetToInitial(animation)
							return EMPTY
						})
				),
			)
			: visible$.pipe(
				filter(v => v),
				take(1),
				delay(delayMs),
				switchMap(() => this.runAnimation$(animation, actualDuration, actualStagger, presetConfig)),
			)

		pipeline$.pipe(takeUntil(this.disconnecting$)).subscribe()
	}

	private cleanup(): void {
		// Signal disconnection to RxJS pipelines
		this.disconnecting$.next()
		this.disconnecting$.complete()

		// Cancel all Web Animation API animations
		this.cancelAnimations()

		// Restore original content and styles
		if (this.element) {
			this.element.textContent = this.originalContent
			this.element.style.opacity = ''
			this.element.style.willChange = 'auto'
			this.element.style.transform = ''
			this.element.style.filter = ''
		}

		this.element = null
		this.initialized = false
	}

	/** Cancel all running Web Animation API animations. */
	private cancelAnimations(): void {
		this.animations.forEach(a => a.cancel())
		this.animations = []
	}

	/** Cancel running animations and reset element to pre-animation state. */
	private resetToInitial(animation: AnimationType): void {
		this.cancelAnimations()

		if (!this.element) return

		if (animation === 'typewriter') {
			this.element.textContent = ''
		} else {
			this.element.textContent = this.originalContent
			this.element.style.opacity = '0'
		}
		this.element.style.transform = ''
		this.element.style.filter = ''
		this.element.style.willChange = 'transform, opacity'
	}

	/**
	 * Calculate accumulated opacity by walking up DOM tree.
	 * CSS opacity doesn't inherit as computed value - must multiply ancestors.
	 * Also handles shadow DOM: when slotted, checks the slot's container opacity.
	 * NOTE: Skips the element itself since we intentionally set its opacity to 0.
	 */
	private getAccumulatedOpacity(): number {
		if (!this.element) return 0

		let opacity = 1
		// Start from parent - skip self since we set element.style.opacity = '0'
		let el: HTMLElement | null = this.element.parentElement
		let depth = 0

		while (el && el !== document.body && depth < 10) {
			const style = window.getComputedStyle(el)
			if (style.visibility === 'hidden' || style.display === 'none') {
				return 0
			}
			const elOpacity = parseFloat(style.opacity) || 1
			if (elOpacity < 1) {
				opacity *= elOpacity
				if (opacity <= 0.5) return opacity
			}

			// Shadow DOM: check slot ancestors (e.g., step-container's internal div)
			if (el.assignedSlot) {
				const slotOpacity = this.getSlotAncestorOpacity(el.assignedSlot)
				if (slotOpacity === 0) return 0
				opacity *= slotOpacity
			}

			el = el.parentElement
			depth++
		}

		return opacity
	}

	/**
	 * Walk up from a slot element through its shadow DOM ancestors.
	 * Stops when parentElement is null (shadow root boundary).
	 */
	private getSlotAncestorOpacity(slot: HTMLSlotElement): number {
		let opacity = 1
		let el = slot.parentElement

		while (el) {
			const style = window.getComputedStyle(el)
			if (style.visibility === 'hidden' || style.display === 'none') {
				return 0
			}
			opacity *= parseFloat(style.opacity) || 1
			el = el.parentElement
		}

		return opacity
	}

	private createVisibilityObservable$() {
		// Document visibility (tab focused)
		const docVisible$ = fromEvent(document, 'visibilitychange').pipe(
			startWith(null),
			map(() => document.visibilityState === 'visible'),
			distinctUntilChanged(),
		)

		// Direct polling: getBoundingClientRect + accumulated opacity.
		// More reliable than IntersectionObserver which misses elements inside
		// animated containers or scroll-snapped layouts (fires only on change,
		// so a brief out-of-viewport during page-entry transition leaves it stuck false).
		// For restart:false the subscription is torn down after take(1), so
		// the interval stops as soon as the animation fires.
		const elementVisible$ = interval(200).pipe(
			startWith(0),
			map(() => {
				if (!this.element) return false
				const rect = this.element.getBoundingClientRect()
				const inViewport =
					rect.width > 0 &&
					rect.height > 0 &&
					rect.top < window.innerHeight &&
					rect.bottom > 0
				return inViewport && this.getAccumulatedOpacity() > 0.5
			}),
			distinctUntilChanged(),
		)

		return combineLatest([elementVisible$, docVisible$]).pipe(
			map(([el, doc]) => el && doc),
			distinctUntilChanged(),
		)
	}

	private runAnimation$(animation: AnimationType, duration: number, stagger: number, preset: AnimationPreset): Observable<unknown> {
		if (!this.element) return EMPTY

		switch (animation) {
			case 'fade-up':
				return this.animateFadeUp$(duration, preset)
			case 'blur-reveal':
				return this.animateBlurReveal$(duration, stagger, preset)
			case 'word-reveal':
				return this.animateWordReveal$(duration, stagger, preset)
			case 'cyber-glitch':
				return this.animateCyberGlitch$(duration, stagger, preset)
			case 'typewriter':
				return this.animateTypewriter$(duration)
			default:
				return EMPTY
		}
	}

	private animateFadeUp$(duration: number, preset: AnimationPreset): Observable<unknown> {
		if (!this.element) return EMPTY

		const anim = this.element.animate(
			[
				{ opacity: 0, transform: 'translateY(30px)' },
				{ opacity: 1, transform: 'translateY(0)' },
			],
			{
				duration,
				easing: preset.easingFallback,
				fill: 'forwards',
			},
		)

		this.animations.push(anim)

		return from(anim.finished).pipe(
			tap(() => {
				if (this.element) {
					this.element.style.opacity = ''
					this.element.style.transform = ''
					this.element.style.willChange = 'auto'
				}
			}),
			catchError(() => EMPTY),
		)
	}

	/**
	 * Walk childNodes: wrap text nodes as word-spans, preserve element children in place.
	 * Returns the ordered list of HTMLElements to animate (one per word + one per child element).
	 * Element children are MOVED (not cloned) to preserve Lit directive bindings.
	 */
	private wrapTextNodes(container: HTMLElement): HTMLElement[] {
		const targets: HTMLElement[] = []
		const fragment = document.createDocumentFragment()

		// Snapshot childNodes since we'll be moving them
		const nodes = Array.from(container.childNodes)

		for (const node of nodes) {
			if (node.nodeType === Node.TEXT_NODE) {
				const text = node.textContent || ''
				const words = text.split(/(\s+)/) // keep whitespace tokens
				for (const part of words) {
					if (/^\s+$/.test(part)) {
						fragment.appendChild(document.createTextNode(part))
					} else if (part.length > 0) {
						const span = document.createElement('span')
						span.textContent = part
						fragment.appendChild(span)
						targets.push(span)
					}
				}
			} else if (node instanceof HTMLElement) {
				// Move the original element to preserve Lit directive bindings (cycleText etc.)
				fragment.appendChild(node)
				targets.push(node)
			}
		}

		container.textContent = ''
		container.appendChild(fragment)
		return targets
	}

	private animateBlurReveal$(duration: number, stagger: number, preset: AnimationPreset): Observable<unknown> {
		if (!this.element) return EMPTY

		const animTargets = this.wrapTextNodes(this.element)

		// Remove outer element opacity so inner targets are visible when they animate
		this.element.style.opacity = '1'

		animTargets.forEach((target, i) => {
			target.style.opacity = '0'
			target.style.display = 'inline-block'
			const anim = target.animate(
				[
					{ opacity: 0, filter: 'blur(8px)', transform: 'scale(0.9)' },
					{ opacity: 1, filter: 'blur(0)', transform: 'scale(1)' },
				] as Keyframe[],
				{
					duration,
					easing: preset.easingFallback,
					delay: i * stagger,
					fill: 'forwards',
				},
			)
			this.animations.push(anim)
		})

		// Clean up after last animation
		const lastAnim = this.animations[this.animations.length - 1]
		if (!lastAnim) return EMPTY

		return from(lastAnim.finished).pipe(
			tap(() => {
				if (this.element) {
					this.element.style.willChange = 'auto'
					animTargets.forEach(t => { t.style.willChange = 'auto' })
				}
			}),
			catchError(() => EMPTY),
		)
	}

	private animateWordReveal$(duration: number, stagger: number, preset: AnimationPreset): Observable<unknown> {
		if (!this.element) return EMPTY

		const animTargets = this.wrapTextNodes(this.element)

		// Remove outer element opacity so inner targets are visible when they animate
		this.element.style.opacity = '1'

		animTargets.forEach((target, i) => {
			target.style.opacity = '0'
			target.style.display = 'inline-block'
			const anim = target.animate(
				[
					{ opacity: 0, transform: 'translateY(20px)' },
					{ opacity: 1, transform: 'translateY(0)' },
				],
				{
					duration,
					easing: preset.easingFallback,
					delay: i * stagger,
					fill: 'forwards',
				},
			)
			this.animations.push(anim)
		})

		// Clean up after last animation
		const lastAnim = this.animations[this.animations.length - 1]
		if (!lastAnim) return EMPTY

		return from(lastAnim.finished).pipe(
			tap(() => {
				if (this.element) {
					this.element.style.willChange = 'auto'
					animTargets.forEach(t => { t.style.willChange = 'auto' })
				}
			}),
			catchError(() => EMPTY),
		)
	}

	/**
	 * Cyber-glitch: Futuristic character-by-character reveal with scale + blur
	 * Each character pops in with overshoot spring physics
	 */
	private animateCyberGlitch$(duration: number, stagger: number, preset: AnimationPreset): Observable<unknown> {
		if (!this.element) return EMPTY

		// Split into individual characters (preserving spaces)
		const chars = this.originalContent.split('')
		const fragment = document.createDocumentFragment()
		const charElements: HTMLElement[] = []

		for (const char of chars) {
			const span = document.createElement('span')
			span.style.display = 'inline-block'
			span.style.opacity = '0'
			span.textContent = char === ' ' ? '\u00A0' : char
			fragment.appendChild(span)
			charElements.push(span)
		}

		this.element.textContent = ''
		this.element.appendChild(fragment)

		// Remove outer element opacity so inner spans are visible when they animate
		this.element.style.opacity = '1'

		charElements.forEach((span, i) => {
			// Skip animation for spaces but still include in timing
			if (chars[i] === ' ') {
				span.style.opacity = '1'
				return
			}

			const anim = span.animate(
				[
					{
						opacity: 0,
						transform: 'translateY(-8px) scale(1.4)',
						filter: 'blur(4px)',
					},
					{
						opacity: 1,
						transform: 'translateY(0) scale(1)',
						filter: 'blur(0)',
					},
				] as Keyframe[],
				{
					duration,
					easing: preset.easingFallback,
					delay: i * stagger,
					fill: 'forwards',
				},
			)
			this.animations.push(anim)
		})

		// Clean up after last animation
		const lastAnim = this.animations[this.animations.length - 1]
		if (!lastAnim) return EMPTY

		return from(lastAnim.finished).pipe(
			tap(() => {
				if (this.element) {
					this.element.style.willChange = 'auto'
					charElements.forEach(span => {
						span.style.willChange = 'auto'
					})
				}
			}),
			catchError(() => EMPTY),
		)
	}

	private animateTypewriter$(duration: number): Observable<unknown> {
		if (!this.element) return EMPTY

		const text = this.originalContent
		const totalChars = text.length
		if (totalChars === 0) return EMPTY

		const charDelay = duration / totalChars
		let typed = 0

		return interval(charDelay).pipe(
			tap(() => {
				typed++
				if (this.element) {
					this.element.textContent = text.slice(0, typed)
				}
			}),
			takeWhile(() => typed < totalChars),
			finalize(() => {
				if (this.element) {
					this.element.textContent = this.originalContent
					this.element.style.willChange = 'auto'
				}
			}),
		)
	}
}

export const animateText = directive(AnimateTextDirective)
