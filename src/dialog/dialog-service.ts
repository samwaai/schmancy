import { render, TemplateResult } from 'lit'
import { ConfirmDialog } from './dailog'

/**
 * Dialog service options interface with component support
 */
export interface DialogOptions {
	title?: string
	message?: string
	confirmText?: string
	cancelText?: string
	variant?: 'default' | 'danger'
	position: { x: number; y: number } | MouseEvent | TouchEvent

	// New options for component rendering
	content?: TemplateResult | HTMLElement | (() => HTMLElement | TemplateResult)
	width?: string
	onConfirm?: () => void
	onCancel?: () => void
}

/**
 * Dialog service for centralized dialog management.
 * Provides a simple API for showing dialogs with optional custom components.
 */
export class DialogService {
	private static instance: DialogService

	// Default dialog options
	private static DEFAULT_OPTIONS: Partial<DialogOptions> = {
		title: 'Confirm Action',
		confirmText: 'Confirm',
		cancelText: 'Cancel',
		variant: 'default',
		width: '360px',
	}

	// Private constructor for singleton pattern
	private constructor() {}

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
	 * Show a confirmation dialog
	 * @returns Promise that resolves to true (confirm) or false (cancel)
	 */
	public confirm(options: DialogOptions): Promise<boolean> {
		// Apply default options
		const completeOptions = {
			...DialogService.DEFAULT_OPTIONS,
			...options,
		}

		// If no position is provided, center the dialog
		if (!completeOptions.position) {
			completeOptions.position = this.getCenteredPosition()
		}

		// Create or find the dialog
		let dialog = document.querySelector('confirm-dialog') as ConfirmDialog
		if (!dialog) {
			dialog = document.createElement('confirm-dialog') as ConfirmDialog
			document.body.appendChild(dialog)
		}

		// Set basic options
		if (completeOptions.title) dialog.title = completeOptions.title
		if (completeOptions.message) dialog.message = completeOptions.message
		if (completeOptions.confirmText) dialog.confirmText = completeOptions.confirmText
		if (completeOptions.cancelText) dialog.cancelText = completeOptions.cancelText
		if (completeOptions.variant) dialog.variant = completeOptions.variant
		if (completeOptions.width) dialog.style.setProperty('--dialog-width', completeOptions.width)

		// Handle custom content if provided
		if (completeOptions.content) {
			const contentContainer = document.createElement('div')
			contentContainer.slot = 'content'

			if (typeof completeOptions.content === 'function') {
				const result = completeOptions.content()
				if (result instanceof HTMLElement) {
					contentContainer.appendChild(result)
				} else {
					render(result, contentContainer)
				}
			} else if (completeOptions.content instanceof HTMLElement) {
				contentContainer.appendChild(completeOptions.content)
			} else {
				render(completeOptions.content, contentContainer)
			}

			dialog.appendChild(contentContainer)
		}

		// Set up event listeners for optional callbacks
		if (completeOptions.onConfirm) {
			const onConfirm = (_e: Event) => {
				completeOptions.onConfirm!()
				dialog.removeEventListener('confirm', onConfirm)
			}
			dialog.addEventListener('confirm', onConfirm)
		}

		if (completeOptions.onCancel) {
			const onCancel = (_e: Event) => {
				completeOptions.onCancel!()
				dialog.removeEventListener('cancel', onCancel)
			}
			dialog.addEventListener('cancel', onCancel)
		}

		// Show dialog and return promise
		return dialog.show(completeOptions.position).finally(() => {
			// Clean up the content when dialog closes
			if (completeOptions.content) {
				const contentEl = dialog.querySelector('[slot="content"]')
				if (contentEl) {
					dialog.removeChild(contentEl)
				}
			}
		})
	}

	/**
	 * Show a simple confirmation dialog with just a message
	 * @returns Promise that resolves to true (confirm) or false (cancel)
	 */
	public ask(message: string, event?: MouseEvent | TouchEvent): Promise<boolean> {
		return this.confirm({
			message,
			position: event || this.getCenteredPosition(),
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
	 * Show a dialog with custom component content
	 * @returns Promise that resolves to true (confirm) or false (cancel)
	 */
	public component(
		content: TemplateResult | HTMLElement | (() => HTMLElement | TemplateResult),
		options: Omit<DialogOptions, 'content' | 'message'> = { position: this.getCenteredPosition() },
	): Promise<boolean> {
		return this.confirm({
			...options,
			content,
			// Clear message if content is provided
			title: undefined,
			message: undefined,
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
	 * @returns Promise that resolves to true (confirm) or false (cancel)
	 */
	component: (
		content: TemplateResult | HTMLElement | (() => HTMLElement | TemplateResult),
		options?: Omit<DialogOptions, 'content' | 'message'>,
	): Promise<boolean> => {
		return DialogService.getInstance().component(content, options)
	},
}

export default DialogService
