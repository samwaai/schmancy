import {
	defaultIfEmpty,
	delay,
	from,
	fromEvent,
	map,
	of,
	Subject,
	switchMap,
	take,
	takeUntil,
	tap,
	timer
} from 'rxjs'
import { ThemeHereIAm, ThemeHereIAmEvent, ThemeWhereAreYou } from '../theme/theme.component'
import SchmancySheet from './sheet'

export enum SchmancySheetPosition {
	Side = 'side',
	Bottom = 'bottom',
}

/**
 * Configuration options for opening a sheet
 */
export interface SheetConfig<T extends HTMLElement = HTMLElement> {
	/** The component to display in the sheet. Can be an instance or a factory function */
	component: T | (() => T)
	
	/** Unique identifier for the sheet. Defaults to component's tagName */
	uid?: string
	
	/** Position of the sheet. Defaults to responsive (side on desktop, bottom on mobile) */
	position?: SchmancySheetPosition
	
	/** Whether to keep the sheet in DOM after closing. Defaults to false */
	persist?: boolean
	
	/** @deprecated Use onBeforeOpen to add close handlers */
	close?: () => void
	
	/** Prevents dismissal via ESC or overlay click. Defaults to false */
	lock?: boolean
	
	/** Whether to integrate with browser history. Defaults to true */
	handleHistory?: boolean
	
	/** Title displayed in the sheet header */
	title?: string
	
	/** Header visibility. Defaults to 'visible' */
	header?: 'hidden' | 'visible'
	
	/** Callback invoked before the sheet opens, useful for component setup */
	onBeforeOpen?: (component: T) => void
	
	/** Callback invoked after the sheet opens and becomes visible */
	onAfterOpen?: (component: T) => void
}

// Internal events for sheet discovery
interface SheetDiscoveryDetail {
	uid: string
}

interface SheetResponseDetail {
	sheet?: SchmancySheet
	theme?: HTMLElement
}

export type SheetWhereAreYouRickyEvent = CustomEvent<SheetDiscoveryDetail>
export const SheetWhereAreYouRicky = 'are-you-there-sheet'

export type SheetHereMortyEvent = CustomEvent<SheetResponseDetail>
export const SheetHereMorty = 'yes-here'

/** Default breakpoint for responsive sheet positioning */
const RESPONSIVE_BREAKPOINT = 768

/** Determines sheet position based on viewport width */
const getResponsivePosition = (): SchmancySheetPosition => {
	return window.innerWidth >= RESPONSIVE_BREAKPOINT 
		? SchmancySheetPosition.Side 
		: SchmancySheetPosition.Bottom
}

/**
 * Internal state for sheet management
 */
interface SheetState {
	config: SheetConfig
	sheet: SchmancySheet
	component: HTMLElement
	uid: string
}

/**
 * Service for managing sheet components throughout the application.
 * Handles sheet lifecycle, history integration, and component reuse.
 * 
 * @example
 * ```typescript
 * // Simple usage
 * sheet.open({
 *   component: document.createElement('my-form'),
 *   title: 'My Form'
 * });
 * 
 * // With callbacks
 * sheet.open({
 *   component: () => {
 *     const form = document.createElement('employee-form');
 *     form.addEventListener('save', () => sheet.dismiss('employee-form'));
 *     return form;
 *   },
 *   uid: 'employee-form',
 *   onBeforeOpen: (form) => {
 *     form.data = employeeData;
 *   }
 * });
 * ```
 */
class SheetService {
	private readonly openSheet$ = new Subject<SheetConfig>()
	private readonly dismissSheet$ = new Subject<string>()
	private readonly activeSheets = new Set<string>()
	private readonly sheetComponents = new Map<string, HTMLElement>()
	private readonly sheetElements = new Map<string, SchmancySheet>()
	private popStateListenerActive = false

	constructor() {
		this.initializeEventStreams()
		this.setupHistoryManagement()
	}

	/**
	 * Initializes the reactive event streams for sheet operations
	 */
	private initializeEventStreams() {
		this.setupOpenStream()
		this.setupDismissStream()
	}

	/**
	 * Creates or retrieves a component instance from the configuration
	 */
	private resolveComponent(config: SheetConfig): HTMLElement {
		if (typeof config.component === 'function') {
			const component = config.component()
			if (!(component instanceof HTMLElement)) {
				throw new Error('Component factory function must return an HTMLElement instance')
			}
			return component
		}
		return config.component
	}

	/**
	 * Calculates the unique identifier for a sheet
	 */
	private calculateUid(config: SheetConfig): string {
		if (config.uid) return config.uid
		
		// For factory functions, we need to create a temporary instance to get tagName
		if (typeof config.component === 'function') {
			const tempComponent = this.resolveComponent(config)
			return tempComponent.tagName.toLowerCase()
		}
		
		return config.component.tagName.toLowerCase()
	}

	/**
	 * Discovers existing sheet container or creates a new one
	 */
	private async discoverOrCreateSheet(uid: string): Promise<{ sheet: SchmancySheet, container: HTMLElement }> {
		// Broadcast discovery request
		window.dispatchEvent(new CustomEvent(SheetWhereAreYouRicky, { detail: { uid } }))
		
		// Wait for response
		const existingSheet = await fromEvent<SheetHereMortyEvent>(window, SheetHereMorty)
			.pipe(
				takeUntil(timer(50)),
				map(e => e.detail.sheet),
				defaultIfEmpty(undefined),
				take(1)
			)
			.toPromise()
		
		if (existingSheet) {
			return {
				sheet: existingSheet,
				container: existingSheet.parentElement as HTMLElement
			}
		}
		
		// Find theme container
		window.dispatchEvent(new CustomEvent(ThemeWhereAreYou))
		const theme = await fromEvent<ThemeHereIAmEvent>(window, ThemeHereIAm)
			.pipe(
				takeUntil(timer(100)),
				map(e => e.detail.theme),
				defaultIfEmpty(undefined),
				take(1)
			)
			.toPromise()
		
		// Create new sheet
		const container = theme || document.querySelector('schmancy-theme') as HTMLElement || document.body
		const sheet = document.createElement('schmancy-sheet')
		sheet.setAttribute('uid', uid)
		container.appendChild(sheet)
		
		return { sheet, container }
	}

	/**
	 * Applies configuration to a sheet element
	 */
	private configureSheet(sheet: SchmancySheet, config: SheetConfig) {
		// Set attributes based on config
		if (config.lock) sheet.setAttribute('lock', 'true')
		
		const position = config.position || getResponsivePosition()
		sheet.setAttribute('position', position)
		
		if (config.title) sheet.setAttribute('title', config.title)
		if (config.persist !== undefined) sheet.setAttribute('persist', String(config.persist))
		if (config.header) sheet.setAttribute('header', config.header)
		if (config.handleHistory !== undefined) {
			sheet.setAttribute('handleHistory', String(config.handleHistory))
		}
	}

	/**
	 * Handles the sheet opening logic
	 */
	private setupOpenStream() {
		this.openSheet$
			.pipe(
				switchMap(config => {
					// Resolve component and uid early
					const component = this.resolveComponent(config)
					const uid = this.calculateUid(config)
					
					// Convert async discovery to observable chain
					return from(this.discoverOrCreateSheet(uid)).pipe(
						map(({ sheet }) => {
							// Configure sheet
							this.configureSheet(sheet, config)
							
							// Lock body scroll
							document.body.style.overflow = 'hidden'
							
							// Store references immediately
							this.sheetComponents.set(uid, component)
							this.sheetElements.set(uid, sheet)
							
							return { config, sheet, component, uid }
						})
					)
				}),
				delay(20), // Allow DOM to settle
				tap((state: SheetState) => {
					const { config, sheet, component, uid } = state
					
					// Call onBeforeOpen callback
					if (config.onBeforeOpen) {
						config.onBeforeOpen(component)
					}
					
					// Check if component needs to be appended
					const assignedElements = sheet.shadowRoot
						?.querySelector('slot')
						?.assignedElements() || []
					
					const existingComponent = assignedElements.find(
						el => (el as HTMLElement).tagName === component.tagName
					)
					
					if (!existingComponent) {
						sheet.appendChild(component)
					} else {
						// Update stored reference to existing component
						this.sheetComponents.set(uid, existingComponent as HTMLElement)
					}
				}),
				delay(1), // Micro-task for component attachment
				tap((state: SheetState) => {
					const { config, sheet, component, uid } = state
					
					// Open the sheet
					sheet.setAttribute('open', 'true')
					this.activeSheets.add(uid)
					
					// Call onAfterOpen callback
					if (config.onAfterOpen) {
						config.onAfterOpen(component)
					}
					
					// Handle history integration (default: true)
					if (config.handleHistory !== false) {
						history.pushState(
							{ schmancySheet: true, uid, timestamp: Date.now() },
							'',
							window.location.href
						)
					}
					
					// Setup close listener
					this.setupCloseListener(sheet, uid, config)
				})
			)
			.subscribe({
				error: (error) => {
					console.error('Error opening sheet:', error)
					document.body.style.overflow = 'auto'
				}
			})
	}

	/**
	 * Sets up the close event listener for a sheet
	 */
	private setupCloseListener(sheet: SchmancySheet, uid: string, config: SheetConfig) {
		fromEvent<CustomEvent>(sheet, 'close')
			.pipe(
				take(1),
				delay(300) // Wait for close animation
			)
			.subscribe(() => {
				// Clean up tracking
				this.activeSheets.delete(uid)
				
				// Clean up stored references if not persisting
				if (!config.persist) {
					this.sheetComponents.delete(uid)
					this.sheetElements.delete(uid)
					sheet.remove()
				}
				
				// Restore body scroll if no other sheets are open
				if (this.activeSheets.size === 0) {
					document.body.style.overflow = 'auto'
				}
			})
	}

	/**
	 * Sets up the sheet dismissal logic
	 */
	private setupDismissStream() {
		this.dismissSheet$
			.pipe(
				switchMap(uid => {
					// Try to get sheet from our tracking first
					const cachedSheet = this.sheetElements.get(uid)
					if (cachedSheet) {
						return of({ uid, sheet: cachedSheet })
					}
					
					// Otherwise, discover it
					window.dispatchEvent(new CustomEvent(SheetWhereAreYouRicky, { detail: { uid } }))
					
					return fromEvent<SheetHereMortyEvent>(window, SheetHereMorty).pipe(
						takeUntil(timer(100)),
						map(e => ({ uid, sheet: e.detail.sheet })),
						defaultIfEmpty({ uid, sheet: undefined })
					)
				}),
				tap(({ uid, sheet }) => {
					if (sheet) {
						sheet.closeSheet()
						this.activeSheets.delete(uid)
					} else {
						console.warn(`Sheet with uid "${uid}" not found for dismissal`)
					}
				})
			)
			.subscribe()
	}

	/**
	 * Sets up browser history integration for back button support
	 */
	private setupHistoryManagement() {
		if (this.popStateListenerActive) return
		
		fromEvent<PopStateEvent>(window, 'popstate').subscribe(event => {
			// Close the most recently opened sheet when back is pressed
			if (this.activeSheets.size > 0) {
				const lastSheet = Array.from(this.activeSheets).pop()
				if (lastSheet) {
					this.dismiss(lastSheet)
					
					// Re-push state to prevent actual navigation
					if (event.state?.schmancySheet) {
						history.pushState({}, '', window.location.href)
					}
				}
			}
		})
		
		this.popStateListenerActive = true
	}

	/**
	 * Opens a sheet with the specified configuration
	 * @param config - Configuration options for the sheet
	 * @example
	 * ```typescript
	 * sheet.open({
	 *   component: document.createElement('my-form'),
	 *   uid: 'my-form-sheet',
	 *   title: 'Edit Form',
	 *   onBeforeOpen: (component) => {
	 *     component.data = formData;
	 *   }
	 * });
	 * ```
	 */
	open<T extends HTMLElement = HTMLElement>(config: SheetConfig<T>) {
		this.openSheet$.next(config as SheetConfig)
	}

	/**
	 * Dismisses a sheet by its unique identifier
	 * @param uid - The unique identifier of the sheet to dismiss. If not provided, dismisses the most recent sheet.
	 */
	dismiss(uid?: string) {
		if (!uid && this.activeSheets.size > 0) {
			// Get the most recently opened sheet
			const sheetsArray = Array.from(this.activeSheets)
			uid = sheetsArray[sheetsArray.length - 1]
		}
		
		if (uid) {
			this.dismissSheet$.next(uid)
		}
	}

	/**
	 * Gets the component instance for a given sheet
	 * @param uid - The unique identifier of the sheet
	 * @returns The component instance, or undefined if not found
	 */
	getComponent<T extends HTMLElement = HTMLElement>(uid: string): T | undefined {
		return this.sheetComponents.get(uid) as T | undefined
	}

	/**
	 * Checks if a sheet is currently open
	 * @param uid - The unique identifier of the sheet
	 * @returns True if the sheet is open, false otherwise
	 */
	isOpen(uid: string): boolean {
		return this.activeSheets.has(uid)
	}

	/**
	 * Closes all currently open sheets
	 */
	closeAll() {
		// Create a copy to avoid modification during iteration
		Array.from(this.activeSheets).forEach(uid => this.dismiss(uid))
	}

	/**
	 * Gets the sheet element for a given uid
	 * @param uid - The unique identifier of the sheet
	 * @returns The sheet element, or undefined if not found
	 */
	getSheetElement(uid: string): SchmancySheet | undefined {
		return this.sheetElements.get(uid)
	}
}

// Export singleton instance
export const sheet = new SheetService()