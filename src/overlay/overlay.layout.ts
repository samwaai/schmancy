import type { Anchor, OverlayLayout } from './overlay.types'

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
