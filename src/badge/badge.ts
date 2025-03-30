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
@customElement('sch-badge')
export class SchmancyBadgeV2 extends TailwindElement(css`
	:host {
		display: inline-flex;
	}

	.badge-content {
		display: flex;
		align-items: center;
		line-height: 1;
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
	 */
	private getSizeClasses(): string {
		switch (this.size) {
			case 'xs':
				return 'text-xs py-1 px-1.5 gap-0.5 leading-none'
			case 'sm':
				return 'text-xs py-1.5 px-2 gap-0.5 tracking-wide leading-none'
			case 'lg':
				return 'text-base py-2 px-3 gap-1 tracking-wide'
			case 'md':
			default:
				return 'text-sm py-1.5 px-2.5 gap-0.5'
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
	 */
	private getColorStyles() {
		const colors: Record<BadgeColor, { bg: string; text: string; border?: string }> = {
			primary: {
				bg: this.outlined ? 'transparent' : SchmancyTheme.sys.color.primary.container,
				text: this.outlined ? SchmancyTheme.sys.color.primary.default : SchmancyTheme.sys.color.primary.onContainer,
				border: this.outlined ? SchmancyTheme.sys.color.primary.default : undefined,
			},
			secondary: {
				bg: this.outlined ? 'transparent' : SchmancyTheme.sys.color.secondary.container,
				text: this.outlined ? SchmancyTheme.sys.color.secondary.default : SchmancyTheme.sys.color.secondary.onContainer,
				border: this.outlined ? SchmancyTheme.sys.color.secondary.default : undefined,
			},
			tertiary: {
				bg: this.outlined ? 'transparent' : SchmancyTheme.sys.color.tertiary.container,
				text: this.outlined ? SchmancyTheme.sys.color.tertiary.default : SchmancyTheme.sys.color.tertiary.onContainer,
				border: this.outlined ? SchmancyTheme.sys.color.tertiary.default : undefined,
			},
			success: {
				bg: this.outlined ? 'transparent' : SchmancyTheme.sys.color.success.container,
				text: this.outlined ? SchmancyTheme.sys.color.success.default : SchmancyTheme.sys.color.success.onContainer,
				border: this.outlined ? SchmancyTheme.sys.color.success.default : undefined,
			},
			warning: {
				bg: this.outlined ? 'transparent' : SchmancyTheme.sys.color.tertiary.container,
				text: this.outlined ? SchmancyTheme.sys.color.tertiary.default : SchmancyTheme.sys.color.tertiary.onContainer,
				border: this.outlined ? SchmancyTheme.sys.color.tertiary.default : undefined,
			},
			error: {
				bg: this.outlined ? 'transparent' : SchmancyTheme.sys.color.error.container,
				text: this.outlined ? SchmancyTheme.sys.color.error.default : SchmancyTheme.sys.color.error.onContainer,
				border: this.outlined ? SchmancyTheme.sys.color.error.default : undefined,
			},
			neutral: {
				bg: this.outlined ? 'transparent' : SchmancyTheme.sys.color.surface.high,
				text: this.outlined ? SchmancyTheme.sys.color.surface.on : SchmancyTheme.sys.color.surface.on,
				border: this.outlined ? SchmancyTheme.sys.color.outline : undefined,
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
			'shadow-sm': !this.outlined && this.size !== 'xs',
		}

		const styles = {
			borderColor: colorStyles.border,
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
		'sch-badge': SchmancyBadgeV2
	}
}
