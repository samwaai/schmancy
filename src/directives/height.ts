import { directive, PartInfo, PartType } from 'lit/directive.js'
import { AsyncDirective } from 'lit/async-directive.js'
import { Subject, fromEvent, merge } from 'rxjs'
import { debounceTime, takeUntil } from 'rxjs/operators'

// Lazy-initialized resize stream (local to this directive)
let resize$: Subject<void> | null = null
let resizeSub: { unsubscribe: () => void } | null = null
let elementCount = 0

function getResizeStream(): Subject<void> {
	if (!resize$) {
		resize$ = new Subject<void>()
		const windowResize$ = fromEvent(window, 'resize', { passive: true })
		const viewportResize$ = window.visualViewport
			? fromEvent(window.visualViewport, 'resize', { passive: true })
			: windowResize$

		resizeSub = merge(windowResize$, viewportResize$)
			.pipe(debounceTime(16))
			.subscribe(() => resize$!.next())
	}
	return resize$
}

function cleanup() {
	if (elementCount === 0 && resizeSub) {
		resizeSub.unsubscribe()
		resizeSub = null
		resize$ = null
	}
}

/**
 * Get bottom offset from CSS custom property.
 */
function getBottomOffset(): number {
	const value = getComputedStyle(document.documentElement).getPropertyValue('--schmancy-bottom-offset')
	return value ? parseFloat(value) : 0
}

/**
 * Directive that sets element height to fill remaining viewport space.
 * Uses visualViewport for accurate mobile height (handles keyboard).
 *
 * @example
 * html`<div ${fullHeight()}>Content</div>`
 */
class FullHeight extends AsyncDirective {
	private element: HTMLElement | null = null
	private disconnecting$ = new Subject<void>()

	private updateHeight() {
		if (this.element) {
			const viewportHeight = window.visualViewport?.height ?? window.innerHeight
			const topOffset = this.element.getBoundingClientRect().top
			const height = viewportHeight - topOffset - getBottomOffset()
			this.element.style.height = `${Math.max(0, height)}px`
		}
	}

	render() {
		return
	}

	update(part: PartInfo) {
		if (part.type !== PartType.ELEMENT) {
			throw new Error('fullHeight directive can only be used on elements')
		}
		const el = (part as any).element as HTMLElement
		if (this.element !== el) {
			this.element = el
			elementCount++
			this.updateHeight()
			getResizeStream()
				.pipe(takeUntil(this.disconnecting$))
				.subscribe(() => this.updateHeight())
		}
	}

	disconnected() {
		this.disconnecting$.next()
		elementCount--
		cleanup()
		this.element = null
	}

	reconnected() {
		if (this.element) {
			elementCount++
			this.updateHeight()
			getResizeStream()
				.pipe(takeUntil(this.disconnecting$))
				.subscribe(() => this.updateHeight())
		}
	}
}

export const fullHeight = directive(FullHeight)
