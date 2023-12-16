import { $LitElement } from '@mhmo91/lit-mixins/src'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('schmancy-divider')
export default class SchmancyDivider extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	@property() outline: 'default' | 'variant' = 'variant'
	protected render(): unknown {
		const classes = {
			'border-t': true,
			'border-outlineVariant': this.outline === 'variant',
			'border-outline': this.outline === 'default',
		}
		return html`<div class="${this.classMap(classes)}"></div>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-divider': SchmancyDivider
	}
}
