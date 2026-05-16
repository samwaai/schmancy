import { SchmancyElement } from '@mixins/index'
import { css, html, LitElement, PropertyValueMap } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { when } from 'lit/directives/when.js'
import { magnetic } from '../directives/magnetic'
import { ButtonVariant } from './button'

/**
 * An icon button component.
 * @element schmancy-icon-button
 * @slot - The default slot (usually an icon or glyph).
 * @csspart base - The underlying native `<button>` (or `<a>` when `href` is set).
 */
@customElement('schmancy-icon-button')
export class SchmnacyIconButton extends SchmancyElement {
	static styles = [css`
	:host {
		display: inline-flex;
		border-radius: 9999px;
		transition:
			box-shadow 300ms cubic-bezier(0.34, 1.56, 0.64, 1),
			transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	:host([width="full"]) {
		display: flex;
		width: 100%;
	}
	:host(:hover:not([disabled])) {
		box-shadow: 0 2px 12px -4px color-mix(in srgb, var(--schmancy-sys-color-primary-default) 18%, transparent);
	}
	:host(:active:not([disabled])) {
		transform: scale(0.92);
		box-shadow: none;
		transition-duration: 100ms;
	}
	@media (prefers-reduced-motion: reduce) {
		:host { transition: none; }
		:host(:hover:not([disabled])) { box-shadow: none; }
		:host(:active:not([disabled])) { transform: none; box-shadow: none; }
	}
`]

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
	public size: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md'

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
	@property({ reflect: true })
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

	/**
	 * Icon name - use this instead of slot content to prevent translation breaking icons.
	 * Example: <schmancy-icon-button icon="add"></schmancy-icon-button>
	 * @attr
	 */
	@property({ type: String })
	public icon?: string

	// Reactively captured icon name from slot content (translation-proof).
	// Mirrors <schmancy-icon>: a MutationObserver on the light DOM keeps this
	// in sync no matter how the consumer passes the name — a plain text node,
	// a dynamic ${...} binding (Lit mutates the text node's data in place, so
	// no slotchange ever fires), or a nested <schmancy-icon> element.
	// `textContent` flattens through all three.
	@state()
	private _capturedIcon?: string

	private _observer?: MutationObserver

	connectedCallback(): void {
		super.connectedCallback()
		this._captureIcon()
		this._observer = new MutationObserver(() => this._captureIcon())
		this._observer.observe(this, { childList: true, characterData: true, subtree: true })
	}

	disconnectedCallback(): void {
		super.disconnectedCallback()
		this._observer?.disconnect()
	}

	private _captureIcon(): void {
		if (this.icon || this.text) return
		this._capturedIcon = this.textContent?.trim() || undefined
	}

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

	protected firstUpdated(_changedProperties: PropertyValueMap<unknown> | Map<PropertyKey, unknown>): void {
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
			'flex-1 text-center': this.width === 'full',
			'bg-surface-low text-primary-default shadow-xs': effectiveVariant === 'elevated',
			'bg-transparent text-primary-default border-1 border-outline': effectiveVariant === 'outlined',
			'bg-primary-default text-primary-on': effectiveVariant === 'filled',
			'bg-secondary-container text-secondary-onContainer': effectiveVariant === 'filled tonal',
			'text-primary-default': effectiveVariant === 'text',
			// M3 spec: 24dp (xxs) → 32dp (dense) → 40dp (default) → 48dp (standard) → 56dp (large)
			'p-1.5': this.size === 'xxs',    // 6px padding  = 24px total (12px icon) - Ultra-compact
			'p-2': this.size === 'xs',       // 8px padding  = 32px total (16px icon) - M3 dense
			'p-2.5': this.size === 'sm',     // 10px padding = 40px total (20px icon) - M3 default
			'p-3': this.size === 'md',       // 12px padding = 48px total (24px icon) - M3 standard
			'p-4': this.size === 'lg',       // 16px padding = 56px total (24px icon) - M3 large
			'p-5': this.size === 'xl',       // 20px padding = 80px total (40px icon) - custom XL
		}

		const stateLayerClasses = {
			'hover:opacity-[0.08] rounded-full z-0': true,
			'hover:bg-primary-on': effectiveVariant === 'filled',
			'hover:bg-primary-default': effectiveVariant === 'outlined' || effectiveVariant === 'elevated' || effectiveVariant === 'text',
			'hover:bg-secondary-container': effectiveVariant === 'filled tonal',
		}

		const iconSizeClass = this.size === 'xxs' ? 'text-xs' : this.size === 'xs' ? 'text-base' : this.size === 'sm' ? 'text-xl' : this.size === 'md' ? 'text-2xl' : this.size === 'lg' ? 'text-2xl' : 'text-4xl';

		// If href is provided, render an anchor element.
		if (this.href) {
			return html`
				<a
					${magnetic({ strength: 3, radius: 50 })}
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
						: html`
							<slot style="display:none"></slot>
							<schmancy-icon class=${iconSizeClass}>${this.icon || this._capturedIcon}</schmancy-icon>
						`
					}
				</a>
			`
		}

		// Otherwise, render a native button element.
		return html`
			<button
				${magnetic({ strength: 3, radius: 50 })}
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
					: html`
						<slot style="display:none"></slot>
						<schmancy-icon class=${iconSizeClass}>${this.icon || this._capturedIcon}</schmancy-icon>
					`
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
