import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../test-utils/a11y'
import './switch'

describe('schmancy-switch', () => {
	let host: HTMLDivElement

	beforeEach(() => {
		host = document.createElement('div')
		document.body.appendChild(host)
	})

	afterEach(() => {
		host.remove()
	})

	const nextUpdate = () => new Promise(r => requestAnimationFrame(() => r(null)))

	it('is form-associated and contributes when checked', async () => {
		host.innerHTML = `
			<form>
				<schmancy-switch name="notify" value="yes"></schmancy-switch>
			</form>
		`
		const form = host.querySelector('form') as HTMLFormElement
		const sw = host.querySelector('schmancy-switch') as HTMLElement & { checked: boolean }
		sw.checked = true
		await nextUpdate()
		await nextUpdate()
		expect(new FormData(form).get('notify')).toBe('yes')
	})

	it('omits from FormData when unchecked', async () => {
		host.innerHTML = `<form><schmancy-switch name="notify"></schmancy-switch></form>`
		const form = host.querySelector('form') as HTMLFormElement
		await nextUpdate()
		expect(new FormData(form).get('notify')).toBeNull()
	})

	it('fires change on toggle and broadcasts :state(checked)', async () => {
		host.innerHTML = `<schmancy-switch></schmancy-switch>`
		const sw = host.querySelector('schmancy-switch') as HTMLElement & {
			checked: boolean
			updateComplete: Promise<boolean>
		}
		await sw.updateComplete
		let detail: { value: boolean } | undefined
		sw.addEventListener('change', (e: Event) => {
			detail = (e as CustomEvent).detail
		})
		const btn = sw.shadowRoot!.querySelector('button') as HTMLButtonElement
		btn.click()
		await nextUpdate()
		await nextUpdate()
		expect(detail).toEqual({ value: true })
		expect(sw.matches(':state(checked)')).toBe(true)
	})

	it('exposes role="switch" with aria-checked', async () => {
		host.innerHTML = `<schmancy-switch></schmancy-switch>`
		const sw = host.querySelector('schmancy-switch') as HTMLElement & {
			updateComplete: Promise<boolean>
		}
		await sw.updateComplete
		const btn = sw.shadowRoot!.querySelector('button') as HTMLButtonElement
		expect(btn.getAttribute('role')).toBe('switch')
		expect(btn.getAttribute('aria-checked')).toBe('false')
	})

	it('has no axe-core a11y violations', async () => {
		host.innerHTML = `<schmancy-switch label="Notifications"></schmancy-switch>`
		const sw = host.querySelector('schmancy-switch') as HTMLElement & {
			updateComplete: Promise<boolean>
		}
		await sw.updateComplete
		await expectNoA11yViolations(host)
	})

	it('fails validation when required and unchecked', async () => {
		host.innerHTML = `<form><schmancy-switch name="agree" required></schmancy-switch></form>`
		const form = host.querySelector('form') as HTMLFormElement
		const sw = host.querySelector('schmancy-switch') as HTMLElement & {
			checked: boolean
			checkValidity(): boolean
		}
		await nextUpdate()
		expect(form.checkValidity()).toBe(false)
		sw.checked = true
		await nextUpdate()
		await nextUpdate()
		expect(form.checkValidity()).toBe(true)
	})
})
