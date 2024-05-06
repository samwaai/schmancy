import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
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
	 * @type {'display' | 'headline' | 'title' | 'body' | 'label'}
	 */
	@property({ type: String, reflect: true })
	type: 'display' | 'headline' | 'title' | 'body' | 'label'

	/**
	 * @attr token - The token of the typography.
	 * @default 'md'
	 * @type {'sm' |'md' |'lg'}
	 */
	@property({ type: String, reflect: true })
	token: 'sm' | 'md' | 'lg' = 'md'

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
		const classes = {
			'hyphens-none items-center': true,
			'justify-center': this.align === 'center',
			'justify-start': this.align === 'left',
			'justify-end': this.align === 'right',
			'justify-between text-justify': this.align === 'justify',
			'line-clamp-1': this.maxLines === 1,
			'line-clamp-2': this.maxLines === 2,
			'line-clamp-3': this.maxLines === 3,
			'line-clamp-4': this.maxLines === 4,
			'line-clamp-5': this.maxLines === 5,
			'line-clamp-6': this.maxLines === 6,
			'line-clamp-none flex': this.maxLines === undefined,

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

		return html`
			<span style=${this.styleMap(styles)} class=${this.classMap(classes)}>
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
