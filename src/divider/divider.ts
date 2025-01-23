// divider.ts
import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'

@customElement('schmancy-divider')
export default class SchmancyDivider extends $LitElement(css`
	:host {
		display: block;
		overflow: hidden; /* Ensure the animation is clipped */
	}
	.divider {
		/* Maintain existing border-based color logic */
		border-color: var(--divider-color, currentColor);
	}
	/* Horizontal Divider */
	.horizontal {
		width: 100%;
		height: 1px;
		border-top: 1px solid;
		transform: scaleX(0);
		transform-origin: var(--transform-origin, left);
		animation: drawHorizontal var(--animation-duration, 1s) forwards;
	}
	/* Vertical Divider */
	.vertical {
		width: 1px;
		height: 100%;
		border-left: 1px solid;
		transform: scaleY(0);
		transform-origin: var(--transform-origin, top);
		animation: drawVertical var(--animation-duration, 1s) forwards;
	}
	/* Outline Variants */
	.border-outlineVariant {
		/* Utilize existing outline variant styles */
		border-color: var(--schmancy-sys-color-outlineVariant, #555);
	}
	.border-outline {
		/* Utilize existing default outline styles */
		border-color: var(--schmancy-sys-color-outline, #000);
	}
	/* RTL Support for Horizontal Dividers */
	:host([dir='rtl']) .horizontal.grow-start {
		--transform-origin: right;
	}
	:host([dir='rtl']) .horizontal.grow-end {
		--transform-origin: left;
	}
	/* Center Growth for Horizontal and Vertical Dividers */
	.horizontal.grow-both {
		--transform-origin: center;
	}
	.vertical.grow-both {
		--transform-origin: center;
	}
	/* Define Keyframes */
	@keyframes drawHorizontal {
		to {
			transform: scaleX(1);
		}
	}
	@keyframes drawVertical {
		to {
			transform: scaleY(1);
		}
	}
	/* Assign Animations Based on Grow Direction */
	.horizontal.grow-start {
		animation: drawHorizontal var(--animation-duration, 1s) forwards;
	}
	.horizontal.grow-end {
		animation: drawHorizontal var(--animation-duration, 1s) forwards;
	}
	.horizontal.grow-both {
		animation: drawHorizontal var(--animation-duration, 1s) forwards;
	}

	.vertical.grow-start {
		animation: drawVertical var(--animation-duration, 1s) forwards;
	}
	.vertical.grow-end {
		animation: drawVertical var(--animation-duration, 1s) forwards;
	}
	.vertical.grow-both {
		animation: drawVertical var(--animation-duration, 1s) forwards;
	}
`) {
	@property({ type: String }) outline: 'default' | 'variant' = 'variant'
	@property({ reflect: true, type: String }) orientation: 'horizontal' | 'vertical' = 'horizontal'
	@property({ type: String }) grow: 'start' | 'end' | 'both' = 'start'

	protected render() {
		const classes = {
			divider: true,
			horizontal: this.orientation === 'horizontal',
			vertical: this.orientation === 'vertical',
			'border-outlineVariant': this.outline === 'variant',
			'border-outline': this.outline === 'default',
			[`grow-${this.grow}`]: true, // e.g., grow-start, grow-end, grow-both
		}
		return html`<div class="${classMap(classes)}"></div>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-divider': SchmancyDivider
	}
}
