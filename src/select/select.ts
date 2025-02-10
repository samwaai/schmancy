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
		max-height: 25vh;
		overflow-y: auto;
		outline: none;
	}
`) {
	// API
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
		this.addEventListener('keydown', this.handleKeyDown)
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this.removeEventListener('keydown', this.handleKeyDown)
		this.cleanupPositioner?.()
	}

	firstUpdated() {
		// Initial sync
		this.syncSelection()
		this.setupOptionsAccessibility()
	}

	/**
	 * Whenever new <schmancy-option> children get slotted in,
	 * or whenever properties change, ensure the correct .selected states
	 * and display text are applied.
	 */
	private syncSelection() {
		if (this.multi) {
			// For multi-select, figure out what's already marked selected in the DOM
			this.selectedValues = this.options.filter(o => o.selected).map(o => o.value)
			this.valueLabel =
				this.selectedValues.length > 0
					? this.options
							.filter(o => this.selectedValues.includes(o.value))
							.map(o => o.label)
							.join(', ')
					: this.placeholder
		} else {
			// Single
			const selectedOption = this.options.find(o => o.value === this.value)
			this.valueLabel = selectedOption?.label || this.placeholder
		}
	}

	/**
	 * We can also set up any ARIA attributes here.
	 * Note that we’re toggling `aria-selected` for screen readers,
	 * but the highlight in CSS is triggered by the option’s `selected` property.
	 */
	private setupOptionsAccessibility() {
		this.options.forEach(option => {
			option.setAttribute('role', 'option')
			option.tabIndex = -1
			option.setAttribute(
				'aria-selected',
				String(this.multi ? this.selectedValues.includes(option.value) : option.value === this.value),
			)
		})
	}

	/**
	 * Use @floating-ui/dom to position the <ul> under the "trigger" input.
	 */
	private async positionDropdown() {
		const reference = this.renderRoot.querySelector('.trigger') as HTMLElement
		if (!reference || !this.ul) return

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

	/**
	 * Keydown logic for opening/closing the dropdown and navigating options.
	 */
	private handleKeyDown(e: KeyboardEvent) {
		// If dropdown is closed, certain keys will open it:
		if (!this.isOpen) {
			if (['Enter', ' ', 'ArrowDown'].includes(e.key)) {
				e.preventDefault()
				this.openDropdown()
			}
			return
		}

		// If open, handle arrow up/down, enter, escape, etc.
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
		options[index]?.focus()
	}

	private async openDropdown() {
		this.isOpen = true
		await this.updateComplete // Wait for lit to render

		this.positionDropdown()
		this.setupOptionsAccessibility()

		// Optionally focus the currently selected item:
		const options = Array.from(this.ul.querySelectorAll('[role="option"]')) as HTMLElement[]
		const selectedIndex = this.multi ? 0 : options.findIndex(o => o.getAttribute('value') === this.value)
		this.focusOption(options, Math.max(selectedIndex, 0))
	}

	private closeDropdown() {
		this.isOpen = false
		this.cleanupPositioner?.()
		this.cleanupPositioner = undefined
		// Return focus to the trigger (optional):
		this.renderRoot.querySelector<HTMLButtonElement>('.trigger')?.focus()
	}

	/**
	 * Main method for toggling or setting selected items.
	 */
	private handleOptionSelect(value: string) {
		if (this.multi) {
			// Multi-select: Toggle the .selected property on the clicked option
			const option = this.options.find(o => o.value === value)
			if (!option) return

			option.selected = !option.selected
			// Rebuild selectedValues
			if (option.selected) {
				this.selectedValues = [...this.selectedValues, value]
			} else {
				this.selectedValues = this.selectedValues.filter(v => v !== value)
			}

			// Update the visible label
			this.valueLabel =
				this.selectedValues.length > 0
					? this.options
							.filter(o => this.selectedValues.includes(o.value))
							.map(o => o.label)
							.join(', ')
					: this.placeholder

			// Dispatch "change" event
			this.dispatchChange(this.selectedValues)
		} else {
			// Single select: unselect all, select the clicked one
			this.options.forEach(o => (o.selected = o.value === value))
			this.value = value
			this.valueLabel = this.options.find(o => o.value === value)?.label || this.placeholder
			this.dispatchChange(value)
			// Close after selecting
			this.closeDropdown()
		}

		// Also update aria-selected for accessibility
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
				<!-- Some trigger (schmancy-input) -->
				<schmancy-input
					class="trigger"
					role="combobox"
					aria-haspopup="listbox"
					aria-expanded=${this.isOpen}
					aria-controls="options"
					.label=${this.label}
					.placeholder=${this.placeholder}
					.value=${this.valueLabel}
					readonly
					@click=${() => (this.isOpen ? this.closeDropdown() : this.openDropdown())}
				></schmancy-input>

				<!-- Transparent overlay to close dropdown by clicking outside -->
				<div
					id="overlay"
					class="fixed inset-0"
					?hidden=${!this.isOpen}
					@click=${this.closeDropdown}
					tabindex="-1"
				></div>

				<!-- The dropdown options container -->
				<ul
					id="options"
					role="listbox"
					class=${classMap({
						'absolute z-30 mt-1 w-full rounded-md shadow-sm': true,
						hidden: !this.isOpen,
					})}
					${color({ bgColor: SchmancyTheme.sys.color.surface.container })}
					@click=${(e: Event) => {
						// If a <schmancy-option> inside was clicked, it dispatches a 'click' event
						// with detail.value. We can read that here:
						const customEvt = e as CustomEvent
						const detailVal = customEvt.detail?.value
						if (detailVal) {
							this.handleOptionSelect(detailVal)
						}
					}}
				>
					<!-- The <schmancy-option> elements get slotted in here -->
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
