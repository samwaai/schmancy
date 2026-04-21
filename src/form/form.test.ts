import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import './form'
import '../input/input'
import '../button/button'
import '../checkbox/checkbox'

describe('schmancy-form', () => {
	let host: HTMLDivElement

	beforeEach(() => {
		host = document.createElement('div')
		document.body.appendChild(host)
	})

	afterEach(() => {
		host.remove()
	})

	const nextUpdate = () => new Promise(r => requestAnimationFrame(() => r(null)))

	it('wraps children in a real light-DOM <form>', async () => {
		host.innerHTML = `
			<schmancy-form>
				<schmancy-checkbox name="agree"></schmancy-checkbox>
			</schmancy-form>
		`
		const sf = host.querySelector('schmancy-form') as HTMLElement & { form: HTMLFormElement | null }
		await nextUpdate()
		expect(sf.form).toBeInstanceOf(HTMLFormElement)
		expect(sf.querySelector(':scope > form')).toBe(sf.form)
		expect(sf.form!.querySelector('schmancy-checkbox')).toBeTruthy()
	})

	it('emits submit with FormData on native submission', async () => {
		host.innerHTML = `
			<schmancy-form>
				<schmancy-checkbox name="agree"></schmancy-checkbox>
				<button id="go" type="submit">Go</button>
			</schmancy-form>
		`
		const sf = host.querySelector('schmancy-form') as HTMLElement
		const cb = host.querySelector('schmancy-checkbox') as HTMLElement & { value: boolean }
		cb.value = true
		await nextUpdate()
		await nextUpdate()

		const submits: FormData[] = []
		sf.addEventListener('submit', (e: Event) => {
			submits.push((e as CustomEvent).detail as FormData)
		})

		const btn = host.querySelector('#go') as HTMLButtonElement
		btn.click()

		expect(submits).toHaveLength(1)
		expect(submits[0].get('agree')).toBe('on')
	})

	it('blocks submit when a required field is empty', async () => {
		host.innerHTML = `
			<schmancy-form>
				<schmancy-checkbox name="agree" required></schmancy-checkbox>
				<button id="go" type="submit">Go</button>
			</schmancy-form>
		`
		const sf = host.querySelector('schmancy-form') as HTMLElement
		await nextUpdate()
		await nextUpdate()

		let submitCount = 0
		sf.addEventListener('submit', () => submitCount++)

		const btn = host.querySelector('#go') as HTMLButtonElement
		btn.click()

		expect(submitCount).toBe(0)
	})

	it('respects novalidate attribute', async () => {
		host.innerHTML = `
			<schmancy-form novalidate>
				<schmancy-checkbox name="agree" required></schmancy-checkbox>
				<button id="go" type="submit">Go</button>
			</schmancy-form>
		`
		const sf = host.querySelector('schmancy-form') as HTMLElement
		await nextUpdate()
		await nextUpdate()

		let submitCount = 0
		sf.addEventListener('submit', () => submitCount++)

		const btn = host.querySelector('#go') as HTMLButtonElement
		btn.click()

		expect(submitCount).toBe(1)
	})

	it('schmancy-button type=submit triggers form submission', async () => {
		host.innerHTML = `
			<schmancy-form>
				<schmancy-input name="email" value="x@y.z" required></schmancy-input>
				<schmancy-button id="sbtn" type="submit">Save</schmancy-button>
			</schmancy-form>
		`
		const sf = host.querySelector('schmancy-form') as HTMLElement
		const btn = host.querySelector('#sbtn') as HTMLElement
		await nextUpdate()
		await nextUpdate()

		let submitted = false
		sf.addEventListener('submit', () => (submitted = true))

		btn.click()
		await nextUpdate()

		expect(submitted).toBe(true)
	})

	it('dispatches a single submit event (no double-fire from native + custom)', async () => {
		host.innerHTML = `
			<schmancy-form>
				<button id="go" type="submit">Go</button>
			</schmancy-form>
		`
		const sf = host.querySelector('schmancy-form') as HTMLElement
		await nextUpdate()

		let count = 0
		sf.addEventListener('submit', () => count++)

		const btn = host.querySelector('#go') as HTMLButtonElement
		btn.click()

		expect(count).toBe(1)
	})
})
