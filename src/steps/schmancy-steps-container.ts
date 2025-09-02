import { provide } from '@lit/context'
import { $LitElement } from '@mixins/litElement.mixin'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { StepsController, stepsContext } from './steps.context'

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
		
		return html`
			<nav class="flex h-full w-full" aria-label="Progress">
				<ol class="flex flex-col flex-1 ${gapClass}" role="list">
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
}
