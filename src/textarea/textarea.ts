import { color } from '@schmancy/directives'
import { SchmancyTheme } from '@schmancy/theme/theme.interface'
import { LitElement, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { when } from 'lit/directives/when.js'
import { distinctUntilChanged, filter, fromEvent, map } from 'rxjs'
import style from './textarea.scss?inline'
import { TailwindElement } from '@mixins/index'
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
	 * @attr rows
	 * @type {number}
	 * @default 2
	 * @public
	 */
	@property({ type: Number }) rows = 2

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
		fromEvent(this.textareaElement, 'input')
			.pipe(
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
			})
		fromEvent(this.textareaElement, 'change')
			.pipe(
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
			textarea.style.height = 'auto'
			textarea.style.height = textarea.scrollHeight + 'px'
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
		const classes = {
			'w-full rounded-[8px] border-0 px-[16px] py-[8px]': true,
			'disabled:opacity-40 disabled:cursor-not-allowed': true,
			'placeholder:text-muted': true,
			'ring-0 ring-inset focus:ring-1 focus:ring-inset': true,
			'ring-primary-default ring-outline focus:ring-primary-default': !this.error,
			'ring-error-default focus:ring-error-default': this.error,
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
				() =>
					html`<label
						${color({
							color: this.error ? SchmancyTheme.sys.color.error.default : SchmancyTheme.sys.color.primary.default,
						})}
						class="${this.classMap(labelClasses)}"
						for=${this.id}
					>
						<schmancy-typography type="label" token="lg">${this.label}</schmancy-typography>
					</label>`,
			)}

			<schmancy-typography type="body" token="lg">
				<textarea
					${color({
						bgColor: SchmancyTheme.sys.color.surface.highest,
						color: SchmancyTheme.sys.color.surface.on,
					})}
					${ref(this.textareaRef)}
					.value=${this.value}
					.id=${this.id}
					.name=${this.name}
					.placeholder=${this.placeholder}
					.required=${this.required}
					class=${this.classMap(classes)}
					.disabled=${this.disabled}
					minlength=${ifDefined(this.minlength)}
					maxlength=${ifDefined(this.maxlength)}
					.readonly=${this.readonly}
					.spellcheck=${this.spellcheck}
					cols=${ifDefined(this.cols)}
					rows=${ifDefined(this.rows)}
					wrap=${ifDefined(this.wrap)}
					dirname=${ifDefined(this.dirname)}
				></textarea>
			</schmancy-typography>
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

type EventDetails = {
	value: string
}

export type SchmancyTextareaChangeEvent = CustomEvent<EventDetails>

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-textarea': SchmancyTextarea
	}
}
