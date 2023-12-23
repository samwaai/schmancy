import { SchmancyEvents } from '@schmancy/events'
import { Subject } from 'rxjs'

type DrawerAction = 'dismiss' | 'render'
type TRef = Element | Window
type TRenderRequest = HTMLElement | CustomElementConstructor | string | Promise<NodeModule>

class Drawer {
	private $drawer = new Subject<{
		ref: TRef
		action: DrawerAction
		component?: TRenderRequest
	}>()
	constructor() {
		this.$drawer.pipe().subscribe(data => {
			if (data.action === 'dismiss') {
				data.ref.dispatchEvent(
					new CustomEvent(SchmancyEvents.ContentDrawerToggle, {
						detail: {
							state: 'close',
						},
						bubbles: true,
						composed: true,
					}),
				)
			} else if (data.action === 'render') {
				data.ref.dispatchEvent(
					new CustomEvent(SchmancyEvents.ContentDrawerToggle, {
						detail: {
							state: 'open',
						},
						bubbles: true,
						composed: true,
					}),
				)
				data.ref.dispatchEvent(
					new CustomEvent('schmancy-content-drawer-render', {
						detail: {
							component: data.component,
						},
						bubbles: true,
						composed: true,
					}),
				)
			}
		})
	}

	dimiss(ref: TRef) {
		this.$drawer.next({
			action: 'dismiss',
			ref: ref,
		})
	}

	render(ref: TRef, component: TRenderRequest) {
		ref.dispatchEvent(new CustomEvent('custom-event'))
		this.$drawer.next({
			action: 'render',
			ref: ref,
			component: component,
		})
	}
}

export const schmancyContentDrawer = new Drawer()
