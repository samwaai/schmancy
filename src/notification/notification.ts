import { TailwindElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('schmancy-notification')
export class SchmancyNotification extends TailwindElement() {
	@property({ type: String })
	type: 'success' | 'error' | 'warning' | 'info' = 'success'

	render() {
		return html`
			<div
				class="pointer-events-auto w-full max-w-sm
               rounded-lg bg-surface-container shadow-lg
               ring-1 ring-outlineVariant ring-opacity-5 p-3"
			>
				<!-- Icon + Text + Close Button, etc. -->
				<div class="flex items-center">
					<!-- Icon -->
					<div class="shrink-0 mr-2">
						<!-- Show different icons depending on this.type -->
						<!-- e.g., success, error, etc. -->
					</div>

					<!-- Text slot -->
					<div class="flex-1">
						<slot></slot>
					</div>

					<!-- Close -->
					<schmancy-icon-button
						@click=${() => this.dispatchEvent(new CustomEvent('close'))}
						variant="outlined"
						class="ml-2 text-sm"
						>Close</schmancy-icon-button
					>
				</div>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-notification': SchmancyNotification
	}
}
