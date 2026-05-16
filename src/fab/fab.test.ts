import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import './fab'
import '../icons/icon'
import { expectNoA11yViolations } from '../test-utils/a11y'
import type { SchmancyFab } from './fab'

const nextUpdate = () => new Promise(r => requestAnimationFrame(() => r(null)))

const base = (fab: SchmancyFab) =>
	fab.shadowRoot!.querySelector('[part="base"]') as HTMLButtonElement

describe('schmancy-fab — M3 contract', () => {
	let host: HTMLDivElement

	beforeEach(() => {
		host = document.createElement('div')
		document.body.appendChild(host)
	})

	afterEach(() => {
		host.remove()
	})

	it('renders a non-disablable native button (M3: a FAB is never disabled)', async () => {
		host.innerHTML = `<schmancy-fab aria-label="Compose"><schmancy-icon>edit</schmancy-icon></schmancy-fab>`
		const fab = host.querySelector('schmancy-fab') as SchmancyFab
		await nextUpdate()
		const btn = base(fab)
		expect(btn.tagName).toBe('BUTTON')
		expect(btn.getAttribute('type')).toBe('button')
		expect('disabled' in fab).toBe(false)
	})

	it('defaults to surface / medium: surface-containerHigh container, primary on-colour, 16dp shape', async () => {
		host.innerHTML = `<schmancy-fab aria-label="Compose"><schmancy-icon>edit</schmancy-icon></schmancy-fab>`
		const fab = host.querySelector('schmancy-fab') as SchmancyFab
		await nextUpdate()
		expect(fab.variant).toBe('surface')
		expect(fab.size).toBe('medium')
		expect(fab.extended).toBe(false)
		const cls = base(fab).classList
		expect(cls.contains('bg-surface-containerHigh')).toBe(true)
		expect(cls.contains('text-primary-default')).toBe(true)
		expect(cls.contains('size-14')).toBe(true)
		expect(getComputedStyle(fab).borderTopLeftRadius).toBe('16px')
	})

	it.each([
		['primary', 'bg-primary-container', 'text-primary-onContainer'],
		['secondary', 'bg-secondary-container', 'text-secondary-onContainer'],
		['tertiary', 'bg-tertiary-container', 'text-tertiary-onContainer'],
	] as const)('maps the %s variant to its M3 container + on-container colour pair', async (variant, bg, fg) => {
		host.innerHTML = `<schmancy-fab variant="${variant}" aria-label="x"><schmancy-icon>add</schmancy-icon></schmancy-fab>`
		const fab = host.querySelector('schmancy-fab') as SchmancyFab
		await nextUpdate()
		const cls = base(fab).classList
		expect(cls.contains(bg)).toBe(true)
		expect(cls.contains(fg)).toBe(true)
	})

	it('applies the M3 size geometry: small 12dp/40, large 28dp/36 icon', async () => {
		host.innerHTML = `<schmancy-fab size="small" aria-label="x"><schmancy-icon>add</schmancy-icon></schmancy-fab>`
		let fab = host.querySelector('schmancy-fab') as SchmancyFab
		await nextUpdate()
		expect(base(fab).classList.contains('size-10')).toBe(true)
		expect(getComputedStyle(fab).borderTopLeftRadius).toBe('12px')

		host.innerHTML = `<schmancy-fab size="large" aria-label="x"><schmancy-icon>add</schmancy-icon></schmancy-fab>`
		fab = host.querySelector('schmancy-fab') as SchmancyFab
		await nextUpdate()
		expect(base(fab).classList.contains('size-24')).toBe(true)
		expect(getComputedStyle(fab).borderTopLeftRadius).toBe('28px')
	})

	it('derives the extended form from a non-empty label and renders the label', async () => {
		host.innerHTML = `<schmancy-fab label="Compose" variant="primary"><schmancy-icon>edit</schmancy-icon></schmancy-fab>`
		const fab = host.querySelector('schmancy-fab') as SchmancyFab
		await nextUpdate()
		expect(fab.extended).toBe(true)
		expect(fab.hasAttribute('extended')).toBe(true)
		const btn = base(fab)
		expect(btn.classList.contains('size-14')).toBe(false)
		expect(btn.classList.contains('ps-4')).toBe(true)
		expect(btn.classList.contains('pe-5')).toBe(true)
		expect(btn.textContent).toContain('Compose')
	})

	it('reflects lowered and hides the icon slot from AT when a name is present', async () => {
		host.innerHTML = `<schmancy-fab lowered label="New"><schmancy-icon>edit</schmancy-icon></schmancy-fab>`
		const fab = host.querySelector('schmancy-fab') as SchmancyFab
		await nextUpdate()
		expect(fab.hasAttribute('lowered')).toBe(true)
		expect(fab.shadowRoot!.querySelector('slot')!.getAttribute('aria-hidden')).toBe('true')
	})

	it('has no a11y violations as an icon-only FAB with an accessible name', async () => {
		host.innerHTML = `<schmancy-fab aria-label="Compose message"><schmancy-icon>edit</schmancy-icon></schmancy-fab>`
		await nextUpdate()
		await expectNoA11yViolations(host)
	})
})
