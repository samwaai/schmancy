import { SchmancyTeleportation } from '../teleport'
import { ReplaySubject, Subject, bufferTime, fromEvent, map, of, tap, timeout, zip } from 'rxjs'
import { ActiveRoute, RouteAction } from './router.types'

export const routerHistory = new Subject<RouteAction>()

export const FINDING_MORTIES = 'FINDING_MORTIES'
export const HERE_RICKY = 'HERE_RICKY'
export type HERE_RICKY_EVENT = CustomEvent<{
	component: SchmancyTeleportation
}>
export type FINDING_MORTIES_EVENT = CustomEvent<{
	component: SchmancyTeleportation
}>

class AreaService {
	private static instance: AreaService
	public mode: 'SILENT' | 'HISTORY' = 'HISTORY'
	public request = new ReplaySubject<RouteAction>()
	public $current = new ReplaySubject<ActiveRoute>()
	public enableHistoryMode = true
	private findingMortiesEvent = new CustomEvent<FINDING_MORTIES_EVENT['detail']>(FINDING_MORTIES)

	find() {
		return zip([
			fromEvent<HERE_RICKY_EVENT>(window, HERE_RICKY).pipe(
				map(e => e.detail),
				bufferTime(0),
				tap(console.log),
			),
			of(1).pipe(tap(() => window.dispatchEvent(this.findingMortiesEvent))),
		]).pipe(
			map(([component]) => component),
			timeout(1),
		)
	}

	push(r: RouteAction) {
		this.request.next(r)
	}

	pop(name: string) {
		const newState = JSON.parse(JSON.stringify(area.state))
		delete newState[name]
		console.log(area.state, newState)
		history.replaceState(null, '', encodeURIComponent(JSON.stringify(newState)))
	}
	static getInstance() {
		if (!AreaService.instance) {
			AreaService.instance = new AreaService()
		}
		return AreaService.instance
	}

	queryParamClear(params?: string[]) {
		if (!params) {
			history.replaceState(null, '', `${location.pathname}`)
		}
		// get query params from url
		const urlParams = new URLSearchParams(location.search)
		// remove query params
		params.forEach(param => urlParams.delete(param))
		// update url
		history.replaceState(null, '', `${location.pathname}?${urlParams.toString()}`)
	}
	get state() {
		const pathname = location.pathname.split('/').pop()
		let areaState = {}
		try {
			areaState = pathname ? JSON.parse(decodeURIComponent(pathname)) : {}
		} catch {
			areaState = {}
		}
		return areaState
	}
}

export const area = AreaService.getInstance()
export default area
