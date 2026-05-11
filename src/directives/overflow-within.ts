import { noChange } from 'lit'
import { AsyncDirective, directive } from 'lit/async-directive.js'
import { ElementPart, PartType } from 'lit/directive.js'
import { Subject, debounceTime, filter, fromEvent, takeUntil } from 'rxjs'

/**
 * Detail payload for the directive's enriched `scroll` event.
 */
export interface OverflowWithinEvent
	extends CustomEvent<{
		scrollTop: number
		scrollHeight: number
		clientHeight: number
		scrollLeft: number
		scrollWidth: number
		clientWidth: number
		e: Event
	}> {}

/**
 * Detail payload for the global `@schmancy:scrollTo` command.
 */
export interface OverflowWithinCommandEvent
	extends CustomEvent<{
		name: string
		action: 'scrollTo'
		top: number
		left?: number
	}> {}

export interface OverflowWithinOptions {
	/** Hide native scrollbars while keeping scroll behavior intact. */
	hide?: boolean
	/** Which axis can scroll. Default `'both'`. */
	direction?: 'vertical' | 'horizontal' | 'both'
	/**
	 * Optional name for cross-component control via the global
	 * `@schmancy:scrollTo` event.
	 */
	name?: string
	/** Debounce in ms for the dispatched `scroll` event. Default `10`. */
	debounce?: number
}

const SCROLLBAR_HIDE_CLASS = 'schmancy-overflow-within-hidden'
let stylesheetInstalled = false

function installHideStylesheet() {
	if (stylesheetInstalled) return
	stylesheetInstalled = true
	const sheet = new CSSStyleSheet()
	sheet.replaceSync(
		`.${SCROLLBAR_HIDE_CLASS} { scrollbar-width: none; -ms-overflow-style: none; }
		 .${SCROLLBAR_HIDE_CLASS}::-webkit-scrollbar { display: none; }`,
	)
	document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet]
}

/**
 * overflowWithin directive — turns any element into a contained overflow
 * boundary. Content stays *within* the element; what overflows scrolls
 * inside, can't escape (overscroll contained, rubber-band suppressed).
 *
 *   - Overflow per `direction` axis
 *   - Smooth scroll-behavior
 *   - Overscroll containment (no rubber-band escape)
 *   - Optional hidden scrollbar via a document-level stylesheet
 *   - Debounced enriched `scroll` event
 *   - Global `@schmancy:scrollTo` command listener (when `name` is set)
 *   - min-height / min-width 0 so the container can clip inside grid/flex cells
 *
 * Apply at the element where overflow should be contained; the consumer's
 * layout grid/flex container can itself be the overflow boundary — no
 * wrapper element needed.
 *
 * @example
 *   render() {
 *     return html`
 *       <div class="grid grid-rows-[auto_1fr]" ${overflowWithin({ hide: true })}>
 *         <header>...</header>
 *         <section>...scrollable content...</section>
 *       </div>
 *     `
 *   }
 */
class OverflowWithinDirective extends AsyncDirective {
	private element: HTMLElement | null = null
	private disconnecting$ = new Subject<void>()
	private currentName?: string

	render(_options?: OverflowWithinOptions) {
		return noChange
	}

	override update(part: ElementPart, [options = {}]: [OverflowWithinOptions?]) {
		if (part.type !== PartType.ELEMENT) {
			throw new Error('overflowWithin directive can only be used on elements')
		}
		const el = part.element as HTMLElement
		const { hide = false, direction = 'both', name, debounce = 10 } = options

		const s = el.style
		s.minHeight = '0'
		s.minWidth = '0'
		s.boxSizing = 'border-box'
		s.overflowY = direction === 'horizontal' ? 'hidden' : 'auto'
		s.overflowX = direction === 'vertical' ? 'hidden' : 'auto'
		s.scrollBehavior = 'smooth'
		s.overscrollBehavior = 'contain'

		if (hide) {
			installHideStylesheet()
			el.classList.add(SCROLLBAR_HIDE_CLASS)
		} else {
			el.classList.remove(SCROLLBAR_HIDE_CLASS)
		}

		const isNewElement = this.element !== el
		const isNameChange = this.currentName !== name

		if (isNewElement) {
			this.element = el
			this.subscribe(debounce, name)
		} else if (isNameChange) {
			// resubscribe with new name binding
			this.disconnecting$.next()
			this.disconnecting$ = new Subject<void>()
			this.subscribe(debounce, name)
		}
		this.currentName = name

		return noChange
	}

	private subscribe(debounce: number, name: string | undefined) {
		if (!this.element) return
		const el = this.element

		fromEvent(el, 'scroll', { passive: true })
			.pipe(debounceTime(debounce), takeUntil(this.disconnecting$))
			.subscribe((e) => {
				el.dispatchEvent(
					new CustomEvent('scroll', {
						detail: {
							scrollTop: el.scrollTop,
							scrollHeight: el.scrollHeight,
							clientHeight: el.clientHeight,
							scrollLeft: el.scrollLeft,
							scrollWidth: el.scrollWidth,
							clientWidth: el.clientWidth,
							e,
						},
						bubbles: true,
						composed: true,
					}) as OverflowWithinEvent,
				)
			})

		if (name !== undefined) {
			fromEvent<OverflowWithinCommandEvent>(window, '@schmancy:scrollTo')
				.pipe(
					filter((evt) => evt.detail.name === name && evt.detail.action === 'scrollTo'),
					takeUntil(this.disconnecting$),
				)
				.subscribe((evt) => {
					const options: ScrollToOptions = { behavior: 'smooth', top: evt.detail.top }
					if (typeof evt.detail.left === 'number') options.left = evt.detail.left
					el.scrollTo(options)
				})
		}
	}

	protected override disconnected() {
		this.disconnecting$.next()
		this.element = null
	}

	protected override reconnected() {
		if (this.element) {
			this.disconnecting$ = new Subject<void>()
			this.subscribe(10, this.currentName)
		}
	}
}

export const overflowWithin = directive(OverflowWithinDirective)
