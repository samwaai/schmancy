import { $LitElement } from '@mhmo91/lit-mixins/src'
import { SchmancyTheme, color, fullHeight } from '@schmancy/index'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { takeUntil } from 'rxjs'
import { IFunkhausEvent } from 'src/types/events.types'
import { $currentEvent } from './context'

@customElement('funkhaus-order-success')
export default class FunkhausOrderSuccess extends $LitElement() {
	@property({ type: Object }) eventInfo!: IFunkhausEvent

	connectedCallback(): void {
		super.connectedCallback()
		$currentEvent.pipe(takeUntil(this.disconnecting)).subscribe({
			next: event => {
				this.eventInfo = event
				this.requestUpdate()
			},
		})
	}
	render() {
		return html`
			<section class="max-w-6xl m-auto pt-6 md:pt-12">
				<schmancy-grid
					class="px-6 md:px-12"
					${fullHeight()}
					.rcols=${{
						xs: '1fr',
						md: '1fr 1fr',
					}}
					rows="auto 1fr"
					gap="lg"
					justify="center"
					class="overflow-x-hidden"
				>
					<schmancy-surface class="h-full flex flex-1" rounded="all" type="containerLow">
						<schmancy-grid rows="1fr" gap="lg" class="py-12 px-6" justify="center">
							<schmancy-icon
								size="64px"
								${color({
									color: SchmancyTheme.sys.color.primary.default,
								})}
							>
								done
							</schmancy-icon>
							<schmancy-typography align="center" type="headline" token="lg">
								Thank you for your purchase.
							</schmancy-typography>

							<schmancy-typography type="body" token="lg">
								We sent an email confirmation with your ticket.
							</schmancy-typography>

							<!-- download your ticket from here -->
							<schmancy-button variant="filled">Download your ticket</schmancy-button>
						</schmancy-grid>
					</schmancy-surface>
					<funkhaus-event-poster class="hidden md:block" .eventInfo=${this.eventInfo}></funkhaus-event-poster>
				</schmancy-grid>
			</section>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'funkhaus-order-success': FunkhausOrderSuccess
	}
}
