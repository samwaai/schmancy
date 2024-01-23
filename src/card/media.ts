import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

/**
 * @element schmancy-card-media
 * @slot headline
 * @slot subhead
 * @slot default - The content of the card
 */
@customElement('schmancy-card-media')
export default class SchmancyCardMedia extends TailwindElement(css`
	:host {
		display: block;
	}
`) {
	@property({ type: String, reflect: true })
	src: string = ''

	protected render(): unknown {
		const styles = {
			height: '200px',
		}
		return html`<schmancy-grid align="stretch" justify="stretch" gap="md">
			<img src="${this.src}" style=${this.styleMap(styles)} class="w-full object-cover object-center" />
		</schmancy-grid>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-card-media': SchmancyCardMedia
	}
}
