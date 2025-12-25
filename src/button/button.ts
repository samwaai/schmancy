import { $LitElement } from '@mixins/index'
import { css, html, LitElement } from 'lit'
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { when } from 'lit/directives/when.js'

export interface SchmancyButtonEventMap {
	SchmancyFocus: CustomEvent<void>
	SchmancyBlur: CustomEvent<void>
}

export type ButtonVariant = 'elevated' | 'filled' | 'filled tonal' | 'tonal' | 'outlined' | 'text'
export type ButtonColor = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'neutral'

/**
 * A button component.
 * @element schmancy-button
 * @slot - The default slot.
 * @slot prefix - The prefix slot.
 * @slot suffix - The suffix slot.
 */
@customElement('schmancy-button')
export class SchmancyButton extends $LitElement(
	css`:host{
		display: inline-block;
		min-width: fit-content;
		overflow: hidden;
		position: relative;
		touch-action: manipulation;
	}
	:host *,
	* {
		touch-action: manipulation;
	}`
) {
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
	 * The color of the button.
	 * @attr
	 * @default Depends on variant: 'primary' for filled/elevated/outlined/text, 'secondary' for tonal
	 * @public
	 */
	@property({ reflect: true, type: String })
	public color?: ButtonColor

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
	 * The size of the button.
	 * @attr
	 * @type {'xxs' | 'xs' | 'sm' | 'md' | 'lg'}
	 * @default 'md'
	 * @public
	 */
	@property({ type: String })
	public size: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' = 'md'

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

	/**
	 * Get the effective color based on variant if not explicitly set
	 * M3 spec: filled = primary, tonal = secondary, others = primary
	 */
	protected get effectiveColor(): ButtonColor {
		if (this.color) return this.color

		// Map 'tonal' to 'filled tonal' for checking
		const effectiveVariant = this.variant === 'tonal' ? 'filled tonal' : this.variant

		// M3 defaults: tonal uses secondary, others use primary
		return effectiveVariant === 'filled tonal' ? 'secondary' : 'primary'
	}

	protected get imgClasses(): string[] {
		// M3 spec: icon sizes scale with button size
		const sizeMap = {
			xxs: 'w-3 h-3',    // 12px for 24px button (ultra-compact)
			xs: 'w-4 h-4',     // 16px for 32px button (M3 dense)
			sm: 'w-5 h-5',     // 20px for 40px button (M3 default)
			md: 'w-6 h-6',     // 24px for 48px button (M3 large)
			lg: 'w-7 h-7'      // 28px for 56px button (M3 extra large)
		}
		return [sizeMap[this.size], 'object-contain']
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
		// Map 'tonal' variant to 'filled tonal' for backwards compatibility
		const effectiveVariant = this.variant === 'tonal' ? 'filled tonal' : this.variant;

		// Compute classes for the interactive element.
		const classes = {
			'z-0 transition-all duration-200 relative rounded-full inline-flex justify-center items-center outline-secondary-default focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 outline-hidden w-[inherit] overflow-hidden':
				true,
			// Height - M3 spec: 24dp (xxs) → 32dp (dense) → 40dp (default) → 48dp (large) → 56dp (XL)
			'h-6': this.size === 'xxs',   // 24px - Ultra-compact
			'h-8': this.size === 'xs',    // 32px - M3 dense/compact
			'h-10': this.size === 'sm',   // 40px - M3 default
			'h-12': this.size === 'md',   // 48px - M3 large
			'h-14': this.size === 'lg',   // 56px - M3 extra large
			// Padding - M3 spec: horizontal padding 24dp default, scaled proportionally
			'py-1 px-2': this.size === 'xxs',    // 4px/8px for 24px height
			'py-2 px-4': this.size === 'xs',     // 8px/16px for 32px height
			'py-2.5 px-5': this.size === 'sm',   // 10px/20px for 40px height
			'py-3 px-6': this.size === 'md',     // 12px/24px for 48px height (M3 default)
			'py-4 px-7': this.size === 'lg',     // 16px/28px for 56px height
			// Typography - M3 spec: label-large (14px) default, scaled
			'text-[10px] font-medium leading-3': this.size === 'xxs', // 10px
			'text-xs font-medium leading-4': this.size === 'xs',   // 12px
			'text-sm font-medium leading-5': this.size === 'sm' || this.size === 'md',   // 14px - M3 label-large
			'text-base font-medium leading-6': this.size === 'lg', // 16px
			// Letter spacing - M3 spec
			'tracking-[0.1px]': true,
			// Gap - Scaled with size
			'gap-0.5': this.size === 'xxs', // 2px
			'gap-1': this.size === 'xs',    // 4px
			'gap-1.5': this.size === 'sm',  // 6px
			'gap-2': this.size === 'md',    // 8px
			'gap-2.5': this.size === 'lg',  // 10px
			'cursor-pointer': !this.disabled,
			'opacity-[0.38]': this.disabled,
			'hover:shadow-sm': !this.disabled && effectiveVariant === 'elevated',
			'w-full tex-center': this.width === 'full',
			// Elevated variant
			'bg-surface-low shadow-xs': effectiveVariant === 'elevated',
			// Outlined variant
			'bg-transparent border-1 border-solid': effectiveVariant === 'outlined',
			'border-outline': effectiveVariant === 'outlined' && this.effectiveColor === 'primary',
			'border-success-default': effectiveVariant === 'outlined' && this.effectiveColor === 'success',
			'border-error-default': effectiveVariant === 'outlined' && this.effectiveColor === 'error',
			'border-warning-default': effectiveVariant === 'outlined' && this.effectiveColor === 'warning',
			'border-info-default': effectiveVariant === 'outlined' && this.effectiveColor === 'info',
			'border-secondary-default': effectiveVariant === 'outlined' && this.effectiveColor === 'secondary',
			'border-outline-variant': effectiveVariant === 'outlined' && this.effectiveColor === 'neutral',
			// Filled variant - background colors
			'bg-primary-default': effectiveVariant === 'filled' && this.effectiveColor === 'primary',
			'bg-secondary-default': effectiveVariant === 'filled' && this.effectiveColor === 'secondary',
			'bg-success-default': effectiveVariant === 'filled' && this.effectiveColor === 'success',
			'bg-error-default': effectiveVariant === 'filled' && this.effectiveColor === 'error',
			'bg-warning-default': effectiveVariant === 'filled' && this.effectiveColor === 'warning',
			'bg-info-default': effectiveVariant === 'filled' && this.effectiveColor === 'info',
			'bg-surface-containerHighest': effectiveVariant === 'filled' && this.effectiveColor === 'neutral',
			// Filled variant - text colors
			'text-primary-on': effectiveVariant === 'filled' && this.effectiveColor === 'primary',
			'text-secondary-on': effectiveVariant === 'filled' && this.effectiveColor === 'secondary',
			'text-success-on': effectiveVariant === 'filled' && this.effectiveColor === 'success',
			'text-error-on': effectiveVariant === 'filled' && this.effectiveColor === 'error',
			'text-warning-on': effectiveVariant === 'filled' && this.effectiveColor === 'warning',
			'text-info-on': effectiveVariant === 'filled' && this.effectiveColor === 'info',
			'text-surface-on': effectiveVariant === 'filled' && this.effectiveColor === 'neutral',
			// Filled tonal variant - background colors
			'bg-primary-container': effectiveVariant === 'filled tonal' && this.effectiveColor === 'primary',
			'bg-secondary-container': effectiveVariant === 'filled tonal' && this.effectiveColor === 'secondary',
			'bg-success-container': effectiveVariant === 'filled tonal' && this.effectiveColor === 'success',
			'bg-error-container': effectiveVariant === 'filled tonal' && this.effectiveColor === 'error',
			'bg-warning-container': effectiveVariant === 'filled tonal' && this.effectiveColor === 'warning',
			'bg-info-container': effectiveVariant === 'filled tonal' && this.effectiveColor === 'info',
			'bg-surface-containerLow': effectiveVariant === 'filled tonal' && this.effectiveColor === 'neutral',
			// Filled tonal variant - text colors
			'text-primary-onContainer': effectiveVariant === 'filled tonal' && this.effectiveColor === 'primary',
			'text-secondary-onContainer': effectiveVariant === 'filled tonal' && this.effectiveColor === 'secondary',
			'text-success-onContainer': effectiveVariant === 'filled tonal' && this.effectiveColor === 'success',
			'text-error-onContainer': effectiveVariant === 'filled tonal' && this.effectiveColor === 'error',
			'text-warning-onContainer': effectiveVariant === 'filled tonal' && this.effectiveColor === 'warning',
			'text-info-onContainer': effectiveVariant === 'filled tonal' && this.effectiveColor === 'info',
			// Text and elevated variants - text colors
			'text-primary-default': (effectiveVariant === 'text' || effectiveVariant === 'elevated' || effectiveVariant === 'outlined') && this.effectiveColor === 'primary',
			'text-secondary-default': (effectiveVariant === 'text' || effectiveVariant === 'elevated' || effectiveVariant === 'outlined') && this.effectiveColor === 'secondary',
			'text-success-default': (effectiveVariant === 'text' || effectiveVariant === 'elevated' || effectiveVariant === 'outlined') && this.effectiveColor === 'success',
			'text-error-default': (effectiveVariant === 'text' || effectiveVariant === 'elevated' || effectiveVariant === 'outlined') && this.effectiveColor === 'error',
			'text-warning-default': (effectiveVariant === 'text' || effectiveVariant === 'elevated' || effectiveVariant === 'outlined') && this.effectiveColor === 'warning',
			'text-info-default': (effectiveVariant === 'text' || effectiveVariant === 'elevated' || effectiveVariant === 'outlined') && this.effectiveColor === 'info',
			'text-surface-onVariant': (effectiveVariant === 'text' || effectiveVariant === 'elevated' || effectiveVariant === 'outlined' || effectiveVariant === 'filled tonal') && this.effectiveColor === 'neutral',
		}

		const stateLayerClasses = {
			'absolute inset-0 hover:opacity-[0.08] z-0 rounded-full': true,
			// M3 focus and pressed states
			'focus-visible:opacity-[0.10]': true,  // M3 focus state
			'active:opacity-[0.10]': true,         // M3 pressed state
			// Filled variant hover
			'hover:bg-primary-on': effectiveVariant === 'filled' && this.effectiveColor === 'primary',
			'hover:bg-secondary-on': effectiveVariant === 'filled' && this.effectiveColor === 'secondary',
			'hover:bg-success-on': effectiveVariant === 'filled' && this.effectiveColor === 'success',
			'hover:bg-error-on': effectiveVariant === 'filled' && this.effectiveColor === 'error',
			'hover:bg-warning-on': effectiveVariant === 'filled' && this.effectiveColor === 'warning',
			'hover:bg-info-on': effectiveVariant === 'filled' && this.effectiveColor === 'info',
			'hover:bg-surface-on': effectiveVariant === 'filled' && this.effectiveColor === 'neutral',
			// Outlined, elevated, text variants hover
			'hover:bg-primary-default': (effectiveVariant === 'outlined' || effectiveVariant === 'elevated' || effectiveVariant === 'text') && this.effectiveColor === 'primary',
			'hover:bg-secondary-default': (effectiveVariant === 'outlined' || effectiveVariant === 'elevated' || effectiveVariant === 'text') && this.effectiveColor === 'secondary',
			'hover:bg-success-default': (effectiveVariant === 'outlined' || effectiveVariant === 'elevated' || effectiveVariant === 'text') && this.effectiveColor === 'success',
			'hover:bg-error-default': (effectiveVariant === 'outlined' || effectiveVariant === 'elevated' || effectiveVariant === 'text') && this.effectiveColor === 'error',
			'hover:bg-warning-default': (effectiveVariant === 'outlined' || effectiveVariant === 'elevated' || effectiveVariant === 'text') && this.effectiveColor === 'warning',
			'hover:bg-info-default': (effectiveVariant === 'outlined' || effectiveVariant === 'elevated' || effectiveVariant === 'text') && this.effectiveColor === 'info',
			'hover:bg-surface-onVariant': (effectiveVariant === 'outlined' || effectiveVariant === 'elevated' || effectiveVariant === 'text') && this.effectiveColor === 'neutral',
			// Filled tonal hover
			'hover:bg-primary-container': effectiveVariant === 'filled tonal' && this.effectiveColor === 'primary',
			'hover:bg-secondary-container': effectiveVariant === 'filled tonal' && this.effectiveColor === 'secondary',
			'hover:bg-success-container': effectiveVariant === 'filled tonal' && this.effectiveColor === 'success',
			'hover:bg-error-container': effectiveVariant === 'filled tonal' && this.effectiveColor === 'error',
			'hover:bg-warning-container': effectiveVariant === 'filled tonal' && this.effectiveColor === 'warning',
			'hover:bg-info-container': effectiveVariant === 'filled tonal' && this.effectiveColor === 'info',
			'hover:bg-surface-containerLow': effectiveVariant === 'filled tonal' && this.effectiveColor === 'neutral',
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
