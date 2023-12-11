import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import typographyStyle from './typography.scss?inline'
// based on M3 typography https://m3.material.io/styles/typography/overview

/**
 * @element schmancy-typography
 * @slot - The text for the typography.
 */
@customElement('schmancy-typography')
export class SchmancyTypography extends TailwindElement(typographyStyle) {
	/**
	 * @attr {display | headline | title | body | label } type - The type of the typography.
	 */
	@property({ type: String, reflect: true })
	type: 'display' | 'headline' | 'title' | 'body' | 'label' = 'body'

	/**
	 * @attr token - The token of the typography.
	 * @default md
	 * @type {'sm' |'md' |'lg'}
	 */
	@property({ type: String, reflect: true })
	token: 'sm' | 'md' | 'lg' = 'md'

	/**
	 * @attr
	 * @default left
	 * @type {'left' |'center' |'right'}
	 */
	@property({ type: String })
	align: 'left' | 'center' | 'justify' | 'right' = 'left'

	/**
	 * @attr
	 * @default normal
	 * @type {'normal' | 'medium' |'bold'}
	 * @public
	 */
	@property({ type: String })
	weight: 'normal' | 'medium' | 'bold' = 'normal'

	/**
	 *
	 * @attr
	 * @default normal
	 * @type {'uppercase' |'lowercase' |'capitalize' |'normal'}
	 * @public
	 */
	@property({ type: String }) transform: 'uppercase' | 'lowercase' | 'capitalize' | 'normal' = 'normal'

	render() {
		const classes = {
			'hyphens-none flex items-center': true,

			// Display
			'text-[57px] tracking-[-0.25px] leading-[64px]': this.type === 'display' && this.token === 'lg',
			'text-[45px] tracking-[0px] leading-[52px]': this.type === 'display' && this.token === 'md',
			'text-[36px] tracking-[0px] leading-[44px]': this.type === 'display' && this.token === 'sm',

			// Headline
			'text-[32px] tracking-[0px] leading-[40px]': this.type === 'headline' && this.token === 'lg',
			'text-[28px] tracking-[0px] leading-[36px]': this.type === 'headline' && this.token === 'md',
			'text-[24px] tracking-[0px] leading-[32px]': this.type === 'headline' && this.token === 'sm',

			// Title
			'text-[22px] tracking-[0px] leading-[28px]': this.type === 'title' && this.token === 'lg',
			'font-medium text-[16px] tracking-[0.15px] leading-[24px]': this.type === 'title' && this.token === 'md',
			'font-medium text-[14px] tracking-[0.1px] leading-[20px]':
				(this.type === 'title' && this.token === 'sm') || (this.type === 'label' && this.token === 'lg'),

			// Body
			'text-[16px] tracking-[0.5px] leading-[24px]': this.type === 'body' && this.token === 'lg',
			'text-[14px] tracking-[0.25px] leading-[20px]': this.type === 'body' && this.token === 'md',
			'text-[12px] tracking-[0.4px] leading-[16px]': this.type === 'body' && this.token === 'sm',

			// Label
			// large label is the same as Title sm
			'text-[12px] tracking-[0.5px] leading-[16px]': this.type === 'label' && this.token === 'md',
			'text-[11px] tracking-[0.5px] leading-[16px]': this.type === 'label' && this.token === 'sm',

			// 'text-primary-default': this.color === 'primary',
			// 'text-secondary-default': this.color === 'secondary',
			// 'text-tertiary-default': this.color === 'tertiary',
			// 'text-error-default': this.color === 'error',
			// 'text-success-default': this.color === 'success',
			// 'text-warning-default': this.color === 'warning',
			// 'text-info-default': this.color === 'info',
			// 'text-disabled-default': this.color === 'disabled',

			'font-bold': this.weight === 'bold',
			'font-medium': this.weight === 'medium',
			'font-normal': this.weight === 'normal',

			uppercase: this.transform === 'uppercase',
			lowercase: this.transform === 'lowercase',
			capitalize: this.transform === 'capitalize',
		}

		return html`
			<span class=${classMap(classes)}>
				<slot></slot>
			</span>
		`
	}
}
declare global {
	interface HTMLElementTagNameMap {
		'schmancy-typography': SchmancyTypography
	}
}
