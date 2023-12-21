import anime from 'animejs/lib/anime.es.js'
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
	from: HTMLElement
	to: HTMLElement
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
						from: {
							element: from,
							rect: from.getBoundingClientRect(),
						},
						to: {
							element: to,
							rect: to.getBoundingClientRect(),
						},
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
			element: HTMLElement
			rect: DOMRect
		}
		to: {
			element: HTMLElement
			rect: DOMRect
		}
		host: HTMLElement
		i: number
	}) => {
		const { from, to, i } = request
		const hanger = document.createElement('div')
		hanger.style.setProperty('position', 'fixed')
		hanger.style.setProperty('top', from.rect.top + 'px')
		hanger.style.setProperty('left', from.rect.left + 'px')
		hanger.style.setProperty('width', from.rect.width + 'px')
		hanger.style.setProperty('height', from.rect.height + 'px')
		hanger.style.setProperty('z-index', '2000')
		hanger.appendChild(from.element.shadowRoot?.firstElementChild?.cloneNode(true) as HTMLElement)
		document.body?.appendChild(hanger)
		const originalZIndex = to.element.style.zIndex
		anime({
			targets: [to.element],
			translateX: [from.rect.left - to.rect.left, 0],
			translateY: [from.rect.top - to.rect.top, 0],
			scaleX: [from.rect.width / to.rect.width, 1],
			scaleY: [from.rect.height / to.rect.height, 1],
			duration: 500,
			delay: i * 100,
			easing: 'easeInOutQuad',
			begin: () => {
				to.element.style.transformOrigin = 'top left'
				to.element.style.setProperty('visibility', 'visible')
				to.element.style.zIndex = '1000'
			},
			complete: () => {
				to.element.style.zIndex = originalZIndex
				to.element.style.transformOrigin = ''
			},
		})
		const hangerRec = hanger.getBoundingClientRect()
		anime({
			targets: [hanger],
			translateX: [to.rect.left - hangerRec.left],
			translateY: [to.rect.top - hangerRec.top],
			scaleX: [to.rect.width / hangerRec.width],
			scaleY: [to.rect.height / hangerRec.height],
			duration: 500,
			delay: i * 100,
			easing: 'easeInOutQuad',
			begin: () => {
				hanger.style.transformOrigin = 'top left'
				hanger.style.zIndex = '2000'
			},
			complete: () => {
				hanger.remove()
			},
		})
	}
}
export const teleport = new Teleportation()
export default teleport
