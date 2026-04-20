import { directive, type ElementPart, PartType } from 'lit/directive.js'
import { AsyncDirective } from 'lit/async-directive.js'
import { from, EMPTY } from 'rxjs'
import { take, catchError, tap } from 'rxjs/operators'
import { SPRING_SMOOTH, SPRING_BOUNCY } from '../utils/animation'
import { reducedMotion$ } from './reduced-motion'

export interface GravityOptions {
	/** Mass: 0.5 (light/bouncy) to 2.0 (heavy/damped). Default: 1.0 */
	mass?: number
	/** Fall distance in pixels (default: 30) */
	distance?: number
	/** Delay before falling in ms (default: 0) */
	delay?: number
	/** Stagger delay per item for lists — multiply by index (default: 0) */
	stagger?: number
}

/**
 * Gravity directive — elements fall into place and settle with mass-based bounce.
 *
 * Only animates ONCE on first render. Re-renders do not re-trigger.
 * Disconnecting and reconnecting re-triggers the animation.
 *
 * @example
 * ```html
 * <schmancy-card ${gravity()}>content</schmancy-card>
 *
 * ${repeat(items, item => item.id, (item, i) => html`
 *   <div ${gravity({ stagger: 50 * i, mass: 0.8 })}>...</div>
 * `)}
 * ```
 */
class GravityDirective extends AsyncDirective {
	private element!: HTMLElement
	private animation?: Animation
	private hasAnimated = false
	private options?: GravityOptions

	render(_options?: GravityOptions) {
		return undefined
	}

	override update(part: ElementPart, [options]: [GravityOptions?]) {
		if (part.type !== PartType.ELEMENT) {
			throw new Error('gravity directive must be used on an element')
		}

		this.element = part.element as HTMLElement
		this.options = options

		if (this.hasAnimated) return undefined
		if (reducedMotion$.value) {
			this.hasAnimated = true
			return undefined
		}

		const mass = Math.max(0.3, Math.min(3.0, options?.mass ?? 1.0))
		const distance = options?.distance ?? 30
		const delay = (options?.delay ?? 0) + (options?.stagger ?? 0)

		this.animate(mass, distance, delay)
		this.hasAnimated = true

		return undefined
	}

	override reconnected() {
		this.hasAnimated = false
		if (this.options && !reducedMotion$.value) {
			const mass = Math.max(0.3, Math.min(3.0, this.options.mass ?? 1.0))
			const distance = this.options.distance ?? 30
			const delay = (this.options.delay ?? 0) + (this.options.stagger ?? 0)
			this.animate(mass, distance, delay)
			this.hasAnimated = true
		}
	}

	private animate(mass: number, distance: number, delay: number) {
		const preset = mass < 0.7 ? SPRING_BOUNCY : SPRING_SMOOTH
		const duration = preset.duration * (1 / Math.sqrt(mass))
		const fallDistance = distance * (1 / mass)

		this.animation?.cancel()

		this.element.style.willChange = 'transform, opacity'
		this.animation = this.element.animate(
			[
				{ opacity: 0, transform: `translateY(-${fallDistance}px)` },
				{ opacity: 1, transform: 'translateY(0)' },
			],
			{
				duration,
				delay,
				easing: preset.easingFallback,
				fill: 'backwards',
			},
		)

		// RxJS cleanup instead of raw .then()
		from(this.animation.finished).pipe(
			take(1),
			tap(() => {
				this.element.style.willChange = ''
				this.animation = undefined
			}),
			catchError(() => EMPTY), // Animation cancelled — no cleanup needed
		).subscribe()
	}

	override disconnected() {
		this.animation?.cancel()
		this.animation = undefined
	}
}

export const gravity = directive(GravityDirective)
