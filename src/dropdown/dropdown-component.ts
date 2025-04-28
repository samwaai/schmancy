import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'
import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js'
import { filter, fromEvent, takeUntil } from 'rxjs'

/**
 * A dropdown component that displays content when triggered.
 *
 * @element schmancy-dropdown
 * @slot trigger - The element that triggers the dropdown
 * @slot - Default slot for the dropdown content
 */
@customElement('schmancy-dropdown')
export class SchmancyDropdown extends $LitElement(css`
	:host {
		display: inline-block;
		position: relative;
	}
`) {
	/**
	 * Whether the dropdown is currently open
	 */
	@property({ type: Boolean, reflect: true })
	open = false

	/**
	 * Placement of the dropdown relative to the trigger
	 */
	@property({ type: String })
	placement:
		| 'top'
		| 'top-start'
		| 'top-end'
		| 'right'
		| 'right-start'
		| 'right-end'
		| 'bottom'
		| 'bottom-start'
		| 'bottom-end'
		| 'left'
		| 'left-start'
		| 'left-end' = 'bottom-start'

	/**
	 * Offset distance in pixels
	 */
	@property({ type: Number })
	distance = 8

	@query('.trigger-container') triggerContainer!: HTMLElement
	@query('schmancy-dropdown-content') content!: HTMLElement

	@queryAssignedElements({ slot: 'trigger', flatten: true })
	triggerElements!: Array<HTMLElement>

	private cleanupPositioner?: () => void

	connectedCallback() {
		super.connectedCallback()

		// Listen for document clicks to close dropdown when clicking outside
		fromEvent<MouseEvent>(document, 'click')
			.pipe(
				filter(event => this.open && !this.isEventFromSelf(event)),
				takeUntil(this.disconnecting),
			)
			.subscribe(() => {
				this.open = false
			})

		// Listen for escape key to close dropdown
		fromEvent<KeyboardEvent>(document, 'keydown')
			.pipe(
				filter(event => this.open && event.key === 'Escape'),
				takeUntil(this.disconnecting),
			)
			.subscribe(() => {
				this.open = false
			})
	}

	/**
	 * Check if an event originated from within this component
	 */
	private isEventFromSelf(event: Event): boolean {
		return event.composedPath().some(el => el === this)
	}

	disconnectedCallback() {
		this.cleanupPositioner?.()
		super.disconnectedCallback()
	}

	/**
	 * Toggle the dropdown open state
	 */
	toggle() {
		this.open = !this.open
	}

	updated(changedProps: Map<string, any>) {
		super.updated(changedProps)

		if (changedProps.has('open')) {
			if (this.open) {
				this.setupPositioner()
			} else {
				this.cleanupPositioner?.()
			}
		}
	}

	/**
	 * Setup floating UI positioning
	 */
	private setupPositioner() {
		if (!this.triggerContainer || !this.content) return

		this.cleanupPositioner = autoUpdate(this.triggerContainer, this.content, () => {
			computePosition(this.triggerContainer, this.content, {
				placement: this.placement,
				middleware: [
					offset(this.distance),
					flip({
						fallbackPlacements: ['top-start', 'bottom-start'],
					}),
					shift({ padding: 8 }),
				],
			}).then(({ x, y }) => {
				Object.assign(this.content.style, {
					left: `${x}px`,
					top: `${y}px`,
				})
			})
		})
	}

	/**
	 * Handle trigger click to toggle dropdown
	 */
	private handleTriggerClick(e: Event) {
		e.stopPropagation()
		this.toggle()
	}

	render() {
		return html`
			<div class="trigger-container" @click=${this.handleTriggerClick}>
				<slot name="trigger"></slot>
			</div>

			<slot
				?hidden=${!this.open}
				@slotchange=${() => {
					if (this.open) {
						this.setupPositioner()
					}
				}}
			></slot>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-dropdown': SchmancyDropdown
	}
}
