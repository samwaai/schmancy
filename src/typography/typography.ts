import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import typographyStyle from './typography.scss?inline'
import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
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
	@property({ type: String })
	color: 'primary' | 'primary-muted' | 'secondary' | 'success' | 'error' | 'warning' | 'white' | null = 'primary'

	/**
	 * @attr {display | headline | title | body | label } type - The type of the typography.
	 */
	@property({ type: String })
	type: 'display' | 'headline' | 'title' | 'body' | 'label' = 'body'

	/**
	 * @attr token - The token of the typography.
	 * @default medium
	 * @type {'small' |'medium' |'large'}
	 */
	@property({ type: String })
	token: 'small' | 'medium' | 'large' = 'medium'

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

	render() {
		const classes = {
			'hyphens-none': true,

			'text-lg': this.type === 'body' && this.token === 'large',
			'text-[14px] leading-[18px] tracking-[-0.025em]': this.type === 'body' && this.token === 'medium',
			'text-[12px] leading-[16px] tracking-[-0.025em]': this.type === 'body' && this.token === 'small',

			'text-[42px] leading-[42px] tracking-[-0.025em]': this.type === 'label' && this.token === 'large',
			'text-[24px] leading-[24px] tracking-[-0.025em]': this.type === 'label' && this.token === 'medium',
			'text-[18px] leading-[18px] tracking-[-0.025em]': this.type === 'label' && this.token === 'small',

			'text-[22px] leading-[26px] tracking-[-0.025em]': this.type === 'title' && this.token === 'medium',
			'text-[16px] leading-[18px] tracking-[-0.025em]': this.type === 'title' && this.token === 'small',

			'text-7xl': this.type === 'display',
			'text-5xl': this.type === 'headline',

			'font-bold': this.weight === 'bold',
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
