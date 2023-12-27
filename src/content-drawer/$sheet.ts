import { SchmancyEvents } from '@schmancy/types/events'
import { Subject } from 'rxjs'

type DrawerAction = 'dismiss' | 'render'
type TRef = Element | Window
type TRenderRequest = HTMLElement
export type TRenderCustomEvent = CustomEvent<{
	component: TRenderRequest
	title?: string
}>
class Drawer {
	private $drawer = new Subject<{
		ref: TRef
		action: DrawerAction
		component?: TRenderRequest
		title?: string
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
							title: data.title,
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

	render(ref: TRef, component: TRenderRequest, title?: string) {
		ref.dispatchEvent(new CustomEvent('custom-event'))
		this.$drawer.next({
			action: 'render',
			ref: ref,
			component: component,
			title,
		})
	}
}

export const schmancyContentDrawer = new Drawer()
