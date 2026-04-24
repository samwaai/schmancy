import type { TemplateResult } from 'lit'
import type { Observable } from 'rxjs'
import type { ComponentType } from '../area/router.types'
import type { THistoryStrategy } from '../area/router.types'

/**
 * What the caller is showing. Flat union — `typeof`-discriminated at runtime.
 * Reuses area's `ComponentType` (class | tag name | HTMLElement | lazy loader)
 * and adds Lit `TemplateResult` for inline templates.
 *
 * The common case is one positional arg: `show(MyEditor)`, `show(html\`...\`)`,
 * `show(el)`, `show('my-tag')`, `show(lazy(() => import('./x')))`.
 */
export type Content = ComponentType | TemplateResult

/**
 * Anchor hint for positioning. When provided, the layout engine tries to
 * anchor the overlay near this point via Floating UI / CSS Anchor Positioning.
 * Falls back to centered / sheet if the anchored position can't fit.
 *
 * `MouseEvent | TouchEvent` — idiomatic: pass the event that triggered the show.
 * `HTMLElement` — anchor to the element's bounding box (menus, tooltips).
 * `{ x, y }` — explicit coordinates (rare; for programmatic positioning).
 */
export type Anchor = MouseEvent | HTMLElement | { x: number; y: number }

/**
 * How the overlay should behave. All optional; the system handles every
 * layout decision itself.
 */
export interface ShowOptions {
	/** Props to merge into the mounted component. Only meaningful when
	 *  `content` is a class, tag, or lazy loader. */
	props?: Record<string, unknown>

	/** Anchor hint — triggers anchored layout (the novel default) when passed.
	 *  Pass the MouseEvent that opened the overlay. */
	anchor?: Anchor

	/** Default `true`. `false` blocks Esc / backdrop click / swipe / popstate.
	 *  Programmatic dismiss (sub.unsubscribe / dismissAll) always works. */
	dismissable?: boolean

	/** Default `false`. Keep DOM between successive shows with the same
	 *  content — reuse cached mount instead of reconstructing. */
	persist?: boolean

	/** Standard web-platform cancellation input. Composes with fetch,
	 *  addEventListener, getUserMedia, etc. When signal aborts, overlay
	 *  dismisses (same as unsubscribe). */
	signal?: AbortSignal

	/** Rare escape hatch. Defaults: `false` for anchored, `true` for
	 *  centered/sheet. Setting `modal: true` on an anchored overlay forces
	 *  <dialog>.showModal() semantics (focus trap + background inert) —
	 *  use for destructive-confirm menus. */
	modal?: boolean

	/** Default `'push'`. Same vocabulary as `area.push()`.
	 *  - `'push'` — new history entry; back dismisses, forward re-opens.
	 *  - `'replace'` — replace current entry; back skips the overlay.
	 *  - `'silent'` — no history; for tooltips / transient / ephemeral UI. */
	historyStrategy?: THistoryStrategy
}

/**
 * Resolved layout. Pure output of the dispatch engine; callers never pick.
 * - `'centered'`  — native <dialog>.showModal(), focus-trapped.
 * - `'anchored'`  — popover="auto" + CSS Anchor Positioning / Floating UI,
 *                    non-modal, background stays interactive.
 * - `'sheet'`     — native <dialog>.showModal() as a bottom sheet,
 *                    swipe-to-dismiss, safe-area aware.
 */
export type OverlayLayout = 'centered' | 'anchored' | 'sheet'

/**
 * Read-only snapshot of an active overlay. Emitted as part of the
 * `openOverlays$` stream for stack introspection.
 */
export interface OverlayEntry {
	/** Internal id (auto-generated uuid). Exposed for debugging / devtools.
	 *  Not a public identifier — callers use the Subscription for identity. */
	readonly id: string
	/** The mounted `<schmancy-overlay>` element. Escape hatch for DOM access. */
	readonly element: HTMLElement
	/** Current layout, chosen by the dispatch engine. */
	readonly layout: OverlayLayout
}

/**
 * Reason the overlay closed. Emitted on the internal close-event `detail`
 * for consumers who need to distinguish user-dismiss from programmatic
 * dismiss from form submission.
 */
export type CloseReason =
	| 'structured'      // content dispatched CustomEvent('close', { detail })
	| 'native-submit'   // <form method="dialog"> committed a returnValue
	| 'escape'          // user pressed Escape
	| 'backdrop'        // user clicked outside the overlay
	| 'swipe'           // user swiped a bottom sheet down
	| 'popstate'        // user hit back button / hardware back
	| 'light-dismiss'   // popover light-dismiss (clicked outside anchored overlay)
	| 'programmatic'    // sub.unsubscribe() / dismissAll()
	| 'abort'           // AbortSignal aborted

/**
 * Options for confirm() / danger() / ask() sugar.
 */
export interface OverlayConfirmOptions {
	title?: string
	subtitle?: string
	message?: string
	/** Default `'Confirm'`. */
	confirmText?: string
	/** Default `'Cancel'`. */
	cancelText?: string
	/** `'danger'` flips the confirm button to destructive styling and
	 *  sets `role="alertdialog"`. */
	variant?: 'default' | 'danger'
	/** Anchor hint — same semantics as `show()`. */
	anchor?: Anchor
	/** Standard cancellation input. */
	signal?: AbortSignal
}

/**
 * Options for prompt() sugar.
 */
export interface OverlayPromptOptions extends OverlayConfirmOptions {
	label?: string
	defaultValue?: string
	placeholder?: string
	inputType?: 'text' | 'email' | 'number' | 'password' | 'url' | 'tel'
	/** Optional HTML5 validation pattern applied to the input. */
	pattern?: string
	required?: boolean
}

/**
 * Signature of the primary verb — declared here for consumption by the
 * service and the skill docs. Cold Observable; subscription IS the lifecycle.
 */
export type ShowFn = <T = void>(
	content: Content,
	options?: ShowOptions,
) => Observable<T | undefined>
