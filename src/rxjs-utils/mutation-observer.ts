import { Observable } from 'rxjs'

export const mutationObserver = (
	target: HTMLElement,
	config: MutationObserverInit = {
		attributes: true,
		childList: true,
		subtree: true,
	},
): Observable<MutationRecord[]> => {
	return new Observable(observer => {
		const mutation = new MutationObserver(mutations => {
			observer.next(mutations)
		})
		mutation.observe(target, config)
		const unsubscribe = () => {
			mutation.disconnect()
		}
		return unsubscribe
	})
}
export default mutationObserver
