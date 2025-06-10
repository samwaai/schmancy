import { TailwindElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import typographyStyle from './typography.scss?inline'
// based on M3 typography https://m3.material.io/styles/typography/overview

/**
 * @element schmancy-typography
 * @slot - The text for the typography.
 */
@customElement('schmancy-typography')
export class SchmancyTypography extends TailwindElement(typographyStyle) {
	/**
	 * @attr type - The type of the typography.
	 * @default inherit
	 * @type {'display' | 'headline' | 'title' | 'subtitle' | 'body' | 'label' | 'caption'}
	 */
	@property({ type: String, reflect: true })
	type: 'display' | 'headline' | 'title' | 'subtitle' | 'body' | 'label' | 'caption'

	/**
	 * @attr token - The token of the typography.
	 * @default 'md'
	 * @type {'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'}
	 */
	@property({ type: String, reflect: true })
	token: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'md'

	/**
	 * @attr
	 * @default inherit
	 * @type {'left' |'center' |'right'}
	 */
	@property({ type: String })
	align: 'left' | 'center' | 'justify' | 'right' | undefined

	/**
	 * @attr
	 * @default inherit
	 * @type {'normal' | 'medium' |'bold'}
	 * @public
	 */
	@property({ type: String })
	weight: 'normal' | 'medium' | 'bold' | undefined

	@property({ type: String }) lineHeight: string | undefined
	/**
	 *
	 * @attr
	 * @default inherit
	 * @type {'uppercase' |'lowercase' |'capitalize' |'normal'}
	 * @public
	 */
	@property({ type: String }) transform: 'uppercase' | 'lowercase' | 'capitalize' | 'normal' | undefined

	@property({ type: Number }) maxLines: 1 | 2 | 3 | 4 | 5 | 6 | undefined

	@property({ type: String }) letterSpacing: string | undefined
	@property({ type: String }) fontSize: string | undefined

	render() {
		// Check if the host element has layout-related classes
		const hasFlexClass = this.classList?.contains('flex')
		const hasGridClass = this.classList?.contains('grid')
		const hasInlineFlexClass = this.classList?.contains('inline-flex')
		const hasInlineGridClass = this.classList?.contains('inline-grid')
		
		// Determine which element to use based on layout classes
		const isLayoutContainer = hasFlexClass || hasGridClass || hasInlineFlexClass || hasInlineGridClass
		
		// Extract layout-related classes from the host element
		const layoutClasses: string[] = []
		if (this.classList) {
			this.classList.forEach((className) => {
				// Include flex/grid related classes
				if (className.startsWith('flex') || 
					className.startsWith('grid') || 
					className.startsWith('gap') || 
					className.startsWith('items') || 
					className.startsWith('justify') || 
					className.startsWith('content') || 
					className.startsWith('place') ||
					className === 'inline-flex' ||
					className === 'inline-grid') {
					layoutClasses.push(className)
				}
			})
		}

		const classes = {
			// Apply layout classes if this is a layout container
			...layoutClasses.reduce((acc, cls) => ({ ...acc, [cls]: true }), {}),
			
			// Typography-specific classes
			'hyphens-none': true,
			'text-center': this.align === 'center',
			'text-start': this.align === 'left',
			'text-right': this.align === 'right',
			'text-justify': this.align === 'justify',
			'line-clamp-1': this.maxLines === 1,
			'line-clamp-2': this.maxLines === 2,
			'line-clamp-3': this.maxLines === 3,
			'line-clamp-4': this.maxLines === 4,
			'line-clamp-5': this.maxLines === 5,
			'line-clamp-6': this.maxLines === 6,
			'line-clamp-none': this.maxLines === undefined,

			// Display
			'text-[72px] tracking-[-0.5px] leading-[80px]': this.type === 'display' && this.token === '2xl',
			'text-[64px] tracking-[-0.25px] leading-[72px]': this.type === 'display' && this.token === 'xl',
			'text-[57px] tracking-[-0.25px] leading-[64px]': this.type === 'display' && this.token === 'lg',
			'text-[45px] tracking-[0px] leading-[52px]': this.type === 'display' && this.token === 'md',
			'text-[36px] tracking-[0px] leading-[44px]': this.type === 'display' && this.token === 'sm',
			'text-[28px] tracking-[0px] leading-[36px]': this.type === 'display' && this.token === 'xs',

			// Headline
			'text-[36px] tracking-[0px] leading-[44px] headline-xl': this.type === 'headline' && this.token === 'xl',
			'text-[32px] tracking-[0px] leading-[40px] headline-lg': this.type === 'headline' && this.token === 'lg',
			'text-[28px] tracking-[0px] leading-[36px] headline-md': this.type === 'headline' && this.token === 'md',
			'text-[24px] tracking-[0px] leading-[32px] headline-sm': this.type === 'headline' && this.token === 'sm',
			'text-[20px] tracking-[0px] leading-[28px] headline-xs': this.type === 'headline' && this.token === 'xs',

			// Title
			'text-[24px] tracking-[0px] leading-[32px] title-xl': this.type === 'title' && this.token === 'xl',
			'text-[22px] tracking-[0px] leading-[28px] title-lg': this.type === 'title' && this.token === 'lg',
			'font-medium text-[16px] tracking-[0.15px] leading-[24px] title-md': this.type === 'title' && this.token === 'md',
			'font-medium text-[14px] tracking-[0.1px] leading-[20px] title-sm': this.type === 'title' && this.token === 'sm',
			'font-medium text-[12px] tracking-[0.1px] leading-[16px] title-xs': this.type === 'title' && this.token === 'xs',

			// Subtitle
			'font-medium text-[20px] tracking-[0.15px] leading-[28px] subtitle-xl':
				this.type === 'subtitle' && this.token === 'xl',
			'font-medium text-[18px] tracking-[0.15px] leading-[24px] subtitle-lg':
				this.type === 'subtitle' && this.token === 'lg',
			'font-medium text-[16px] tracking-[0.15px] leading-[24px] subtitle-md':
				this.type === 'subtitle' && this.token === 'md',
			'font-medium text-[14px] tracking-[0.1px] leading-[20px] subtitle-sm':
				this.type === 'subtitle' && this.token === 'sm',
			'font-medium text-[12px] tracking-[0.1px] leading-[16px] subtitle-xs':
				this.type === 'subtitle' && this.token === 'xs',

			// Body
			'text-[18px] tracking-[0.5px] leading-[28px]': this.type === 'body' && this.token === 'xl',
			'text-[16px] tracking-[0.5px] leading-[24px]': this.type === 'body' && this.token === 'lg',
			'text-[14px] tracking-[0.25px] leading-[20px]': this.type === 'body' && this.token === 'md',
			'text-[12px] tracking-[0.4px] leading-[16px]': this.type === 'body' && this.token === 'sm',
			'text-[10px] tracking-[0.4px] leading-[14px]': this.type === 'body' && this.token === 'xs',

			// Label
			'font-medium text-[18px] tracking-[0.1px] leading-[24px]': this.type === 'label' && this.token === '2xl',
			'font-medium text-[16px] tracking-[0.1px] leading-[22px]': this.type === 'label' && this.token === 'xl',
			'font-medium text-[14px] tracking-[0.1px] leading-[20px]': this.type === 'label' && this.token === 'lg',
			'text-[12px] tracking-[0.5px] leading-[16px]': this.type === 'label' && this.token === 'md',
			'text-[11px] tracking-[0.5px] leading-[16px]': this.type === 'label' && this.token === 'sm',
			'text-[10px] tracking-[0.5px] leading-[14px]': this.type === 'label' && this.token === 'xs',

			// Caption
			'text-[12px] tracking-[0.3px] leading-[16px]': this.type === 'caption' && this.token === 'lg',
			'text-[11px] tracking-[0.4px] leading-[16px]': this.type === 'caption' && this.token === 'md',
			'text-[10px] tracking-[0.4px] leading-[13px]': this.type === 'caption' && this.token === 'sm',
			'text-[9px] tracking-[0.4px] leading-[12px]': this.type === 'caption' && this.token === 'xs',

			'font-bold': this.weight === 'bold',
			'font-medium': this.weight === 'medium',
			'font-normal': this.weight === 'normal',

			uppercase: this.transform === 'uppercase',
			lowercase: this.transform === 'lowercase',
			capitalize: this.transform === 'capitalize',
		}

		const styles = {
			letterSpacing: this.letterSpacing,
			fontSize: this.fontSize,
			lineHeight: this.lineHeight,
		}

		// Use div for layout containers, span for inline text
		if (isLayoutContainer) {
			return html`
				<div style=${this.styleMap(styles)} class=${this.classMap(classes)}>
					<slot></slot>
				</div>
			`
		} else {
			return html`
				<span style=${this.styleMap(styles)} class=${this.classMap(classes)}>
					<slot></slot>
				</span>
			`
		}
	}
}
declare global {
	interface HTMLElementTagNameMap {
		'schmancy-typography': SchmancyTypography
	}
}
