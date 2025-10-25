import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'
import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, property, query, queryAssignedElements, state } from 'lit/decorators.js'
import { filter, fromEvent, takeUntil, Subscription } from 'rxjs'

/**
 * A dropdown component that displays content when triggered.
 *
 * @element schmancy-dropdown
 * @slot trigger - The element that triggers the dropdown
 * @slot - Default slot for the dropdown content
 */
@customElement('schmancy-dropdown')
export class SchmancyDropdown extends $LitElement() {
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
	@query('.dropdown-content-container') contentContainer!: HTMLElement
	@queryAssignedElements({ flatten: true }) contentElements!: HTMLElement[]
	@state() private portal: HTMLElement | null = null

	@queryAssignedElements({ slot: 'trigger', flatten: true })
	triggerElements!: Array<HTMLElement>

	private cleanupPositioner?: () => void
	private portalSubscriptions: Subscription[] = []

	connectedCallback() {
		super.connectedCallback()

		// Create portal container for teleporting content to document body
		this.setupPortal()

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
	 * Set up the portal element for teleporting content
	 */
	private setupPortal() {
		// Check if portal container exists
		let portalContainer = document.getElementById('schmancy-portal-container')

		// Create portal container if it doesn't exist
		if (!portalContainer) {
			portalContainer = document.createElement('div')
			portalContainer.id = 'schmancy-portal-container'
			portalContainer.style.position = 'fixed'
			portalContainer.style.zIndex = '10000'
			portalContainer.style.top = '0'
			portalContainer.style.left = '0'
			portalContainer.style.pointerEvents = 'none'
			document.body.appendChild(portalContainer)
		}

		// Create portal for this specific dropdown
		const portal = document.createElement('div')
		portal.className = 'schmancy-dropdown-portal'
		portal.style.position = 'absolute'
		portal.style.pointerEvents = 'auto'
		portal.style.display = 'none'
		portalContainer.appendChild(portal)

		this.portal = portal
	}

	/**
	 * Check if an event originated from within this component
	 */
	private isEventFromSelf(event: Event): boolean {
		return event.composedPath().some(el => el === this)
	}

	disconnectedCallback() {
		this.cleanupPositioner?.()

		// Clean up portal subscriptions
		this.portalSubscriptions.forEach(subscription => subscription.unsubscribe())
		this.portalSubscriptions = []

		// Remove portal when component is disconnected
		if (this.portal) {
			this.portal.remove()
			this.portal = null
		}

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

				// Hide portal when dropdown is closed
				if (this.portal) {
					this.portal.style.display = 'none'
					this.portal.innerHTML = ''
					// Clean up subscriptions when content is cleared
					this.portalSubscriptions.forEach(subscription => subscription.unsubscribe())
					this.portalSubscriptions = []
				}
			}
		}
	}

	/**
	 * Setup floating UI positioning with teleportation
	 */
	private setupPositioner() {
		if (!this.triggerContainer || !this.portal) return

		// Show the portal
		this.portal.style.display = 'block'

		// Move content to portal
		this.teleportContentToPortal()

		// Setup positioning
		this.cleanupPositioner = autoUpdate(this.triggerContainer, this.portal, () => {
			computePosition(this.triggerContainer, this.portal, {
				placement: this.placement,
				middleware: [
					offset(this.distance),
					flip({
						fallbackPlacements: ['top-start', 'bottom-start'],
					}),
					shift({ padding: 0 }),
				],
			}).then(({ x, y }) => {
				// Update portal position
				Object.assign(this.portal.style, {
					left: `${x}px`,
					top: `${y - 8}px`,
				})
			})
		})
	}

	/**
	 * Move slotted content to the portal
	 */
	private teleportContentToPortal() {
		if (!this.portal) return

		// Clean up existing subscriptions
		this.portalSubscriptions.forEach(subscription => subscription.unsubscribe())
		this.portalSubscriptions = []

		// Clear existing content
		this.portal.innerHTML = ''

		// Clone and move slotted content to portal
		this.contentElements.forEach(element => {
			// Get computed styles to ensure portal content matches original styling
			const clonedElement = element.cloneNode(true) as HTMLElement

			// Ensure dropdown-content elements maintain their styles when teleported
			if (element.tagName.toLowerCase() === 'schmancy-dropdown-content') {
				const subscription = fromEvent(clonedElement, 'slotchange').subscribe(() => {
					// Propagate any slot changes to class changes on children
					const contentDiv = clonedElement.shadowRoot?.querySelector('[part="content"]')
					if (contentDiv) {
						contentDiv.classList.add('schmancy-dropdown-content')
					}
				})
				this.portalSubscriptions.push(subscription)
			}

			this.portal?.appendChild(clonedElement)
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

			<div class="dropdown-content-container" ?hidden=${!this.open}>
				<slot
					@slotchange=${() => {
						if (this.open) {
							this.teleportContentToPortal()
							this.setupPositioner()
						}
					}}
				></slot>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-dropdown': SchmancyDropdown
	}
}
