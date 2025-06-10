import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

/**
 * @element schmancy-icon
 * Material Symbols icon component with configurable size
 */
@customElement('schmancy-icon')
export default class SchmancyIcon extends TailwindElement(css`
	.material-symbols-outlined {
		font-family: 'Material Symbols Outlined';
		font-weight: normal;
		font-style: normal;
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
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
`) {
	/**
	 * Icon size - can be specified in any CSS unit (px, rem, em, etc.)
	 * Default is 24px
	 */
	@property({ type: String, reflect: true })
	size: string = '24px'

	@state() busy = false

	connectedCallback(): void {
		super.connectedCallback()
		if (!document.head.querySelector('#material-icons')) {
			let link = document.createElement('link', {
				is: 'material-icons',
			})
			link.rel = 'stylesheet'
			link.id = 'material-icons'
			link.href =
				'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200'
			document.querySelector('head')?.append(link)
			this.busy = false
		}
	}

	protected render(): unknown {
		// Ensure size is respected and properly applied
		const style = {
			fontSize: this.size,
			width: this.size,
			height: this.size,
			lineHeight: '1',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		}

		return html`
			<span class="material-symbols-outlined w-fit" style=${this.styleMap(style)}>
				<slot .hidden=${this.busy}></slot>
			</span>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-icon': SchmancyIcon
	}
}