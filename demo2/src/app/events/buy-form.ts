import { $LitElement } from '@mhmo91/lit-mixins/src'
import { StripeElements } from '@stripe/stripe-js'
import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { IFunkhausEvent } from 'src/types/events.types'
import stripe, { $stripe, $stripeElements } from '../stripe'
import placeholder from './placeholder'
@customElement('funkhaus-buy-form')
export default class FunkhausBuyForm extends $LitElement(css`
	/* Hide the up and down arrows for number inputs in webkit browsers like Chrome, Safari */
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Hide the up and down arrows for number inputs in Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
	}
`) {
	@property({ type: Object }) eventInfo!: IFunkhausEvent
	@property({ type: String }) clientSercet!: string
	@state() numOftickets: number = 1

	@state() loading: boolean = false
	@state() processing: boolean = false

	connectedCallback() {
		super.connectedCallback()
		this.checkStatus()
		$stripeElements.pipe().subscribe(() => {
			if ($stripeElements.value) {
				this.loading = false
			} else {
				this.loading = true
			}
		})
	}

	get total() {
		return this.eventInfo.ticketTypes[0]?.price * this.numOftickets
	}

	protected render(): unknown {
		return html`
			<schmancy-form>
				<schmancy-grid gap="lg">
					<schmancy-grid class="px-6 md:px-12" cols="auto 1fr auto" gap="sm" align="center">
						<schmancy-flex gap="sm" align="center">
							<schmancy-typography type="title" token="lg"> Total: </schmancy-typography>
							<schmancy-icon class="pb-1" size="28px">euro</schmancy-icon>
							<schmancy-typography type="headline">
								${this.eventInfo.ticketTypes[0]?.price * this.numOftickets}
							</schmancy-typography>
						</schmancy-flex>
						<span></span>
						<schmancy-flex align="center" gap="sm">
							<schmancy-icon-button
								.disabled=${this.numOftickets <= 1 || this.loading}
								@click=${() => {
									this.numOftickets--
									$stripe.next(this.total)
								}}
								variant="outlined"
							>
								remove
							</schmancy-icon-button>
							<!-- <schmancy-input
								align="center"
								type="number"
								class="w-10 text-center"
								.value=${this.numOftickets.toString()}
								@change=${(e: SchmancyInputChangeEvent) => {
								const value = e.detail.value
								this.numOftickets = parseInt(value)
								$stripe.next(this.total)
							}}
								token="lg"
							></schmancy-input> -->
							<schmancy-typography class="px-1" align="center" type="headline" token="lg"
								>${this.numOftickets}</schmancy-typography
							>
							<schmancy-icon-button
								.disabled=${this.loading}
								@click=${() => {
									this.numOftickets++
									$stripe.next(this.total)
								}}
								variant="filled"
							>
								add
							</schmancy-icon-button>
						</schmancy-flex>
					</schmancy-grid>
					<schmancy-input
						required
						type="email"
						pattern="[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$"
						class="mx-6 md:mx-12"
						placeholder="example@example.com"
						label="Email"
					></schmancy-input>
					<schmancy-grid class="px-6 md:px-12">
						<section class="relative  block">
							<div class="absolute inset-0 block">${when(this.loading, () => placeholder())}</div>
							<slot name="stripe-element"></slot>
						</section>
					</schmancy-grid>

					<schmancy-grid .hidden=${this.loading} class="pb-8  sticky bottom-0" align="center" justify="center">
						<schmancy-button @click=${this.next} class="h-[3rem]" type="submit" variant="filled">
							<schmancy-typography class="px-[2rem]" type="title" token="lg">
								${this.loading ? 'One moment...' : 'Pay'}
							</schmancy-typography>
						</schmancy-button>
					</schmancy-grid>
				</schmancy-grid>
				${when(
					this.processing,
					() =>
						html` <schmancy-busy class="z-50">
							<schmancy-spinner class="h-[24px] w-[24px]" size="24px"> One moment... </schmancy-spinner>
						</schmancy-busy>`,
				)}
			</schmancy-form>
		`
	}
	async next(e: Event) {
		e.preventDefault()
		const elements = $stripeElements.value as StripeElements
		// Confirm the payment that was created server-side
		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				// Make sure to change this to your payment completion page
				return_url: location.href,
			},
		})

		// This point will only be reached if there is an immediate error when
		// confirming the payment. Otherwise, your customer will be redirected to
		// your `return_url`. For some payment methods like iDEAL, your customer will
		// be redirected to an intermediate site first to authorize the payment, then
		// redirected to the `return_url`.
		if (error.type === 'card_error' || error.type === 'validation_error') {
		} else {
			alert('An unexpected error occurred.')
		}
		if (!error) {
			this.processing = true
		}
	}

	async checkStatus() {
		const clientSecret = new URLSearchParams(window.location.search).get('payment_intent_client_secret')

		if (!clientSecret) {
			return
		}
		if (!stripe) {
			return
		}
		this.processing = true

		const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret)
		switch (paymentIntent?.status) {
			case 'succeeded':
				area.push({
					component: 'funkhaus-order-success',
					area: 'main',
				})
				break
			case 'processing':
				alert('Your payment is processing.')
				break
			case 'requires_payment_method':
				alert('Your payment was not successful, please try again.')
				break
			default:
				alert('Something went wrong.')
				break
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'funkhaus-buy-form': FunkhausBuyForm
	}
}
