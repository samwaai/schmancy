import { $LitElement } from '@mixins/index'
import { css, html, LitElement } from 'lit'
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { when } from 'lit/directives/when.js'

export interface SchmancyButtonEventMap {
	SchmancyFocus: CustomEvent<void>
	SchmancyBlur: CustomEvent<void>
}

export type ButtonVariant = 'elevated' | 'filled' | 'filled tonal' | 'outlined' | 'text'

/**
 * A button component.
 * @element schmancy-button
 * @slot - The default slot.
 * @slot prefix - The prefix slot.
 * @slot suffix - The suffix slot.
 */
@customElement('schmancy-button')
export class SchmancyButton extends $LitElement(css`
	:host {
		display: block;
		width: fit-content;
	}
`) {
	protected static shadowRootOptions = {
		...LitElement.shadowRootOptions,
		mode: 'open',
		delegatesFocus: true,
	}

	@query('[part="base"]', true)
	private nativeElement!: HTMLElement

	private _ariaLabel!: string

	/**
	 * The variant of the button.
	 * @attr
	 * @default 'text'
	 * @public
	 */
	@property({ reflect: true, type: String })
	public variant: ButtonVariant = 'text'

	/**
	 * The width of the button.
	 * @attr
	 * @type {'full' | 'auto'}
	 * @default 'auto'
	 * @public
	 */
	@property()
	public width: 'full' | 'auto' = 'auto'

	/**
	 * The type of the button.
	 * Defaults to 'button' (preventing accidental form submissions).
	 * @attr
	 */
	@property({ reflect: true, type: String })
	public type: 'button' | 'reset' | 'submit' = 'button'

	/**
	 * The URL the button points to.
	 * If provided, the component will render as an anchor element.
	 * @attr
	 */
	@property()
	public href?: string

	/**
	 * Determines whether the button is disabled.
	 * @attr
	 */
	@property({ type: Boolean, reflect: true })
	public disabled = false

	public override set ariaLabel(value: string) {
		const oldVal = this._ariaLabel
		this._ariaLabel = value

		if (this.hasAttribute('aria-label')) {
			this.removeAttribute('aria-label')
		}
		this.requestUpdate('ariaLabel', oldVal)
	}

	@property({ attribute: 'aria-label' })
	public override get ariaLabel() {
		return this._ariaLabel
	}

	@queryAssignedElements({
		slot: 'prefix',
		flatten: true,
		selector: 'img',
	})
	private prefixImgs!: HTMLImageElement[]

	@queryAssignedElements({
		slot: 'suffix',
		flatten: true,
		selector: 'img',
	})
	private suffixImgs!: HTMLImageElement[]

	/** Sets focus in the button. */
	public override focus(options?: FocusOptions) {
		this.nativeElement.focus(options)
	}

	/** Removes focus from the button. */
	public override blur() {
		this.nativeElement.blur()
	}

	protected get imgClasses(): string[] {
		return ['max-h-[24px]', 'max-w-[24px]', 'object-contain']
	}

	firstUpdated() {
		// Add image classes and ensure decorative images have an empty alt.
		this.prefixImgs?.forEach(img => {
			img.classList.add(...this.imgClasses)
			if (!img.hasAttribute('alt')) {
				img.setAttribute('alt', '')
			}
		})
		this.suffixImgs?.forEach(img => {
			img.classList.add(...this.imgClasses)
			if (!img.hasAttribute('alt')) {
				img.setAttribute('alt', '')
			}
		})
	}

	click(): void {
		this.dispatchEvent(new Event('click', { bubbles: true, composed: true }))
	}

	// Prevent default behavior when the component is disabled.
	private _preventDefault(event: Event) {
		event.preventDefault()
		event.stopPropagation()
	}

	render() {
		// Compute classes for the interactive element.
		const classes = {
			'z-0 py-[8px] px-[16px] transition-all duration-200 relative rounded-full inline-flex justify-center items-center gap-[8px] outline-secondary-default focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 outline-hidden':
				true,
			'cursor-pointer': !this.disabled,
			'opacity-[0.38]': this.disabled,
			'hover:shadow-xs':
				!this.disabled &&
				(this.variant === 'outlined' ||
					this.variant === 'text' ||
					this.variant === 'filled' ||
					this.variant === 'filled tonal'),
			'hover:shadow-sm': !this.disabled && this.variant === 'elevated',
			'w-full tex-center': this.width === 'full',
			'bg-surface-low text-primary-default shadow-xs': this.variant === 'elevated',
			'bg-transparent text-primary-default border-1 border-solid border-outline': this.variant === 'outlined',
			'bg-primary-default text-primary-on': this.variant === 'filled',
			'bg-secondary-container text-secondary-onContainer': this.variant === 'filled tonal',
			'text-primary-default': this.variant === 'text',
		}

		const stateLayerClasses = {
			'absolute inset-0 hover:opacity-[0.08] z-0 rounded-full': true,
			'hover:bg-primary-on': this.variant === 'filled',
			'hover:bg-primary-default': this.variant === 'outlined' || this.variant === 'elevated' || this.variant === 'text',
			'hover:bg-secondary-container': this.variant === 'filled tonal',
		}

		// If href is provided, render an anchor element.
		if (this.href) {
			return html`
				<a
					part="base"
					href=${ifDefined(this.disabled ? undefined : this.href)}
					aria-label=${ifDefined(this.ariaLabel)}
					class="${this.classMap(classes)}"
					tabindex=${this.disabled ? '-1' : '0'}
					aria-disabled=${this.disabled}
					@click=${this.disabled ? this._preventDefault : undefined}
				>
					${when(!this.disabled, () => html`<div class="${this.classMap(stateLayerClasses)}"></div>`)}
					<slot name="prefix"></slot>
					<slot></slot>
					<slot name="suffix"></slot>
				</a>
			`
		}

		// Otherwise, render a native button element.
		return html`
			<button
				part="base"
				aria-label=${ifDefined(this.ariaLabel)}
				?disabled=${this.disabled}
				class="${this.classMap(classes)}"
				type=${ifDefined(this.type)}
				tabindex=${ifDefined(this.disabled ? '-1' : undefined)}
			>
				${when(!this.disabled, () => html`<div class="${this.classMap(stateLayerClasses)}"></div>`)}
				<slot name="prefix"></slot>
				<slot></slot>
				<slot name="suffix"></slot>
			</button>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-button': SchmancyButton
	}
}
