import {
	defaultIfEmpty,
	delay,
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
import { ThemeHereIAm, ThemeHereIAmEvent, ThemeWhereAreYou } from '../theme/theme.component'
import SchmancySheet from './sheet'

export enum SchmancySheetPosition {
	Side = 'side',
	Bottom = 'bottom',
}

export type SheetConfig = {
	component: HTMLElement
	uid?: string
	position?: SchmancySheetPosition
	persist?: boolean
	close?: () => void
	lock?: boolean // Controls both ESC and overlay click dismissal
	handleHistory?: boolean // Controls browser back button behavior
	title?: string
	header?: 'hidden' | 'visible'
	onBeforeOpen?: (component: HTMLElement) => void
	onAfterOpen?: (component: HTMLElement) => void
}

// Keep old name for backward compatibility
type BottomSheeetTarget = SheetConfig

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
	// Track currently open sheets
	private activeSheets = new Set<string>()
	// Track sheet components for retrieval
	private sheetComponents = new Map<string, HTMLElement>()
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
							takeUntil(timer(50)),
							map(e => e.detail.theme),
							defaultIfEmpty(undefined),
						),
						of(target).pipe(
							tap(() => {
								// Determine uid - use provided uid or component tagName
								const uid = target.uid ?? target.component.tagName

								// First ask for existing sheet
								window.dispatchEvent(
									new CustomEvent(SheetWhereAreYouRicky, {
										detail: { uid },
										bubbles: true,
										composed: true,
									}),
								)
								// Then ask for theme container
								window.dispatchEvent(
									new CustomEvent(ThemeWhereAreYou, {
										bubbles: true,
										composed: true,
									}),
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
						console.log('Found existing sheet:', sheet)
						targetContainer = sheet.parentElement as HTMLElement
					} else {
						// Determine container - use theme from discovery or fallback
						targetContainer = theme || (document.querySelector('schmancy-theme') as HTMLElement) || document.body

						// Create new sheet
						const uid = target.uid ?? target.component.tagName
						console.log('Creating new sheet for uid:', uid)
						sheet = document.createElement('schmancy-sheet')
						sheet.setAttribute('uid', uid)
						targetContainer.appendChild(sheet)
					}

					target.lock && sheet.setAttribute('lock', 'true')

					// Use the dynamic position function here
					const position = target.position || getPosition()
					sheet.setAttribute('position', position)

					target.title && sheet.setAttribute('title', target.title)
					target.persist && sheet.setAttribute('persist', String(target.persist))
					target.header && sheet.setAttribute('header', target.header)

					// Handle history logic if the property exists
					if (target.handleHistory !== undefined) {
						sheet.setAttribute('handleHistory', String(target.handleHistory))
					}

					document.body.style.overflow = 'hidden' // lock the scroll of the host
					return { target, sheet: sheet as SchmancySheet }
				}),
				delay(20),
				tap(({ target, sheet }) => {
					// Call onBeforeOpen callback if provided
					if (target.onBeforeOpen) {
						target.onBeforeOpen(target.component)
					}

					// Handle HTMLElement components
					const assignedElements = sheet?.shadowRoot?.querySelector('slot')?.assignedElements() || []

					console.log(
						'Assigned elements in sheet:',
						assignedElements.map(e => (e as HTMLElement).tagName),
					)

					const existingComponent = assignedElements.find(e => (e as HTMLElement).tagName === target.component.tagName)

					if (!existingComponent) {
						// Need to append the component
						console.log('Component not found, will append:', target.component.tagName)
						sheet?.appendChild(target.component)
					} else {
						console.log('Component already exists, reusing:', target.component.tagName)
					}
				}),
				delay(1),
				tap(({ target, sheet }) => {
					sheet?.setAttribute('open', 'true')

					// Add to active sheets tracking
					const uid =
						target.uid ?? (target.component instanceof HTMLElement ? target.component.tagName : `sheet-${Date.now()}`)
					this.activeSheets.add(uid)
					this.sheetComponents.set(uid, target.component)

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

					// Call onAfterOpen callback if provided
					if (target.onAfterOpen) {
						target.onAfterOpen(target.component)
					}

					// Set up close event listener (always, not just for new sheets)
					fromEvent<CustomEvent>(sheet, 'close')
						.pipe(take(1))
						.pipe(delay(300))
						.subscribe(_ => {
							// Use the sheet reference directly, not e.target
							const sheetElement = sheet as SchmancySheet
							console.log('Close event fired for sheet:', sheetElement)

							// Remove from active sheets tracking
							if (sheetElement) {
								const uid = sheetElement.getAttribute('uid')
								if (uid) {
									this.activeSheets.delete(uid)
									this.sheetComponents.delete(uid)
								}

								// Only keep sheet if persist is explicitly set to a truthy value
								const persistAttr = sheetElement.getAttribute('persist')
								const shouldRemove = !persistAttr || persistAttr === 'false'
								console.log('Sheet close - persist:', persistAttr, 'shouldRemove:', shouldRemove)

								if (shouldRemove) {
									console.log('Removing sheet from DOM:', uid)
									sheetElement.remove()
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
					console.log('Dismiss called for uid:', uid, 'Found sheet:', !!response?.sheet)
					if (response?.sheet) {
						response.sheet.closeSheet()
						this.activeSheets.delete(uid)
					} else {
						console.log('No sheet found to dismiss for uid:', uid)
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

	/**
	 * Gets the component instance for a given sheet
	 * @param uid - The unique identifier of the sheet
	 * @returns The component instance, or undefined if not found
	 */
	getComponent<T extends HTMLElement = HTMLElement>(uid: string): T | undefined {
		return this.sheetComponents.get(uid) as T | undefined
	}
}
export const sheet = new BottomSheetService()
