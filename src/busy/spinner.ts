import { TailwindElement } from '@mixins/index'
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
		const style = {
			fontSize: this.size,
			maxWidth: this.size,
			overflow: 'hidden',
		}
		return html`
			<div class="spinner" style=${this.styleMap(style)}>
				<svg fill="none" viewBox="0 0 16 16" class="anim-rotate" aria-hidden="true" role="img">
					<path
						opacity=".5"
						d="M8 15A7 7 0 108 1a7 7 0 000 14v0z"
						stroke="var(--schmancy-sys-color-secondary-default)"
						stroke-width="2"
					></path>
					<path d="M15 8a7 7 0 01-7 7" stroke="var(--schmancy-sys-color-secondary-default)" stroke-width="2"></path>
					<path d="M8 12a4 4 0 100-8 4 4 0 000 8z" fill="var(--schmancy-sys-color-secondary-default)"></path>
				</svg>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-spinner': SchmnacySpinner
	}
}
