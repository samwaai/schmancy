import { Observable } from 'rxjs'

export function intersection$(
	element: Element | Element[],
	options = {
		threshold: 0.5,
	},
) {
	return new Observable(subscriber => {
		const observer = new IntersectionObserver(entries => {
			subscriber.next(entries) // Emit the entries array
		}, options)

		// Observe each element
		if (Array.isArray(element)) {
			element.forEach(el => observer.observe(el))
		} else {
			observer.observe(element)
		}

		// Cleanup on unsubscription
		return () => {
			observer.disconnect()
		}
	})
}
