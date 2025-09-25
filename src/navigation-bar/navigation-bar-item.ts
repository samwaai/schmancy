import { TailwindElement } from '@mixins/tailwind.mixin'
import { color } from '@schmancy/directives'
import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { SchmancyTheme } from '..'
import { BehaviorSubject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

/**
 * `<schmancy-navigation-bar-item>` component
 *
 * Individual navigation item for use within a navigation bar.
 * Represents a single destination with an icon and optional label following Material Design 3 specifications.
 *
 * @element schmancy-navigation-bar-item
 * @slot icon - Slot for custom icon content
 * @slot - Default slot for custom content
 *
 * @fires bar-item-click - When the item is clicked
 * @fires focus - When the item receives focus
 * @fires blur - When the item loses focus
 *
 * @example
 * <schmancy-navigation-bar-item icon="home" label="Home" active></schmancy-navigation-bar-item>
 *
 * @example
 * <schmancy-navigation-bar-item label="Custom">
 *   <span slot="icon">🏠</span>
 * </schmancy-navigation-bar-item>
 */
@customElement('schmancy-navigation-bar-item')
export class SchmancyNavigationBarItem extends TailwindElement(css`
	:host {
		display: flex;
		flex: 1;
		min-width: 48px;
		max-width: 168px;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
	}

	:host([disabled]) {
		pointer-events: none;
	}

	button {
		font-family: inherit;
		border: none;
		background: none;
		width: 100%;
		padding: 0;
		margin: 0;
		text-align: center;
		color: inherit;
	}

	button:focus {
		outline: none;
	}

	button:focus-visible {
		outline: 2px solid var(--focus-color);
		outline-offset: 2px;
		border-radius: 8px;
	}

	/* Ripple animation */
	@keyframes ripple {
		to {
			transform: scale(4);
			opacity: 0;
		}
	}

	.ripple-effect {
		position: absolute;
		border-radius: 50%;
		width: 20px;
		height: 20px;
		background-color: currentColor;
		opacity: 0.25;
		animation: ripple 0.6s ease-out;
		pointer-events: none;
	}
`) {
	/**
	 * Icon name for the navigation item (Material Symbols Outlined)
	 */
	@property({ type: String })
	icon = ''

	/**
	 * Label text for the navigation item
	 */
	@property({ type: String })
	label = ''

	/**
	 * Badge content (can be a number or short text)
	 */
	@property({ type: String })
	badge = ''

	/**
	 * Observable for active state
	 */
	private active$ = new BehaviorSubject<boolean>(false)

	/**
	 * Whether this item is currently active/selected
	 * @default false
	 */
	@property({ type: Boolean, reflect: true })
	get active() { return this.active$.value }
	set active(value: boolean) { this.active$.next(value) }

	/**
	 * Whether this item is disabled
	 * @default false
	 */
	@property({ type: Boolean, reflect: true })
	disabled = false

	/**
	 * Whether to hide labels (controlled by parent navigation bar)
	 * @default false
	 */
	@property({ type: Boolean, reflect: true })
	hideLabels = false

	/**
	 * Track ripple effects
	 */
	@state()
	private ripples: { x: number; y: number; id: number }[] = []

	/**
	 * Handle click events
	 */
	private handleClick = (event: MouseEvent) => {
		if (this.disabled) {
			event.preventDefault()
			event.stopPropagation()
			return
		}

		// Find the icon indicator div for ripple positioning
		const indicatorDiv = this.shadowRoot?.querySelector('.w-16.h-8')
		if (indicatorDiv) {
			const rect = indicatorDiv.getBoundingClientRect()
			const ripple = {
				x: event.clientX - rect.left,
				y: event.clientY - rect.top,
				id: Date.now()
			}
			this.ripples = [...this.ripples, ripple]
			setTimeout(() => {
				this.ripples = this.ripples.filter(r => r.id !== ripple.id)
			}, 600)
		}

		// Dispatch custom event
		this.dispatchEvent(new CustomEvent('bar-item-click', {
			detail: {
				icon: this.icon,
				label: this.label,
				active: this.active
			},
			bubbles: true,
			composed: true
		}))
	}

	/**
	 * Handle keyboard events for accessibility
	 */
	private handleKeyDown = (event: KeyboardEvent) => {
		if (this.disabled) return

		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			this.click()
		}
	}

	/**
	 * Method called by parent to set active state
	 */
	setActive(isActive: boolean) {
		this.active = isActive
	}

	connectedCallback() {
		super.connectedCallback()

		// Subscribe to active state changes
		this.active$.pipe(
			takeUntil(this.disconnecting)
		).subscribe(() => {
			this.requestUpdate()
		})
	}

	/**
	 * Format badge content for display
	 */
	private formatBadge(badge: string): string {
		// Convert to number if possible
		const num = Number(badge)
		if (!isNaN(num)) {
			// Show 99+ for large numbers
			return num > 99 ? '99+' : String(num)
		}
		// For text badges, limit to 3 characters
		return badge.slice(0, 3)
	}

	protected render() {
		const hasSlotContent = this.querySelector('[slot]') || (this.textContent?.trim() && !this.label)
		const badgeText = this.badge ? this.formatBadge(this.badge) : ''
		const showBadgeText = badgeText && badgeText !== '0'

		// Check for custom icon slot content
		const hasCustomIcon = this.querySelector('[slot="icon"]')

		// Main container classes - now the clickable area
		const containerClasses = {
			'relative flex flex-col items-center justify-center': true,
			'flex-1 min-w-[48px] max-w-[168px]': true,  // Fill available space
			'py-2 px-1 cursor-pointer': !this.disabled,
			'transition-all duration-200': true,
			'hover:bg-surface-container-high': !this.disabled && !this.active,
			'cursor-not-allowed opacity-38': this.disabled,
			'outline-none': true,
			'focus-visible:outline-2 focus-visible:outline-offset-2': true
		}

		// Icon indicator - just visual, not clickable
		const indicatorClasses = {
			'w-16 h-8 rounded-2xl': true,
			'flex items-center justify-center': true,
			'transition-all duration-200': true,
			'bg-secondary-container': this.active,
			'group-hover:bg-surface-container-highest': !this.active && !this.disabled,
			'relative overflow-hidden': true
		}

		const labelClasses = {
			'text-xs font-medium leading-4 mt-1': true,
			'text-center max-w-full': true,
			'overflow-hidden text-ellipsis whitespace-nowrap': true,
			'transition-all duration-200': true
		}

		const badgeClasses = {
			'absolute top-0 right-3': true,
			'min-w-[6px] h-1.5': !showBadgeText,
			'min-w-[16px] h-4': showBadgeText,
			'rounded-full': !showBadgeText,
			'rounded-lg': showBadgeText,
			'flex items-center justify-center': showBadgeText,
			'px-1': showBadgeText,
			'transition-all duration-200': true,
			'z-10': true
		}

		// Determine colors
		const containerColors = this.active
			? {
					color: SchmancyTheme.sys.color.secondary.onContainer
			  }
			: {
					color: SchmancyTheme.sys.color.surface.onVariant
			  }

		// Set CSS variables for focus state
		const styleVars = {
			'--focus-color': SchmancyTheme.sys.color.primary.default
		}

		return html`
			<button
				type="button"
				class=${this.classMap(containerClasses)}
				@click=${this.handleClick}
				@keydown=${this.handleKeyDown}
				?disabled=${this.disabled}
				aria-pressed=${this.active}
				aria-label=${this.label || 'Navigation item'}
				style=${this.styleMap({
					...styleVars,
					'outline-color': 'var(--focus-color)'
				})}
				${color(containerColors)}
			>
				<!-- Icon with indicator background -->
				<div class=${this.classMap(indicatorClasses)}>
					<!-- Ripple effects -->
					${this.ripples.map(
						ripple => html`
							<span
								class="ripple-effect"
								style=${this.styleMap({
									left: `${ripple.x}px`,
									top: `${ripple.y}px`,
									transform: 'translate(-50%, -50%)'
								})}
							></span>
						`
					)}

					${hasCustomIcon
						? html`<slot name="icon"></slot>`
						: this.icon
							? html`
									<schmancy-icon
										.fill=${this.active ? 1 : 0}
										class="relative z-10 flex items-center justify-center transition-all duration-200"
										style="--schmancy-icon-size: 24px;"
										aria-hidden="true"
									>
										${this.icon}
									</schmancy-icon>
							  `
							: hasSlotContent
								? html`<slot></slot>`
								: ''}
				</div>

				<!-- Label below icon -->
				${!this.hideLabels && this.label ? html`
					<span class=${this.classMap(labelClasses)}>${this.label}</span>
				` : ''}

				<!-- Badge -->
				${showBadgeText ? html`
					<span
						class=${this.classMap(badgeClasses)}
						aria-label="${badgeText} notifications"
						${color({
							bgColor: SchmancyTheme.sys.color.error.default,
							color: SchmancyTheme.sys.color.error.on
						})}
					>
						<span class="text-[10px] font-medium leading-none">${badgeText}</span>
					</span>
				` : this.badge ? html`
					<span
						class=${this.classMap(badgeClasses)}
						aria-label="Has notifications"
						${color({
							bgColor: SchmancyTheme.sys.color.error.default
						})}
					></span>
				` : ''}
			</button>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-navigation-bar-item': SchmancyNavigationBarItem
	}
}