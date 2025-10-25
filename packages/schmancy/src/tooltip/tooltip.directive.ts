import { arrow, autoUpdate, computePosition, flip, offset, Placement, shift, Strategy } from '@floating-ui/dom'
import { Directive, directive, ElementPart, ElementPartInfo, PartType } from 'lit/directive.js'
import { fromEvent, Subscription } from 'rxjs'

// Store tooltip data for elements
const tooltipMap = new WeakMap<
	Element,
	{
		tooltipElement: HTMLElement
		arrowElement?: HTMLElement
		cleanup?: () => void
		showTimeout?: number
		subscriptions?: Subscription[]
	}
>()

class TooltipDirective extends Directive {
	constructor(partInfo: ElementPartInfo) {
		super(partInfo)
		if (partInfo.type !== PartType.ELEMENT) {
			throw new Error('The tooltip directive can only be used on elements')
		}
	}

	render(
		text: string,
		options: {
			position?: 'top' | 'right' | 'bottom' | 'left'
			delay?: number
			showArrow?: boolean
		} = {},
	) {
		return { text, options }
	}

	update(part: ElementPart, [text, options = {}]: [string, any]) {
		const element = part.element as HTMLElement
		const position = options?.position || 'top'
		const delay = options?.delay || 300
		const showArrow = options?.showArrow !== false // Default to true

		// Get or create tooltip data
		let tooltipData = tooltipMap.get(element)

		if (!tooltipData) {
			// Create tooltip element
			const tooltipElement = document.createElement('div')
			tooltipElement.className = 'schmancy-tooltip'

			// Apply styles
			Object.assign(tooltipElement.style, {
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
				// Important: start with visibility hidden to avoid flash
				visibility: 'hidden',
			})

			// Create arrow element if needed
			let arrowElement: HTMLElement | undefined
			if (showArrow) {
				arrowElement = document.createElement('div')
				arrowElement.className = 'schmancy-tooltip-arrow'
				Object.assign(arrowElement.style, {
					position: 'absolute',
					width: '8px',
					height: '8px',
					background: 'inherit',
					visibility: 'hidden',
					// We'll rotate this to create an arrow
					transform: 'rotate(45deg)',
				})
				tooltipElement.appendChild(arrowElement)
			}

			// Set ARIA attributes
			tooltipElement.setAttribute('role', 'tooltip')

			// Generate unique ID
			const tooltipId = `tooltip-${Math.random().toString(36).slice(2, 9)}`
			tooltipElement.id = tooltipId
			element.setAttribute('aria-describedby', tooltipId)

			// Add to document
			document.body.appendChild(tooltipElement)

			// Create tooltip data
			tooltipData = {
				tooltipElement,
				arrowElement,
			}

			tooltipMap.set(element, tooltipData)

			// Define show handler
			const showTooltip = () => {
				if (tooltipData?.showTimeout) {
					clearTimeout(tooltipData.showTimeout)
				}

				tooltipData.showTimeout = window.setTimeout(() => {
					// Set content
					tooltipData.tooltipElement.textContent = text

					// Add arrow back if it was removed
					if (showArrow && tooltipData.arrowElement && !tooltipData.tooltipElement.contains(tooltipData.arrowElement)) {
						tooltipData.tooltipElement.appendChild(tooltipData.arrowElement)
					}

					// Make sure element is visible first
					tooltipData.tooltipElement.style.visibility = 'visible'

					// Clean up existing positioning
					if (tooltipData.cleanup) {
						tooltipData.cleanup()
					}

					// Set up positioning
					tooltipData.cleanup = autoUpdate(element, tooltipData.tooltipElement, () =>
						updatePosition(element, tooltipData, position, showArrow),
					)

					// Make opacity 1 after positioning is set up
					requestAnimationFrame(() => {
						tooltipData.tooltipElement.style.opacity = '1'
					})
				}, delay)
			}

			// Define hide handler
			const hideTooltip = () => {
				if (tooltipData?.showTimeout) {
					clearTimeout(tooltipData.showTimeout)
				}

				tooltipData.tooltipElement.style.opacity = '0'

				// Set visibility to hidden after fade out
				setTimeout(() => {
					tooltipData.tooltipElement.style.visibility = 'hidden'
				}, 150) // Match transition time

				// Clean up positioning
				if (tooltipData?.cleanup) {
					tooltipData.cleanup()
					tooltipData.cleanup = undefined
				}
			}

			// Add event listeners using fromEvent
			const subscriptions = [
				fromEvent(element, 'mouseenter').subscribe(showTooltip),
				fromEvent(element, 'focus').subscribe(showTooltip),
				fromEvent(element, 'mouseleave').subscribe(hideTooltip),
				fromEvent(element, 'blur').subscribe(hideTooltip),
				fromEvent<KeyboardEvent>(document, 'keydown').subscribe((e: KeyboardEvent) => {
					if (e.key === 'Escape' && tooltipData?.tooltipElement.style.opacity === '1') {
						hideTooltip()
					}
				})
			]

			// Store subscriptions for cleanup
			tooltipData.subscriptions = subscriptions
		} else {
			// Update content for existing tooltip
			tooltipData.tooltipElement.textContent = text

			// Update arrow visibility if needed
			if (tooltipData.arrowElement) {
				tooltipData.arrowElement.style.visibility = showArrow ? 'visible' : 'hidden'
			}
		}

		return { text, options }
	}

	disconnected(part: ElementPart) {
		const element = part.element
		const tooltipData = tooltipMap.get(element)

		if (tooltipData) {
			// Clean up subscriptions
			if (tooltipData.subscriptions) {
				tooltipData.subscriptions.forEach(subscription => subscription.unsubscribe())
			}

			// Clean up timeouts and positioning
			if (tooltipData.showTimeout) {
				clearTimeout(tooltipData.showTimeout)
			}

			if (tooltipData.cleanup) {
				tooltipData.cleanup()
			}

			// Remove tooltip element
			if (document.body.contains(tooltipData.tooltipElement)) {
				document.body.removeChild(tooltipData.tooltipElement)
			}

			// Remove ARIA attributes
			if (element.hasAttribute('aria-describedby')) {
				element.removeAttribute('aria-describedby')
			}

			// Remove from WeakMap
			tooltipMap.delete(element)
		}
	}
}

// Separate positioning function for clarity and reuse
async function updatePosition(element: HTMLElement, tooltipData: any, position: string, showArrow: boolean) {
	// Use floating-ui to compute position
	const middleware = [
		offset(8), // Distance from the element
		flip({
			fallbackPlacements: ['top', 'right', 'bottom', 'left'].filter(p => p !== position) as Placement[],
			padding: 5, // How far from the edges before flipping
		}),
		shift({ padding: 5 }), // Keep it within viewport bounds
	]

	// Add arrow middleware if needed
	if (showArrow && tooltipData.arrowElement) {
		middleware.push(arrow({ element: tooltipData.arrowElement }))
	}

	const { x, y, placement, middlewareData } = await computePosition(element, tooltipData.tooltipElement, {
		placement: position as Placement,
		middleware,
		strategy: 'fixed' as Strategy, // Fixed positioning works better across contexts
	})

	// Apply position
	Object.assign(tooltipData.tooltipElement.style, {
		left: `${x}px`,
		top: `${y}px`,
		position: 'fixed',
	})

	// Position the arrow if it exists
	if (showArrow && tooltipData.arrowElement && middlewareData.arrow) {
		const { x: arrowX, y: arrowY } = middlewareData.arrow

		// Determine which side the arrow should be on based on placement
		const staticSide =
			{
				top: 'bottom',
				right: 'left',
				bottom: 'top',
				left: 'right',
			}[placement.split('-')[0]] || 'bottom'

		// Position the arrow
		Object.assign(tooltipData.arrowElement.style, {
			left: arrowX != null ? `${arrowX}px` : '',
			top: arrowY != null ? `${arrowY}px` : '',
			[staticSide]: '-4px', // Position the arrow on the correct side
			visibility: 'visible',
		})
	}
}

export const tooltip = directive(TooltipDirective)
