import { TailwindElement } from '@mixins/index'
import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { BehaviorSubject } from 'rxjs'

@customElement('schmancy-details')
export default class SchmancyDetails extends TailwindElement(css`
	:host {
		display: block;
		position: relative;
	}

	/* Hide browser default marker */
	summary::-webkit-details-marker {
		display: none;
	}

	summary {
		list-style: none;
	}

	/* Variant-specific styles */
	:host([variant='outlined']) details {
		border: 1px solid var(--schmancy-sys-color-outline-variant);
		background-color: var(--schmancy-sys-color-surface-default);
	}

	:host([variant='filled']) details {
		/* M3: container surface */
		background-color: var(--schmancy-sys-color-surface-container);
	}

	:host([variant='elevated']) details {
		/* M3: containerLow when closed */
		background-color: var(--schmancy-sys-color-surface-containerLow);
		box-shadow: var(--schmancy-sys-elevation-1);
	}

	:host([variant='elevated']) details[open] {
		/* M3: elevated state increases elevation and changes surface */
		box-shadow: var(--schmancy-sys-elevation-2);
		background-color: var(--schmancy-sys-color-surface-container);
	}

	/* Type-specific styles - semantic colors */
	:host([type='success']) details {
		border-left: 4px solid var(--schmancy-sys-color-success-default);
		background-color: color-mix(in srgb, var(--schmancy-sys-color-success-container) 10%, transparent);
	}

	:host([type='error']) details {
		border-left: 4px solid var(--schmancy-sys-color-error-default);
		background-color: color-mix(in srgb, var(--schmancy-sys-color-error-container) 10%, transparent);
	}

	:host([type='warning']) details {
		border-left: 4px solid var(--schmancy-sys-color-warning-default);
		background-color: color-mix(in srgb, var(--schmancy-sys-color-warning-container) 10%, transparent);
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
		}
	}
	@property({ reflect: true }) variant:  'outlined' | 'filled' | 'elevated' = 'outlined'
	@property({ reflect: true }) type?: 'success' | 'error' | 'warning'

	private _open$ = new BehaviorSubject<boolean>(false)

	connectedCallback() {
		super.connectedCallback()
		this._open$.subscribe(() => this.requestUpdate())
	}

	render() {
		const isOpen = this._open$.value

		return html`
			<details
				?open=${isOpen}
				@toggle=${this._handleToggle}
				class="w-full overflow-hidden rounded-(--schmancy-sys-shape-corner-medium)"
			>
				<summary
					class="cursor-pointer select-none relative flex items-center gap-2 px-3 py-2 rounded-xl text-surface-on group focus-visible:outline-2 focus-visible:outline-primary-default focus-visible:outline-offset-2"
					tabindex="0"
				>
					<!-- Summary content -->
					<span class="flex-1 font-medium text-base">
						<slot name="summary">${this.summary}</slot>
					</span>

					<!-- Expand/collapse icon -->
					<span class="flex items-center justify-center w-5 h-5 rounded-full shrink-0 text-surface-onVariant group-hover:text-surface-on ${isOpen ? 'rotate-90' : ''}">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							class="w-5 h-5"
						>
							<path
								d="M9 6L15 12L9 18"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</span>
				</summary>

				<!-- Content area -->
				${isOpen ? html`
					<div class="px-3 pb-2 text-surface-onVariant text-sm">
						<slot></slot>
					</div>
				` : ''}
			</details>
		`
	}

	private _handleToggle(e: Event) {
		const details = e.target as HTMLDetailsElement
		this._open$.next(details.open)
		this._dispatchToggleEvent(details.open)
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
