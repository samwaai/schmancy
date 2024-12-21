// divider.ts
import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('schmancy-divider')
export default class SchmancyDivider extends $LitElement(css`
	:host {
		display: block;
	}
	:host([orientation='horizontal']) {
		width: 100%;
		height: 1px;
	}
	:host([orientation='vertical']) {
		height: 100%;
		width: 1px;
	}
`) {
	@property() outline: 'default' | 'variant' = 'variant'
	@property({ reflect: true }) orientation: 'horizontal' | 'vertical' = 'horizontal'
	protected render(): unknown {
		const classes = {
			'border-t': this.orientation === 'horizontal',
			'border-l h-full': this.orientation === 'vertical',
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
