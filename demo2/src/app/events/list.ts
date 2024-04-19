import { $LitElement } from '@mhmo91/lit-mixins/src'
import { area } from '@schmancy/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { $stripe } from '../stripe'
import { $currentEvent } from './context'
import events from './events.data'

@customElement('funkhaus-events-list')
export default class EventsList extends $LitElement() {
	render() {
		return html`
			<schmancy-surface type="container">
				<schmancy-flex justify="center" align="center" gap="md">
					<funkhaus-logo width="32"></funkhaus-logo>
				</schmancy-flex>
			</schmancy-surface>
			<div class="my-[4rem]"></div>
			<schmancy-surface type="container" class="px-6 pb-24  xl:px-[12] max-w-screen-xl m-auto">
				<schmancy-grid
					gap="lg"
					.rcols=${{
						xs: '1fr',
						md: '1fr 1fr',
						lg: '1fr 1fr 1fr',
					}}
					rows="1fr"
					justify="center"
				>
					${repeat(
						events,
						event => event.name,
						event => html`
							<a
								class="cursor-pointer text-center max-w-[50vh] mx-auto"
								href="javascript:void(0)"
								@click=${() => {
									$stripe.next(event.ticketTypes[0].price)
									$currentEvent.next(event)
									area.push({
										area: 'main',
										component: 'funkhaus-event',
									})
								}}
							>
								<funkhaus-event-poster .eventInfo=${event}></funkhaus-event-poster>
							</a>
						`,
					)}
				</schmancy-grid>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'funkhaus-events-list': EventsList
	}
}
