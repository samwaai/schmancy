import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs'
import type { OverlayEntry } from './overlay.types'

/**
 * Overlay stack — single source of truth for "what is currently open."
 *
 * A module-scope BehaviorSubject matching the `schmancy` skill's
 * "contexts at module scope; many small contexts beat one monolith"
 * guidance. Reactive pipelines inside the overlay service and public
 * `openOverlays$` observable project off this.
 *
 * Scroll lock and the stack-aware inert manager are both derived from
 * the stack state — no separate mutable counter variables. Honors rxjs
 * SUBSCRIPTION_IS_STATE: the stack IS the state; scroll lock / inert
 * are declarative projections.
 */

const stack$$ = new BehaviorSubject<readonly OverlayEntry[]>([])

/** Public read-only stream of the current stack. Emits on every push/pop. */
export const stack$: Observable<readonly OverlayEntry[]> = stack$$.asObservable()

/** Synchronous snapshot. Use only when a component can't subscribe. */
export function currentStack(): readonly OverlayEntry[] {
	return stack$$.value
}

/** Append an entry (top of stack). */
export function pushEntry(entry: OverlayEntry): void {
	stack$$.next([...stack$$.value, entry])
}

/** Remove by id. No-op if the id is not in the stack. */
export function removeEntry(id: string): void {
	const current = stack$$.value
	const next = current.filter((e) => e.id !== id)
	if (next.length !== current.length) {
		stack$$.next(next)
	}
}

/** Clear the entire stack. Used by dismissAll(). */
export function clearStack(): void {
	if (stack$$.value.length > 0) {
		stack$$.next([])
	}
}

/** Top entry (LIFO). Undefined when stack is empty. */
export function topEntry(): OverlayEntry | undefined {
	const s = stack$$.value
	return s[s.length - 1]
}

/* ---------------- scroll lock -------------------------------------------- */

/**
 * Ref-counted body scroll lock. Active whenever ANY modal-tier overlay is
 * in the stack. Popover-tier (Tier 1/2) overlays do NOT lock body scroll —
 * a menu / share card / picker shouldn't freeze the page scroll behind it
 * (that's platform UX convention).
 *
 * Subscription is idempotent — subscribing multiple times won't stack
 * effects, because it's a distinctUntilChanged boolean projection.
 *
 * Inner overlay close does NOT release the lock while an outer modal is
 * still open (this was the pre-existing bug in sheet.service.ts).
 */
let scrollLockActive = false
let previousOverflow = ''
let previousScrollbarGutter = ''

stack$$
	.pipe(
		map((s) => s.some((e) => e.modal)),
		distinctUntilChanged(),
	)
	.subscribe((shouldLock) => {
		if (typeof document === 'undefined') return

		if (shouldLock && !scrollLockActive) {
			previousOverflow = document.documentElement.style.overflow
			previousScrollbarGutter = document.documentElement.style.getPropertyValue('scrollbar-gutter')
			document.documentElement.style.overflow = 'hidden'
			document.documentElement.style.setProperty('scrollbar-gutter', 'stable')
			scrollLockActive = true
		} else if (!shouldLock && scrollLockActive) {
			document.documentElement.style.overflow = previousOverflow
			if (previousScrollbarGutter) {
				document.documentElement.style.setProperty('scrollbar-gutter', previousScrollbarGutter)
			} else {
				document.documentElement.style.removeProperty('scrollbar-gutter')
			}
			previousOverflow = ''
			previousScrollbarGutter = ''
			scrollLockActive = false
		}
	})

/* ---------------- stack-aware inert -------------------------------------- */

/**
 * When the first modal overlay opens, mark every sibling outside the
 * overlay host subtree as `inert` so AT and keyboard focus can't reach
 * them. Restored when the last modal overlay closes.
 *
 * Note: native `<dialog>.showModal()` already inerts the rest of the
 * document automatically. We keep this as a safety net for:
 *   - anchored (popover) overlays which are non-modal by design but may
 *     carry `modal: true` as the escape hatch;
 *   - stacked overlays where an inner modal opens above a non-modal —
 *     the sibling-inert is a no-op but we still guarantee the invariant.
 *
 * Callers that don't want inert (anchored/menu overlays) skip registration
 * via `markNonModal(id)`.
 */
const modalIds = new Set<string>()
const inertedSiblings = new Set<HTMLElement>()

export function markModal(id: string, hostContainer: HTMLElement): void {
	modalIds.add(id)
	if (modalIds.size === 1) {
		applyInert(hostContainer)
	}
}

export function unmarkModal(id: string): void {
	modalIds.delete(id)
	if (modalIds.size === 0) {
		releaseInert()
	}
}

function applyInert(hostContainer: HTMLElement): void {
	const parent = hostContainer.parentElement ?? document.body
	for (let i = 0; i < parent.children.length; i++) {
		const child = parent.children[i]
		if (child !== hostContainer && child instanceof HTMLElement && !child.inert) {
			child.inert = true
			inertedSiblings.add(child)
		}
	}
}

function releaseInert(): void {
	for (const el of inertedSiblings) {
		el.inert = false
	}
	inertedSiblings.clear()
}

/* ---------------- overlayEvents multicast helper ------------------------- */

/**
 * Returns an Observable of `tagName` elements currently in the stack.
 * The overlayEvents public helper composes `fromEvent` over this stream
 * via switchMap to tap events without owning the overlay lifecycle.
 *
 * Stays alive across open/close cycles — the caller owns completion via
 * `takeUntil(this.disconnecting)`, matching the house rxjs convention.
 */
export function elementsByTag$(tagName: string): Observable<readonly HTMLElement[]> {
	const lower = tagName.toLowerCase()
	return stack$$.pipe(
		map((entries) => {
			const matches: HTMLElement[] = []
			for (const entry of entries) {
				const inner = entry.element.querySelector<HTMLElement>(lower)
				if (inner) matches.push(inner)
			}
			return matches
		}),
		distinctUntilChanged((a, b) => a.length === b.length && a.every((el, i) => el === b[i])),
	)
}
