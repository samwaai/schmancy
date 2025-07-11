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
	@property({ type: Boolean }) glass: boolean = false

	protected render(): unknown {
		const style = {
			width: this.size,
			height: this.size,
		}
		
		return this.glass ? html`
			<div class="spinner relative" style=${this.styleMap(style)}>
				<!-- Glass container with Apple-style effect -->
				<div class="absolute inset-0 rounded-full backdrop-blur-xl backdrop-saturate-150 
							bg-white/20 dark:bg-black/20 
							shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.2)]
							border border-white/30 dark:border-white/20"></div>
				
				<!-- Spinner SVG -->
				<svg fill="none" viewBox="0 0 16 16" aria-hidden="true" role="img" 
					 style="width: 100%; height: 100%;" class="relative z-10">
					<path
						opacity=".7"
						d="M8 15A7 7 0 108 1a7 7 0 000 14v0z"
						stroke="var(--schmancy-sys-color-secondary-default)"
						stroke-width="2"
					></path>
					<path d="M15 8a7 7 0 01-7 7" stroke="var(--schmancy-sys-color-secondary-default)" stroke-width="2"></path>
					<path d="M8 12a4 4 0 100-8 4 4 0 000 8z" fill="var(--schmancy-sys-color-secondary-default)" opacity="0.8"></path>
				</svg>
			</div>
		` : html`
			<div class="spinner" style=${this.styleMap(style)}>
				<svg fill="none" viewBox="0 0 16 16" aria-hidden="true" role="img" style="width: 100%; height: 100%;">
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
