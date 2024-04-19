import { animate } from '@juliangarnierorg/anime-beta'
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
		// const hanger = document.createElement('div')
		// hanger.style.setProperty('position', 'fixed')
		// hanger.style.setProperty('top', from.rect.top + 'px')
		// hanger.style.setProperty('left', from.rect.left + 'px')
		// hanger.style.setProperty('width', from.rect.width + 'px')
		// hanger.style.setProperty('height', from.rect.height + 'px')
		// hanger.style.setProperty('z-index', '2000')
		// document.body?.appendChild(to.element)
		to.element.style.transformOrigin = 'top left'
		to.element.style.setProperty('visibility', 'visible')
		to.element.style.zIndex = '1000'
		const originalZIndex = to.element.style.zIndex
		animate(to.element, {
			translateX: [from.rect.left - to.rect.left, 0],
			translateY: [from.rect.top - to.rect.top, 0],
			scaleX: [from.rect.width / to.rect.width, 1],
			scaleY: [from.rect.height / to.rect.height, 1],
			duration: 250,
			delay: 10,
			ease: 'inOutQuad',
			onBegin: () => {
				to.element.style.transformOrigin = 'top left'
				to.element.style.setProperty('visibility', 'visible')
				to.element.style.zIndex = '1000'
			},
			onComplete: () => {
				to.element.style.zIndex = originalZIndex
				to.element.style.transformOrigin = ''
			},
		})
		// const hangerRec = hanger.getBoundingClientRect()
		// animate(hanger, {
		// 	translateX: [to.rect.left - hangerRec.left, 0],
		// 	translateY: [to.rect.top - hangerRec.top, 0],
		// 	scaleX: [to.rect.width / hangerRec.width, 0],
		// 	scaleY: [to.rect.height / hangerRec.height],
		// 	duration: 500,
		// 	delay: i * 100,
		// 	ease: 'easeInOutQuad',
		// 	onBegin: () => {
		// 		hanger.style.transformOrigin = 'top left'
		// 		hanger.style.zIndex = '2000'
		// 	},
		// 	onComplete: () => {
		// 		hanger.remove()
		// 	},
		// })
	}
}
export const teleport = new Teleportation()
export default teleport
