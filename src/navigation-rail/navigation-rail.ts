import { $LitElement } from '@mixins/index'
import { css, html, PropertyValues } from 'lit'
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
export class SchmancyNavigationRail extends $LitElement(css`
	:host {
		display: flex;
		flex-direction: column;
		width: 80px;
		height: 100%;
		background-color: var(--schmancy-sys-color-surface-container);
		color: var(--schmancy-sys-color-surface-on);
		box-sizing: border-box;
		position: relative;
		overflow: visible;
	}

	/* Rail container */
	.rail {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 8px 12px;
		gap: 4px;
		box-sizing: border-box;
	}

	/* Header section */
	.header {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		margin-bottom: 8px;
	}

	/* Navigation container */
	.nav {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 4px;
		overflow-y: auto;
		overflow-x: hidden;
		scrollbar-width: thin;
		scrollbar-color: var(--schmancy-sys-color-surface-onVariant) transparent;
	}

	.nav::-webkit-scrollbar {
		width: 4px;
	}

	.nav::-webkit-scrollbar-track {
		background: transparent;
	}

	.nav::-webkit-scrollbar-thumb {
		background-color: var(--schmancy-sys-color-surface-onVariant);
		border-radius: 2px;
		opacity: 0.5;
	}

	/* Footer section */
	.footer {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		margin-top: auto;
		padding-top: 8px;
	}

	/* FAB styles */
	::slotted([slot="fab"]) {
		margin-bottom: 8px;
	}

	/* Menu button styles */
	::slotted([slot="menu"]) {
		margin-bottom: 12px;
	}

	/* Alignment variants */
	:host([alignment="top"]) .nav {
		justify-content: flex-start;
	}

	:host([alignment="center"]) .nav {
		justify-content: center;
	}

	:host([alignment="bottom"]) .nav {
		justify-content: flex-end;
	}

	/* Label visibility states */
	:host([label-visibility="none"]) ::slotted(schmancy-navigation-rail-item) {
		--rail-item-show-label: none;
	}

	:host([label-visibility="selected"]) ::slotted(schmancy-navigation-rail-item:not([active])) {
		--rail-item-show-label: none;
	}


	/* Group header styles */
	::slotted(.group-header) {
		padding: 8px 12px;
		font-size: 12px;
		font-weight: 500;
		color: var(--schmancy-sys-color-surface-onVariant);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* Divider styles */
	::slotted(schmancy-divider) {
		margin: 8px 0;
	}

	/* Responsive behavior */
	@media (max-width: 768px) {
		:host {
			width: 56px;
		}

		.rail {
			padding: 8px;
		}
	}
`) {
	// Observable state
	private activeIndex$ = new BehaviorSubject<number>(-1)

	// Properties
	/**
	 * The currently active item index
	 * @default -1
	 */
	@property({ type: Number })
	get activeIndex() { return this.activeIndex$.value }
	set activeIndex(value: number) { this.activeIndex$.next(value) }

	/**
	 * The currently active item value (for programmatic selection)
	 */
	@property({ type: String })
	get activeValue() { return this._activeValue }
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

	// State
	@state()
	private focusedIndex = -1

	// Queries

	@queryAssignedElements({ flatten: true })
	private allElements!: Element[]

	private get navigationItems(): SchmancyNavigationRailItem[] {
		return this.allElements.filter(
			el => el.tagName === 'SCHMANCY-NAVIGATION-RAIL-ITEM'
		) as SchmancyNavigationRailItem[]
	}

	connectedCallback() {
		super.connectedCallback()

		// Set up keyboard navigation if enabled
		if (this.keyboardNavigation) {
			this.addEventListener('keydown', this.handleKeyDown)
		}

		// Subscribe to active index changes with distinct values only
		this.activeIndex$.pipe(
			distinctUntilChanged(),
			tap(index => this.updateActiveStates(index)),
			takeUntil(this.disconnecting)
		).subscribe()

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
		const index = this.navigationItems.findIndex(
			item => item.getAttribute('value') === value || item.label === value
		)
		if (index >= 0) {
			this.activeIndex = index
		}
	}


	private updateLabelVisibility() {
		this.navigationItems.forEach((item, i) => {
			const shouldShowLabel =
				this.labelVisibility === 'all' ||
				(this.labelVisibility === 'selected' && i === this.activeIndex)

			item.showLabel = shouldShowLabel

			// Add tooltips when labels are hidden
			if (this.showTooltips && !shouldShowLabel && item.label) {
				item.setAttribute('title', item.label)
			} else {
				item.removeAttribute('title')
			}
		})
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
		this.dispatchEvent(new CustomEvent('fab-click', {
			bubbles: true,
			composed: true
		}))
	}

	private handleMenuClick(event: Event) {
		event.stopPropagation()
		this.dispatchEvent(new CustomEvent('menu-click', {
			bubbles: true,
			composed: true
		}))
	}

	protected render() {
		return html`
			<div class="rail" part="rail">
				<div class="header" part="header">
					<slot name="fab" @click=${this.handleFabClick}></slot>
					<slot name="menu" @click=${this.handleMenuClick}></slot>
					<slot name="header"></slot>
				</div>

				<nav class="nav" part="nav" role="list">
					<slot @slotchange=${this.handleSlotChange}></slot>
				</nav>

				<div class="footer" part="footer">
					<slot name="footer"></slot>
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
				const itemIndex = this.navigationItems.findIndex(
					item => item.value === value || item.label === value
				)
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