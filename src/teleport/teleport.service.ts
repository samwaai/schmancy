import { bufferTime, concatMap, filter, fromEvent, map, of, Subject, take, tap, timeout, zip } from 'rxjs'
import { SchmancyTeleportation } from './teleport.component'

export type WhereAreYouRickyEvent = CustomEvent<{
	id: string
	callerID: number
}>

export const WhereAreYouRicky = 'whereAreYouRicky'

export type HereMortyEvent = CustomEvent<{
	component: SchmancyTeleportation
}>

export type FLIP_REQUEST = {
	from: {
		rect: DOMRect
		element?: HTMLElement
	}
	to: {
		rect: DOMRect
		element: HTMLElement
	}
	stagger?: number
	host: HTMLElement
}
export const HereMorty = 'hereMorty'

class Teleportation {
	activeTeleportations = new Map<string, DOMRect>()
	flipRequests = new Subject<FLIP_REQUEST>()

	constructor() {
		this.flipRequests
			.pipe(
				bufferTime(1),
				map(requests =>
					requests.map(({ from, to, host }, i) => ({
						from,
						to,
						host,
						i,
					})),
				),
				concatMap(requests => zip(requests.map(request => of(this.flip(request))))),
			)
			.subscribe()
	}

	find = (component: SchmancyTeleportation) => {
		return zip([
			fromEvent<HereMortyEvent>(window, HereMorty).pipe(
				filter(
					e =>
						!!e.detail.component.uuid &&
						!!component.id &&
						e.detail.component.id === component.id &&
						e.detail.component.uuid !== component.uuid,
				),
				map(e => e.detail.component),
				take(1),
			),
			of(component).pipe(
				tap(() => {
					window.dispatchEvent(
						new CustomEvent<WhereAreYouRickyEvent['detail']>(WhereAreYouRicky, {
							detail: {
								id: component.id,
								callerID: component.uuid,
							},
						}),
					)
				}),
			),
		]).pipe(
			map(([component]) => component),
			timeout(0),
		)
	}

	flip = (request: {
		from: {
			rect: DOMRect
		}
		to: {
			element: HTMLElement
			rect: DOMRect
		}
		host: HTMLElement
		i: number
	}) => {
		const { from, to } = request

		// Prepare the element for animation
		const originalZIndex = to.element.style.zIndex
		to.element.style.transformOrigin = 'top left'
		to.element.style.setProperty('visibility', 'visible')
		to.element.style.zIndex = '1000'

		// "onBegin" logic goes here (since Web Animations doesn't have onBegin).
		// If you had more logic, place it here:
		// e.g., console.log('Starting FLIP animation...');

		// Calculate starting and ending transforms
		const startX = from.rect.left - to.rect.left
		const startY = from.rect.top - to.rect.top
		const startScaleX = from.rect.width / to.rect.width
		const startScaleY = from.rect.height / to.rect.height

		// Create keyframes
		const keyframes: Keyframe[] = [
			{
				transform: `translate(${startX}px, ${startY}px) scale(${startScaleX}, ${startScaleY})`,
			},
			{
				transform: 'translate(0, 0) scale(1, 1)',
			},
		]

		// Use native Web Animations API
		const animation = to.element.animate(keyframes, {
			duration: 250,
			delay: 10, // if desired
			// Approximate 'inOutQuad' via a cubic-bezier easing.
			// You can adjust these values to taste, or use a standard one:
			easing: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
			// or simply 'ease-in-out'
		})

		// "onComplete" logic goes here
		animation.onfinish = () => {
			to.element.style.zIndex = originalZIndex
			to.element.style.transformOrigin = ''
			// If you have additional cleanup, place it here
			// e.g., console.log('FLIP animation completed!');
		}
	}
}

export const teleport = new Teleportation()
export default teleport
