import { $LitElement } from '@mixins/index'
import { html, PropertyValues } from 'lit'
import { customElement, property, queryAssignedElements, state } from 'lit/decorators.js'
import { BehaviorSubject, takeUntil } from 'rxjs'
import { distinctUntilChanged, tap } from 'rxjs/operators'
import { SchmancyNavigationRailItem } from './navigation-rail-item'

export type NavigateEvent = CustomEvent<string>

export type NavigationRailMenuClickEvent = CustomEvent<void>

export type NavigationRailFabClickEvent = CustomEvent<void>

export type LabelVisibility = 'all' | 'selected' | 'none'

/**
 * Material Design 3 Navigation Rail Component
 * @see https://m3.material.io/components/navigation-rail/overview
 *
 * `<schmancy-navigation-rail>` component
 *
 * A Material Design 3 vertical navigation component positioned on the left side of an application.
 * Navigation rails provide access to between 3-7 primary destinations with a compact footprint.
 *
 * @element schmancy-navigation-rail
 * @slot fab - Slot for a floating action button at the top
 * @slot menu - Slot for a menu icon or button below the FAB
 * @slot header - Custom header content slot
 * @slot footer - Custom footer content slot
 * @slot - Default slot for navigation rail items
 *
 * @fires navigate - When a navigation item is selected
 * @fires menu-click - When the menu button is clicked
 * @fires fab-click - When the FAB is clicked
 *
 * @csspart rail - The main rail container
 * @csspart header - The header section
 * @csspart nav - The navigation items container
 * @csspart footer - The footer section
 *
 * @example
 * <schmancy-navigation-rail activeIndex="0">
 *   <schmancy-button slot="fab" variant="filled" aria-label="Compose">
 *     <schmancy-icon>add</schmancy-icon>
 *   </schmancy-button>
 *   <schmancy-button slot="menu" variant="text" aria-label="Menu">
 *     <schmancy-icon>menu</schmancy-icon>
 *   </schmancy-button>
 *   <schmancy-navigation-rail-item icon="home" label="Home"></schmancy-navigation-rail-item>
 *   <schmancy-navigation-rail-item icon="search" label="Search"></schmancy-navigation-rail-item>
 *   <schmancy-navigation-rail-item icon="favorite" label="Favorites" badge="3"></schmancy-navigation-rail-item>
 *   <schmancy-navigation-rail-item icon="settings" label="Settings"></schmancy-navigation-rail-item>
 * </schmancy-navigation-rail>
 */
@customElement('schmancy-navigation-rail')
export class SchmancyNavigationRail extends $LitElement() {
	// Observable state
	private activeIndex$ = new BehaviorSubject<number>(-1)

	// Properties
	/**
	 * The currently active item index
	 * @default -1
	 */
	@property({ type: Number })
	get activeIndex() {
		return this.activeIndex$.value
	}
	set activeIndex(value: number) {
		this.activeIndex$.next(value)
	}

	/**
	 * The currently active item value (for programmatic selection)
	 */
	@property({ type: String })
	get activeValue() {
		return this._activeValue
	}
	set activeValue(value: string) {
		this._activeValue = value
		this.updateActiveByValue(value)
	}
	private _activeValue = ''

	/**
	 * When to show labels for navigation items
	 * 'all' - Always show labels for all items
	 * 'selected' - Only show label for selected item
	 * 'none' - Never show labels
	 * @default 'all'
	 */
	@property({ type: String, attribute: 'label-visibility', reflect: true })
	labelVisibility: LabelVisibility = 'all'

	/**
	 * Alignment of navigation items
	 * @default 'top'
	 */
	@property({ type: String, reflect: true })
	alignment: 'top' | 'center' | 'bottom' = 'top'

	/**
	 * Show tooltips when labels are hidden
	 * @default true
	 */
	@property({ type: Boolean })
	showTooltips = true

	/**
	 * Enable keyboard navigation
	 * @default true
	 */
	@property({ type: Boolean })
	keyboardNavigation = true

	/**
	 * Whether the navigation rail is expanded
	 * @default false
	 */
	@property({ type: Boolean, reflect: true })
	expanded = false

	// State
	@state()
	private focusedIndex = -1

	// Queries

	@queryAssignedElements({ flatten: true })
	private allElements!: Element[]

	private get navigationItems(): SchmancyNavigationRailItem[] {
		return this.allElements.filter(el => el.tagName === 'SCHMANCY-NAVIGATION-RAIL-ITEM') as SchmancyNavigationRailItem[]
	}

	connectedCallback() {
		super.connectedCallback()

		// Set up keyboard navigation if enabled
		if (this.keyboardNavigation) {
			this.addEventListener('keydown', this.handleKeyDown)
		}

		// Subscribe to active index changes with distinct values only
		this.activeIndex$
			.pipe(
				distinctUntilChanged(),
				tap(index => this.updateActiveStates(index)),
				takeUntil(this.disconnecting),
			)
			.subscribe()

		// Listen for navigate events from child items
		this.setupNavigateListener()

		// Set up label visibility
		this.updateLabelVisibility()

		// Update ARIA attributes
		this.setAttribute('role', 'navigation')
		this.setAttribute('aria-label', 'Main navigation')
	}

	updated(changedProperties: PropertyValues) {
		super.updated(changedProperties)

		if (changedProperties.has('labelVisibility')) {
			this.updateLabelVisibility()
		}

		if (changedProperties.has('activeValue')) {
			this.updateActiveByValue(this.activeValue)
		}

		if (changedProperties.has('expanded')) {
			this.updateLabelVisibility()
		}
	}

	private updateActiveStates(index: number) {
		this.navigationItems.forEach((item, i) => {
			const isActive = i === index
			item.active = isActive
			item.setAttribute('aria-selected', String(isActive))
			item.setAttribute('tabindex', isActive ? '0' : '-1')

			// Update activeValue when index changes
			if (isActive) {
				this._activeValue = item.value || item.label || ''
			}
		})
	}

	private updateActiveByValue(value: string) {
		const index = this.navigationItems.findIndex(item => item.getAttribute('value') === value || item.label === value)
		if (index >= 0) {
			this.activeIndex = index
		}
	}

	private updateLabelVisibility() {
		this.navigationItems.forEach((item, i) => {
			let shouldShowLabel = false

			// M3 Spec: In expanded state, always show all labels
			if (this.expanded) {
				shouldShowLabel = true
			} else {
				// In collapsed state, respect labelVisibility setting
				shouldShowLabel =
					this.labelVisibility === 'all' || (this.labelVisibility === 'selected' && i === this.activeIndex)
			}

			item.showLabel = shouldShowLabel

			// Add tooltips when labels are hidden (only in collapsed state)
			if (this.showTooltips && !shouldShowLabel && !this.expanded && item.label) {
				item.setAttribute('title', item.label)
			} else {
				item.removeAttribute('title')
			}
		})
	}

	// Note: Hover-based label showing removed for M3 compliance
	// Labels are now controlled via labelVisibility property and expanded state

	/**
	 * Programmatically expand the navigation rail
	 */
	expand() {
		this.expanded = true
	}

	/**
	 * Programmatically collapse the navigation rail
	 */
	collapse() {
		this.expanded = false
	}

	/**
	 * Toggle the navigation rail between expanded and collapsed states
	 */
	toggle() {
		this.expanded = !this.expanded
	}

	private handleKeyDown(event: KeyboardEvent) {
		const items = this.navigationItems
		if (items.length === 0) return

		let newIndex = this.focusedIndex >= 0 ? this.focusedIndex : this.activeIndex

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault()
				newIndex = (newIndex + 1) % items.length
				break
			case 'ArrowUp':
				event.preventDefault()
				newIndex = newIndex <= 0 ? items.length - 1 : newIndex - 1
				break
			case 'Home':
				event.preventDefault()
				newIndex = 0
				break
			case 'End':
				event.preventDefault()
				newIndex = items.length - 1
				break
			case 'Enter':
			case ' ':
				event.preventDefault()
				if (newIndex >= 0) {
					items[newIndex].click()
				}
				return
			default:
				return
		}

		this.focusedIndex = newIndex
		items[newIndex].focus()
	}

	private handleFabClick(event: Event) {
		event.stopPropagation()
		this.dispatchEvent(
			new CustomEvent('fab-click', {
				bubbles: true,
				composed: true,
			}),
		)
	}

	private handleMenuClick(event: Event) {
		event.stopPropagation()
		this.dispatchEvent(
			new CustomEvent('menu-click', {
				bubbles: true,
				composed: true,
			}),
		)
	}

	protected render() {
		// Host-level classes for the navigation rail
		const hostClasses = this.classMap({
			// Layout & Structure - Fixed width to prevent layout shift
			'flex flex-col': true,
			'w-20 h-full': true, // w-20 = 80px fixed width
			'box-border relative overflow-visible': true,
			'z-10 hover:z-[100]': true, // Base z-index, elevated on hover for overlay

			// Mobile responsive - smaller fixed width
			'md:w-20 w-14': true, // w-14 = 56px on mobile
		})

		// Rail container - programmatically controlled width
		const railClasses = this.classMap({
			// Layout & Structure
			'flex flex-col h-full': true,
			'box-border relative': true,

			// M3 Colors & Theme
			'bg-surface-default text-surface-on': true,

			// M3 Motion - smooth transitions for width and shadow
			'transition-all duration-300 ease-emphasized': true,

			// Collapsed state (default) - M3 standard 80px width
			'w-20 px-3 py-2 gap-1': !this.expanded, // w-20 = 80px base width
			'md:w-20 w-14': !this.expanded, // w-14 = 56px on mobile
			'md:px-3 px-2': !this.expanded, // Smaller padding on mobile

			// Expanded state - M3 expanded width with shadow
			'w-60 px-4 py-2 gap-1': this.expanded, // w-60 = 240px expanded width
			'md:w-60 w-50': this.expanded, // w-50 = 200px expansion on mobile
			'md:px-4 px-3': this.expanded, // Larger padding when expanded
			'shadow-lg': this.expanded, // M3 elevation 3 shadow when expanded
		})

		// Header section classes
		const headerClasses = this.classMap({
			'flex flex-col items-center gap-1 mb-2': true,
			// FAB and menu button spacing
			'[&_[slot="fab"]]:mb-2': true,
			'[&_[slot="menu"]]:mb-3': true,
		})

		// Navigation container classes with alignment
		const navClasses = this.classMap({
			'flex-1 flex flex-col gap-1': true,
			'min-h-0': true, // Allow flex shrinking and proper scroll container height calculation
			// Alignment variants
			'justify-start': this.alignment === 'top',
			'justify-center': this.alignment === 'center',
			'justify-end': this.alignment === 'bottom',
		})

		// Footer section classes
		const footerClasses = this.classMap({
			'flex flex-col items-center gap-1 mt-auto pt-2': true,
		})

		return html`
			<div
				class=${hostClasses}
			>
				<div class=${railClasses} part="rail">
					<div class=${headerClasses} part="header">
						<slot name="fab" @click=${this.handleFabClick}></slot>
						<slot name="menu" @click=${this.handleMenuClick}></slot>
						<slot name="header"></slot>
					</div>

					<nav class=${navClasses} part="nav" role="list">
						<schmancy-scroll hide direction="vertical">
							<slot @slotchange=${this.handleSlotChange}></slot>
						</schmancy-scroll>
					</nav>

					<div class=${footerClasses} part="footer">
						<slot name="footer"></slot>
					</div>
				</div>
			</div>
		`
	}

	private setupNavigateListener() {
		// Listen for navigate events from child items
		this.addEventListener('navigate', (e: Event) => {
			if (e instanceof CustomEvent) {
				const value = e.detail
				// Find the item that dispatched the event and update active state
				const itemIndex = this.navigationItems.findIndex(item => item.value === value || item.label === value)
				if (itemIndex >= 0) {
					this.activeIndex = itemIndex
					this._activeValue = value
				}
			}
		})
	}

	private handleSlotChange() {
		// Update items when slot content changes
		this.updateLabelVisibility()
		this.updateActiveStates(this.activeIndex)

		// Set ARIA attributes on items
		this.navigationItems.forEach((item, index) => {
			item.setAttribute('role', 'listitem')
			if (!item.hasAttribute('tabindex')) {
				item.setAttribute('tabindex', index === this.activeIndex ? '0' : '-1')
			}
		})
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-navigation-rail': SchmancyNavigationRail
	}
}
