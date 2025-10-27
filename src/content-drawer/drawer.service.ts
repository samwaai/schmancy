import { SchmancyEvents } from '@schmancy/types/events'
import { Subject } from 'rxjs'
import { ComponentType } from '../area/router.types'

// type DrawerAction = 'dismiss' | 'render' | 'push'
type TRef = Element | Window
type TRenderRequest = ComponentType
export type TRenderCustomEvent = CustomEvent<{
	component: TRenderRequest
	title?: string
	state?: Record<string, unknown>
	params?: Record<string, unknown>
	props?: Record<string, unknown>
}>

export type DrawerPushOptions = {
	component: ComponentType
	state?: Record<string, unknown>
	params?: Record<string, unknown>
	props?: Record<string, unknown>
}

type DrawerCommand =
	| { action: 'dismiss'; ref: TRef }
	| { action: 'render'; ref: TRef; component: TRenderRequest; title?: string }
	| { action: 'push'; ref: TRef; component: ComponentType; state?: Record<string, unknown>; params?: Record<string, unknown>; props?: Record<string, unknown> }

class DrawerService {
	private $drawer = new Subject<DrawerCommand>()

	constructor() {
		this.$drawer.pipe().subscribe(command => {
			switch (command.action) {
				case 'dismiss':
					this.dispatchToggleEvent(command.ref, 'close')
					break
				case 'render':
					this.dispatchToggleEvent(command.ref, 'open')
					this.dispatchRenderEvent(command.ref, command.component, command.title)
					break
				case 'push':
					this.handlePush(command.ref, command.component, command.state, command.params, command.props)
					break
			}
		})
	}

	private dispatchToggleEvent(ref: TRef, state: 'open' | 'close') {
		ref.dispatchEvent(
			new CustomEvent(SchmancyEvents.ContentDrawerToggle, {
				detail: { state },
				bubbles: true,
				composed: true,
			})
		)
	}

	private dispatchRenderEvent(
		ref: TRef,
		component: TRenderRequest,
		title?: string,
		state?: Record<string, unknown>,
		params?: Record<string, unknown>,
		props?: Record<string, unknown>
	) {
		ref.dispatchEvent(
			new CustomEvent('schmancy-content-drawer-render', {
				detail: { component, title, state, params, props },
				bubbles: true,
				composed: true,
			})
		)
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

	private handlePush(
		ref: TRef,
		component: ComponentType,
		state?: Record<string, unknown>,
		params?: Record<string, unknown>,
		props?: Record<string, unknown>
	) {
		// Simply pass through to drawer component - it will call area.push() which handles all component resolution
		this.dispatchToggleEvent(ref, 'open')
		this.dispatchRenderEvent(ref, component, undefined, state, params, props)
	}

	/**
	 * Push a component to the content drawer
	 * @param options - Component configuration object with optional state/params/props
	 * @deprecated Passing a raw ComponentType is deprecated. Use DrawerPushOptions object instead.
	 * @example
	 * // Recommended
	 * schmancyContentDrawer.push({
	 *   component: myComponent,
	 *   props: { id: '123' }
	 * })
	 *
	 * // Legacy (deprecated)
	 * schmancyContentDrawer.push(myComponent)
	 */
	push(options: ComponentType | DrawerPushOptions) {
		const normalized = this.normalizeOptions(options)
		this.$drawer.next({
			action: 'push',
			ref: window,
			...normalized,
		})
	}

	private normalizeOptions(options: ComponentType | DrawerPushOptions): {
		component: ComponentType
		state?: Record<string, unknown>
		params?: Record<string, unknown>
		props?: Record<string, unknown>
	} {
		if (typeof options === 'object' && options !== null && 'component' in options) {
			return options
		}
		return { component: options as ComponentType }
	}
}

export const schmancyContentDrawer = new DrawerService()