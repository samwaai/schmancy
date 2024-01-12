import { $LitElement } from '@mhmo91/lit-mixins/src'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

/**
 * @element schmancy-icon

 */
@customElement('schmancy-icon')
export default class SchmancyIcon extends $LitElement(css`
	.material-symbols-outlined {
		font-family: 'Material Symbols Outlined';
		font-weight: normal;
		font-style: normal;
		font-size: 24px;
		line-height: 1;
		letter-spacing: normal;
		text-transform: none;
		display: inline-block;
		white-space: nowrap;
		word-wrap: normal;
		direction: ltr;
		-webkit-font-smoothing: antialiased;
		font-variation-settings:
			'FILL' 0,
			'wght' 400,
			'GRAD' 0,
			'opsz' 24;
	}
	:host {
		display: flex;
	}
`) {
	connectedCallback(): void {
		super.connectedCallback()
		if (!document.head.querySelector('#material-icons')) {
			let link = document.createElement('link', {
				is: 'material-icons',
			})
			link.rel = 'stylesheet'
			link.href =
				'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200'
			document.querySelector('head')?.append(link)
		}
	}
	protected render(): unknown {
		return html` <span class="material-symbols-outlined"> <slot></slot> </span> `
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-icon': SchmancyIcon
	}
}
