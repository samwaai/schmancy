import { $LitElement } from '@mhmo91/lit-mixins/src'
import { $newSchmancyTheme } from '@schmancy/index'
import { StripeElements, StripePaymentElement } from '@stripe/stripe-js'
import { css, html } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { distinctUntilChanged, switchMap, takeUntil, tap } from 'rxjs'
import './events'
import stripe, { $stripe, $stripeElements, appearance, stripeIntent } from './stripe'

@customElement('funkhaus-app')
export default class App extends $LitElement(css`
	:host {
		display: block;
		position: relative;
		inset: 0;
	}
`) {
	@query('#color') color!: HTMLElement
	@state() busy = false
	@state() activeTab: string = 'door'

	@state() tabs: {
		label: string
		value: string
		active?: boolean
	}[] = []
	@state() clientSecret: string | undefined
	elements: StripeElements | undefined
	paymentElement: StripePaymentElement | undefined
	async connectedCallback() {
		super.connectedCallback()
		$newSchmancyTheme.next({
			color: '#005CDD',
			scheme: 'auto',
		})

		const slot = document.createElement('slot')
		slot.name = 'stripe-element'
		slot.slot = 'stripe-element'
		this.append(slot)
		$stripe
			.pipe(
				distinctUntilChanged(),
				tap(() => {
					this.paymentElement?.unmount()
					$stripeElements.next(undefined)
				}),
				switchMap(total => stripeIntent(total)),
				takeUntil(this.disconnecting),
			)
			.subscribe(body => {
				this.clientSecret = body.clientSecret
				this.elements = stripe?.elements({
					appearance: appearance(),
					clientSecret: this.clientSecret,
				})

				const paymentElementOptions = {
					layout: 'tabs',
				}
				// @ts-ignore
				this.paymentElement = this.elements?.create('payment', paymentElementOptions) as StripePaymentElement
				this.paymentElement.mount('#stripe-element')
				this.paymentElement.on('ready', () => {
					$stripeElements.next(this.elements)
				})
			})
	}

	protected render(): unknown {
		return html`
			${when(this.busy, () => html`<schmancy-busy></schmancy-busy>`)}
			<schmancy-area name="main" .default=${'funkhaus-events-list'}>
				<slot slot="stripe-element" name="stripe-element"></slot>
			</schmancy-area>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'funkhaus-app': App
	}
}
