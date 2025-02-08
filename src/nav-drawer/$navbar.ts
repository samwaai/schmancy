import { SchmancyEvents } from '@schmancy/types/events'
import { debounceTime, distinctUntilKeyChanged, Subject } from 'rxjs'

class Drawer {
	private $drawer = new Subject<{
		self: HTMLElement
		state: boolean
	}>()
	constructor() {
		this.$drawer.pipe(distinctUntilKeyChanged('state'), debounceTime(100)).subscribe(data => {
			console.log('drawer', data)
			if (data.state) {
				window.dispatchEvent(
					new CustomEvent(SchmancyEvents.NavDrawer_toggle, {
						detail: {
							state: 'open',
						},
						bubbles: true,
						composed: true,
					}),
				)
			} else {
				window.dispatchEvent(
					new CustomEvent(SchmancyEvents.NavDrawer_toggle, {
						detail: {
							state: 'close',
						},
						bubbles: true,
						composed: true,
					}),
				)
			}
		})
	}
	open(self?: HTMLElement) {
		this.$drawer.next({
			self,
			state: true,
		})
	}
	close(self?: HTMLElement) {
		this.$drawer.next({
			self,
			state: false,
		})
	}
}

export const schmancyNavDrawer = new Drawer()
const $drawer = schmancyNavDrawer

export { $drawer }
