import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import './input'
import { expectNoA11yViolations } from '../test-utils/a11y'

const nextUpdate = () => new Promise(r => requestAnimationFrame(() => r(null)))

describe('schmancy-input', () => {
	let host: HTMLDivElement

	beforeEach(() => {
		host = document.createElement('div')
		document.body.appendChild(host)
	})

	afterEach(() => {
		host.remove()
	})

	it('contributes value to FormData under its name', async () => {
		host.innerHTML = `
			<form>
				<schmancy-input name="email" value="me@example.com"></schmancy-input>
			</form>
		`
		const form = host.querySelector('form') as HTMLFormElement
		await nextUpdate()
		await nextUpdate()
		expect(new FormData(form).get('email')).toBe('me@example.com')
	})

	it('reports invalid when required and empty', async () => {
		host.innerHTML = `<form><schmancy-input name="x" required></schmancy-input></form>`
		const form = host.querySelector('form') as HTMLFormElement
		const inp = host.querySelector('schmancy-input') as HTMLElement & {
			internals?: ElementInternals
			required: boolean
			value: string
			updateComplete: Promise<boolean>
			checkValidity(): boolean
		}
		await inp.updateComplete
		await nextUpdate()
		// Sanity probe — internal state and validity flags.
		expect(inp.required).toBe(true)
		expect(inp.value).toBe('')
		expect(inp.checkValidity()).toBe(false) // direct call, baseline
		expect(inp.internals?.validity?.valueMissing).toBe(true)
		expect(form.checkValidity()).toBe(false)
	})

	it('default validateOn is "dirty"', async () => {
		host.innerHTML = `<schmancy-input label="Email" required></schmancy-input>`
		const inp = host.querySelector('schmancy-input') as HTMLElement & { validateOn: string; error: boolean }
		await nextUpdate()
		await nextUpdate()
		expect(inp.validateOn).toBe('dirty')
		expect(inp.error).toBe(false) // pristine → no error
	})

	it('has no axe-core a11y violations (idle, with label)', async () => {
		host.innerHTML = `<schmancy-input label="Email address" type="email"></schmancy-input>`
		await nextUpdate()
		await nextUpdate()
		await expectNoA11yViolations(host)
	})

	it('has no axe-core a11y violations in error state', async () => {
		host.innerHTML = `<schmancy-input label="Email" required></schmancy-input>`
		const inp = host.querySelector('schmancy-input') as HTMLElement & {
			markSubmitted(): void
			checkValidity(): boolean
		}
		await nextUpdate()
		await nextUpdate()
		inp.markSubmitted()
		await nextUpdate()
		await nextUpdate()
		await expectNoA11yViolations(host)
	})
})
