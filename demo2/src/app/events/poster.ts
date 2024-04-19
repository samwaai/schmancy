import { $LitElement } from '@mhmo91/lit-mixins/src'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { IFunkhausEvent } from 'src/types/events.types'

@customElement('funkhaus-event-poster')
export default class FunkhausTicketEvent extends $LitElement(css`
	:host {
		display: block;
		position: relative;
		inset: 0;
		width: 100%;
		aspect-ratio: 16/10;
	}
	/* .event-background {
		background-image: url('logo.png');
		background-repeat: no-repeat;
		background-position: center;
		background-size: contain;
		aspect-ratio: 16/10;
		background-color: red;
	} */
`) {
	@property({ type: Object }) eventInfo: IFunkhausEvent | undefined

	protected render() {
		return html`
			<!-- <section class="py-6 px-4  h-fit w-[100%] rounded-lg shadow-lg  event-background">
				<section class=" flex items-center justify-center  relative inset-0">
					<div class=" p-8  text-center z-10">
						<h1 class="text-6xl  mb-4">Giegling</h1>
						<h2 class="text-4xl font-light mb-8">live im Funkhaus</h2>
						<div class="text-2xl mb-6">29 Mar 2024</div>
						<div class="border-t border-white pt-6">
							<p class="text-lg">Funkhaus Berlin</p>
							<p class="text-lg">Saal 1</p>
							<p class="text-lg">Nalepastrasse 18</p>
							<p class="text-lg">12459 Berlin</p>
						</div>
					</div>
				</section>
			</section> -->
			<schmancy-teleport id=${ifDefined(this.eventInfo?.id)}>
				<img
					class="transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg round mx-auto rounded-md"
					.src=${this.eventInfo?.image_url ?? ''}
					.alt=${this.eventInfo?.name ?? ''}
				/>
			</schmancy-teleport>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'funkhaus-event-poster': FunkhausTicketEvent
	}
}
