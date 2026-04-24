import { render, TemplateResult } from 'lit'
import {
	defaultIfEmpty,
	forkJoin,
	fromEvent,
	map,
	of,
	Subject,
	Subscription,
	switchMap,
	takeUntil,
	tap,
	timer,
} from 'rxjs'
import { ThemeHereIAm, ThemeHereIAmEvent, ThemeWhereAreYou } from '../theme/theme.events'
import { overlayStack } from '../utils/overlay-stack'
import { SchmancyDialog } from './dialog.component'
import { DialogHereMorty, DialogHereMortyEvent, DialogWhereAreYouRicky } from './dialog-events'

/**
 * Dialog service options interface
 */
export interface DialogOptions {
	title?: string
	subtitle?: string
	message?: string
	confirmText?: string
	cancelText?: string
	variant?: 'default' | 'danger'
	position?: { x: number; y: number } | MouseEvent | TouchEvent
	content?: TemplateResult | HTMLElement | (() => HTMLElement | TemplateResult)
	onConfirm?: () => void
	onCancel?: () => void
	hideActions?: boolean
	targetContainer?: HTMLElement
}

/**
 * Prompt dialog options
 */
export interface PromptOptions {
	title?: string
	message?: string
	label?: string
	placeholder?: string
	defaultValue?: string
	inputType?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
	confirmText?: string
	cancelText?: string
	position?: { x: number; y: number } | MouseEvent | TouchEvent
}

interface DialogTarget {
	options: DialogOptions
	type: 'confirm' | 'component'
	content?: TemplateResult | HTMLElement | (() => HTMLElement | TemplateResult)
	resolve?: (value: boolean) => void
	reject?: (reason?: unknown) => void
}

/**
 * Dialog service for centralized dialog management.
 * Uses a single unified SchmancyDialog component for all dialog types.
 */
export class DialogService {
	private static instance: DialogService

	private static DEFAULT_OPTIONS: Partial<DialogOptions> = {
		title: undefined,
		subtitle: undefined,
		confirmText: undefined,
		cancelText: undefined,
		variant: 'default',
	}

	// Single array to track all dialogs
	private activeDialogs: SchmancyDialog[] = []

	private dialogSubject = new Subject<DialogTarget>()
	private dismissSubject = new Subject<string>()

	// Lazy click position tracking - only initialized when first dialog opens
	private lastClickPosition: { x: number; y: number } | null = null
	private clickTrackingInitialized = false

	private constructor() {
		this.setupDialogOpeningLogic()
		this.setupDialogDismissLogic()
		this.setupClickPositionTracking()
	}

	private setupClickPositionTracking() {
		if (this.clickTrackingInitialized || typeof document === 'undefined') return
		this.clickTrackingInitialized = true

		fromEvent<PointerEvent>(document, 'pointerdown', { capture: true, passive: true })
			.pipe(
				tap(event => {
					this.lastClickPosition = { x: event.clientX, y: event.clientY }
				}),
			)
			.subscribe()
	}

	public static getInstance(): DialogService {
		if (!DialogService.instance) {
			DialogService.instance = new DialogService()
		}
		return DialogService.instance
	}

	private setupDialogOpeningLogic() {
		this.dialogSubject
			.pipe(
				switchMap(target =>
					forkJoin([
						fromEvent<ThemeHereIAmEvent>(window, ThemeHereIAm).pipe(
							takeUntil(timer(50)),
							map(e => e.detail.theme),
							defaultIfEmpty(undefined),
						),
						of(target).pipe(
							tap(() => {
								const uid = `dialog-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
								window.dispatchEvent(
									new CustomEvent(ThemeWhereAreYou, {
										bubbles: true,
										composed: true,
									}),
								)
								;(target as { uid?: string }).uid = uid
							}),
						),
					]),
				),
				map(([theme, target]) => {
					const targetContainer =
						theme ||
						target.options.targetContainer ||
						(document.querySelector('schmancy-theme') as HTMLElement) ||
						document.body

					const uid = (target as { uid?: string }).uid!
					const dialog = document.createElement('schmancy-dialog') as SchmancyDialog
					dialog.setAttribute('uid', uid)
					dialog.style.setProperty('--schmancy-overlay-z', String(overlayStack.getNextZIndex()))
					targetContainer.appendChild(dialog)

					return { dialog, target }
				}),
				tap(({ dialog, target }) => {
					const options = target.options

					if (target.type === 'confirm') {
						// Configure for confirm mode
						dialog.title = options.title
						dialog.subtitle = options.subtitle
						dialog.message = options.message
						dialog.confirmText = options.confirmText ?? 'Confirm'
						dialog.cancelText = options.cancelText ?? 'Cancel'
						dialog.variant = options.variant ?? 'default'

						// Handle custom content slot
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

							dialog.appendChild(contentContainer)
						}
					} else {
						// Configure for content mode
						dialog.hideActions = true

						if (target.content) {
							const contentContainer = document.createElement('div')
							
							contentContainer.style.display = 'contents'
							contentContainer.classList.add('schmancy-dialog-content-container')

							if (typeof target.content === 'function') {
								const result = target.content()
								if (result instanceof HTMLElement) {
									contentContainer.appendChild(result)
								} else {
									render(result, contentContainer)
								}
							} else if (target.content instanceof HTMLElement) {
								contentContainer.appendChild(target.content)
							} else {
								render(target.content, contentContainer)
							}

							dialog.appendChild(contentContainer)
						}
					}

					this.activeDialogs.push(dialog)
				}),
				tap(({ dialog, target }) => {
					const position = target.options.position || this.getDefaultPosition()

					dialog
						.show(position)
						.then((result: boolean) => {
							target.resolve?.(result)

							// Cleanup
							const index = this.activeDialogs.indexOf(dialog)
							if (index !== -1) {
								this.activeDialogs.splice(index, 1)
							}
							overlayStack.release()

							// Clean up content
							const contentEl = dialog.querySelector('[slot="content"]')
							if (contentEl) dialog.removeChild(contentEl)

							const contentContainer = dialog.querySelector('.schmancy-dialog-content-container')
							if (contentContainer?.parentNode) {
								contentContainer.parentNode.removeChild(contentContainer)
							}

							// Clean up event subscriptions
							const eventSubscriptions = (dialog as unknown as { _eventSubscriptions?: Subscription[] })
								._eventSubscriptions
							eventSubscriptions?.forEach(sub => sub.unsubscribe())

							// Remove from DOM
							dialog.parentElement?.removeChild(dialog)
						})
						.catch((error: unknown) => {
							target.reject?.(error)
						})

					// Set up event listeners
					const eventSubscriptions: Subscription[] = []

					if (target.options.onConfirm) {
						const confirmSub = fromEvent(dialog, 'confirm').subscribe(() => {
							target.options.onConfirm!()
							confirmSub.unsubscribe()
						})
						eventSubscriptions.push(confirmSub)
					}

					if (target.options.onCancel) {
						const cancelSub = fromEvent(dialog, 'cancel').subscribe(() => {
							target.options.onCancel!()
							cancelSub.unsubscribe()
						})
						eventSubscriptions.push(cancelSub)
					}

					;(dialog as unknown as { _eventSubscriptions: Subscription[] })._eventSubscriptions = eventSubscriptions
				}),
			)
			.subscribe()
	}

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
									}),
								)
							}),
						),
					]),
				),
				tap(([response]) => {
					if (response?.dialog) {
						response.dialog.hide(false)

						const eventSubscriptions = (response.dialog as unknown as { _eventSubscriptions?: Subscription[] })
							._eventSubscriptions
						eventSubscriptions?.forEach(sub => sub.unsubscribe())

						const index = this.activeDialogs.indexOf(response.dialog as SchmancyDialog)
						if (index !== -1) {
							this.activeDialogs.splice(index, 1)
						}
						overlayStack.release()

						response.dialog.parentElement?.removeChild(response.dialog)
					}
				}),
			)
			.subscribe()
	}

	public confirm(options: DialogOptions): Promise<boolean> {
		return new Promise((resolve, reject) => {
			const completeOptions = {
				...DialogService.DEFAULT_OPTIONS,
				...options,
			}

			if (!completeOptions.position) {
				completeOptions.position = this.getDefaultPosition()
			}

			this.dialogSubject.next({
				options: completeOptions,
				type: 'confirm',
				content: completeOptions.content,
				resolve,
				reject,
			})
		})
	}

	public component(
		content: TemplateResult | HTMLElement | (() => HTMLElement | TemplateResult),
		options: Omit<DialogOptions, 'content' | 'message'> = {},
	): Promise<boolean> {
		return new Promise((resolve, reject) => {
			if (!options.position) {
				options.position = this.getDefaultPosition()
			}

			this.dialogSubject.next({
				options: options as DialogOptions,
				type: 'component',
				content,
				resolve,
				reject,
			})
		})
	}

	public dismiss(): boolean {
		if (this.activeDialogs.length > 0) {
			const dialog = this.activeDialogs[this.activeDialogs.length - 1]
			const uid = dialog.getAttribute('uid')

			if (uid) {
				this.dismissSubject.next(uid)
				return true
			}
		}
		return false
	}

	public close(): boolean {
		return this.dismiss()
	}

	public ask(message: string, event?: MouseEvent | TouchEvent): Promise<boolean> {
		return this.confirm({
			message,
			confirmText: 'Confirm',
			cancelText: 'Cancel',
			position: event,
		})
	}

	public danger(options: Omit<DialogOptions, 'variant'>): Promise<boolean> {
		return this.confirm({
			...options,
			variant: 'danger',
		})
	}

	/**
	 * Shows a prompt dialog with an input field.
	 * Returns the input value if confirmed, null if cancelled.
	 */
	public prompt(options: PromptOptions): Promise<string | null> {
		return new Promise(resolve => {
			let inputValue = options.defaultValue || ''

			// Create container for input
			const container = document.createElement('div')
			container.style.width = '100%'
			container.style.minWidth = '280px'

			const input = document.createElement('schmancy-input') as HTMLElement
			input.setAttribute('type', options.inputType || 'text')
			if (options.label) input.setAttribute('label', options.label)
			if (options.placeholder) input.setAttribute('placeholder', options.placeholder)
			if (options.defaultValue) input.setAttribute('value', options.defaultValue)

			input.addEventListener('input', (e: Event) => {
				inputValue = (e.target as HTMLInputElement).value
			})

			container.appendChild(input)

			this.confirm({
				title: options.title,
				message: options.message,
				confirmText: options.confirmText ?? 'OK',
				cancelText: options.cancelText ?? 'Cancel',
				position: options.position,
				content: container,
			}).then(confirmed => {
				resolve(confirmed ? inputValue : null)
			})
		})
	}

	private getDefaultPosition(): { x: number; y: number } {
		// Use last click position if available, otherwise center of screen
		if (this.lastClickPosition) {
			return { ...this.lastClickPosition }
		}
		return {
			x: window.innerWidth / 2,
			y: window.innerHeight / 2,
		}
	}
}

/**
 * Eagerly instantiate so click tracking starts immediately on import,
 * not on first dialog open (which would miss the triggering click).
 */
const service = DialogService.getInstance()

/**
 * Global dialog utility. Imperative modal API — open any element as a dialog,
 * or use the built-in `confirm` / `ask` / `danger` prompts. Returns Promises
 * that resolve when the user picks an action.
 *
 * @service
 * @summary Imperative modal dialogs and built-in confirm/ask/danger prompts.
 * @method confirm(options: DialogOptions) - Built-in confirm prompt. Returns Promise<boolean>.
 * @method ask(message, event?) - One-line yes/no prompt anchored to the triggering event.
 * @method danger(options) - Destructive-action confirm styled with the error palette.
 * @method component(element, options?) - Open any element as a modal.
 * @method dismiss(id?) - Dismiss a dialog by id, or the topmost dialog.
 */
export const $dialog = {
	confirm: (options: DialogOptions): Promise<boolean> => {
		return service.confirm(options)
	},

	ask: (message: string, event?: MouseEvent | TouchEvent): Promise<boolean> => {
		return service.ask(message, event)
	},

	danger: (options: Omit<DialogOptions, 'variant'>): Promise<boolean> => {
		return service.danger(options)
	},

	prompt: (options: PromptOptions): Promise<string | null> => {
		return service.prompt(options)
	},

	component: (
		content: TemplateResult | HTMLElement | (() => HTMLElement | TemplateResult),
		options?: Omit<DialogOptions, 'content' | 'message'>,
	): Promise<boolean> => {
		return service.component(content, options)
	},

	dismiss: (): boolean => {
		return service.dismiss()
	},

	close: (): boolean => {
		return service.close()
	},
}

export default DialogService
