import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { fromEvent, tap } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { DialogBase } from './dialog-base.mixin'
import { DialogHereMorty, DialogWhereAreYouRicky, DialogWhereAreYouRickyEvent } from './dialog-events'

/**
 * Unified dialog component that handles both content-only and confirm modes.
 *
 * @element schmancy-dialog
 * @slot default - Content slot for dialog body (used in content mode)
 * @slot content - Named slot for custom content in confirm mode
 *
 * @example Content mode (no buttons):
 * ```html
 * <schmancy-dialog>
 *   <my-custom-content></my-custom-content>
 * </schmancy-dialog>
 * ```
 *
 * @example Confirm mode (with buttons):
 * ```html
 * <schmancy-dialog
 *   title="Confirm Action"
 *   message="Are you sure?"
 *   confirm-text="Yes"
 *   cancel-text="No"
 * ></schmancy-dialog>
 * ```
 */
@customElement('schmancy-dialog')
export class SchmancyDialog extends DialogBase(
	$LitElement(css`
		:host {
			position: fixed;
			z-index: 10000;
			inset: 0;
			display: none;
			--dialog-width: fit-content;
		}

		:host([active]) {
			display: block;
		}
	`),
) {
	/**
	 * Unique identifier for the dialog instance
	 */
	@property({ type: String, reflect: true }) uid!: string

	/**
	 * Dialog title (enables confirm mode when set)
	 */
	@property({ type: String }) title: string | undefined = undefined

	/**
	 * Dialog subtitle
	 */
	@property({ type: String }) subtitle: string | undefined = undefined

	/**
	 * Dialog message
	 */
	@property({ type: String }) message: string | undefined = undefined

	/**
	 * Text for confirm button (enables confirm mode when set with cancelText)
	 */
	@property({ type: String, attribute: 'confirm-text' }) confirmText: string | undefined = undefined

	/**
	 * Text for cancel button
	 */
	@property({ type: String, attribute: 'cancel-text' }) cancelText: string | undefined = undefined

	/**
	 * Dialog variant (affects button colors in confirm mode)
	 */
	@property({ type: String }) variant: 'default' | 'danger' = 'default'

	/**
	 * Whether to hide action buttons (force content mode)
	 */
	@property({ type: Boolean, attribute: 'hide-actions' }) hideActions = false

	/**
	 * Return the dialog element for positioning
	 */
	protected getDialogElement(): HTMLElement | null {
		return this.shadowRoot?.querySelector('[role="dialog"], [role="alertdialog"]') as HTMLElement
	}

	/**
	 * Check if dialog is in confirm mode (has buttons)
	 */
	private get isConfirmMode(): boolean {
		if (this.hideActions) return false
		return !!(this.confirmText?.trim() && this.cancelText?.trim())
	}

	/**
	 * Handle component connection to DOM
	 */
	connectedCallback(): void {
		super.connectedCallback()

		// Listen for "where are you ricky" events
		fromEvent<DialogWhereAreYouRickyEvent>(window, DialogWhereAreYouRicky)
			.pipe(
				tap(e => {
					if (e.detail.uid === this.uid) this.announcePresence()
				}),
				takeUntil(this.disconnecting),
			)
			.subscribe()
	}

	/**
	 * Announce this dialog's presence to the service
	 */
	private announcePresence(): void {
		this.dispatchEvent(
			new CustomEvent(DialogHereMorty, {
				detail: { dialog: this },
				bubbles: true,
				composed: true,
			}),
		)
	}

	/**
	 * Handle confirm action
	 */
	private handleConfirm(): void {
		this.hide(true)
		this.dispatchEvent(
			new CustomEvent('confirm', {
				bubbles: true,
				composed: true,
			}),
		)
	}

	/**
	 * Handle cancel/close action
	 */
	private handleClose(): void {
		this.hide(false)
		this.dispatchEvent(
			new CustomEvent(this.isConfirmMode ? 'cancel' : 'close', {
				bubbles: true,
				composed: true,
			}),
		)
	}

	render() {
		const isCentered = this.isCentered()
		const hasCustomContent = this.querySelectorAll('[slot="content"]').length > 0

		const dialogClasses = {
			dialog: true,
			fixed: true,
			'w-[var(--dialog-width)]': true,
			'max-w-[calc(100vw-2rem)]': true,
			'max-h-[90dvh]': true,
			'overflow-hidden': true,
			'top-1/2': isCentered,
			'left-1/2': isCentered,
			'-translate-x-1/2': isCentered,
			'-translate-y-1/2': isCentered,
		}

		// Confirm mode: with title/buttons
		if (this.isConfirmMode) {
			return html`
				<div class="fixed inset-0 bg-scrim/40" @click=${this.handleClose}></div>

				<div class=${this.classMap(dialogClasses)} role="alertdialog" aria-modal="true">
					<schmancy-surface rounded="all" elevation="3" type="containerHigh" fill="all" class="overflow-hidden">
						<schmancy-scroll direction="vertical" hide class="p-4">
							<schmancy-form @submit=${this.handleConfirm}>
								${when(
									this.title?.trim(),
									() => html`
										<schmancy-typography type="title" token="md" class="mb-1">${this.title}</schmancy-typography>
										${when(
											this.subtitle?.trim(),
											() => html`
												<schmancy-typography type="subtitle" token="xs" class="mb-2">
													${this.subtitle}
												</schmancy-typography>
											`,
										)}
									`,
								)}
								${hasCustomContent
									? html`<div class="mb-4"><slot name="content"></slot></div>`
									: when(
											this.message?.trim(),
											() => html`<schmancy-typography type="body" class="mb-4">${this.message}</schmancy-typography>`,
										)}
								<div class="flex justify-end gap-3">
									<schmancy-button variant="outlined" @click=${this.handleClose}>${this.cancelText}</schmancy-button>
									<schmancy-button type="submit" variant="filled">${this.confirmText}</schmancy-button>
								</div>
							</schmancy-form>
						</schmancy-scroll>
					</schmancy-surface>
				</div>
			`
		}

		// Content mode: minimal, just slot
		return html`
			<div class="fixed inset-0 bg-surface-container/10 backdrop-blur-xs" @click=${this.handleClose}></div>

			<section class=${this.classMap(dialogClasses)} role="dialog" aria-modal="true">
				<schmancy-surface rounded="all" type="surface" elevation="2" fill="all" class="overflow-hidden">
					<schmancy-scroll direction="vertical" hide class="p-2 md:p-4 max-h-[90dvh]">
						<slot></slot>
					</schmancy-scroll>
				</schmancy-surface>
			</section>
		`
	}

	/**
	 * Static helper for confirm dialogs
	 */
	static async confirm(options: {
		title?: string
		subtitle?: string
		message?: string
		confirmText?: string
		cancelText?: string
		variant?: 'default' | 'danger'
		position?: { x: number; y: number } | MouseEvent | TouchEvent
		width?: string
	}): Promise<boolean> {
		let dialog = document.querySelector('schmancy-dialog[data-static-confirm]') as SchmancyDialog

		if (!dialog) {
			dialog = document.createElement('schmancy-dialog') as SchmancyDialog
			dialog.setAttribute('data-static-confirm', '')
			document.body.appendChild(dialog)
		}

		// Set options
		dialog.title = options.title
		dialog.subtitle = options.subtitle
		dialog.message = options.message
		dialog.confirmText = options.confirmText ?? 'Confirm'
		dialog.cancelText = options.cancelText ?? 'Cancel'
		dialog.variant = options.variant ?? 'default'
		if (options.width) dialog.style.setProperty('--dialog-width', options.width)

		return dialog.show(options.position)
	}

	/**
	 * Simple shorthand - just pass message and optionally an event
	 */
	static async ask(message: string, event?: MouseEvent | TouchEvent): Promise<boolean> {
		return this.confirm({
			message,
			position: event,
		})
	}
}

// Alias for backward compatibility
export { SchmancyDialog as ConfirmDialog }

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-dialog': SchmancyDialog
	}
}
