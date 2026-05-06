import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import './form'
import './fields/input/input'
import '../button/button'
import './fields/checkbox/checkbox'
import { expectNoA11yViolations } from '../test-utils/a11y'
import type SchmancyForm from './form'
import type { SchmancyFormSubmitDetail } from './form'

const nextUpdate = () => new Promise(r => requestAnimationFrame(() => r(null)))

describe('schmancy-form', () => {
	let host: HTMLDivElement

	beforeEach(() => {
		host = document.createElement('div')
		document.body.appendChild(host)
	})

	afterEach(() => {
		host.remove()
	})

	it('renders a shadow-DOM <form> wrapping a slot', async () => {
		host.innerHTML = `
			<schmancy-form>
				<schmancy-checkbox name="agree"></schmancy-checkbox>
			</schmancy-form>
		`
		const sf = host.querySelector('schmancy-form') as SchmancyForm
		await nextUpdate()
		await nextUpdate()
		const innerForm = sf.shadowRoot?.querySelector('form')
		expect(innerForm).toBeInstanceOf(HTMLFormElement)
		// Field is in light DOM, slotted into the inner form's <slot>.
		expect(host.querySelector('schmancy-checkbox')).toBeTruthy()
	})

	it('emits submit with { data, formData, until } on native submission', async () => {
		host.innerHTML = `
			<schmancy-form>
				<schmancy-checkbox name="agree"></schmancy-checkbox>
				<button id="go" type="submit">Go</button>
			</schmancy-form>
		`
		const sf = host.querySelector('schmancy-form') as SchmancyForm
		const cb = host.querySelector('schmancy-checkbox') as HTMLElement & { value: boolean }
		cb.value = true
		await nextUpdate()
		await nextUpdate()

		const submits: SchmancyFormSubmitDetail[] = []
		sf.addEventListener('submit', (e: Event) => {
			submits.push((e as CustomEvent<SchmancyFormSubmitDetail>).detail)
		})

		const btn = host.querySelector('#go') as HTMLButtonElement
		btn.click()
		await nextUpdate()

		expect(submits).toHaveLength(1)
		expect(submits[0].formData.get('agree')).toBe('on')
		expect(typeof submits[0].until).toBe('function')
	})

	it('blocks submit when a required field is empty', async () => {
		host.innerHTML = `
			<schmancy-form>
				<schmancy-checkbox name="agree" required></schmancy-checkbox>
				<button id="go" type="submit">Go</button>
			</schmancy-form>
		`
		const sf = host.querySelector('schmancy-form') as SchmancyForm
		await nextUpdate()
		await nextUpdate()

		let submitCount = 0
		sf.addEventListener('submit', () => submitCount++)

		const btn = host.querySelector('#go') as HTMLButtonElement
		btn.click()
		await nextUpdate()

		expect(submitCount).toBe(0)
	})

	it('schmancy-button type=submit triggers form submission', async () => {
		host.innerHTML = `
			<schmancy-form>
				<schmancy-input name="email" value="x@y.z" required></schmancy-input>
				<schmancy-button id="sbtn" type="submit">Save</schmancy-button>
			</schmancy-form>
		`
		const sf = host.querySelector('schmancy-form') as SchmancyForm
		const btn = host.querySelector('#sbtn') as HTMLElement
		await nextUpdate()
		await nextUpdate()

		let submitted = false
		sf.addEventListener('submit', () => (submitted = true))

		btn.click()
		await nextUpdate()

		expect(submitted).toBe(true)
	})

	it('has no axe-core a11y violations when idle', async () => {
		host.innerHTML = `
			<schmancy-form>
				<schmancy-input name="email" label="Email" required></schmancy-input>
				<schmancy-button type="submit">Send</schmancy-button>
			</schmancy-form>
		`
		await nextUpdate()
		await nextUpdate()
		await expectNoA11yViolations(host)
	})

	it('has no axe-core a11y violations after invalid submit (live region populated)', async () => {
		host.innerHTML = `
			<schmancy-form>
				<schmancy-input name="email" label="Email" required></schmancy-input>
				<schmancy-button type="submit">Send</schmancy-button>
			</schmancy-form>
		`
		const sf = host.querySelector('schmancy-form') as SchmancyForm
		await nextUpdate()
		await nextUpdate()
		sf.setFormError('Server says no')
		await nextUpdate()
		await nextUpdate()
		await expectNoA11yViolations(host)
	})

	it('dispatches a single submit event (no double-fire)', async () => {
		host.innerHTML = `
			<schmancy-form>
				<button id="go" type="submit">Go</button>
			</schmancy-form>
		`
		const sf = host.querySelector('schmancy-form') as SchmancyForm
		await nextUpdate()
		await nextUpdate()

		let count = 0
		sf.addEventListener('submit', () => count++)

		const btn = host.querySelector('#go') as HTMLButtonElement
		btn.click()
		await nextUpdate()

		expect(count).toBe(1)
	})

	it('parses payload through `schema` when set', async () => {
		host.innerHTML = `
			<schmancy-form>
				<schmancy-input name="email" value="x@y.z"></schmancy-input>
				<button id="go" type="submit">Go</button>
			</schmancy-form>
		`
		const sf = host.querySelector('schmancy-form') as SchmancyForm<{
			parse(input: unknown): { email: string }
		}>
		// Trivial schema: returns { email: 'parsed' } regardless of input
		sf.schema = {
			parse: (_input: unknown) => ({ email: 'parsed' }),
		}
		await nextUpdate()
		await nextUpdate()

		let detail: SchmancyFormSubmitDetail<{ email: string }> | null = null
		sf.addEventListener('submit', (e: Event) => {
			detail = (e as CustomEvent<SchmancyFormSubmitDetail<{ email: string }>>).detail
		})

		const btn = host.querySelector('#go') as HTMLButtonElement
		btn.click()
		await nextUpdate()

		expect(detail).toBeTruthy()
		expect((detail as SchmancyFormSubmitDetail<{ email: string }>).data).toEqual({ email: 'parsed' })
	})

	it('announces server-side form error via assistive-tech live region', async () => {
		host.innerHTML = `
			<schmancy-form>
				<schmancy-input name="x" value="ok"></schmancy-input>
			</schmancy-form>
		`
		const sf = host.querySelector('schmancy-form') as SchmancyForm
		await nextUpdate()
		await nextUpdate()

		const liveRegion = sf.shadowRoot!.querySelector('[role="status"]') as HTMLElement
		expect(liveRegion).toBeTruthy()
		expect(liveRegion.getAttribute('aria-live')).toBe('assertive')
		// Idle: empty
		expect(liveRegion.textContent?.trim()).toBe('')

		sf.setFormError('Network error — please try again.')
		await nextUpdate()
		await nextUpdate()
		expect(liveRegion.textContent?.trim()).toBe('Network error — please try again.')
	})

	it('clears the live region on form reset', async () => {
		host.innerHTML = `
			<schmancy-form>
				<schmancy-input name="x" value="ok"></schmancy-input>
				<button id="r" type="reset">Reset</button>
			</schmancy-form>
		`
		const sf = host.querySelector('schmancy-form') as SchmancyForm
		await nextUpdate()
		await nextUpdate()

		sf.setFormError('Boom')
		await nextUpdate()
		await nextUpdate()
		const liveRegion = sf.shadowRoot!.querySelector('[role="status"]') as HTMLElement
		expect(liveRegion.textContent?.trim()).toBe('Boom')

		;(host.querySelector('#r') as HTMLButtonElement).click()
		await nextUpdate()
		await nextUpdate()
		expect(liveRegion.textContent?.trim()).toBe('')
	})

	it('emits formstate event on every submit-state change', async () => {
		host.innerHTML = `
			<schmancy-form>
				<schmancy-input name="x" value="ok"></schmancy-input>
				<schmancy-button type="submit">Send</schmancy-button>
			</schmancy-form>
		`
		const sf = host.querySelector('schmancy-form') as SchmancyForm
		await nextUpdate()
		await nextUpdate()
		const events: Array<{ status: string; submitCount: number }> = []
		sf.addEventListener('formstate', (e: Event) => {
			const d = (e as CustomEvent<{ status: string; submitCount: number }>).detail
			events.push({ status: d.status, submitCount: d.submitCount })
		})
		const btn = host.querySelector('schmancy-button[type=submit]') as HTMLElement
		btn.click()
		await nextUpdate()
		await nextUpdate()
		await nextUpdate()
		const statuses = events.map(e => e.status)
		// At minimum: submitting → success transitions for a successful submit.
		expect(statuses).toContain('submitting')
		expect(statuses).toContain('success')
	})

	it('clearSubmitted() resets the submitted flag without clearing values', async () => {
		host.innerHTML = `
			<schmancy-form>
				<schmancy-input name="email" required></schmancy-input>
				<schmancy-button type="submit">Send</schmancy-button>
			</schmancy-form>
		`
		const sf = host.querySelector('schmancy-form') as SchmancyForm
		const inp = host.querySelector('schmancy-input') as HTMLElement & {
			value: string
			submitted: boolean
			error: boolean
			updateComplete: Promise<boolean>
		}
		await inp.updateComplete
		await nextUpdate()

		// Fail submit so submitted flag flips and error is displayed.
		const btn = host.querySelector('schmancy-button[type=submit]') as HTMLElement
		btn.click()
		await nextUpdate()
		await nextUpdate()
		expect(inp.submitted).toBe(true)
		expect(inp.error).toBe(true)

		// Type something so the field is dirty.
		inp.value = 'me@example.com'
		await nextUpdate()
		await nextUpdate()

		// Step "back" — clearSubmitted resets the submit-driven mode but
		// leaves dirty/value/touched alone.
		sf.clearSubmitted()
		await nextUpdate()
		await nextUpdate()
		expect(inp.submitted).toBe(false)
		expect(inp.value).toBe('me@example.com') // value preserved
		expect(sf.matches(':state(idle)')).toBe(true)
	})

	it('setFieldError sets custom validity and forces error display', async () => {
		host.innerHTML = `
			<schmancy-form>
				<schmancy-input name="email" value="x@y.z"></schmancy-input>
			</schmancy-form>
		`
		const sf = host.querySelector('schmancy-form') as SchmancyForm
		const inp = host.querySelector('schmancy-input') as HTMLElement & {
			error: boolean
			validationMessage: string
			submitted: boolean
		}
		await nextUpdate()
		await nextUpdate()

		const ok = sf.setFieldError('email', 'Server says: email is taken')
		await nextUpdate()
		await nextUpdate()

		expect(ok).toBe(true)
		expect(inp.validationMessage).toBe('Server says: email is taken')
		expect(inp.submitted).toBe(true)
	})
})
