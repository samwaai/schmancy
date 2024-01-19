import { createTimeline, stagger } from '@juliangarnierorg/anime-beta'
import { $LitElement } from '@mhmo91/lit-mixins/src'
import { css, html } from 'lit'
import { customElement, query, queryAssignedNodes } from 'lit/decorators.js'
/**
 * @element schmancy-animated-text
 * Inspired by https://tobiasahlin.com/moving-letters/#1
 */
@customElement('schmancy-animated-text')
export default class SchmancyAnimatedText extends $LitElement(css`
	.ml7 {
		position: relative;
	}
	.ml7 .text-wrapper {
		position: relative;
		display: inline-block;
		overflow: hidden;
	}
	.ml7 .letter {
		transform-origin: 0 100%;
		display: inline-block;
		opacity: 0;
	}
`) {
	@queryAssignedNodes() defaultSlot!: HTMLElement[]
	@query('.letters') letters!: HTMLElement
	@query('.ml7') ml7!: HTMLElement
	firstUpdated() {
		// Wrap every letter in a span
		console.log(this.defaultSlot)
		this.letters.innerHTML = this.defaultSlot[0].textContent.replace(/\S/g, "<span  class='letter hidden'>$&</span>")

		createTimeline({ loop: 0, default: { easing: 'inOutExpo' } }).add(
			this.shadowRoot.querySelectorAll('.ml7 .letter'),
			{
				translateY: ['1.1em', 0],
				translateX: ['0.55em', 0],
				opacity: [0, 1],
				scale: [0, 1],
				translateZ: 0,
				rotateZ: [180, 0],
				duration: 750,
			},
			stagger(50),
		)
	}
	render() {
		return html`<span class="ml7">
				<span class="text-wrapper">
					<span class="letters"></span>
				</span>
			</span>
			<slot hidden></slot> `
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-animated-text': SchmancyAnimatedText
	}
}
