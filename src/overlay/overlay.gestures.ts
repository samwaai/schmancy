import {
	filter,
	fromEvent,
	map,
	merge,
	Observable,
	Subject,
	take,
	takeUntil,
	tap,
} from 'rxjs'

/**
 * Swipe-to-dismiss and keyboard-dismiss gestures for sheet-layout overlays.
 *
 * Pointer-event based — a single pipeline covers touch, mouse, pen, and
 * any future pointer source. Previous touch-only implementation silently
 * dropped mouse drags; this fixes that. Paired with a keyboard-dismiss
 * stream so WAI-ARIA Window-Splitter-pattern handles can dismiss without
 * a pointer at all.
 *
 * RxJS-native (rxjs skill principle 3: every async source is an Observable).
 * Thresholds are policy constants, not magic numbers.
 */

/** Distance (px) past which the gesture dismisses. */
export const DISMISS_DISTANCE_PX = 80
/** Distance as fraction of sheet height past which the gesture dismisses. */
export const DISMISS_DISTANCE_FRACTION = 0.25 // Vaul's value — feels right.
/** Velocity (px/ms) past which the gesture dismisses even short of distance. */
export const DISMISS_VELOCITY_PX_PER_MS = 0.4 // Vaul's value.
/** Drag only starts if pointerdown is within this top band (unless a drag handle is used). */
export const DRAG_START_TOP_PX = 40
/** Snap-back animation duration when gesture doesn't pass threshold. */
export const SNAP_BACK_MS = 300

/**
 * Logarithmic rubber-band damping for upward (negative) drag past the
 * top detent. Pulled from Vaul — `8 * (log(v + 1) - 2)` — diminishing
 * returns that feel physical, unlike the linear × 0.2 this replaces.
 *
 * Applied only to upward motion; downward drag tracks 1:1.
 */
export function logDamp(delta: number): number {
	if (delta >= 0) return delta
	const abs = -delta
	return -Math.max(0, 8 * (Math.log(abs + 1) - 2))
}

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
 * Emits exactly once when the user commits to dismissing the sheet
 * (distance OR velocity threshold passed). Works for touch, mouse, and
 * pen via the Pointer Events API. During an in-progress drag the
 * surface's `transform` is updated directly for 1:1 tracking. On
 * release-but-not-dismissed, the surface snaps back via a CSS transition.
 */
export function swipeToDismiss$(inputs: SwipeInputs): Observable<'dismiss'> {
	const { surface, dragHandle, until$ } = inputs

	return new Observable<'dismiss'>((subscriber) => {
		const dragTarget = dragHandle ?? surface
		const stopCurrent$ = new Subject<void>()

		let dragging = false
		let activePointerId: number | null = null
		let startY = 0
		let startTime = 0
		let currentDelta = 0

		const pointerDown$ = fromEvent<PointerEvent>(dragTarget, 'pointerdown').pipe(
			// Primary button / primary finger only. For touch, isPrimary also
			// covers the pinch-zoom guard (only one finger has isPrimary=true).
			filter((e) => e.isPrimary && (e.pointerType !== 'mouse' || e.button === 0)),
			// Without a dedicated drag handle, require start in the top band.
			filter((e) => {
				if (dragHandle) return true
				const rect = surface.getBoundingClientRect()
				return e.clientY - rect.top <= DRAG_START_TOP_PX
			}),
			tap((e) => {
				dragging = true
				activePointerId = e.pointerId
				startY = e.clientY
				startTime = performance.now()
				currentDelta = 0
				surface.style.transition = 'none'
				surface.style.willChange = 'transform'
				// Capture so pointermove fires even if the pointer leaves the element
				// (covers the "drag from handle, move past surface edge" case).
				try {
					;(dragTarget as Element).setPointerCapture?.(e.pointerId)
				} catch {
					// setPointerCapture can throw on detached elements; safe to ignore.
				}
			}),
		)

		const pointerMove$ = fromEvent<PointerEvent>(dragTarget, 'pointermove').pipe(
			filter(() => dragging),
			filter((e) => e.pointerId === activePointerId),
			tap((e) => {
				const deltaY = e.clientY - startY
				currentDelta = logDamp(deltaY)
				surface.style.transform = `translateY(${currentDelta}px)`
				// preventDefault is a no-op on default Pointer Events but avoids
				// accidental text selection / page scroll during the drag.
				if (e.cancelable) e.preventDefault()
			}),
		)

		const pointerEnd$ = merge(
			fromEvent<PointerEvent>(dragTarget, 'pointerup'),
			fromEvent<PointerEvent>(dragTarget, 'pointercancel'),
			fromEvent<PointerEvent>(dragTarget, 'lostpointercapture'),
		).pipe(
			filter(() => dragging),
			filter((e) => e.pointerId === activePointerId),
			tap(() => {
				dragging = false
				const pointerId = activePointerId
				activePointerId = null
				try {
					if (pointerId !== null) (dragTarget as Element).releasePointerCapture?.(pointerId)
				} catch {
					// same reason as setPointerCapture — ignore.
				}

				const elapsed = Math.max(1, performance.now() - startTime)
				const velocity = currentDelta / elapsed
				const surfaceHeight = surface.getBoundingClientRect().height
				const distanceThreshold = Math.min(DISMISS_DISTANCE_PX, surfaceHeight * DISMISS_DISTANCE_FRACTION)

				const shouldDismiss =
					currentDelta > distanceThreshold ||
					(currentDelta > 20 && velocity > DISMISS_VELOCITY_PX_PER_MS)

				surface.style.willChange = ''

				if (shouldDismiss) {
					// Finish translate off-screen for visual continuity with the dismiss
					// animation; the caller's teardown will unmount.
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

		merge(pointerDown$, pointerMove$, pointerEnd$)
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

/**
 * Keyboard-driven dismiss for a handle element wearing the W3C Window
 * Splitter pattern (role="separator" + tabindex="0" + aria-valuenow).
 *
 * Emits `'dismiss'` when the user presses Escape, End, or ArrowDown on
 * the handle while it has focus. ArrowDown/End both correspond to
 * "shrink the sheet to zero" — which, with a single-detent sheet, is
 * dismissal. Home/ArrowUp are no-ops (already at the largest detent).
 *
 * Composes with `swipeToDismiss$` via `merge().pipe(take(1))`:
 *
 *     merge(swipeToDismiss$(…), keyboardDismiss$(handle, until$))
 *       .pipe(take(1))
 *       .subscribe(() => this.close('gesture'))
 */
export function keyboardDismiss$(
	handle: HTMLElement,
	until$: Observable<unknown>,
): Observable<'dismiss'> {
	return fromEvent<KeyboardEvent>(handle, 'keydown').pipe(
		filter((e) => e.key === 'Escape' || e.key === 'End' || e.key === 'ArrowDown'),
		tap((e) => e.preventDefault()),
		map(() => 'dismiss' as const),
		takeUntil(until$),
		take(1),
	)
}
