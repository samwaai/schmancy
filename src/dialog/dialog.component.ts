import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property, queryAssignedElements } from 'lit/decorators.js'
import { cursorGlow } from '../directives/cursor-glow'
import { createRef, ref, type Ref } from 'lit/directives/ref.js'
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
			z-index: var(--schmancy-overlay-z, 10000);
			inset: 0;
			display: none;
			--dialog-width: fit-content;
		}

		:host([active]) {
			display: block;
		}


		/* Luminous glow around the dialog container */
		.dialog {
			box-shadow: 0 8px 40px -8px color-mix(in srgb, var(--schmancy-sys-color-primary-default) 15%, transparent);
			border-radius: var(--schmancy-sys-shape-corner-large);
		}

		@media (prefers-reduced-motion: reduce) {
			.dialog { box-shadow: var(--schmancy-sys-elevation-2); }
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
	 * Slotted children in the named "content" slot (confirm mode custom content)
	 */
	@queryAssignedElements({ slot: 'content', flatten: true })
	private _contentSlotElements!: HTMLElement[]

	/**
	 * Ref to the confirm mode wrapper div
	 */
	private _confirmDialogRef: Ref<HTMLElement> = createRef()

	/**
	 * Ref to the content mode section element
	 */
	private _contentDialogRef: Ref<HTMLElement> = createRef()

	/**
	 * Ref to the backdrop element for animations
	 */
	private _backdropRef: Ref<HTMLElement> = createRef()

	/**
	 * Ref to the drag handle element for swipe gestures
	 */
	private _dragHandleRef: Ref<HTMLElement> = createRef()

	/**
	 * Return the dialog element for positioning/size measurement.
	 * In content mode, returns the first slotted child (the actual component).
	 * In confirm mode, returns the wrapper div.
	 */
	protected getDialogElement(): HTMLElement | null {
		// Content mode: use the section wrapper (slotted content may be display:contents)
		if (this._contentDialogRef.value) return this._contentDialogRef.value
		// Confirm mode: use the wrapper div
		return this._confirmDialogRef.value ?? null
	}

	/**
	 * Return the backdrop element for animations
	 */
	protected getBackdropElement(): HTMLElement | null {
		return this._backdropRef.value ?? null
	}

	/**
	 * Return the drag handle element for swipe gestures
	 */
	protected getDragHandleElement(): HTMLElement | null {
		return this._dragHandleRef.value ?? null
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
		if (this.isAnimating()) return
		this.hide(false)
		this.dispatchEvent(
			new CustomEvent(this.isConfirmMode ? 'cancel' : 'close', {
				bubbles: true,
				composed: true,
			}),
		)
	}

	/**
	 * Render drag handle for mobile bottom sheet
	 */
	private renderDragHandle() {
		return html`
			<div ${ref(this._dragHandleRef)} class="dialog-drag-handle flex justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing touch-none">
				<div class="w-10 h-1 rounded-full bg-outline-variant"></div>
			</div>
		`
	}

	render() {
		const isCentered = this.isCentered()
		const hasCustomContent = this._contentSlotElements?.length > 0

		// Mobile bottom sheet classes
		const mobileDialogClasses = {
			dialog: true,
			fixed: true,
			'inset-x-0': true,
			'bottom-0': true,
			'w-full': true,
			'max-h-[90dvh]': true,
			'overflow-hidden': true,
			// Safe area padding for notched devices
			'pb-[env(safe-area-inset-bottom)]': true,
		}

		// Desktop dialog classes
		const desktopDialogClasses = {
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

		const dialogClasses = this.isMobile ? mobileDialogClasses : desktopDialogClasses

		// Button classes - stack vertically on mobile
		const buttonContainerClasses = this.isMobile
			? 'flex flex-col-reverse gap-2 w-full'
			: 'flex justify-end gap-3'

		// Confirm mode: with title/buttons
		if (this.isConfirmMode) {
			return html`
				<div ${ref(this._backdropRef)} class="fixed inset-0 bg-surface-container/10 backdrop-blur-lg backdrop-saturate-150 backdrop-brightness-105" @click=${this.handleClose}></div>

				<div ${ref(this._confirmDialogRef)} class=${this.classMap(dialogClasses)} role="alertdialog" aria-modal="true">
					<schmancy-surface
						${cursorGlow({ radius: 250, intensity: 0.1 })}
						rounded=${this.isMobile ? 'top' : 'all'}
						type="glass"
						fill="all"
						class="overflow-hidden"
					>
						${this.isMobile ? this.renderDragHandle() : null}
						<schmancy-scroll direction="vertical" hide class="p-4 pt-2">
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
								<div class=${buttonContainerClasses}>
									<schmancy-button
										variant="outlined"
										@click=${this.handleClose}
										class=${this.isMobile ? 'w-full' : ''}
									>
										${this.cancelText}
									</schmancy-button>
									<schmancy-button
										type="submit"
										variant="filled"
										class=${this.isMobile ? 'w-full' : ''}
									>
										${this.confirmText}
									</schmancy-button>
								</div>
							</schmancy-form>
						</schmancy-scroll>
					</schmancy-surface>
				</div>
			`
		}

		// Content mode: minimal, just slot
		return html`
			<div ${ref(this._backdropRef)} class="fixed inset-0 bg-surface-container/10 backdrop-blur-lg backdrop-saturate-150 backdrop-brightness-105" @click=${this.handleClose}></div>

			<section ${ref(this._contentDialogRef)} class=${this.classMap(dialogClasses)} role="dialog" aria-modal="true">
				<schmancy-surface ${cursorGlow({ radius: 250, intensity: 0.1 })} rounded=${this.isMobile ? 'top' : 'all'} type="glass" fill="all">
					${this.isMobile ? this.renderDragHandle() : null}
					<schmancy-scroll direction="vertical" hide class="max-h-[85dvh]">
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
