import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { debounceTime, filter, fromEvent, takeUntil } from 'rxjs'

/**
 * Custom scroll event interface for the SchmancyScroll component.
 * Contains detailed information about the scroll state.
 */
export interface SchmancyScrollEvent
	extends CustomEvent<{
		/** Current scroll position from the top */
		scrollTop: number
		/** Total scrollable height of the content */
		scrollHeight: number
		/** Visible height of the container */
		clientHeight: number
		/** Original scroll event */
		e: Event
		/** Current scroll position from the left (for horizontal scrolling) */
		scrollLeft?: number
		/** Total scrollable width of the content (for horizontal scrolling) */
		scrollWidth?: number
		/** Visible width of the container (for horizontal scrolling) */
		clientWidth?: number
	}> {}

/**
 * Command event interface for controlling SchmancyScroll components
 */
export interface SchmancyScrollCommandEvent
	extends CustomEvent<{
		/** Target component name */
		name: string
		/** Command action to perform */
		action: 'scrollTo'
		/** Scroll position for scrollTo action */
		top: number
		/** Horizontal scroll position for scrollTo action (optional) */
		left?: number
	}> {}

// Augment the HTMLElementEventMap to include our custom events
declare global {
	interface HTMLElementEventMap {
		scroll: SchmancyScrollEvent
		'schmancy-scroll-command': SchmancyScrollCommandEvent
	}
}

/**
 * A custom scrollable container with enhanced features.
 *
 * @fires {SchmancyScrollEvent} scroll - Fired when scrolling occurs (with a configurable debounce)
 * @slot - Default slot for content to be scrolled
 * @csspart scroller - The inner scrollable div element
 *
 * @example
 * ```html
 * <schmancy-scroll hide name="main-content">
 *   <div>Scrollable content goes here</div>
 * </schmancy-scroll>
 * ```
 *
 * @example
 * ```html
 * <schmancy-scroll direction="horizontal" hide name="image-carousel">
 *   <div class="flex">
 *     <img src="image1.jpg" alt="Image 1">
 *     <img src="image2.jpg" alt="Image 2">
 *   </div>
 * </schmancy-scroll>
 * ```
 */
@customElement('schmancy-scroll')
export class SchmancyScroll extends TailwindElement(css`
	:host {
		height: 100%;
		width: 100%;
		overflow: hidden;
		box-sizing: border-box; /* Ensures proper sizing */
		display: block;
		position: relative;
		inset: 0px;
	}
	.scrollbar-hide {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
	.scrollbar-hide::-webkit-scrollbar {
		display: none; /* Chrome, Safari, and Opera */
	}
`) {
	/**
	 * Determines whether the scrollbar is hidden.
	 *
	 * When `hide` is true, the inner scrollable div receives the `scrollbar-hide` class,
	 * which hides scrollbars in supported browsers.
	 *
	 * @attr hide
	 * @example <schmancy-scroll hide></schmancy-scroll>
	 */
	@property({ type: Boolean, reflect: true })
	public hide = false

	/**
	 * Optional name identifier for the component.
	 * Used for targeting this specific component with global events.
	 *
	 * @attr name
	 * @example <schmancy-scroll name="main-content"></schmancy-scroll>
	 */
	@property({ type: String, reflect: true })
	public name?: string

	/**
	 * Direction of scrolling: vertical, horizontal, or both.
	 * - vertical: Only allows vertical scrolling
	 * - horizontal: Only allows horizontal scrolling
	 * - both: Allows both horizontal and vertical scrolling (default)
	 *
	 * @attr direction
	 * @example <schmancy-scroll direction="horizontal"></schmancy-scroll>
	 */
	@property({ type: String, reflect: true })
	public direction: 'vertical' | 'horizontal' | 'both' = 'both'

	/**
	 * Reference to the inner scrollable div element
	 * @public
	 */
	@query('#scroller')
	scroller!: HTMLElement

	/**
	 * Debounce time in milliseconds for the scroll event.
	 * Higher values reduce the frequency of scroll events being dispatched.
	 *
	 * @attr debounce
	 * @example <schmancy-scroll debounce="50"></schmancy-scroll>
	 */
	@property({ type: Number })
	public debounce = 10

	/**
	 * Scrolls the container to the specified position
	 * @param options - ScrollToOptions or a number representing the top position
	 * @param top - For backward compatibility, if options is a number, this is treated as "behavior"
	 */
	public override scrollTo(options?: ScrollToOptions | number, top?: number): void {
		if (!this.scroller) return

		if (typeof options === 'number') {
			// Legacy support for scrollTo(top, behavior)
			this.scroller.scrollTo({
				top: options,
				behavior: top ? 'smooth' : 'auto',
			})
		} else if (options) {
			this.scroller.scrollTo(options)
		} else {
			this.scroller.scrollTo({
				top: 0,
				left: 0,
				behavior: 'auto',
			})
		}
	}

	/**
	 * Scrolls the container horizontally to the specified position
	 * @param left - The horizontal position to scroll to (in pixels)
	 * @param behavior - The scroll behavior ('auto' or 'smooth')
	 */
	public scrollToLeft(left: number, behavior: ScrollBehavior = 'auto'): void {
		if (this.scroller) {
			this.scroller.scrollTo({
				left,
				behavior,
			})
		}
	}

	/**
	 * Called after the component's first update
	 * Sets up the scroll event listener with debouncing
	 * @protected
	 */
	protected firstUpdated(): void {
		// Set up scroll event listening with debounce
		fromEvent(this.scroller, 'scroll', {
			passive: true,
		})
			.pipe(
				debounceTime(this.debounce),
				takeUntil(this.disconnecting), // Unsubscribe when the element is destroyed
			)
			.subscribe(e => {
				// Always include the original required properties for backward compatibility
				const scrollTop = this.scroller.scrollTop
				const scrollHeight = this.scroller.scrollHeight
				const clientHeight = this.scroller.clientHeight

				// Include horizontal scroll information as optional properties
				const scrollLeft = this.scroller.scrollLeft
				const scrollWidth = this.scroller.scrollWidth
				const clientWidth = this.scroller.clientWidth

				this.dispatchEvent(
					new CustomEvent('scroll', {
						detail: {
							// Original required properties first
							scrollTop,
							scrollHeight,
							clientHeight,
							e,
							// New optional properties last
							scrollLeft,
							scrollWidth,
							clientWidth,
						},
						bubbles: true,
						composed: true,
					}) as SchmancyScrollEvent,
				)
			})

		// Set up global command event listener
		fromEvent<SchmancyScrollCommandEvent>(window, '@schmancy:scrollTo')
			.pipe(
				// Only process events targeting this component by name
				filter(e => this.name !== undefined && e.detail.name === this.name),
				takeUntil(this.disconnecting),
			)
			.subscribe(e => {
				if (e.detail.action === 'scrollTo' && typeof e.detail.top === 'number') {
					const options: ScrollToOptions = {
						behavior: 'smooth',
						top: e.detail.top, // Required for backward compatibility
					}

					// Add optional left position if provided
					if (typeof e.detail.left === 'number') {
						options.left = e.detail.left
					}

					this.scrollTo(options)
				}
			})
	}

	/**
	 * Renders the component template
	 * @returns {TemplateResult} The template to render
	 * @protected
	 */
	protected render() {
		// The classes are dynamically assigned based on the properties
		const classes = {
			'h-full w-full inset-0 scroll-smooth overscroll-contain': true,
			'overflow-y-auto': this.direction !== 'horizontal',
			'overflow-y-hidden': this.direction === 'horizontal',
			'overflow-x-auto': this.direction !== 'vertical',
			'overflow-x-hidden': this.direction === 'vertical',
			'scrollbar-hide': this.hide,
		}

		return html`
			<div class="relative inset-0 h-full w-full overscroll-none">
				<div id="scroller" part="scroller" class=${this.classMap(classes)}>
					<slot></slot>
				</div>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-scroll': SchmancyScroll
	}
}
