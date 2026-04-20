import { directive, type ElementPart, PartType } from 'lit/directive.js'
import { AsyncDirective } from 'lit/async-directive.js'
import { fromEvent, Subject } from 'rxjs'
import { take, takeUntil } from 'rxjs/operators'

// Shared style — single injection for all ripple instances
let rippleStyleInjected = false
function ensureRippleStyle() {
	if (rippleStyleInjected) return
	const style = document.createElement('style')
	style.id = 'schmancy-ripple-shared'
	style.textContent = `
		.schmancy-ripple-effect {
			position: absolute;
			border-radius: 50%;
			background: var(--schmancy-sys-color-surface-on);
			opacity: 0.12;
			transform: scale(0);
			animation: schmancy-ripple-expand 600ms linear forwards;
			pointer-events: none;
			aria-hidden: true;
		}
		@keyframes schmancy-ripple-expand {
			to { transform: scale(4); opacity: 0; }
		}
	`
	document.head.appendChild(style)
	rippleStyleInjected = true
}

/**
 * Ripple directive — Material-style ink ripple on click.
 *
 * @example
 * ```html
 * <div ${ripple()}>Click me</div>
 * ```
 */
class RippleDirective extends AsyncDirective {
	private element!: HTMLElement
	private readonly teardown$ = new Subject<void>()

	render() {
		return undefined
	}

	override update(part: ElementPart) {
		if (part.type !== PartType.ELEMENT) {
			throw new Error('ripple directive must be used on an element')
		}

		this.element = part.element as HTMLElement
		ensureRippleStyle()

		// Ensure positioning context
		const pos = getComputedStyle(this.element).position
		if (pos === 'static') {
			this.element.style.position = 'relative'
		}
		this.element.style.overflow = 'hidden'

		this.teardown$.next()

		fromEvent<MouseEvent>(this.element, 'click').pipe(
			takeUntil(this.teardown$),
		).subscribe(e => this.addRipple(e))

		return undefined
	}

	override reconnected() {
		this.teardown$.next()
		fromEvent<MouseEvent>(this.element, 'click').pipe(
			takeUntil(this.teardown$),
		).subscribe(e => this.addRipple(e))
	}

	private addRipple(event: MouseEvent) {
		const rect = this.element.getBoundingClientRect()
		const diameter = Math.max(rect.width, rect.height)
		const radius = diameter / 2

		const circle = document.createElement('span')
		circle.className = 'schmancy-ripple-effect'
		circle.setAttribute('aria-hidden', 'true')
		circle.style.width = `${diameter}px`
		circle.style.height = `${diameter}px`
		circle.style.left = `${event.clientX - rect.left - radius}px`
		circle.style.top = `${event.clientY - rect.top - radius}px`

		this.element.appendChild(circle)

		// Remove after animation completes
		fromEvent(circle, 'animationend').pipe(take(1)).subscribe(() => circle.remove())
	}

	override disconnected() {
		this.teardown$.next()
	}
}

export const ripple = directive(RippleDirective)
