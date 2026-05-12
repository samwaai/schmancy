import { AsyncDirective, directive } from 'lit/async-directive.js'
import { ElementPart, PartType } from 'lit/directive.js'
import { EMPTY, Subject, animationFrameScheduler, combineLatest, fromEvent, merge, timer } from 'rxjs'
import { auditTime, filter, startWith, switchMap, takeUntil, tap } from 'rxjs/operators'
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
 * Reactive sources: window/visualViewport resize + scroll, orientation
 * change, iOS keyboard focus-out, parent/element ResizeObserver, theme
 * fullscreen toggle, theme bottom offset. Updates are frame-aligned via
 * `auditTime(0, animationFrameScheduler)` — the latest emission of any
 * source applies once per paint, so the box tracks continuous resize
 * drags without missing the final state.
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

	private subscribe() {
		const el = this.element
		if (!el) return

		combineLatest([
			merge(
				fromEvent(window, 'resize', { passive: true }),
				window.visualViewport
					? merge(
							fromEvent(window.visualViewport, 'resize', { passive: true }),
							fromEvent(window.visualViewport, 'scroll', { passive: true }),
						)
					: EMPTY,
				fromEvent(window, 'orientationchange'),
				fromEvent(document, 'focusout', { passive: true }).pipe(switchMap(() => timer(100))),
				fromResizeObserver(el),
				el.parentElement ? fromResizeObserver(el.parentElement) : EMPTY,
			).pipe(auditTime(0, animationFrameScheduler), startWith(null)),
			theme.bottomOffset$,
			theme.fullscreen$,
		])
			.pipe(
				filter(() => {
					const vv = window.visualViewport
					return vv ? Math.abs(vv.scale - 1) <= 0.01 : true
				}),
				tap(([, bottomOffset, isFullscreen]) => {
					const vv = window.visualViewport
					const rect = el.getBoundingClientRect()
					const s = el.style
					s.boxSizing = 'border-box'
					s.height = `${Math.max(0, (vv?.height ?? window.innerHeight) - rect.top)}px`
					s.width = `${Math.max(0, (vv?.width ?? window.innerWidth) - rect.left)}px`
					s.paddingBottom = `${isFullscreen ? 0 : bottomOffset}px`
					s.minHeight = '0'
					s.minWidth = '0'
					s.overflow = 'hidden'
				}),
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
