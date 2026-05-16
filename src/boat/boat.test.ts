import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import './boat'
import '../surface/surface'
import type SchmancyBoat from './boat'

const nextUpdate = () => new Promise(r => requestAnimationFrame(() => r(null)))

// The overlay service aborts its own AbortController when an opened overlay
// is dismissed/unmounted; that rejection is overlay-internal and out of the
// boat's scope. Swallow ONLY AbortError so the suite stays clean without
// masking any other unhandled rejection.
const swallowAbort = (e: PromiseRejectionEvent) => {
	if ((e.reason as { name?: string } | null)?.name === 'AbortError') e.preventDefault()
}

const handleWrapper = (boat: SchmancyBoat) =>
	boat.shadowRoot!.querySelector('[aria-label="Drag to move"]') as HTMLElement
const triggerWrapper = (boat: SchmancyBoat) =>
	boat.shadowRoot!.querySelector('[aria-label="Open panel"]') as HTMLElement
const container = (boat: SchmancyBoat) =>
	boat.shadowRoot!.querySelector('schmancy-surface') as HTMLElement

describe('schmancy-boat — gesture/slot contract', () => {
	let host: HTMLDivElement

	beforeEach(() => {
		host = document.createElement('div')
		document.body.appendChild(host)
		localStorage.clear()
		window.addEventListener('unhandledrejection', swallowAbort)
	})

	afterEach(async () => {
		// Close any open overlay gracefully so show()'s teardown runs its
		// normal finalize path instead of aborting on an abrupt DOM removal.
		const boat = host.querySelector('schmancy-boat') as SchmancyBoat | null
		if (boat?.open) {
			boat.open = false
			await nextUpdate()
			await nextUpdate()
		}
		window.removeEventListener('unhandledrejection', swallowAbort)
		host.remove()
	})

	it('is static when no drag-handle is slotted (handle region hidden)', async () => {
		host.innerHTML = `<schmancy-boat id="a"><div slot="trigger">Open</div><div>panel</div></schmancy-boat>`
		const boat = host.querySelector('schmancy-boat') as SchmancyBoat
		await nextUpdate()
		await nextUpdate()
		expect(handleWrapper(boat).classList.contains('hidden')).toBe(true)
	})

	it('becomes draggable only when a drag-handle is slotted', async () => {
		host.innerHTML = `<schmancy-boat id="b"><span slot="drag-handle">⠿</span><div slot="trigger">Open</div><div>panel</div></schmancy-boat>`
		const boat = host.querySelector('schmancy-boat') as SchmancyBoat
		await nextUpdate()
		await nextUpdate()
		expect(handleWrapper(boat).classList.contains('hidden')).toBe(false)
		expect(handleWrapper(boat).classList.contains('cursor-grab')).toBe(true)
	})

	it('opens on a plain click anywhere on the trigger', async () => {
		host.innerHTML = `<schmancy-boat id="c"><div slot="trigger">Open me</div><div>panel</div></schmancy-boat>`
		const boat = host.querySelector('schmancy-boat') as SchmancyBoat
		await nextUpdate()
		expect(boat.open).toBe(false)
		triggerWrapper(boat).click()
		await nextUpdate()
		expect(boat.open).toBe(true)
	})

	it('does NOT suppress a slotted interactive control (the bug class)', async () => {
		host.innerHTML = `<schmancy-boat id="d"><button slot="trigger" id="inner">Act</button><div>panel</div></schmancy-boat>`
		const boat = host.querySelector('schmancy-boat') as SchmancyBoat
		const innerBtn = host.querySelector('#inner') as HTMLButtonElement
		let innerFired = false
		let prevented = false
		innerBtn.addEventListener('click', e => {
			innerFired = true
			prevented = e.defaultPrevented
		})
		await nextUpdate()

		innerBtn.click()
		await nextUpdate()

		// The slotted button's own handler ran, the boat did not preventDefault
		// it, and the click still bubbled to "open" the boat.
		expect(innerFired).toBe(true)
		expect(prevented).toBe(false)
		expect(boat.open).toBe(true)
	})

	it('drags from the handle and snaps (a moved gesture is not a tap-open)', async () => {
		host.innerHTML = `<schmancy-boat id="e"><span slot="drag-handle">⠿</span><div slot="trigger">Open</div><div>panel</div></schmancy-boat>`
		const boat = host.querySelector('schmancy-boat') as SchmancyBoat
		await nextUpdate()
		await nextUpdate()
		const grip = handleWrapper(boat)

		grip.dispatchEvent(
			new PointerEvent('pointerdown', { button: 0, pointerId: 1, clientX: 100, clientY: 100, bubbles: true }),
		)
		window.dispatchEvent(new PointerEvent('pointermove', { pointerId: 1, clientX: 100, clientY: 100 }))
		window.dispatchEvent(new PointerEvent('pointermove', { pointerId: 1, clientX: 220, clientY: 240 }))
		await nextUpdate()
		expect(container(boat).classList.contains('scale-95')).toBe(true)

		window.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1, clientX: 220, clientY: 240 }))
		await nextUpdate()
		expect(boat.open).toBe(false)
		expect(localStorage.getItem('schmancy-boat-e')).not.toBeNull()
	})

	it('treats a no-move press on the handle as a tap that opens', async () => {
		host.innerHTML = `<schmancy-boat id="f"><span slot="drag-handle">⠿</span><div slot="trigger">Open</div><div>panel</div></schmancy-boat>`
		const boat = host.querySelector('schmancy-boat') as SchmancyBoat
		await nextUpdate()
		await nextUpdate()
		const grip = handleWrapper(boat)

		grip.dispatchEvent(
			new PointerEvent('pointerdown', { button: 0, pointerId: 2, clientX: 50, clientY: 50, bubbles: true }),
		)
		window.dispatchEvent(new PointerEvent('pointerup', { pointerId: 2, clientX: 50, clientY: 50 }))
		await nextUpdate()
		expect(boat.open).toBe(true)
	})
})
