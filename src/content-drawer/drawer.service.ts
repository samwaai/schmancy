import { SchmancyEvents } from '@schmancy/types/events'
import { Subject } from 'rxjs'

type DrawerAction = 'dismiss' | 'render' | 'push'
type TRef = Element | Window
type TRenderRequest = HTMLElement
export type TRenderCustomEvent = CustomEvent<{
	component: TRenderRequest
	title?: string
}>

type ComponentType = string | HTMLElement | (() => HTMLElement) | (() => Promise<{ default: any }>)

class DrawerService {
	private $drawer = new Subject<{
		ref: TRef
		action: DrawerAction
		component?: TRenderRequest | ComponentType
		title?: string
	}>()
	private lastComponent: HTMLElement | null = null

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
			} else if (data.action === 'push') {
				this.handlePush(data.ref, data.component as ComponentType)
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

	private async handlePush(ref: TRef, component: ComponentType) {
		let resolvedComponent: HTMLElement

		// Resolve component to HTMLElement
		if (typeof component === 'string') {
			// String tag name - create element
			resolvedComponent = document.createElement(component) as HTMLElement
		} else if (component instanceof HTMLElement) {
			// Already an HTMLElement
			resolvedComponent = component
		} else if (typeof component === 'function') {
			// Factory function or async module
			try {
				const result = await component()
				if (result && typeof result === 'object' && 'default' in result) {
					// ES module with default export
					const Constructor = result.default
					resolvedComponent = new Constructor() as HTMLElement
				} else if (result instanceof HTMLElement) {
					// Factory returned HTMLElement
					resolvedComponent = result
				} else {
					// Assume it's a constructor
					resolvedComponent = new (result as any)() as HTMLElement
				}
			} catch (error) {
				console.error('Failed to resolve component:', error)
				return
			}
		} else {
			console.error('Invalid component type:', component)
			return
		}

		// Check if it's the same component instance and force update
		if (this.lastComponent === resolvedComponent && 'requestUpdate' in resolvedComponent) {
			(resolvedComponent as any).requestUpdate()
		}
		this.lastComponent = resolvedComponent

		// Dispatch events to open drawer and render component
		ref.dispatchEvent(
			new CustomEvent(SchmancyEvents.ContentDrawerToggle, {
				detail: { state: 'open' },
				bubbles: true,
				composed: true,
			}),
		)
		ref.dispatchEvent(
			new CustomEvent('schmancy-content-drawer-render', {
				detail: { component: resolvedComponent },
				bubbles: true,
				composed: true,
			}),
		)
	}

	push(component: ComponentType) {
		// Use window as default ref for simplicity
		this.$drawer.next({
			action: 'push',
			ref: window,
			component: component,
		})
	}
}

export const schmancyContentDrawer = new DrawerService()