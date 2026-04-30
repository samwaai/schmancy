import { provide } from '@lit/context'
import { SchmancyElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { distinctUntilChanged, takeUntil, tap } from 'rxjs/operators'
import { StepsController, stepsContext } from './steps.context'

/**
 * Custom event emitted when the current step changes.
 * The component stops propagation of bubbled 'change' events from child inputs
 * to prevent collision with the step change event.
 */
export type SchmancyStepsChangeEvent = CustomEvent<{ value: number }>

@customElement('schmancy-steps-container')
export class SchmancyStepsContainer extends SchmancyElement {
	static styles = [css`
	:host {
		display: block;
		overflow: auto;
	}
`]

	private controller = new StepsController()

	@provide({ context: stepsContext })
	stepsController = this.controller

	@property({ type: Number, reflect: true })
	set currentStep(value: number) {
		const oldValue = this.controller.currentStep
		if (oldValue !== value) {
			this.controller.setStep(value)
		}
	}

	get currentStep(): number {
		return this.controller.currentStep
	}

	/**
	 * Gap between steps. Maps to Tailwind gap classes.
	 * @default 4
	 */
	@property({ type: Number, reflect: true })
	gap: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 = 4

	connectedCallback() {
		super.connectedCallback()

		// React to controller changes (from property OR step clicks)
		this.controller.currentStep$
			.pipe(
				distinctUntilChanged(),
				tap(step => {
					this.requestUpdate()
					// Use dispatchScopedEvent with bubbles: false to prevent collision
					// with 'change' events bubbling up from inputs inside steps
					this.dispatchScopedEvent('change', { value: step }, { bubbles: false })
				}),
				takeUntil(this.disconnecting),
			)
			.subscribe()
	}

	/**
	 * Handle change events - stop propagation of bubbled events from children.
	 * This prevents form inputs inside steps from triggering the parent's @change handler.
	 */
	private handleChange = (e: Event) => {
		// Only stop propagation if the event is NOT from this component
		// (i.e., it's bubbling up from a child element like an input)
		if (e.target !== this) {
			e.stopPropagation()
		}
	}

	render() {
		const gapClass = `gap-${this.gap}`
		const gapRem =
			{
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
				24: '6rem',
			}[this.gap] || '1rem'

		return html`
			<nav class="flex h-full w-full" aria-label="Progress" @change=${this.handleChange}>
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
}
