import { TailwindElement } from '@mixins/tailwind.mixin'
import { color } from '@schmancy/directives'
import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { SchmancyEvents, SchmancyTheme } from '..'
import { BehaviorSubject, fromEvent } from 'rxjs'
import { takeUntil, throttleTime, tap, pairwise, map, filter } from 'rxjs/operators'
import type { SchmancyNavigationBarItem } from './navigation-bar-item'

/**
 * `<schmancy-navigation-bar>` component
 *
 * A horizontal navigation component following Material Design 3 specifications.
 * Navigation bars provide access to between 3-7 primary destinations.
 * Automatically hides in fullscreen mode when triggered via schmancyTheme.next({ fullscreen: true }).
 *
 * **IMPORTANT**: This component includes `z-10` by default (consistent with navigation-rail).
 * The consumer is responsible for positioning the navigation bar in their layout.
 * For typical bottom-fixed positioning, add: `class="fixed bottom-0 left-0 right-0"`.
 *
 * @element schmancy-navigation-bar
 * @slot - Default slot for navigation bar items
 *
 * @fires navigation-change - When an item is selected
 *
 * @example
 * <!-- Fixed at bottom (typical usage) -->
 * <schmancy-navigation-bar activeIndex="0" class="fixed bottom-0 left-0 right-0">
 *   <schmancy-navigation-bar-item icon="home" label="Home"></schmancy-navigation-bar-item>
 *   <schmancy-navigation-bar-item icon="search" label="Search"></schmancy-navigation-bar-item>
 *   <schmancy-navigation-bar-item icon="favorite" label="Favorites"></schmancy-navigation-bar-item>
 *   <schmancy-navigation-bar-item icon="settings" label="Settings"></schmancy-navigation-bar-item>
 * </schmancy-navigation-bar>
 *
 * @example
 * <!-- Within a container (demo/mockup usage) -->
 * <div class="flex flex-col h-screen">
 *   <main class="flex-1">Content</main>
 *   <schmancy-navigation-bar activeIndex="0">
 *     <schmancy-navigation-bar-item icon="home" label="Home"></schmancy-navigation-bar-item>
 *   </schmancy-navigation-bar>
 * </div>
 */
@customElement('schmancy-navigation-bar')
export class SchmancyNavigationBar extends TailwindElement(css`
	:host {
		display: block;
		transition: transform 0.3s ease-in-out;
	}

	:host([hide-on-scroll]) {
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Support 3-7 items with equal distribution */
	::slotted(schmancy-navigation-bar-item) {
		flex: 1;
		max-width: 168px; /* Prevent items from being too wide */
	}

	/* Accessibility focus indicators */
	:host(:focus-within) {
		outline: 2px solid var(--schmancy-sys-color-primary);
		outline-offset: -2px;
	}
`) {
	/**
	 * Observable for active index state
	 */
	private activeIndex$ = new BehaviorSubject<number>(-1)

	/**
	 * Currently active item index
	 * @default -1
	 */
	@property({ type: Number })
	get activeIndex() { return this.activeIndex$.value }
	set activeIndex(value: number) { this.activeIndex$.next(value) }

	/**
	 * Hide labels and show only icons
	 * @default false
	 */
	@property({ type: Boolean, reflect: true })
	hideLabels = false

	/**
	 * Elevation level for the navigation bar
	 * @default 2
	 */
	@property({ type: Number, reflect: true })
	elevation = 2

	/**
	 * Hide navigation bar on scroll down, show on scroll up
	 * @default false
	 */
	@property({ type: Boolean, reflect: true })
	hideOnScroll = false


	/**
	 * Current focused item index for keyboard navigation
	 */
	@state()
	private focusedIndex = -1

	/**
	 * Whether the navigation bar is hidden due to scrolling
	 */
	@state()
	private isHiddenByScroll = false

	/**
	 * Whether the navigation bar is hidden due to fullscreen mode
	 */
	@state()
	private isFullscreen = false

	/**
	 * Get all navigation bar items from the slot
	 */
	private getItems(): SchmancyNavigationBarItem[] {
		const slot = this.shadowRoot?.querySelector('slot') as HTMLSlotElement | null
		if (!slot) return []
		return slot.assignedElements({ flatten: true })
			.filter((el): el is SchmancyNavigationBarItem =>
				el.tagName.toLowerCase() === 'schmancy-navigation-bar-item'
			)
	}

	/**
	 * Minimum scroll threshold before triggering hide/show
	 */
	private readonly SCROLL_THRESHOLD = 10

	connectedCallback() {
		super.connectedCallback()

		// Listen to bar-item-click events using RxJS
		fromEvent(this, 'bar-item-click').pipe(
			tap((event: Event) => this.handleItemClick(event as CustomEvent)),
			takeUntil(this.disconnecting)
		).subscribe()

		// Listen to keydown events using RxJS
		fromEvent(this, 'keydown').pipe(
			tap((event: Event) => this.handleKeyDown(event as KeyboardEvent)),
			takeUntil(this.disconnecting)
		).subscribe()

		// Subscribe to active index changes
		this.activeIndex$.pipe(
			takeUntil(this.disconnecting)
		).subscribe(index => {
			this.updateActiveStates(index)
		})

		// Listen to fullscreen events
		fromEvent(window, 'fullscreen').pipe(
			tap((event: Event) => {
				const customEvent = event as CustomEvent
				this.isFullscreen = customEvent.detail
			}),
			takeUntil(this.disconnecting)
		).subscribe()

		// Set up scroll listener if hideOnScroll is enabled
		if (this.hideOnScroll) {
			this.setupScrollListener()
		}

		this.updateItems()
	}

	/**
	 * Set up RxJS-based scroll listener
	 */
	private setupScrollListener() {
		// Create scroll observable
		fromEvent(window, 'scroll').pipe(
			throttleTime(100), // Throttle for performance
			map(() => window.scrollY),
			pairwise(), // Get pairs of [previous, current] scroll positions
			filter(([prev, curr]) => Math.abs(curr - prev) > this.SCROLL_THRESHOLD), // Only react if scrolled enough
			tap(([prev, curr]) => {
				const scrollingDown = curr > prev
				const scrollingUp = curr < prev

				// Hide when scrolling down, show when scrolling up
				if (scrollingDown && !this.isHiddenByScroll) {
					this.isHiddenByScroll = true
				} else if (scrollingUp && this.isHiddenByScroll) {
					this.isHiddenByScroll = false
				}

				// Always show when near top
				if (curr <= this.SCROLL_THRESHOLD) {
					this.isHiddenByScroll = false
				}

			}),
			takeUntil(this.disconnecting)
		).subscribe()
	}


	/**
	 * Handle item click events
	 */
	private handleItemClick = (event: CustomEvent) => {
		const items = this.getItems()
		const clickedItem = event.target as HTMLElement
		const index = items.indexOf(clickedItem as any)

		if (index === -1) return

		// Clicking the already-active item toggles the sidebar
		if (this.activeIndex === index) {
			this.dispatchEvent(
				new CustomEvent(SchmancyEvents.NavDrawer_toggle, {
					detail: { state: 'toggle' },
					bubbles: true,
					composed: true,
				}),
			)
			return
		}

		const oldIndex = this.activeIndex
		// Setting activeIndex will trigger the BehaviorSubject
		this.activeIndex = index

		// Emit navigation change event
		this.dispatchEvent(new CustomEvent('navigation-change', {
			detail: {
				oldIndex,
				newIndex: index,
				item: clickedItem
			},
			bubbles: true,
			composed: true
		}))
	}

	/**
	 * Handle keyboard navigation
	 */
	private handleKeyDown = (event: KeyboardEvent) => {
		const items = this.getItems()
		const currentIndex = this.focusedIndex === -1 ? this.activeIndex : this.focusedIndex

		switch (event.key) {
			case 'ArrowLeft':
				event.preventDefault()
				if (currentIndex > 0) {
					this.focusItem(currentIndex - 1)
				}
				break

			case 'ArrowRight':
				event.preventDefault()
				if (currentIndex < items.length - 1) {
					this.focusItem(currentIndex + 1)
				}
				break

			case 'Home':
				event.preventDefault()
				this.focusItem(0)
				break

			case 'End':
				event.preventDefault()
				this.focusItem(items.length - 1)
				break

			case 'Enter':
			case ' ':
				event.preventDefault()
				if (this.focusedIndex !== -1) {
					const item = items[this.focusedIndex] as any
					item?.click()
				}
				break
		}
	}

	/**
	 * Focus a specific item by index
	 */
	private focusItem(index: number) {
		const items = this.getItems()
		if (items[index]) {
			this.focusedIndex = index
			;(items[index] as HTMLElement).focus()
		}
	}

	/**
	 * Update the list of navigation items
	 */
	private updateItems() {
		const slot = this.shadowRoot?.querySelector('slot')
		if (slot) {
			const handleSlotChange = () => {
				// Update active states when slot content changes
				this.updateActiveStates(this.activeIndex)
			}
			slot.addEventListener('slotchange', handleSlotChange)
			handleSlotChange() // Initial update
		}
	}


	/**
	 * Add a boat item to the navigation bar
	 * @param config Configuration for the boat item
	 * @returns The created or existing navigation bar item element
	 */
	public addBoatItem(config: { id: string; title: string; icon?: string }) {
		// Check if item already exists
		const existingItem = this.querySelector(`[value="${config.id}"]`) as HTMLElement
		if (existingItem) {
			// Item already exists, just return it
			return existingItem
		}

		// Create new item
		const item = document.createElement('schmancy-navigation-bar-item')
		item.setAttribute('value', config.id)
		item.innerHTML = `
			<schmancy-icon>${config.icon || 'widgets'}</schmancy-icon>
			<span>${config.title}</span>
		`
		this.appendChild(item)
		return item
	}

	/**
	 * Update active states on all items
	 */
	private updateActiveStates(activeIndex: number) {
		const items = this.getItems()
		items.forEach((item, index) => {
			const navItem = item as any
			// Use setActive method to trigger item's reactive update
			if (navItem.setActive) {
				navItem.setActive(index === activeIndex)
			} else {
				// Fallback for backward compatibility
				navItem.active = index === activeIndex
			}
			navItem.hideLabels = this.hideLabels
			// Set tabindex for accessibility
			;(item as HTMLElement).tabIndex = index === activeIndex ? 0 : -1
		})
	}

	updated(changedProperties: Map<string, any>) {
		super.updated(changedProperties)

		if (changedProperties.has('hideLabels')) {
			// Only update hide labels, active state is handled by the BehaviorSubject
			this.updateActiveStates(this.activeIndex)
		}

		if (changedProperties.has('hideOnScroll')) {
			if (this.hideOnScroll && !changedProperties.get('hideOnScroll')) {
				// hideOnScroll was just enabled
				this.setupScrollListener()
			} else if (!this.hideOnScroll) {
				// hideOnScroll was disabled, reset hidden state
				this.isHiddenByScroll = false
			}
		}
	}

	protected render() {
		// Determine if the bar should be visually hidden
		const isVisuallyHidden = this.isFullscreen || this.isHiddenByScroll

		const containerClasses = {
			'h-20': true, // 80px height
			'flex items-center justify-around': true,
			'px-2 py-3 box-border': true,
			'transition-all duration-300 ease-in-out': true,
			'z-10': true, // Consistent with navigation-rail z-index
			// Elevation shadows
			'shadow-none': this.elevation === 0,
			'shadow-sm': this.elevation === 1,
			'shadow-md': this.elevation === 2,
			'shadow-lg': this.elevation === 3,
			'shadow-xl': this.elevation === 4,
			'shadow-2xl': this.elevation === 5,
		}

		// Apply transform for hide/show animation
		const transformStyle = isVisuallyHidden ? 'translateY(100%)' : 'translateY(0)'

		return html`
			<nav
				class=${this.classMap(containerClasses)}
				role="navigation"
				aria-label="Main navigation"
				aria-hidden=${isVisuallyHidden}
				style="transform: ${transformStyle};"
				${color({
					bgColor: SchmancyTheme.sys.color.surface.container,
					color: SchmancyTheme.sys.color.surface.on
				})}
			>
				<slot></slot>
			</nav>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-navigation-bar': SchmancyNavigationBar
	}
}