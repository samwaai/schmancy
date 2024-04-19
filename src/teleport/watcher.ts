import { Observable, interval } from 'rxjs'
import { distinctUntilChanged, map, take } from 'rxjs/operators'

// Function to monitor element's bounding client rect
export function watchElementRect(element: Element): Observable<DOMRectReadOnly> {
	return interval(50).pipe(
		// startWith(true),
		map(() => element.getBoundingClientRect()),
		distinctUntilChanged(
			(prev, curr) =>
				prev.width === curr.width &&
				prev.height === curr.height &&
				prev.top === curr.top &&
				prev.right === curr.right &&
				prev.bottom === curr.bottom &&
				prev.left === curr.left,
		),
		take(1),
	)
}
