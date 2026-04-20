import { directive, type ElementPart, PartType } from 'lit/directive.js'
import { AsyncDirective } from 'lit/async-directive.js'
import { animationFrameScheduler, fromEvent, merge, Subject } from 'rxjs'
import { auditTime, map, takeUntil } from 'rxjs/operators'
import { SPRING_SNAPPY } from '../utils/animation'
import { reducedMotion$ } from './reduced-motion'

export interface MagneticOptions {
	/** Max displacement in pixels (default: 4) */
	strength?: number
	/** Activation radius in pixels (default: 100) */
	radius?: number
}

/**
 * Magnetic directive — elements lean toward the cursor with spring physics.
 *
 * Uses `style.translate` (CSS individual transform) so it composes
 * with existing transforms on the element.
 *
 * @example
 * ```html
 * <schmancy-button ${magnetic()}>Submit</schmancy-button>
 * <schmancy-icon-button ${magnetic({ strength: 6, radius: 120 })}>add</schmancy-icon-button>
 * ```
 */
class MagneticDirective extends AsyncDirective {
	private element!: HTMLElement
	private readonly teardown$ = new Subject<void>()
	private strength = 4
	private radius = 100
	private prevKey?: string
	private cachedRect?: DOMRect

	render(_options?: MagneticOptions) {
		return undefined
	}

	override update(part: ElementPart, [options]: [MagneticOptions?]) {
		if (part.type !== PartType.ELEMENT) {
			throw new Error('magnetic directive must be used on an element')
		}

		const key = JSON.stringify(options ?? {})
		if (this.element && key === this.prevKey) return undefined
		this.prevKey = key

		this.element = part.element as HTMLElement
		this.strength = options?.strength ?? 4
		this.radius = options?.radius ?? 100

		this.element.style.transition = `translate ${SPRING_SNAPPY.duration}ms ${SPRING_SNAPPY.easingFallback}`

		this.teardown$.next()
		this.setupMagnetic()

		return undefined
	}

	override reconnected() {
		this.teardown$.next()
		this.setupMagnetic()
	}

	private setupMagnetic() {
		if (reducedMotion$.value) return

		const target = this.element.parentElement ?? document

		const enter$ = fromEvent(this.element, 'mouseenter').pipe(
			map(() => {
				this.element.style.willChange = 'translate'
				this.cachedRect = this.element.getBoundingClientRect()
				return null
			}),
		)

		const move$ = fromEvent<MouseEvent>(target, 'mousemove').pipe(
			auditTime(0, animationFrameScheduler),
			map(e => {
				const rect = this.cachedRect ?? this.element.getBoundingClientRect()
				const centerX = rect.left + rect.width / 2
				const centerY = rect.top + rect.height / 2
				const dx = e.clientX - centerX
				const dy = e.clientY - centerY
				const distance = Math.sqrt(dx * dx + dy * dy)

				if (distance < this.radius && distance > 0) {
					const pull = (1 - distance / this.radius) * this.strength
					return { x: (dx / distance) * pull, y: (dy / distance) * pull }
				}
				return { x: 0, y: 0 }
			}),
		)

		const leave$ = fromEvent(target, 'mouseleave').pipe(
			map(() => {
				this.element.style.willChange = ''
				this.cachedRect = undefined
				return { x: 0, y: 0 }
			}),
		)

		// Also tear down if user enables reduced motion
		const motionChange$ = reducedMotion$.pipe(
			map(reduced => {
				if (reduced) {
					this.element.style.translate = ''
					this.element.style.willChange = ''
				}
				return null
			}),
		)

		merge(enter$, move$, leave$, motionChange$)
			.pipe(takeUntil(this.teardown$))
			.subscribe(pos => {
				if (pos) {
					this.element.style.translate = `${pos.x}px ${pos.y}px`
				}
			})
	}

	override disconnected() {
		this.teardown$.next()
		if (this.element) {
			this.element.style.translate = ''
			this.element.style.willChange = ''
		}
	}
}

export const magnetic = directive(MagneticDirective)
