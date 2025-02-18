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
	close?: () => void
	allowOverlyDismiss?: boolean
	title?: string
	header?: 'hidden' | 'visible'
}

// Events for communication between bottom-sheet component and bottom-sheet.service
export type SheetWhereAreYouRickyEvent = CustomEvent<{
	uid: string
}>
export const SheetWhereAreYouRicky = 'are-you-there-sheet'

export type SheetHereMortyEvent = CustomEvent<{
	sheet: SchmancySheet
}>
export const SheetHereMorty = 'yes-here'

// Function to determine the position based on screen size
const getPosition = (): SchmancySheetPosition => {
	return window.innerWidth >= 768 ? SchmancySheetPosition.Side : SchmancySheetPosition.Bottom // Adjust 768 as needed for your breakpoint
}

class BottomSheetService {
	bottomSheet = new Subject<BottomSheeetTarget>()
	$dismiss = new Subject<string>()
	constructor() {
		this.bottomSheet
			.pipe(
				switchMap(target =>
					forkJoin([
						fromEvent<SheetHereMortyEvent>(window, SheetHereMorty).pipe(
							takeUntil(timer(0)),
							map(e => e.detail.sheet),
							defaultIfEmpty(undefined),
						),
						of(target).pipe(
							tap(() => {
								window.dispatchEvent(
									new CustomEvent(SheetWhereAreYouRicky, {
										detail: { uid: target.uid ?? target.component.tagName },
									}),
								)
							}),
						),
					]),
				),
				map(([sheet, target]) => {
					console.log(sheet, target)
					if (!sheet) {
						// if sheet is not found, create it
						sheet = document.createElement('schmancy-sheet')
						document.body.appendChild(sheet)
					}
					sheet.setAttribute('uid', target.uid ?? target.component.tagName)

					// **Use the dynamic position function here**
					const position = target.position || getPosition() // Use target.position if it's set, otherwise determine based on screen size
					sheet.setAttribute('position', position)

					sheet.setAttribute('allowOverlyDismiss', target.allowOverlyDismiss === false ? 'false' : 'true')
					target.title && sheet.setAttribute('title', target.title)
					target.persist && sheet.setAttribute('persist', target.persist ?? false)
					target.header && sheet.setAttribute('header', target.header)
					document.body.style.overflow = 'hidden' // lock the scroll of the host
					return { target, sheet }
				}),
				delay(20),
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
						return true // if the sheet does not have the component, continue to the next step
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
					fromEvent<CustomEvent>(sheet, 'close')
						.pipe(take(1))
						.pipe(delay(300))
						.subscribe(e => {
							const target = e.target as SchmancySheet
							console.log(target)

							if (!target?.persist) target?.remove()
							document.body.style.overflow = 'auto' // unlock the scroll of the host
						})
				}),
			)
			.subscribe()

		this.$dismiss
			.pipe(
				mergeMap(uid =>
					forkJoin([
						fromEvent<SheetHereMortyEvent>(window, SheetHereMorty).pipe(
							takeUntil(timer(100)), // Some people say why 10? I say why not?
							map(e => e.detail.sheet),
							defaultIfEmpty(undefined),
						),
						of(uid).pipe(
							tap(() => {
								window.dispatchEvent(new CustomEvent(SheetWhereAreYouRicky, { detail: { uid } }))
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
}
export const sheet = new BottomSheetService()
