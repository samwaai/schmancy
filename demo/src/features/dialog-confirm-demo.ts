import { $LitElement } from '@mixins/index'
import { $dialog } from '@schmancy/dialog'
import { css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

@customElement('demo-dialog-confirm')
export class DemoDialogConfirm extends $LitElement(css`
	:host {
		display: block;
		padding: 2rem;
	}

	.demo-section {
		margin-bottom: 2rem;
	}

	.button-group {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		margin-top: 1rem;
	}

	.result {
		margin-top: 1rem;
		padding: 1rem;
		border-radius: 0.5rem;
		background: var(--md-sys-color-surface-variant);
		font-family: monospace;
	}
`) {
	@state() lastResult: string = 'No action taken yet'

	private numberFormatter = new Intl.NumberFormat('en-US')

	// Mock transaction data
	private mockTransaction = {
		type: 'purchase',
		quantity: 1234.56,
		date: new Date()
	}

	private getTransactionTypeLabel(transaction: any): string {
		const types: Record<string, string> = {
			purchase: 'purchase',
			sale: 'sale',
			transfer: 'transfer'
		}
		return types[transaction.type] || transaction.type
	}

	private async handleSimpleConfirm() {
		const confirmed = await $dialog.confirm({
			title: 'Confirm Action',
			message: 'Are you sure you want to proceed with this action?',
			confirmText: 'Proceed',
			cancelText: 'Cancel'
		})

		this.lastResult = `Simple confirm: ${confirmed ? 'Confirmed' : 'Cancelled'}`
	}

	private async handleDeleteConfirm() {
		const confirmed = await $dialog.confirm({
			title: 'Delete Transaction',
			message: `Are you sure you want to delete this ${this.getTransactionTypeLabel(this.mockTransaction)} transaction of ${this.numberFormatter.format(this.mockTransaction.quantity)} units? This action cannot be undone.`,
			confirmText: 'Delete',
			cancelText: 'Cancel',
			confirmColor: 'error',
		})

		this.lastResult = `Delete confirm: ${confirmed ? 'Deleted' : 'Cancelled'}`
	}

	private async handleWarningConfirm() {
		const confirmed = await $dialog.confirm({
			title: 'Warning',
			subtitle: 'This action may have consequences',
			message: 'Proceeding will modify important data. Are you sure?',
			confirmText: 'Proceed Anyway',
			cancelText: 'Go Back',
			confirmColor: 'warning',
		})

		this.lastResult = `Warning confirm: ${confirmed ? 'Proceeded' : 'Cancelled'}`
	}

	private async handleSuccessConfirm() {
		const confirmed = await $dialog.confirm({
			title: 'Save Changes',
			message: 'Do you want to save your changes before continuing?',
			confirmText: 'Save',
			cancelText: 'Discard',
			confirmColor: 'success',
		})

		this.lastResult = `Save confirm: ${confirmed ? 'Saved' : 'Discarded'}`
	}

	private async handleDangerVariant() {
		const confirmed = await $dialog.danger({
			title: 'Danger Zone',
			message: 'This is a dangerous action that cannot be undone. Are you absolutely sure?',
			confirmText: 'Yes, I understand',
			cancelText: 'No, take me back',
		})

		this.lastResult = `Danger variant: ${confirmed ? 'Confirmed' : 'Cancelled'}`
	}

	private async handlePositionedConfirm(event: MouseEvent) {
		const confirmed = await $dialog.confirm({
			title: 'Context Menu',
			message: 'This dialog appears at the click position',
			confirmText: 'OK',
			cancelText: 'Cancel',
			position: event
		})

		this.lastResult = `Positioned confirm: ${confirmed ? 'Confirmed' : 'Cancelled'}`
	}

	private async handleCustomWidth() {
		const confirmed = await $dialog.confirm({
			title: 'Wide Dialog',
			message: 'This dialog has a custom width. It can contain more content and longer messages without wrapping as much.',
			confirmText: 'Got it',
			cancelText: 'Cancel',
			width: '500px'
		})

		this.lastResult = `Wide dialog: ${confirmed ? 'Confirmed' : 'Cancelled'}`
	}

	private async handleNoTitle() {
		const confirmed = await $dialog.ask('Are you sure you want to continue?')
		this.lastResult = `Simple ask: ${confirmed ? 'Yes' : 'No'}`
	}

	render() {
		return html`
			<schmancy-surface type="container" rounded="all" elevation="1">
				<div class="p-6">
					<schmancy-typography type="headline" token="lg" class="mb-6">
						Dialog Confirm Examples
					</schmancy-typography>

					<div class="demo-section">
						<schmancy-typography type="title" token="md" class="mb-3">
							Basic Confirmations
						</schmancy-typography>
						<div class="button-group">
							<schmancy-button variant="filled" @click=${this.handleSimpleConfirm}>
								Simple Confirm
							</schmancy-button>
							<schmancy-button variant="filled" @click=${this.handleNoTitle}>
								Quick Ask (No Title)
							</schmancy-button>
							<schmancy-button variant="filled" @click=${this.handleCustomWidth}>
								Custom Width
							</schmancy-button>
						</div>
					</div>

					<div class="demo-section">
						<schmancy-typography type="title" token="md" class="mb-3">
							Colored Confirmations
						</schmancy-typography>
						<div class="button-group">
							<schmancy-button 
								variant="filled" 
								class="bg-red-600 hover:bg-red-700 text-white"
								@click=${this.handleDeleteConfirm}
							>
								Delete (Error Color)
							</schmancy-button>
							<schmancy-button 
								variant="filled" 
								class="bg-orange-600 hover:bg-orange-700 text-white"
								@click=${this.handleWarningConfirm}
							>
								Warning Color
							</schmancy-button>
							<schmancy-button 
								variant="filled" 
								class="bg-green-600 hover:bg-green-700 text-white"
								@click=${this.handleSuccessConfirm}
							>
								Success Color
							</schmancy-button>
						</div>
					</div>

					<div class="demo-section">
						<schmancy-typography type="title" token="md" class="mb-3">
							Special Cases
						</schmancy-typography>
						<div class="button-group">
							<schmancy-button variant="filled" @click=${this.handleDangerVariant}>
								Danger Variant
							</schmancy-button>
							<schmancy-button 
								variant="filled" 
								@click=${this.handlePositionedConfirm}
							>
								Click for Positioned Dialog
							</schmancy-button>
						</div>
					</div>

					<div class="demo-section">
						<schmancy-typography type="title" token="md" class="mb-3">
							Last Result
						</schmancy-typography>
						<div class="result">
							${this.lastResult}
						</div>
					</div>

					<div class="demo-section">
						<schmancy-typography type="title" token="md" class="mb-3">
							Code Example
						</schmancy-typography>
						<schmancy-surface type="containerLow" rounded="all" class="p-4">
							<pre class="text-sm overflow-x-auto"><code>${this.codeExample}</code></pre>
						</schmancy-surface>
					</div>
				</div>
			</schmancy-surface>
		`
	}

	private get codeExample() {
		return `// Basic confirmation
const confirmed = await $dialog.confirm({
  title: 'Delete Transaction',
  message: 'Are you sure you want to delete this transaction?',
  confirmText: 'Delete',
  cancelText: 'Cancel',
  confirmColor: 'error',
})

if (confirmed) {
  // Proceed with deletion
} else {
  // User cancelled
}

// Other color options
confirmColor: 'error'    // Red confirm button
confirmColor: 'warning'  // Orange confirm button  
confirmColor: 'success'  // Green confirm button
confirmColor: 'primary'  // Default blue (or omit)

// Simple ask
const proceed = await $dialog.ask('Continue?')

// Danger variant (deprecated, use confirmColor instead)
const confirmed = await $dialog.danger({
  title: 'Danger',
  message: 'This cannot be undone'
})`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-dialog-confirm': DemoDialogConfirm
	}
}