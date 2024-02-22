import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('schmancy-spinner')
export default class SchmnacySpinner extends TailwindElement(css`
	.spinner {
		animation: spin 1s linear infinite;
		animation-direction: reverse;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
`) {
	@property({ type: String }) color: string = 'gray'
	@property({ type: String }) size: string = '24px'

	protected render(): unknown {
		return html` <schmancy-icon class="spinner" size=${this.size}>sync</schmancy-icon> `
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-spinner': SchmnacySpinner
	}
}
