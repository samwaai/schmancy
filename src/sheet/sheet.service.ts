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
import { ThemeWhereAreYou, ThemeHereIAmEvent, ThemeHereIAm } from '../theme/theme.component'

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
	lock?: boolean // Controls both ESC and overlay click dismissal
	handleHistory?: boolean // Controls browser back button behavior
	title?: string
	header?: 'hidden' | 'visible'
}

// Events for communication between bottom-sheet component and bottom-sheet.service
export type SheetWhereAreYouRickyEvent = CustomEvent<{
	uid: string
}>
export const SheetWhereAreYouRicky = 'are-you-there-sheet'

export type SheetHereMortyEvent = CustomEvent<{
	sheet?: SchmancySheet
	theme?: HTMLElement
}>
export const SheetHereMorty = 'yes-here'

// Function to determine the position based on screen size
const getPosition = (): SchmancySheetPosition => {
	return window.innerWidth >= 768 ? SchmancySheetPosition.Side : SchmancySheetPosition.Bottom // Adjust 768 as needed for your breakpoint
}

class BottomSheetService {
	bottomSheet = new Subject<BottomSheeetTarget>()
	$dismiss = new Subject<string>()
	// Track currently open sheets by uid in order of opening
	private activeSheets: string[] = []
	// To track if we've set up the popstate listener
	private popStateListenerActive = false

	constructor() {
		this.setupSheetOpeningLogic()
		this.setupSheetDismissLogic()
		this.setupPopStateListener()
	}

	/**
	 * Sets up the main sheet opening logic
	 */
	private setupSheetOpeningLogic() {
		this.bottomSheet
			.pipe(
				switchMap(target =>
					forkJoin([
						// First check for existing sheet
						fromEvent<SheetHereMortyEvent>(window, SheetHereMorty).pipe(
							takeUntil(timer(50)),
							map(e => e.detail),
							defaultIfEmpty(undefined),
						),
						// Then find theme container
						fromEvent<ThemeHereIAmEvent>(window, ThemeHereIAm).pipe(
							takeUntil(timer(100)),
							map(e => e.detail.theme),
							defaultIfEmpty(undefined),
						),
						of(target).pipe(
							tap(() => {
								// First ask for existing sheet
								window.dispatchEvent(
									new CustomEvent(SheetWhereAreYouRicky, {
										detail: { uid: target.uid ?? target.component.tagName },
									}),
								)
								// Then ask for theme container
								window.dispatchEvent(
									new CustomEvent(ThemeWhereAreYou),
								)
							}),
						),
					]),
				),

				map(([existingSheet, theme, target]) => {
					let sheet = existingSheet?.sheet
					let targetContainer: HTMLElement
					
					if (sheet) {
						// Use existing sheet
						targetContainer = sheet.parentElement as HTMLElement
					} else {
						// Determine container - use theme from discovery or fallback
						targetContainer = theme || 
						                 document.querySelector('schmancy-theme') as HTMLElement || 
						                 document.body
						
						// Create new sheet
						sheet = document.createElement('schmancy-sheet')
						sheet.setAttribute('uid', target.uid ?? target.component.tagName)
						targetContainer.appendChild(sheet)
					}

					target.lock && sheet.setAttribute('lock', 'true')

					// Use the dynamic position function here
					const position = target.position || getPosition()
					sheet.setAttribute('position', position)

					target.title && sheet.setAttribute('title', target.title)
					target.persist && sheet.setAttribute('persist', target.persist ?? false)
					target.header && sheet.setAttribute('header', target.header)

					// Handle history logic if the property exists
					if (target.handleHistory !== undefined) {
						sheet.setAttribute('handleHistory', String(target.handleHistory))
					}

					document.body.style.overflow = 'hidden' // lock the scroll of the host
					return { target, sheet: sheet as SchmancySheet }
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
				tap(({ target, sheet }) => {
					sheet?.setAttribute('open', 'true')

					// Add to active sheets tracking
					const uid = target.uid ?? target.component.tagName
					if (!this.activeSheets.includes(uid)) {
						this.activeSheets.push(uid)
					}

					// Handle history integration - default to true if not specified
					const shouldHandleHistory = target.handleHistory !== false

					if (shouldHandleHistory) {
						// Use history state to track this specific sheet
						const historyState = {
							schmancySheet: true,
							uid: uid,
							timestamp: Date.now(),
						}

						// Push a new history state
						history.pushState(historyState, '', window.location.href)
					}
				}),
				tap(({ sheet }) => {
					fromEvent<CustomEvent>(sheet, 'close')
						.pipe(take(1))
						.pipe(delay(300))
						.subscribe(e => {
							const target = e.target as SchmancySheet
							console.log(target)

							// Remove from active sheets tracking
							if (target) {
								const uid = target.getAttribute('uid')
								if (uid) {
									const index = this.activeSheets.indexOf(uid)
									if (index > -1) {
										this.activeSheets.splice(index, 1)
									}
								}
								
								if (!target.persist) {
									target.remove()
								}
							}
							
							document.body.style.overflow = 'auto' // unlock the scroll of the host
						})
				}),
			)
			.subscribe()
	}

	/**
	 * Sets up the sheet closing/dismissal logic
	 */
	private setupSheetDismissLogic() {
		this.$dismiss
			.pipe(
				mergeMap(uid =>
					forkJoin([
						fromEvent<SheetHereMortyEvent>(window, SheetHereMorty).pipe(
							takeUntil(timer(100)),
							map(e => e.detail),
							defaultIfEmpty(undefined),
						),
						of(uid).pipe(
							tap(() => {
								window.dispatchEvent(new CustomEvent(SheetWhereAreYouRicky, { detail: { uid } }))
							}),
						),
					]),
				),
				tap(([response, uid]) => {
					if (response?.sheet) {
						response.sheet.closeSheet()
						const index = this.activeSheets.indexOf(uid)
						if (index > -1) {
							this.activeSheets.splice(index, 1)
						}
					}
				}),
			)
			.subscribe()
	}

	/**
	 * Sets up the popstate listener to handle browser back button
	 */
	private setupPopStateListener() {
		if (this.popStateListenerActive) return

		fromEvent<PopStateEvent>(window, 'popstate').subscribe(event => {
			// If we have active sheets, close the most recently opened one
			if (this.activeSheets.length > 0) {
				const lastSheet = this.activeSheets[this.activeSheets.length - 1]
				if (lastSheet) {
					this.dismiss(lastSheet)

					// Prevent default navigation behavior by pushing a new state
					// This effectively cancels out the back navigation
					if (event.state && event.state.schmancySheet) {
						history.pushState({}, '', window.location.href)
					}
				}
			}
		})

		this.popStateListenerActive = true
	}

	/**
	 * Dismiss a sheet by uid, or dismiss the most recently opened sheet if no uid provided
	 */
	dismiss(uid?: string) {
		if (!uid && this.activeSheets.length > 0) {
			// Get the last sheet opened (last item in the array)
			uid = this.activeSheets[this.activeSheets.length - 1]
		}
		
		if (uid) {
			this.$dismiss.next(uid)
		}
	}

	/**
	 * Open a sheet with the given target configuration
	 */
	open(target: BottomSheeetTarget) {
		this.bottomSheet.next(target)
	}

	/**
	 * Check if a sheet is currently open by uid
	 */
	isOpen(uid: string): boolean {
		return this.activeSheets.includes(uid)
	}

	/**
	 * Close all open sheets
	 */
	closeAll() {
		// Copy the array to avoid modification during iteration
		[...this.activeSheets].forEach(uid => {
			this.dismiss(uid)
		})
	}
}
export const sheet = new BottomSheetService()
