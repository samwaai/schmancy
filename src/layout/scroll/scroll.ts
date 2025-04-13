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
		/** Current scroll position from the left */
		scrollLeft: number
		/** Total scrollable height of the content */
		scrollHeight: number
		/** Total scrollable width of the content */
		scrollWidth: number
		/** Visible height of the container */
		clientHeight: number
		/** Visible width of the container */
		clientWidth: number
		/** Original scroll event */
		e: Event
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
		/** Vertical scroll position for scrollTo action (optional) */
		top?: number
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
 * @csspart content - The content wrapper with padding
 *
 * @example
 * ```html
 * <!-- For horizontal scrolling with padding -->
 * <schmancy-scroll hide name="main-content" scroll-padding-start="24" scroll-padding-end="24">
 *   <div style="width: 1200px">Horizontally scrollable content goes here</div>
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
	.content-wrapper {
		/* Ensures the padding is preserved during scroll */
		box-sizing: border-box;
		width: 100%;
		display: inline-block; /* Important for proper horizontal scrolling */
		min-width: 100%;
		white-space: nowrap; /* Ensures content doesn't wrap */
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
	 * Amount of padding at the start (top) of the scrollable area in pixels.
	 * Creates space between the top of the viewport and the content.
	 *
	 * @attr scroll-padding-start
	 * @example <schmancy-scroll scroll-padding-start="24"></schmancy-scroll>
	 */
	@property({ type: Number, attribute: 'scroll-padding-start', reflect: true })
	public scrollPaddingStart = 0

	/**
	 * Amount of padding at the end (bottom) of the scrollable area in pixels.
	 * Creates space between the bottom of the viewport and the content.
	 *
	 * @attr scroll-padding-end
	 * @example <schmancy-scroll scroll-padding-end="24"></schmancy-scroll>
	 */
	@property({ type: Number, attribute: 'scroll-padding-end', reflect: true })
	public scrollPaddingEnd = 0

	/**
	 * Reference to the inner scrollable div element
	 * @public
	 */
	@query('#scroller')
	scroller!: HTMLElement

	/**
	 * Reference to the content wrapper div element
	 * @public
	 */
	@query('#content-wrapper')
	contentWrapper!: HTMLElement

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
	 * Scrolls the container to the specified position, accounting for scroll padding
	 * @param options - ScrollToOptions, a number for the horizontal position (legacy API support),
	 *                  or undefined to scroll to beginning
	 * @param top - Optional top value when first parameter is a number (legacy API support)
	 */
	public override scrollTo(options?: ScrollToOptions | number, top?: number): void {
		if (!this.scroller) return

		if (typeof options === 'number') {
			// For backward compatibility - when a number is passed, we treat it as a left position
			// This maintains compatibility with the original API
			const adjustedLeft = Math.max(0, options)
			this.scroller.scrollTo({
				left: adjustedLeft,
				behavior: top ? 'smooth' : 'auto',
			})
		} else if (options) {
			// If options.left is provided, handle horizontal scrolling
			if (options.left !== undefined) {
				const adjustedOptions = { ...options }
				adjustedOptions.left = Math.max(0, options.left)
				this.scroller.scrollTo(adjustedOptions)
			}
			// If only top is provided, maintain original behavior for backward compatibility
			else if (options.top !== undefined) {
				this.scroller.scrollTo(options)
			} else {
				this.scroller.scrollTo(options)
			}
		} else {
			// Default scroll to beginning (left side)
			this.scroller.scrollTo({ left: 0, behavior: 'auto' })
		}
	}

	/**
	 * Called when component properties change
	 * Updates the padding styles when padding properties change
	 * @protected
	 */
	protected updated(changedProperties: Map<string, unknown>): void {
		super.updated(changedProperties)

		if (changedProperties.has('scrollPaddingStart') || changedProperties.has('scrollPaddingEnd')) {
			this.updatePaddingStyles()
		}
	}

	/**
	 * Updates the content wrapper's padding and applies scroll-padding CSS properties
	 * to the scroller element
	 * @private
	 */
	private updatePaddingStyles(): void {
		if (!this.scroller) return

		// Apply CSS scroll-padding properties directly to the scroller
		// This is the standard way to handle scroll padding in CSS
		this.scroller.style.scrollPaddingInlineStart = `${this.scrollPaddingStart}px`
		this.scroller.style.scrollPaddingInlineEnd = `${this.scrollPaddingEnd}px`

		// Also set padding on content for visual consistency
		if (this.contentWrapper) {
			this.contentWrapper.style.paddingLeft = `${this.scrollPaddingStart}px`
		}
	}

	/**
	 * Called after the component's first update
	 * Sets up the scroll event listener with debouncing and applies initial styles
	 * @protected
	 */
	protected firstUpdated(): void {
		// Apply initial padding styles
		this.updatePaddingStyles()

		// Set up scroll event listening with debounce
		fromEvent(this.scroller, 'scroll', {
			passive: true,
		})
			.pipe(
				debounceTime(this.debounce),
				takeUntil(this.disconnecting), // Unsubscribe when the element is destroyed
			)
			.subscribe(e => {
				const scrollTop = this.scroller.scrollTop
				const scrollLeft = this.scroller.scrollLeft
				const scrollHeight = this.scroller.scrollHeight
				const scrollWidth = this.scroller.scrollWidth
				const clientHeight = this.scroller.clientHeight
				const clientWidth = this.scroller.clientWidth
				this.dispatchEvent(
					new CustomEvent('scroll', {
						detail: {
							scrollTop,
							scrollLeft,
							scrollHeight,
							scrollWidth,
							clientHeight,
							clientWidth,
							e,
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
				if (e.detail.action === 'scrollTo') {
					const options: ScrollToOptions = {
						behavior: 'smooth',
					}

					// Add top or left position if provided
					if (typeof e.detail.top === 'number') {
						options.top = e.detail.top
					}

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
		// The classes are dynamically assigned based on the `hide` property.
		const classes = {
			'h-full w-full inset-0 overflow-x-auto overflow-y-auto scroll-smooth overscroll-contain': true,
			'scrollbar-hide': this.hide,
		}

		return html`
			<div class="relative inset-0 h-full w-full overscroll-none">
				<div id="scroller" part="scroller" class=${this.classMap(classes)}>
					<div id="content-wrapper" part="content" class="content-wrapper">
						<slot></slot>
					</div>
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
