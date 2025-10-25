import { fromEvent, timer, race, Observable } from 'rxjs'
import { takeUntil, map, defaultIfEmpty } from 'rxjs/operators'

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
		// Listen for response first (you were right!)
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

		// Then dispatch discovery request
		window.dispatchEvent(
			new CustomEvent(whereAreYouEvent, {
				bubbles: true,
				composed: true,
			}),
		)

		// Return cleanup function
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
