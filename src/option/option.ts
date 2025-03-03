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
	@property({ type: String, reflect: true, attribute: 'label' }) label: string | undefined
	@property({ type: Boolean }) selected: boolean = false

	// Add a method to update the label with slot content
	private updateLabelFromSlot() {
		if (!this.label) {
			const slotContent = this.getSlotContent()
			if (slotContent) {
				this.label = slotContent
			}
		}
	}

	// Connect to lifecycle to update label when element is connected
	connectedCallback() {
		super.connectedCallback?.()
		this.updateLabelFromSlot()
	}

	// Listen for slot changes to update label
	firstUpdated() {
		const slot = this.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement
		if (slot) {
			slot.addEventListener('slotchange', () => {
				this.updateLabelFromSlot()
			})
		}
	}

	private handleOptionClick() {
		// Update label from slot if not set
		this.updateLabelFromSlot()

		this.dispatchEvent(
			new CustomEvent<SchmancyOptionChangeEvent['detail']>('click', {
				detail: {
					value: this.value,
					label: this.label ?? '',
				},
				bubbles: true,
				composed: true,
			}),
		)
	}

	// Get content from the default slot
	private getSlotContent(): string {
		const slot = this.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement
		if (!slot) return ''

		const assignedNodes = slot.assignedNodes()
		if (assignedNodes.length === 0) return ''

		// Combine the text content of all assigned nodes
		return assignedNodes
			.map(node => node.textContent?.trim() || '')
			.join(' ')
			.trim()
	}

	// override focus method to focus the native element
	focus() {
		this.shadowRoot?.querySelector('li')?.focus()
	}

	protected render() {
		// Apply highlight styles if `this.selected` is true
		const classes = {
			'outline-secondary-default focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 rounded-md focus-visible:outline-secondary-default':
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
				<sch-flex class="text-start" align="center" justify="between" flow="row">
					<slot class="self-start" @slotchange=${() => this.updateLabelFromSlot()}></slot>
					<slot name="support">
						<span></span>
					</slot>
				</sch-flex>
			</li>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-option': SchmancyOption
	}
}
