import { AsyncDirective, directive } from 'lit/async-directive.js'
import { ElementPart, PartType } from 'lit/directive.js'
import { EMPTY, Subject, combineLatest, fromEvent, merge, timer } from 'rxjs'
import { debounceTime, distinctUntilChanged, filter, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators'
import { theme } from '../theme/theme.service'
import { fromResizeObserver } from './layout'

/**
 * fill directive — anchors an element to the viewport in both dimensions
 * and contains overflow within its viewport-anchored box.
 *
 * The element's `getBoundingClientRect()` top/left are subtracted from the
 * visual viewport size; the remaining pixels are applied as inline `height`
 * and `width`. `overflow: hidden` ensures children cannot visually escape
 * the box; inner scroll containers (apply `overflowWithin()` on the
 * appropriate cell) handle scrolling.
 *
 * Layout is the consumer's responsibility — apply Tailwind classes
 * (`grid grid-cols-[auto_1fr] grid-rows-[1fr]`, `flex`, etc.) on the same
 * element to express the layout. The directive provides the definite-pixel
 * box; the consumer decides how it's divided.
 *
 * Cascade-independent — measurement is taken in viewport coordinates
 * rather than computed from CSS, so the directive works regardless of
 * what the element's ancestors declare.
 *
 * Reactive sources: window/visualViewport resize + scroll, orientation
 * change, iOS keyboard focus-out, parent/element ResizeObserver, theme
 * fullscreen toggle, theme bottom offset (safe-area / nav-bar reservation).
 *
 * @example sidebar + main
 *   <app-shell
 *     ${fill()}
 *     class="grid grid-cols-[auto_1fr] grid-rows-[1fr]"
 *   >
 *     <app-rail></app-rail>
 *     <app-content></app-content>
 *   </app-shell>
 */
class Fill extends AsyncDirective {
	private element: HTMLElement | null = null
	private disconnecting$ = new Subject<void>()

	private apply(bottomOffset: number, isFullscreen: boolean) {
		if (!this.element) return
		const vv = window.visualViewport
		const vh = vv?.height ?? window.innerHeight
		const vw = vv?.width ?? window.innerWidth
		const rect = this.element.getBoundingClientRect()
		const height = Math.max(0, vh - rect.top)
		const width = Math.max(0, vw - rect.left)
		const padding = isFullscreen ? 0 : bottomOffset
		const s = this.element.style
		s.boxSizing = 'border-box'
		s.height = `${height}px`
		s.width = `${width}px`
		s.paddingBottom = `${padding}px`
		s.minHeight = '0'
		s.minWidth = '0'
		s.overflow = 'hidden'
	}

	private subscribe() {
		if (!this.element) return

		const windowResize$ = fromEvent(window, 'resize', { passive: true })
		const viewportEvents$ = window.visualViewport
			? merge(
					fromEvent(window.visualViewport, 'resize', { passive: true }),
					fromEvent(window.visualViewport, 'scroll', { passive: true }),
				)
			: windowResize$
		const orientation$ = fromEvent(window, 'orientationchange')
		const focusOut$ = fromEvent(document, 'focusout', { passive: true }).pipe(
			switchMap(() => timer(100)),
		)
		const elementResize$ = fromResizeObserver(this.element)
		const parentResize$ = this.element.parentElement
			? fromResizeObserver(this.element.parentElement)
			: EMPTY

		combineLatest([
			merge(
				windowResize$,
				viewportEvents$,
				orientation$,
				focusOut$,
				elementResize$,
				parentResize$,
			).pipe(debounceTime(16), startWith(null)),
			theme.bottomOffset$,
			theme.fullscreen$,
		])
			.pipe(
				filter(() => {
					const vv = window.visualViewport
					return vv ? Math.abs(vv.scale - 1) <= 0.01 : true
				}),
				map(([, bottomOffset, isFullscreen]) => ({ bottomOffset, isFullscreen })),
				distinctUntilChanged(
					(a, b) => a.bottomOffset === b.bottomOffset && a.isFullscreen === b.isFullscreen,
				),
				tap(({ bottomOffset, isFullscreen }) => this.apply(bottomOffset, isFullscreen)),
				takeUntil(this.disconnecting$),
			)
			.subscribe()
	}

	render() {
		return
	}

	override update(part: ElementPart) {
		if (part.type !== PartType.ELEMENT) {
			throw new Error('fill directive can only be used on elements')
		}
		const el = part.element as HTMLElement
		if (this.element !== el) {
			this.element = el
			this.subscribe()
		}
	}

	protected override disconnected() {
		this.disconnecting$.next()
		this.element = null
	}

	protected override reconnected() {
		if (this.element) {
			this.disconnecting$ = new Subject<void>()
			this.subscribe()
		}
	}
}

export const fill = directive(Fill)
