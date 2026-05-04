import { describe, expect, it } from 'vitest'
import './agent-entry'

// Minimal smoke gate for the publish workflow. Loads the agent bundle entry
// in a real browser and asserts that the side-effect tag registration the
// esm.sh script-tag use case relies on actually fires. If the entry throws
// at import time or fails to register a representative tag, the publish step
// fails before the package goes out.
describe('agent bundle', () => {
	it('registers core schmancy-* tags on import', () => {
		expect(customElements.get('schmancy-button')).toBeDefined()
		expect(customElements.get('schmancy-theme')).toBeDefined()
		expect(customElements.get('schmancy-surface')).toBeDefined()
	})
})
