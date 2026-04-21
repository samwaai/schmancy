import { LitElement, html, nothing } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { when } from 'lit/directives/when.js'
import { distinctUntilChanged, filter, fromEvent, map } from 'rxjs'
import style from './textarea.scss?inline'
import { TailwindElement } from '@mixins/index'

/**
 * Textarea component with auto-resize and form integration.
 *
 * @prop {string} name - Name attribute for form submission
 * @prop {string} value - Current value of the textarea
 * @prop {string} placeholder - Placeholder text
 * @prop {boolean} required - Whether the field is required
 * @prop {boolean} disabled - Whether the field is disabled
 * @prop {boolean} readonly - Whether the field is read-only
 * @prop {number} rows - Number of visible text rows
 * @prop {number} maxlength - Maximum character length
 */
@customElement('schmancy-textarea')
export default class SchmancyTextarea extends TailwindElement(style) {
	protected static shadowRootOptions = {
		...LitElement.shadowRootOptions,
		delegatesFocus: true,
	}
	static formAssociated = true
	// private internals
	internals: ElementInternals | undefined
	textareaRef = createRef<HTMLTextAreaElement>()

	private readonly _a11yId = `schmancy-textarea-${Math.random().toString(36).slice(2, 10)}`

	/**
	 * The label of the control.
	 * @attr
	 * @type {string} label
	 * @default ''
	 * @public
	 */
	@property() label = ''

	/**
	 * The name of the control.
	 * @attr name
	 * @type {string} name
	 * @default 'name_' + Date.now()
	 * @public
	 */
	@property() name = 'name_' + Date.now()

	/**
	 * The placeholder of the control.
	 * @attr placeholder
	 * @type {string}
	 * @default ''
	 * @public
	 */
	@property() placeholder = ''

	/**
	 * The value of the control.
	 * @attr {string} value - The value of the control.
	 * @type {string}
	 * @default ''
	 * @public
	 */
	@property({ type: String, reflect: true }) public value = ''

	/**
	 * The minlength attribute of the control.
	 * @attr
	 */
	@property({ type: Number })
	public minlength: number | undefined

	/**
	 * The maxlength attribute of the control.
	 * @attr
	 */
	@property({ type: Number })
	public maxlength!: number

	/**
	 * The number of columns (width) of the control.
	 * @attr cols
	 * @type {number}
	 * @default 20
	 * @public
	 */
	@property({ type: Number }) cols = 20

	/**
	 * The number of rows (height) of the control.
	 * When not set, the textarea auto-sizes to fit its content via field-sizing: content.
	 * @attr rows
	 * @type {number}
	 * @default undefined
	 * @public
	 */
	@property({ type: Number }) rows: number | undefined

	/**
	 * Makes the textarea fill the height of its container.
	 * @attr fillHeight
	 * @type {boolean}
	 * @default false
	 * @public
	 */
	@property({ type: Boolean, reflect: true }) fillHeight = false

	/**
	 * Automatically adjusts height based on content.
	 * @attr autoHeight
	 * @type {boolean}
	 * @default true
	 * @public
	 */
	@property({ type: Boolean }) autoHeight = true

	/**
	 * Controls whether the textarea can be resized by the user.
	 * @attr resize
	 * @type {'none' | 'vertical' | 'horizontal' | 'both'}
	 * @default 'vertical'
	 * @public
	 */
	@property({ type: String, reflect: true }) resize: 'none' | 'vertical' | 'horizontal' | 'both' = 'vertical'

	/**
	 * Specifies how the text in a text area is to be wrapped when submitted in a form.
	 * @attr wrap
	 * @type {'hard' | 'soft'}
	 * @default 'soft'
	 * @public
	 */
	@property({ type: String }) wrap: 'hard' | 'soft' = 'soft'

	/**
	 * The dirname attribute of the control.
	 * @attr dirname
	 * @type {string}
	 * @default undefined
	 * @public
	 */
	@property({ type: String }) dirname: string | undefined

	@property({ type: Boolean, reflect: true }) required = false
	@property({ type: Boolean, reflect: true }) disabled = false
	@property({ type: Boolean, reflect: true }) readonly = false
	@property({ type: Boolean, reflect: true }) spellcheck = false

	@property({ type: String, reflect: true }) align: 'left' | 'center' | 'right' = 'left'

	/**
	 * The autofocus attribute of the control.
	 * @attr
	 * @type {boolean}
	 * @default false
	 * @public
	 */
	@property({ type: Boolean })
	public override autofocus!: boolean

	@property({ type: Number })
	public override tabIndex = 0

	@query('textarea') textareaElement!: HTMLTextAreaElement

	@property() hint: string | undefined

	@property({ type: Boolean, reflect: true }) public error = false

	constructor() {
		super()
		try {
			this.internals = this.attachInternals()
		} catch {
			this.internals = undefined
		}
	}

	firstUpdated() {
		if (this.autofocus) {
			this.focus()
		}
		if (this.autoHeight) {
			// Initial adjustment for pre-filled content
			setTimeout(() => this.adjustHeight(), 0)
		}
		fromEvent(this.textareaElement, 'input')
			.pipe(
				map(event => (event.target as HTMLTextAreaElement).value),
				distinctUntilChanged(),
			)
			.subscribe(value => {
				this.value = value
				if (this.autoHeight) {
					this.adjustHeight()
				}
				this.dispatchEvent(
					new CustomEvent<EventDetails>('change', {
						detail: { value },
						bubbles: true,
						composed: true,
					}),
				)
			})
		fromEvent(this.textareaElement, 'change')
			.pipe(
				map(event => (event.target as HTMLTextAreaElement).value),
				distinctUntilChanged(),
			)
			.subscribe(value => {
				this.value = value
				if (this.autoHeight) {
					this.adjustHeight()
				}
				this.dispatchEvent(
					new CustomEvent<EventDetails>('change', {
						detail: { value },
						bubbles: true,
						composed: true,
					}),
				)
			})
		// emit on enter
		fromEvent<KeyboardEvent>(this.textareaElement, 'keyup')
			.pipe(
				filter(event => event.key === 'Enter'),
				map(event => (event.target as HTMLTextAreaElement).value),
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
				this.dispatchEvent(
					new CustomEvent<EventDetails>('enter', {
						detail: { value },
						bubbles: true,
						composed: true,
					}),
				)
			})
	}

	get form() {
		return this.internals?.form
	}

	/** Checks for validity of the control and shows the browser message if it's invalid. */
	public reportValidity() {
		return this.textareaRef.value?.reportValidity()
	}

	/** Checks for validity of the control and emits the invalid event if it invalid. */
	public checkValidity() {
		return this.textareaRef.value?.checkValidity()
	}

	/** Sets a custom validity message. */
	public setCustomValidity(message: string) {
		return this.textareaRef.value?.setCustomValidity(message)
	}

	/** Selects all text within the textarea. */
	public select() {
		return this.textareaRef.value?.select()
	}

	/** Sets the selection range. */
	public setSelectionRange(start: number, end: number, direction?: 'forward' | 'backward' | 'none') {
		this.textareaRef.value?.setSelectionRange(start, end, direction)
	}

	/** Returns the selected text within the textarea. */
	public get selectionStart(): number | null {
		return this.textareaRef.value?.selectionStart ?? null
	}

	public get selectionEnd(): number | null {
		return this.textareaRef.value?.selectionEnd ?? null
	}

	public get selectionDirection(): 'forward' | 'backward' | 'none' | null {
		return this.textareaRef.value?.selectionDirection ?? null
	}

	/** Sets the range of text to be selected. */
	public setRangeText(replacement: string) {
		this.textareaRef.value?.setRangeText(replacement)
	}

	/** Adjusts the height of the textarea based on its content. */
	public adjustHeight() {
		const textarea = this.textareaRef.value
		if (textarea) {
			// Only grow, never shrink
			const currentHeight = textarea.offsetHeight
			const scrollHeight = textarea.scrollHeight
			if (scrollHeight > currentHeight) {
				textarea.style.height = scrollHeight + 'px'
			}
		}
	}

	public validity(): ValidityState | undefined {
		return this.textareaRef.value?.validity
	}

	public override focus(
		options: FocusOptions = {
			preventScroll: true,
		},
	) {
		this.textareaRef.value?.focus(options)
		this.dispatchEvent(new Event('focus'))
	}

	public override click() {
		this.textareaRef.value?.click()
		this.dispatchEvent(new Event('click'))
	}

	public override blur() {
		this.textareaRef.value?.blur()
		this.dispatchEvent(new Event('blur'))
	}

	protected render(): unknown {
		const textareaClasses = {
			// Base styles - matching input component
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
			'focus:ring-secondary-default': !this.error,
			'focus:ring-error-default': this.error,
			// Readonly styles
			'caret-transparent focus:outline-hidden cursor-pointer select-none': this.readonly,
			// Text alignment
			'text-left': this.align === 'left',
			'text-center': this.align === 'center',
			'text-right': this.align === 'right',
			// Textarea specific
			'h-full': this.fillHeight,
			'resize-none': this.resize === 'none',
			'resize-y': this.resize === 'vertical',
			'resize-x': this.resize === 'horizontal',
			'resize': this.resize === 'both',
			// Padding matching input
			'px-4 py-3': true,
		}
		const fieldSizing = this.rows == null ? 'field-sizing: content;' : ''
		const labelClasses = {
			'block mb-1 font-medium text-sm': true,
			'opacity-40': this.disabled,
			'text-primary-default': !this.error,
			'text-error-default': this.error,
		}
		const containerClasses = {
			'w-full min-w-0': true,
			'flex flex-col h-full': this.fillHeight,
		}
		const hintId = `${this._a11yId}-hint`
		return html`
		<div class="${this.classMap(containerClasses)}">
			${when(
				this.label,
				() => html`
					<label class="${this.classMap(labelClasses)}" for=${this.id}>
						${this.label}
					</label>
				`,
			)}

			<textarea
				${ref(this.textareaRef)}
				.value=${this.value}
				.id=${this.id}
				.name=${this.name}
				.placeholder=${this.placeholder}
				.required=${this.required}
				class=${this.classMap(textareaClasses)}
				style=${fieldSizing}
				.disabled=${this.disabled}
				minlength=${ifDefined(this.minlength)}
				maxlength=${ifDefined(this.maxlength)}
				.readonly=${this.readonly}
				.spellcheck=${this.spellcheck}
				cols=${ifDefined(this.cols)}
				rows=${ifDefined(this.rows)}
				wrap=${ifDefined(this.wrap)}
				dirname=${ifDefined(this.dirname)}
				aria-invalid=${this.error ? 'true' : 'false'}
				aria-required=${this.required ? 'true' : 'false'}
				aria-describedby=${this.hint ? hintId : nothing}
				aria-label=${!this.label && this.placeholder ? this.placeholder : nothing}
			></textarea>

			${when(
				this.hint,
				() => html`
					<div id=${hintId} class="mt-1 text-sm ${this.error ? 'text-error-default' : 'text-surface-onVariant'}">
						${this.hint}
					</div>
				`,
			)}
		</div>
		`
	}
}

type EventDetails = {
	value: string
}

export type SchmancyTextareaChangeEvent = CustomEvent<EventDetails>

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-textarea': SchmancyTextarea
	}
}
