import { html, LitElement, nothing, PropertyValueMap } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { when } from 'lit/directives/when.js'
import { distinctUntilChanged, filter, fromEvent, map, takeUntil } from 'rxjs'

import { TailwindElement } from '@mixins/index'

// color directive + theme interface
import { color } from '@schmancy/directives'
import { SchmancyTheme } from '@schmancy/theme/theme.interface'

// If you want to be form-associated, define the type on `ElementInternals`.
declare global {
	interface HTMLElementTagNameMap {
		'schmancy-input': SchmancyInput
	}
}

type EventDetails = {
	value: string
}

/**
 * Custom events the component may emit:
 * - 'input': on every keystroke
 * - 'change': on native blur/change
 * - 'enter': specifically when user presses Enter
 */
export type SchmancyInputInputEvent = CustomEvent<EventDetails>
export type SchmancyInputChangeEvent = CustomEvent<EventDetails>
export type SchmancyInputEnterEvent = CustomEvent<EventDetails>

@customElement('schmancy-input')
export default class SchmancyInput extends TailwindElement() {
	// ----------------------------
	//  A) Public properties
	// ----------------------------

	/** If user does NOT set `id`, we'll autogenerate one. */
	static _idCounter = 0

	@property({ reflect: true })
	public override id = ''

	/**
	 * The label for the control. If populated, we render a `<label for="...">`.
	 * If empty, we add an `aria-label` to the <input> for better screenreader support.
	 */
	@property({ type: String }) label = ''

	/**
	 * The type of input. (e.g. 'text', 'password', 'email', etc.)
	 */
	@property({ reflect: true })
	public type: HTMLInputElement['type'] = 'text'

	/**
	 * Name attribute (for form submissions). By default, a unique fallback.
	 */
	@property()
	public name = `name_${Date.now()}`

	@property()
	public placeholder = ''

	/** Current value of the input. */
	@property({ type: String, reflect: true })
	public value = ''

	/** Pattern validation attribute. */
	@property({ type: String, reflect: true })
	public pattern?: string

	/** Whether the control is required for form validation. */
	@property({ type: Boolean, reflect: true })
	public required = false

	/** Whether the control is disabled. */
	@property({ type: Boolean, reflect: true })
	public disabled = false

	/** Whether the input is read-only. */
	@property({ type: Boolean, reflect: true })
	public readonly = false

	/** If true, we visually show a pointer cursor even if readOnly. */
	@property({ type: Boolean, reflect: true }) public clickable = false

	/** Whether browser spellcheck is enabled. */
	@property({ type: Boolean, reflect: true })
	public spellcheck = false

	/**
	 * Text alignment within the input.
	 * - 'left' | 'center' | 'right'
	 */
	@property({ type: String, reflect: true })
	public align: 'left' | 'center' | 'right' = 'left'

	/** inputmode attribute (affects on-screen keyboards in mobile). */
	@property()
	public inputmode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'

	@property({ type: Number })
	public minlength?: number

	@property({ type: Number })
	public maxlength?: number

	@property()
	public min?: string

	@property()
	public max?: string

	@property({ type: Number, reflect: true })
	public step?: number

	/** If true, auto-focus this input on first render. */
	@property({ type: Boolean })
	public autofocus = false

	/** Autocomplete/autofill hints. */
	@property({ type: String })
	public autocomplete: AutoFill = 'off'

	/**
	 * tabIndex for focusing by tab key. Typically 0 or -1.
	 */
	@property({ type: Number, reflect: true })
	public tabIndex = 0

	/**
	 * A small hint text or error message to display under the input.
	 */
	@property()
	public hint?: string

	/**
	 * If true, we style the input as an error state, and possibly display
	 * the hint as an error message.
	 */
	@property({ type: Boolean, reflect: true })
	public error = false

	// ----------------------------
	//  B) Queries & Refs
	// ----------------------------
	@query('input') private inputElement!: HTMLInputElement
	private inputRef = createRef<HTMLInputElement>()

	// ----------------------------
	//  C) Form-associated logic
	// ----------------------------
	static formAssociated = true
	protected static shadowRootOptions = {
		...LitElement.shadowRootOptions,
		delegatesFocus: true, // so focus() goes to <input>
	}

	private internals?: ElementInternals

	constructor() {
		super()
		if ('attachInternals' in this) {
			try {
				this.internals = this.attachInternals()
			} catch {
				// no-op for older browsers / polyfills
				this.internals = undefined
			}
		}
	}

	/**
	 * If user did not provide an ID, auto-generate one so <label for="...">
	 * and various aria-* attributes can reference it.
	 */
	protected override willUpdate(changedProps: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
		if (!this.id) {
			this.id = `schmancy-input-${SchmancyInput._idCounter++}`
		}
		super.willUpdate(changedProps)
	}

	/** The form this element is associated with, if any. */
	get form() {
		return this.internals?.form ?? null
	}

	protected override updated(changedProps: Map<string, unknown>) {
		super.updated(changedProps)
		if (changedProps.has('value')) {
			// Reflect the current value to the form internals, so it’s submitted.
			this.internals?.setFormValue(this.value)
		}

		if (changedProps.has('error')) {
			// If we have an error state, we can set custom error validity, or none if resolved.
			if (this.error) {
				this.internals?.setValidity({ customError: true }, 'Invalid input', this.inputElement)
			} else {
				this.internals?.setValidity({})
			}
		}
	}

	/**
	 * Native form methods:
	 * - checkValidity()
	 * - reportValidity()
	 * - setCustomValidity()
	 */
	public checkValidity() {
		return this.inputRef.value?.checkValidity() ?? true
	}
	public reportValidity() {
		return this.inputRef.value?.reportValidity() ?? true
	}
	public setCustomValidity(message: string) {
		this.inputRef.value?.setCustomValidity(message)
	}

	// ----------------------------
	//  D) Lifecycle Hooks
	// ----------------------------
	firstUpdated() {
		// Autofocus if desired
		if (this.autofocus) {
			this.focus()
		}

		// 1) Subscribe to 'input' events (every keystroke)
		fromEvent<InputEvent>(this.inputElement, 'input')
			.pipe(
				map(ev => (ev.target as HTMLInputElement).value),
				distinctUntilChanged(),
				takeUntil(this.disconnecting),
			)
			.subscribe(value => {
				this.value = value
				// Fire custom 'input' event with details
				this.dispatchEvent(
					new CustomEvent<EventDetails>('input', {
						detail: { value },
						bubbles: true,
						composed: true,
					}),
				)
				// dispatch change event
				this.dispatchEvent(
					new CustomEvent<EventDetails>('change', {
						detail: { value },
						bubbles: true,
						composed: true,
					}),
				)
			})

		// 2) Subscribe to 'change' events (native behavior, usually on blur)
		fromEvent<Event>(this.inputElement, 'change')
			.pipe(
				map(ev => (ev.target as HTMLInputElement).value),
				distinctUntilChanged(),
				takeUntil(this.disconnecting),
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

		// 3) Emit a custom 'enter' event when user presses Enter
		fromEvent<KeyboardEvent>(this.inputElement, 'keyup')
			.pipe(
				filter(ev => ev.key === 'Enter'),
				takeUntil(this.disconnecting),
			)
			.subscribe(ev => {
				const { value } = ev.target as HTMLInputElement
				this.value = value
				this.dispatchEvent(
					new CustomEvent<EventDetails>('enter', {
						detail: { value },
						bubbles: true,
						composed: true,
					}),
				)
			})

		// 4) Detect autofill animation (Chrome, etc.)
		fromEvent<AnimationEvent>(this.inputElement, 'animationstart')
			.pipe(
				filter(ev => ev.animationName === 'onAutoFillStart'),
				takeUntil(this.disconnecting),
			)
			.subscribe(ev => {
				const { value } = ev.target as HTMLInputElement
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

	// ----------------------------
	//  E) Utility Methods
	// ----------------------------
	/** Selects all text within the input. */
	public select() {
		return this.inputRef.value?.select()
	}

	/** Returns the native validity state of the inner <input>. */
	public getValidity(): ValidityState | undefined {
		return this.inputRef.value?.validity
	}

	/**
	 * Override to forward focus to the internal <input>.
	 * Also dispatch a 'focus' event for external listeners.
	 */
	public override focus(options?: FocusOptions) {
		this.inputRef.value?.focus(options)
		this.dispatchEvent(new Event('focus'))
	}

	/**
	 * Override to forward clicks to the internal <input>.
	 * Also dispatch a 'click' event for external listeners.
	 */
	public override click() {
		this.inputRef.value?.click()
		this.dispatchEvent(new Event('click'))
	}

	/** Forward blur to the internal <input>. */
	public override blur() {
		this.inputRef.value?.blur()
		this.dispatchEvent(new Event('blur'))
	}

	// ----------------------------
	//  F) Rendering
	// ----------------------------
	protected override render() {
		const inputClasses = {
			'w-full flex-1 h-[50px] rounded-[8px] border-0 px-[8px] sm:px-[12px] md:px-[16px]': true,
			'outline-secondary-default focus:outline-1 ': true,
			'disabled:opacity-40 disabled:cursor-not-allowed': true,
			'placeholder:text-muted': true,
			'ring-0 ring-inset focus:ring-1 focus:ring-inset': true,
			// If not in error state, use standard ring color:
			'ring-secondary-default ring-outline focus:ring-secondary-default': !this.error,
			// Error ring override:
			'ring-error-default focus:ring-error-default': this.error,
			// If read-only but "clickable" is true, show pointer. Otherwise normal text cursor.
			'caret-transparent focus:outline-hidden cursor-pointer text-select-none': this.readonly,
			'cursor-pointer': this.clickable,
			// Alignment classes:
			'text-center': this.align === 'center',
			'text-right': this.align === 'right',
		}

		const labelClasses = {
			'opacity-40': this.disabled,
			'block mb-[4px]': true,
		}

		/**
		 * - If `this.label` is present, we render a proper `<label for="${this.id}">`.
		 * - If not, we add an aria-label to the <input> for better accessibility.
		 * - If there's a `hint`, we reference it via aria-describedby.
		 * - If there's an error, we set aria-invalid and could set aria-errormessage.
		 */
		return html`
			${when(
				this.label,
				() => html`
					<label
						for=${this.id}
						id="label-${this.id}"
						class=${classMap(labelClasses)}
						${color({
							color: this.error ? SchmancyTheme.sys.color.error.default : SchmancyTheme.sys.color.primary.default,
						})}
					>
						<schmancy-typography type="label" token="lg">${this.label}</schmancy-typography>
					</label>
				`,
			)}

			<form @submit=${(e: Event) => e.preventDefault()} .autocomplete=${this.autocomplete === 'off' ? 'off' : 'on'}>
				<input
					${color({
						bgColor: SchmancyTheme.sys.color.surface.highest,
						color: SchmancyTheme.sys.color.surface.on,
					})}
					${ref(this.inputRef)}
					id=${this.id}
					name=${this.name}
					class=${classMap(inputClasses)}
					.value=${this.value}
					.type=${this.type}
					.autocomplete=${this.autocomplete}
					.spellcheck=${this.spellcheck}
					placeholder=${this.placeholder}
					inputmode=${ifDefined(this.inputmode)}
					pattern=${ifDefined(this.pattern)}
					step=${ifDefined(this.step)}
					minlength=${ifDefined(this.minlength)}
					maxlength=${ifDefined(this.maxlength)}
					min=${ifDefined(this.min)}
					max=${ifDefined(this.max)}
					?required=${this.required}
					?disabled=${this.disabled}
					?readonly=${this.readonly}
					aria-invalid=${this.error ? 'true' : 'false'}
					aria-required=${this.required ? 'true' : 'false'}
					aria-labelledby=${this.label ? `label-${this.id}` : nothing}
					aria-describedby=${this.hint ? `hint-${this.id}` : nothing}
					aria-label=${ifDefined(!this.label ? this.placeholder || 'Input' : undefined)}
				/>
			</form>

			${when(
				this.hint,
				() => html`
					<div
						id="hint-${this.id}"
						class="pt-[4px]"
						${color({
							color: this.error ? SchmancyTheme.sys.color.error.default : SchmancyTheme.sys.color.primary.default,
						})}
					>
						<schmancy-typography align="left" type="body" token="sm"> ${this.hint} </schmancy-typography>
					</div>
				`,
			)}
		`
	}
}
