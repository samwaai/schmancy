import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import Layout from '../layout/layout'

/**
 * SchmancyFlex exposes a flex container with all the Tailwind CSS 4 options:
 *
 * - **Display**: By default uses `flex` but can be set to inline using the `inline` property.
 * - **Flow**: Accepts 'row', 'row-reverse', 'col', 'col-reverse' as well as grid‐like dense variants:
 *    - Dense variants (`row-dense`, `col-dense`) force wrapping.
 * - **Wrap**: 'wrap', 'nowrap', or 'wrap-reverse'
 * - **Align Items**: 'start', 'center', 'end', 'stretch', or 'baseline'
 * - **Justify Content**: 'start', 'center', 'end', 'between', 'around', or 'evenly'
 * - **Align Content** (for multi-line flex containers): 'start', 'center', 'end', 'between', 'around', or 'evenly'
 * - **Gap**: Supports Tailwind’s spacing scale (e.g. 'none', '0', '1', '2', …, '64')
 */
@customElement('sch-flex')
export class SchmancyFlexV2 extends Layout {
	static styles = [
		Layout.styles,
		css`
			:host {
				display: block;
			}
		`,
	]
	// If true, the container will use inline-flex instead of flex.
	@property({ type: Boolean, reflect: true })
	inline = false

	/**
	 * Flow property that determines the flex direction.
	 * Allowed values:
	 *  - Standard: 'row', 'row-reverse', 'col', 'col-reverse'
	 *  - Dense variants: 'row-dense', 'col-dense' (dense implies wrapping)
	 */
	@property({ type: String, reflect: true })
	flow: 'row' | 'row-reverse' | 'col' | 'col-reverse' | 'row-dense' | 'col-dense' = 'row'

	/**
	 * Flex-wrap options:
	 *  - 'wrap', 'nowrap', or 'wrap-reverse'
	 */
	@property({ type: String, reflect: true })
	wrap: 'wrap' | 'nowrap' | 'wrap-reverse' = 'wrap'

	/**
	 * Align-items (vertical alignment of flex items):
	 *  - 'start', 'center', 'end', 'stretch', or 'baseline'
	 */
	@property({ type: String, reflect: true })
	align: 'start' | 'center' | 'end' | 'stretch' | 'baseline' = 'stretch'

	/**
	 * Justify-content (horizontal distribution):
	 *  - 'start', 'center', 'end', 'between', 'around', or 'evenly'
	 */
	@property({ type: String, reflect: true })
	justify: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly' = 'start'

	/**
	 * Align-content (spacing between rows when wrapping):
	 *  - 'start', 'center', 'end', 'between', 'around', or 'evenly'
	 */
	@property({ type: String, reflect: true })
	content?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'

	/**
	 * Gap between flex items.
	 * Options (based on Tailwind CSS 4 spacing scale):
	 *  - 'none', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '12', '16', '20', '24', '32', '40', '48', '56', or '64'
	 */
	@property({ type: String, reflect: true })
	gap:
		| 'none'
		| '0'
		| '1'
		| '2'
		| '3'
		| '4'
		| '5'
		| '6'
		| '7'
		| '8'
		| '9'
		| '10'
		| '12'
		| '16'
		| '20'
		| '24'
		| '32'
		| '40'
		| '48'
		| '56'
		| '64' = 'none'

	render() {
		// Determine whether to use inline-flex or flex.
		const baseDisplay = this.inline ? 'inline-flex' : 'flex'

		// Map the flow property to a flex-direction class.
		// (Dense variants use the same class as their standard counterparts.)
		let directionClass = ''
		switch (this.flow) {
			case 'row':
			case 'row-dense':
				directionClass = 'flex-row'
				break
			case 'row-reverse':
				directionClass = 'flex-row-reverse'
				break
			case 'col':
			case 'col-dense':
				directionClass = 'flex-col'
				break
			case 'col-reverse':
				directionClass = 'flex-col-reverse'
				break
			default:
				directionClass = 'flex-row'
		}

		// Dense variants force wrapping regardless of the wrap property.
		const isDense = this.flow === 'row-dense' || this.flow === 'col-dense'
		const effectiveWrap = isDense ? 'wrap' : this.wrap

		let wrapClass = ''
		switch (effectiveWrap) {
			case 'wrap':
				wrapClass = 'flex-wrap'
				break
			case 'nowrap':
				wrapClass = 'flex-nowrap'
				break
			case 'wrap-reverse':
				wrapClass = 'flex-wrap-reverse'
				break
			default:
				wrapClass = 'flex-wrap'
		}

		// Map align-items.
		let alignClass = ''
		switch (this.align) {
			case 'start':
				alignClass = 'items-start'
				break
			case 'center':
				alignClass = 'items-center'
				break
			case 'end':
				alignClass = 'items-end'
				break
			case 'stretch':
				alignClass = 'items-stretch'
				break
			case 'baseline':
				alignClass = 'items-baseline'
				break
			default:
				alignClass = 'items-stretch'
		}

		// Map justify-content.
		let justifyClass = ''
		switch (this.justify) {
			case 'start':
				justifyClass = 'justify-start'
				break
			case 'center':
				justifyClass = 'justify-center'
				break
			case 'end':
				justifyClass = 'justify-end'
				break
			case 'between':
				justifyClass = 'justify-between'
				break
			case 'around':
				justifyClass = 'justify-around'
				break
			case 'evenly':
				justifyClass = 'justify-evenly'
				break
			default:
				justifyClass = 'justify-start'
		}

		// Map align-content (if provided).
		let contentClass = ''
		if (this.content) {
			switch (this.content) {
				case 'start':
					contentClass = 'content-start'
					break
				case 'center':
					contentClass = 'content-center'
					break
				case 'end':
					contentClass = 'content-end'
					break
				case 'between':
					contentClass = 'content-between'
					break
				case 'around':
					contentClass = 'content-around'
					break
				case 'evenly':
					contentClass = 'content-evenly'
					break
			}
		}

		// Map gap value.
		const gapClass = this.gap === 'none' ? 'gap-0' : `gap-${this.gap}`

		// Build the complete list of classes.
		const classes = [baseDisplay, directionClass, wrapClass, alignClass, justifyClass, contentClass, gapClass]
			.filter(Boolean)
			.join(' ')

		return html`
			<section class=${classes}>
				<slot></slot>
			</section>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'sch-flex': SchmancyFlexV2
	}
}
