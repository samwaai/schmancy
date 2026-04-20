import { SchmancyEvents } from '@schmancy/types/events'
import { BehaviorSubject, Subject, concatMap, delay, of, tap } from 'rxjs'
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
	private pushCounter = 0
	private isDismissing$ = new BehaviorSubject<boolean>(false)

	constructor() {
		// Use concatMap to queue commands and process them sequentially
		this.$drawer.pipe(
			concatMap(command => {
				switch (command.action) {
					case 'dismiss':
						return of(command).pipe(
							tap(() => {
								this.isDismissing$.next(true)
								this.dispatchToggleEvent(command.ref, 'close')
							}),
							// Wait for dismiss animation (250ms from sheet.ts)
							delay(300),
							tap(() => this.isDismissing$.next(false))
						)
					case 'render':
						return of(command).pipe(
							tap(() => {
								this.dispatchToggleEvent(command.ref, 'open')
								this.dispatchRenderEvent(command.ref, command.component, command.title)
							})
						)
					case 'push':
						return of(command).pipe(
							tap(() => this.handlePush(command.ref, command.component, command.state, command.params, command.props))
						)
					default:
						return of(null)
				}
			})
		).subscribe()
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
		// Auto-increment counter to make every push unique
		// Area router uses distinctUntilChanged on component+state+params+props
		// Without this, pushing same component with same props gets silently blocked
		const enhancedState = {
			...state,
			_drawerPushId: ++this.pushCounter
		}

		this.dispatchToggleEvent(ref, 'open')
		this.dispatchRenderEvent(ref, component, undefined, enhancedState, params, props)
	}

	/**
	 * Push a component to the content drawer
	 * Every push is guaranteed to render (auto-incremented unique ID prevents deduplication)
	 * @param options - Component configuration object with optional state/params/props
	 * @example
	 * schmancyContentDrawer.push({
	 *   component: myComponent,
	 *   props: { id: '123' }
	 * })
	 */
	push(options: DrawerPushOptions): void {
		this.$drawer.next({
			action: 'push',
			ref: window,
			...options,
		})
	}
}

export const schmancyContentDrawer = new DrawerService()