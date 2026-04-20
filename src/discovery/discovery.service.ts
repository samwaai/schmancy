import { fromEvent, timer, race, Observable } from 'rxjs'
import { takeUntil, map, defaultIfEmpty, take } from 'rxjs/operators'

/**
 * Global discovery event names
 */
const DISCOVER_EVENT = 'schmancy-discover'
const DISCOVER_RESPONSE_EVENT = 'schmancy-discover-response'

/**
 * Discovery request detail
 */
interface DiscoverRequest {
	selector: string
	requestId: string
}

/**
 * Discovery response detail
 */
interface DiscoverResponse {
	requestId: string
	element: HTMLElement
}

/**
 * Discover a component in the DOM using the WhereAreYou/HereIAm pattern.
 *
 * @param componentTag - The tag name of the component to discover (e.g., 'schmancy-navigation-rail')
 * @param timeout - How long to wait for a response in milliseconds (default: 100)
 * @returns Observable that emits the discovered component or null if not found
 */
export function discoverComponent<T extends HTMLElement>(
	componentTag: string,
	timeout = 100,
): Observable<T | null> {
	const whereAreYouEvent = `${componentTag}-where-are-you`
	const hereIAmEvent = `${componentTag}-here-i-am`

	return new Observable(subscriber => {
		const subscription = fromEvent<CustomEvent>(window, hereIAmEvent)
			.pipe(
				takeUntil(timer(timeout)),
				map(e => e.detail.component as T),
				defaultIfEmpty(null),
			)
			.subscribe(component => {
				subscriber.next(component)
				subscriber.complete()
			})

		window.dispatchEvent(
			new CustomEvent(whereAreYouEvent, {
				bubbles: true,
				composed: true,
			}),
		)

		return () => subscription.unsubscribe()
	})
}

/**
 * Discover any of multiple components using race.
 * Returns the first component that responds.
 *
 * @param componentTags - Array of component tag names to discover
 * @returns Observable that emits the first discovered component or null if none found
 */
export function discoverAnyComponent<T extends HTMLElement>(...componentTags: string[]): Observable<T | null> {
	if (componentTags.length === 0) {
		return new Observable(subscriber => {
			subscriber.next(null)
			subscriber.complete()
		})
	}

	return race(...componentTags.map(tag => discoverComponent<T>(tag)))
}

/**
 * Universal element discovery - finds ANY element by CSS selector across shadow DOM boundaries.
 * Uses event-based discovery pattern - no DOM traversal needed.
 *
 * How it works:
 * 1. Broadcasts a discovery request event on window
 * 2. All $LitElement components receive this event and check their shadow DOM
 * 3. If a match is found, they respond with the element
 *
 * @param selector - CSS selector (e.g., '#my-id', '.my-class', '[data-attr]')
 * @param timeout - How long to wait for a response in milliseconds (default: 150)
 * @returns Observable that emits the discovered element or null if not found
 *
 * @example
 * ```typescript
 * // Find element by ID across shadow boundaries
 * discoverElement('#app-card').subscribe(el => {
 *   if (el) console.log('Found:', el)
 * })
 *
 * // Find element by class
 * discoverElement('.special-button').subscribe(el => {...})
 * ```
 */
export function discoverElement<T extends HTMLElement>(
	selector: string,
	timeout = 150,
): Observable<T | null> {
	const requestId = `discover-${Date.now()}-${Math.random().toString(36).slice(2)}`

	return new Observable(subscriber => {
		const subscription = fromEvent<CustomEvent<DiscoverResponse>>(window, DISCOVER_RESPONSE_EVENT)
			.pipe(
				takeUntil(timer(timeout)),
				map(e => e.detail),
				map(detail => (detail.requestId === requestId ? (detail.element as T) : null)),
				take(1),
				defaultIfEmpty(null),
			)
			.subscribe(element => {
				subscriber.next(element)
				subscriber.complete()
			})

		window.dispatchEvent(
			new CustomEvent<DiscoverRequest>(DISCOVER_EVENT, {
				detail: { selector, requestId },
				bubbles: true,
				composed: true,
			}),
		)

		return () => subscription.unsubscribe()
	})
}

/**
 * Discover multiple elements matching a selector.
 * Collects all responses within the timeout period.
 *
 * @param selector - CSS selector
 * @param timeout - How long to collect responses (default: 150ms)
 * @returns Observable that emits array of discovered elements
 */
export function discoverAllElements<T extends HTMLElement>(
	selector: string,
	timeout = 150,
): Observable<T[]> {
	const requestId = `discover-all-${Date.now()}-${Math.random().toString(36).slice(2)}`
	const elements: T[] = []

	return new Observable(subscriber => {
		const subscription = fromEvent<CustomEvent<DiscoverResponse>>(window, DISCOVER_RESPONSE_EVENT)
			.pipe(takeUntil(timer(timeout)))
			.subscribe({
				next: e => {
					if (e.detail.requestId === requestId) {
						elements.push(e.detail.element as T)
					}
				},
				complete: () => {
					subscriber.next(elements)
					subscriber.complete()
				},
			})

		window.dispatchEvent(
			new CustomEvent<DiscoverRequest>(DISCOVER_EVENT, {
				detail: { selector, requestId },
				bubbles: true,
				composed: true,
			}),
		)

		return () => subscription.unsubscribe()
	})
}

/**
 * Smart discovery - automatically detects if input is a CSS selector or component tag.
 *
 * @param query - CSS selector (starts with #, ., [) OR component tag name
 * @param timeout - How long to wait (default: 150ms)
 * @returns Observable that emits the discovered element or null
 *
 * @example
 * ```typescript
 * // CSS selector - uses discoverElement
 * discover('#my-element').subscribe(...)
 *
 * // Component tag - uses discoverComponent
 * discover('schmancy-fancy').subscribe(...)
 * ```
 */
export function discover<T extends HTMLElement>(
	query: string,
	timeout = 150,
): Observable<T | null> {
	const isCssSelector = /^[#.\[]/.test(query)

	if (isCssSelector) {
		return discoverElement<T>(query, timeout)
	}

	return discoverComponent<T>(query, timeout)
}

// Export event names for use in baseElement
export { DISCOVER_EVENT, DISCOVER_RESPONSE_EVENT }
export type { DiscoverRequest, DiscoverResponse }
