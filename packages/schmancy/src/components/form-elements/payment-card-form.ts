import { $LitElement } from '@mixins/index'
import SchmancyForm from '@schmancy/form/form'
import { SchmancyInputChangeEvent } from '@schmancy/input'
import SchmancyInput from '@schmancy/input/input'
import Cleave from 'cleave.js'
import { html } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'

/**
 * @element schmancy-payment-card-form
 * A mobile-friendly payment card form component that provides real-time validation
 * and formatting for credit card information.
 *
 * @fires change - Fires when any field in the form changes
 * @slot - Default slot for any additional content
 */
@customElement('schmancy-payment-card-form')
export class SchmancyPaymentCardForm extends $LitElement() {
	/**
	 * The form data containing all payment card information
	 */
	@property({ type: Object, reflect: true })
	public value: {
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

	/**
	 * The detected card type (visa, mastercard, amex, etc.)
	 * This is determined automatically by the Cleave.js library
	 */
	@state() cardType: string = ''

	/**
	 * Individual field values tracked with state properties for reactivity
	 */
	@state() cardName: string | undefined
	@state() cardNumber: string | undefined
	@state() expirationDate: string | undefined
	@state() cvv: string | undefined

	/**
	 * Field validity states for enhanced validation feedback
	 */
	@state() isCardNameValid: boolean = true
	@state() isCardNumberValid: boolean = true
	@state() isExpirationDateValid: boolean = true
	@state() isCvvValid: boolean = true

	/**
	 * Query selectors for the form elements
	 */
	@query('#cardNumber') cardNumberInput!: SchmancyInput
	@query('#expirationDate') expirationDateInput!: SchmancyInput
	@query('#cvv') cvvInput!: SchmancyInput
	@query('#cardName') cardNameInput!: SchmancyInput
	@query('schmancy-form') form!: SchmancyForm

	/**
	 * When the component is first updated, initialize the Cleave.js formatters
	 * for the credit card fields with appropriate validations
	 */
	firstUpdated(): void {
		// Credit card number formatter with type detection
		new Cleave(this.cardNumberInput, {
			creditCard: true,
			creditCardStrictMode: true,
			onCreditCardTypeChanged: type => {
				this.cardType = type

				if (type === 'unknown') {
					this.isCardNumberValid = false
					this.cardNumberInput.setCustomValidity('Please enter a valid card number.')
					this.cardNumberInput.error = true
				} else {
					this.isCardNumberValid = true
					this.cardNumberInput.setCustomValidity('')
					this.cardNumberInput.error = false

					// Adjust CVV length based on card type
					if (type === 'amex') {
						this.cvvInput.maxlength = 4
					} else {
						this.cvvInput.maxlength = 3
					}
				}
			},
		})

		// Expiration date formatter (MM/YY)
		new Cleave(this.expirationDateInput, {
			date: true,
			datePattern: ['m', 'y'],
			onValueChanged: e => {
				const value = e.target.value

				if (!value || value.length < 5) {
					this.isExpirationDateValid = false
					this.expirationDateInput.setCustomValidity('Please enter a valid expiration date (MM/YY).')
					this.expirationDateInput.error = true
				} else {
					// Validate expiration date is in the future
					const [month, year] = value.split('/')
					const now = new Date()
					const currentYear = now.getFullYear() % 100 // Get last two digits of year
					const currentMonth = now.getMonth() + 1 // JS months are 0-indexed

					const monthNum = parseInt(month, 10)
					const yearNum = parseInt(year, 10)

					// Check if the card is expired
					if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
						this.isExpirationDateValid = false
						this.expirationDateInput.setCustomValidity('Card has expired.')
						this.expirationDateInput.error = true
					} else {
						this.isExpirationDateValid = true
						this.expirationDateInput.setCustomValidity('')
						this.expirationDateInput.error = false
					}
				}
			},
		})

		// CVV formatter (numeric only)
		new Cleave(this.cvvInput, {
			blocks: [4], // Maximum size for AMEX
			numericOnly: true,
			onValueChanged: e => {
				const minLength = this.cardType === 'amex' ? 4 : 3

				if (e.target.value.length < minLength) {
					this.isCvvValid = false
					this.cvvInput.setCustomValidity(`Please enter a valid ${minLength}-digit CVV.`)
					this.cvvInput.error = true
				} else {
					this.isCvvValid = true
					this.cvvInput.setCustomValidity('')
					this.cvvInput.error = false
				}
			},
		})

		// Card name formatter (uppercase)
		new Cleave(this.cardNameInput, {
			uppercase: true,
			delimiter: ' ',
			onValueChanged: e => {
				// Basic name validation
				if (!e.target.value || e.target.value.length < 3) {
					this.isCardNameValid = false
					this.cardNameInput.setCustomValidity('Please enter the name as it appears on the card.')
					this.cardNameInput.error = true
				} else {
					this.isCardNameValid = true
					this.cardNameInput.setCustomValidity('')
					this.cardNameInput.error = false
				}
			},
		})
	}

	/**
	 * Checks for validity of the entire form
	 * @returns {boolean} True if the form is valid
	 */
	public reportValidity() {
		return this.form.reportValidity()
	}

	/**
	 * Checks for validity of the form
	 * @returns {boolean} True if the form is valid
	 */
	public checkValidity() {
		return !!this.form.reportValidity()
	}

	/**
	 * Emit change event when any input value changes
	 */
	private emitChange() {
		this.dispatchEvent(
			new CustomEvent('change', {
				detail: { ...this.value },
				bubbles: true,
			}),
		)
	}

	/**
	 * Render the payment card form with a responsive grid layout
	 */
	protected render() {
		// Determine icon based on card type
		const cardIcon = this.getCardIcon()

		return html`
			<schmancy-form
				@change=${e => {
					e.stopPropagation()
					e.preventDefault()
				}}
			>
				<schmancy-grid gap="md" class="w-full">
					<!-- Card Name Field -->
					<schmancy-input
						autocomplete="cc-name"
						id="cardName"
						.value=${this.cardName ?? ''}
						.error=${!this.isCardNameValid}
						type="text"
						label="Name on card"
						required
						hint="${!this.isCardNameValid
							? 'Please enter the name as it appears on the card'
							: 'Enter the name exactly as it appears on your card'}"
						@change=${(e: SchmancyInputChangeEvent) => {
							this.cardName = e.detail.value
							this.value.cardName = e.detail.value
							this.emitChange()
						}}
					></schmancy-input>

					<!-- Card Number Field with Card Type Indicator -->
					<div class="relative w-full">
						<schmancy-input
							autocomplete="cc-number"
							id="cardNumber"
							type="text"
							label="Card number"
							.error=${!this.isCardNumberValid}
							required
							hint="${!this.isCardNumberValid ? 'Please enter a valid card number' : 'Your 16-digit card number'}"
							@change=${(e: SchmancyInputChangeEvent) => {
								this.cardNumber = e.detail.value
								this.value.cardNumber = e.detail.value
								this.emitChange()
							}}
						></schmancy-input>
						${cardIcon ? html`<div class="absolute right-3 top-1/2 transform -translate-y-1/4">${cardIcon}</div>` : ''}
					</div>

					<!-- Responsive grid for expiration date and CVV -->
					<schmancy-grid gap="md" cols="1fr 1fr" class="w-full">
						<schmancy-input
							autocomplete="cc-exp"
							id="expirationDate"
							@change=${(e: SchmancyInputChangeEvent) => {
								this.expirationDate = e.detail.value
								this.value.expirationDate = e.detail.value
								this.emitChange()
							}}
							type="text"
							.error=${!this.isExpirationDateValid}
							label="Expiration date"
							placeholder="MM/YY"
							required
							hint="${!this.isExpirationDateValid ? 'Invalid expiration date' : 'MM/YY format'}"
						></schmancy-input>

						<schmancy-input
							id="cvv"
							autocomplete="cc-csc"
							@change=${(e: SchmancyInputChangeEvent) => {
								this.cvv = e.detail.value
								this.value.cvv = e.detail.value
								this.emitChange()
							}}
							label="CVV"
							.error=${!this.isCvvValid}
							required
							type="text"
							maxlength="${this.cardType === 'amex' ? '4' : '3'}"
							minlength="${this.cardType === 'amex' ? '4' : '3'}"
							hint="${!this.isCvvValid ? 'Invalid security code' : 'Security code on back of card'}"
						></schmancy-input>
					</schmancy-grid>

					<!-- Show card acceptability notice -->
					<div class="text-sm text-secondary-onContainer mt-2">${this.renderSecurityNotice()}</div>

					<slot></slot>
				</schmancy-grid>
			</schmancy-form>
		`
	}

	/**
	 * Helper method to render card type icon based on detected card type
	 */
	private getCardIcon() {
		switch (this.cardType) {
			case 'visa':
				return html`<schmancy-icon>credit_card</schmancy-icon>`
			case 'mastercard':
				return html`<schmancy-icon>credit_card</schmancy-icon>`
			case 'amex':
				return html`<schmancy-icon>credit_card</schmancy-icon>`
			case 'discover':
				return html`<schmancy-icon>credit_card</schmancy-icon>`
			default:
				return this.cardNumber ? html`<schmancy-icon>credit_card</schmancy-icon>` : null
		}
	}

	/**
	 * Helper method to render a security and acceptance notice
	 */
	private renderSecurityNotice() {
		return html`
			<div class="flex items-center gap-2">
				<schmancy-icon size="18px">lock</schmancy-icon>
				<span>Your payment information is secure and encrypted</span>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-payment-card-form': SchmancyPaymentCardForm
	}
}
