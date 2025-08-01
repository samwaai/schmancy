import { render, TemplateResult } from 'lit'
import { defaultIfEmpty, forkJoin, fromEvent, map, of, Subject, switchMap, takeUntil, tap, timer, take } from 'rxjs'
import { ConfirmDialog } from './dailog'
import { DialogHereMorty, DialogHereMortyEvent, DialogWhereAreYouRicky } from './dialog-events'
import { ThemeWhereAreYou, ThemeHereIAm, ThemeHereIAmEvent } from '../theme/theme.component'

/**
 * Dialog service options interface with component support
 */
export interface DialogOptions {
	title?: string
	subtitle?: string
	message?: string
	confirmText?: string
	cancelText?: string
	variant?: 'default' | 'danger'
	confirmColor?: 'primary' | 'error' | 'warning' | 'success' // Button color for confirm action
	position?: { x: number; y: number } | MouseEvent | TouchEvent

	// New options for component rendering
	content?: TemplateResult | HTMLElement | (() => HTMLElement | TemplateResult)
	width?: string
	onConfirm?: () => void
	onCancel?: () => void
	hideActions?: boolean // Set to true to hide all buttons and title
	targetContainer?: HTMLElement // Container to append dialog to (defaults to document.body)
}

interface DialogTarget {
	options: DialogOptions
	type: 'confirm' | 'component'
	content?: TemplateResult | HTMLElement | (() => HTMLElement | TemplateResult)
	resolve?: (value: boolean) => void
	reject?: (reason?: any) => void
}

/**
 * Dialog service for centralized dialog management.
 * Provides a simple API for showing dialogs with optional custom components.
 */
export class DialogService {
	private static instance: DialogService

	// Default dialog options
	private static DEFAULT_OPTIONS: Partial<DialogOptions> = {
		title: undefined,
		subtitle: undefined,
		confirmText: undefined,
		cancelText: undefined,
		variant: 'default',
		width: '360px',
	}

	// Track active dialogs to handle dismissing the most recent one
	private activeDialogs: ConfirmDialog[] = []
	
	// Track component dialogs (schmancy-dialog instances)
	private activeRawDialogs: any[] = []
	
	// Subject for dialog opening requests
	private dialogSubject = new Subject<DialogTarget>()
	
	// Subject for dialog dismissal requests
	private dismissSubject = new Subject<string>()

	// Private constructor for singleton pattern
	private constructor() {
		this.setupDialogOpeningLogic()
		this.setupDialogDismissLogic()
	}

	/**
	 * Get the singleton instance
	 */
	public static getInstance(): DialogService {
		if (!DialogService.instance) {
			DialogService.instance = new DialogService()
		}
		return DialogService.instance
	}
	
	/**
	 * Sets up the main dialog opening logic using RxJS pipes
	 */
	private setupDialogOpeningLogic() {
		this.dialogSubject
			.pipe(
				switchMap(target =>
					forkJoin([
						fromEvent<DialogHereMortyEvent>(window, DialogHereMorty).pipe(
							takeUntil(timer(100)),
							map(e => e.detail),
							defaultIfEmpty(undefined),
						),
						of(target).pipe(
							tap(() => {
								const uid = target.type === 'confirm' 
									? `confirm-dialog-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
									: `dialog-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
								
								window.dispatchEvent(
									new CustomEvent(DialogWhereAreYouRicky, {
										detail: { uid },
										bubbles: true,
										composed: true,
									}),
								)
								
								// Store uid in target for later use
								;(target as any).uid = uid
							}),
						),
					]),
				),
				switchMap(([response, target]) => {
					let dialog: ConfirmDialog | any
					let targetContainer: HTMLElement
					
					if (response?.dialog) {
						// Use existing dialog
						dialog = response.dialog
						targetContainer = dialog.parentElement as HTMLElement
						return of({ dialog, target, targetContainer })
					} else {
						// Determine container - use responding theme or fallback
						if (response?.theme) {
							targetContainer = response.theme as HTMLElement
							return of({ dialog: null, target, targetContainer })
						} else if (target.options.targetContainer) {
							targetContainer = target.options.targetContainer
							return of({ dialog: null, target, targetContainer })
						} else {
							// Use the same theme discovery pattern as sheet service
							window.dispatchEvent(new CustomEvent(ThemeWhereAreYou))
							return fromEvent<ThemeHereIAmEvent>(window, ThemeHereIAm).pipe(
								take(1),
								takeUntil(timer(100)),
								map(e => e.detail.theme),
								defaultIfEmpty(undefined),
								map(theme => ({
									dialog: null,
									target,
									targetContainer: theme || document.body
								}))
							)
						}
					}
				}),
				tap(({ dialog, target, targetContainer }) => {
					if (!dialog) {
						// Create appropriate dialog type
						if (target.type === 'confirm') {
							dialog = document.createElement('confirm-dialog') as ConfirmDialog
						} else {
							dialog = document.createElement('schmancy-dialog')
						}
						
						dialog.setAttribute('uid', (target as any).uid)
						targetContainer.appendChild(dialog)
					}
				}),
				map(({ dialog, target, targetContainer }) => {
					// Return the actual dialog element that was created
					if (!dialog) {
						dialog = targetContainer.querySelector(`[uid="${(target as any).uid}"]`)
					}
					return { dialog, target, targetContainer }
				}),
				tap(({ dialog, target }) => {
					if (target.type === 'confirm') {
						// Configure confirm dialog
						const confirmDialog = dialog as ConfirmDialog
						const options = target.options
						
						if (options.title) confirmDialog.title = options.title
						if (options.subtitle) confirmDialog.subtitle = options.subtitle
						if (options.message) confirmDialog.message = options.message
						if (options.confirmText) confirmDialog.confirmText = options.confirmText
						if (options.cancelText) confirmDialog.cancelText = options.cancelText
						if (options.variant) confirmDialog.variant = options.variant
						if (options.confirmColor) confirmDialog.confirmColor = options.confirmColor
						if (options.width) confirmDialog.style.setProperty('--dialog-width', options.width)
						
						// Handle custom content if provided
						if (options.content) {
							const contentContainer = document.createElement('div')
							contentContainer.slot = 'content'
							
							if (typeof options.content === 'function') {
								const result = options.content()
								if (result instanceof HTMLElement) {
									contentContainer.appendChild(result)
								} else {
									render(result, contentContainer)
								}
							} else if (options.content instanceof HTMLElement) {
								contentContainer.appendChild(options.content)
							} else {
								render(options.content, contentContainer)
							}
							
							confirmDialog.appendChild(contentContainer)
						}
						
						// Add to active dialogs
						this.activeDialogs.push(confirmDialog)
					} else {
						// Configure component dialog
						if (target.content) {
							const directContentContainer = document.createElement('div')
							directContentContainer.style.height = '100%'
							directContentContainer.style.width = '100%'
							directContentContainer.classList.add('schmancy-dialog-content-container')
							
							// Render the content directly
							if (typeof target.content === 'function') {
								const result = target.content()
								if (result instanceof HTMLElement) {
									directContentContainer.appendChild(result)
								} else {
									render(result, directContentContainer)
								}
							} else if (target.content instanceof HTMLElement) {
								directContentContainer.appendChild(target.content)
							} else {
								render(target.content, directContentContainer)
							}
							
							dialog.appendChild(directContentContainer)
						}
						
						// Set width from options
						if (target.options.width) {
							dialog.style.setProperty('--dialog-width', target.options.width)
						}
						
						// Add to active raw dialogs
						this.activeRawDialogs.push(dialog)
					}
				}),
				tap(({ dialog, target }) => {
					// Show dialog and handle promise resolution
					const position = target.options.position || this.getCenteredPosition()
					
					dialog.show(position).then((result: boolean) => {
						if (target.resolve) {
							target.resolve(result)
						}
						
						// Cleanup
						if (target.type === 'confirm') {
							const index = this.activeDialogs.indexOf(dialog)
							if (index !== -1) {
								this.activeDialogs.splice(index, 1)
							}
							
							// Clean up content
							const contentEl = dialog.querySelector('[slot="content"]')
							if (contentEl) {
								dialog.removeChild(contentEl)
							}
						} else {
							const index = this.activeRawDialogs.indexOf(dialog)
							if (index !== -1) {
								this.activeRawDialogs.splice(index, 1)
							}
							
							// Clean up content
							const contentContainer = dialog.querySelector('.schmancy-dialog-content-container')
							if (contentContainer && contentContainer.parentNode) {
								contentContainer.parentNode.removeChild(contentContainer)
							}
						}
						
						// Remove dialog from DOM
						if (dialog.parentElement) {
							dialog.parentElement.removeChild(dialog)
						}
					}).catch((error: any) => {
						if (target.reject) {
							target.reject(error)
						}
					})
					
					// Set up event listeners for callbacks
					if (target.options.onConfirm) {
						const onConfirm = (_e: Event) => {
							target.options.onConfirm!()
							dialog.removeEventListener('confirm', onConfirm)
						}
						dialog.addEventListener('confirm', onConfirm)
					}
					
					if (target.options.onCancel) {
						const onCancel = (_e: Event) => {
							target.options.onCancel!()
							dialog.removeEventListener('cancel', onCancel)
						}
						dialog.addEventListener('cancel', onCancel)
					}
				}),
			)
			.subscribe()
	}
	
	/**
	 * Sets up the dialog dismissal logic
	 */
	private setupDialogDismissLogic() {
		this.dismissSubject
			.pipe(
				switchMap(uid =>
					forkJoin([
						fromEvent<DialogHereMortyEvent>(window, DialogHereMorty).pipe(
							takeUntil(timer(100)),
							map(e => e.detail),
							defaultIfEmpty(undefined),
						),
						of(uid).pipe(
							tap(() => {
								window.dispatchEvent(
									new CustomEvent(DialogWhereAreYouRicky, { 
										detail: { uid },
										bubbles: true,
										composed: true,
									})
								)
							}),
						),
					]),
				),
				tap(([response]) => {
					if (response?.dialog) {
						// Hide the dialog
						response.dialog.hide(false)
						
						// Remove from tracking arrays
						const confirmIndex = this.activeDialogs.indexOf(response.dialog)
						if (confirmIndex !== -1) {
							this.activeDialogs.splice(confirmIndex, 1)
						}
						
						const rawIndex = this.activeRawDialogs.indexOf(response.dialog)
						if (rawIndex !== -1) {
							this.activeRawDialogs.splice(rawIndex, 1)
						}
						
						// Remove dialog from DOM immediately
						if (response.dialog.parentElement) {
							response.dialog.parentElement.removeChild(response.dialog)
						}
					}
				}),
			)
			.subscribe()
	}

	/**
	 * Show a confirmation dialog
	 * @returns Promise that resolves to true (confirm) or false (cancel)
	 */
	public confirm(options: DialogOptions): Promise<boolean> {
		return new Promise((resolve, reject) => {
			// Apply default options
			const completeOptions = {
				...DialogService.DEFAULT_OPTIONS,
				...options,
			}

			// If no position is provided, center the dialog
			if (!completeOptions.position) {
				completeOptions.position = this.getCenteredPosition()
			}

			// Create dialog target and emit to subject
			const target: DialogTarget = {
				options: completeOptions,
				type: 'confirm',
				content: completeOptions.content,
				resolve,
				reject,
			}

			this.dialogSubject.next(target)
		})
	}

	/**
	 * Show a dialog with custom component content
	 * Always renders content directly without any headers or action buttons
	 * @returns Promise that resolves when dialog is closed
	 */
	public component(
		content: TemplateResult | HTMLElement | (() => HTMLElement | TemplateResult),
		options: Omit<DialogOptions, 'content' | 'message'> = {},
	): Promise<boolean> {
		return new Promise((resolve, reject) => {
			// If no position is provided, center the dialog
			if (!options.position) {
				options.position = this.getCenteredPosition()
			}

			// Create dialog target and emit to subject
			const target: DialogTarget = {
				options: options as DialogOptions,
				type: 'component',
				content,
				resolve,
				reject,
			}

			this.dialogSubject.next(target)
		})
	}

	/**
	 * Dismiss the most recently opened dialog (either confirm or component type)
	 * @returns true if a dialog was dismissed, false if no dialogs were open
	 */
	public dismiss(): boolean {
		// Try component dialog first (they're more likely to be on top)
		if (this.activeRawDialogs.length > 0) {
			// Get the most recently opened raw dialog (last in the array)
			const dialog = this.activeRawDialogs[this.activeRawDialogs.length - 1]
			const uid = dialog.getAttribute('uid')
			
			if (uid) {
				this.dismissSubject.next(uid)
				return true
			}
		}
		
		// Fall back to confirm dialogs
		if (this.activeDialogs.length > 0) {
			// Get the most recently opened dialog (last in the array)
			const dialog = this.activeDialogs[this.activeDialogs.length - 1]
			const uid = dialog.getAttribute('uid')
			
			if (uid) {
				this.dismissSubject.next(uid)
				return true
			}
		}

		return false
	}

	/**
	 * Show a simple confirmation dialog with just a message
	 * @returns Promise that resolves to true (confirm) or false (cancel)
	 */
	public ask(message: string, event?: MouseEvent | TouchEvent): Promise<boolean> {
		return this.confirm({
			message,
			position: event,
		})
	}

	/**
	 * Show a danger confirmation dialog
	 * @returns Promise that resolves to true (confirm) or false (cancel)
	 */
	public danger(options: Omit<DialogOptions, 'variant'>): Promise<boolean> {
		return this.confirm({
			...options,
			variant: 'danger',
		})
	}

	/**
	 * Get a centered position for the dialog
	 */
	private getCenteredPosition(): { x: number; y: number } {
		return {
			x: window.innerWidth / 2,
			y: window.innerHeight / 2,
		}
	}

}

/**
 * Global dialog utility - provides a quick way to show dialogs
 */
export const $dialog = {
	/**
	 * Show a confirmation dialog
	 * @returns Promise that resolves to true (confirm) or false (cancel)
	 */
	confirm: (options: DialogOptions): Promise<boolean> => {
		return DialogService.getInstance().confirm(options)
	},

	/**
	 * Show a simple confirmation dialog with just a message
	 * @returns Promise that resolves to true (confirm) or false (cancel)
	 */
	ask: (message: string, event?: MouseEvent | TouchEvent): Promise<boolean> => {
		return DialogService.getInstance().ask(message, event)
	},

	/**
	 * Show a danger confirmation dialog
	 * @returns Promise that resolves to true (confirm) or false (cancel)
	 */
	danger: (options: Omit<DialogOptions, 'variant'>): Promise<boolean> => {
		return DialogService.getInstance().danger(options)
	},

	/**
	 * Show a dialog with custom component content
	 * @returns Promise that resolves when dialog is closed
	 */
	component: (
		content: TemplateResult | HTMLElement | (() => HTMLElement | TemplateResult),
		options?: Omit<DialogOptions, 'content' | 'message'>,
	): Promise<boolean> => {
		return DialogService.getInstance().component(content, options)
	},

	/**
	 * Show a simple dialog without title or actions, just content
	 * This is an alias for component() since all component dialogs are now simple by design
	 * @returns Promise that resolves when dialog is closed
	 */
	simple: (
		content: TemplateResult | HTMLElement | (() => HTMLElement | TemplateResult),
		options?: Omit<DialogOptions, 'content' | 'message' | 'title' | 'confirmText' | 'cancelText'>,
	): Promise<boolean> => {
		return DialogService.getInstance().component(content, options)
	},

	/**
	 * Dismiss the most recently opened dialog
	 * @returns true if a dialog was dismissed, false if no dialogs were open
	 */
	dismiss: (): boolean => {
		return DialogService.getInstance().dismiss()
	},
}

export default DialogService