// Removed: import { createTimeline, stagger } from '@packages/anime-beta-master'
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
		font-family: inherit;
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
	@property({ type: String }) ease = 'outExpo' // not a built-in string for Web Animations
	@property({ type: Number }) delay = 0
	@property({ type: Number }) stagger = 50
	@property({ type: Number }) duration = 750
	@property({ type: Array }) scale = [0, 1]
	@property({ type: Array }) opacity = [0, 1]
	@property({ type: Array }) translateX = ['0.55em', '0em']
	@property({ type: Array }) translateY = ['1.1em', '0em']
	@property({ type: Array }) translateZ = [0, 0]
	@property({ type: Array }) rotateZ = [180, 0]
	@property({ type: Boolean }) resetOnScroll = true

	@queryAssignedNodes() defaultSlot!: HTMLElement[]
	@query('.letters') letters!: HTMLElement
	@query('.ml7') ml7!: HTMLElement

	// Function to check if an element is in the viewport
	isInViewport(element: HTMLElement) {
		const rect = element.getBoundingClientRect()
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		)
	}

	async firstUpdated() {
		// Split the text into <span class="letter"> ... </span> elements
		this.letters.innerHTML = this.defaultSlot[0].textContent!.replace(/\S/g, `<span class="letter">$&</span>`)

		// Observe viewport + initial readiness
		concat(
			// 1) Wait until the element is rendered (width/height > 0)
			interval(10).pipe(
				startWith(true),
				filter(() => {
					const rect = this.getBoundingClientRect()
					return rect.width > 0 && rect.height > 0
				}),
				take(1),
			),
			// 2) Then handle scroll events, throttled
			fromEvent(window, 'scroll').pipe(
				throttleTime(0, undefined, {
					leading: true,
					trailing: true,
				}),
				startWith(true),
				map(() => this.isInViewport(this)),
				distinctUntilChanged(),
				tap(inViewport => {
					// If leaving viewport and `resetOnScroll` is true, reset letters to opacity 0
					if (!inViewport && this.resetOnScroll) {
						Array.from(this.letters.children).forEach((letter: HTMLElement) => {
							letter.style.opacity = '0'
						})
					}
				}),
				filter(isInViewport => isInViewport),
				// If resetOnScroll = false, animate only the first time inView. If true, repeat.
				this.resetOnScroll ? tap() : take(1),
				tap({
					next: () => {
						// Animate letters with the native Web Animations API
						const letters = this.shadowRoot!.querySelectorAll<HTMLElement>('.ml7 .letter')

						letters.forEach((letter, i) => {
							// Combine all transforms into one CSS transform string
							// From
							const fromTransform = `
                translate3d(${this.translateX[0]}, ${this.translateY[0]}, ${this.translateZ[0]}px)
                rotateZ(${this.rotateZ[0]}deg)
                scale(${this.scale[0]})
              `
							// To
							const toTransform = `
                translate3d(${this.translateX[1]}, ${this.translateY[1]}, ${this.translateZ[1]}px)
                rotateZ(${this.rotateZ[1]}deg)
                scale(${this.scale[1]})
              `
							// Approximate `outExpo` or pick a standard easing (like 'ease-out'):
							// outExpo often approximated by cubic-bezier(0.19, 1, 0.22, 1)
							const easingMap: Record<string, string> = {
								outExpo: 'cubic-bezier(0.19, 1, 0.22, 1)',
								// add more if you want
							}
							const keyframes: Keyframe[] = [
								{ transform: fromTransform, opacity: String(this.opacity[0]) },
								{ transform: toTransform, opacity: String(this.opacity[1]) },
							]

							letter.animate(keyframes, {
								duration: this.duration,
								easing: easingMap[this.ease] || 'ease-out',
								delay: this.delay + i * this.stagger, // staggered start
								fill: 'forwards', // so the letters remain visible
							})
						})
					},
				}),
			),
		).subscribe()
	}

	render() {
		return html`
			<span class="ml7">
				<span class="text-wrapper">
					<span class="letters">
						<slot></slot>
					</span>
				</span>
			</span>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-animated-text': SchmancyAnimatedText
	}
}
