import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
// Import Leaflet
// import 'leaflet/dist/leaflet.css'
import { $LitElement } from '@mixins/index'

@customElement('warehouse-form')
export default class WarehouseForm extends $LitElement() {
	protected render(): unknown {
		const emojis = ['🏢', '🏭', '🏬', '🏪']
		return html`
			<schmancy-form
				class="mx-auto max-w-sm"
				@submit=${(e: Event) => {
					e.preventDefault()
				}}
			>
				<schmancy-grid class="min-h-[50vh] px-6 py-12" gap="md">
					<schmancy-grid cols="1fr 0.5fr" gap="md">
						<!-- Warehouse Name -->
						<schmancy-input
							label="Name"
							required
							type="text"
							placeholder="Warehouse Location"
						
						></schmancy-input>

						<!-- Emoji Select -->
						<schmancy-select label="Emoji">
                                
                    ${repeat(
											emojis,
											emoji => emoji,
											emoji => html`<schmancy-option .label=${emoji} .value=${emoji}>${emoji}</schmancy-option>`,
										)}
                            </schmancy-select>
                    </schmancy-select>
					</schmancy-grid>

					<!-- Delivery Address -->
					<schmancy-input label="Delivery Address" required type="text"></schmancy-input>

					<schmancy-autocomplete label="Manager" multi>
						${repeat(
							[
								{ id: '1', name: 'John Doe' },
								{
									id: '2',
									name: 'Mary Jane',
								},
								{
									id: '3',
									name: 'Hannah Montana',
								},
								{
									id: '4',
									name: 'Mona Lisa',
								},
							],

							user => user.id,
							user => html`<schmancy-option .label=${user.name} .value=${user.id}>${user.name}</schmancy-option>`,
						)}
					</schmancy-autocomplete>
					<!-- Map Container -->
					<!-- <div class="map-container h-[440px] min-w-[50vw] w-full"></div> -->

					<!-- Submit Button -->
					<schmancy-button variant="filled" type="submit"> Save Warehouse </schmancy-button>
				</schmancy-grid>
			</schmancy-form>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'warehouse-form': WarehouseForm
	}
}
