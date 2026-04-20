import { BehaviorSubject, fromEvent } from 'rxjs'
import { map, startWith } from 'rxjs/operators'

/**
 * Shared reactive reduced-motion preference.
 *
 * All physics directives observe this — if the user toggles reduced motion
 * while the page is open, directives respond immediately.
 *
 * @example
 * ```ts
 * import { reducedMotion$ } from './reduced-motion'
 * if (reducedMotion$.value) return // skip animation
 * ```
 */
const mediaQuery = typeof window !== 'undefined'
	? window.matchMedia('(prefers-reduced-motion: reduce)')
	: undefined

export const reducedMotion$ = new BehaviorSubject<boolean>(mediaQuery?.matches ?? false)

// Reactively listen for changes via RxJS
if (mediaQuery) {
	fromEvent<MediaQueryListEvent>(mediaQuery, 'change').pipe(
		map(e => e.matches),
		startWith(mediaQuery.matches),
	).subscribe(matches => {
		reducedMotion$.next(matches)
	})
}
