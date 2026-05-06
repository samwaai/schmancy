import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import './textarea'
import { expectNoA11yViolations } from '../test-utils/a11y'

const nextUpdate = () => new Promise(r => requestAnimationFrame(() => r(null)))

describe('schmancy-textarea', () => {
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
				<schmancy-textarea name="notes" value="hello"></schmancy-textarea>
			</form>
		`
		const form = host.querySelector('form') as HTMLFormElement
		await nextUpdate()
		await nextUpdate()
		expect(new FormData(form).get('notes')).toBe('hello')
	})

	it('reports invalid when required and empty', async () => {
		host.innerHTML = `<form><schmancy-textarea name="n" required></schmancy-textarea></form>`
		const form = host.querySelector('form') as HTMLFormElement
		await nextUpdate()
		await nextUpdate()
		expect(form.checkValidity()).toBe(false)
	})

	it('default validateOn is "dirty"', async () => {
		host.innerHTML = `<schmancy-textarea label="Notes" required></schmancy-textarea>`
		const ta = host.querySelector('schmancy-textarea') as HTMLElement & { validateOn: string; error: boolean }
		await nextUpdate()
		await nextUpdate()
		expect(ta.validateOn).toBe('dirty')
		expect(ta.error).toBe(false)
	})

	it('has no axe-core a11y violations (idle, with label)', async () => {
		host.innerHTML = `<schmancy-textarea label="Description"></schmancy-textarea>`
		await nextUpdate()
		await nextUpdate()
		await expectNoA11yViolations(host)
	})
})
