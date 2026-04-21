import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../test-utils/a11y'
import './checkbox'

describe('schmancy-checkbox', () => {
	let host: HTMLDivElement

	beforeEach(() => {
		host = document.createElement('div')
		document.body.appendChild(host)
	})

	afterEach(() => {
		host.remove()
	})

	const nextUpdate = () => new Promise(r => requestAnimationFrame(() => r(null)))

	it('is defined on the element registry', () => {
		expect(customElements.get('schmancy-checkbox')).toBeDefined()
	})

	it('has no axe-core a11y violations in default state', async () => {
		host.innerHTML = `<schmancy-checkbox label="Accept terms"></schmancy-checkbox>`
		await nextUpdate()
		await nextUpdate()
		await expectNoA11yViolations(host)
	})

	it('has no axe-core a11y violations when required + invalid', async () => {
		host.innerHTML = `
			<form>
				<schmancy-checkbox name="agree" label="I agree" required></schmancy-checkbox>
			</form>
		`
		await nextUpdate()
		await nextUpdate()
		await expectNoA11yViolations(host)
	})

	it('is form-associated and exposes an ElementInternals form', async () => {
		host.innerHTML = `
			<form id="f">
				<schmancy-checkbox name="agree" required></schmancy-checkbox>
			</form>
		`
		const form = host.querySelector('form') as HTMLFormElement
		const cb = host.querySelector('schmancy-checkbox') as HTMLElement & { value: boolean; form: HTMLFormElement | null }
		await nextUpdate()
		expect(cb.form).toBe(form)
	})

	it('contributes its value to FormData when checked', async () => {
		host.innerHTML = `
			<form id="f">
				<schmancy-checkbox name="agree"></schmancy-checkbox>
			</form>
		`
		const form = host.querySelector('form') as HTMLFormElement
		const cb = host.querySelector('schmancy-checkbox') as HTMLElement & { value: boolean }
		cb.value = true
		await nextUpdate()
		await nextUpdate()
		const fd = new FormData(form)
		expect(fd.get('agree')).toBe('on')
	})

	it('omits its value when unchecked', async () => {
		host.innerHTML = `
			<form id="f">
				<schmancy-checkbox name="agree"></schmancy-checkbox>
			</form>
		`
		const form = host.querySelector('form') as HTMLFormElement
		await nextUpdate()
		const fd = new FormData(form)
		expect(fd.get('agree')).toBeNull()
	})

	it('broadcasts :state(checked) when value is true', async () => {
		host.innerHTML = `<schmancy-checkbox></schmancy-checkbox>`
		const cb = host.querySelector('schmancy-checkbox') as HTMLElement & { value: boolean }
		cb.value = true
		await nextUpdate()
		await nextUpdate()
		expect(cb.matches(':state(checked)')).toBe(true)
		cb.value = false
		await nextUpdate()
		await nextUpdate()
		expect(cb.matches(':state(checked)')).toBe(false)
	})

	it('fails constraint validation when required and unchecked', async () => {
		host.innerHTML = `
			<form id="f">
				<schmancy-checkbox name="agree" required></schmancy-checkbox>
			</form>
		`
		const form = host.querySelector('form') as HTMLFormElement
		const cb = host.querySelector('schmancy-checkbox') as HTMLElement & {
			value: boolean
			checkValidity(): boolean
		}
		await nextUpdate()
		expect(cb.checkValidity()).toBe(false)
		expect(form.checkValidity()).toBe(false)
		cb.value = true
		await nextUpdate()
		await nextUpdate()
		expect(cb.checkValidity()).toBe(true)
		expect(form.checkValidity()).toBe(true)
	})
})
