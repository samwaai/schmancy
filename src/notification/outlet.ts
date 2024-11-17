import { TailwindElement } from '@mhmo91/lit-mixins/src'

import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('schmancy-notification-outlet')
export class SchmancyNotificationOutlet extends TailwindElement() {
	render() {
		return html` <slot></slot> `
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-notification-outlet': SchmancyNotificationOutlet
	}
}
