import { TailwindElement } from '@mixins/tailwind.mixin'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { fromEvent } from 'rxjs'
import { filter, tap, takeUntil } from 'rxjs/operators'

// Material Design 3 typography - https://m3.material.io/styles/typography/type-scale-tokens

/**
 * @element schmancy-typography
 * @slot - The text for the typography.
 */
@customElement('schmancy-typography')
export class SchmancyTypography extends TailwindElement(css`
	:host {
		display: block;
		font-family: inherit;
		hyphens: none;
	}

	/* Text alignment */
	:host([align='center']) {
		text-align: center;
	}

	:host([align='left']) {
		text-align: start;
	}

	:host([align='right']) {
		text-align: right;
	}

	:host([align='justify']) {
		text-align: justify;
	}

	/* Font weight */
	:host([weight='bold']) {
		font-weight: 700;
	}

	:host([weight='medium']) {
		font-weight: 500;
	}

	:host([weight='normal']) {
		font-weight: 400;
	}

	/* Text transform */
	:host([transform='uppercase']) {
		text-transform: uppercase;
	}

	:host([transform='lowercase']) {
		text-transform: lowercase;
	}

	:host([transform='capitalize']) {
		text-transform: capitalize;
	}

	:host([transform='normal']) {
		text-transform: none;
	}

	/* Type-based weight defaults (when using Tailwind classes without token) */
	:host([type='display']),
	:host([type='headline']),
	:host([type='body']) {
		font-weight: 400;
	}

	:host([type='label']),
	:host([type='subtitle']),
	:host([type='title']) {
		font-weight: 500;
	}

	/* Display typography variants - Material Design 3 + Extended */
	:host([type='display'][token='xl']) {
		font-size: 72px;
		line-height: 80px;
		font-weight: 400;
	}

	:host([type='display'][token='lg']) {
		font-size: 57px;
		line-height: 64px;
		font-weight: 400;
	}

	:host([type='display'][token='md']) {
		font-size: 45px;
		line-height: 52px;
		font-weight: 400;
	}

	:host([type='display'][token='sm']) {
		font-size: 36px;
		line-height: 44px;
		font-weight: 400;
	}

	:host([type='display'][token='xs']) {
		font-size: 28px;
		line-height: 36px;
		font-weight: 400;
	}

	/* Headline typography variants - Material Design 3 + Extended */
	:host([type='headline'][token='xl']) {
		font-size: 36px;
		line-height: 44px;
		font-weight: 400;
	}

	:host([type='headline'][token='lg']) {
		font-size: 32px;
		line-height: 40px;
		font-weight: 400;
	}

	:host([type='headline'][token='md']) {
		font-size: 28px;
		line-height: 36px;
		font-weight: 400;
	}

	:host([type='headline'][token='sm']) {
		font-size: 24px;
		line-height: 32px;
		font-weight: 400;
	}

	:host([type='headline'][token='xs']) {
		font-size: 20px;
		line-height: 28px;
		font-weight: 400;
	}

	/* Title typography variants - Material Design 3 + Extended */
	:host([type='title'][token='xl']) {
		font-size: 24px;
		line-height: 32px;
		font-weight: 400;
	}

	:host([type='title'][token='lg']) {
		font-size: 22px;
		line-height: 28px;
		font-weight: 400;
	}

	:host([type='title'][token='md']) {
		font-size: 16px;
		line-height: 24px;
		font-weight: 500;
	}

	:host([type='title'][token='sm']) {
		font-size: 14px;
		line-height: 20px;
		font-weight: 500;
	}

	:host([type='title'][token='xs']) {
		font-size: 12px;
		line-height: 16px;
		font-weight: 500;
	}

	/* Subtitle typography variants - Extended from Material Design 3 */
	:host([type='subtitle'][token='xl']) {
		font-size: 20px;
		line-height: 28px;
		font-weight: 500;
	}

	:host([type='subtitle'][token='lg']) {
		font-size: 18px;
		line-height: 24px;
		font-weight: 500;
	}

	:host([type='subtitle'][token='md']) {
		font-size: 16px;
		line-height: 24px;
		font-weight: 500;
	}

	:host([type='subtitle'][token='sm']) {
		font-size: 14px;
		line-height: 20px;
		font-weight: 500;
	}

	:host([type='subtitle'][token='xs']) {
		font-size: 12px;
		line-height: 16px;
		font-weight: 500;
	}

	/* Body typography variants - Material Design 3 + Extended */
	:host([type='body'][token='xl']) {
		font-size: 18px;
		line-height: 28px;
		font-weight: 400;
	}

	:host([type='body'][token='lg']) {
		font-size: 16px;
		line-height: 24px;
		font-weight: 400;
	}

	:host([type='body'][token='md']) {
		font-size: 14px;
		line-height: 20px;
		font-weight: 400;
	}

	:host([type='body'][token='sm']) {
		font-size: 12px;
		line-height: 16px;
		font-weight: 400;
	}

	:host([type='body'][token='xs']) {
		font-size: 10px;
		line-height: 14px;
		font-weight: 400;
	}

	/* Label typography variants - Material Design 3 + Extended */
	:host([type='label'][token='xl']) {
		font-size: 16px;
		line-height: 22px;
		font-weight: 500;
	}

	:host([type='label'][token='lg']) {
		font-size: 14px;
		line-height: 20px;
		font-weight: 500;
	}

	:host([type='label'][token='md']) {
		font-size: 12px;
		line-height: 16px;
		font-weight: 500;
	}

	:host([type='label'][token='sm']) {
		font-size: 11px;
		line-height: 16px;
		font-weight: 500;
	}

	:host([type='label'][token='xs']) {
		font-size: 10px;
		line-height: 14px;
		font-weight: 500;
	}

	/* Note: Custom letter-spacing, font-size, and line-height should be applied via inline styles or Tailwind classes */

	:host([editable]) {
		cursor: text;
		border-radius: 4px;
		transition: background 150ms;
		min-height: 1em;
	}
	/* Editable div lives in shadow DOM so light DOM (Lit markers) is untouched */
	.edit {
		outline: none;
		min-height: 1em;
		font: inherit;
		color: inherit;
		letter-spacing: inherit;
		line-height: inherit;
	}
	.edit:empty::before {
		content: attr(data-placeholder);
		pointer-events: none;
		display: block;
		opacity: 0.35;
	}
`) {
	static shadowRootOptions: ShadowRootInit = {
		mode: 'open',
		delegatesFocus: true,
	}

	/**
	 * @attr type - The type of the typography.
	 * @default 'body'
	 * @type {'display' | 'headline' | 'title' | 'subtitle' | 'body' | 'label'}
	 */
	@property({ type: String, reflect: true })
	type: 'display' | 'headline' | 'title' | 'subtitle' | 'body' | 'label' = 'body'

	/**
	 * @attr token - The size token.
	 * @deprecated Prefer using Tailwind responsive text classes for better responsive design.
	 * Set token="" and use class="text-sm md:text-base lg:text-lg" instead.
	 * Example: <schmancy-typography type="display" token="" class="text-2xl sm:text-3xl md:text-4xl">
	 * @default 'md'
	 * @type {'xs' | 'sm' | 'md' | 'lg' | 'xl' | ''}
	 */
	@property({ type: String, reflect: true })
	token: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '' = 'md'

	/**
	 * @attr
	 * @default inherit
	 * @type {'left' |'center' |'right'}
	 */
	@property({ type: String, reflect: true })
	align: 'left' | 'center' | 'justify' | 'right' | undefined

	/**
	 * @attr
	 * @default inherit
	 * @type {'normal' | 'medium' |'bold'}
	 * @public
	 */
	@property({ type: String, reflect: true })
	weight: 'normal' | 'medium' | 'bold' | undefined
	
	/**
	 *
	 * @attr
	 * @default inherit
	 * @type {'uppercase' |'lowercase' |'capitalize' |'normal'}
	 * @public
	 */
	@property({ type: String, reflect: true }) 
	transform: 'uppercase' | 'lowercase' | 'capitalize' | 'normal' | undefined

	@property({ type: Number })
	maxLines: 1 | 2 | 3 | 4 | 5 | 6 | undefined

	/** When true, the element becomes contenteditable and dispatches 'change' events on blur/Enter */
	@property({ type: Boolean, reflect: true }) editable = false
	/** The text value when in editable mode. Set via property binding: .value=${...} */
	@property({ type: String }) value = ''
	/** Placeholder shown when editable and empty */
	@property({ type: String }) placeholder = ''

	private _editRef = createRef<HTMLDivElement>()

	/** Focus and select all text in editable mode */
	selectAll() {
		const el = this._editRef.value
		if (!el) return
		el.focus()
		const sel = window.getSelection()
		if (sel && el.textContent) {
			const range = document.createRange()
			range.selectNodeContents(el)
			sel.removeAllRanges()
			sel.addRange(range)
		}
	}

	connectedCallback() {
		super.connectedCallback()

		fromEvent<FocusEvent>(this, 'focusout').pipe(
			filter(() => this.editable),
			tap(() => {
				const el = this._editRef.value
				if (!el) return
				const newValue = el.innerText.trim()
				if (newValue !== this.value) {
					this.dispatchEvent(new CustomEvent('change', {
						detail: { value: newValue },
						bubbles: true,
						composed: true,
					}))
				}
				// Ensure truly empty so :empty CSS placeholder works
				if (!newValue) el.textContent = ''
			}),
			takeUntil(this.disconnecting),
		).subscribe()

		// Clean stray <br> / whitespace nodes so :empty CSS matches
		fromEvent(this, 'input').pipe(
			filter(() => this.editable),
			tap(() => {
				const el = this._editRef.value
				if (el && !el.innerText.trim()) el.textContent = ''
			}),
			takeUntil(this.disconnecting),
		).subscribe()

		fromEvent<KeyboardEvent>(this, 'keydown').pipe(
			filter(() => this.editable),
			filter(e => e.key === 'Enter'),
			tap(e => { e.preventDefault(); (this._editRef.value ?? this).blur() }),
			takeUntil(this.disconnecting),
		).subscribe()
	}

	protected updated(changedProperties: Map<string, unknown>): void {
		super.updated(changedProperties)
		if (changedProperties.has('maxLines')) {
			// Remove all line-clamp classes
			this.classList.remove('line-clamp-1', 'line-clamp-2', 'line-clamp-3', 'line-clamp-4', 'line-clamp-5', 'line-clamp-6')
			// Add the appropriate one
			if (this.maxLines) {
				this.classList.add(`line-clamp-${this.maxLines}`)
			}
		}
		if ((changedProperties.has('value') || changedProperties.has('editable')) && this.editable) {
			const el = this._editRef.value
			if (el && document.activeElement !== el) {
				if (this.value) {
					el.innerText = this.value
				} else {
					el.textContent = ''
				}
			}
		}
	}

	protected render(): unknown {
		if (this.editable) {
			return html`<div
				${ref(this._editRef)}
				class="edit"
				contenteditable="true"
				data-placeholder=${this.placeholder ?? ''}
			></div>`
		}
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-typography': SchmancyTypography
	}
}