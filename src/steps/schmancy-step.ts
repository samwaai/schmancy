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
		transition: all 0.2s ease-in-out;
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
	}

	firstUpdated() {
		// Subscribe to updates from the container's StepsController.
		// Context is guaranteed to be available after first render
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
		if (this.completed || this.position < this.currentStep) return 'complete'
		if (this.position === this.currentStep) return 'current'
		return 'upcoming'
	}

	/**
	 * Click handler to allow navigation between completed (or active) steps.
	 * With lockBack enabled, clicking on a previous step is ignored.
	 */
	private _onStepClick(_e: Event) {
		// If lockBack is enabled and the user attempts to go back, do nothing.
		if (this.lockBack && this.position < this.currentStep) {
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

		// Enhanced styling classes with better visual hierarchy
		const connectorClasses = {
			'bg-tertiary-default': isComplete,
			'bg-outlineVariant': !isComplete,
		}

		const iconContainerClasses = {
			'relative border-solid z-10 flex size-8 items-center justify-center rounded-full transition-all duration-200': true,
			'bg-tertiary-default text-tertiary-on shadow-md group-hover:shadow-lg': isComplete,
			'border-2 border-primary-default bg-primary-container text-primary-onContainer shadow-sm': !isComplete && isActive,
			'border-2 border-outline bg-surface-default text-surface-onVariant group-hover:border-primary-default group-hover:bg-primary-container': isUpcoming,
		}

		const textClasses = {
			'text-primary-default font-medium': isActive,
			'text-tertiary-default': isComplete,
			'text-surface-onVariant': isUpcoming,
		}

		// If the step is clickable (active or complete), add a pointer cursor.
		const clickableClass = isActive || isComplete ? 'cursor-pointer' : ''

		return html`
			<li class="relative">
				<!-- Connector line - responsive positioning -->
				<div
					class="absolute top-8 left-3 sm:left-4 -ml-px w-0.5 transition-colors duration-200 ${this.classMap(connectorClasses)}"
					style="height: calc(100% + var(--steps-gap, 0px))"
					aria-hidden="true"
				></div>

				<!-- Step Button/Label - adjusted padding for mobile -->
				<button
					type="button"
					@click=${this._onStepClick}
					class="relative flex items-center group transition-all duration-200 hover:scale-[1.02] ${clickableClass} ${isActive ? 'bg-primary-container/20 -mx-1 sm:-mx-2 px-1 sm:px-2 py-2 sm:py-3 rounded-lg' : 'py-1 sm:py-2'}"
				>
					<span class="flex items-center h-10 sm:h-12">
						<span class=${this.classMap(iconContainerClasses)}>
							${isComplete
								? html`
										<svg class="size-5 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
											<path
												fill-rule="evenodd"
												d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
												clip-rule="evenodd"
											/>
										</svg>
									`
								: html`
										<span
											class="size-3 rounded-full transition-all duration-200 ${isActive
												? 'bg-primary-onContainer'
												: 'bg-transparent group-hover:bg-primary-default group-hover:scale-125'}"
										></span>
									`}
						</span>
					</span>

					<span class="flex flex-col items-start justify-center min-w-0 ml-3 sm:ml-6">
						<schmancy-typography type="title" token="md">
							<span class="transition-colors duration-200 ${this.classMap(textClasses)}">${this.title}</span>
						</schmancy-typography>
						${when(
							this.description,
							() => html`
								<schmancy-typography type="body" token="sm" class="mt-0.5 sm:mt-1">
									<span class="text-surface-onVariant transition-colors duration-200 ${isActive ? 'text-primary-onContainer' : ''}">${this.description}</span>
								</schmancy-typography>
							`,
						)}
					</span>
				</button>

				<!-- Render step content if the step is active - responsive spacing -->
				${when(
					isActive,
					() => html`
						<div class="ml-6 sm:ml-10 mt-3 sm:mt-4 pb-6 sm:pb-8 transition-all duration-300 ease-out">
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
