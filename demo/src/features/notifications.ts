import { $LitElement } from '@mixins/index'
import { $notify } from '@schmancy/notification'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('demo-notifications')
export class DemoNotifications extends $LitElement() {
	render() {
		return html`
			<schmancy-grid gap="md">
				<schmancy-button
					@click=${() => {
						$notify.success('Operation completed successfully.')
					}}
					variant="filled"
					width="full"
				>
					Success Notification
				</schmancy-button>

				<schmancy-button
					@click=${() => {
						$notify.error('Operation failed.')
					}}
					variant="filled"
					width="full"
				>
					Error Notification
				</schmancy-button>

				<schmancy-button
					@click=${() => {
						$notify.warning('Operation may fail.')
					}}
					variant="filled"
					width="full"
				>
					Warning Notification
				</schmancy-button>

				<schmancy-button
					@click=${() => {
						$notify.info('Operation may fail.')
					}}
					variant="filled"
					width="full"
				>
					Info Notification
				</schmancy-button>
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-notifications': DemoNotifications
	}
}
