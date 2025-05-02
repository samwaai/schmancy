import { TailwindElement } from '@mixins/tailwind.mixin'
import { html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { fromEvent, merge, takeUntil } from 'rxjs'
import { computePosition, flip, shift, offset, autoUpdate, Placement } from '@floating-ui/dom'

/**
 * A tooltip component that displays a text tooltip when hovering over content.
 * Addresses shadow DOM limitations by teleporting the tooltip to document.body.
 *
 * @element schmancy-tooltip
 */
@customElement('schmancy-tooltip')
export class SchmancyTooltip extends TailwindElement(css`
	:host {
		display: inline-block;
		position: relative;
	}
`) {
	@property({ type: String })
	text = ''

	@property({ type: String })
	position: 'top' | 'right' | 'bottom' | 'left' = 'top'

	@property({ type: Number })
	delay = 50

	@property({ type: Boolean })
	disabled = false

	@state() private visible = false

	private triggerElement: HTMLElement | null = null
	private tooltipElement: HTMLElement | null = null
	private cleanup: (() => void) | undefined
	private showTimeoutId: number | undefined

	connectedCallback() {
		super.connectedCallback()

		// Create tooltip element once
		if (!this.tooltipElement) {
			this.createTooltipElement()
		}
	}

	firstUpdated() {
		// Wait for slotted elements to be available
		this.updateComplete.then(() => {
			// Get the first slotted element as trigger
			const slot = this.shadowRoot?.querySelector('slot') as HTMLSlotElement
			const slottedElements = slot?.assignedElements() || []

			if (slottedElements.length > 0) {
				this.triggerElement = slottedElements[0] as HTMLElement
				this.setupEvents()
			}
		})
	}

	private createTooltipElement() {
		// Create the tooltip element in document.body
		this.tooltipElement = document.createElement('div')
		this.tooltipElement.className = 'schmancy-tooltip'

		// Apply styles
		Object.assign(this.tooltipElement.style, {
			position: 'absolute',
			zIndex: '10000',
			backgroundColor: 'var(--schmancy-sys-color-surface-highest, #333)',
			color: 'var(--schmancy-sys-color-surface-on, white)',
			padding: '8px 12px',
			borderRadius: '4px',
			fontSize: '14px',
			fontWeight: 'normal',
			maxWidth: '300px',
			pointerEvents: 'none',
			opacity: '0',
			transition: 'opacity 150ms ease',
			boxShadow: 'var(--schmancy-sys-elevation-2)',
			textAlign: 'center',
		})

		// Set ARIA attributes
		this.tooltipElement.setAttribute('role', 'tooltip')

		// Add to document
		document.body.appendChild(this.tooltipElement)
	}

	private setupEvents() {
		if (!this.triggerElement || this.disabled) return

		// Generate unique ID for ARIA
		const tooltipId = `tooltip-${Math.random().toString(36).slice(2, 9)}`
		if (this.tooltipElement) {
			this.tooltipElement.id = tooltipId
			this.triggerElement.setAttribute('aria-describedby', tooltipId)
		}

		// Setup event streams using RxJS
		const mouseEnter$ = fromEvent(this.triggerElement, 'mouseenter')
		const focus$ = fromEvent(this.triggerElement, 'focus')
		const mouseLeave$ = fromEvent(this.triggerElement, 'mouseleave')
		const blur$ = fromEvent(this.triggerElement, 'blur')

		// Global escape key handler
		fromEvent<KeyboardEvent>(document, 'keydown')
			.pipe(takeUntil(this.disconnecting))
			.subscribe(event => {
				if (event.key === 'Escape' && this.visible) {
					this.hideTooltip()
				}
			})

		// Handle showing
		merge(mouseEnter$, focus$)
			.pipe(takeUntil(this.disconnecting))
			.subscribe(() => {
				this.showTooltip()
			})

		// Handle hiding
		merge(mouseLeave$, blur$)
			.pipe(takeUntil(this.disconnecting))
			.subscribe(() => {
				this.hideTooltip()
			})
	}

	disconnectedCallback() {
		// Clean up
		if (this.tooltipElement && document.body.contains(this.tooltipElement)) {
			document.body.removeChild(this.tooltipElement)
		}
		this.cleanup?.()
		clearTimeout(this.showTimeoutId)
		super.disconnectedCallback()
	}

	private showTooltip() {
		if (this.disabled || !this.tooltipElement || !this.triggerElement) return

		// Clear any existing timeout
		clearTimeout(this.showTimeoutId)

		// Set timeout for showing
		this.showTimeoutId = window.setTimeout(() => {
			// Update content
			if (this.tooltipElement) {
				this.tooltipElement.textContent = this.text

				// Make visible
				this.visible = true
				this.tooltipElement.style.opacity = '1'

				// Initialize positioning
				this.initializePositioning()
			}
		}, this.delay)
	}

	private hideTooltip() {
		// Clear showing timeout
		clearTimeout(this.showTimeoutId)

		// Hide tooltip
		if (this.tooltipElement) {
			this.visible = false
			this.tooltipElement.style.opacity = '0'
		}

		// Clean up positioning
		if (this.cleanup) {
			this.cleanup()
			this.cleanup = undefined
		}
	}

	private initializePositioning() {
		if (!this.triggerElement || !this.tooltipElement) return

		// Clean up existing positioning
		if (this.cleanup) {
			this.cleanup()
		}

		// Set up auto-updating position
		this.cleanup = autoUpdate(this.triggerElement, this.tooltipElement, () => {
			// Compute position
			computePosition(this.triggerElement!, this.tooltipElement!, {
				placement: this.position as Placement,
				middleware: [offset(8), flip({ padding: 5 }), shift({ padding: 5 })],
			}).then(({ x, y }) => {
				// Apply position
				if (this.tooltipElement) {
					Object.assign(this.tooltipElement.style, {
						left: `${x}px`,
						top: `${y}px`,
					})
				}
			})
		})
	}

	render() {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-tooltip': SchmancyTooltip
	}
}
