import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'
import { TailwindElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js'
import { fromEvent, merge, takeUntil } from 'rxjs'

/**
 * @element schmancy-tooltip
 * A tooltip component that displays additional information when hovering or focusing an element.
 *
 * @slot - The default slot for the trigger element
 * @slot content - The content to display in the tooltip
 *
 * @csspart tooltip - The tooltip container element
 * @csspart arrow - The tooltip arrow element
 *
 * @example
 * <schmancy-tooltip>
 *   <div slot="content">Tooltip content here</div>
 *   <schmancy-button>Hover me</schmancy-button>
 * </schmancy-tooltip>
 */
@customElement('schmancy-tooltip')
export class SchmancyTooltip extends TailwindElement() {
	/**
	 * The placement of the tooltip relative to the trigger element
	 * @attr
	 */
	@property({ type: String })
	placement: 'top' | 'right' | 'bottom' | 'left' = 'top'

	/**
	 * The offset distance from the trigger element in pixels
	 * @attr
	 */
	@property({ type: Number })
	distance = 8

	/**
	 * The delay before showing the tooltip in milliseconds
	 * @attr
	 */
	@property({ type: Number })
	showDelay = 300

	/**
	 * The delay before hiding the tooltip in milliseconds
	 * @attr
	 */
	@property({ type: Number })
	hideDelay = 100

	/**
	 * Whether the tooltip should be shown
	 * @attr
	 */
	@property({ type: Boolean, reflect: true })
	open = false

	/**
	 * Whether to disable the tooltip
	 * @attr
	 */
	@property({ type: Boolean, reflect: true })
	disabled = false

	@query('#tooltip') tooltip!: HTMLElement
	@query('#trigger-container') triggerContainer!: HTMLElement
	@query('#arrow') arrow!: HTMLElement

	@queryAssignedElements({ flatten: true })
	triggerElements!: HTMLElement[]

	private cleanupPositioner?: () => void
	private showTimeoutId?: number
	private hideTimeoutId?: number

	connectedCallback() {
		super.connectedCallback()
		this.setAttribute('aria-live', 'polite')
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this.cleanupPositioner?.()
		if (this.showTimeoutId) clearTimeout(this.showTimeoutId)
		if (this.hideTimeoutId) clearTimeout(this.hideTimeoutId)
	}

	private async updatePosition() {
		if (!this.triggerContainer || !this.tooltip) return

		const { x, y, placement, middlewareData } = await computePosition(this.triggerContainer, this.tooltip, {
			placement: this.placement,
			middleware: [offset(this.distance), flip(), shift({ padding: 8 })],
		})

		// Position tooltip
		Object.assign(this.tooltip.style, {
			left: `${x}px`,
			top: `${y}px`,
		})

		// Position arrow if it exists
		if (this.arrow) {
			const staticSide = {
				top: 'bottom',
				right: 'left',
				bottom: 'top',
				left: 'right',
			}[placement.split('-')[0]]

			if (staticSide) {
				Object.assign(this.arrow.style, {
					left: middlewareData.arrow?.x != null ? `${middlewareData.arrow.x}px` : '',
					top: middlewareData.arrow?.y != null ? `${middlewareData.arrow.y}px` : '',
					right: '',
					bottom: '',
					[staticSide]: '-4px',
				})
			}
		}
	}

	/**
	 * Setup the auto-updating position and trigger events
	 */
	firstUpdated() {
		// The trigger container holds all the slotted trigger elements
		if (!this.triggerContainer) return

		// Setup event listeners for the trigger container
		merge(fromEvent(this.triggerContainer, 'mouseenter'), fromEvent(this.triggerContainer, 'focus'))
			.pipe(takeUntil(this.disconnecting))
			.subscribe(() => {
				if (this.disabled) return
				this.scheduleShow()
			})

		merge(fromEvent(this.triggerContainer, 'mouseleave'), fromEvent(this.triggerContainer, 'blur'))
			.pipe(takeUntil(this.disconnecting))
			.subscribe(() => {
				if (this.disabled) return
				this.scheduleHide()
			})

		// Add key event listener for escape key
		fromEvent<KeyboardEvent>(window, 'keydown')
			.pipe(takeUntil(this.disconnecting))
			.subscribe(event => {
				if (event.key === 'Escape' && this.open) {
					this.hide()
				}
			})
	}

	/**
	 * Schedule showing the tooltip with the configured delay
	 */
	private scheduleShow() {
		if (this.hideTimeoutId) {
			clearTimeout(this.hideTimeoutId)
			this.hideTimeoutId = undefined
		}

		if (!this.open) {
			this.showTimeoutId = window.setTimeout(() => {
				this.show()
			}, this.showDelay)
		}
	}

	/**
	 * Schedule hiding the tooltip with the configured delay
	 */
	private scheduleHide() {
		if (this.showTimeoutId) {
			clearTimeout(this.showTimeoutId)
			this.showTimeoutId = undefined
		}

		if (this.open) {
			this.hideTimeoutId = window.setTimeout(() => {
				this.hide()
			}, this.hideDelay)
		}
	}

	/**
	 * Show the tooltip
	 */
	public show() {
		if (this.disabled || this.open) return

		this.open = true

		// Position the tooltip
		this.cleanupPositioner = autoUpdate(this.triggerContainer, this.tooltip, () => this.updatePosition())

		// Dispatch custom event
		this.dispatchEvent(
			new CustomEvent('schmancy-tooltip-show', {
				bubbles: true,
				composed: true,
			}),
		)
	}

	/**
	 * Hide the tooltip
	 */
	public hide() {
		if (!this.open) return

		this.open = false

		// Cleanup the positioner
		if (this.cleanupPositioner) {
			this.cleanupPositioner()
			this.cleanupPositioner = undefined
		}

		// Dispatch custom event
		this.dispatchEvent(
			new CustomEvent('schmancy-tooltip-hide', {
				bubbles: true,
				composed: true,
			}),
		)
	}

	render() {
		const tooltipClasses = {
			'absolute z-50 bg-surface-highest text-surface-on rounded-md shadow-md': true,
			'max-w-xs opacity-0 invisible scale-95 transition-all duration-150': true,
			'opacity-100 visible scale-100': this.open,
		}

		return html`
			<div id="trigger-container" class="inline-block" aria-describedby="tooltip">
				<slot></slot>
			</div>

			<div id="tooltip" part="tooltip" role="tooltip" class="${this.classMap(tooltipClasses)}">
				<slot name="content"></slot>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-tooltip': SchmancyTooltip
	}
}
