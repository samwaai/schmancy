import {
	BehaviorSubject,
	defer,
	defaultIfEmpty,
	distinctUntilChanged,
	EMPTY,
	filter,
	firstValueFrom,
	fromEvent,
	map,
	merge,
	Observable,
	Subject,
	switchMap,
	take,
	takeUntil,
} from 'rxjs'
import type { THistoryStrategy } from '../area/router.types'
import { SchmancyOverlay } from './overlay.component'
import {
	clearStack,
	currentStack,
	elementsByTag$,
	markModal,
	pushEntry,
	removeEntry,
	stack$ as internalStack$,
	unmarkModal,
} from './overlay.stack'
import type {
	CloseReason,
	OverlayConfirmOptions,
	Content,
	OverlayEntry,
	OverlayPromptOptions,
	ShowOptions,
} from './overlay.types'

/**
 * Public read-only stream of the current overlay stack. Subscribe to
 * observe stack changes — e.g. to update a breadcrumb, show a "close
 * all" button, or gate another action while any overlay is open.
 *
 * Emits synchronously with the current snapshot on subscribe. Never
 * completes — the caller owns teardown via `takeUntil(this.disconnecting)`.
 */
export const openOverlays$: Observable<readonly OverlayEntry[]> = internalStack$

/* ======================================================================= *
 *                        ambient event capture                              *
 * ======================================================================= *
 * Novel: callers do not need to pass `anchor: event` manually. The service
 * listens to pointerdown / click / keydown at capture phase on the document
 * and remembers the most-recent user gesture. When show() is invoked
 * synchronously (or shortly after) in response to that gesture, the remembered
 * event becomes the default anchor. This matches the "anchored is the novel
 * default" principle without forcing callers to thread events through
 * handlers.
 *
 * Staleness guard: an event older than AMBIENT_ANCHOR_MAX_AGE_MS is ignored.
 * Timer-driven or async show() calls that don't originate from a user gesture
 * fall through to centered / sheet layout.
 */
const AMBIENT_ANCHOR_MAX_AGE_MS = 750

interface AmbientAnchor {
	event: MouseEvent
	capturedAt: number
}

/**
 * BehaviorSubject projected off three document-level event streams,
 * merged as Observables per rxjs principle 3 (every async source
 * lifted into fromEvent). Keydown activations synthesize a MouseEvent
 * at the focused element's bounding rect so the anchor path can
 * carry keyboard-triggered opens uniformly.
 *
 * The singleton subscribe has no explicit teardown — the module's
 * lifetime IS the subscription's lifetime, which is the correct
 * SUBSCRIPTION_IS_STATE shape for a document-level event sink.
 */
const ambientAnchor$ = new BehaviorSubject<AmbientAnchor | null>(null)

if (typeof document !== 'undefined') {
	const pointerdown$ = fromEvent<PointerEvent>(document, 'pointerdown', { capture: true, passive: true }).pipe(
		map((e): AmbientAnchor => ({ event: e, capturedAt: performance.now() })),
	)
	const click$ = fromEvent<MouseEvent>(document, 'click', { capture: true, passive: true }).pipe(
		map((e): AmbientAnchor => ({ event: e, capturedAt: performance.now() })),
	)
	const keydown$ = fromEvent<KeyboardEvent>(document, 'keydown', { capture: true }).pipe(
		filter((e) => e.target instanceof Element),
		map((e): AmbientAnchor => {
			const rect = (e.target as Element).getBoundingClientRect()
			const synthetic = new MouseEvent('click', {
				clientX: rect.left + rect.width / 2,
				clientY: rect.top + rect.height / 2,
				bubbles: true,
			})
			return { event: synthetic, capturedAt: performance.now() }
		}),
	)

	merge(pointerdown$, click$, keydown$).subscribe((ambient) => ambientAnchor$.next(ambient))
}

function ambientAnchor(): MouseEvent | undefined {
	const cur = ambientAnchor$.value
	if (!cur) return undefined
	if (performance.now() - cur.capturedAt > AMBIENT_ANCHOR_MAX_AGE_MS) return undefined
	return cur.event
}


/* ======================================================================= *
 *                                   show                                    *
 * ======================================================================= */

/**
 * Open an overlay containing `content`. Returns a cold Observable — the
 * overlay mounts on subscribe and dismisses on unsubscribe. Emits at
 * most one value (the result from content's `close` event) then completes.
 *
 * The subscription IS the overlay lifecycle. `takeUntil(this.disconnecting)`
 * on the caller's side means the overlay auto-dismisses when the caller
 * unmounts — no handles to track, no leaks.
 *
 * **Anchored is the novel default.** When triggered by a user event, pass
 * it as `anchor` — the overlay blooms from the point of attention. Falls
 * back to centered or sheet when the viewport / content makes that the
 * better layout (see overlay.layout.ts).
 *
 * @example
 * show(MyEditor, { props: { id }, anchor: event })
 *   .pipe(takeUntil(this.disconnecting))
 *   .subscribe(saved => saved && this.store.persist(saved))
 */
export function show<T = void>(
	content: Content,
	options: ShowOptions = {},
): Observable<T | undefined> {
	return defer(() => {
		// Resolve anchor at subscribe time: caller's explicit anchor wins,
		// otherwise the ambient gesture captured by ambientAnchor$ fills in.
		const resolvedOptions: ShowOptions = {
			...options,
			anchor: options.anchor ?? ambientAnchor(),
		}

		return new Observable<T | undefined>((subscriber) => {
			let el: SchmancyOverlay | null = null
			let entry: OverlayEntry | null = null
			let historyPushed = false
			let settled = false

			const teardown$ = new Subject<void>()

			const mount = async () => {
				try {
					// Create and append the overlay element.
					el = document.createElement('schmancy-overlay') as SchmancyOverlay
					;(document.body ?? document.documentElement).appendChild(el)
					await el.updateComplete

					// Open it — mount content, resolve layout, animate in.
					await el.open(content, resolvedOptions)

					// Register with the stack (post-open so layout is resolved).
					const id = generateId()
					// The element exposes `modal` (boolean). `tier` is a placeholder
					// until the component reports its resolved tier — for now map
					// modal layouts to 'modal' and anchored to 'fui-only' (the
					// component rewrite in Step 6 will set `tier` precisely).
					entry = {
						id,
						element: el,
						layout: el.layout,
						modal: el.modal,
						tier: el.modal ? 'modal' : 'fui-only',
					}
					pushEntry(entry)

					// Register modality for the stack-aware inert manager when modal.
					if (el.modal && el.parentElement) {
						markModal(id, el)
					}

					// History integration — push a sentinel unless silent.
					const strategy: THistoryStrategy = resolvedOptions.historyStrategy ?? 'push'
					if (strategy === 'push') {
						history.pushState({ __schmancyOverlayId: id }, '', location.href)
						historyPushed = true
					} else if (strategy === 'replace') {
						history.replaceState({ __schmancyOverlayId: id }, '', location.href)
					}

					// popstate — close this overlay when the user hits back past us.
					// If another overlay's popstate fires first, that's fine; each overlay
					// handles its own via this listener.
					if (historyPushed) {
						fromEvent<PopStateEvent>(window, 'popstate')
							.pipe(take(1), takeUntil(teardown$))
							.subscribe(() => {
								// Avoid double-pop on teardown — set settled so the
								// teardown fn doesn't call history.back() again.
								settled = true
								void el?.close('popstate')
							})
					}

					// Subscribe to the element's internal close$ — the single source of
					// truth for lifecycle completion. Emits reason + optional result.
					el.closed$.pipe(take(1), takeUntil(teardown$)).subscribe(({ result }) => {
						settled = true
						subscriber.next(result as T | undefined)
						subscriber.complete()
					})
				} catch (err) {
					subscriber.error(err)
				}
			}

			void mount()

			return () => {
				teardown$.next()
				teardown$.complete()

				// Unsubscribe path — caller cancelled. Tear down the overlay.
				if (el && !settled) {
					void el.close('programmatic')
				}

				// Clean up registry entries.
				if (entry) {
					unmarkModal(entry.id)
					removeEntry(entry.id)
				}

				// Pop history if we pushed one and it's still current.
				if (historyPushed && !settled) {
					// Check before calling — if the user already popped, this is a noop.
					if (history.state?.__schmancyOverlayId === entry?.id) {
						history.back()
					}
					historyPushed = false
				}

				// Remove element after exit animation has had a chance to play.
				queueMicrotask(() => {
					el?.remove()
					el = null
				})
			}
		})
	})
}

/* ======================================================================= *
 *                            confirm / prompt sugar                         *
 * ======================================================================= */

/**
 * Yes/no confirmation dialog. Returns a Promise that resolves with the
 * user's choice. `variant: 'danger'` flips to destructive styling and
 * `role="alertdialog"`.
 */
export async function confirm(options: OverlayConfirmOptions = {}): Promise<boolean> {
	// Lazy-import the confirm body so push-only callers don't ship these
	// deps. The module is small; one-shot import penalty is fine.
	const { SchmancyOverlayPromptBody } = await import('./overlay.confirm-body')

	const result = await firstValueFrom(
		show<boolean>(SchmancyOverlayPromptBody, {
			anchor: options.anchor,
			signal: options.signal,
			props: {
				mode: 'confirm',
				heading: options.title,
				subtitle: options.subtitle,
				message: options.message,
				confirmText: options.confirmText ?? 'Confirm',
				cancelText: options.cancelText ?? 'Cancel',
				variant: options.variant ?? 'default',
			},
		}).pipe(defaultIfEmpty(false as boolean | undefined)),
	)
	return result === true
}

/**
 * Input prompt dialog. Returns the entered string, or `null` if the user
 * cancels or dismisses.
 */
export async function prompt(options: OverlayPromptOptions = {}): Promise<string | null> {
	const { SchmancyOverlayPromptBody } = await import('./overlay.confirm-body')

	const result = await firstValueFrom(
		show<string | null>(SchmancyOverlayPromptBody, {
			anchor: options.anchor,
			signal: options.signal,
			props: {
				mode: 'prompt',
				heading: options.title,
				subtitle: options.subtitle,
				message: options.message,
				label: options.label,
				defaultValue: options.defaultValue ?? '',
				placeholder: options.placeholder,
				inputType: options.inputType ?? 'text',
				pattern: options.pattern,
				required: options.required ?? false,
				confirmText: options.confirmText ?? 'OK',
				cancelText: options.cancelText ?? 'Cancel',
			},
		}).pipe(defaultIfEmpty(null as string | null | undefined)),
	)
	return typeof result === 'string' ? result : null
}

/* ======================================================================= *
 *                              overlayEvents                                *
 * ======================================================================= */

/**
 * Subscribe to custom events emitted from any currently-open overlay
 * whose content matches `tagName`. Inspired by `area.on(name)` — keyed
 * by tag name (stable across HMR / lazy chunks) rather than a uid or
 * class reference.
 *
 * The returned Observable never completes on its own — the caller owns
 * teardown via `takeUntil(this.disconnecting)`. During gaps where no
 * matching overlay is open, no events are emitted; when an instance
 * mounts, events flow.
 *
 * Stacked instances of the same content merge their event streams.
 */
export function overlayEvents<E extends Event = CustomEvent>(
	tagName: string,
	eventName: string,
): Observable<E> {
	return elementsByTag$(tagName).pipe(
		distinctUntilChanged((a, b) => a.length === b.length && a.every((el, i) => el === b[i])),
		switchMap((elements) =>
			elements.length === 0 ? EMPTY : merge(...elements.map((el) => fromEvent<E>(el, eventName))),
		),
		map((e) => e),
	)
}

/* ======================================================================= *
 *                                dismissAll                                 *
 * ======================================================================= */

/**
 * Close every currently-open overlay. LIFO order. Imperative — use for
 * app-level flows like logout or route reset.
 */
export function dismissAll(): void {
	const stack = [...currentStack()]
	// LIFO: close top-of-stack first.
	for (let i = stack.length - 1; i >= 0; i--) {
		const entry = stack[i]
		const overlay = entry.element as SchmancyOverlay
		void overlay.close('programmatic')
	}
	clearStack()
}

/* ======================================================================= *
 *                                 helpers                                   *
 * ======================================================================= */

function generateId(): string {
	// 8-char base36 is enough entropy for session-scoped uniqueness.
	return 'ov_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

// Re-export the close reason type for consumers who want to narrow on it.
export type { CloseReason }
