import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import './range'

const nextUpdate = () => new Promise(r => requestAnimationFrame(() => r(null)))

describe('schmancy-range', () => {
	let host: HTMLDivElement

	beforeEach(() => {
		host = document.createElement('div')
		document.body.appendChild(host)
	})

	afterEach(() => {
		host.remove()
	})

	it('is form-associated and contributes its value to FormData', async () => {
		host.innerHTML = `
			<form>
				<schmancy-range name="volume" min="0" max="100" value="42"></schmancy-range>
			</form>
		`
		const form = host.querySelector('form') as HTMLFormElement
		await nextUpdate()
		await nextUpdate()
		expect(new FormData(form).get('volume')).toBe('42')
	})

	it('reports value as number on the property', async () => {
		host.innerHTML = `<schmancy-range value="0.5" min="0" max="1" step="0.01"></schmancy-range>`
		const r = host.querySelector('schmancy-range') as HTMLElement & { value: number }
		await nextUpdate()
		expect(r.value).toBe(0.5)
		expect(typeof r.value).toBe('number')
	})

	it('fires change with numeric detail on input', async () => {
		host.innerHTML = `<schmancy-range min="0" max="10" step="1" value="3"></schmancy-range>`
		const r = host.querySelector('schmancy-range') as HTMLElement & {
			updateComplete: Promise<boolean>
		}
		await r.updateComplete
		let detail: { value: number } | undefined
		r.addEventListener('change', (e: Event) => {
			detail = (e as CustomEvent).detail
		})
		const input = r.shadowRoot!.querySelector('input[type=range]') as HTMLInputElement
		input.value = '7'
		input.dispatchEvent(new Event('input', { bubbles: true }))
		await nextUpdate()
		expect(detail).toEqual({ value: 7 })
	})

	it('respects disabled attribute on inner input', async () => {
		host.innerHTML = `<schmancy-range disabled value="5"></schmancy-range>`
		const r = host.querySelector('schmancy-range') as HTMLElement & {
			updateComplete: Promise<boolean>
		}
		await r.updateComplete
		const input = r.shadowRoot!.querySelector('input[type=range]') as HTMLInputElement
		expect(input.disabled).toBe(true)
	})

	it('resets to default value on form reset', async () => {
		host.innerHTML = `
			<form>
				<schmancy-range name="x" value="5" min="0" max="10"></schmancy-range>
			</form>
		`
		const form = host.querySelector('form') as HTMLFormElement
		const r = host.querySelector('schmancy-range') as HTMLElement & { value: number }
		await nextUpdate()
		await nextUpdate()
		r.value = 8
		await nextUpdate()
		form.reset()
		await nextUpdate()
		await nextUpdate()
		expect(r.value).toBe(5)
	})
})
