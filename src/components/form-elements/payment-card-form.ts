import { $LitElement } from '@mhmo91/lit-mixins/src'
import SchmancyForm from '@schmancy/form/form'
import { SchmancyInputChangeEvent } from '@schmancy/input'
import SchmancyInput from '@schmancy/input/input'
import Cleave from 'cleave.js'
import { html } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'

@customElement('schmancy-payment-card-form')
export class SchmancyPaymentCardForm extends $LitElement() {
	@property({ type: Object }) public value: {
		cardName: string
		cardNumber: string
		expirationDate: string
		cvv: string
	} = {
		cardName: '',
		cardNumber: '',
		expirationDate: '',
		cvv: '',
	}
	@state() cardName: string | undefined
	@state() cardNumber: string | undefined
	@state() expirationDate: string | undefined
	@state() cvv: string | undefined

	@query('#cardNumber') cardNumberInput!: SchmancyInput
	@query('#expirationDate') expirationDateInput!: SchmancyInput
	@query('#cvv') cvvInput!: SchmancyInput
	@query('#cardName') cardNameInput!: SchmancyInput
	@query('schmancy-form') form!: SchmancyForm

	firstUpdated(): void {
		new Cleave(this.cardNumberInput, {
			creditCard: true,
			creditCardStrictMode: true,
			onCreditCardTypeChanged: type => {
				if (type === 'unknown') {
					this.cardNumberInput.setCustomValidity('Please enter a valid card number.')
				} else {
					this.cardNumberInput.setCustomValidity('')
				}
			},
		})
		new Cleave(this.expirationDateInput, {
			date: true,
			datePattern: ['m', 'y'],
			onValueChanged: e => {
				if (!e.target.value || e.target.value.length < 5) {
					this.expirationDateInput.setCustomValidity('Please enter a valid expiration date.')
				} else {
					this.expirationDateInput.setCustomValidity('')
				}
			},
		})
		new Cleave(this.cvvInput, {
			blocks: [4],
			numericOnly: true,
			onValueChanged: e => {
				if (e.target.value.length < 3) {
					this.cvvInput.setCustomValidity('Please enter a valid CVV.')
				} else {
					this.cvvInput.setCustomValidity('')
				}
			},
		})

		new Cleave(this.cardNameInput, {
			uppercase: true,
			delimiter: ' ',
		})
	}

	/** Checks for validity of the control and shows the browser message if it's invalid. */
	public reportValidity() {
		return this.form.reportValidity()
	}

	/** Checks for validity of the control and emits the invalid event if it invalid. */
	public checkValidity() {
		return !!this.form.reportValidity()
	}

	emitChange() {
		this.dispatchEvent(new CustomEvent('change', { detail: { ...this.value } }))
	}

	protected render(): unknown {
		return html` <schmancy-form>
			<schmancy-grid gap="sm">
				<schmancy-input
					id="cardName"
					.value=${this.cardName ?? ''}
					type="text"
					label="Name on card"
					required
					hint="Please enter a valid name."
					@change=${(e: SchmancyInputChangeEvent) => {
						this.cardName = e.detail.value
						this.value.cardName = e.detail.value
						this.emitChange()
					}}
				></schmancy-input>
				<schmancy-input
					id="cardNumber"
					type="text"
					label="Card number"
					required
					hint="Card number must be 16 digits."
					@change=${(e: SchmancyInputChangeEvent) => {
						this.cardNumber = e.detail.value
						this.value.cardNumber = e.detail.value
						this.emitChange()
					}}
				></schmancy-input>
				<schmancy-grid gap="sm" cols="1fr 1fr">
					<schmancy-input
						id="expirationDate"
						@change=${(e: SchmancyInputChangeEvent) => {
							this.expirationDate = e.detail.value
							this.value.expirationDate = e.detail.value
							this.emitChange()
						}}
						type="text"
						label="Expiration date"
						placeholder="MM/YY"
						required
					></schmancy-input>
					<schmancy-input
						id="cvv"
						@change=${(e: SchmancyInputChangeEvent) => {
							this.cvv = e.detail.value
							this.value.cvv = e.detail.value
							this.emitChange()
						}}
						label="CVV"
						required
						type="text"
						maxlength="4"
						minlength="3"
						hint="CVV must be 3 or 4 digits."
					></schmancy-input>
				</schmancy-grid>
			</schmancy-grid>
		</schmancy-form>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-payment-card-form': SchmancyPaymentCardForm
	}
}
