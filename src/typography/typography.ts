import { TailwindElement } from '@mixins/tailwind.mixin'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

// Material Design 3 typography - https://m3.material.io/styles/typography/type-scale-tokens

/**
 * @element schmancy-typography
 * @slot - The text for the typography.
 */
@customElement('schmancy-typography')
export class SchmancyTypography extends TailwindElement(css`
	:host {
		display: block;
		font-family: inherit;
		hyphens: none;
	}

	/* Text alignment */
	:host([align='center']) {
		text-align: center;
	}

	:host([align='left']) {
		text-align: start;
	}

	:host([align='right']) {
		text-align: right;
	}

	:host([align='justify']) {
		text-align: justify;
	}

	/* Max lines / line clamping */
	:host([max-lines='1']) {
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	:host([max-lines='2']) {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	:host([max-lines='3']) {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	:host([max-lines='4']) {
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	:host([max-lines='5']) {
		display: -webkit-box;
		-webkit-line-clamp: 5;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	:host([max-lines='6']) {
		display: -webkit-box;
		-webkit-line-clamp: 6;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Font weight */
	:host([weight='bold']) {
		font-weight: 700;
	}

	:host([weight='medium']) {
		font-weight: 500;
	}

	:host([weight='normal']) {
		font-weight: 400;
	}

	/* Text transform */
	:host([transform='uppercase']) {
		text-transform: uppercase;
	}

	:host([transform='lowercase']) {
		text-transform: lowercase;
	}

	:host([transform='capitalize']) {
		text-transform: capitalize;
	}

	:host([transform='normal']) {
		text-transform: none;
	}

	/* Display typography variants - Material Design 3 + Extended */
	:host([type='display'][token='xl']) {
		font-size: 72px;
		line-height: 80px;
		font-weight: 400;
	}

	:host([type='display'][token='lg']) {
		font-size: 57px;
		line-height: 64px;
		font-weight: 400;
	}

	:host([type='display'][token='md']) {
		font-size: 45px;
		line-height: 52px;
		font-weight: 400;
	}

	:host([type='display'][token='sm']) {
		font-size: 36px;
		line-height: 44px;
		font-weight: 400;
	}

	:host([type='display'][token='xs']) {
		font-size: 28px;
		line-height: 36px;
		font-weight: 400;
	}

	/* Headline typography variants - Material Design 3 + Extended */
	:host([type='headline'][token='xl']) {
		font-size: 36px;
		line-height: 44px;
		font-weight: 400;
	}

	:host([type='headline'][token='lg']) {
		font-size: 32px;
		line-height: 40px;
		font-weight: 400;
	}

	:host([type='headline'][token='md']) {
		font-size: 28px;
		line-height: 36px;
		font-weight: 400;
	}

	:host([type='headline'][token='sm']) {
		font-size: 24px;
		line-height: 32px;
		font-weight: 400;
	}

	:host([type='headline'][token='xs']) {
		font-size: 20px;
		line-height: 28px;
		font-weight: 400;
	}

	/* Title typography variants - Material Design 3 + Extended */
	:host([type='title'][token='xl']) {
		font-size: 24px;
		line-height: 32px;
		font-weight: 400;
	}

	:host([type='title'][token='lg']) {
		font-size: 22px;
		line-height: 28px;
		font-weight: 400;
	}

	:host([type='title'][token='md']) {
		font-size: 16px;
		line-height: 24px;
		font-weight: 500;
	}

	:host([type='title'][token='sm']) {
		font-size: 14px;
		line-height: 20px;
		font-weight: 500;
	}

	:host([type='title'][token='xs']) {
		font-size: 12px;
		line-height: 16px;
		font-weight: 500;
	}

	/* Subtitle typography variants - Extended from Material Design 3 */
	:host([type='subtitle'][token='xl']) {
		font-size: 20px;
		line-height: 28px;
		font-weight: 500;
	}

	:host([type='subtitle'][token='lg']) {
		font-size: 18px;
		line-height: 24px;
		font-weight: 500;
	}

	:host([type='subtitle'][token='md']) {
		font-size: 16px;
		line-height: 24px;
		font-weight: 500;
	}

	:host([type='subtitle'][token='sm']) {
		font-size: 14px;
		line-height: 20px;
		font-weight: 500;
	}

	:host([type='subtitle'][token='xs']) {
		font-size: 12px;
		line-height: 16px;
		font-weight: 500;
	}

	/* Body typography variants - Material Design 3 + Extended */
	:host([type='body'][token='xl']) {
		font-size: 18px;
		line-height: 28px;
		font-weight: 400;
	}

	:host([type='body'][token='lg']) {
		font-size: 16px;
		line-height: 24px;
		font-weight: 400;
	}

	:host([type='body'][token='md']) {
		font-size: 14px;
		line-height: 20px;
		font-weight: 400;
	}

	:host([type='body'][token='sm']) {
		font-size: 12px;
		line-height: 16px;
		font-weight: 400;
	}

	:host([type='body'][token='xs']) {
		font-size: 10px;
		line-height: 14px;
		font-weight: 400;
	}

	/* Label typography variants - Material Design 3 + Extended */
	:host([type='label'][token='xl']) {
		font-size: 16px;
		line-height: 22px;
		font-weight: 500;
	}

	:host([type='label'][token='lg']) {
		font-size: 14px;
		line-height: 20px;
		font-weight: 500;
	}

	:host([type='label'][token='md']) {
		font-size: 12px;
		line-height: 16px;
		font-weight: 500;
	}

	:host([type='label'][token='sm']) {
		font-size: 11px;
		line-height: 16px;
		font-weight: 500;
	}

	:host([type='label'][token='xs']) {
		font-size: 10px;
		line-height: 14px;
		font-weight: 500;
	}

	/* Note: Custom letter-spacing, font-size, and line-height should be applied via inline styles or Tailwind classes */
`) {
	/**
	 * @attr type - The type of the typography.
	 * @default 'body'
	 * @type {'display' | 'headline' | 'title' | 'subtitle' | 'body' | 'label'}
	 */
	@property({ type: String, reflect: true })
	type: 'display' | 'headline' | 'title' | 'subtitle' | 'body' | 'label' = 'body'

	/**
	 * @attr token - The token of the typography.
	 * @default 'md'
	 * @type {'xs' | 'sm' | 'md' | 'lg' | 'xl'}
	 */
	@property({ type: String, reflect: true })
	token: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md'

	/**
	 * @attr
	 * @default inherit
	 * @type {'left' |'center' |'right'}
	 */
	@property({ type: String, reflect: true })
	align: 'left' | 'center' | 'justify' | 'right' | undefined

	/**
	 * @attr
	 * @default inherit
	 * @type {'normal' | 'medium' |'bold'}
	 * @public
	 */
	@property({ type: String, reflect: true })
	weight: 'normal' | 'medium' | 'bold' | undefined
	
	/**
	 *
	 * @attr
	 * @default inherit
	 * @type {'uppercase' |'lowercase' |'capitalize' |'normal'}
	 * @public
	 */
	@property({ type: String, reflect: true }) 
	transform: 'uppercase' | 'lowercase' | 'capitalize' | 'normal' | undefined

	@property({ type: Number, attribute: 'max-lines', reflect: true }) 
	maxLines: 1 | 2 | 3 | 4 | 5 | 6 | undefined

	protected render(): unknown {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-typography': SchmancyTypography
	}
}