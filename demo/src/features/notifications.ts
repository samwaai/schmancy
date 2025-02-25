import { $LitElement } from '@mixins/index'
import { $notify } from '@schmancy/notification'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'

@customElement('demo-notifications')
export class DemoNotifications extends $LitElement() {
	private successBtnRef = createRef<HTMLButtonElement>()

	render() {
		return html`
			<schmancy-grid gap="md">
				<schmancy-button
					${ref(this.successBtnRef)}
					@click=${() => {
						if (this.successBtnRef.value) {
							$notify.success('Operation successful!', {
								referenceElement: this.successBtnRef.value,
								duration: 5000, // e.g. 5s
							})
						} else {
							// fallback without reference
							$notify.success('Operation successful!')
						}
					}}
					variant="filled"
					width="full"
				>
					Success
				</schmancy-button>
				<!-- Other buttons as needed -->
			</schmancy-grid>
		`
	}
}
