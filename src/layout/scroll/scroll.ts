import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('schmancy-scroll')
export class SchmancyScroll extends TailwindElement(css`
	:host {
		display: block;
		position: relative; /* Ensures absolute children are relative to host */
		width: 100%;
		height: 100%; /* Still recommend parent sets height */
	}
	.scrollbar-hide {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
	.scrollbar-hide::-webkit-scrollbar {
		display: none; /* Chrome, Safari, and Opera */
	}
`) {
	/**
	 * Determines whether the scrollbar is hidden.
	 *
	 * When `hide` is true, the inner scrollable div receives the `scrollbar-hide` class,
	 * which hides scrollbars in supported browsers.
	 *
	 * @attr hide
	 * @example <schmancy-scroll hide></schmancy-scroll>
	 */
	@property({ type: Boolean, reflect: true })
	public hide = false

	render() {
		const classes = {
			// Add absolute positioning to fill host
			'absolute inset-0 overflow-x-scroll overflow-y-scroll scroll-smooth overscroll-contain': true,
			'scrollbar-hide': this.hide,
		}

		return html`
			<div class=${this.classMap(classes)}>
				<slot></slot>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-scroll': SchmancyScroll
	}
}
