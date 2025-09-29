import { $LitElement } from '@mixins/index'
import { $notify, notify } from '@schmancy/notification'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { of, delay, throwError, from } from 'rxjs'
import { concatMap } from 'rxjs/operators'

/**
 * Demo component for the notification system.
 *
 * @element sch-notification-demo
 */
@customElement('demo-feedback-notifications')
export default class DemoFeedbackNotifications extends $LitElement() {
	@state() private position:
		| 'top-right'
		| 'top-left'
		| 'bottom-right'
		| 'bottom-left'
		| 'top-center'
		| 'bottom-center' = 'top-right'
	@state() private playSound = false

	private showInfo() {
		$notify.info('This is an information message', {
			title: 'Information',
			playSound: false,
		})
	}

	private showSuccess() {
		$notify.success('Operation completed successfully', {
			title: 'Success',
			playSound: this.playSound,
			duration: 500,
		})
	}

	private showWarning() {
		$notify.warning('This action might cause issues', {
			title: 'Warning',
			playSound: this.playSound,
		})
	}

	private showError() {
		$notify.error('An error occurred while processing your request', {
			title: 'Error',
			playSound: this.playSound,
		})
	}

	private showPersistent() {
		$notify.info('This notification will stay until manually closed', {
			title: 'Persistent',
			duration: 0,
			playSound: this.playSound,
		})
	}

	private showNoTitle() {
		$notify.success('This notification has no title', {
			playSound: this.playSound,
		})
	}

	private showNoClose() {
		$notify.warning('This notification cannot be manually closed', {
			title: 'No Close Button',
			closable: false,
			duration: 500,
			playSound: this.playSound,
		})
	}

	private showCustomDuration() {
		$notify.info('This notification will close in 10 seconds', {
			title: 'Custom Duration',
			duration: 10000,
			playSound: this.playSound,
		})
	}

	private showApiProgress() {
		// Basic usage - minimal configuration
		of({ data: 'Success' }).pipe(
			delay(2000),
			notify({
				loadingMessage: 'Fetching data...',
				successMessage: 'Data loaded successfully!',
				errorMessage: 'Failed to load data'
			})
		).subscribe()
	}

	private showApiError() {
		// Error example with custom duration
		throwError(() => new Error('Network timeout')).pipe(
			notify({
				loadingMessage: 'Processing request...',
				successMessage: 'Success!',
				errorMessage: (err) => `Error: ${err.message}`,
				errorDuration: 0 // Persistent error - user must dismiss
			})
		).subscribe({
			error: () => {} // Handle error to prevent uncaught error
		})
	}

	private showFileUpload() {
		// Simulate file upload with progress
		const uploadSteps = [
			{ loaded: 25, total: 100 },
			{ loaded: 50, total: 100 },
			{ loaded: 75, total: 100 },
			{ loaded: 100, total: 100 },
			{ url: 'https://example.com/file.pdf' } // Final result
		]
		
		from(uploadSteps).pipe(
			concatMap(step => of(step).pipe(delay(500))),
			notify({
				loadingMessage: 'Uploading file...',
				loadingType: 'info',
				successMessage: 'Upload complete!',
				successType: 'success',
				successDuration: 3000,
				errorMessage: (err) => `Upload failed: ${err.message}`,
				errorType: 'error',
				errorDuration: 10000
			})
		).subscribe()
	}

	private showCustomDurations() {
		// Example with custom durations for all states
		of({ saved: true }).pipe(
			delay(1000),
			notify({
				loadingMessage: 'Saving changes...',
				successMessage: 'Changes saved!',
				successDuration: 5000, // Success stays for 5 seconds
				errorMessage: 'Failed to save',
				errorDuration: 0 // Error is persistent
			})
		).subscribe()
	}

	private dismissLatest() {
		$notify.dismiss()
	}

	private handlePositionChange(e: Event) {
		const select = e.target as HTMLSelectElement
		this.position = select.value as any
	}

	private handleSoundToggle(e: Event) {
		const checkbox = e.target as HTMLInputElement
		this.playSound = checkbox.checked
	}

	render() {
		return html`
			<div class="p-6">
				<h1 class="text-2xl font-bold mb-6">Notification System Demo</h1>

				<div class="mb-6 grid grid-cols-2 gap-4">
					<div>
						<label class="block mb-2">Notification Position</label>
						<select class="p-2 border rounded" @change=${this.handlePositionChange}>
							<option value="top-right" selected>Top Right</option>
							<option value="top-left">Top Left</option>
							<option value="bottom-right">Bottom Right</option>
							<option value="bottom-left">Bottom Left</option>
							<option value="top-center">Top Center</option>
							<option value="bottom-center">Bottom Center</option>
						</select>
					</div>

					<div>
						<label class="block mb-2">Sound Options</label>
						<label class="flex items-center">
							<input type="checkbox" ?checked=${this.playSound} @change=${this.handleSoundToggle} class="mr-2" />
							Play Notification Sounds
						</label>
					</div>
				</div>

				<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
					<button @click=${this.showInfo} class="p-2 bg-blue-500 text-white rounded">Info</button>

					<button @click=${this.showSuccess} class="p-2 bg-green-500 text-white rounded">Success</button>

					<button @click=${this.showWarning} class="p-2 bg-yellow-500 text-white rounded">Warning</button>

					<button @click=${this.showError} class="p-2 bg-red-500 text-white rounded">Error</button>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
					<button @click=${this.showPersistent} class="p-2 bg-purple-500 text-white rounded">
						Persistent Notification
					</button>

					<button @click=${this.showNoTitle} class="p-2 bg-indigo-500 text-white rounded">No Title</button>

					<button @click=${this.showNoClose} class="p-2 bg-teal-500 text-white rounded">No Close Button</button>

					<button @click=${this.showCustomDuration} class="p-2 bg-pink-500 text-white rounded">
						Custom Duration (10s)
					</button>
				</div>

				<h2 class="text-xl font-bold mb-4">API Integration with notify()</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
					<button @click=${this.showApiProgress} class="p-2 bg-blue-600 text-white rounded">
						Basic API Call (2s delay)
					</button>

					<button @click=${this.showApiError} class="p-2 bg-red-600 text-white rounded">
						API Error (persistent)
					</button>

					<button @click=${this.showFileUpload} class="p-2 bg-green-600 text-white rounded">
						File Upload with Progress
					</button>

					<button @click=${this.showCustomDurations} class="p-2 bg-purple-600 text-white rounded">
						Custom Durations
					</button>
				</div>

				<div class="grid grid-cols-1">
					<button @click=${this.dismissLatest} class="p-2 bg-gray-600 text-white rounded">
						Dismiss Latest Notification
					</button>
				</div>
			</div>

			<sch-notification-container
				.position=${this.position}
				.playSound=${this.playSound}
				.maxVisibleNotifications=${5}
			></sch-notification-container>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-feedback-notifications': DemoFeedbackNotifications
	}
}
