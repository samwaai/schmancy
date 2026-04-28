import { describe, expect, it } from 'vitest'
import './agent-entry'

/**
 * Agent bundle = distribution test suite.
 *
 * The bundle exists so consumers can drop a single `<script type="module">`
 * tag and get every `<schmancy-*>` element registered. These tests verify
 * that contract, no more.
 *
 * Earlier versions of this suite tested a `window.schmancy.help()` /
 * `tokens()` / `findFor()` runtime introspection surface that targeted a
 * hypothetical live-in-browser agent — a consumer that never materialised
 * in any shipping product. That surface was removed; AI consumers read the
 * static manifest at `dist/agent/schmancy.manifest.json` instead, which is
 * the real integration point.
 */
describe('agent bundle — distribution', () => {
	it('registers `schmancy-button` on import', () => {
		expect(customElements.get('schmancy-button')).toBeDefined()
	})

	it('registers `schmancy-theme` on import', () => {
		expect(customElements.get('schmancy-theme')).toBeDefined()
	})

	it('registers `schmancy-surface` on import', () => {
		expect(customElements.get('schmancy-surface')).toBeDefined()
	})

	it('registers a substantive set of components on import', () => {
		// Spot-check 20 commonly-used tags. If anything below this threshold
		// regresses, the side-effect registration chain is broken.
		const sampleTags = [
			'schmancy-button',
			'schmancy-input',
			'schmancy-card',
			'schmancy-dialog',
			'schmancy-sheet',
			'schmancy-list',
			'schmancy-list-item',
			'schmancy-typography',
			'schmancy-icon',
			'schmancy-icon-button',
			'schmancy-form',
			'schmancy-checkbox',
			'schmancy-select',
			'schmancy-autocomplete',
			'schmancy-radio-group',
			'schmancy-textarea',
			'schmancy-switch',
			'schmancy-divider',
			'schmancy-details',
			'schmancy-card-content',
		]
		const registered = sampleTags.filter(tag => customElements.get(tag) !== undefined)
		expect(registered).toEqual(sampleTags)
	})

	it('exports the imperative service surface', async () => {
		const mod = await import('./agent-entry')
		expect(typeof mod.$dialog).toBe('object')
		expect(typeof mod.$notify).toBe('object')
		expect(typeof mod.sheet).toBe('object')
		expect(typeof mod.theme).toBe('object')
		expect(typeof mod.area).toBe('object')
	})

	it('does not install the legacy `window.schmancy` runtime surface', () => {
		// Negative test — the runtime introspection layer was removed
		// because no shipping consumer used it. If it comes back unintentionally,
		// flag it here so the regression is visible.
		expect((window as { schmancy?: unknown }).schmancy).toBeUndefined()
	})
})
