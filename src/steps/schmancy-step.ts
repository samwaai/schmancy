import { consume } from '@lit/context'
import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { Subscription } from 'rxjs'
import { stepsContext, StepsController } from './steps.context'
import { $LitElement } from '@mixins/litElement.mixin'

@customElement('schmancy-step')
export class SchmancyStep extends $LitElement(css`
	:host {
		display: grid;
		/* Base display is just grid, flex properties will be applied dynamically */
	}
`) {
	/**
	 * The step's position (1-based). This is used to compare against
	 * the container's current step to decide if it's "complete",
	 * "current", or "upcoming".
	 */
	@property({ type: Number }) position = 1

	@property({ type: String }) title = ''
	@property({ type: String }) description = ''

	// NEW: Allow a step to be explicitly marked as complete.
	@property({ type: Boolean, reflect: true }) completed = false

	/**
	 * NEW: Lock API to disable users from going back.
	 * When set to true, clicking on a previous (completed) step is ignored.
	 */
	@property({ type: Boolean }) lockBack = false

	/**
	 * Consume the shared StepsController from context.
	 */
	@consume({ context: stepsContext })
	private steps!: StepsController

	/**
	 * Local reactive copy of the container's current step number.
	 */
	@state()
	private currentStep = 1

	/**
	 * Keep a reference to our subscription so we can unsubscribe cleanly.
	 */
	private subscription?: Subscription

	connectedCallback() {
		super.connectedCallback()
		// Subscribe to updates from the container's StepsController.
		this.subscription = this.steps.currentStep$.subscribe(step => {
			this.currentStep = step
			// When the current step changes, update the flex properties
			this.updateFlexProperties()
		})
		// Initial update of flex properties
		this.updateFlexProperties()
	}

	disconnectedCallback(): void {
		this.subscription?.unsubscribe()
		super.disconnectedCallback()
	}

	/**
	 * Update the host element's flex properties based on active state
	 */
	private updateFlexProperties() {
		const isActive = this.position === this.currentStep

		if (isActive) {
			// Apply flex-grow when active
			this.style.flex = '1 1 auto'
		} else {
			// Make it shrink when not active
			this.style.flex = '0 0 auto'
		}
	}

	/**
	 * Compute visual status for styling purposes. Note that if a step is explicitly
	 * marked as completed, it always appears as complete even if it's active.
	 */
	get status(): 'complete' | 'current' | 'upcoming' {
		if (this.completed || this.position < this.steps.currentStep) return 'complete'
		if (this.position === this.steps.currentStep) return 'current'
		return 'upcoming'
	}

	/**
	 * Click handler to allow navigation between completed (or active) steps.
	 * With lockBack enabled, clicking on a previous step is ignored.
	 */
	private _onStepClick(_e: Event) {
		// If lockBack is enabled and the user attempts to go back, do nothing.
		if (this.lockBack && this.position < this.steps.currentStep) {
			return
		}
		if (this.status !== 'upcoming') {
			this.steps.setStep(this.position)
		}
	}

	render() {
		// Determine if the step is currently active.
		const isActive = this.position === this.currentStep

		// Use computed status for visual styling.
		const isComplete = this.status === 'complete'
		const isUpcoming = this.status === 'upcoming'

		// Tailwind (or similar) classes for styling.
		const connectorClasses = {
			'bg-tertiary-default': isComplete,
			'bg-gray-300': !isComplete,
		}

		const iconContainerClasses = {
			'relative border-solid z-10 flex size-5 items-center justify-center rounded-full': true,
			'bg-tertiary-default group-hover:bg-tertiary-onContainer': isComplete,
			'border-2 border-tertiary-default bg-white': !isComplete && isActive,
			'border-2 border-gray-300 bg-white group-hover:border-gray-400': isUpcoming,
		}

		const textClasses = {
			'text-tertiary-default': isActive,
			'text-gray-500': !isActive,
		}

		// If the step is clickable (active or complete), add a pointer cursor.
		const clickableClass = isActive || isComplete ? 'cursor-pointer' : ''

		return html`
			<li class="relative">
				<!-- Connector line -->
				<div
					class="absolute top-6 left-2.5 mt-0.5 -ml-px h-full w-0.5 ${this.classMap(connectorClasses)}"
					aria-hidden="true"
				></div>

				<!-- Step Button/Label -->
				<button type="button" @click=${this._onStepClick} class="relative flex items-center group ${clickableClass}">
					<span class="flex items-center h-10">
						<span class=${this.classMap(iconContainerClasses)}>
							${isComplete
								? html`
										<svg class="text-white size-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
											<path
												fill-rule="evenodd"
												d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
												clip-rule="evenodd"
											/>
										</svg>
									`
								: html`
										<span
											class="size-2.5 rounded-full ${isActive
												? 'bg-tertiary-default'
												: 'bg-transparent group-hover:bg-gray-300'}"
										></span>
									`}
						</span>
					</span>

					<span class="flex flex-col items-start min-w-0 ml-4">
						<schmancy-typography type="title">
							<span class=${this.classMap(textClasses)}>${this.title}</span>
						</schmancy-typography>
						${when(
							this.description,
							() => html`
								<schmancy-typography type="label">
									<span class="text-gray-500">${this.description}</span>
								</schmancy-typography>
							`,
						)}
					</span>
				</button>

				<!-- Render step content if the step is active, regardless of completion -->
				${when(
					isActive,
					() => html`
						<div class="pl-2 ml-2 block h-full pb-12">
							<slot></slot>
						</div>
					`,
				)}
			</li>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-step': SchmancyStep
	}
}
