import {
	delay,
	fromEvent,
	map,
	mergeMap,
	of,
	Subject,
	switchMap,
	take,
	tap,
} from 'rxjs'
import { ComponentType } from '../area/router.types'
import { discoverComponent } from '@mixins/discovery.service'
import SchmancySheet from './sheet'

export enum SchmancySheetPosition {
	Side = 'side',
	Bottom = 'bottom',
}

export type SheetConfig = {
	component: ComponentType
	uid?: string
	position?: SchmancySheetPosition
	persist?: boolean
	close?: () => void
	lock?: boolean // Controls both ESC and overlay click dismissal
	onBeforeOpen?: (component: HTMLElement) => void
	onAfterOpen?: (component: HTMLElement) => void
}

// Keep old name for backward compatibility
type BottomSheeetTarget = SheetConfig

// Function to determine the position based on screen size
const getPosition = (): SchmancySheetPosition => {
	return window.innerWidth >= 768 ? SchmancySheetPosition.Side : SchmancySheetPosition.Bottom // Adjust 768 as needed for your breakpoint
}

class BottomSheetService {
	bottomSheet = new Subject<BottomSheeetTarget>()
	$dismiss = new Subject<string>()
	// Track currently open sheets
	private activeSheets = new Set<string>()
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
				switchMap(target => {
					const uid = target.uid ?? `sheet-${Date.now()}`

					// Discover existing sheet with this uid
					return discoverComponent<SchmancySheet>('schmancy-sheet').pipe(
						map(existingSheet => {
							// Check if discovered sheet matches our uid
							const sheet = existingSheet?.getAttribute('uid') === uid ? existingSheet : null
							return { target, existingSheet: sheet, uid }
						})
					)
				}),
				switchMap(({ target, existingSheet, uid }) => {
					// Discover theme container if creating new sheet
					if (existingSheet) {
						return of({ target, sheet: existingSheet, uid })
					}

					return discoverComponent<HTMLElement>('schmancy-theme').pipe(
						map(theme => {
							// Determine container - use theme or fallback to body
							const targetContainer = theme || document.body

							// Create new sheet
							const sheet = document.createElement('schmancy-sheet')
							sheet.setAttribute('uid', uid)
							targetContainer.appendChild(sheet)

							return { target, sheet: sheet as SchmancySheet, uid }
						})
					)
				}),
				tap(({ target, sheet }) => {
					// Configure sheet attributes
					if (target.lock) sheet.setAttribute('lock', 'true')

					const position = target.position || getPosition()
					sheet.setAttribute('position', position)

					if (target.persist) sheet.setAttribute('persist', String(target.persist))

					document.body.style.overflow = 'hidden' // lock the scroll of the host
				}),
				delay(20),
				tap(({ target, uid }) => {
					// Dispatch render event - area router handles duplicate prevention
					window.dispatchEvent(
						new CustomEvent('schmancy-sheet-render', {
							detail: { component: target.component, uid },
							bubbles: true,
							composed: true,
						}),
					)
				}),
				delay(1),
				tap(({ sheet, uid }) => {
					sheet.setAttribute('open', 'true')

					// Add to active sheets tracking
					this.activeSheets.add(uid)

					// Set up close event listener
					fromEvent<CustomEvent>(sheet, 'close')
						.pipe(take(1), delay(300))
						.subscribe(() => {
							// Remove from active sheets tracking
							this.activeSheets.delete(uid)

							// Only keep sheet if persist is explicitly set to a truthy value
							const persistAttr = sheet.getAttribute('persist')
							const shouldRemove = !persistAttr || persistAttr === 'false'

							if (shouldRemove) {
								sheet.remove()
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
					discoverComponent<SchmancySheet>('schmancy-sheet').pipe(
						map(sheet => ({ sheet, uid }))
					)
				),
				tap(({ sheet, uid }) => {
					// Check if discovered sheet matches the uid we're trying to dismiss
					if (sheet && sheet.getAttribute('uid') === uid) {
						sheet.closeSheet()
						this.activeSheets.delete(uid)
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
			if (this.activeSheets.size > 0) {
				// Get the last sheet (Set maintains insertion order)
				const lastSheet = Array.from(this.activeSheets).pop()
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
		if (!uid && this.activeSheets.size > 0) {
			// Get the last sheet opened (Set maintains insertion order)
			const sheetsArray = Array.from(this.activeSheets)
			uid = sheetsArray[sheetsArray.length - 1]
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
		return this.activeSheets.has(uid)
	}

	/**
	 * Close all open sheets
	 */
	closeAll() {
		// Copy the set to avoid modification during iteration
		Array.from(this.activeSheets).forEach(uid => {
			this.dismiss(uid)
		})
	}

}
export const sheet = new BottomSheetService()
