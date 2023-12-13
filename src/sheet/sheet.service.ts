import {
	defaultIfEmpty,
	delay,
	filter,
	forkJoin,
	fromEvent,
	map,
	mergeMap,
	of,
	Subject,
	switchMap,
	take,
	takeUntil,
	tap,
	timer,
} from 'rxjs'
import SchmancySheet from './sheet'

export enum SchmancySheetPosition {
	Side = 'side',
	Bottom = 'bottom',
	/**
	 *  @deprecated use bottom instead
	 */
	BottomCenter = 'bottom-center',
	/**
	 *  @deprecated use side instead
	 */
	TopRight = 'top-right',
	/**
	 *  @deprecated use side instead
	 */
	BottomRight = 'bottom-right',
}
type BottomSheeetTarget = {
	component: HTMLElement
	uid?: string
	position?: SchmancySheetPosition
	persist?: boolean
	// host?: Element | ShadowRoot | null | undefined
	close?: () => void
	style?: BottomSheetStyle
	allowOverlyDismiss?: boolean
}

export type BottomSheetStyle = {
	'--overlay-color'?: string
	'--overlay-opacity'?: string
	'--overlay-position'?: string
	'--overlay-border-radius'?: string
	'--sheet-position'?: 'absolute' | 'fixed' | 'relative'
	'--sheet-radius'?: string
}

// Events for communication between bottom-sheet component and bottom-sheet.service
export type WhereAreYouRickyEvent = CustomEvent<{
	uid: string
}>
export const WhereAreYouRicky = 'are-you-there-sheet'

export type HereMortyEvent = CustomEvent<{
	sheet: SchmancySheet
}>
export const HereMorty = 'yes-here'
class BottomSheetService {
	bottomSheet = new Subject<BottomSheeetTarget>()
	$dismiss = new Subject<string>()
	counter: number
	constructor() {
		this.counter = 0
		this.bottomSheet
			.pipe(
				tap(() => this.counter++),
				switchMap(target =>
					forkJoin([
						fromEvent<HereMortyEvent>(window, HereMorty).pipe(
							takeUntil(timer(0)),
							map(e => e.detail.sheet),
							defaultIfEmpty(undefined),
						),
						of(target).pipe(
							tap(() => {
								window.dispatchEvent(
									new CustomEvent(WhereAreYouRicky, {
										detail: { uid: target.uid ?? target.component.tagName },
									}),
								)
							}),
						),
					]),
				),
				map(([sheet, target]) => {
					if (!sheet) {
						// if sheet is not found, create it
						sheet = document.createElement('schmancy-sheet')
						sheet.setAttribute('uid', target.component.tagName)
						sheet.setAttribute('position', target.position ?? SchmancySheetPosition.Side)
						sheet.setAttribute('allowOverlyDismiss', target.allowOverlyDismiss === false ? 'false' : 'true')
						document.body.appendChild(sheet)
					} else {
						// to make sure that the sheet is not removed later
						target.persist = target.persist ?? false
					}
					document.body.style.overflow = 'hidden' // lock the scroll of the host
					return { target, sheet }
				}),
				delay(1),
				filter(({ target, sheet }) => {
					//  if the sheet has already the component, just show it
					if (
						target.persist &&
						sheet?.shadowRoot
							?.querySelector('slot')
							?.assignedElements()
							.find(e => e.tagName === target.component.tagName)
					) {
						sheet?.setAttribute('open', 'true')
						return false
					} else {
						sheet?.shadowRoot
							?.querySelector('slot')
							?.assignedElements()
							.forEach(e => e.remove()) // remove all the components from the sheet
						return true // if the sheet does not have the component, continue to the next step
					}
				}),
				map(({ target, sheet }) => {
					Object.keys(target.style ?? {}).forEach(key => {
						if (key.startsWith('--')) {
							sheet?.style.setProperty(key, target.style?.[key])
						}
					})

					return {
						target,
						sheet,
					}
				}),
				tap(({ target, sheet }) => {
					sheet?.appendChild(target.component)
				}),
				delay(1),
				tap(({ sheet }) => {
					sheet?.setAttribute('open', 'true')
				}),
				tap(({ sheet }) => {
					fromEvent(sheet, 'close')
						.pipe(take(1))
						.subscribe(() => {
							document.body.style.overflow = 'auto' // unlock the scroll of the host
						})
				}),
			)
			.subscribe()

		this.$dismiss
			.pipe(
				mergeMap(uid =>
					forkJoin([
						fromEvent<HereMortyEvent>(window, HereMorty).pipe(
							takeUntil(timer(100)), // Some people say why 10? I say why not?
							map(e => e.detail.sheet),
							defaultIfEmpty(undefined),
						),
						of(uid).pipe(
							tap(() => {
								window.dispatchEvent(new CustomEvent(WhereAreYouRicky, { detail: { uid } }))
							}),
						),
					]),
				),
				tap(([sheet]) => {
					sheet?.closeSheet()
				}),
			)
			.subscribe()
	}

	dismiss(uid: string) {
		this.$dismiss.next(uid)
	}

	open(target: BottomSheeetTarget) {
		this.bottomSheet.next(target)
	}

	close(uid?: string) {
		const sheet = document.querySelector(uid ? `schmancy-sheet[uid="${uid}"]` : 'schmancy-sheet') as SchmancySheet
		sheet?.closeSheet()
		// sheet?.remove()
	}
}
export const sheet = new BottomSheetService()
