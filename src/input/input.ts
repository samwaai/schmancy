import { html, LitElement, nothing, unsafeCSS } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { when } from 'lit/directives/when.js'
import { distinctUntilChanged, filter, fromEvent, map, takeUntil, timer } from 'rxjs'

import { SchmancyFormField } from '@mixins/index'

// Import styles
import style from './input.scss?inline'

// If you want to be form-associated, define the type on `ElementInternals`.
declare global {
	interface HTMLElementTagNameMap {
		'schmancy-input': SchmancyInput
		'sch-input': SchmancyInput
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

/**
 * Size variants for the input - M3 spec aligned.
 * - xxs: Ultra-compact (24dp) - for menu cards, compact UIs
 * - xs: Dense/compact (32dp) - M3 density -3
 * - sm: Default (40dp) - M3 density 0
 * - md: Standard (48dp) - M3 large
 * - lg: Extra large (56dp) - M3 extra large
 */
export type InputSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg'

/**
 * Enhanced version of the SchmancyInput component with improved form integration
 * and compatibility with legacy API.
 *
 * This component uses the native form association API and maintains parity with
 * native input behaviors while providing a stylish, accessible interface.
 *
 * @prop {string} name - Name attribute for form submission (inherited from FormFieldMixin)
 * @prop {string} label - Label text for the form field (inherited from FormFieldMixin)
 * @prop {boolean} required - Whether the field is required (inherited from FormFieldMixin)
 * @prop {boolean} disabled - Whether the field is disabled (inherited from FormFieldMixin)
 * @prop {boolean} readonly - Whether the field is read-only (inherited from FormFieldMixin)
 * @prop {boolean} error - Whether the field is in an error state (inherited from FormFieldMixin)
 * @prop {string} validationMessage - The validation message to display (inherited from FormFieldMixin)
 * @prop {string} hint - Optional hint text to display below the field (inherited from FormFieldMixin)
 */
@customElement('schmancy-input')
export default class SchmancyInput extends SchmancyFormField(unsafeCSS(style)) {
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

	@property({ reflect: true })
	public step?: string = 'any'

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
	 * - 'xxs': Ultra-compact size (24px) - for menu cards
	 * - 'xs': Extra small, very compact size (32px)
	 * - 'sm': Small, compact size (40px)
	 * - 'md': Medium size (default) (48px)
	 * - 'lg': Large size (56px)
	 */
	@property({ type: String, reflect: true })
	public size: InputSize = 'md'

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

	// `touched`, `dirty`, `submitted`, and `validateOn` come from FormFieldMixin.
	// `_defaultValue` (mixin) replaces the old `defaultValue` field.

	// ----------------------------
	//  D) Form-associated logic
	// ----------------------------
	protected static shadowRootOptions = {
		...LitElement.shadowRootOptions,
		delegatesFocus: true, // so focus() goes to <input>
	}

	/**
	 * If user did not provide an ID, auto-generate one so <label for="...">
	 * and various aria-* attributes can reference it.
	 */
	protected override willUpdate(changedProps: Map<PropertyKey, unknown>) {
		if (!this.id) {
			this.id = `sch-input-${SchmancyInput._idCounter++}`
		}
		super.willUpdate(changedProps as never)
	}


	// `updated()` removed — FormFieldMixin's `willUpdate` recomputes `dirty`,
	// triggers `checkValidity()` when `_shouldShowError()` is true, and updates
	// `:state(dirty)` automatically.
	//
	// Default value capture is also handled by the mixin (`firstUpdated` sets
	// `_defaultValue` from `value`).

	connectedCallback() {
		super.connectedCallback()

		// Form reset and submit are now handled by the mixin via FACE callbacks
		// (`formResetCallback`) and by `<schmancy-form>`'s submit sweep
		// (`markSubmitted()`). No manual form listeners needed.
		this.setupExternalLabelAssociation()
	}

	/**
	 * Set up external label association for native HTML label support
	 */
	private setupExternalLabelAssociation() {
		if (this.id) {
			const setupLabelClickListener = () => {
				const labels = document.querySelectorAll(`label[for="${this.id}"]`)
				labels.forEach(label => {
					// Use RxJS for label click events
					fromEvent(label, 'click')
						.pipe(takeUntil(this.disconnecting))
						.subscribe(() => {
							this.focus()
						})
				})
			}

			// Initialize after DOM is ready
			if (document.readyState === 'complete') {
				setupLabelClickListener()
			} else {
				// Use RxJS for DOMContentLoaded event
				fromEvent(document, 'DOMContentLoaded')
					.pipe(takeUntil(this.disconnecting))
					.subscribe(setupLabelClickListener)
			}
		}
	}

	// `disconnectedCallback`, `resetToDefault`, `shouldShowValidation`, and
	// `validateInput` are gone — the mixin's `willUpdate` runs `checkValidity()`
	// at the right moments (Phase 2/3/4 of the validation contract) and
	// `formResetCallback` → `resetForm()` handles reset.

	/**
	 * Check validity. Folds in the inner native input's structured
	 * `ValidityState` flags (`typeMismatch`, `patternMismatch`, `tooShort`,
	 * `tooLong`, `rangeUnderflow`, `rangeOverflow`, `stepMismatch`, `badInput`)
	 * via `internals.setValidity` so consumers can target specific flags via
	 * `field.validity.<flag>` and `:state(value-missing|type-mismatch|…)`.
	 *
	 * The visual `error` flag is still gated by the mixin's `_shouldShowError()`.
	 */
	/**
	 * Re-run checkValidity AFTER render so the native inner input's `.value`
	 * binding has propagated. The mixin's willUpdate fires checkValidity too
	 * early — at that point native.validity still reflects the previous value.
	 */
	protected override updated(changedProps: Map<PropertyKey, unknown>) {
		super.updated?.(changedProps)
		if (
			changedProps.has('value') ||
			changedProps.has('required') ||
			changedProps.has('type') ||
			changedProps.has('pattern') ||
			changedProps.has('min') ||
			changedProps.has('max') ||
			changedProps.has('minlength') ||
			changedProps.has('maxlength')
		) {
			this.checkValidity()
		}
	}

	/**
	 * Pick the first matching `errorMessages` override for the failing flags.
	 * Order matches the natural priority of validity flags (valueMissing
	 * before more specific ones — empty trumps malformed).
	 */
	private _firstMatchingErrorMessage(v: ValidityState): string | undefined {
		const m = this.errorMessages
		if (!m) return undefined
		if (v.valueMissing && m.valueMissing) return m.valueMissing
		if (v.typeMismatch && m.typeMismatch) return m.typeMismatch
		if (v.patternMismatch && m.patternMismatch) return m.patternMismatch
		if (v.tooShort && m.tooShort) return m.tooShort
		if (v.tooLong && m.tooLong) return m.tooLong
		if (v.rangeUnderflow && m.rangeUnderflow) return m.rangeUnderflow
		if (v.rangeOverflow && m.rangeOverflow) return m.rangeOverflow
		if (v.stepMismatch && m.stepMismatch) return m.stepMismatch
		if (v.badInput && m.badInput) return m.badInput
		return undefined
	}

	public override checkValidity() {
		// Prefer @query (always live) over @ref (may lag during initial paint).
		const native = this.inputElement ?? this.inputRef.value
		const v = native?.validity
		if (v && !v.valid) {
			// Surface the native flags. valueMissing also surfaces here when
			// `required` + empty — overrides the mixin's coarse check.
			const flags: ValidityStateFlags = {
				valueMissing: v.valueMissing || undefined,
				typeMismatch: v.typeMismatch || undefined,
				patternMismatch: v.patternMismatch || undefined,
				tooShort: v.tooShort || undefined,
				tooLong: v.tooLong || undefined,
				rangeUnderflow: v.rangeUnderflow || undefined,
				rangeOverflow: v.rangeOverflow || undefined,
				stepMismatch: v.stepMismatch || undefined,
				badInput: v.badInput || undefined,
				customError: v.customError || undefined,
			}
			// errorMessages override: pick the first matching flag and use the
			// consumer-provided copy. Falls back to the native browser message.
			const overrideMessage = this._firstMatchingErrorMessage(v)
			this.internals?.setValidity(
				flags,
				overrideMessage || native.validationMessage || this.validationMessage || 'Invalid value',
			)
			if (this._shouldShowError()) {
				this.error = true
				// Always reflect the current flag's message — previous
				// validationMessage may be stale (different flag).
				const newMessage = overrideMessage || native.validationMessage
				if (newMessage) this.validationMessage = newMessage
				// Mirror flags into :state() so CSS can target specifics.
				for (const flag of [
					'value-missing',
					'type-mismatch',
					'pattern-mismatch',
					'too-short',
					'too-long',
					'range-underflow',
					'range-overflow',
					'step-mismatch',
					'bad-input',
				]) {
					this.internals?.states.delete(flag)
				}
				if (v.valueMissing) this.internals?.states.add('value-missing')
				if (v.typeMismatch) this.internals?.states.add('type-mismatch')
				if (v.patternMismatch) this.internals?.states.add('pattern-mismatch')
				if (v.tooShort) this.internals?.states.add('too-short')
				if (v.tooLong) this.internals?.states.add('too-long')
				if (v.rangeUnderflow) this.internals?.states.add('range-underflow')
				if (v.rangeOverflow) this.internals?.states.add('range-overflow')
				if (v.stepMismatch) this.internals?.states.add('step-mismatch')
				if (v.badInput) this.internals?.states.add('bad-input')
			}
			return false
		}

		// Native says valid — but the mixin's `required` check might still
		// fire (mixin checks `value === ''` directly, native may treat empty
		// differently for type=email/url with no value).
		const parentValid = super.checkValidity()
		if (parentValid) {
			// Clear specific-flag :state() entries.
			for (const flag of [
				'value-missing',
				'type-mismatch',
				'pattern-mismatch',
				'too-short',
				'too-long',
				'range-underflow',
				'range-overflow',
				'step-mismatch',
				'bad-input',
			]) {
				this.internals?.states.delete(flag)
			}
		}
		return parentValid
	}

	/**
	 * Show validation UI and check validity.
	 * Marks the field as submitted so the mixin's gate flips to "always show."
	 */
	public override reportValidity() {
		this.markSubmitted()
		const inputValid = this.inputRef.value?.reportValidity() ?? true
		const parentValid = super.reportValidity()
		return inputValid && parentValid
	}

	/** Set a custom validation error on both the inner input and the mixin. */
	public override setCustomValidity(message: string) {
		if (this.inputRef.value) {
			this.inputRef.value.setCustomValidity(message)
		}
		super.setCustomValidity(message)
	}

	// ----------------------------
	//  E) Lifecycle Hooks & Event Handlers
	// ----------------------------
	firstUpdated() {
		// Autofocus if desired
		if (this.autofocus) {
			// Schedule focus after initial render — RxJS timer for cancel-on-disconnect.
			timer(0)
				.pipe(takeUntil(this.disconnecting))
				.subscribe(() => this.focus())
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
					// Stop native event from bubbling - we'll dispatch our own custom event
					ev.stopPropagation()

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

				// `dirty` is a getter on the mixin (value vs _defaultValue) — no manual set.

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

				// Mixin's willUpdate runs checkValidity() on value-change when
				// _shouldShowError() is true — no manual validateInput() call.
			})

		// Subscribe to native change events (usually on blur)
		fromEvent<Event>(this.inputElement, 'change')
			.pipe(
				map(ev => {
					// Stop native event from bubbling - we'll dispatch our own custom event
					ev.stopPropagation()
					return (ev.target as HTMLInputElement).value
				}),
				distinctUntilChanged(),
				takeUntil(this.disconnecting),
			)
			.subscribe(value => {
				this.value = value
				this.emitChange({ value })
				// Validation runs automatically via mixin's willUpdate.
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
				// Mark as touched on blur — mixin's willUpdate handles the rest
				// (validates if dirty, broadcasts :state(touched), etc.).
				this.markTouched()

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
				// `dirty` is a getter on the mixin — recomputes from value vs _defaultValue.

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
		// Listen for Enter on keydown
		fromEvent<KeyboardEvent>(this.inputElement, 'keydown')
			.pipe(
				filter(ev => ev.key === 'Enter'),
				takeUntil(this.disconnecting),
			)
			.subscribe(ev => {
				const { value } = ev.target as HTMLInputElement
				
				// Update value if changed (mixin recomputes dirty automatically)
				if (this.value !== value) {
					this.value = value
				}
				
				// Blur the input to trigger change event naturally
				// This mimics what happens when you tab out of the field
				this.inputElement.blur()

				// Dispatch enhanced enter event
				const enterEvent = new CustomEvent<EventDetails>('enter', {
					detail: { value: this.value },
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
		// Determine height and padding based on size - M3 spec aligned
		const getHeightAndPadding = () => {
			switch (this.size) {
				case 'xxs':
					// Ultra-compact: 24dp height
					return {
						height: '24px',
						padding: '0 8px',
						fontSize: '0.625rem', // 10px
					}
				case 'xs':
					// M3 dense: 32dp height
					return {
						height: '32px',
						padding: '0 12px',
						fontSize: '0.75rem', // 12px
					}
				case 'sm':
					// M3 default: 40dp height
					return {
						height: '40px',
						padding: '0 16px',
						fontSize: '0.875rem', // 14px - M3 body-large
					}
				case 'lg':
					// M3 extra large: 56dp height
					return {
						height: '56px',
						padding: '0 20px',
						fontSize: '1rem', // 16px
					}
				case 'md':
				default:
					// M3 standard: 48dp height
					return {
						height: '48px',
						padding: '0 16px',
						fontSize: '0.875rem', // 14px - M3 body-large
					}
			}
		}

		const { height, padding, fontSize } = getHeightAndPadding()

		// Check if it's a date-type input
		const isDateType = ['date', 'datetime-local', 'time', 'month', 'week'].includes(this.type)

		const inputClasses = {
			// Base styles - outlined rounded input
			'block w-full min-w-0 rounded-2xl border bg-surface-containerLowest text-surface-on': true,
			// Border color
			'border-outline': !this.error,
			'border-error-default': this.error,
			// Focus styles
			'outline-secondary-default focus:outline-1 focus:border-secondary-default': true,
			// Disabled styles
			'disabled:opacity-40 disabled:cursor-not-allowed': true,
			// Placeholder
			'placeholder:text-muted': true,
			// Ring styles (subtle focus ring)
			'ring-0 focus:ring-1 focus:ring-inset': true,
			// Ring colors based on error state
			'focus:ring-secondary-default': !this.error,
			'focus:ring-error-default': this.error,
			// Readonly styles
			'caret-transparent focus:outline-hidden cursor-pointer select-none': this.readonly,
			'cursor-pointer': this.clickable,
			// Text alignment (date inputs always left-aligned)
			'text-left': this.align === 'left' || isDateType,
			'text-center': this.align === 'center' && !isDateType,
			'text-right': this.align === 'right' && !isDateType,
			// Autofill
			autofilled: this.isAutofilled,
		}

		const labelClasses = {
			'block mb-1 font-medium': true,
			'opacity-40': this.disabled,
			'text-[10px]': this.size === 'xxs',
			'text-xs': this.size === 'xs',
			'text-sm': this.size === 'sm',
			'text-base': this.size === 'md',
			'text-lg': this.size === 'lg',
			'text-primary-default': !this.error,
			'text-error-default': this.error,
		}

		const styles = {
			height,
			padding,
			fontSize,
			// Ensure vertical centering for all input types
			lineHeight: height,
		}

		/**
		 * - If `this.label` is present, we render a proper `<label for="${this.id}">`.
		 * - If not, we add an aria-label to the <input> for better accessibility.
		 * - If there's a `hint`, we reference it via aria-describedby.
		 * - If there's an error, we set aria-invalid and could set aria-errormessage.
		 */
		return html`
			<div class="w-full min-w-0 ${isDateType ? 'date-input-container' : ''}">
				${when(
					this.label,
					() => html`
						<label
							for=${this.id}
							class=${this.classMap(labelClasses)}
						>
							${this.label}
						</label>
					`,
				)}

				<input
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
					.step=${this.step ?? ''}
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
					aria-describedby=${this.hint || this.validationMessage ? `hint-${this.id}` : nothing}
					aria-label=${ifDefined(!this.label ? this.placeholder || 'Input' : undefined)}
				/>

				${when(
					this.hint || (this.error && this.validationMessage),
					() => html`
						<div
							id="hint-${this.id}"
							class="mt-1 text-sm ${this.error ? 'text-error-default' : 'text-surface-onVariant'}"
							role=${ifDefined(this.error ? 'alert' : undefined)}
						>
							${this.error && this.validationMessage ? this.validationMessage : this.hint}
						</div>
					`,
				)}
			</div>
		`
	}
}

/**
 * Register the component with the legacy tag name for backward compatibility
 * @prop {string} label - Label text for the form field (inherited from FormFieldMixin)
 * @prop {boolean} required - Whether the field is required (inherited from FormFieldMixin)
 * @prop {boolean} disabled - Whether the field is disabled (inherited from FormFieldMixin)
 * @prop {boolean} readonly - Whether the field is read-only (inherited from FormFieldMixin)
 * @prop {boolean} error - Whether the field is in an error state (inherited from FormFieldMixin)
 * @prop {string} validationMessage - The validation message to display (inherited from FormFieldMixin)
 * @prop {string} hint - Optional hint text to display below the field (inherited from FormFieldMixin)
 */
@customElement('sch-input')
export class SchmancyInputCompat extends SchmancyInput {}
