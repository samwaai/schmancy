import { $LitElement } from '@mixins/index'
import { css, html, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { BehaviorSubject, fromEvent, merge, takeUntil } from 'rxjs'
import { tap, delay, distinctUntilChanged } from 'rxjs/operators'

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
export class SchmancyNavigationRailItem extends $LitElement(css`
	:host {
		display: block;
		position: relative;
		outline: none;
		--rail-item-height: 56px;
		--rail-item-icon-size: 24px;
		--rail-item-show-label: block;
	}

	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: var(--rail-item-height);
		width: 100%;
		/* M3 shape: large for navigation rail items */
		border-radius: var(--schmancy-sys-shape-corner-large);
		cursor: pointer;
		position: relative;
		box-sizing: border-box;
		color: var(--schmancy-sys-color-surface-onVariant);
		user-select: none;
		transition: all var(--schmancy-sys-motion-duration-short3) var(--schmancy-sys-motion-easing-emphasized);
		padding: 12px 0;
		gap: 4px;
	}

	/* Hover state */
	.container:hover {
		background-color: var(--schmancy-sys-color-surface-highest);
	}

	/* Focus state */
	:host(:focus-visible) .container {
		outline: 2px solid var(--schmancy-sys-color-primary-default);
		outline-offset: 2px;
	}

	/* Active indicator - positioned behind icon only */
	.icon-container {
		position: relative;
	}

	.indicator {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scale(0);
		width: 56px;
		height: 32px;
		/* M3 shape: large for active indicators */
		border-radius: var(--schmancy-sys-shape-corner-large);
		background-color: var(--schmancy-sys-color-secondary-container);
		transition: transform var(--schmancy-sys-motion-duration-short3) var(--schmancy-sys-motion-easing-emphasized);
		z-index: 0;
	}

	:host([active]) .indicator,
	:host([selected]) .indicator {
		transform: translate(-50%, -50%) scale(1);
	}

	:host([active]) .container,
	:host([selected]) .container {
		color: var(--schmancy-sys-color-secondary-onContainer);
	}


	/* Icon styles */
	.icon-container {
		display: flex;
		align-items: center;
		justify-content: center;
		width: auto;
		min-width: 56px;
		height: 32px;
		flex-shrink: 0;
		position: relative;
		z-index: 1;
	}

	.icon {
		font-family: 'Material Symbols Outlined';
		font-size: var(--rail-item-icon-size);
		line-height: 1;
		position: relative;
		z-index: 1;
		font-variation-settings:
			'FILL' 0,
			'wght' 400,
			'GRAD' 0,
			'opsz' 24;
	}

	:host([active]) .icon,
	:host([selected]) .icon {
		font-variation-settings:
			'FILL' 1,
			'wght' 400,
			'GRAD' 0,
			'opsz' 24;
	}

	/* Label styles */
	.label {
		font-size: 12px;
		font-weight: 500;
		line-height: 16px;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		z-index: 1;
		display: var(--rail-item-show-label, block);
		max-width: 56px;
		padding: 0 4px;
	}


	/* Badge styles */
	.badge {
		position: absolute;
		top: 8px;
		right: 12px;
		min-width: 16px;
		height: 16px;
		/* M3 shape: small for badges */
		border-radius: var(--schmancy-sys-shape-corner-small);
		background-color: var(--schmancy-sys-color-error-default);
		color: var(--schmancy-sys-color-error-on);
		font-size: 11px;
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 4px;
		box-sizing: border-box;
		z-index: 2;
		animation: badge-pulse 2s infinite;
	}

	@keyframes badge-pulse {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.1); }
	}

	/* Nested items (for sub-navigation) */
	:host([nested]) {
		--rail-item-height: 48px;
		--rail-item-icon-size: 20px;
	}

	:host([nested]) .container {
		padding-left: 32px;
	}

	/* Disabled state */
	:host([disabled]) {
		pointer-events: none;
		opacity: 0.38;
	}

	/* Ripple effect with M3 motion */
	.ripple {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		border-radius: inherit;
		overflow: hidden;
		z-index: 0;
	}

	.ripple::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0;
		height: 0;
		border-radius: 50%;
		background: currentColor;
		opacity: 0;
		transform: translate(-50%, -50%);
		/* M3 motion: medium duration for ripple effect */
		transition: width var(--schmancy-sys-motion-duration-medium2), height var(--schmancy-sys-motion-duration-medium2), opacity var(--schmancy-sys-motion-duration-medium2);
	}

	:host(:active) .ripple::before {
		width: 200%;
		height: 200%;
		/* M3 pressed state opacity */
		opacity: var(--schmancy-sys-state-pressed-opacity);
	}

	/* Tooltip styles (shown via title attribute) */
	:host([title]:hover)::after {
		content: attr(title);
		position: absolute;
		left: calc(100% + 8px);
		top: 50%;
		transform: translateY(-50%);
		background: var(--schmancy-sys-color-inverseSurface);
		color: var(--schmancy-sys-color-inverseOnSurface);
		padding: 4px 8px;
		/* M3 shape: extra small for tooltips */
		border-radius: var(--schmancy-sys-shape-corner-extraSmall);
		font-size: 12px;
		white-space: nowrap;
		z-index: 1000;
		pointer-events: none;
		animation: tooltip-fade-in var(--schmancy-sys-motion-duration-short3) var(--schmancy-sys-motion-easing-standard);
	}

	@keyframes tooltip-fade-in {
		from {
			opacity: 0;
			transform: translateY(-50%) translateX(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(-50%) translateX(0);
		}
	}

	/* Group item styles */
	:host([group]) {
		margin-bottom: 8px;
	}

	:host([group])::after {
		content: '';
		position: absolute;
		bottom: -4px;
		left: 12px;
		right: 12px;
		height: 1px;
		background: var(--schmancy-sys-color-outlineVariant);
		opacity: 0.12;
	}
`) {
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

		const containerClasses = {
			container: true,
			rippling: this.showRipple
		}

		const badgeStyles = {
			'background-color': `var(--schmancy-sys-color-${this.badgeVariant}-default)`,
			'color': `var(--schmancy-sys-color-${this.badgeVariant}-on)`
		}

		return html`
			<div
				class=${this.classMap(containerClasses)}
				part="container"
				@click=${this.handleClick}
				@keydown=${this.handleKeyDown}
			>
				<span class="ripple" aria-hidden="true"></span>

				${when(hasCustomContent,
					() => html`<slot></slot>`,
					() => html`
						<div class="icon-container" part="icon">
							<span class="indicator" part="indicator" aria-hidden="true"></span>
							${when(hasCustomIcon,
								() => html`<slot name="icon"></slot>`,
								() => when(this.icon,
									() => html`<span class="icon">${this.icon}</span>`
								)
							)}
						</div>

						${when(this.label,
							() => html`<span class="label" part="label">${this.label}</span>`
						)}
					`
				)}

				${when(this.badge,
					() => html`
						${when(hasCustomBadge,
							() => html`<slot name="badge"></slot>`,
							() => html`
								<span
									class="badge"
									part="badge"
									style=${this.styleMap(badgeStyles)}
									aria-label="${this.badge} notifications"
								>
									${this.badge}
								</span>
							`
						)}
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