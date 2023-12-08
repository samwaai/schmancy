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
	 * @attr {primary |secondary |success |error |warning } color - The color of the typography.
	 */
	@property({ type: String, reflect: true })
	color: 'primary' | 'primary-muted' | 'secondary' | 'success' | 'error' | 'warning' | 'white' | null = 'primary'

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
	 * @type {'normal' |'bold'}
	 * @public
	 */
	@property({ type: String })
	weight: 'normal' | 'bold' = 'normal'

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
			'text-[64px] leading-[64px] tracking-[-0.025em]': this.type === 'display' && this.token === 'lg',
			'text-[48px] leading-[48px] tracking-[-0.025em]': this.type === 'display' && this.token === 'md',
			'text-[36px] leading-[36px] tracking-[-0.025em]': this.type === 'display' && this.token === 'sm',

			'text-[32px] leading-[32px] tracking-[-0.025em]': this.type === 'headline' && this.token === 'lg',
			'text-[28px] leading-[32px] tracking-[-0.025em]': this.type === 'headline' && this.token === 'md',
			'text-[24px] leading-[28px] tracking-[-0.025em]':
				(this.type === 'headline' && this.token === 'sm') || (this.type === 'title' && this.token === 'lg'),

			'text-[20px] leading-[24px] tracking-[-0.025em]': this.type === 'title' && this.token === 'md',
			'text-[18px] leading-[24px] tracking-[-0.025em]': this.type === 'title' && this.token === 'sm',

			'text-lg': this.type === 'body' && this.token === 'lg',
			'text-[14px] leading-[18px] tracking-[-0.025em]': this.type === 'body' && this.token === 'md',
			'text-[12px] leading-[16px] tracking-[-0.025em]': this.type === 'body' && this.token === 'sm',

			'text-sm': this.type === 'label' && this.token === 'lg',
			'text-xs': this.type === 'label' && this.token === 'md',
			'text-[10px] leading-[12px] tracking-[-0.025em]': this.type === 'label' && this.token === 'sm',

			'font-[700]': this.weight === 'bold',
			'text-white': this.color === 'white' || this.classList.contains('text-white'),
			'text-primary-key': this.color === 'primary',
			'text-accent-50': this.color === 'secondary',
			'text-green-500': this.color === 'success',
			'align-center': this.align === 'center',
			'text-justify': this.align === 'justify',
			'align-left': this.align === 'left',
			'align-right': this.align === 'right',
			'text-error-color': this.color === 'error',
			'text-warning-40': this.color === 'warning',
			'text-gray-400': this.color === 'primary-muted',

			uppercase: this.transform === 'uppercase',
			lowercase: this.transform === 'lowercase',
			capitalize: this.transform === 'capitalize',
		}

		return html`
			${['display', 'headline', 'title'].includes(this.type)
				? html` <span class=${classMap(classes)}>
						<slot></slot>
				  </span>`
				: this.type === 'body'
				  ? html`<span class=${classMap(classes)}>
							<slot></slot>
				    </span>`
				  : html`<span class=${classMap(classes)}>
							<slot></slot>
				    </span>`}
		`
	}
}
declare global {
	interface HTMLElementTagNameMap {
		'schmancy-typography': SchmancyTypography
	}
}
