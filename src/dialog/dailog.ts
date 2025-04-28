import { $LitElement } from '@mixins/index'
import { color } from '@schmancy/directives'
import { SchmancyTheme } from '@schmancy/theme/theme.interface'
import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import { fromEvent, takeUntil } from 'rxjs'

/**
 * A minimal, positioned confirm dialog component
 *
 * @element confirm-dialog
 * @fires confirm - When the confirm button is clicked
 * @fires cancel - When the cancel button is clicked or outside is clicked
 */
@customElement('confirm-dialog')
export class ConfirmDialog extends $LitElement(css`
	:host {
		display: block;
		position: fixed;
		inset: 0;
		z-index: 1000;
		visibility: hidden;
		pointer-events: none;
	}

	:host([open]) {
		visibility: visible;
		pointer-events: auto;
	}

	.dialog {
		position: absolute;
		max-width: 360px;
		width: max-content;
		opacity: 0;
		transform: scale(0.95);
		transition:
			opacity 0.15s ease,
			transform 0.15s ease;
	}

	:host([open]) .dialog {
		opacity: 1;
		transform: scale(1);
	}

	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		opacity: 0;
		transition: opacity 0.15s ease;
	}

	:host([open]) .overlay {
		opacity: 1;
	}
`) {
	/**
	 * Whether the dialog is open
	 */
	@property({ type: Boolean, reflect: true })
	open = false

	/**
	 * Dialog title
	 */
	@property({ type: String })
	title = 'Confirm Action'

	/**
	 * Dialog message
	 */
	@property({ type: String })
	message = 'Are you sure you want to proceed?'

	/**
	 * Text for confirm button
	 */
	@property({ type: String })
	confirmText = 'Confirm'

	/**
	 * Text for cancel button
	 */
	@property({ type: String })
	cancelText = 'Cancel'

	/**
	 * Dialog variant (affects button colors)
	 */
	@property({ type: String })
	variant: 'default' | 'danger' = 'default'

	/**
	 * Internal position state
	 */
	@state() private _position = { x: 0, y: 0 }

	/**
	 * Last clicked position for initial placement
	 */
	private _clickPosition = { x: 0, y: 0 }

	/**
	 * Show the dialog at specific coordinates
	 */
	public showAt(x: number, y: number) {
		this._clickPosition = { x, y }
		this._position = this._calculateOptimalPosition(x, y)
		this.open = true
		this._setupListeners()
	}

	/**
	 * Hide the dialog
	 */
	public hide() {
		this.open = false
	}

	/**
	 * Find the best position for the dialog based on click coordinates
	 */
	private _calculateOptimalPosition(x: number, y: number) {
		// Wait for next frame to ensure dialog is rendered and has dimensions
		requestAnimationFrame(() => {
			const dialog = this.shadowRoot?.querySelector('.dialog') as HTMLElement
			if (!dialog) return

			const dialogWidth = dialog.offsetWidth
			const dialogHeight = dialog.offsetHeight
			const viewport = {
				width: window.innerWidth,
				height: window.innerHeight,
			}

			// Start with the click position
			let newX = x
			let newY = y

			// Ensure dialog stays in viewport horizontally
			if (newX + dialogWidth > viewport.width - 16) {
				newX = Math.max(16, viewport.width - dialogWidth - 16)
			}

			// Ensure dialog stays in viewport vertically
			if (newY + dialogHeight > viewport.height - 16) {
				// Place above click if there's room
				if (y > dialogHeight + 16) {
					newY = y - dialogHeight - 8
				} else {
					// Otherwise place at top of screen with small margin
					newY = 16
				}
			}

			// Update the position state
			this._position = { x: newX, y: newY }
		})

		// Return initial position for first render
		return { x, y }
	}

	/**
	 * Setup event listeners when dialog opens
	 */
	private _setupListeners() {
		// Listen for ESC key
		fromEvent<KeyboardEvent>(document, 'keydown')
			.pipe(takeUntil(this.disconnecting))
			.subscribe(e => {
				if (e.key === 'Escape' && this.open) {
					this._handleCancel()
				}
			})

		// Handle window resize to reposition dialog if needed
		fromEvent(window, 'resize')
			.pipe(takeUntil(this.disconnecting))
			.subscribe(() => {
				if (this.open) {
					this._position = this._calculateOptimalPosition(this._clickPosition.x, this._clickPosition.y)
				}
			})
	}

	/**
	 * Handle confirm action
	 */
	private _handleConfirm() {
		this.hide()
		this.dispatchEvent(
			new CustomEvent('confirm', {
				bubbles: true,
				composed: true,
			}),
		)
	}

	/**
	 * Handle cancel action
	 */
	private _handleCancel() {
		this.hide()
		this.dispatchEvent(
			new CustomEvent('cancel', {
				bubbles: true,
				composed: true,
			}),
		)
	}

	render() {
		const dialogStyles = {
			left: `${this._position.x}px`,
			top: `${this._position.y}px`,
		}

		return html`
			<div class="overlay" @click=${this._handleCancel}></div>

			<div
				class="dialog"
				style=${styleMap(dialogStyles)}
				role="alertdialog"
				aria-modal="true"
				aria-labelledby="dialog-title"
				aria-describedby="dialog-message"
			>
				<schmancy-surface rounded="all" elevation="3" type="containerHigh">
					<div class="p-4">
						<div id="dialog-title" class="mb-2">
							<schmancy-typography type="title" token="md"> ${this.title} </schmancy-typography>
						</div>

						<div id="dialog-message" class="mb-4">
							<schmancy-typography type="body"> ${this.message} </schmancy-typography>
						</div>

						<div class="flex justify-end gap-3">
							<schmancy-button variant="outlined" @click=${this._handleCancel}> ${this.cancelText} </schmancy-button>

							<schmancy-button
								variant="filled"
								${color({
									bgColor:
										this.variant === 'danger'
											? SchmancyTheme.sys.color.error.default
											: SchmancyTheme.sys.color.primary.default,
									color:
										this.variant === 'danger' ? SchmancyTheme.sys.color.error.on : SchmancyTheme.sys.color.primary.on,
								})}
								@click=${this._handleConfirm}
							>
								${this.confirmText}
							</schmancy-button>
						</div>
					</div>
				</schmancy-surface>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'confirm-dialog': ConfirmDialog
	}
}
