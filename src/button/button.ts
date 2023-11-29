import { $LitElement } from '../../lit-kit/src/mixin/lit/litElement.mixin'
import { html, LitElement } from 'lit'
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import style from './button.scss?inline'
export interface szkButtonEventMap {
  szkFocus: CustomEvent<void>
  szkBlur: CustomEvent<void>
}

@customElement('schmancy-button')
export class SchmnacyButton extends $LitElement(style) {
  protected static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    mode: 'open',
    delegatesFocus: true
  }

  @query('[part="base"]', true)
  private nativeElement!: HTMLElement

  private _ariaLabel!: string

  /**
   * The variant of the button. Defaults to undefined.
   * @attr
   * @default 'primary'
   * @public
   */
  @property({ reflect: true, type: String })
  public variant: 'primary' | 'secondary' | 'special' | 'basic' = 'primary'

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

  @property({ type: String, reflect: true })
  public size: 'sm' | 'md' | 'lg' = 'md'

  /**
   * The icon to display in the button.
   * @attr
   * @type {'next' | 'close' | undefined}
   * @default undefined
   */
  @property()
  icon: 'next' | 'close' | undefined

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
    selector: 'img'
  })
  private prefixImgs!: HTMLImageElement[]

  @queryAssignedElements({
    slot: 'suffix',
    flatten: true,
    selector: 'img'
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

  protected get imgsClasses(): string[] {
    if (this.size === 'sm') return ['max-h-[16px]', 'max-w-[16px]', 'object-fit']
    else return ['max-h-[24px]', 'max-w-[24px]', 'object-contain']
  }

  protected get buttonClasses() {
    return {
      'rounded-md inline-flex justify-center items-center focus:outline-none': true,
      'bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50':
        this.variant === 'secondary',
      'text-white border-transparent bg-[#3F3F3F]': this.variant === 'primary',
      'opacity-40': this.disabled,
      'px-[10px] py-[5px] text-sm font-medium gap-[4px] rounded-full': this.size === 'sm',
      'px-[12px] py-2 text-base gap-[4px]': this.size === 'md',
      'px-[20px] py-3 text-base font-medium gap-[10px]': this.size === 'lg',
      'w-full tex-center': this.width === 'full'
    }
  }

  firstUpdated() {
    this.prefixImgs?.forEach((img) => {
      img.classList.add(...this.imgsClasses)
    })
    this.suffixImgs?.forEach((img) => {
      img.classList.add(...this.imgsClasses)
    })
  }

  buttonVariantToTextColor() {
    if (this.variant === 'primary') return 'white'
    if (this.variant === 'secondary') return 'primary'
    return 'primary'
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
        <kleen-typography type="body" .token="${this.size === 'sm' ? 'sm' : 'md'}">
          <slot> placeholder </slot>
        </kleen-typography>
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
