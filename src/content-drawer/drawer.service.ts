import { SchmancyEvents } from '@schmancy/types/events'
import { Subject } from 'rxjs'

type DrawerAction = 'dismiss' | 'render' | 'push'
type TRef = Element | Window
type TRenderRequest = HTMLElement
export type TRenderCustomEvent = CustomEvent<{
	component: TRenderRequest
	title?: string
	state?: Record<string, unknown>
	params?: Record<string, unknown>
	props?: Record<string, unknown>
}>

type ComponentType = string | HTMLElement | (() => HTMLElement) | (() => Promise<{ default: any }>)

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
	private lastComponent: HTMLElement | null = null

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

	private async handlePush(
		ref: TRef,
		component: ComponentType,
		state?: Record<string, unknown>,
		params?: Record<string, unknown>,
		props?: Record<string, unknown>
	) {
		const resolvedComponent = await this.resolveComponent(component)
		if (!resolvedComponent) return

		// Force update if same instance
		if (this.lastComponent === resolvedComponent && 'requestUpdate' in resolvedComponent) {
			(resolvedComponent as any).requestUpdate()
		}
		this.lastComponent = resolvedComponent

		this.dispatchToggleEvent(ref, 'open')
		this.dispatchRenderEvent(ref, resolvedComponent, undefined, state, params, props)
	}

	private async resolveComponent(component: ComponentType): Promise<HTMLElement | null> {
		if (typeof component === 'string') {
			return document.createElement(component) as HTMLElement
		}

		if (component instanceof HTMLElement) {
			return component
		}

		if (typeof component === 'function') {
			try {
				const result = await component()
				if (result && typeof result === 'object' && 'default' in result) {
					return new result.default() as HTMLElement
				}
				if (result instanceof HTMLElement) {
					return result
				}
				return new (result as any)() as HTMLElement
			} catch (error) {
				console.error('Failed to resolve component:', error)
				return null
			}
		}

		console.error('Invalid component type:', component)
		return null
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
		return { component: options }
	}
}

export const schmancyContentDrawer = new DrawerService()