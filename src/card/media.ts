import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

/**
 * @element schmancy-card-media
 */
@customElement('schmancy-card-media')
export default class SchmancyCardMedia extends TailwindElement(css`
	:host {
		display: block;
	}
`) {
	@property({ type: String, reflect: true })
	src: string = ''

	@property({ type: String })
	fit: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down' = 'contain'

	protected render(): unknown {
		const styles = {
			height: '200px',
		}
		const classes = {
			'object-center': true,
			'object-contain': this.fit === 'contain',
			'object-cover w-full': this.fit === 'cover',
			'object-fill': this.fit === 'fill',
			'object-none': this.fit === 'none',
			'object-scale-down': this.fit === 'scale-down',
		}
		return html`<schmancy-grid align="stretch" justify="stretch" gap="md">
			<img src="${this.src}" style=${this.styleMap(styles)} class="${this.classMap(classes)}" />
		</schmancy-grid>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-card-media': SchmancyCardMedia
	}
}
