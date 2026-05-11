import type { TemplateResult } from 'lit'
import type { Observable } from 'rxjs'
import type { ComponentType } from '../area/router.types'
import type { THistoryStrategy } from '../area/router.types'

/**
 * Sync factory that returns a TemplateResult. Called at mount time so closed-over
 * variables are evaluated lazily — no snapshot staleness.
 */
export type TemplateFactory = () => TemplateResult

/**
 * What the caller is showing. Flat union — `typeof`-discriminated at runtime.
 * Reuses area's `ComponentType` (class | tag name | HTMLElement | lazy loader)
 * and adds Lit `TemplateResult` for inline templates plus `TemplateFactory` for
 * lazy template evaluation.
 *
 * The common case is one positional arg: `show(MyEditor)`, `show(html\`...\`)`,
 * `show(() => html\`...\`)`, `show(el)`, `show('my-tag')`, `show(lazy(() => import('./x')))`.
 */
export type Content = ComponentType | TemplateResult | TemplateFactory

/**
 * Virtual reference object — same contract Floating UI and CSS Anchor
 * Positioning accept. A caller who needs to anchor off something that
 * isn't a real element (e.g. a computed region, a scroll-clipped shape)
 * passes one of these. Must expose `getBoundingClientRect()` returning
 * a DOMRect-shaped value.
 */
export interface VirtualAnchor {
	getBoundingClientRect(): DOMRect
}

/**
 * Anchor hint for positioning. When provided, the layout engine tries to
 * anchor the overlay near this point via the Tier-1/2/3 positioning ladder
 * (CSS Anchor Positioning → Popover API + Floating UI → Floating UI only).
 * Falls back to centered / sheet if the anchored position can't fit.
 *
 * Forms accepted (typeof-discriminated at runtime):
 * - `MouseEvent | TouchEvent` — pass the event that triggered the show (most idiomatic)
 * - `HTMLElement` — anchor to the element's bounding box (menus, tooltips)
 * - `DOMRect` — explicit rect (rare; useful when the anchoring surface is virtual)
 * - `VirtualAnchor` — anything with `getBoundingClientRect()` (computed regions)
 * - `{ x: number; y: number }` — explicit coordinates (last resort)
 */
export type Anchor =
	| MouseEvent
	| TouchEvent
	| HTMLElement
	| DOMRect
	| VirtualAnchor
	| { x: number; y: number }

/**
 * Floating UI `Placement` subset the overlay exposes as a preferred
 * placement hint. The full set of 12 placements is supported internally;
 * this narrower list covers the practical cases a caller would name.
 */
export type OverlayPlacement =
	| 'top'
	| 'top-start'
	| 'top-end'
	| 'bottom'
	| 'bottom-start'
	| 'bottom-end'
	| 'left'
	| 'left-start'
	| 'left-end'
	| 'right'
	| 'right-start'
	| 'right-end'

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

	/** Preferred placement for anchored layouts. The positioning engine
	 *  (Floating UI `flip` middleware on Tier 2/3, CSS `position-try` on
	 *  Tier 1) will fall back when the preferred side doesn't fit.
	 *  Default is `'bottom-start'`. Ignored for centered / sheet layouts. */
	preferredPlacement?: OverlayPlacement

	/** Render a tail arrow pointing from the surface to the anchor.
	 *  Default `false`. Only meaningful on anchored layouts. */
	arrow?: boolean

	/** For anchored layouts: auto-track the anchor element's bounding rect
	 *  via `autoUpdate` (Floating UI tiers) or native `anchor-name` tracking
	 *  (CSS Anchor Positioning tier). Default `true` when an element anchor
	 *  is passed; `false` when a point / DOMRect / event anchor is passed
	 *  (those are inherently one-shot).
	 */
	track?: boolean
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
 * Positioning tier an anchored overlay is using.
 * - `'css-anchor'` — Tier 1: Popover API + CSS Anchor Positioning (Chromium).
 *                    Lives in native top-layer; the library's z-index stack
 *                    does not manage it.
 * - `'popover-fui'` — Tier 2: Popover API + Floating UI. Native top-layer;
 *                    z-index stack also skipped.
 * - `'fui-only'` — Tier 3: Floating UI only, manual backdrop + click-outside.
 *                    Uses the library's z-index stack.
 * - `'modal'` — centered / sheet layout; custom shell, library z-index.
 */
export type OverlayTier = 'css-anchor' | 'popover-fui' | 'fui-only' | 'modal'

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
	/** Whether this overlay traps focus + inerts siblings. Centered / sheet
	 *  default to modal; anchored defaults to non-modal (popover-like). */
	readonly modal: boolean
	/** Which positioning tier is in use. Scroll lock + sibling-inert only
	 *  fire for `'modal'` and `'fui-only'` tiers — native top-layer tiers
	 *  (`'popover-fui'`, `'css-anchor'`) handle stacking via the platform. */
	readonly tier: OverlayTier
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
