import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { fromEvent } from 'rxjs'
import { throttleTime } from 'rxjs/operators'

@customElement('schmancy-slider')
export class SchmancySlider extends $LitElement(css`
	.slider {
		/* Lay out slides horizontally, one after another */
		display: flex;
		overflow-x: auto;

		/* Optional: scroll snapping */
		scroll-snap-type: x mandatory;

		/* Hide scrollbars */
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
	.slider::-webkit-scrollbar {
		display: none; /* Chrome, Safari, Opera */
	}

	/* 
      Ensure each slide takes up the full slider width.
      "schmancy-slide" is the child custom element.
    */
	::slotted(schmancy-slide) {
		flex: 0 0 100%;
		box-sizing: border-box;
	}
`) {
	/**
	 * Currently centered slide index
	 */
	@state() private selectedIndex: number = 0

	/**
	 * If true, renders next/prev buttons
	 */
	@property({ type: Boolean }) showArrows: boolean = true

	@query('#slider') private slider!: HTMLDivElement
	@query('slot') private defaultSlot!: HTMLSlotElement

	protected firstUpdated() {
		// Start at leftmost position
		this.slider.scrollLeft = 0

		// Throttle scroll events to update selected index
		fromEvent(this.slider, 'scroll')
			.pipe(throttleTime(100, undefined, { trailing: true }))
			.subscribe(() => {
				this.updateSelectedIndexOnScroll()
			})
	}

	private updateSelectedIndexOnScroll() {
		const slides = this.defaultSlot?.assignedElements({ flatten: true }) ?? []
		if (!slides.length) return

		const oldIndex = this.selectedIndex

		// Center of the slider’s visible area
		const sliderCenter = this.slider.scrollLeft + this.slider.clientWidth / 2

		let closestIndex = 0
		let closestDistance = Infinity

		slides.forEach((slide, index) => {
			const itemStart = (slide as HTMLElement).offsetLeft
			const itemCenter = itemStart + slide.clientWidth / 2
			const distance = Math.abs(sliderCenter - itemCenter)

			if (distance < closestDistance) {
				closestDistance = distance
				closestIndex = index
			}
		})

		this.selectedIndex = closestIndex

		// If the index changed, dispatch event
		if (this.selectedIndex !== oldIndex) {
			this.dispatchEvent(
				new CustomEvent('slide-changed', {
					detail: { index: this.selectedIndex },
				}),
			)
		}
	}

	private goToSlide(newIndex: number) {
		const slides = this.defaultSlot?.assignedElements({ flatten: true }) ?? []
		if (!slides[newIndex]) return

		this.slider.scrollTo({
			left: (slides[newIndex] as HTMLElement).offsetLeft,
			behavior: 'smooth',
		})
	}

	private onPrevClick() {
		this.goToSlide(this.selectedIndex - 1)
	}

	private onNextClick() {
		const slides = this.defaultSlot?.assignedElements({ flatten: true }) ?? []
		if (this.selectedIndex < slides.length - 1) {
			this.goToSlide(this.selectedIndex + 1)
		}
	}

	render() {
		const slides = this.defaultSlot?.assignedElements({ flatten: true }) ?? []

		return html`
			<div class="relative inset-0">
				<!-- The scrollable track -->
				<div class="slider" id="slider">
					<slot></slot>
				</div>

				<!-- Next/Prev Buttons (Optional) -->
				${this.showArrows
					? html`
							<schmancy-icon-button
								class="absolute left-2 top-1/2 -translate-y-1/2"
								@click=${this.onPrevClick}
								?disabled=${this.selectedIndex === 0}
							>
								chevron_left
							</schmancy-icon-button>
							<schmancy-icon-button
								class="absolute right-2 top-1/2 -translate-y-1/2"
								@click=${this.onNextClick}
								?disabled=${this.selectedIndex === slides.length - 1}
							>
								chevron_right
							</schmancy-icon-button>
						`
					: null}

				<!-- Dots / indicators -->
				<div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex  space-x-2">
					${slides.map((_, index) => {
						const isSelected = index === this.selectedIndex
						return html`
							<schmancy-button .variant=${isSelected ? 'filled tonal' : 'outlined'} class="rounded-full ">
							</schmancy-button>
						`
					})}
				</div>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-slider': SchmancySlider
	}
}
