import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

/**
 * Content container for the schmancy-dropdown component.
 *
 * @element schmancy-dropdown-content
 * @slot - Default slot for dropdown content
 */
@customElement('schmancy-dropdown-content')
export class SchmancyDropdownContent extends TailwindElement(css`
	:host {
		display: block;
		position: absolute;
		z-index: 1000;
		min-width: 10rem;
		margin: 0;
		text-align: left;
		list-style: none;
		background-color: var(--schmancy-sys-color-surface-container);
		background-clip: padding-box;
		border-radius: 0.375rem;
		box-shadow: var(--schmancy-sys-elevation-3);
		will-change: transform;
		transform-origin: top left;
		animation: dropdownAnimation 0.1s ease-out forwards;
	}

	:host([hidden]) {
		display: none;
	}

	@keyframes dropdownAnimation {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	/* Apply styles to content both in the component and when teleported to the portal */
	.schmancy-dropdown-content {
		background-color: var(--schmancy-sys-color-surface-container);
		border-radius: 0.375rem;
		box-shadow: var(--schmancy-sys-elevation-3);
		will-change: transform;
		transform-origin: top left;
		animation: dropdownAnimation 0.1s ease-out forwards;
	}
`) {
	/**
	 * Width of the dropdown content
	 */
	@property({ type: String })
	width: string = 'auto'

	/**
	 * Maximum height of the dropdown content
	 */
	@property({ type: String })
	maxHeight: string = '80vh'

	/**
	 * Whether to render with a shadow
	 */
	@property({ type: Boolean })
	shadow: boolean = true

	/**
	 * Border radius style
	 */
	@property({ type: String })
	radius: 'none' | 'sm' | 'md' | 'lg' | 'full' = 'md'

	render() {
		const classes = {
			'schmancy-dropdown-content': true,
			'overflow-auto': true,
			'shadow-none': !this.shadow,
			'rounded-none': this.radius === 'none',
			'rounded-sm': this.radius === 'sm',
			'rounded-md': this.radius === 'md',
			'rounded-lg': this.radius === 'lg',
			'rounded-full': this.radius === 'full',
		}

		const styles = {
			width: this.width,
			maxHeight: this.maxHeight,
		}

		return html`
			<div class=${this.classMap(classes)} style=${this.styleMap(styles)} part="content">
				<slot></slot>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-dropdown-content': SchmancyDropdownContent
	}
}
