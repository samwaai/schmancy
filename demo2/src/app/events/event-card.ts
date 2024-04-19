import { $LitElement } from '@mhmo91/lit-mixins/src'
import { color } from '@mhmo91/schmancy'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('funkhaus-event-card')
export default class FunkhausEventCard extends $LitElement() {
	protected render(): unknown {
		return html`
			<schmancy-surface
				${color({
					bgColor: 'bg-primary',
				})}
			>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'funkhaus-event-card': FunkhausEventCard
	}
}
