import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('schmancy-scroll')
export class SchmancyScroll extends TailwindElement(css`
	:host {
		height: 100%;
		width: 100%;
		overflow: hidden;
		box-sizing: border-box; /* Ensures proper sizing */
		display: block;
		position: relative;
		inset: 0px;
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
		// The classes are dynamically assigned based on the `hide` property.
		const classes = {
			'h-full w-full inset-0 overflow-x-auto overflow-y-auto scroll-smooth overscroll-contain': true,
			'scrollbar-hide': this.hide,
		}

		return html`
			<div class="relative inset-0 h-full w-full overscroll-none">
				<div class=${this.classMap(classes)}>
					<slot></slot>
				</div>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-scroll': SchmancyScroll
	}
}
