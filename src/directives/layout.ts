import { directive, ElementPart, PartType } from 'lit/directive.js'
import { AsyncDirective } from 'lit/async-directive.js'
import { Subject, fromEvent, merge, Observable, EMPTY, timer, combineLatest } from 'rxjs'
import { debounceTime, switchMap, takeUntil, distinctUntilChanged, map, tap, startWith, filter } from 'rxjs/operators'

/** Returns true if user is pinch-zoomed (scale !== 1) */
function isZoomed(): boolean {
	const vv = window.visualViewport
	return vv ? Math.abs(vv.scale - 1) > 0.01 : false
}
import { theme } from '../theme/theme.service'

// Shared global update stream (lazy-initialized, cleaned up when no elements use it)
let update$: Subject<void> | null = null
let updateSub: { unsubscribe: () => void } | null = null
let elementCount = 0

function getUpdateStream(): Subject<void> {
	if (!update$) {
		update$ = new Subject<void>()

		const windowResize$ = fromEvent(window, 'resize', { passive: true })

		const viewportEvents$ = window.visualViewport
			? merge(
					fromEvent(window.visualViewport, 'resize', { passive: true }),
					fromEvent(window.visualViewport, 'scroll', { passive: true })
				)
			: windowResize$

		const orientation$ = fromEvent(window, 'orientationchange')

		// iOS Safari: force recalc after keyboard dismissal
		const focusOut$ = fromEvent(document, 'focusout', { passive: true }).pipe(
			switchMap(() => timer(100))
		)

		updateSub = merge(windowResize$, viewportEvents$, orientation$, focusOut$)
			.pipe(debounceTime(16))
			.subscribe(() => update$!.next())
	}
	return update$
}

function cleanup() {
	if (elementCount === 0 && updateSub) {
		updateSub.unsubscribe()
		updateSub = null
		update$ = null
	}
}


/**
 * RxJS wrapper for ResizeObserver - auto-cleans on unsubscribe
 */
export function fromResizeObserver(element: Element): Observable<ResizeObserverEntry[]> {
	return new Observable(subscriber => {
		const observer = new ResizeObserver(entries => subscriber.next(entries))
		observer.observe(element)
		return () => observer.disconnect()
	})
}

/**
 * fullHeight directive - fills remaining viewport space
 *
 * Reactive sources:
 * - Parent ResizeObserver (layout shifts)
 * - Window resize / visualViewport (viewport changes)
 * - Orientation change (device rotation)
 * - Focus out (mobile keyboard dismiss)
 * - Theme fullscreen toggle
 *
 * Performance:
 * - distinctUntilChanged prevents redundant style writes
 * - debounceTime(16) batches rapid events (~60fps)
 * - Single shared stream for global events
 */
class FullHeight extends AsyncDirective {
	private element: HTMLElement | null = null
	private disconnecting$ = new Subject<void>()

	private calculateHeight(): number {
		if (!this.element) return 0
		const viewportHeight = window.visualViewport?.height ?? window.innerHeight
		const topOffset = this.element.getBoundingClientRect().top
		return Math.max(0, viewportHeight - topOffset)
	}

	private applyStyles(height: number, bottomPadding: number) {
		if (this.element) {
			this.element.style.boxSizing = 'border-box'
			this.element.style.height = `${height}px`
			this.element.style.paddingBottom = `${bottomPadding}px`
		}
	}

	private setupHeightStream() {
		if (!this.element) return

		const element = this.element

		// Parent resize detects layout shifts (e.g., header rendering after load)
		const parentResize$ = element.parentElement
			? fromResizeObserver(element.parentElement)
			: EMPTY

		// Global events (resize, viewport, orientation, fullscreen)
		const globalEvents$ = getUpdateStream()

		// Combine all sources, calculate height and padding, dedupe, apply
		// Skip updates while pinch-zoomed to prevent layout thrashing
		combineLatest([
			merge(parentResize$, globalEvents$).pipe(startWith(null)),
			theme.bottomOffset$,
			theme.fullscreen$
		]).pipe(
			filter(() => !isZoomed()),
			map(([, bottomOffset, isFullscreen]) => ({
				height: this.calculateHeight(),
				padding: isFullscreen ? 0 : bottomOffset
			})),
			distinctUntilChanged((a, b) => a.height === b.height && a.padding === b.padding),
			tap(({ height, padding }) => this.applyStyles(height, padding)),
			takeUntil(this.disconnecting$)
		).subscribe()

	}

	render() {
		return
	}

	update(part: ElementPart) {
		if (part.type !== PartType.ELEMENT) {
			throw new Error('fullHeight directive can only be used on elements')
		}
		const el = part.element as HTMLElement
		if (this.element !== el) {
			this.element = el
			elementCount++
			this.setupHeightStream()
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
			this.disconnecting$ = new Subject<void>()
			this.setupHeightStream()
		}
	}
}

export const fullHeight = directive(FullHeight)

/**
 * fullWidth directive - fills remaining horizontal viewport space
 *
 * Reactive sources:
 * - Element ResizeObserver (detects when element moves/resizes)
 * - Parent ResizeObserver (layout shifts, e.g., sidebar)
 * - Window resize / visualViewport (viewport changes)
 * - Orientation change (device rotation)
 * - Theme fullscreen toggle (sidebar visibility)
 *
 * Performance:
 * - distinctUntilChanged prevents redundant style writes
 * - debounceTime(16) batches rapid events (~60fps)
 * - Single shared stream for global events
 */
class FullWidth extends AsyncDirective {
	private element: HTMLElement | null = null
	private disconnecting$ = new Subject<void>()

	private calculateWidth(): number {
		if (!this.element) return 0
		const viewportWidth = window.visualViewport?.width ?? window.innerWidth
		const leftOffset = this.element.getBoundingClientRect().left
		return Math.max(0, viewportWidth - leftOffset)
	}

	private applyStyles(width: number) {
		if (this.element) {
			this.element.style.boxSizing = 'border-box'
			this.element.style.maxWidth = `${width}px`
		}
	}

	private setupWidthStream() {
		if (!this.element) return

		const element = this.element

		// Element resize detects when element itself moves (e.g., after layout settles)
		const elementResize$ = fromResizeObserver(element)

		// Parent resize detects layout shifts (e.g., sidebar opening/closing)
		const parentResize$ = element.parentElement
			? fromResizeObserver(element.parentElement)
			: EMPTY

		// Global events (resize, viewport, orientation)
		const globalEvents$ = getUpdateStream()

		// Combine all sources with theme observables for synchronous initial emission
		// theme.fullscreen$ has shareReplay(1) ensuring immediate emission on subscribe
		// Skip updates while pinch-zoomed to prevent layout thrashing
		combineLatest([
			merge(elementResize$, parentResize$, globalEvents$).pipe(startWith(null)),
			theme.fullscreen$
		]).pipe(
			filter(() => !isZoomed()),
			map(() => this.calculateWidth()),
			distinctUntilChanged(),
			tap(width => this.applyStyles(width)),
			takeUntil(this.disconnecting$)
		).subscribe()
	}

	render() {
		return
	}

	update(part: ElementPart) {
		if (part.type !== PartType.ELEMENT) {
			throw new Error('fullWidth directive can only be used on elements')
		}
		const el = part.element as HTMLElement
		if (this.element !== el) {
			this.element = el
			elementCount++
			this.setupWidthStream()
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
			this.disconnecting$ = new Subject<void>()
			this.setupWidthStream()
		}
	}
}

export const fullWidth = directive(FullWidth)
