import { filter, fromEvent, merge, Observable, Subject, take, takeUntil, tap } from 'rxjs'

/**
 * Swipe-to-dismiss gesture for sheet-layout overlays.
 *
 * RxJS-native (rxjs skill principle 3: every async source is an Observable).
 * Returns an Observable that emits `'dismiss'` when the gesture passes the
 * distance/velocity threshold. Caller maps emissions to teardown.
 *
 * Thresholds are policy constants, not magic numbers.
 */

/** Distance beyond which the gesture dismisses, in px. */
export const DISMISS_DISTANCE_PX = 80
/** Distance beyond which the gesture dismisses, as a fraction of sheet height. */
export const DISMISS_DISTANCE_FRACTION = 0.3
/** Velocity beyond which the gesture dismisses, in px per ms. */
export const DISMISS_VELOCITY_PX_PER_MS = 0.5
/** Drag only starts if touchstart is within this top-px band (unless a drag handle is used). */
export const DRAG_START_TOP_PX = 40
/** Snap-back spring duration when gesture doesn't pass threshold. */
export const SNAP_BACK_MS = 300

export interface SwipeInputs {
	/** The surface element to track gestures on. */
	surface: HTMLElement
	/** Optional drag handle. When provided, drag can start from anywhere on
	 *  the handle; without it, drag must start in the top DRAG_START_TOP_PX band. */
	dragHandle?: HTMLElement | null
	/** Completes the gesture stream (component disconnect / layout change). */
	until$: Observable<unknown>
}

/**
 * Returns an Observable that emits exactly once when the user commits to
 * dismissing the sheet (threshold passed). The gesture is owned by the
 * caller — teardown fires on unsubscribe.
 *
 * During an in-progress drag, the surface's `transform` is updated
 * directly for 1:1 tracking. On release-but-not-dismissed, the surface
 * snaps back via a CSS transition.
 */
export function swipeToDismiss$(inputs: SwipeInputs): Observable<'dismiss'> {
	const { surface, dragHandle, until$ } = inputs

	return new Observable<'dismiss'>((subscriber) => {
		const dragTarget = dragHandle ?? surface
		const stopCurrent$ = new Subject<void>()

		let dragging = false
		let startY = 0
		let startTime = 0
		let currentDelta = 0

		const touchStart$ = fromEvent<TouchEvent>(dragTarget, 'touchstart', { passive: true }).pipe(
			// Pinch-zoom guard — only single-finger drags dismiss.
			filter((e) => e.touches.length === 1),
			// If no drag handle, require start within the top band.
			filter((e) => {
				if (dragHandle) return true
				const touch = e.touches[0]
				const rect = surface.getBoundingClientRect()
				return touch.clientY - rect.top <= DRAG_START_TOP_PX
			}),
			tap((e) => {
				dragging = true
				startY = e.touches[0].clientY
				startTime = performance.now()
				currentDelta = 0
				surface.style.transition = 'none'
				surface.style.willChange = 'transform'
			}),
		)

		const touchMove$ = fromEvent<TouchEvent>(surface, 'touchmove', { passive: false }).pipe(
			filter(() => dragging),
			filter((e) => e.touches.length === 1),
			tap((e) => {
				const deltaY = e.touches[0].clientY - startY
				// Rubber-band on upward drag.
				currentDelta = deltaY < 0 ? deltaY * 0.2 : deltaY
				surface.style.transform = `translateY(${currentDelta}px)`
				e.preventDefault()
			}),
		)

		const touchEnd$ = merge(
			fromEvent<TouchEvent>(surface, 'touchend', { passive: true }),
			fromEvent<TouchEvent>(surface, 'touchcancel', { passive: true }),
		).pipe(
			filter(() => dragging),
			tap(() => {
				dragging = false
				const elapsed = Math.max(1, performance.now() - startTime)
				const velocity = currentDelta / elapsed
				const surfaceHeight = surface.getBoundingClientRect().height
				const distanceThreshold = Math.min(DISMISS_DISTANCE_PX, surfaceHeight * DISMISS_DISTANCE_FRACTION)

				const shouldDismiss =
					currentDelta > distanceThreshold || (currentDelta > 20 && velocity > DISMISS_VELOCITY_PX_PER_MS)

				surface.style.willChange = ''

				if (shouldDismiss) {
					// Finish translate off-screen for visual continuity with the dismiss
					// animation; the caller's teardown will then unmount.
					surface.style.transition = `transform ${SNAP_BACK_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`
					surface.style.transform = 'translateY(100%)'
					subscriber.next('dismiss')
					subscriber.complete()
				} else {
					// Snap back to 0.
					surface.style.transition = `transform ${SNAP_BACK_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`
					surface.style.transform = 'translateY(0)'
				}
			}),
		)

		merge(touchStart$, touchMove$, touchEnd$)
			.pipe(takeUntil(merge(stopCurrent$, until$)))
			.subscribe()

		return () => {
			stopCurrent$.next()
			stopCurrent$.complete()
			surface.style.transition = ''
			surface.style.transform = ''
			surface.style.willChange = ''
		}
	}).pipe(take(1))
}
