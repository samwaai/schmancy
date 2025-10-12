import { $LitElement } from '@mixins/index'
import { css, html, LitElement, PropertyValueMap } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { when } from 'lit/directives/when.js'
import { ButtonVariant } from './button'

/**
 * An icon button component.
 * @element schmancy-icon-button
 * @slot - The default slot.
 */
@customElement('schmancy-icon-button')
export class SchmnacyIconButton extends $LitElement(css`
	:host {
		display: block;
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
	 * The size of the icon.
	 * @attr
	 * @default 'md'
	 */
	@property({ type: String })
	public size: 'sm' | 'md' | 'lg' | 'xl' = 'md'

	/**
	 * The variant of the button.
	 * @attr
	 * @default 'text'
	 */
	@property({ reflect: true, type: String })
	public variant: ButtonVariant = 'text'

	/**
	 * The width of the button.
	 * @attr
	 * @type {'full' | 'auto'}
	 * @default 'auto'
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

	/**
	 * Render slot content as text instead of wrapping in schmancy-icon.
	 * Use this when you want to display text labels in the button.
	 * @attr
	 */
	@property({ type: Boolean, reflect: true })
	public text = false

	// Manage aria-label manually so that we can always use our internal property.
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

	/** Sets focus in the button. */
	public override focus(options?: FocusOptions) {
		this.nativeElement.focus(options)
	}

	/** Removes focus from the button. */
	public override blur() {
		this.nativeElement.blur()
	}

	click(): void {
		this.dispatchEvent(new Event('click', { bubbles: true, composed: true }))
	}

	// Prevent default behavior when the component is disabled.
	private _preventDefault(event: Event) {
		event.preventDefault()
		event.stopPropagation()
	}

	protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
		// Add any first-update logic here if needed.
	}

	render() {
		// Map 'tonal' variant to 'filled tonal' for backwards compatibility
		const effectiveVariant = this.variant === 'tonal' ? 'filled tonal' : this.variant;

		// Compute classes for the interactive element.
		const classes = {
			'z-0 h-full transition-all duration-200 relative rounded-full inline-flex justify-center items-center gap-[8px] outline-secondary-default focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 outline-hidden':
				true,
			'opacity-[0.38]': this.disabled,
			'cursor-pointer': !this.disabled,
			'hover:shadow-xs':
				!this.disabled &&
				(effectiveVariant === 'outlined' ||
					effectiveVariant === 'text' ||
					effectiveVariant === 'filled' ||
					effectiveVariant === 'filled tonal'),
			'hover:shadow-sm': !this.disabled && effectiveVariant === 'elevated',
			'w-full text-center': this.width === 'full',
			'bg-surface-low text-primary-default shadow-xs': effectiveVariant === 'elevated',
			'bg-transparent text-primary-default border-1 border-outline': effectiveVariant === 'outlined',
			'bg-primary-default text-primary-on': effectiveVariant === 'filled',
			'bg-secondary-container text-secondary-onContainer': effectiveVariant === 'filled tonal',
			'text-primary-default': effectiveVariant === 'text',
			'px-[6px] py-[6px]': this.size === 'sm',
			'px-[8px] py-[8px]': this.size === 'md',
			'px-[12px] py-[12px]': this.size === 'lg',
			'px-[16px] py-[16px]': this.size === 'xl',
		}

		const stateLayerClasses = {
			'hover:opacity-[0.08] rounded-full z-0': true,
			'hover:bg-primary-on': effectiveVariant === 'filled',
			'hover:bg-primary-default': effectiveVariant === 'outlined' || effectiveVariant === 'elevated' || effectiveVariant === 'text',
			'hover:bg-secondary-container': effectiveVariant === 'filled tonal',
		}

		// Icon size mapping
		const iconSize = this.size === 'sm' ? '18px' : this.size === 'md' ? '24px' : this.size === 'lg' ? '32px' : '40px';

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
					${when(!this.disabled, () => html`<div class="absolute inset-0 ${this.classMap(stateLayerClasses)}"></div>`)}
					${this.text
						? html`<slot></slot>`
						: html`<schmancy-icon size=${iconSize}><slot></slot></schmancy-icon>`
					}
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
				${when(!this.disabled, () => html`<div class="absolute inset-0 ${this.classMap(stateLayerClasses)}"></div>`)}
				${this.text
					? html`<slot></slot>`
					: html`<schmancy-icon size=${iconSize}><slot></slot></schmancy-icon>`
				}
			</button>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-icon-button': SchmnacyIconButton
	}
}
