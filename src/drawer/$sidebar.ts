import { Subject } from 'rxjs'

export enum SchmancyEvents {
	DRAWER_TOGGLE = 'SchmancytoggleSidebar',
}

class Drawer {
	private $drawer = new Subject<{
		self: HTMLElement
		state: boolean
	}>()
	constructor() {
		this.$drawer.subscribe(data => {
			if (data.state) {
				data.self.dispatchEvent(
					new CustomEvent(SchmancyEvents.DRAWER_TOGGLE, {
						detail: {
							state: 'open',
						},
						bubbles: true,
						composed: true,
					}),
				)
			} else {
				data.self.dispatchEvent(
					new CustomEvent(SchmancyEvents.DRAWER_TOGGLE, {
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
	open(self: HTMLElement) {
		this.$drawer.next({
			self,
			state: true,
		})
	}
	close(self: HTMLElement) {
		this.$drawer.next({
			self,
			state: false,
		})
	}
}

export const schmancyDrawer = new Drawer()
