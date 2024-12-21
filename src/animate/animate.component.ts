import { animate, stagger } from '@juliangarnierorg/anime-beta'
import { css, html } from 'lit'
import { customElement, property, queryAssignedElements } from 'lit/decorators.js'
import { $LitElement } from '@mixins/lit'
@customElement('schmancy-animate')
export class SchmancyAnimate extends $LitElement(css`
	:host {
		display: inherit;
		height: inherit;
		width: inherit;
	}
`) {
	layout = true
	@property({ type: Array }) opacity!: Array<number>

	/**
	 * @description delay in ms
	 * @type {number}
	 * @default 0
	 */
	@property({ type: Number }) delay: number = 0
	@property({ type: Number }) duration: number = 300
	/**
	 * @description translateX in px
	 * @type {Array<number>}
	 * @default [0, 0]
	 */
	@property({ type: Array }) translateX!: Array<number | string>
	@property({ type: Array }) translateY!: Array<number | string>
	@property() easing?: string = 'outExpo'
	@property({ type: Boolean }) stagger?: boolean

	@queryAssignedElements() assignedElements!: HTMLElement[]

	firstUpdated() {
		animate(this.assignedElements, {
			opacity: this.opacity,
			delay: this.stagger ? stagger(this.delay) : this.delay,
			translateX: this.translateX,
			duration: this.duration,
			translateY: this.translateY,
			easing: this.easing,
		})
	}

	render() {
		return html` <slot> </slot> `
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-animate': SchmancyAnimate
	}
}
