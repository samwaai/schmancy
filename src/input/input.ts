import { LitElement, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js' // <-- Import if not provided by TailwindElement
import { ifDefined } from 'lit/directives/if-defined.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { when } from 'lit/directives/when.js'
import { distinctUntilChanged, filter, fromEvent, map } from 'rxjs'

// If TailwindElement extends LitElement and has extra mixins, import it.
// Otherwise, just extend LitElement. Adjust accordingly.
import { TailwindElement } from '@mixins/index'

// color directive + theme interface
import { color } from '@schmancy/directives'
import { SchmancyTheme } from '@schmancy/theme/theme.interface'

// If you want to be form-associated, you can define the type on `ElementInternals`.
declare global {
	interface HTMLElementTagNameMap {
		'schmancy-input': SchmancyInput
	}
}

type EventDetails = {
	value: string
}

export type SchmancyInputChangeEvent = CustomEvent<EventDetails>

/**
 * `schmancy-input` – A custom input component.
 */
@customElement('schmancy-input')
export default class SchmancyInput extends TailwindElement() {
	/**
	 * The label of the control.
	 * @attr
	 * @type {string}
	 * @default ''
	 */
	@property() label = ''

	/**
	 * The type of the control.
	 * @attr
	 * @default 'text'
	 */
	@property({ reflect: true })
	public type:
		| 'email'
		| 'number'
		| 'password'
		| 'search'
		| 'tel'
		| 'text'
		| 'url'
		| 'date'
		| 'datetime-local'
		| 'time'
		| 'month'
		| 'week'
		| 'color'
		| 'file' = 'text'

	@property({ type: Boolean, reflect: true }) public clickable = false

	/**
	 * The name of the control.
	 * @attr
	 * @default 'name_' + Date.now()
	 */
	@property() name = 'name_' + Date.now()

	/**
	 * The placeholder of the control.
	 * @attr
	 * @default ''
	 */
	@property() placeholder = ''

	/**
	 * The value of the control.
	 * @attr
	 * @default ''
	 */
	@property({ type: String, reflect: true }) public value = ''

	/**
	 * The pattern attribute of the control.
	 * @attr
	 */
	@property({ type: String, reflect: true })
	public pattern?: string

	@property({ type: Boolean, reflect: true }) required = false
	@property({ type: Boolean, reflect: true }) disabled = false
	@property({ type: Boolean, reflect: true }) readonly = false
	@property({ type: Boolean, reflect: true }) spellcheck = false

	@property({ type: String, reflect: true }) align: 'left' | 'center' | 'right' = 'left'

	/**
	 * The inputmode attribute of the control.
	 * @attr
	 * @default undefined
	 */
	@property()
	public inputmode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'

	/**
	 * The minlength attribute of the control.
	 * @attr
	 */
	@property({ type: Number })
	public minlength?: number

	/**
	 * The maxlength attribute of the control.
	 * @attr
	 */
	@property({ type: Number })
	public maxlength?: number

	/**
	 * The min attribute of the control.
	 * @attr
	 */
	@property()
	public min?: string

	/**
	 * The max attribute of the control.
	 * @attr
	 */
	@property()
	public max?: string

	/**
	 * The step attribute of the control.
	 * @attr
	 */
	@property({ type: Number, reflect: true })
	public step?: number

	/**
	 * The autofocus attribute of the control.
	 * @attr
	 * @default false
	 */
	@property({ type: Boolean })
	public autofocus = false

	/**
	 * The autocomplete attribute of the control.
	 * @attr
	 */
	@property({ type: String })
	public autocomplete: AutoFill = 'off'

	/**
	 * tabIndex for focusing by tab key.
	 */
	@property({ type: Number, reflect: true })
	public tabIndex = 0

	@property()
	hint?: string

	@property({ type: Boolean, reflect: true }) public error = false

	@query('input') inputElement!: HTMLInputElement
	inputRef = createRef<HTMLInputElement>()

	/** Form-associated custom elements support. */
	static formAssociated = true
	protected static shadowRootOptions = {
		...LitElement.shadowRootOptions,
		delegatesFocus: true,
	}

	private internals?: ElementInternals

	constructor() {
		super()
		if ('attachInternals' in this) {
			try {
				this.internals = this.attachInternals()
			} catch {
				// older browsers or polyfills might fail
				this.internals = undefined
			}
		}
	}

	get form() {
		return this.internals?.form ?? null
	}

	/**
	 * (Optional) Whenever value changes, sync with form internals for
	 * form submission (if you're using form-associated custom elements).
	 */
	protected updated(changedProps: Map<string, unknown>) {
		super.updated(changedProps)
		if (changedProps.has('value')) {
			this.internals?.setFormValue(this.value)
		}
	}

	/** Checks for validity of the control and shows the browser message if it's invalid. */
	public reportValidity() {
		return this.inputRef.value?.reportValidity()
	}

	/** Checks for validity of the control and emits the invalid event if it is invalid. */
	public checkValidity() {
		return this.inputRef.value?.checkValidity()
	}

	/** Sets a custom validity message. */
	public setCustomValidity(message: string) {
		this.inputRef.value?.setCustomValidity(message)
	}

	firstUpdated() {
		if (this.autofocus) {
			this.focus()
		}

		// Subscribe to 'input' changes
		fromEvent<InputEvent>(this.inputElement, 'input')
			.pipe(
				map(event => (event.target as HTMLInputElement).value),
				distinctUntilChanged(),
			)
			.subscribe(value => {
				this.value = value
				this.dispatchEvent(
					new CustomEvent<EventDetails>('change', {
						detail: { value },
						bubbles: true,
						composed: true,
					}),
				)
			})

		// Subscribe to 'change' changes (on blur for native inputs)
		fromEvent<Event>(this.inputElement, 'change')
			.pipe(
				map(event => (event.target as HTMLInputElement).value),
				distinctUntilChanged(),
			)
			.subscribe(value => {
				this.value = value
				this.dispatchEvent(
					new CustomEvent<EventDetails>('change', {
						detail: { value },
						bubbles: true,
						composed: true,
					}),
				)
			})

		// Emit custom event on Enter key
		fromEvent<KeyboardEvent>(this.inputElement, 'keyup')
			.pipe(filter(event => event.key === 'Enter'))
			.subscribe(event => {
				const { value } = event.target as HTMLInputElement
				// You can remove `distinctUntilChanged()` here if you want *every* Enter
				// press to dispatch, even if the value hasn't changed.
				this.value = value
				this.dispatchEvent(
					new CustomEvent<EventDetails>('change', {
						detail: { value },
						bubbles: true,
						composed: true,
					}),
				)
				this.dispatchEvent(
					new CustomEvent<EventDetails>('enter', {
						detail: { value },
						bubbles: true,
						composed: true,
					}),
				)
			})

		// Detect autofill animation
		fromEvent<AnimationEvent>(this.inputElement, 'animationstart')
			.pipe(filter(ev => ev.animationName === 'onAutoFillStart'))
			.subscribe(event => {
				const { value } = event.target as HTMLInputElement
				this.value = value
				this.dispatchEvent(
					new CustomEvent<EventDetails>('change', {
						detail: { value },
						bubbles: true,
						composed: true,
					}),
				)
			})
	}

	/** Selects all text within the input. */
	public select() {
		return this.inputRef.value?.select()
	}

	/** Returns the internal validity state object. */
	public getValidity(): ValidityState | undefined {
		return this.inputRef.value?.validity
	}

	/**
	 * Override focus so that focusing <schmancy-input> actually focuses
	 * the internal <input>.
	 */
	public override focus(options?: FocusOptions) {
		this.inputRef.value?.focus(options)
		this.dispatchEvent(new Event('focus'))
	}

	/**
	 * Same with click; bubble a click out if needed, but delegate to internal input.
	 */
	public override click() {
		this.inputRef.value?.click()
		this.dispatchEvent(new Event('click'))
	}

	/**
	 * Same with blur; bubble the event.
	 */
	public override blur() {
		this.inputRef.value?.blur()
		this.dispatchEvent(new Event('blur'))
	}

	protected override render() {
		const inputClasses = {
			'w-full flex-1 h-[50px] rounded-[8px] border-0 px-[8px] sm:px-[12px] md:px-[16px]': true,
			'disabled:opacity-40 disabled:cursor-not-allowed': true,
			'placeholder:text-muted': true,
			'ring-0 ring-inset focus:ring-1 focus:ring-inset': true,
			'ring-primary-default ring-outline focus:ring-primary-default': !this.error,
			'ring-error-default focus:ring-error-default': this.error,
			'caret-transparent focus:outline-hidden cursor-pointer text-select-none': this.readonly,
			'cursor-pointer': this.clickable,
			'text-center': this.align === 'center',
			'text-right': this.align === 'right',
		}
		const labelClasses = {
			'opacity-40': this.disabled,
			'block mb-[4px]': true,
		}
		return html`
			${when(
				this.label,
				() => html`
					<label
						${color({
							color: this.error ? SchmancyTheme.sys.color.error.default : SchmancyTheme.sys.color.primary.default,
						})}
						class="${classMap(labelClasses)}"
						for=${this.id}
					>
						<schmancy-typography type="label" token="lg">${this.label}</schmancy-typography>
					</label>
				`,
			)}
			<input
				${color({
					bgColor: SchmancyTheme.sys.color.surface.highest,
					color: SchmancyTheme.sys.color.surface.on,
				})}
				${ref(this.inputRef)}
				.value=${this.value}
				id=${this.id}
				name=${this.name}
				type=${this.type}
				step=${ifDefined(this.step)}
				.autocomplete=${this.autocomplete}
				placeholder=${this.placeholder}
				?required=${this.required}
				inputmode=${ifDefined(this.inputmode)}
				class=${classMap(inputClasses)}
				?disabled=${this.disabled}
				?readOnly=${this.readonly}
				minlength=${ifDefined(this.minlength)}
				maxlength=${ifDefined(this.maxlength)}
				min=${ifDefined(this.min)}
				max=${ifDefined(this.max)}
				pattern=${ifDefined(this.pattern)}
			/>
			${when(
				this.hint,
				() => html`
					<schmancy-typography
						${color({
							color: this.error ? SchmancyTheme.sys.color.error.default : SchmancyTheme.sys.color.primary.default,
						})}
						class="pt-[4px]"
						type="body"
						token="sm"
					>
						${this.hint}
					</schmancy-typography>
				`,
			)}
		`
	}
}
