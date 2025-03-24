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
	 * @param top - The vertical position to scroll to (in pixels)
	 */
	public override scrollTo(options?: ScrollToOptions | number, top?: number): void {
		if (this.scroller) {
			if (typeof options === 'number') {
				this.scroller.scrollTo({ top: options, behavior: top ? 'smooth' : 'auto' })
			} else if (options) {
				this.scroller.scrollTo(options)
			} else {
				this.scroller.scrollTo({ top: 0, behavior: 'auto' })
			}
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
				const scrollTop = this.scroller.scrollTop
				const scrollHeight = this.scroller.scrollHeight
				const clientHeight = this.scroller.clientHeight
				this.dispatchEvent(
					new CustomEvent('scroll', {
						detail: { scrollTop, scrollHeight, clientHeight, e },
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
					this.scrollTo({
						top: e.detail.top,
						behavior: 'smooth',
					})
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
