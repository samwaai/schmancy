import { provide } from '@lit/context'
import { $LitElement } from '@mixins/litElement.mixin'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { StepsController, stepsContext } from './steps.context'

/**
 * Custom event emitted when the current step changes
 */
export type SchmancyStepsChangeEvent = CustomEvent<{ value: number }>

@customElement('schmancy-steps-container')
export class SchmancyStepsContainer extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	private controller = new StepsController()

	@provide({ context: stepsContext })
	stepsController = this.controller

	@property({ type: Number, reflect: true })
	set currentStep(value: number) {
		const oldValue = this._currentStep
		this._currentStep = value
		this.controller.setStep(value)
		this.requestUpdate('currentStep', oldValue)
		
		// Dispatch change event when step changes
		if (oldValue !== value) {
			this.dispatchEvent(new CustomEvent('change', {
				detail: { value },
				bubbles: true,
				composed: true
			}))
		}
	}

	get currentStep(): number {
		return this._currentStep
	}

	private _currentStep = 1

	/**
	 * Gap between steps. Maps to Tailwind gap classes.
	 * Options: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24
	 * @default 4
	 */
	@property({ type: Number, reflect: true })
	gap: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 = 4

	connectedCallback() {
		super.connectedCallback()
		this.controller.setStep(this.currentStep)
	}

	render() {
		// Map gap value to Tailwind gap class
		const gapClass = `gap-${this.gap}`
		
		// Map gap value to actual rem value for CSS custom property
		// Tailwind gap scale: 1 = 0.25rem, 2 = 0.5rem, etc.
		const gapRem = {
			0: '0',
			1: '0.25rem',
			2: '0.5rem',
			3: '0.75rem',
			4: '1rem',
			5: '1.25rem',
			6: '1.5rem',
			8: '2rem',
			10: '2.5rem',
			12: '3rem',
			16: '4rem',
			20: '5rem',
			24: '6rem'
		}[this.gap] || '1rem'
		
		return html`
			<nav class="flex h-full w-full" aria-label="Progress">
				<ol class="flex flex-col flex-1 ${gapClass}" role="list" style="--steps-gap: ${gapRem}">
					<slot></slot>
				</ol>
			</nav>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-steps-container': SchmancyStepsContainer
	}
	
	interface HTMLElementEventMap {
		'schmancy-steps:change': SchmancyStepsChangeEvent
	}
}
