import { html, LitElement, nothing, PropertyValueMap } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { when } from 'lit/directives/when.js'
import { distinctUntilChanged, filter, fromEvent, map, takeUntil } from 'rxjs'

import { SchmancyFormField } from '@mixins/index'

// color directive + theme interface
import { color } from '@schmancy/directives'
import { SchmancyTheme } from '@schmancy/theme/theme.interface'
import style from './input.scss?inline'

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
export type SchmancyInputInputEventV2 = CustomEvent<EventDetails>
export type SchmancyInputChangeEventV2 = CustomEvent<EventDetails>
export type SchmancyInputEnterEventV2 = CustomEvent<EventDetails>

/**
 * Size variants for the input.
 * - sm: Small, compact input (40px height)
 * - md: Medium input (50px height, default)
 * - lg: Large, spacious input (60px height)
 */
export type InputSize = 'sm' | 'md' | 'lg'

/**
 * Enhanced version of the SchmancyInput component with improved form integration
 * and compatibility with legacy API.
 *
 * This component uses the native form association API and maintains parity with
 * native input behaviors while providing a stylish, accessible interface.
 */
@customElement('schmancy-input')
export default class SchmancyInput extends SchmancyFormField(style) {
	// ----------------------------
	//  A) Public properties
	// ----------------------------

	/** Auto-incrementing counter for generating unique IDs */
	static _idCounter = 0

	/** Override value to be string only for input element */
	@property({ type: String, reflect: true })
	public override value = ''


	/**
	 * The type of input. (e.g. 'text', 'password', 'email', etc.)
	 */
	@property({ reflect: true })
	public type: HTMLInputElement['type'] = 'text'


	@property()
	public placeholder = ''


	/** Pattern validation attribute. */
	@property({ type: String, reflect: true })
	public pattern?: string


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

	@property({ type: Number, reflect: true })
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
	@property({ type: String, reflect: true })
	public autocomplete: AutoFill = 'on'

	/**
	 * tabIndex for focusing by tab key. Typically 0 or -1.
	 */
	@property({ type: Number, reflect: true })
	public override tabIndex = 0


	/**
	 * The size of the input.
	 * - 'sm': Small, compact size
	 * - 'md': Medium size (default)
	 * - 'lg': Large size
	 */
	@property({ type: String, reflect: true })
	public size: InputSize = 'md'

	/**
	 * Controls when validation should show.
	 * - 'always' - Always show validation
	 * - 'touched' - Only show after field has been focused and then blurred
	 * - 'dirty' - Only show after value has changed
	 * - 'submitted' - Only show after form submission
	 */
	@property({ type: String })
	public validateOn: 'always' | 'touched' | 'dirty' | 'submitted' = 'touched'

	/**
	 * For datalist support
	 */
	@property({ type: String })
	public list?: string


	// ----------------------------
	//  B) Queries & Refs
	// ----------------------------
	@query('input') private inputElement!: HTMLInputElement
	private inputRef = createRef<HTMLInputElement>()

	// ----------------------------
	//  C) Internal States
	// ----------------------------

	/**
	 * For integration with browser's autofill support
	 */
	@state()
	private isAutofilled = false

	/**
	 * Track user interaction state for validation
	 */
	@state()
	private touched = false

	@state()
	private dirty = false

	@state()
	private submitted = false

	/**
	 * Store the default value for reset behavior
	 */
	@state()
	private defaultValue = ''

	// ----------------------------
	//  D) Form-associated logic
	// ----------------------------
	protected static shadowRootOptions = {
		...LitElement.shadowRootOptions,
		delegatesFocus: true, // so focus() goes to <input>
	}

	private formResetObserver?: MutationObserver

	/**
	 * If user did not provide an ID, auto-generate one so <label for="...">
	 * and various aria-* attributes can reference it.
	 */
	protected override willUpdate(changedProps: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
		if (!this.id) {
			this.id = `sch-input-${SchmancyInput._idCounter++}`
		}
		super.willUpdate(changedProps)
	}


	protected override updated(changedProps: Map<string, unknown>) {
		super.updated(changedProps)

		// Handle value changes
		if (changedProps.has('value')) {
			// If value changes from original default, mark as dirty
			if (this.value !== this.defaultValue) {
				this.dirty = true
			}

			// Update validation state when value changes
			this.validateInput()
		}

		// Store default value if this is the first update
		if (!this.hasUpdated && changedProps.has('value')) {
			this.defaultValue = this.value
		}
	}

	/**
	 * Connect to the closest form element and set up form integration
	 */
	connectedCallback() {
		super.connectedCallback()

		// Store initial default value for form reset
		this.defaultValue = this.value

		// Set up form integration
		this.setupFormIntegration()

		// Setup for external label association
		this.setupExternalLabelAssociation()
	}

	/**
	 * Set up form integration with ElementInternals
	 */
	private setupFormIntegration() {
		if (this.form) {
			// Listen for form reset events
			this.formResetObserver = new MutationObserver(mutations => {
				for (const mutation of mutations) {
					if (mutation.type === 'attributes' && mutation.attributeName === 'reset') {
						this.resetToDefault()
					}
				}
			})

			// Observe the form for reset events
			this.formResetObserver.observe(this.form, {
				attributes: true,
				childList: false,
				subtree: false,
			})

			// Also directly listen for the reset event
			this.form.addEventListener('reset', () => {
				this.resetToDefault()
			})

			// Listen for form submit events to mark field as submitted
			this.form.addEventListener('submit', () => {
				this.submitted = true
				// Validate on form submission
				this.validateInput(true)
			})
		}
	}

	/**
	 * Set up external label association for native HTML label support
	 */
	private setupExternalLabelAssociation() {
		if (this.id) {
			const setupLabelClickListener = () => {
				const labels = document.querySelectorAll(`label[for="${this.id}"]`)
				labels.forEach(label => {
					label.addEventListener('click', () => {
						this.focus()
					})
				})
			}

			// Initialize after DOM is ready
			if (document.readyState === 'complete') {
				setupLabelClickListener()
			} else {
				document.addEventListener('DOMContentLoaded', setupLabelClickListener)
			}
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback()

		// Clean up the form observer
		if (this.formResetObserver) {
			this.formResetObserver.disconnect()
		}

		// Clean up external label click listeners
		if (this.id) {
			const labels = document.querySelectorAll(`label[for="${this.id}"]`)
			labels.forEach(label => {
				label.removeEventListener('click', () => {
					this.focus()
				})
			})
		}
	}

	/**
	 * Reset the input to its default state
	 */
	private resetToDefault() {
		this.value = this.defaultValue
		this.touched = false
		this.dirty = false
		this.submitted = false
		this.error = false
		this.validationMessage = ''
		this.dispatchEvent(new CustomEvent('reset', { bubbles: true }))
	}

	/**
	 * Determines if validation errors should be shown based on current state
	 * and validation strategy
	 */
	private shouldShowValidation(forceValidation = false): boolean {
		if (forceValidation) return true

		switch (this.validateOn) {
			case 'always':
				return true
			case 'touched':
				return this.touched
			case 'dirty':
				return this.dirty
			case 'submitted':
				return this.submitted
			default:
				return this.touched
		}
	}


	/**
	 * Validate input based on required, pattern, etc.
	 * This mimics native validation behavior
	 */
	private validateInput(forceValidation = false) {
		// Skip validation for disabled inputs
		if (this.disabled) return

		// Only show validation errors if we should based on the validation strategy
		const shouldValidate = this.shouldShowValidation(forceValidation)

		// Get validity state from internal input if available
		const validity: ValidityState = this.inputElement?.validity ?? {
			badInput: false,
			customError: false,
			patternMismatch: false,
			rangeOverflow: false,
			rangeUnderflow: false,
			stepMismatch: false,
			tooLong: false,
			tooShort: false,
			typeMismatch: false,
			valid: true,
			valueMissing: false,
		}

		// Check if the input has an actual validation error (not a custom error)
		const hasError = !validity.valid && !validity.customError

		if (shouldValidate && hasError) {
			// There's an error and we should show it
			this.error = true
			this.validationMessage = this.inputElement?.validationMessage || ''
		} else if (validity.valid) {
			// Input is valid, so clear the error state
			this.error = false

			// Only clear validation message if there's no custom error
			if (!validity.customError) {
				this.validationMessage = ''
			}
		} else if (!shouldValidate) {
			// We shouldn't show validation yet, so clear visual error state
			this.error = false
		}

		// The mixin will handle updating internals based on error state
	}

	/**
	 * Check validity without showing validation UI
	 */
	public override checkValidity() {
		// Check internal input first
		const inputValid = this.inputRef.value?.checkValidity() ?? true

		// Call parent implementation for basic validation
		const parentValid = super.checkValidity()

		return inputValid && parentValid
	}

	/**
	 * Show validation UI and check validity
	 */
	public override reportValidity() {
		// Mark as touched and submitted to show validation
		this.touched = true
		this.submitted = true

		// First check using native input
		const inputValid = this.inputRef.value?.reportValidity() ?? true

		// Update our component's validation state with force=true
		this.validateInput(true)

		// Call parent implementation
		const parentValid = super.reportValidity()

		return inputValid && parentValid
	}

	/**
	 * Set a custom validation error message
	 */
	public override setCustomValidity(message: string) {
		// Set on the native input
		if (this.inputRef.value) {
			this.inputRef.value.setCustomValidity(message)
		}

		// Call parent implementation
		super.setCustomValidity(message)
		
		// Update error state based on validation strategy
		this.error = message !== '' && this.shouldShowValidation()
	}

	// ----------------------------
	//  E) Lifecycle Hooks & Event Handlers
	// ----------------------------
	firstUpdated() {
		// Autofocus if desired
		if (this.autofocus) {
			// Use setTimeout to match browser behavior - autofocus happens after initial rendering
			setTimeout(() => {
				this.focus()
			}, 0)
		}

		// Subscribe to input events
		this.setupInputEvents()
		this.setupFocusBlurEvents()
		this.setupAutofillDetection()
		this.setupEnterKeyEvents()
	}

	/**
	 * Set up input event handling for value changes
	 */
	private setupInputEvents() {
		fromEvent<InputEvent>(this.inputElement, 'input')
			.pipe(
				map(ev => {
					// Capture all input event properties for complete event forwarding
					const inputEvent = ev as InputEvent
					const target = ev.target as HTMLInputElement
					return {
						value: target.value,
						inputType: inputEvent.inputType,
						data: inputEvent.data,
						isComposing: inputEvent.isComposing,
						originalEvent: ev,
					}
				}),
				takeUntil(this.disconnecting),
			)
			.subscribe(eventData => {
				// Update component value
				this.value = eventData.value

				// Mark as dirty when user types
				this.dirty = this.value !== this.defaultValue

				// Fire custom 'input' event with extended details
				const customEvent = new CustomEvent<EventDetails>('input', {
					detail: { value: eventData.value },
					bubbles: true,
					composed: true,
				})

				// Add additional properties to match native events more closely
				Object.defineProperties(customEvent, {
					inputType: { value: eventData.inputType },
					data: { value: eventData.data },
					isComposing: { value: eventData.isComposing },
				})

				this.dispatchEvent(customEvent)

				// REMOVED: Duplicate change event dispatch that was here
				// Run validation like native inputs do on input, but respect the validation strategy
				this.validateInput()
			})

		// Subscribe to native change events (usually on blur)
		fromEvent<Event>(this.inputElement, 'change')
			.pipe(
				map(ev => (ev.target as HTMLInputElement).value),
				distinctUntilChanged(),
				takeUntil(this.disconnecting),
			)
			.subscribe(value => {
				this.value = value
				this.dirty = this.value !== this.defaultValue

				// Fire regular change event using mixin helper
				this.emitChange({ value })

				// Run validation on change like native inputs
				this.validateInput()
			})
	}

	/**
	 * Set up focus/blur event handling
	 */
	private setupFocusBlurEvents() {
		fromEvent<FocusEvent>(this.inputElement, 'focus')
			.pipe(takeUntil(this.disconnecting))
			.subscribe(ev => {
				// Create a custom focus event that includes standard props
				const focusEvent = new CustomEvent('focus', {
					bubbles: ev.bubbles,
					cancelable: ev.cancelable,
					composed: ev.composed,
				})

				// Add focus-specific properties
				Object.defineProperties(focusEvent, {
					relatedTarget: { value: ev.relatedTarget },
				})

				this.dispatchEvent(focusEvent)
			})

		fromEvent<FocusEvent>(this.inputElement, 'blur')
			.pipe(takeUntil(this.disconnecting))
			.subscribe(ev => {
				// Mark as touched when field loses focus
				this.touched = true

				// Run validation on blur like native inputs, respecting validation strategy
				if (!this.disabled) {
					this.validateInput()
				}

				// Create a custom blur event that includes standard props
				const blurEvent = new CustomEvent('blur', {
					bubbles: ev.bubbles,
					cancelable: ev.cancelable,
					composed: ev.composed,
				})

				// Add blur-specific properties
				Object.defineProperties(blurEvent, {
					relatedTarget: { value: ev.relatedTarget },
				})

				this.dispatchEvent(blurEvent)
			})
	}

	/**
	 * Set up autofill detection
	 */
	private setupAutofillDetection() {
		// Detect autofill animation (Chrome, etc.)
		fromEvent<AnimationEvent>(this.inputElement, 'animationstart')
			.pipe(
				filter(ev => ev.animationName === 'onAutoFillStart'),
				takeUntil(this.disconnecting),
			)
			.subscribe(ev => {
				const { value } = ev.target as HTMLInputElement
				this.value = value
				this.isAutofilled = true
				this.dirty = this.value !== this.defaultValue

				// Dispatch autofill event for integration with autofill systems
				this.dispatchEvent(
					new CustomEvent('autofill', {
						detail: { value },
						bubbles: true,
						composed: true,
					}),
				)

				// Also propagate as a change event like browsers do
				this.emitChange({ value })
			})

		// Detect end of autofill (Chrome)
		fromEvent<AnimationEvent>(this.inputElement, 'animationstart')
			.pipe(
				filter(ev => ev.animationName === 'onAutoFillCancel'),
				takeUntil(this.disconnecting),
			)
			.subscribe(() => {
				this.isAutofilled = false
			})
	}

	/**
	 * Set up enter key event handling
	 */
	private setupEnterKeyEvents() {
		// Emit a custom 'enter' event when user presses Enter
		fromEvent<KeyboardEvent>(this.inputElement, 'keyup')
			.pipe(
				filter(ev => ev.key === 'Enter'),
				takeUntil(this.disconnecting),
			)
			.subscribe(ev => {
				const { value } = ev.target as HTMLInputElement
				this.value = value
				this.dirty = this.value !== this.defaultValue

				// Dispatch enhanced enter event
				const enterEvent = new CustomEvent<EventDetails>('enter', {
					detail: { value },
					bubbles: true,
					composed: true,
				})

				// Add extra keyboard event props
				Object.defineProperties(enterEvent, {
					key: { value: 'Enter' },
					code: { value: 'Enter' },
					keyCode: { value: 13 },
					which: { value: 13 },
				})

				this.dispatchEvent(enterEvent)
			})
	}

	// ----------------------------
	//  F) Utility Methods
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
	 * Sets the selection range. Mirrors native input.setSelectionRange
	 */
	public setSelectionRange(start: number, end: number, direction?: 'forward' | 'backward' | 'none') {
		this.inputRef.value?.setSelectionRange(start, end, direction)
	}

	/**
	 * Returns the selected text within the input (start position)
	 */
	public get selectionStart(): number | null {
		return this.inputRef.value?.selectionStart ?? null
	}

	/**
	 * Returns the selected text within the input (end position)
	 */
	public get selectionEnd(): number | null {
		return this.inputRef.value?.selectionEnd ?? null
	}

	/**
	 * Returns the direction of selection
	 */
	public get selectionDirection(): 'forward' | 'backward' | 'none' | null {
		return this.inputRef.value?.selectionDirection ?? null
	}

	/**
	 * Sets the range of text to be selected.
	 */
	public setRangeText(
		replacement: string,
		start?: number,
		end?: number,
		selectMode?: 'select' | 'start' | 'end' | 'preserve',
	) {
		if (start !== undefined && end !== undefined) {
			this.inputRef.value?.setRangeText(replacement, start, end, selectMode)
		} else {
			this.inputRef.value?.setRangeText(replacement)
		}
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
	//  G) Rendering
	// ----------------------------
	protected override render() {
		// Determine height and padding based on size
		const getHeightAndPadding = () => {
			switch (this.size) {
				case 'sm':
					return {
						height: '40px',
						padding: '0 8px',
						fontSize: '0.875rem', // 14px
					}
				case 'lg':
					return {
						height: '60px',
						padding: '0 20px',
						fontSize: '1.125rem', // 18px
					}
				case 'md':
				default:
					return {
						height: '50px',
						padding: '0 16px',
						fontSize: '1rem', // 16px
					}
			}
		}

		const { height, padding, fontSize } = getHeightAndPadding()

		const inputClasses = {
			'w-full flex-1 rounded-[8px] border-0 bg-surface-highest text-surface-on': true,
			'outline-secondary-default focus:outline-1 ': true,
			'outline-secondary-default focus:outline-1': true,
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
			// Autofill class
			autofilled: this.isAutofilled,
		}

		const labelClasses = {
			'opacity-40': this.disabled,
			'block mb-[4px]': true,
			'text-sm': this.size === 'sm',
			'text-base': this.size === 'md',
			'text-lg': this.size === 'lg',
		}

		const styles = {
			height,
			padding,
			fontSize,
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
						class=${this.classMap(labelClasses)}
						${color({
							color: this.error ? SchmancyTheme.sys.color.error.default : SchmancyTheme.sys.color.primary.default,
						})}
					>
						<schmancy-typography type="label" token=${this.size === 'sm' ? 'sm' : this.size === 'lg' ? 'lg' : 'md'}>
							${this.label}
						</schmancy-typography>
					</label>
				`,
			)}

			<input
				${color({
					bgColor: SchmancyTheme.sys.color.surface.highest,
					color: SchmancyTheme.sys.color.surface.on,
				})}
				${ref(this.inputRef)}
				id=${this.id}
				name=${this.name}
				class=${this.classMap(inputClasses)}
				style=${this.styleMap(styles)}
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
				list=${ifDefined(this.list)}
				?required=${this.required}
				?disabled=${this.disabled}
				?readonly=${this.readonly}
				aria-invalid=${this.error ? 'true' : 'false'}
				aria-required=${this.required ? 'true' : 'false'}
				aria-labelledby=${this.label ? `label-${this.id}` : nothing}
				aria-describedby=${this.hint ? `hint-${this.id}` : nothing}
				aria-label=${ifDefined(!this.label ? this.placeholder || 'Input' : undefined)}
				aria-autocomplete=${this.list ? 'list' : 'none'}
			/>

			${when(
				this.hint,
				() => html`
					<div
						id="hint-${this.id}"
						class="${this.size === 'sm'
							? 'pt-[1px] text-xs'
							: this.size === 'lg'
								? 'pt-[3px] text-base'
								: 'pt-[2px] text-sm'}"
						${color({
							color: this.error ? SchmancyTheme.sys.color.error.default : SchmancyTheme.sys.color.primary.default,
						})}
					>
						<schmancy-typography
							align="left"
							type="label"
							token=${this.size === 'sm' ? 'sm' : this.size === 'lg' ? 'lg' : 'md'}
						>
							${this.hint}
						</schmancy-typography>
					</div>
				`,
			)}
		`
	}
}
