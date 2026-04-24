import type { Anchor, OverlayLayout, VirtualAnchor } from './overlay.types'

/**
 * Layout dispatch engine — pure function of (anchor, content, viewport).
 * No DOM access, no side effects — testable with synthetic inputs.
 *
 * Thresholds are policy constants, not magic numbers. Changes are visible
 * as named-constant diffs, not hidden in inline literals (state skill:
 * "thresholds ARE the policy").
 */

/** Below this viewport width, every overlay becomes a bottom sheet. */
export const NARROW_VIEWPORT_PX = 640

/** Content taller than this fraction of viewport height → sheet. */
export const TALL_CONTENT_FRACTION = 0.8

/** Content wider than this fraction of viewport width → sheet. */
export const WIDE_CONTENT_FRACTION = 0.9

/** Floating UI / CSS anchor-positioning safety padding. */
export const ANCHOR_FIT_PADDING_PX = 16

export interface LayoutInputs {
	anchor?: Anchor
	content: { width: number; height: number }
	viewport: {
		width: number
		height: number
		/** `matchMedia('(pointer: coarse)').matches` at call time. */
		isCoarsePointer: boolean
	}
}

/**
 * Priority order:
 *   1. viewport / content forces sheet
 *   2. anchor provided → anchored (the novel default)
 *   3. fallback → centered
 *
 * Floating UI's `flip` + `shift` + `size` middleware handles "anchor
 * doesn't fit initially" — it returns a fitting position rather than
 * rejecting. So step 2 does NOT branch on "does the anchor fit?";
 * Floating UI's output IS the answer. If content is genuinely too
 * large for any anchored position, step 1 already routed to sheet.
 */
export function resolveLayout(inputs: LayoutInputs): OverlayLayout {
	const { anchor, content, viewport } = inputs

	const isNarrow = viewport.width < NARROW_VIEWPORT_PX
	const isCoarse = viewport.isCoarsePointer
	const contentTall = content.height > viewport.height * TALL_CONTENT_FRACTION
	const contentWide = content.width > viewport.width * WIDE_CONTENT_FRACTION

	if (isNarrow || isCoarse || contentTall || contentWide) {
		return 'sheet'
	}

	if (anchor !== undefined) {
		return 'anchored'
	}

	return 'centered'
}

/**
 * Read the current viewport + pointer inputs. Separated so tests can
 * substitute synthetic inputs and the `resolveLayout` fn stays pure.
 */
export function readViewport(): LayoutInputs['viewport'] {
	return {
		width: window.innerWidth,
		height: window.innerHeight,
		isCoarsePointer: window.matchMedia('(pointer: coarse)').matches,
	}
}

/**
 * Resolved reference the positioning strategies consume.
 *
 * `el` is populated when the anchor is an HTMLElement — the Popover API
 * tier uses it directly via the `anchor=<id>` attribute, and Tier 1 / CSS
 * Anchor Positioning sets `element.style.anchorName` on it.
 *
 * `virtual` is populated for point/rect/TouchEvent anchors — Floating UI
 * accepts any object exposing `getBoundingClientRect()` as a virtual
 * reference. The Popover API path cannot use virtual references, so a
 * caller passing a point / DOMRect / event forces Tier 3 (or Tier 2 with
 * Floating UI, not CSS Anchor Positioning).
 */
export interface ResolvedAnchor {
	el?: HTMLElement
	virtual?: VirtualAnchor
}

/**
 * Normalise an `Anchor` input into the shape the positioning strategies
 * accept. One function, one decision: element wins if present; otherwise
 * synthesize a zero-size virtual reference at the anchor's point.
 *
 * Called by the overlay element during `open()` before dispatching to
 * `pickPositioner(resolved)`.
 */
export function resolveAnchorRef(anchor: Anchor | undefined): ResolvedAnchor | undefined {
	if (!anchor) return undefined

	// HTMLElement — native element reference.
	if (typeof HTMLElement !== 'undefined' && anchor instanceof HTMLElement) {
		return { el: anchor }
	}

	// Any other object with getBoundingClientRect — treat as virtual.
	if (typeof (anchor as { getBoundingClientRect?: unknown }).getBoundingClientRect === 'function') {
		return {
			virtual: {
				getBoundingClientRect: () => (anchor as { getBoundingClientRect(): DOMRect }).getBoundingClientRect(),
			},
		}
	}

	// DOMRect — fixed rect; synthesize a virtual that returns it verbatim.
	if (
		typeof (anchor as DOMRect).width === 'number' &&
		typeof (anchor as DOMRect).height === 'number' &&
		typeof (anchor as DOMRect).left === 'number' &&
		typeof (anchor as DOMRect).top === 'number'
	) {
		const rect = anchor as DOMRect
		return {
			virtual: {
				getBoundingClientRect: () => rect,
			},
		}
	}

	// MouseEvent / PointerEvent — zero-size rect at click point.
	if (typeof (anchor as MouseEvent).clientX === 'number' && typeof (anchor as MouseEvent).clientY === 'number') {
		const e = anchor as MouseEvent
		const rect = makePointRect(e.clientX, e.clientY)
		return { virtual: { getBoundingClientRect: () => rect } }
	}

	// TouchEvent — zero-size rect at first touch point.
	if (
		typeof (anchor as TouchEvent).touches !== 'undefined' &&
		(anchor as TouchEvent).touches.length > 0
	) {
		const t = (anchor as TouchEvent).touches[0]
		const rect = makePointRect(t.clientX, t.clientY)
		return { virtual: { getBoundingClientRect: () => rect } }
	}

	// { x, y } point — zero-size rect at coords.
	const pt = anchor as { x: number; y: number }
	const rect = makePointRect(pt.x, pt.y)
	return { virtual: { getBoundingClientRect: () => rect } }
}

/**
 * Construct a DOMRect-compatible object for a zero-width / zero-height
 * point. Avoids `new DOMRect(...)` which isn't constructable across all
 * lib.dom.d.ts vintages.
 */
function makePointRect(x: number, y: number): DOMRect {
	return {
		x,
		y,
		width: 0,
		height: 0,
		left: x,
		right: x,
		top: y,
		bottom: y,
		toJSON() {
			return { x, y, width: 0, height: 0, left: x, right: x, top: y, bottom: y }
		},
	}
}
