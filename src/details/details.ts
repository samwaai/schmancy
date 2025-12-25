import { TailwindElement } from '@mixins/index'
import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { createRef, ref, Ref } from 'lit/directives/ref.js'
import { when } from 'lit/directives/when.js'
import { BehaviorSubject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@customElement('schmancy-details')
export default class SchmancyDetails extends TailwindElement(css`
	:host {
		display: block;
	}

	:host([overlay]) {
		position: relative;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	summary {
		list-style: none;
	}
`) {
	protected static shadowRootOptions = {
		...LitElement.shadowRootOptions,
		mode: 'open' as const,
		delegatesFocus: true,
	}

	@property() summary = ''

	@property({ type: Boolean, reflect: true })
	get open() {
		return this._open$.value
	}
	set open(value: boolean) {
		if (this._open$.value !== value) {
			this._open$.next(value)
			this._animateIndicator(value)
		}
	}

	// Indicator control
	@property({ attribute: 'indicator-placement', reflect: true })
	indicatorPlacement: 'start' | 'end' = 'end'

	@property({ type: Boolean, attribute: 'hide-indicator' })
	hideIndicator = false

	@property({ type: Boolean, reflect: true })
	locked = false

	@property({ type: Boolean, reflect: true })
	overlay = false

	private _open$ = new BehaviorSubject<boolean>(false)
	private _indicatorRef: Ref<HTMLElement> = createRef()
	private _currentAnimation?: Animation

	connectedCallback() {
		super.connectedCallback()
		
		this._open$
			.pipe(takeUntil(this.disconnecting))
			.subscribe(() => this.requestUpdate())
	}

	render() {
		const isOpen = this._open$.value

		// Neutral styling with subtle border - inherits from parent surface
		// Add elevation when open, relative positioning for overlay mode
		const detailsClasses = this.classMap({
			'w-full rounded-xl border transition-all duration-200 ease-out': true,
			'overflow-hidden': !this.overlay,
			'overflow-visible relative': this.overlay,
			'border-outline-variant': !isOpen,
			'border-outline shadow-xl z-10': isOpen,
		})

		const summaryClasses = this.classMap({
			'select-none relative flex items-center gap-2 rounded-xl text-surface-on transition-colors duration-200': true,
			'cursor-pointer group hover:bg-surface-on/[0.08] focus-visible:ring-2 focus-visible:ring-primary-default/50 focus-visible:ring-offset-1': !this.locked,
			'cursor-default': this.locked,
			'flex-row': this.indicatorPlacement === 'start',
			'flex-row-reverse': this.indicatorPlacement === 'end',
		})

		const contentClasses = this.classMap({
			'text-surface-on-variant text-sm': true,
			// Overlay mode: glass effect with absolute positioning (like HannahOrderTracking pattern)
			'absolute inset-x-0 bg-surface-container/80 backdrop-blur-2xl shadow-2xl rounded-b-xl z-20 border-x border-b border-outline-variant': this.overlay,
		})

		return html`
			<details
				?open=${isOpen}
				@toggle=${this._handleToggle}
				class=${detailsClasses}
			>
				<summary
					class=${summaryClasses}
					tabindex=${this.locked ? -1 : 0}
					@click=${this._handleSummaryClick}
				>
					${when(!this.hideIndicator, () => html`
					<span
						${ref(this._indicatorRef)}
						class="flex items-center justify-center w-5 h-5 rounded-full shrink-0 text-surface-on-variant group-hover:text-surface-on will-change-transform"
					>
						<slot name="indicator">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="w-5 h-5" aria-hidden="true">
								<path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</slot>
					</span>
				`)}

					<span class="flex-1 font-medium text-base">
						<slot name="summary">${this.summary}</slot>
					</span>
				</summary>

				${when(isOpen, () => html`
					<div class=${contentClasses}>
						<slot></slot>
						<slot name="details"></slot>

					</div>
				`)}
			</details>
		`
	}

	private _animateIndicator(isOpen: boolean) {
		const indicator = this._indicatorRef.value
		if (!indicator) return

		// Cancel any existing animation
		this._currentAnimation?.cancel()

		// Animate with Web Animations API
		this._currentAnimation = indicator.animate(
			[
				{ transform: `rotate(${isOpen ? '0deg' : '90deg'})` },
				{ transform: `rotate(${isOpen ? '90deg' : '0deg'})` }
			],
			{
				duration: 200,
				easing: 'ease-out',
				fill: 'forwards'
			}
		)
	}

	private _handleSummaryClick(e: MouseEvent) {
		// Prevent toggle when locked
		if (this.locked) {
			e.preventDefault()
		}
	}

	private _handleToggle(e: Event) {
		// Locked state is handled by _handleSummaryClick preventing the event
		const details = e.target as HTMLDetailsElement
		const newState = details.open

		if (this._open$.value !== newState) {
			this._open$.next(newState)
			this._animateIndicator(newState)
			this.dispatchEvent(new CustomEvent('toggle', { detail: { open: newState }, bubbles: true, composed: true }))
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-details': SchmancyDetails
	}
}
