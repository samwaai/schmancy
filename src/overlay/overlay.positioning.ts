import {
	autoUpdate,
	computePosition,
	flip,
	offset,
	shift,
	size,
	type Placement,
} from '@floating-ui/dom'
import { Observable } from 'rxjs'
import { ANCHOR_FIT_PADDING_PX, type ResolvedAnchor } from './overlay.layout'
import type { OverlayPlacement, OverlayTier } from './overlay.types'

/**
 * Three-tier positioning ladder for anchored overlays. Public API of the
 * overlay doesn't change based on the tier — the strategy is picked
 * internally by feature-detection.
 *
 * Tier 1 — CSS Anchor Positioning (Popover + `anchor-name` / `position-anchor`)
 *   Zero-JS position tracking. Chromium-only today.
 *
 * Tier 2 — Popover API + Floating UI
 *   Native top-layer + light-dismiss + Esc from `popover="auto"`, Floating
 *   UI middleware for the position math. Safari 17+, Chrome 114+, Firefox 125+.
 *
 * Tier 3 — Floating UI only
 *   Fallback for browsers without the Popover API. Caller provides manual
 *   backdrop + click-outside + Esc wiring.
 */

/**
 * Feature-detection snapshot captured at module load. Frozen so consumers
 * can safely destructure and compare.
 */
export const CAPS = Object.freeze({
	popover:
		typeof HTMLElement !== 'undefined' &&
		'popover' in HTMLElement.prototype &&
		typeof (HTMLElement.prototype as unknown as { showPopover?: () => void }).showPopover === 'function',
	cssAnchor:
		typeof CSS !== 'undefined' &&
		typeof CSS.supports === 'function' &&
		CSS.supports('anchor-name: --x'),
})

/**
 * Pick the positioning tier for an anchor.
 *
 * CSS Anchor Positioning (Tier 1) requires a real element anchor — you
 * can't point `anchor-name` at a DOMRect or a coord. A point/rect anchor
 * forces Tier 2 (or Tier 3 if popover isn't supported).
 */
export function pickPositioner(anchor: ResolvedAnchor): OverlayTier {
	if (CAPS.popover && CAPS.cssAnchor && anchor.el) return 'css-anchor'
	if (CAPS.popover) return 'popover-fui'
	return 'fui-only'
}

/* ======================================================================= *
 *                   Tier 1 — Popover API + CSS Anchor                      *
 * ======================================================================= */

/**
 * Set up CSS Anchor Positioning. Assigns a unique `anchor-name` to the
 * anchor element and injects a stylesheet into the shadow root that
 * positions the surface relative to it. No JS running per frame.
 *
 * Returns a cleanup function that removes the injected styles and the
 * anchor-name from the anchor element.
 */
export function positionCSSAnchor(
	surface: HTMLElement,
	anchor: ResolvedAnchor,
	shadowRoot: ShadowRoot,
	opts: { id: string; placement?: OverlayPlacement } = { id: '' },
): () => void {
	if (!anchor.el) {
		throw new Error('positionCSSAnchor requires an element anchor')
	}
	const anchorEl = anchor.el
	const anchorName = `--ov-${opts.id || Math.random().toString(36).slice(2, 10)}`
	const placement = opts.placement ?? 'bottom-start'

	// Save any prior anchor-name so we can restore it on cleanup.
	const priorAnchorName = anchorEl.style.getPropertyValue('anchor-name')
	anchorEl.style.setProperty('anchor-name', anchorName)

	const sheet = new CSSStyleSheet()
	sheet.replaceSync(`
		${surface.localName}[data-overlay-ref="${opts.id}"] {
			position-anchor: ${anchorName};
			${cssForPlacement(placement)}
			margin: 8px;
			position-try-fallbacks:
				flip-block,
				flip-inline,
				flip-block flip-inline;
		}
	`)
	surface.dataset.overlayRef = opts.id
	const existing = shadowRoot.adoptedStyleSheets
	shadowRoot.adoptedStyleSheets = [...existing, sheet]

	return () => {
		if (priorAnchorName) {
			anchorEl.style.setProperty('anchor-name', priorAnchorName)
		} else {
			anchorEl.style.removeProperty('anchor-name')
		}
		shadowRoot.adoptedStyleSheets = shadowRoot.adoptedStyleSheets.filter((s) => s !== sheet)
		delete surface.dataset.overlayRef
	}
}

function cssForPlacement(p: OverlayPlacement): string {
	// Minimal mapping for the Tier 1 stylesheet. The browser's
	// `position-try-fallbacks` flips when the preferred side doesn't fit,
	// so only the starting side needs to be encoded here.
	switch (p) {
		case 'top':
		case 'top-start':
			return 'bottom: anchor(top); left: anchor(start);'
		case 'top-end':
			return 'bottom: anchor(top); right: anchor(end);'
		case 'bottom':
		case 'bottom-start':
			return 'top: anchor(bottom); left: anchor(start);'
		case 'bottom-end':
			return 'top: anchor(bottom); right: anchor(end);'
		case 'left':
		case 'left-start':
			return 'right: anchor(left); top: anchor(start);'
		case 'left-end':
			return 'right: anchor(left); bottom: anchor(end);'
		case 'right':
		case 'right-start':
			return 'left: anchor(right); top: anchor(start);'
		case 'right-end':
			return 'left: anchor(right); bottom: anchor(end);'
	}
}

/* ======================================================================= *
 *                   Tier 2 — Popover API (top-layer only)                   *
 * ======================================================================= */

/**
 * Wire the Popover API lifecycle — the surface gets `popover="auto"` and
 * `showPopover()` is called to promote it into the native top layer. No
 * position math here; the caller pairs this with `positionFloatingUI` for
 * the geometry, since Tier 2 is Popover-for-stacking + Floating UI-for-math.
 *
 * Returns a cleanup function that hides the popover and strips the attr.
 */
export function positionPopoverAPI(surface: HTMLElement): () => void {
	if (!CAPS.popover) {
		throw new Error('positionPopoverAPI requires Popover API support')
	}
	surface.setAttribute('popover', 'auto')
	try {
		;(surface as unknown as { showPopover(): void }).showPopover()
	} catch {
		// showPopover can throw if already shown or detached; the component
		// is responsible for calling this on an already-mounted, not-yet-shown
		// surface. Silently swallowing a double-open is fine.
	}
	return () => {
		try {
			;(surface as unknown as { hidePopover?: () => void }).hidePopover?.()
		} catch {
			// already hidden / disconnected — fine.
		}
		surface.removeAttribute('popover')
	}
}

/* ======================================================================= *
 *                  Tier 2 / 3 — Floating UI position math                   *
 * ======================================================================= */

export interface FloatingUIOptions {
	/** Preferred placement; Floating UI's `flip` middleware handles falls. */
	placement?: OverlayPlacement
	/** Padding used by `shift` + `size` middleware. Defaults to
	 *  `ANCHOR_FIT_PADDING_PX` from overlay.layout. */
	padding?: number
	/** Gap between anchor and surface. Default 8px. */
	offsetPx?: number
	/** Whether `autoUpdate` should track element resizes. Default true. */
	track?: boolean
}

/**
 * Floating UI-driven positioning. Returns a cold Observable — subscribe to
 * start positioning, unsubscribe to stop tracking (teardown cancels the
 * `autoUpdate` loop). The caller composes with `takeUntil(this.disconnecting)`:
 *
 *     positionFloatingUI(surface, anchor, opts)
 *       .pipe(takeUntil(this.disconnecting))
 *       .subscribe()
 *
 * Middleware (stack, in order):
 *   offset(opts.offsetPx)
 *   → flip({ fallbackPlacements: [...] })
 *   → shift({ padding: opts.padding })
 *   → size({ apply: clamp maxWidth AND maxHeight from availableWidth/Height })
 *
 * `flip` is chosen over `autoPlacement` because element-anchored overlays
 * should respect the trigger's spatial context (menus shouldn't jump
 * sides). Dialog uses `autoPlacement` because it's point-anchored.
 */
export function positionFloatingUI(
	surface: HTMLElement,
	anchor: ResolvedAnchor,
	opts: FloatingUIOptions = {},
): Observable<void> {
	return new Observable<void>((subscriber) => {
		const reference = anchor.el ?? anchor.virtual
		if (!reference) {
			subscriber.error(new Error('positionFloatingUI requires an element or virtual anchor'))
			return
		}

		const placement: Placement = (opts.placement ?? 'bottom-start') as Placement
		const padding = opts.padding ?? ANCHOR_FIT_PADDING_PX
		const offsetPx = opts.offsetPx ?? 8

		const update = async (): Promise<void> => {
			try {
				const { x, y } = await computePosition(reference, surface, {
					strategy: 'fixed',
					placement,
					middleware: [
						offset(offsetPx),
						flip({ padding, fallbackPlacements: defaultFallbacks(placement) }),
						shift({ padding }),
						size({
							padding,
							apply({ availableWidth, availableHeight, elements }) {
								elements.floating.style.maxWidth = `${Math.max(0, availableWidth)}px`
								elements.floating.style.maxHeight = `${Math.max(0, availableHeight)}px`
							},
						}),
					],
				})
				Object.assign(surface.style, {
					position: 'fixed',
					left: `${Math.round(x)}px`,
					top: `${Math.round(y)}px`,
					transform: 'none',
				})
				subscriber.next()
			} catch (err) {
				subscriber.error(err)
			}
		}

		const cleanup = autoUpdate(reference, surface, update, {
			ancestorScroll: true,
			ancestorResize: true,
			elementResize: opts.track !== false,
		})

		return () => {
			cleanup()
		}
	})
}

function defaultFallbacks(preferred: Placement): Placement[] {
	// Flip to the opposite side first, then try the perpendicular ends.
	// Small, deterministic list — not exhaustive.
	switch (preferred) {
		case 'bottom-start':
			return ['top-start', 'bottom-end', 'top-end']
		case 'bottom-end':
			return ['top-end', 'bottom-start', 'top-start']
		case 'top-start':
			return ['bottom-start', 'top-end', 'bottom-end']
		case 'top-end':
			return ['bottom-end', 'top-start', 'bottom-start']
		case 'left-start':
			return ['right-start', 'left-end', 'right-end']
		case 'left-end':
			return ['right-end', 'left-start', 'right-start']
		case 'right-start':
			return ['left-start', 'right-end', 'left-end']
		case 'right-end':
			return ['left-end', 'right-start', 'left-start']
		case 'top':
			return ['bottom', 'left', 'right']
		case 'bottom':
			return ['top', 'left', 'right']
		case 'left':
			return ['right', 'top', 'bottom']
		case 'right':
			return ['left', 'top', 'bottom']
		default:
			return ['top-start', 'bottom-end']
	}
}
