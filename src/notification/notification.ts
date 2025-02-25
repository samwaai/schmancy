import { TailwindElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

@customElement('schmancy-notification')
export class SchmancyNotification extends TailwindElement() {
	@property({ type: String })
	public type: NotificationType = 'success'

	render() {
		return html`
			<div
				class="pointer-events-auto w-full max-w-sm rounded-lg bg-surface-container shadow-lg ring-1 ring-outlineVariant ring-opacity-5 p-3"
			>
				<!-- Icon + Text + Close Button, etc. -->
				<div class="flex items-center">
					<!-- Icon -->
					<div class="shrink-0 mr-2">
						<!-- Show different icons depending on this.type -->
					</div>

					<!-- Text slot -->
					<div class="flex-1">
						<slot></slot>
					</div>

					<!-- Close -->
					<schmancy-icon-button @click=${this.handleClose} variant="outlined" class="ml-2 text-sm">
						Close
					</schmancy-icon-button>
				</div>
			</div>
		`
	}

	private handleClose(): void {
		this.dispatchEvent(
			new CustomEvent<void>('close', {
				bubbles: true,
				composed: true,
			}),
		)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-notification': SchmancyNotification
	}
}
