import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { fromEvent, takeUntil } from 'rxjs'

/**
 * `schmancy-option` is an option element for schmancy-select and schmancy-autocomplete components.
 *
 * @fires click - When the option is clicked
 */
@customElement('schmancy-option')
export default class SchmancyOption extends TailwindElement(css`
	:host {
		display: block;
		cursor: pointer;
		user-select: none;
		outline: none;
	}

	:host(:focus-visible) {
		outline: 2px solid var(--schmancy-sys-color-primary-default);
		outline-offset: -2px;
	}

	:host([hidden]) {
		display: none;
	}

	:host([disabled]) {
		opacity: 0.5;
		pointer-events: none;
	}
`) {
	/**
	 * The value of the option, will be used when selected.
	 */
	@property({ type: String })
	value: string = ''

	/**
	 * The human-readable label for the option.
	 */
	@property({ type: String })
	label: string = ''

	/**
	 * Whether the option is currently selected.
	 */
	@property({ type: Boolean, reflect: true })
	selected: boolean = false

	/**
	 * Whether the option is disabled.
	 */
	@property({ type: Boolean, reflect: true })
	disabled: boolean = false

	/**
	 * Optional group this option belongs to (for option grouping).
	 */
	@property({ type: String })
	group: string = ''

	/**
	 * Optional icon or image to display before the label.
	 */
	@property({ type: String })
	icon: string = ''

	connectedCallback() {
		super.connectedCallback()

		// Ensure the option has an ID for accessibility
		if (!this.id) {
			this.id = `schmancy-option-${Math.random().toString(36).substring(2, 9)}`
		}

		// If no label was provided, use the text content or value
		if (!this.label) {
			this.label = this.textContent?.trim() || this.value
		}

		// If value wasn't set but there's text content, use that as the value
		if (!this.value && this.textContent) {
			this.value = this.textContent.trim()
		}

		// Make the option clickable
		fromEvent<MouseEvent>(this, 'click')
			.pipe(takeUntil(this.disconnecting))
			.subscribe((e) => {
				e.stopPropagation()
				if (this.disabled) return
				// Dispatch a custom event with this option's value
				this.dispatchEvent(
					new CustomEvent('option-select', {
						bubbles: true,
						composed: true,
						detail: { value: this.value },
					}),
				)
			})

		fromEvent<KeyboardEvent>(this, 'keydown')
			.pipe(takeUntil(this.disconnecting))
			.subscribe((e) => {
				// Handle space and enter as clicks
				if (e.key === ' ' || e.key === 'Enter') {
					e.preventDefault()
					e.stopPropagation()
					if (this.disabled) return
					// Dispatch a custom event with this option's value
					this.dispatchEvent(
						new CustomEvent('option-select', {
							bubbles: true,
							composed: true,
							detail: { value: this.value },
						}),
					)
				}
			})
	}

	disconnectedCallback() {
		// Event listeners are automatically cleaned up via takeUntil(this.disconnecting)
		super.disconnectedCallback()
	}


	render() {
		const classes = {
			'py-2': true,
			'px-3': true,
			rounded: true,
			'text-sm': true,
			'w-full': true,
			flex: true,
			'items-center': true,
			'gap-2': true,
			// Selected state
			'bg-primary-container': this.selected,
			'text-primary-onContainer': this.selected,
			// Hover state (when not selected)
			'hover:bg-surface-high': !this.selected,
			// Focus state
			'focus:outline-none': true,
		}

		return html`
			<div class=${this.classMap(classes)} role="option" aria-selected=${this.selected} aria-disabled=${this.disabled}>
				${this.icon ? html`<span class="icon">${this.icon}</span>` : ''}
				<span class="flex-1">${this.label || this.value}</span>
				${this.selected
					? html`
							<span class="check">
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<polyline points="20 6 9 17 4 12"></polyline>
								</svg>
							</span>
						`
					: ''}
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-option': SchmancyOption
	}
}
