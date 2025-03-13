import { provide } from '@lit/context'
import { $LitElement } from '@mhmo91/schmancy/dist/mixins'
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

	connectedCallback() {
		super.connectedCallback()
		this.controller.setStep(this.currentStep)
	}

	render() {
		return html`
			<nav class="flex h-full w-full" aria-label="Progress">
				<ol class="flex flex-col flex-1" role="list">
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
