// divider.ts
import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

/**
 * Thin horizontal (or vertical) separator rule between sections of content.
 *
 * @element schmancy-divider
 * @summary Semantic separator between groups — list items, menu sections, content blocks. Uses outline theme token.
 * @example
 * <schmancy-list-item>First</schmancy-list-item>
 * <schmancy-divider></schmancy-divider>
 * <schmancy-list-item>Second</schmancy-list-item>
 * @platform hr - Styled horizontal rule. Degrades to a native `<hr>` if the tag never registers.
 */
@customElement('schmancy-divider')
export default class SchmancyDivider extends $LitElement(css`
	:host {
		display: block;
	}

	@keyframes grow-horizontal {
		from {
			transform: scaleX(0);
		}
		to {
			transform: scaleX(1);
		}
	}

	@keyframes grow-vertical {
		from {
			transform: scaleY(0);
		}
		to {
			transform: scaleY(1);
		}
	}

	/* Horizontal divider grow animations */
	.grow-start:not(.h-full) {
		animation: grow-horizontal 400ms ease-out;
		transform-origin: left;
	}

	.grow-end:not(.h-full) {
		animation: grow-horizontal 400ms ease-out;
		transform-origin: right;
	}

	.grow-both:not(.h-full) {
		animation: grow-horizontal 400ms ease-out;
		transform-origin: center;
	}

	/* Vertical divider grow animations */
	.grow-start.h-full {
		animation: grow-vertical 400ms ease-out;
		transform-origin: top;
	}

	.grow-end.h-full {
		animation: grow-vertical 400ms ease-out;
		transform-origin: bottom;
	}

	.grow-both.h-full {
		animation: grow-vertical 400ms ease-out;
		transform-origin: center;
	}
`) {
	@property({ type: String }) outline: 'default' | 'variant' = 'variant'
	@property({ type: Boolean }) vertical = false
	@property({ type: String }) grow: 'start' | 'end' | 'both' = 'start'

	/**
	 * @deprecated Use `vertical` property instead. Will be removed in next major version.
	 */
	@property({ reflect: true, type: String })
	set orientation(value: 'horizontal' | 'vertical') {
		this.vertical = value === 'vertical'
	}
	get orientation(): 'horizontal' | 'vertical' {
		return this.vertical ? 'vertical' : 'horizontal'
	}

	protected render() {
		return html`<div
			class=${this.classMap({
				// Dimensions
				'w-full h-px': !this.vertical,
				'h-full w-px': this.vertical,
				// Border color
				'border-outlineVariant': this.outline === 'variant',
				'border-outline': this.outline === 'default',
				// Border style
				'border-t': !this.vertical,
				'border-l': this.vertical,
				// Grow behavior
				[`grow-${this.grow}`]: true,
			})}
		></div>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-divider': SchmancyDivider
	}
}
