import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import './date-range'
import { expectNoA11yViolations } from '../../../test-utils/a11y'

const nextUpdate = () => new Promise(r => requestAnimationFrame(() => r(null)))

describe('schmancy-date-range', () => {
	let host: HTMLDivElement

	beforeEach(() => {
		host = document.createElement('div')
		document.body.appendChild(host)
	})

	afterEach(() => {
		host.remove()
	})

	it('contributes flat-suffix dateFrom/dateTo entries to FormData', async () => {
		host.innerHTML = `
			<form>
				<schmancy-date-range name="window"></schmancy-date-range>
			</form>
		`
		const form = host.querySelector('form') as HTMLFormElement
		const dr = host.querySelector('schmancy-date-range') as HTMLElement & {
			dateFrom: { label: string; value: string }
			dateTo: { label: string; value: string }
		}
		await nextUpdate()
		await nextUpdate()
		dr.dateFrom = { label: 'From', value: '2026-01-01' }
		dr.dateTo = { label: 'To', value: '2026-01-31' }
		await nextUpdate()
		await nextUpdate()
		const fd = new FormData(form)
		expect(fd.get('windowFrom')).toBe('2026-01-01')
		expect(fd.get('windowTo')).toBe('2026-01-31')
	})

	it('omits from FormData when name is not set', async () => {
		host.innerHTML = `<form><schmancy-date-range></schmancy-date-range></form>`
		const form = host.querySelector('form') as HTMLFormElement
		await nextUpdate()
		expect([...new FormData(form).keys()]).toEqual([])
	})

	it('reports invalid when required and both dates empty', async () => {
		host.innerHTML = `<form><schmancy-date-range name="w" required></schmancy-date-range></form>`
		const form = host.querySelector('form') as HTMLFormElement
		const dr = host.querySelector('schmancy-date-range') as HTMLElement & {
			dateFrom: { label: string; value: string }
			dateTo: { label: string; value: string }
			checkValidity(): boolean
		}
		await nextUpdate()
		await nextUpdate()
		dr.dateFrom = { label: 'From', value: '' }
		dr.dateTo = { label: 'To', value: '' }
		await nextUpdate()
		expect(dr.checkValidity()).toBe(false)
		expect(form.checkValidity()).toBe(false)
		dr.dateFrom = { label: 'From', value: '2026-01-01' }
		dr.dateTo = { label: 'To', value: '2026-01-02' }
		await nextUpdate()
		await nextUpdate()
		expect(dr.checkValidity()).toBe(true)
		expect(form.checkValidity()).toBe(true)
	})

	it('has no axe-core a11y violations', async () => {
		host.innerHTML = `<schmancy-date-range name="window"></schmancy-date-range>`
		await nextUpdate()
		await nextUpdate()
		// Trigger button-group rendering with values populated.
		const dr = host.querySelector('schmancy-date-range') as HTMLElement & {
			dateFrom: { label: string; value: string }
			dateTo: { label: string; value: string }
		}
		dr.dateFrom = { label: 'From', value: '2026-01-01' }
		dr.dateTo = { label: 'To', value: '2026-01-31' }
		await nextUpdate()
		await nextUpdate()
		await expectNoA11yViolations(host)
	})

	it('omits empty dates from FormData', async () => {
		host.innerHTML = `<form><schmancy-date-range name="w"></schmancy-date-range></form>`
		const form = host.querySelector('form') as HTMLFormElement
		const dr = host.querySelector('schmancy-date-range') as HTMLElement & {
			dateFrom: { label: string; value: string }
			dateTo: { label: string; value: string }
		}
		await nextUpdate()
		dr.dateFrom = { label: 'From', value: '' }
		dr.dateTo = { label: 'To', value: '' }
		await nextUpdate()
		const fd = new FormData(form)
		expect(fd.get('wFrom')).toBeNull()
		expect(fd.get('wTo')).toBeNull()
	})
})
