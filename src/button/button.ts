import { html, LitElement } from 'lit'
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { ButtonVariant } from './types'
export interface SchmancyButtonEventMap {
	SchmancyFocus: CustomEvent<void>
	SchmancyBlur: CustomEvent<void>
}

@customElement('schmancy-button')
export class SchmnacyButton extends TailwindElement() {
	protected static shadowRootOptions = {
		...LitElement.shadowRootOptions,
		mode: 'open',
		delegatesFocus: true,
	}

	@query('[part="base"]', true)
	private nativeElement!: HTMLElement

	private _ariaLabel!: string

	/**
	 * The variant of the button. Defaults to undefined.
	 * @attr
	 * @default 'elevated'
	 * @public
	 */
	@property({ reflect: true, type: String })
	public variant: ButtonVariant

	/**
	 *  The width of the button. Defaults to 'auto'.
	 *  @attr
	 * @type {'full' | 'auto'}
	 * @default 'auto'
	 * @public
	 */
	@property()
	public width!: 'full' | 'auto'

	/**
	 * The type of the button. Defaults to undefined.
	 * @attr
	 */
	@property({ reflect: true, type: String })
	public type!: 'button' | 'reset' | 'submit'

	/**
	 * The URL the button points to.
	 * @attr
	 */
	@property()
	public href!: string

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

	protected get buttonClasses() {
		return {
			'h-[40px] shadow-0 px-[24px] rounded-full inline-flex justify-center items-center focus:outline-none': true,
			'opacity-40': this.disabled,
			'w-full tex-center': this.width === 'full',
			'bg-surface-low text-primary-default shadow-1 hover:shadow-2': this.variant === 'elevated',
			'bg-transparent text-primary-default border-1 border-outline hover:shadow-1': this.variant === 'outlined',
			'bg-primary-default text-primary-on hover:shadow-1 hover:bg-primary-default/80': this.variant === 'filled',
			'bg-secondary-container text-secondary-onContainer hover:shadow-1': this.variant === 'filled tonal',
			'text-primary-default hover:shadow-1': this.variant === 'text',
		}
	}

	firstUpdated() {
		this.prefixImgs?.forEach(img => {
			img.classList.add(...this.imgClasses)
		})
		this.suffixImgs?.forEach(img => {
			img.classList.add(...this.imgClasses)
		})
	}

	click(): void {
		this.dispatchEvent(new Event('click', { bubbles: true, composed: true }))
	}

	protected override render() {
		return html`
			<button
				part="base"
				aria-label=${ifDefined(this.ariaLabel)}
				?disabled=${this.disabled}
				class=${this.classMap(this.buttonClasses)}
				type=${ifDefined(this.type)}
				tabindex=${ifDefined(this.disabled ? '-1' : undefined)}
			>
				<slot name="prefix"></slot>
				<slot> placeholder </slot>
				<slot name="suffix"></slot>
			</button>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-button': SchmnacyButton
	}
}
