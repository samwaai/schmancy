import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import './form'
import './form-summary'
import '../input/input'
import '../button/button'
import { expectNoA11yViolations } from '../test-utils/a11y'
import type SchmancyForm from './form'

const nextUpdate = () => new Promise(r => requestAnimationFrame(() => r(null)))

describe('schmancy-form-summary', () => {
	let host: HTMLDivElement

	beforeEach(() => {
		host = document.createElement('div')
		document.body.appendChild(host)
	})

	afterEach(() => {
		host.remove()
	})

	it('renders nothing when form is idle', async () => {
		host.innerHTML = `
			<schmancy-form>
				<schmancy-form-summary></schmancy-form-summary>
				<schmancy-input name="email" required></schmancy-input>
			</schmancy-form>
		`
		await nextUpdate()
		await nextUpdate()
		const summary = host.querySelector('schmancy-form-summary') as HTMLElement
		expect(summary.shadowRoot?.querySelector('[role="alert"]')).toBeNull()
	})

	it('renders banner with heading + form message after setFormError', async () => {
		host.innerHTML = `
			<schmancy-form>
				<schmancy-form-summary></schmancy-form-summary>
				<schmancy-input name="email" required></schmancy-input>
			</schmancy-form>
		`
		const sf = host.querySelector('schmancy-form') as SchmancyForm
		await nextUpdate()
		await nextUpdate()
		sf.setFormError('Network error — please try again.')
		await nextUpdate()
		await nextUpdate()
		await nextUpdate()
		const summary = host.querySelector('schmancy-form-summary') as HTMLElement
		const banner = summary.shadowRoot?.querySelector('[role="alert"]') as HTMLElement
		expect(banner).toBeTruthy()
		expect(banner.textContent).toContain('Network error')
	})

	it('lists invalid field links after a failed submit', async () => {
		host.innerHTML = `
			<schmancy-form>
				<schmancy-form-summary></schmancy-form-summary>
				<schmancy-input name="email" label="Email" required></schmancy-input>
				<schmancy-input name="city" label="City" required></schmancy-input>
				<schmancy-button type="submit">Send</schmancy-button>
			</schmancy-form>
		`
		const btn = host.querySelector('schmancy-button[type=submit]') as HTMLElement
		await nextUpdate()
		await nextUpdate()
		btn.click()
		// Wait long enough for: form submit chain → markSubmitted → field
		// updates → live region populated → MutationObserver fired → form-summary
		// re-render.
		await new Promise(r => setTimeout(r, 200))
		const summary = host.querySelector('schmancy-form-summary') as HTMLElement & {
			updateComplete: Promise<boolean>
		}
		await summary.updateComplete

		// Diagnostic: confirm fields actually report :state(invalid).
		const fields = host.querySelectorAll('schmancy-input')
		const invalidCount = Array.from(fields).filter(f => f.matches(':state(invalid)')).length
		expect(invalidCount).toBe(2) // sanity — fields are flagged

		const links = summary.shadowRoot?.querySelectorAll('a') ?? []
		expect(links.length).toBe(2)
		expect((links[0] as HTMLAnchorElement).textContent).toContain('Email')
	})

	it('has no axe-core a11y violations in error state', async () => {
		host.innerHTML = `
			<schmancy-form>
				<schmancy-form-summary></schmancy-form-summary>
				<schmancy-input name="email" label="Email" required></schmancy-input>
				<schmancy-button type="submit">Send</schmancy-button>
			</schmancy-form>
		`
		const sf = host.querySelector('schmancy-form') as SchmancyForm
		await nextUpdate()
		await nextUpdate()
		sf.setFormError('Server is down')
		await nextUpdate()
		await nextUpdate()
		await nextUpdate()
		await expectNoA11yViolations(host)
	})
})
