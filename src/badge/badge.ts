import { TailwindElement } from '@mixins/index'
import { color } from '@schmancy/directives'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { SchmancyTheme } from '..'

/**
 * Badge color types for predefined styles
 */
export type BadgeColor = 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error' | 'neutral'

/**
 * Badge size variants
 */
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg'

/**
 * Badge shape variants
 */
export type BadgeShape = 'rounded' | 'pill' | 'square'

/**
 * @element sch-badge
 * A versatile badge component for status indicators, labels, and counts
 *
 * @slot - The content of the badge (text or HTML)
 * @slot icon - Optional icon to display before the content
 *
 * @csspart badge - The badge element container
 * @csspart content - The content container
 * @csspart icon - The icon container
 */
@customElement('schmancy-badge')
export class SchmancyBadgeV2 extends TailwindElement(css`
	:host {
		display: inline-flex;
	}

	.badge-content {
		display: flex;
		align-items: center;
		line-height: 1;
		letter-spacing: 0.01em;
		font-kerning: normal;
	}

	/* Improved vertical alignment for icon and text */
	::slotted(*) {
		vertical-align: middle;
	}

	/* Add space between icon and text */
	.icon-container {
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
	}

	/* Icon spacing adjustments - based on golden ratio principles */
	.icon-container + .badge-content {
		margin-left: 0.38em; /* Approximately 1/1.618 of 0.618em */
	}

	/* Ensure the icon is properly centered */
	schmancy-icon {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Elegant hover effect for better interactivity */
	:host([outlined]) div[part="badge"] {
		transition: all 0.2s ease;
	}

	:host([outlined]) div[part="badge"]:hover {
		filter: brightness(0.95);
		transform: translateY(-1px);
	}

	/* Non-outlined badges get subtle hover effects */
	:host(:not([outlined])) div[part="badge"]:hover {
		filter: brightness(0.98);
	}

	/* Enhanced pulse animation for better attention-getting */
	@keyframes elegant-pulse {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.85;
		}
	}

	.animate-pulse {
		animation: elegant-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
`) {
	/**
	 * The color variant of the badge
	 * @attr
	 */
	@property({ type: String, reflect: true })
	color: BadgeColor = 'primary'

	/**
	 * The size of the badge
	 * @attr
	 */
	@property({ type: String, reflect: true })
	size: BadgeSize = 'md'

	/**
	 * The shape of the badge
	 * @attr
	 */
	@property({ type: String, reflect: true })
	shape: BadgeShape = 'pill'

	/**
	 * Whether the badge has an outlined style
	 * @attr
	 */
	@property({ type: Boolean, reflect: true })
	outlined = false

	/**
	 * Custom icon name to display (if no icon slot is provided)
	 * @attr
	 */
	@property({ type: String })
	icon = ''

	/**
	 * Whether to make the badge pulse to draw attention
	 * @attr
	 */
	@property({ type: Boolean, reflect: true })
	pulse = false

	/**
	 * Convert the size to appropriate Tailwind classes for the badge container
	 * Using harmonious padding ratios based on golden ratio principles
	 * Refined for more elegant proportions
	 */
	private getSizeClasses(): string {
		switch (this.size) {
			case 'xs':
				return 'text-xs py-0.75 px-1.5 gap-0.5 leading-none'
			case 'sm':
				return 'text-xs py-1.5 px-2.5 gap-0.5 tracking-wide leading-none'
			case 'lg':
				return 'text-base py-2 px-4 gap-1 tracking-wide'
			case 'md':
			default:
				return 'text-sm py-1.5 px-3 gap-0.5'
		}
	}

	/**
	 * Get shape classes based on selected shape
	 */
	private getShapeClasses(): string {
		switch (this.shape) {
			case 'square':
				return 'rounded'
			case 'rounded':
				return 'rounded-md'
			case 'pill':
			default:
				return 'rounded-full'
		}
	}

	/**
	 * Get icon size based on badge size with harmonious proportions
	 * Using golden ratio-inspired proportions relative to text size
	 */
	private getIconSize(): string {
		switch (this.size) {
			case 'xs':
				return '11px' // Approximately 0.9 × text size (12px × 0.9)
			case 'sm':
				return '13px' // Approximately 1.1 × text size (12px × 1.1)
			case 'lg':
				return '18px' // Approximately 1.1 × text size (16px × 1.1)
			case 'md':
			default:
				return '15px' // Approximately 1.1 × text size (14px × 1.1)
		}
	}

	/**
	 * Get additional styling for specific sizes
	 */
	private getExoticStyles(): Record<string, string> {
		const styles: Record<string, string> = {}

		if (this.size === 'lg') {
			styles.letterSpacing = '0.03em'
			styles.fontWeight = '500'
		}

		if (this.size === 'sm') {
			styles.letterSpacing = '0.02em'
		}

		return styles
	}

	/**
	 * Get background and text colors based on selected color variant
	 * Enhanced for more elegant color combinations with refined contrasts
	 */
	private getColorStyles() {
		const colors: Record<BadgeColor, { bg: string; text: string; border?: string }> = {
			primary: {
				bg: this.outlined ? 'transparent' : `color-mix(in srgb, ${SchmancyTheme.sys.color.primary.container} 92%, ${SchmancyTheme.sys.color.primary.default} 8%)`,
				text: this.outlined ? SchmancyTheme.sys.color.primary.default : SchmancyTheme.sys.color.primary.onContainer,
				border: this.outlined ? `color-mix(in srgb, ${SchmancyTheme.sys.color.primary.default} 90%, ${SchmancyTheme.sys.color.surface.highest} 10%)` : undefined,
			},
			secondary: {
				bg: this.outlined ? 'transparent' : `color-mix(in srgb, ${SchmancyTheme.sys.color.secondary.container} 95%, ${SchmancyTheme.sys.color.secondary.default} 5%)`,
				text: this.outlined ? SchmancyTheme.sys.color.secondary.default : SchmancyTheme.sys.color.secondary.onContainer,
				border: this.outlined ? `color-mix(in srgb, ${SchmancyTheme.sys.color.secondary.default} 85%, ${SchmancyTheme.sys.color.surface.highest} 15%)` : undefined,
			},
			tertiary: {
				bg: this.outlined ? 'transparent' : `color-mix(in srgb, ${SchmancyTheme.sys.color.tertiary.container} 94%, ${SchmancyTheme.sys.color.tertiary.default} 6%)`,
				text: this.outlined ? SchmancyTheme.sys.color.tertiary.default : SchmancyTheme.sys.color.tertiary.onContainer,
				border: this.outlined ? `color-mix(in srgb, ${SchmancyTheme.sys.color.tertiary.default} 88%, ${SchmancyTheme.sys.color.surface.highest} 12%)` : undefined,
			},
			success: {
				bg: this.outlined ? 'transparent' : `color-mix(in srgb, ${SchmancyTheme.sys.color.success.container} 90%, ${SchmancyTheme.sys.color.success.default} 10%)`,
				text: this.outlined ? SchmancyTheme.sys.color.success.default : SchmancyTheme.sys.color.success.onContainer,
				border: this.outlined ? `color-mix(in srgb, ${SchmancyTheme.sys.color.success.default} 85%, ${SchmancyTheme.sys.color.surface.bright} 15%)` : undefined,
			},
			warning: {
				bg: this.outlined ? 'transparent' : `color-mix(in srgb, ${SchmancyTheme.sys.color.tertiary.container} 85%, ${SchmancyTheme.sys.color.tertiary.default} 15%)`,
				text: this.outlined ? SchmancyTheme.sys.color.tertiary.default : SchmancyTheme.sys.color.tertiary.onContainer,
				border: this.outlined ? `color-mix(in srgb, ${SchmancyTheme.sys.color.tertiary.default} 90%, ${SchmancyTheme.sys.color.surface.highest} 10%)` : undefined,
			},
			error: {
				bg: this.outlined ? 'transparent' : `color-mix(in srgb, ${SchmancyTheme.sys.color.error.container} 92%, ${SchmancyTheme.sys.color.error.default} 8%)`,
				text: this.outlined ? SchmancyTheme.sys.color.error.default : SchmancyTheme.sys.color.error.onContainer,
				border: this.outlined ? `color-mix(in srgb, ${SchmancyTheme.sys.color.error.default} 88%, ${SchmancyTheme.sys.color.surface.bright} 12%)` : undefined,
			},
			neutral: {
				bg: this.outlined ? 'transparent' : `color-mix(in srgb, ${SchmancyTheme.sys.color.surface.high} 95%, ${SchmancyTheme.sys.color.outline} 5%)`,
				text: this.outlined ? `color-mix(in srgb, ${SchmancyTheme.sys.color.surface.on} 95%, ${SchmancyTheme.sys.color.surface.default} 5%)` : SchmancyTheme.sys.color.surface.on,
				border: this.outlined ? `color-mix(in srgb, ${SchmancyTheme.sys.color.outline} 85%, ${SchmancyTheme.sys.color.surface.highest} 15%)` : undefined,
			},
		}

		return colors[this.color]
	}

	render() {
		const sizeClasses = this.getSizeClasses()
		const shapeClasses = this.getShapeClasses()
		const colorStyles = this.getColorStyles()
		const iconSize = this.getIconSize()
		const exoticStyles = this.getExoticStyles()

		const badgeClasses = {
			'inline-flex items-center justify-center font-medium': true,
			[sizeClasses]: true,
			[shapeClasses]: true,
			'animate-pulse': this.pulse,
			'border border-solid': this.outlined,
			'shadow-sm': !this.outlined && this.size === 'sm',
			'shadow': !this.outlined && this.size === 'md',
			'shadow-md': !this.outlined && this.size === 'lg',
		}

		// Refined styles for a more elegant look
		const styles = {
			borderColor: colorStyles.border,
			transition: 'all 0.2s ease',
			...(this.outlined ? {
				backdropFilter: 'blur(4px)',
				borderWidth: '1px',
			} : {}),
			...(this.size === 'lg' && !this.outlined ? {
				boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1)'
			} : {}),
			...exoticStyles,
		}

		return html`
			<div
				part="badge"
				class="${this.classMap(badgeClasses)}"
				style="${this.styleMap(styles)}"
				${color({
					bgColor: colorStyles.bg,
					color: colorStyles.text,
				})}
			>
				<!-- Icon slot or named icon -->
				<slot name="icon">
					${this.icon
						? html`
								<div part="icon" class="icon-container flex-shrink-0 flex items-center justify-center">
									<schmancy-icon .size=${iconSize} class="flex items-center">${this.icon}</schmancy-icon>
								</div>
							`
						: ''}
				</slot>

				<!-- Content -->
				<div part="content" class="badge-content">
					<slot></slot>
				</div>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'sch-badge': SchmancyBadgeV2,
		'schmancy-badge': SchmancyBadgeV2
	}
}


// Register the component with the legacy tag name for backward compatibility
@customElement('sch-badge')
export class ScBadgeV2 extends SchmancyBadgeV2 {}
