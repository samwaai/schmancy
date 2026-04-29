import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { color } from '@schmancy/directives'
import { SchmancyTheme } from '@schmancy/theme/theme.interface'

/**
 * M3 avatar sizes: 20dp → 24dp → 32dp → 40dp → 48dp → 64dp
 * - xxs: Ultra-compact (20px) - for menu cards
 * - xs: 24px - M3 compact
 * - sm: 32px - M3 small
 * - md: 40px - M3 medium (default)
 * - lg: 48px - M3 large
 * - xl: 64px - M3 extra large
 */
export type AvatarSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type AvatarColor = 'primary' | 'secondary' | 'tertiary' | 'success' | 'error' | 'neutral'
export type AvatarShape = 'circle' | 'square'
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away' | 'none'

/**
 * A customizable avatar component that displays initials or an icon
 * Designed to match the Schmancy design system
 *
 * @element schmancy-avatar
 *
 * @property {string} initials - Text initials to display (limited to 2 characters)
 * @property {string} src - URL of an image to display
 * @property {string} icon - Name of an icon to display
 * @property {AvatarSize} size - Size of the avatar (xs, sm, md, lg, xl)
 * @property {AvatarColor} color - Color theme of the avatar
 * @property {AvatarShape} shape - Shape of the avatar (circle or square)
 * @property {boolean} bordered - Whether to add a border around the avatar
 * @property {AvatarStatus} status - Optional status indicator to display
 *
 * @example
 * <schmancy-avatar
 *   initials="JD"
 *   size="md"
 *   color="primary"
 * ></schmancy-avatar>
 */
@customElement('schmancy-avatar')
export class SchmancyAvatar extends $LitElement() {
	@property({ type: String }) initials: string = ''
	@property({ type: String }) src: string = ''
	@property({ type: String }) icon: string = ''
	@property({ type: String }) size: AvatarSize = 'md'
	@property({ type: String }) color: AvatarColor = 'primary'
	@property({ type: String }) shape: AvatarShape = 'circle'
	@property({ type: Boolean }) bordered: boolean = false
	@property({ type: String }) status: AvatarStatus = 'none'

	render() {
		// Determine content to display (image, initials, or icon)
		let content
		if (this.src) {
			content = html`<img class="w-full h-full object-cover" src="${this.src}" alt="Avatar" />`
		} else if (this.initials) {
			content = html`<span class="text-center font-medium">${this.initials.substring(0, 2).toUpperCase()}</span>`
		} else if (this.icon) {
			content = html`<schmancy-icon>${this.icon}</schmancy-icon>`
		} else {
			content = html`<schmancy-icon>person</schmancy-icon>`
		}

		// Size classes - M3 aligned: 20dp → 24dp → 32dp → 40dp → 48dp → 64dp
		const sizeClasses = {
			xxs: 'w-5 h-5 text-[8px]', // 20px - Ultra-compact
			xs: 'w-6 h-6 text-xs',     // 24px - M3 compact
			sm: 'w-8 h-8 text-sm',     // 32px - M3 small
			md: 'w-10 h-10 text-base', // 40px - M3 medium (default)
			lg: 'w-12 h-12 text-lg',   // 48px - M3 large
			xl: 'w-16 h-16 text-xl',   // 64px - M3 extra large
		}

		// Shape classes
		const shapeClasses = {
			circle: 'rounded-full',
			square: 'rounded-md',
		}

		// Combine classes
		const avatarClasses = {
			'relative flex items-center justify-center overflow-hidden': true,
			[sizeClasses[this.size]]: true,
			[shapeClasses[this.shape]]: true,
			'border-2 border-surface-container': this.bordered,
		}

		// Get theme colors
		const colorAttrs = this.getColorAttributes()

		return html`
			<div class="${this.classMap(avatarClasses)}" ${colorAttrs}>
				${content} ${this.status !== 'none' ? this.renderStatusIndicator() : ''}
			</div>
		`
	}

	private getColorAttributes() {
		const colorMap = {
			primary: {
				bgColor: SchmancyTheme.sys.color.primary.container,
				color: SchmancyTheme.sys.color.primary.onContainer,
			},
			secondary: {
				bgColor: SchmancyTheme.sys.color.secondary.container,
				color: SchmancyTheme.sys.color.secondary.onContainer,
			},
			tertiary: {
				bgColor: SchmancyTheme.sys.color.tertiary.container,
				color: SchmancyTheme.sys.color.tertiary.onContainer,
			},
			success: {
				bgColor: SchmancyTheme.sys.color.success.container,
				color: SchmancyTheme.sys.color.success.onContainer,
			},
			error: {
				bgColor: SchmancyTheme.sys.color.error.container,
				color: SchmancyTheme.sys.color.error.onContainer,
			},
			neutral: {
				bgColor: SchmancyTheme.sys.color.surface.container,
				color: SchmancyTheme.sys.color.surface.on,
			},
		}

		return color(colorMap[this.color])
	}

	private renderStatusIndicator() {
		const statusColors = {
			online: SchmancyTheme.sys.color.success.default,
			offline: SchmancyTheme.sys.color.surface.onVariant,
			busy: SchmancyTheme.sys.color.error.default,
			away: SchmancyTheme.sys.color.tertiary.default,
		}

		const sizeMap = {
			xxs: 'w-1 h-1',
			xs: 'w-1.5 h-1.5',
			sm: 'w-2 h-2',
			md: 'w-2.5 h-2.5',
			lg: 'w-3 h-3',
			xl: 'w-4 h-4',
		}

		const statusClasses = {
			'absolute bottom-0 right-0 rounded-full border-2 border-surface-default': true,
			[sizeMap[this.size]]: true,
		}

		return html`
			<div class="${this.classMap(statusClasses)}" style="background-color: ${statusColors[this.status]};"></div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-avatar': SchmancyAvatar
	}
}
