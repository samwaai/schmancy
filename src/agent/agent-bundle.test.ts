import { describe, expect, it } from 'vitest'
import './agent-entry'

/**
 * Acceptance test per the Claude Design handover §4.4:
 *
 * > "CI check: load the bundle in a headless browser, assert
 * > `customElements.get('schmancy-button')` resolves, assert
 * > `window.schmancy.help()` returns non-empty."
 *
 * This test is the runtime smoke test. It imports the agent bundle entry
 * (which side-effect registers every <schmancy-*> tag plus <schmancy-skill>)
 * and then verifies the self-describing surface is installed.
 */
describe('agent bundle — handover §4.4 acceptance', () => {
	it('registers `schmancy-button` on import', () => {
		expect(customElements.get('schmancy-button')).toBeDefined()
	})

	it('registers `schmancy-skill` on import', () => {
		expect(customElements.get('schmancy-skill')).toBeDefined()
	})

	it('installs `window.schmancy` when a <schmancy-skill> connects', async () => {
		const host = document.createElement('div')
		const skill = document.createElement('schmancy-skill')
		host.appendChild(skill)
		document.body.appendChild(host)

		await customElements.whenDefined('schmancy-skill')
		// One microtask for connectedCallback to finish installing globals.
		await new Promise(requestAnimationFrame)

		expect(typeof window.schmancy).toBe('object')
		expect(typeof window.schmancy?.help).toBe('function')
		expect(typeof window.schmancy?.tokens).toBe('function')
		expect(typeof window.schmancy?.capabilities).toBe('function')

		host.remove()
	})

	it('`window.schmancy.help()` returns a non-empty manifest summary', async () => {
		const skill = document.createElement('schmancy-skill')
		document.body.appendChild(skill)
		await customElements.whenDefined('schmancy-skill')
		await new Promise(requestAnimationFrame)

		const help = window.schmancy!.help() as { elements: unknown[]; services: unknown[] }
		expect(Array.isArray(help.elements)).toBe(true)
		expect(help.elements.length).toBeGreaterThan(50)

		skill.remove()
	})

	it('`window.schmancy.help("schmancy-button")` returns attribute enum values', async () => {
		const skill = document.createElement('schmancy-skill')
		document.body.appendChild(skill)
		await customElements.whenDefined('schmancy-skill')
		await new Promise(requestAnimationFrame)

		const btn = window.schmancy!.help('schmancy-button') as {
			attributes?: Array<{ name: string; values?: string[] }>
		}
		expect(btn).toBeTruthy()
		expect(btn.attributes?.length ?? 0).toBeGreaterThan(0)
		const variant = btn.attributes?.find(a => a.name === 'variant')
		expect(variant?.values).toContain('filled')

		skill.remove()
	})

	it('`window.schmancy.capabilities()` reports every probed feature', async () => {
		const skill = document.createElement('schmancy-skill')
		document.body.appendChild(skill)
		await customElements.whenDefined('schmancy-skill')
		await new Promise(requestAnimationFrame)

		const caps = window.schmancy!.capabilities()
		expect(caps).toMatchObject({
			popover: expect.any(Boolean),
			declarativeShadowDom: expect.any(Boolean),
			scopedRegistries: expect.any(Boolean),
			trustedTypes: expect.any(Boolean),
			cssRegisteredProperties: expect.any(Boolean),
			elementInternalsAria: expect.any(Boolean),
			formAssociated: expect.any(Boolean),
			adoptedStyleSheets: expect.any(Boolean),
		})

		skill.remove()
	})
})
