import { TailwindElement } from '@mixins/index'
import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { createRef, ref, Ref } from 'lit/directives/ref.js'
import { when } from 'lit/directives/when.js'
import { classMap } from 'lit/directives/class-map.js'
import { BehaviorSubject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@customElement('schmancy-details')
export default class SchmancyDetails extends TailwindElement(css`
	:host {
		display: block;
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

	@property({ reflect: true }) variant: 'outlined' | 'filled' | 'elevated' = 'outlined'
	@property({ reflect: true }) type?: 'success' | 'error' | 'warning'
	
	// Tailwind padding classes
	@property({ attribute: 'summary-padding' }) summaryPadding = 'px-3 py-2'
	@property({ attribute: 'content-padding' }) contentPadding = 'px-3 pb-2'
	
	// Indicator control
	@property({ attribute: 'indicator-placement', reflect: true }) 
	indicatorPlacement: 'start' | 'end' = 'end'
	
	@property({ type: Boolean, attribute: 'hide-indicator' }) 
	hideIndicator = false

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

		const detailsClasses = classMap({
			'w-full overflow-hidden rounded-xl': true,
			// Variant styles
			'border border-outline-variant bg-surface-default': this.variant === 'outlined',
			'bg-surface-container': this.variant === 'filled',
			'bg-surface-containerLow shadow-md': this.variant === 'elevated' && !isOpen,
			'bg-surface-container shadow-lg': this.variant === 'elevated' && isOpen,
			// Type styles
			'border-l-4 border-l-success-default bg-success-container/10': this.type === 'success',
			'border-l-4 border-l-error-default bg-error-container/10': this.type === 'error',
			'border-l-4 border-l-warning-default bg-warning-container/10': this.type === 'warning',
		})

		const summaryClasses = classMap({
			'cursor-pointer select-none relative flex items-center gap-2 rounded-xl text-surface-on group focus-visible:outline-2 focus-visible:outline-primary-default focus-visible:outline-offset-2': true,
			[this.summaryPadding]: true,
			'flex-row': this.indicatorPlacement === 'start',
			'flex-row-reverse': this.indicatorPlacement === 'end',
		})

		const contentClasses = classMap({
			'text-surface-onVariant text-sm': true,
			[this.contentPadding]: true,
		})

		return html`
			<details
				?open=${isOpen}
				@toggle=${this._handleToggle}
				class=${detailsClasses}
			>
				<summary
					class=${summaryClasses}
					tabindex="0"
				>
					${when(
						!this.hideIndicator,
						() => this._renderIndicator()
					)}

					<span class="flex-1 font-medium text-base">
						<slot name="summary">${this.summary}</slot>
					</span>
				</summary>

				${when(
					isOpen,
					() => html`
						<div class=${contentClasses}>
							<slot></slot>
						</div>
					`
				)}
			</details>
		`
	}

	private _renderIndicator() {
		return html`
			<span 
				${ref(this._indicatorRef)}
				class="flex items-center justify-center w-5 h-5 rounded-full shrink-0 text-surface-onVariant group-hover:text-surface-on will-change-transform"
			>
				<slot name="indicator">
					${this._renderDefaultIndicator()}
				</slot>
			</span>
		`
	}

	private _renderDefaultIndicator() {
		return html`
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				class="w-5 h-5"
				aria-hidden="true"
			>
				<path
					d="M9 6L15 12L9 18"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
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

	private _handleToggle(e: Event) {
		const details = e.target as HTMLDetailsElement
		const newState = details.open
		
		if (this._open$.value !== newState) {
			this._open$.next(newState)
			this._animateIndicator(newState)
			this._dispatchToggleEvent(newState)
		}
	}

	private _dispatchToggleEvent(open: boolean) {
		this.dispatchEvent(
			new CustomEvent('toggle', {
				detail: { open },
				bubbles: true,
				composed: true,
			})
		)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-details': SchmancyDetails
	}
}
