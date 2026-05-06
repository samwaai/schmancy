import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import './button'
import '../form/form'
import '../form/fields/input/input'
import { expectNoA11yViolations } from '../test-utils/a11y'
import type { SchmancyFormSubmitDetail } from '../form/form'

const nextUpdate = () => new Promise(r => requestAnimationFrame(() => r(null)))

describe('schmancy-button busy mirror', () => {
	let host: HTMLDivElement

	beforeEach(() => {
		host = document.createElement('div')
		document.body.appendChild(host)
	})

	afterEach(() => {
		host.remove()
	})

	it('mirrors closest <schmancy-form> aria-busy onto a submit button', async () => {
		host.innerHTML = `
			<schmancy-form>
				<schmancy-input name="x" value="ok"></schmancy-input>
				<schmancy-button type="submit">Send</schmancy-button>
			</schmancy-form>
		`
		const form = host.querySelector('schmancy-form') as HTMLElement
		const btn = host.querySelector('schmancy-button[type=submit]') as HTMLElement
		await nextUpdate()
		await nextUpdate()

		expect(btn.hasAttribute('aria-busy')).toBe(false)

		form.setAttribute('aria-busy', 'true')
		await nextUpdate()
		await nextUpdate()
		expect(btn.getAttribute('aria-busy')).toBe('true')
		expect(btn.matches(':state(submitting)')).toBe(true)

		form.removeAttribute('aria-busy')
		await nextUpdate()
		await nextUpdate()
		expect(btn.hasAttribute('aria-busy')).toBe(false)
		expect(btn.matches(':state(submitting)')).toBe(false)
	})

	it('does not mirror busy on non-submit buttons', async () => {
		host.innerHTML = `
			<schmancy-form>
				<schmancy-button type="button">Cancel</schmancy-button>
			</schmancy-form>
		`
		const form = host.querySelector('schmancy-form') as HTMLElement
		const btn = host.querySelector('schmancy-button') as HTMLElement
		await nextUpdate()
		await nextUpdate()

		form.setAttribute('aria-busy', 'true')
		await nextUpdate()
		await nextUpdate()
		expect(btn.hasAttribute('aria-busy')).toBe(false)
		expect(btn.matches(':state(submitting)')).toBe(false)
	})

	it('has no axe-core a11y violations in busy state', async () => {
		host.innerHTML = `
			<schmancy-form>
				<schmancy-input name="x" value="ok"></schmancy-input>
				<schmancy-button type="submit">Send</schmancy-button>
			</schmancy-form>
		`
		const form = host.querySelector('schmancy-form') as HTMLElement
		await nextUpdate()
		await nextUpdate()
		// Idle baseline.
		await expectNoA11yViolations(host)
		// Busy state — button gets aria-busy, must remain focusable + AT-clean.
		form.setAttribute('aria-busy', 'true')
		await nextUpdate()
		await nextUpdate()
		await expectNoA11yViolations(host)
	})

	it('drives busy through the awaitable submit lifecycle', async () => {
		host.innerHTML = `
			<schmancy-form>
				<schmancy-input name="x" value="ok"></schmancy-input>
				<schmancy-button type="submit">Send</schmancy-button>
			</schmancy-form>
		`
		const form = host.querySelector('schmancy-form') as HTMLElement
		const btn = host.querySelector('schmancy-button[type=submit]') as HTMLElement
		await nextUpdate()
		await nextUpdate()

		// Resolve the until-promise after a tick so we can observe the busy window.
		let resolveSubmit: (() => void) | null = null
		form.addEventListener('submit', (e: Event) => {
			const detail = (e as CustomEvent<SchmancyFormSubmitDetail>).detail
			detail.until(new Promise<void>(res => { resolveSubmit = res }))
		})

		btn.click()
		// Wait for the submit microtask + form state flip + MutationObserver tick.
		await nextUpdate()
		await nextUpdate()
		await nextUpdate()

		expect(btn.getAttribute('aria-busy')).toBe('true')
		expect(btn.matches(':state(submitting)')).toBe(true)

		resolveSubmit!()
		await nextUpdate()
		await nextUpdate()
		await nextUpdate()

		expect(btn.hasAttribute('aria-busy')).toBe(false)
		expect(btn.matches(':state(submitting)')).toBe(false)
	})
})
