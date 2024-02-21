import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('schmancy-spinner')
export default class SchmnacySpinner extends TailwindElement(css`
	.spinner {
		animation: spin 1s linear infinite;
		font-size: 48px; /* Adjust the size as needed */
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

	protected render(): unknown {
		return html` <schmancy-icon class="spinner" size="48px">sync</schmancy-icon> `
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-spinner': SchmnacySpinner
	}
}
