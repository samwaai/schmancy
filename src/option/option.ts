import { TailwindElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

export type SchmancyOptionChangeEvent = CustomEvent<{
	value: string
	label: string
}>

@customElement('schmancy-option')
export default class SchmancyOption extends TailwindElement() {
	@property({ type: String, reflect: true }) value: string = ''
	@property({ type: String, reflect: true }) label: string | undefined
	@property({ type: Boolean }) selected: boolean = false

	private handleOptionClick() {
		this.dispatchEvent(
			new CustomEvent<SchmancyOptionChangeEvent['detail']>('click', {
				detail: {
					value: this.value,
					label: this.label ?? this.textContent?.trim() ?? '',
				},
				bubbles: true,
				composed: true,
			}),
		)
	}

	// override focus method to focus the native element
	focus() {
		this.shadowRoot?.querySelector('li')?.focus()
	}

	protected render() {
		// Apply highlight styles if `this.selected` is true
		const classes = {
			'outline-secondary-default focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2':
				true,
			'font-semibold relative cursor-pointer py-2 px-3': true,
			'bg-secondary-container text-secondery-onContainer': this.selected,
		}
		const stateLayerClasses = {
			'duration-500 transition-opacity': true,
			'hover:bg-surface-on opacity-[0.08] cursor-pointer absolute inset-0': true,
		}

		return html`
			<li
				tabindex="0"
				class="${this.classMap(classes)}"
				role="option"
				@click=${(e: MouseEvent) => {
					e.stopPropagation()
					e.preventDefault()
					this.handleOptionClick()
				}}
				@keydown=${(e: KeyboardEvent) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.stopPropagation()
						e.preventDefault()
						this.handleOptionClick()
					}
				}}
			>
				<div class="${this.classMap(stateLayerClasses)}"></div>
				<schmancy-flex class="text-start" align="center" justify="between" flow="row">
					<slot class="self-start"></slot>
					<slot name="support">
						<span></span>
					</slot>
				</schmancy-flex>
			</li>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-option': SchmancyOption
	}
}
