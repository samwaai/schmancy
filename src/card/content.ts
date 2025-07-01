import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

/**
 * @element schmancy-card-content
 * @slot headline - The headline text of the card
 * @slot subhead - The subhead text of the card
 * @slot default - The main content of the card
 */
@customElement('schmancy-card-content')
export default class SchmancyCardContent extends TailwindElement(css`
	:host {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 24px 16px;
		color: var(--schmancy-sys-color-surface-onVariant);
	}
	
	.header-container {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	
	::slotted([slot="headline"]) {
		color: var(--schmancy-sys-color-surface-on);
		font-size: 1.125rem;
		line-height: 1.75rem;
		font-weight: 400;
	}
	
	::slotted([slot="subhead"]) {
		color: var(--schmancy-sys-color-surface-onVariant);
		font-size: 0.875rem;
		line-height: 1.25rem;
	}
`) {
	protected render(): unknown {
		return html`
			<div class="header-container">
				<slot name="headline"></slot>
				<slot name="subhead"></slot>
			</div>
			<slot></slot>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-card-content': SchmancyCardContent
	}
}
