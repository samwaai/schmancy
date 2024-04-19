import { $LitElement } from '@mhmo91/lit-mixins/src'
import { $newSchmancyTheme, fullHeight } from '@schmancy/index'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import moment from 'moment'
import { takeUntil, tap } from 'rxjs'
import { IFunkhausEvent } from 'src/types/events.types'
import { $stripe, $stripeElements, appearance } from '../stripe'
import { $currentEvent } from './context'

@customElement('funkhaus-event')
export default class FunkhausEvent extends $LitElement() {
	@property({ type: Object }) eventInfo!: IFunkhausEvent

	connectedCallback(): void {
		super.connectedCallback()
		$currentEvent
			.pipe(
				takeUntil(this.disconnecting),
				tap({
					next: event => {
						$stripe.next(event.ticketTypes[0].price)
					},
				}),
			)
			.subscribe({
				next: event => {
					this.eventInfo = event
					$newSchmancyTheme.next(this.eventInfo.theme)
					$stripeElements.value?.update({
						appearance: appearance(),
					})
					this.requestUpdate()
				},
			})

		const slot = document.createElement('slot')
		slot.name = 'stripe-element'
		slot.slot = 'stripe-element'
		this.append(slot)
	}

	protected render(): unknown {
		return html`
			<section class="max-w-6xl m-auto pt-6 md:pt-12">
				<schmancy-grid
					${fullHeight()}
					.rcols=${{
						xs: '1fr',
						md: '1fr 1fr',
					}}
					rows="1fr"
					gap="lg"
					justify="center"
					class="overflow-x-hidden pt-6"
				>
					<schmancy-surface type="container" rounded="all" elevation="0">
						<schmancy-grid gap="lg">
							<schmancy-grid class="block md:hidden px-6 md:px-12" gap="lg">
								<schmancy-typography class="" type="display" token="sm"> ${this.eventInfo.name} </schmancy-typography>
								<schmancy-flex gap="md" align="center">
									<schmancy-icon class="pb-1" size="28px">event</schmancy-icon>
									<schmancy-typography type="headline">
										${moment(this.eventInfo.startDate).format('DD MMMM HH:mm')} -
										${moment(this.eventInfo.endDate).format('HH:mm')}
									</schmancy-typography>
								</schmancy-flex>
								<schmancy-grid cols="auto 1fr" gap="md" align="center">
									<schmancy-icon class="pb-1" size="28px">pin_drope</schmancy-icon>
									<schmancy-typography align="left" maxLines="1" type="headline">
										${this.eventInfo.location}
									</schmancy-typography>
								</schmancy-grid>
							</schmancy-grid>
							<schmancy-divider class="block md:hidden"></schmancy-divider>

							<funkhaus-buy-form .eventInfo=${this.eventInfo}>
								<slot slot="stripe-element" name="stripe-element"></slot>
							</funkhaus-buy-form>
						</schmancy-grid>
					</schmancy-surface>
					<funkhaus-event-poster class="md:block px-6 md:px-12" .eventInfo=${this.eventInfo}></funkhaus-event-poster>
				</schmancy-grid>
			</section>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'funkhaus-event': FunkhausEvent
	}
}
