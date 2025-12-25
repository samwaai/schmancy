import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('schmancy-spinner')
export default class SchmnacySpinner extends TailwindElement(css`
	:host {
		display: inline-block;
		color: inherit; /* Inherit from parent by default */
	}

	/* Explicit color options when needed */
	:host([color="primary"]) {
		color: var(--schmancy-sys-color-primary-default);
	}

	:host([color="on-primary"]) {
		color: var(--schmancy-sys-color-primary-on);
	}

	:host([color="secondary"]) {
		color: var(--schmancy-sys-color-secondary-default);
	}

	:host([color="on-secondary"]) {
		color: var(--schmancy-sys-color-secondary-on);
	}

	:host([color="tertiary"]) {
		color: var(--schmancy-sys-color-tertiary-default);
	}

	:host([color="on-tertiary"]) {
		color: var(--schmancy-sys-color-tertiary-on);
	}

	:host([color="error"]) {
		color: var(--schmancy-sys-color-error-default);
	}

	:host([color="on-error"]) {
		color: var(--schmancy-sys-color-error-on);
	}

	:host([color="success"]) {
		color: var(--schmancy-sys-color-success-default);
	}

	:host([color="on-success"]) {
		color: var(--schmancy-sys-color-success-on);
	}

	:host([color="surface"]) {
		color: var(--schmancy-sys-color-surface-default);
	}

	:host([color="on-surface"]) {
		color: var(--schmancy-sys-color-surface-on);
	}

	:host([color="surface-variant"]) {
		color: var(--schmancy-sys-color-surface-variant-default);
	}

	:host([color="on-surface-variant"]) {
		color: var(--schmancy-sys-color-surface-onVariant);
	}

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
	@property({ type: String, reflect: true })
	color?: 'primary' | 'on-primary' | 'secondary' | 'on-secondary' |
	        'tertiary' | 'on-tertiary' | 'error' | 'on-error' |
	        'success' | 'on-success' | 'surface' | 'on-surface' |
	        'surface-variant' | 'on-surface-variant'

	/**
	 * Size of the spinner - M3 aligned tokens or numeric Tailwind units
	 * Tokens: 'xxs' (12px), 'xs' (16px), 'sm' (20px), 'md' (24px), 'lg' (32px)
	 * Numeric: Tailwind units where each unit = 4px (e.g., 6 = 24px)
	 */
	@property() size: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | number = 'md'
	@property({ type: Boolean }) glass: boolean = false

	protected render(): unknown {
		// M3 aligned token sizes (fit inside buttons of same token)
		const tokenSizes: Record<string, number> = {
			xxs: 12, // fits in 24px button (ultra-compact)
			xs: 16,  // fits in 32px button
			sm: 20,  // fits in 40px button
			md: 24,  // fits in 48px button (default)
			lg: 32,  // fits in 56px button
		}

		// Support both token and numeric sizes for backward compatibility
		let sizeInPx: number
		if (typeof this.size === 'string' && this.size in tokenSizes) {
			sizeInPx = tokenSizes[this.size]
		} else if (typeof this.size === 'number' && !isNaN(this.size)) {
			// Legacy numeric: Tailwind units (each unit = 4px)
			sizeInPx = this.size * 4
		} else {
			sizeInPx = 24 // fallback to md
		}

		const style = {
			width: `${sizeInPx}px`,
			height: `${sizeInPx}px`,
		}
		
		return this.glass ? html`
			<div class="spinner relative" style=${this.styleMap(style)}>
				<!-- Glass container with Apple-style effect -->
				<div class="absolute inset-0 rounded-full backdrop-blur-xl backdrop-saturate-150
							bg-surface-container/20
							shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.2)]
							border border-outline-variant/30"></div>
				
				<!-- Spinner SVG -->
				<svg fill="none" viewBox="0 0 16 16" aria-hidden="true" role="img" 
					 style="width: 100%; height: 100%;" class="relative z-10">
					<path
						opacity=".7"
						d="M8 15A7 7 0 108 1a7 7 0 000 14v0z"
						stroke="currentColor"
						stroke-width="2"
					></path>
					<path d="M15 8a7 7 0 01-7 7" stroke="currentColor" stroke-width="2"></path>
					<path d="M8 12a4 4 0 100-8 4 4 0 000 8z" fill="currentColor" opacity="0.8"></path>
				</svg>
			</div>
		` : html`
			<div class="spinner" style=${this.styleMap(style)}>
				<svg fill="none" viewBox="0 0 16 16" aria-hidden="true" role="img" style="width: 100%; height: 100%;">
					<path
						opacity=".5"
						d="M8 15A7 7 0 108 1a7 7 0 000 14v0z"
						stroke="currentColor"
						stroke-width="2"
					></path>
					<path d="M15 8a7 7 0 01-7 7" stroke="currentColor" stroke-width="2"></path>
					<path d="M8 12a4 4 0 100-8 4 4 0 000 8z" fill="currentColor"></path>
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
