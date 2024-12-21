import { createTimeline, stagger } from '@juliangarnierorg/anime-beta'
import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property, query, queryAssignedNodes } from 'lit/decorators.js'
import {
	concat,
	distinctUntilChanged,
	filter,
	fromEvent,
	interval,
	map,
	startWith,
	take,
	tap,
	throttleTime,
} from 'rxjs'
/**
 * @element schmancy-animated-text
 * Inspired by https://tobiasahlin.com/moving-letters/#1
 */

@customElement('schmancy-animated-text')
export default class SchmancyAnimatedText extends $LitElement(css`
	:host {
		font-family: var(--schmancy-font-family) !important;
		display: block;
	}
	.ml7 {
		position: relative;
		display: flex;
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
	@property({ type: String }) ease = 'outExpo'
	@property({ type: Number }) delay = 0
	@property({ type: Number }) stagger = 50
	@property({ type: Number }) duration = 750
	@property({ type: Array }) scale = [0, 1]
	@property({ type: Array }) opacity = [0, 1]
	@property({ type: Array }) translateX = ['0.55em', 0]
	@property({ type: Array }) translateY = ['1.1em', 0]
	@property({ type: Array }) translateZ = [0, 0]
	@property({ type: Array }) rotateZ = [180, 0]
	@property({ type: Boolean }) resetOnScroll = true

	@queryAssignedNodes() defaultSlot!: HTMLElement[]
	@query('.letters') letters!: HTMLElement
	@query('.ml7') ml7!: HTMLElement

	// Function to check if an element is in the viewport
	isInViewport(element) {
		const rect = element.getBoundingClientRect()
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		)
	}

	async firstUpdated() {
		this.letters.innerHTML = this.defaultSlot[0].textContent.replace(/\S/g, "<span  class='letter'>$&</span>")

		concat(
			interval(10).pipe(
				startWith(true),
				filter(() => {
					const rect = this.getBoundingClientRect()
					return rect.width > 0 && rect.height > 0
				}),
				take(1),
			),
			fromEvent(window, 'scroll').pipe(
				// pipe to only emit when the element has getBoundingClientRect() in viewport
				throttleTime(0, undefined, {
					leading: true,
					trailing: true,
				}), // Throttle the events to improve performance
				startWith(true), // Emit an event on subscription
				map(() => this.isInViewport(this)), // Filter events where the element is in viewport
				distinctUntilChanged(), // Only emit when the value has changed
				tap(inViewPort => {
					if (!inViewPort)
						Array.from(this.letters.children).forEach((letter: HTMLElement) => (letter.style.opacity = '0'))
				}),
				filter(isInViewport => isInViewport),
				this.resetOnScroll ? tap(() => {}) : take(1),

				tap({
					next: () => {
						// Wrap every letter in a span
						createTimeline().add(
							this.shadowRoot.querySelectorAll('.ml7 .letter'),
							{
								translateY: this.translateY,
								translateX: this.translateX,
								opacity: this.opacity,
								translateZ: this.translateZ,
								rotateZ: this.rotateZ,
								duration: this.duration,
								delay: this.delay,
								onBegin: () => {},
							},
							stagger(this.stagger),
						)
					},
				}),
			),
		).subscribe({})
	}
	render() {
		return html`<span class="ml7">
			<span class="text-wrapper">
				<span class="letters">
					<slot></slot>
				</span>
			</span>
		</span> `
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-animated-text': SchmancyAnimatedText
	}
}
