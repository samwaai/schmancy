import { $LitElement } from '../../mixins/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import {
	a11yAudit,
	capabilities,
	findFor,
	help,
	manifest,
	manifestUrl,
	platformPrimitive,
	registeredTags,
	tokens,
} from './helpers'

declare global {
	interface Window {
		schmancy?: {
			manifest: typeof manifest
			manifestUrl: string
			help: typeof help
			tokens: typeof tokens
			platformPrimitive: typeof platformPrimitive
			registeredTags: typeof registeredTags
			a11yAudit: typeof a11yAudit
			capabilities: typeof capabilities
			findFor: typeof findFor
		}
	}
}

let installedUrl: string | null = null

function install() {
	if (typeof window === 'undefined') return
	if (installedUrl) return
	installedUrl = manifestUrl()
	window.schmancy = {
		manifest,
		manifestUrl: installedUrl,
		help,
		tokens,
		platformPrimitive,
		registeredTags,
		a11yAudit,
		capabilities,
		findFor,
	}
}

/**
 * Self-describing runtime helper. Drop `<schmancy-skill></schmancy-skill>`
 * once on a page and `window.schmancy.help('schmancy-button')` returns the
 * machine-readable entry for any tag. Renders nothing.
 *
 * @element schmancy-skill
 */
@customElement('schmancy-skill')
export class SchmancySkill extends $LitElement() {
	connectedCallback() {
		super.connectedCallback()
		install()
	}

	render() {
		return html``
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-skill': SchmancySkill
	}
}
