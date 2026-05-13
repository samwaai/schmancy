// overlay.stack.test.ts — unit tests for the stacked-overlay dismiss guard
//
// Exercises the outsideClick$ filter in SchmancyOverlay by driving the element
// state directly and calling wireCloseTriggers via type-cast. The test spies on
// close() so it doesn't need to wait for animation promises to settle.
//
// Uses the real browser DOM (vitest browser mode) so composedPath and
// shadow-DOM queries behave identically to production.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import './overlay.component'
import { clearStack, currentStack, pushEntry, removeEntry } from './overlay.stack'
import type { OverlayEntry } from './overlay.types'

const nextFrame = () => new Promise<void>(r => requestAnimationFrame(() => r()))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyOverlay = any

function entryFor(element: HTMLElement, id: string): OverlayEntry {
	return { id, element, layout: 'anchored', modal: false, tier: 'fui-only' }
}

// Patch the @query getter for _surface (read-only) so wireCloseTriggers reads it.
function patchSurface(overlay: AnyOverlay, surface: HTMLElement): void {
	Object.defineProperty(overlay, '_surface', { get: () => surface, configurable: true })
}

// Stub close() so tests don't wait for animation promises.
function stubClose(overlay: AnyOverlay): ReturnType<typeof vi.fn> {
	const spy = vi.fn().mockResolvedValue(undefined)
	Object.defineProperty(overlay, 'close', { value: spy, configurable: true })
	return spy
}

describe('overlay stacked-dismiss guard', () => {
	beforeEach(() => clearStack())
	afterEach(() => { clearStack(); vi.restoreAllMocks() })

	it('single overlay: body click invokes close("backdrop") (baseline)', async () => {
		const overlayA: AnyOverlay = document.createElement('schmancy-overlay')
		document.body.appendChild(overlayA)
		await nextFrame()

		const fakesurf = document.createElement('div')
		fakesurf.className = 'surface'
		document.body.appendChild(fakesurf)
		patchSurface(overlayA, fakesurf)

		overlayA.tier = 'fui-only'
		overlayA.dismissable = true
		overlayA.modal = false

		const closeSpy = stubClose(overlayA)

		pushEntry(entryFor(overlayA, 'a'))
		expect(currentStack()).toHaveLength(1)

		overlayA.wireCloseTriggers()

		// Dispatch on a separate span — not inside the overlay's surface.
		const outside = document.createElement('span')
		document.body.appendChild(outside)
		outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true, cancelable: true }))
		await nextFrame()

		expect(closeSpy.mock.calls[0]?.[0]).toBe('backdrop')

		outside.remove()
		fakesurf.remove()
		overlayA.remove()
		removeEntry('a')
	})

	it('nested overlay: click inside overlay B does not close overlay A', async () => {
		const overlayA: AnyOverlay = document.createElement('schmancy-overlay')
		const overlayB: AnyOverlay = document.createElement('schmancy-overlay')
		document.body.appendChild(overlayA)
		document.body.appendChild(overlayB)
		await nextFrame()

		const surfA = document.createElement('div')
		surfA.className = 'surface'
		document.body.appendChild(surfA)
		patchSurface(overlayA, surfA)

		overlayA.tier = 'fui-only'
		overlayA.dismissable = true
		overlayA.modal = false

		const closeSpy = stubClose(overlayA)

		// Register A first, then B on top.
		pushEntry(entryFor(overlayA, 'a'))
		pushEntry(entryFor(overlayB, 'b'))
		expect(currentStack()).toHaveLength(2)

		overlayA.wireCloseTriggers()

		// Dispatch a pointerdown on overlayB — its host element IS in composedPath.
		overlayB.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true, cancelable: true }))
		await nextFrame()

		// A must not have been closed.
		expect(closeSpy).not.toHaveBeenCalled()

		surfA.remove()
		overlayA.remove()
		overlayB.remove()
		removeEntry('a')
		removeEntry('b')
	})
})
