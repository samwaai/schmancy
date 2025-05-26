import { render, TemplateResult } from 'lit'
import { ConfirmDialog } from './dailog'

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
		cancelText: 'Cancel',
		variant: 'default',
		width: '360px',
	}

	// Track active dialogs to handle dismissing the most recent one
	private activeDialogs: ConfirmDialog[] = []
	
	// Track component dialogs (schmancy-dialog instances)
	private activeRawDialogs: any[] = []

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
		if (completeOptions.subtitle) dialog.subtitle = completeOptions.subtitle
		if (completeOptions.message) dialog.message = completeOptions.message
		if (completeOptions.confirmText) dialog.confirmText = completeOptions.confirmText
		if (completeOptions.cancelText) dialog.cancelText = completeOptions.cancelText
		if (completeOptions.variant) dialog.variant = completeOptions.variant
		if (completeOptions.confirmColor) dialog.confirmColor = completeOptions.confirmColor
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

		// Add this dialog to active dialogs
		this.activeDialogs.push(dialog)

		// Show dialog and return promise
		return dialog.show(completeOptions.position).finally(() => {
			// Remove from active dialogs when closed
			const index = this.activeDialogs.indexOf(dialog)
			if (index !== -1) {
				this.activeDialogs.splice(index, 1)
			}

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
	 * Show a dialog with custom component content
	 * Always renders content directly without any headers or action buttons
	 * @returns Promise that resolves when dialog is closed
	 */
	public component(
		content: TemplateResult | HTMLElement | (() => HTMLElement | TemplateResult),
		options: Omit<DialogOptions, 'content' | 'message'> = {},
	): Promise<boolean> {
		// Create a direct container for the component without any wrapping
		const directContentContainer = document.createElement('div');
		directContentContainer.style.height = '100%';
		directContentContainer.style.width = '100%';
		directContentContainer.classList.add('schmancy-dialog-content-container');
		
		// Render the content directly
		if (typeof content === 'function') {
			const result = content();
			if (result instanceof HTMLElement) {
				directContentContainer.appendChild(result);
			} else {
				render(result, directContentContainer);
			}
		} else if (content instanceof HTMLElement) {
			directContentContainer.appendChild(content);
		} else {
			render(content, directContentContainer);
		}
		
		// Create dialog if it doesn't exist
		let dialog = document.querySelector('schmancy-dialog') as any;
		if (!dialog) {
			dialog = document.createElement('schmancy-dialog');
			document.body.appendChild(dialog);
		}
		
		// Always use raw component rendering with no actions
		dialog.appendChild(directContentContainer);
		
		// Set width from options
		if (options.width) {
			dialog.style.setProperty('--dialog-width', options.width);
		}
		
		// Add to active raw dialogs for dismiss functionality
		this.activeRawDialogs.push(dialog);
		
		// Show dialog and return promise with cleanup
		const promise = dialog.show(options.position);
		return promise.finally(() => {
			// Clean up content when dialog closes
			if (directContentContainer && directContentContainer.parentNode) {
				directContentContainer.parentNode.removeChild(directContentContainer);
			}
			
			// Remove from active raw dialogs
			const index = this.activeRawDialogs.indexOf(dialog);
			if (index !== -1) {
				this.activeRawDialogs.splice(index, 1);
			}
		});
	}

	/**
	 * Dismiss the most recently opened dialog (either confirm or component type)
	 * @returns true if a dialog was dismissed, false if no dialogs were open
	 */
	public dismiss(): boolean {
		// Try component dialog first (they're more likely to be on top)
		if (this.activeRawDialogs.length > 0) {
			// Get the most recently opened raw dialog (last in the array)
			const dialog = this.activeRawDialogs[this.activeRawDialogs.length - 1];
			
			// Hide the dialog
			dialog.hide(false);
			
			// Remove from active dialogs
			this.activeRawDialogs.pop();
			
			return true;
		}
		
		// Fall back to confirm dialogs
		if (this.activeDialogs.length > 0) {
			// Get the most recently opened dialog (last in the array)
			const dialog = this.activeDialogs[this.activeDialogs.length - 1];
			
			// Hide the dialog (with cancel result)
			dialog.hide(false);
			
			return true;
		}

		return false;
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