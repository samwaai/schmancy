import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'
import { $LitElement } from '@mixins/index'
import { color } from '@schmancy/directives'
import SchmancyOption from '@schmancy/option/option'
import { SchmancyTheme } from '@schmancy/theme/theme.interface'
import { css, html } from 'lit'
import { customElement, property, query, queryAssignedElements, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'

export type SchmancySelectChangeEvent = CustomEvent<{
	value: string | string[]
}>

@customElement('schmancy-select')
export class SchmancySelect extends $LitElement(css`
	:host {
		display: block;
		position: relative;
	}

	[role='listbox'] {
		/*  max-height: 25vh; */ /* Remove the fixed max-height */
		overflow-y: auto;
		outline: none;
	}
`) {
	// API
	@property({ type: String }) name: string | undefined
	@property({ type: Boolean }) required = false
	@property({ type: String }) placeholder = ''
	@property({ type: String }) value = '' // for single-select
	@property({ type: Array }) selectedValues: string[] = [] // for multi-select
	@property({ type: Boolean }) multi = false
	@property({ type: String }) label = ''

	// Internal states
	@state() private isOpen = false
	@state() private valueLabel = ''

	@query('ul') private ul!: HTMLUListElement
	@queryAssignedElements({ flatten: true }) private options!: SchmancyOption[]
	private cleanupPositioner?: () => void

	connectedCallback() {
		super.connectedCallback()
		if (!this.id) {
			this.id = `schmancy-select-${Math.random().toString(36).substr(2, 9)}`
		}
		this.addEventListener('keydown', this.handleKeyDown)
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this.removeEventListener('keydown', this.handleKeyDown)
		this.cleanupPositioner?.()
	}

	firstUpdated() {
		this.syncSelection()
		this.setupOptionsAccessibility()
	}

	private syncSelection() {
		if (this.multi) {
			this.selectedValues = this.options.filter(o => o.selected).map(o => o.value)
			this.valueLabel =
				this.selectedValues.length > 0
					? this.options
							.filter(o => this.selectedValues.includes(o.value))
							.map(o => o.label)
							.join(', ')
					: this.placeholder
		} else {
			const selectedOption = this.options.find(o => o.value === this.value)
			this.valueLabel = selectedOption?.label || this.placeholder
		}
	}

	private setupOptionsAccessibility() {
		this.options.forEach((option, index) => {
			option.setAttribute('role', 'option')
			if (!option.id) {
				option.id = `${this.id}-option-${index}`
			}
			option.tabIndex = -1
			option.setAttribute(
				'aria-selected',
				String(this.multi ? this.selectedValues.includes(option.value) : option.value === this.value),
			)
		})
	}

	private async positionDropdown() {
		const reference = this.renderRoot.querySelector('.trigger') as HTMLElement
		if (!reference || !this.ul) return

		// Get the available height
		const availableHeight = window.innerHeight - reference.getBoundingClientRect().bottom - 10 // 10px buffer
		this.ul.style.maxHeight = `${availableHeight}px` // Set max height

		this.cleanupPositioner = autoUpdate(reference, this.ul, async () => {
			const { x, y } = await computePosition(reference, this.ul, {
				placement: 'bottom-start',
				middleware: [offset(5), flip(), shift({ padding: 5 })],
			})

			Object.assign(this.ul.style, {
				left: `${x}px`,
				top: `${y}px`,
				position: 'absolute',
			})
		})
	}

	private handleKeyDown(e: KeyboardEvent) {
		if (!this.isOpen) {
			if (['Enter', ' ', 'ArrowDown'].includes(e.key)) {
				e.preventDefault()
				this.openDropdown()
			}
			return
		}

		const current = this.options.findIndex(o => o.matches(':focus')) ?? -1

		switch (e.key) {
			case 'Escape':
				this.closeDropdown()
				break
			case 'ArrowDown':
				e.preventDefault()
				this.focusOption(this.options, Math.min(current + 1, this.options.length - 1))
				break
			case 'ArrowUp':
				e.preventDefault()
				this.focusOption(this.options, Math.max(current - 1, 0))
				break
			case 'Enter':
			case ' ':
				e.preventDefault()
				if (current >= 0) this.handleOptionSelect(this.options[current].value)
				break
			case 'Tab':
				this.closeDropdown()
				break
		}
	}

	private focusOption(options: HTMLElement[], index: number) {
		const option = options[index]
		if (option) {
			option.focus()
			const combobox = this.renderRoot.querySelector('.trigger')
			combobox?.setAttribute('aria-activedescendant', option.id)
		}
	}

	private async openDropdown() {
		this.isOpen = true
		await this.updateComplete

		this.positionDropdown()
		this.setupOptionsAccessibility()

		const options = Array.from(this.ul.querySelectorAll('[role="option"]')) as HTMLElement[]
		const selectedIndex = this.multi ? 0 : options.findIndex(o => o.getAttribute('value') === this.value)
		this.focusOption(options, Math.max(selectedIndex, 0))
	}

	private closeDropdown() {
		this.isOpen = false
		this.cleanupPositioner?.()
		const combobox = this.renderRoot.querySelector<HTMLElement>('.trigger')
		combobox?.removeAttribute('aria-activedescendant')
		combobox?.focus()
	}

	private handleOptionSelect(value: string) {
		if (this.multi) {
			const option = this.options.find(o => o.value === value)
			if (!option) return

			option.selected = !option.selected
			if (option.selected) {
				this.selectedValues = [...this.selectedValues, value]
			} else {
				this.selectedValues = this.selectedValues.filter(v => v !== value)
			}

			this.valueLabel =
				this.selectedValues.length > 0
					? this.options
							.filter(o => this.selectedValues.includes(o.value))
							.map(o => o.label)
							.join(', ')
					: this.placeholder

			this.dispatchChange(this.selectedValues)
		} else {
			this.options.forEach(o => (o.selected = o.value === value))
			this.value = value
			this.valueLabel = this.options.find(o => o.value === value)?.label || this.placeholder
			this.dispatchChange(value)
			this.closeDropdown()
		}

		this.setupOptionsAccessibility()
	}

	private dispatchChange(value: string | string[]) {
		this.dispatchEvent(
			new CustomEvent<SchmancySelectChangeEvent['detail']>('change', {
				detail: { value },
				bubbles: true,
				composed: true,
			}),
		)
	}

	render() {
		return html`
			<div class="relative">
				<schmancy-input
					.name=${this.name}
					tabIndex="0"
					class="trigger"
					role="combobox"
					aria-haspopup="listbox"
					aria-expanded=${this.isOpen}
					aria-controls="options"
					aria-autocomplete="none"
					aria-required=${this.required}
					.label=${this.label}
					.placeholder=${this.placeholder}
					.value=${this.valueLabel}
					.required=${this.required}
					readonly
					@click=${() => (this.isOpen ? this.closeDropdown() : this.openDropdown())}
				></schmancy-input>

				<div
					id="overlay"
					class="fixed inset-0"
					?hidden=${!this.isOpen}
					@click=${this.closeDropdown}
					tabindex="-1"
					aria-hidden="true"
				></div>

				<ul
					id="options"
					role="listbox"
					aria-multiselectable=${this.multi}
					class=${classMap({
						'absolute z-[1000] mt-1 w-full rounded-md shadow-sm': true,
						hidden: !this.isOpen,
					})}
					${color({ bgColor: SchmancyTheme.sys.color.surface.container })}
					@click=${(e: Event) => {
						const customEvt = e as CustomEvent
						const detailVal = customEvt.detail?.value
						if (detailVal) {
							this.handleOptionSelect(detailVal)
						}
					}}
				>
					<slot
						@slotchange=${() => {
							this.syncSelection()
							this.setupOptionsAccessibility()
						}}
					></slot>
				</ul>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-select': SchmancySelect
	}
}
