import { $LitElement } from '@mixins/index'
import { html, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { BehaviorSubject, fromEvent, merge, takeUntil } from 'rxjs'
import { delay, distinctUntilChanged, tap } from 'rxjs/operators'

export type NavigationRailItemClickEvent = CustomEvent<{
	icon: string
	label: string
	value: string
	active: boolean
}>

/**
 * Material Design 3 Navigation Rail Item Component
 * @see https://m3.material.io/components/navigation-rail/overview
 *
 * `<schmancy-navigation-rail-item>` component
 *
 * Individual navigation item for use within a navigation rail.
 * Represents a single destination or action with an icon and optional label.
 *
 * @element schmancy-navigation-rail-item
 * @slot icon - Slot for the navigation item icon (e.g., schmancy-icon)
 * @slot - Default slot for custom content
 * @slot badge - Custom badge content
 *
 * @fires navigate - When the item is clicked
 *
 * @csspart container - The main item container
 * @csspart indicator - The active indicator
 * @csspart icon - The icon container
 * @csspart label - The label text
 * @csspart badge - The badge element
 *
 * @example
 * <schmancy-navigation-rail-item
 *   icon="home"
 *   label="Home"
 *   value="/home"
 *   badge="3"
 *   active>
 * </schmancy-navigation-rail-item>
 *
 * @example
 * <!-- Using 'selected' alias -->
 * <schmancy-navigation-rail-item
 *   icon="settings"
 *   label="Settings"
 *   value="/settings"
 *   selected>
 * </schmancy-navigation-rail-item>
 *
 * @example
 * <!-- With custom icon -->
 * <schmancy-navigation-rail-item label="Dashboard">
 *   <schmancy-icon slot="icon">dashboard</schmancy-icon>
 * </schmancy-navigation-rail-item>
 */
@customElement('schmancy-navigation-rail-item')
export class SchmancyNavigationRailItem extends $LitElement() {
	// Observable state
	private hovering$ = new BehaviorSubject<boolean>(false)
	private pressing$ = new BehaviorSubject<boolean>(false)
	private active$ = new BehaviorSubject<boolean>(false)

	// Properties
	/**
	 * Icon name (Material Symbols icon)
	 */
	@property({ type: String })
	icon = ''

	/**
	 * Label text for the navigation item
	 */
	@property({ type: String })
	label = ''

	/**
	 * Value associated with this item (useful for routing)
	 */
	@property({ type: String })
	value = ''

	/**
	 * Whether this item is currently active/selected
	 * @default false
	 */
	@property({ type: Boolean, reflect: true })
	get active() { return this.active$.value }
	set active(value: boolean) {
		this.active$.next(value)
	}

	/**
	 * Whether this item is currently selected (alias for active)
	 * @default false
	 */
	@property({ type: Boolean, reflect: true })
	get selected() { return this.active }
	set selected(value: boolean) { this.active = value }

	/**
	 * Badge text or number to display
	 */
	@property({ type: String })
	badge = ''

	/**
	 * Badge variant
	 */
	@property({ type: String })
	badgeVariant: 'error' | 'primary' | 'secondary' = 'error'

	/**
	 * Whether to show the label (controlled by parent rail)
	 * @default false
	 */
	@property({ type: Boolean, attribute: 'show-label' })
	showLabel = false

	/**
	 * Whether this item is disabled
	 * @default false
	 */
	@property({ type: Boolean, reflect: true })
	disabled = false

	/**
	 * Whether this is a nested item (sub-navigation)
	 * @default false
	 */
	@property({ type: Boolean, reflect: true })
	nested = false

	/**
	 * Whether this item represents a group separator
	 * @default false
	 */
	@property({ type: Boolean, reflect: true })
	group = false

	// State
	@state()
	private showRipple = false


	connectedCallback() {
		super.connectedCallback()

		// Set up hover tracking
		merge(
			fromEvent(this, 'mouseenter').pipe(tap(() => this.hovering$.next(true))),
			fromEvent(this, 'mouseleave').pipe(tap(() => this.hovering$.next(false)))
		).pipe(takeUntil(this.disconnecting)).subscribe()

		// Set up press tracking
		merge(
			fromEvent(this, 'mousedown').pipe(tap(() => this.pressing$.next(true))),
			fromEvent(this, 'mouseup').pipe(tap(() => this.pressing$.next(false))),
			fromEvent(this, 'mouseleave').pipe(tap(() => this.pressing$.next(false)))
		).pipe(takeUntil(this.disconnecting)).subscribe()


		// Ripple effect with M3 timing
		this.pressing$.pipe(
			tap(pressing => {
				if (pressing && !this.disabled) {
					this.showRipple = true
				}
			}),
			// M3 standard ripple duration
			delay(600),
			tap(() => this.showRipple = false),
			takeUntil(this.disconnecting)
		).subscribe()

		// Subscribe to active state changes for reactive updates
		this.active$.pipe(
			distinctUntilChanged(),
			tap((isActive) => {
				this.requestUpdate()
				// Update ARIA attributes reactively
				this.setAttribute('aria-selected', String(isActive))
				this.setAttribute('tabindex', isActive ? '0' : '-1')
			}),
			takeUntil(this.disconnecting)
		).subscribe()

		// Set ARIA attributes
		this.setAttribute('role', 'listitem')
		if (!this.hasAttribute('tabindex')) {
			this.setAttribute('tabindex', this.active ? '0' : '-1')
		}
	}

	updated(changedProperties: PropertyValues) {
		super.updated(changedProperties)

		// Active state is now handled by the BehaviorSubject subscription
		// So we don't need to duplicate it here

		if (changedProperties.has('disabled')) {
			this.setAttribute('aria-disabled', String(this.disabled))
		}

		if (changedProperties.has('label')) {
			this.setAttribute('aria-label', this.label)
		}
	}

	/**
	 * Handle click events
	 */
	private handleClick(event: Event) {
		if (this.disabled) {
			event.preventDefault()
			event.stopPropagation()
			return
		}

		// Emit navigate event with the value
		this.dispatchEvent(new CustomEvent('navigate', {
			detail: this.value || this.label,
			bubbles: true,
			composed: true
		}))

		// Visual feedback is handled by the ripple effect in connectedCallback
		// The parent rail will confirm and update via activeIndex
	}

	/**
	 * Handle keyboard events
	 */
	private handleKeyDown(event: KeyboardEvent) {
		if (this.disabled) return

		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			this.click()
		}
	}

	protected render() {
		const hasCustomIcon = this.querySelector('[slot="icon"]')
		const hasCustomContent = this.querySelector(':not([slot])')
		const hasCustomBadge = this.querySelector('[slot="badge"]')

		// M3 Navigation Rail Item classes with theme integration
		const containerClasses = this.classMap({
			// Layout & Spacing (M3 56px height, 12px vertical padding)
			'flex flex-col items-center justify-center': true,
			'min-h-14 w-full': true, // min-h-14 = 56px
			'py-3': true, // py-3 = 12px top/bottom
			'gap-1': true, // gap-1 = 4px

			// M3 Shape & Interaction
			'rounded-lg': true, // M3 large corner radius
			'cursor-pointer': true,
			'relative': true,
			'select-none': true,
			'box-border': true,

			// Colors & States
			'text-surface-onVariant': !this.active,
			'text-secondary-onContainer': this.active,
			'hover:bg-surface-containerHighest': true,

			// Transitions (M3 emphasized motion)
			'transition-all duration-150 ease-out': true,

			// Disabled state
			'pointer-events-none opacity-38': this.disabled,

			// Active ripple effect
			'[&>.ripple]:scale-100': this.showRipple,

			// Nested item adjustments
			'min-h-12 pl-8': this.nested, // 48px height, 32px left padding for nested

			// Group separator
			'mb-2 after:absolute after:bottom-[-4px] after:left-3 after:right-3 after:h-px after:bg-outline-variant after:opacity-12': this.group,
		})

		// Icon container with active indicator
		const iconContainerClasses = this.classMap({
			'flex items-center justify-center': true,
			'w-auto min-w-14 h-8': true, // 56px min-width, 32px height
			'flex-shrink-0 relative z-10': true,
		})

		// Active indicator behind icon
		const indicatorClasses = this.classMap({
			'absolute top-1/2 left-1/2 opacity-50': true,
			'w-14 h-8': true, // 56px x 32px
			'rounded-lg': true, // M3 large corner radius
			'bg-secondary-container': true,
			'transition-transform duration-150 ease-out': true,
			'z-0': true,
			// Transform based on active state
			'scale-0 -translate-x-1/2 -translate-y-1/2': !this.active,
			'scale-100 -translate-x-1/2 -translate-y-1/2': this.active,
		})

		// Icon styling
		const iconClasses = this.classMap({
			'text-2xl leading-none': !this.nested, // 24px icon for normal
			'text-xl leading-none': this.nested, // 20px icon for nested
			'relative z-10': true,
			// Material Symbols font variations handled via CSS custom properties
		})

		// Label styling
		const labelClasses = this.classMap({
			'text-xs font-medium leading-4': true, // 12px, medium weight, 16px line height
			'text-center': true,
			'overflow-hidden text-ellipsis whitespace-nowrap': true,
			'z-10 max-w-14 px-1': true, // max 56px width, 4px horizontal padding
			'hidden': !this.showLabel && !this.label, // Hide if not shown or no label
		})

		// Badge styling with dynamic colors
		const badgeClasses = this.classMap({
			'absolute top-2 right-3': true, // 8px from top, 12px from right
			'min-w-4 h-4': true, // 16px min-width and height
			'rounded-sm': true, // M3 small corner radius
			'text-xs font-semibold': true, // 11px, 600 weight
			'flex items-center justify-center': true,
			'px-1 box-border z-20': true, // 4px padding
			'animate-pulse': true, // Pulse animation
			// Dynamic background based on variant
			'bg-error-default text-error-on': this.badgeVariant === 'error',
			'bg-primary-default text-primary-on': this.badgeVariant === 'primary',
			'bg-secondary-default text-secondary-on': this.badgeVariant === 'secondary',
		})

		// Ripple effect classes
		const rippleClasses = this.classMap({
			'absolute inset-0 rounded-lg overflow-hidden z-0': true,
			'before:content-[""] before:absolute before:top-1/2 before:left-1/2': true,
			'before:w-0 before:h-0 before:rounded-full': true,
			'before:bg-current before:opacity-0': true,
			'before:-translate-x-1/2 before:-translate-y-1/2': true,
			'before:transition-all before:duration-300': true,
			// Active state
			'before:w-[200%] before:h-[200%] before:opacity-12': this.showRipple,
		})

		return html`
			<div
				class=${containerClasses}
				part="container"
				@click=${this.handleClick}
				@keydown=${this.handleKeyDown}
				style="outline: ${this.matches(':focus-visible') ? '2px solid var(--schmancy-sys-color-primary-default)' : 'none'}; outline-offset: 2px;"
			>
				<span class=${rippleClasses} aria-hidden="true"></span>

				${when(hasCustomContent,
					() => html`<slot></slot>`,
					() => html`
						<div class=${iconContainerClasses} part="icon">
							<span class=${indicatorClasses} part="indicator" aria-hidden="true"></span>
							${when(hasCustomIcon,
								() => html`<slot name="icon"></slot>`,
								() => when(this.icon,
									() => html`
										<span
											class=${iconClasses}
											part="icon-text"
											style="font-family: 'Material Symbols Outlined'; font-variation-settings: 'FILL' ${this.active ? '1' : '0'}, 'wght' 400, 'GRAD' 0, 'opsz' ${this.nested ? '20' : '24'};"
										>
											${this.icon}
										</span>
									`
								)
							)}
						</div>

						${when(this.label,
							() => html`<span class=${labelClasses} part="label">${this.label}</span>`
						)}
					`
				)}

				${when(this.badge,
					() => html`
						${when(hasCustomBadge,
							() => html`<slot name="badge"></slot>`,
							() => html`
								<span
									class=${badgeClasses}
									part="badge"
									aria-label="${this.badge} notifications"
								>
									${this.badge}
								</span>
							`
						)}
					`
				)}

				<!-- Tooltip shown via title attribute -->
				${when(this.hasAttribute('title'),
					() => html`
						<div class="
							absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2
							bg-surface-inverse text-surface-inverseOn
							px-2 py-1 rounded-sm text-xs whitespace-nowrap
							z-[1000] pointer-events-none opacity-0
							hover:opacity-100 hover:translate-x-0
							transition-all duration-150 ease-out
							-translate-x-1
						" aria-hidden="true">
							${this.getAttribute('title')}
						</div>
					`
				)}
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-navigation-rail-item': SchmancyNavigationRailItem
	}
}