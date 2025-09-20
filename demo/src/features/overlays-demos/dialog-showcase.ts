import { $LitElement } from '@mixins/index'
import '@schmancy/button'
import { $dialog } from '@schmancy/dialog'
import '@schmancy/form'
import '@schmancy/input'
import '@schmancy/surface'
import '@schmancy/tabs'
import '@schmancy/typography'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

@customElement('overlays-dialog-showcase')
export default class OverlaysDialogShowcase extends $LitElement() {
	@state() private activeTab = 'basic'
	@state() private formSubmitting = false
	@state() private formErrorMessage = ''
	@state() private formEmail = ''

	// Example code snippets
	private codeSnippets = {
		basic: `import { $dialog } from '@schmancy/dialog';

$dialog.confirm({
  title: 'Basic Dialog',
  subtitle: 'This is a subtitle with additional context',
  message: 'This is a basic confirmation dialog with title, subtitle, and buttons.',
  confirmText: 'Confirm',
  cancelText: 'Cancel'
}).then(result => {
});`,

		custom: `import { html } from 'lit';
import { $dialog } from '@schmancy/dialog';

$dialog.component(html\`
  <schmancy-surface rounded="all" class="p-0 overflow-hidden w-full">
    <div class="flex items-center p-4 border-b border-gray-200">
      <div class="w-12 h-12 rounded-full bg-primary-400 mr-4"></div>
      <div>
        <schmancy-typography type="title" token="md">John Doe</schmancy-typography>
        <schmancy-typography type="body" token="sm" class="text-gray-500">Software Engineer</schmancy-typography>
      </div>
    </div>

    <div class="p-4">
      <schmancy-typography type="body" token="md">This dialog demonstrates a custom component with Schmancy UI.</schmancy-typography>

      <div class="flex justify-around mt-4 text-center">
        <div class="flex flex-col">
          <schmancy-typography type="title" token="lg" class="text-primary-500">42</schmancy-typography>
          <schmancy-typography type="body" token="sm" class="text-gray-500">Projects</schmancy-typography>
        </div>
        <div class="flex flex-col">
          <schmancy-typography type="title" token="lg" class="text-primary-500">1.5k</schmancy-typography>
          <schmancy-typography type="body" token="sm" class="text-gray-500">Followers</schmancy-typography>
        </div>
        <div class="flex flex-col">
          <schmancy-typography type="title" token="lg" class="text-primary-500">120</schmancy-typography>
          <schmancy-typography type="body" token="sm" class="text-gray-500">Following</schmancy-typography>
        </div>
      </div>
    </div>

    <div class="p-4 flex justify-end gap-2 border-t border-gray-200">
      <schmancy-button variant="outlined" @click=\${() => $dialog.dismiss()}>Close</schmancy-button>
      <schmancy-button variant="filled">View Profile</schmancy-button>
    </div>
  </schmancy-surface>
\`, { width: '400px' });`,

		form: `import { html } from 'lit';
import { $dialog } from '@schmancy/dialog';

// State variables and update function setup...

const formDialog = () => html\`
  <schmancy-surface rounded="all" class="p-5 max-w-md mx-auto">
    <schmancy-typography type="title" token="lg" class="mb-1">Subscribe to Newsletter</schmancy-typography>
    <schmancy-typography type="body" token="sm" class="text-gray-500 mb-4">
      Get the latest updates directly to your inbox
    </schmancy-typography>

    <schmancy-form @submit=\${handleSubmit}>
      <div class="mb-4">
        <schmancy-input
          label="Email Address"
          type="email"
          placeholder="your@email.com"
          .value=\${emailValue}
          @input=\${updateEmail}
          ?disabled=\${isSubmitting}
          required
          ?error=\${!!errorMessage}
          error-text=\${errorMessage}
        ></schmancy-input>
      </div>

      <div class="flex items-center mb-4">
        <input type="checkbox" id="terms" required class="mr-2" />
        <label for="terms" class="text-sm">I agree to the terms and conditions</label>
      </div>

      <div class="flex justify-end gap-2">
        <schmancy-button
          variant="outlined"
          @click=\${() => $dialog.dismiss()}
          ?disabled=\${isSubmitting}
        >
          Cancel
        </schmancy-button>
        <schmancy-button
          variant="filled"
          type="submit"
          ?loading=\${isSubmitting}
        >
          \${isSubmitting ? 'Submitting...' : 'Subscribe'}
        </schmancy-button>
      </div>
    </schmancy-form>
  </schmancy-surface>
\`;

// Open the dialog
$dialog.component(formDialog(), { width: '400px' });`,

		stacked: `import { $dialog } from '@schmancy/dialog';

// Show a sequence of stacked dialogs
$dialog.confirm({
  title: 'First Dialog',
  message: 'This is the first dialog in the stack.',
  confirmText: 'Open Second Dialog',
  cancelText: 'Cancel'
}).then(result => {
  if (result) {
    $dialog.confirm({
      title: 'Second Dialog',
      subtitle: 'Stacked on top of the first one',
      message: 'This is the second dialog, stacked on top of the first one.',
      confirmText: 'Open Third Dialog',
      cancelText: 'Go Back'
    }).then(result => {
      if (result) {
        $dialog.confirm({
          title: 'Third Dialog',
          subtitle: 'The deepest level',
          message: 'This is the third dialog in the stack. Notice how dialogs are managed and layered properly.',
          confirmText: 'Complete',
          cancelText: 'Go Back'
        }).then(result => {
          if (result) {
            $dialog.confirm({
              title: 'Success!',
              message: 'You have successfully navigated through all the dialog layers.',
              confirmText: 'Great!',
              cancelText: ''
            });
          }
        });
      }
    });
  }
});`,
	}

	private descriptions = {
		basic:
			'A simple dialog with title, subtitle, message, and standard buttons. Shows how to use the basic dialog API with the new subtitle feature.',
		custom:
			'A fully custom component dialog built with Schmancy UI components. Demonstrates how to create rich, custom UI within dialogs.',
		form: 'An interactive form dialog with validation, loading states, and dynamic content. Shows how to handle complex user interactions.',
		stacked:
			'Demonstrates stacked dialogs that open on top of each other, creating a multi-step flow with proper layering.',
	}

	private handleTabChange(tab: string) {
		this.activeTab = tab
	}

	private copyCode() {
		navigator.clipboard.writeText(this.codeSnippets[this.activeTab]).then(() => {
			const copyButton = this.shadowRoot?.querySelector('.copy-button')
			if (copyButton) {
				copyButton.textContent = 'Copied!'
				setTimeout(() => {
					copyButton.textContent = 'Copy code'
				}, 2000)
			}
		})
	}

	// Dialog demos
	private openBasicDialog() {
		$dialog
			.confirm({
				title: 'Basic Dialog',
				message: 'This is a basic confirmation dialog with title, subtitle, and buttons.',
				confirmText: 'Confirm',
				cancelText: 'Cancel',
			})
			.then(result => {
			})
	}

	private openCustomDialog() {
		$dialog.component(
			html`
				<schmancy-surface rounded="all" class="p-0 overflow-hidden w-full">
					<div class="flex items-center p-4 border-b border-gray-200">
						<div class="w-12 h-12 rounded-full bg-primary-400 mr-4"></div>
						<div>
							<schmancy-typography type="title" token="md">John Doe</schmancy-typography>
							<schmancy-typography type="body" token="sm" class="text-gray-500">Software Engineer</schmancy-typography>
						</div>
					</div>

					<div class="p-4">
						<schmancy-typography type="body" token="md"
							>This dialog demonstrates a custom component with Schmancy UI.</schmancy-typography
						>

						<div class="flex justify-around mt-4 text-center">
							<div class="flex flex-col">
								<schmancy-typography type="title" token="lg" class="text-primary-500">42</schmancy-typography>
								<schmancy-typography type="body" token="sm" class="text-gray-500">Projects</schmancy-typography>
							</div>
							<div class="flex flex-col">
								<schmancy-typography type="title" token="lg" class="text-primary-500">1.5k</schmancy-typography>
								<schmancy-typography type="body" token="sm" class="text-gray-500">Followers</schmancy-typography>
							</div>
							<div class="flex flex-col">
								<schmancy-typography type="title" token="lg" class="text-primary-500">120</schmancy-typography>
								<schmancy-typography type="body" token="sm" class="text-gray-500">Following</schmancy-typography>
							</div>
						</div>
					</div>

					<div class="p-4 flex justify-end gap-2 border-t border-gray-200">
						<schmancy-button variant="outlined" @click=${() => $dialog.dismiss()}>Close</schmancy-button>
						<schmancy-button variant="filled">View Profile</schmancy-button>
					</div>
				</schmancy-surface>
			`,
			{ width: '400px' },
		)
	}

	private async openFormDialog() {
		// Reset form state
		this.formSubmitting = false
		this.formErrorMessage = ''
		this.formEmail = ''

		const formDialog = () => html`
			<schmancy-surface rounded="all" class="p-5 max-w-md mx-auto">
				<schmancy-typography type="title" token="lg" class="mb-1">Subscribe to Newsletter</schmancy-typography>
				<schmancy-typography type="body" token="sm" class="text-gray-500 mb-4">
					Get the latest updates directly to your inbox
				</schmancy-typography>

				<form @submit=${this.handleFormSubmit}>
					<div class="mb-4">
						<schmancy-input
							label="Email Address"
							type="email"
							placeholder="your@email.com"
							.value=${this.formEmail}
							@input=${(e: any) => {
								this.formEmail = e.target.value
								this.formErrorMessage = ''
							}}
							?disabled=${this.formSubmitting}
							required
							?error=${!!this.formErrorMessage}
							error-text=${this.formErrorMessage || ''}
						></schmancy-input>
					</div>

					<div class="flex items-center mb-4">
						<input type="checkbox" id="terms" required class="mr-2" />
						<label for="terms" class="text-sm">I agree to the terms and conditions</label>
					</div>

					<div class="flex justify-end gap-2">
						<schmancy-button variant="outlined" @click=${() => $dialog.dismiss()} ?disabled=${this.formSubmitting}>
							Cancel
						</schmancy-button>
						<schmancy-button variant="filled" type="submit" ?loading=${this.formSubmitting}>
							${this.formSubmitting ? 'Submitting...' : 'Subscribe'}
						</schmancy-button>
					</div>
				</form>
			</schmancy-surface>
		`

		$dialog.component(formDialog(), { width: '400px' })
	}

	private async handleFormSubmit(e: Event) {
		e.preventDefault()

		if (!this.formEmail) {
			this.formErrorMessage = 'Email is required'
			this.updateFormDialog()
			return
		}

		// Show loading state
		this.formSubmitting = true
		this.updateFormDialog()

		try {
			// Mock API call
			await new Promise(resolve => setTimeout(resolve, 1500))

			// Show success message
			$dialog.dismiss()
			setTimeout(() => {
				$dialog.confirm({
					title: 'Success!',
					message: `Thank you for subscribing with ${this.formEmail}. We've sent you a confirmation email.`,
					confirmText: 'OK',
					cancelText: '',
				})
			}, 0)
		} catch (error) {
			// Show error
			this.formSubmitting = false
			this.formErrorMessage = 'An error occurred. Please try again.'
			this.updateFormDialog()
		}
	}

	private updateFormDialog() {
		$dialog.dismiss()
		setTimeout(() => {
			this.openFormDialog()
		}, 0)
	}

	private openStackedDialogs() {
		$dialog
			.confirm({
				title: 'First Dialog',
				message: 'This is the first dialog in the stack.',
				confirmText: 'Open Second Dialog',
				cancelText: 'Cancel',
			})
			.then(result => {
				if (result) {
					$dialog
						.confirm({
							title: 'Second Dialog',
							message: 'This is the second dialog, stacked on top of the first one.',
							confirmText: 'Open Third Dialog',
							cancelText: 'Go Back',
						})
						.then(result => {
							if (result) {
								$dialog
									.confirm({
										title: 'Third Dialog',
										message:
											'This is the third dialog in the stack. Notice how dialogs are managed and layered properly.',
										confirmText: 'Complete',
										cancelText: 'Go Back',
									})
									.then(result => {
										if (result) {
											$dialog.confirm({
												title: 'Success!',
												message: 'You have successfully navigated through all the dialog layers.',
												confirmText: 'Great!',
												cancelText: '',
											})
										}
									})
							}
						})
				}
			})
	}

	render() {
		return html`
			<schmancy-surface type="container" rounded="left" class="p-6">
				<schmancy-typography type="headline" token="md" class="mb-1">Dialog Component Showcase</schmancy-typography>
				<schmancy-typography type="subtitle" token="sm" class="text-gray-600 mb-6">
					Explore different dialog patterns with code examples
				</schmancy-typography>

				<div class="mb-6">
					<schmancy-tabs-group
						activeTab=${this.activeTab}
						@tab-changed=${(e: CustomEvent) => this.handleTabChange(e.detail)}
					>
						<schmancy-tab value="basic" label="Basic Dialog" ?active=${this.activeTab === 'basic'}>
							Basic Dialog
						</schmancy-tab>
						<schmancy-tab value="custom" label="Custom Component" ?active=${this.activeTab === 'custom'}>
							Custom Component
						</schmancy-tab>
						<schmancy-tab value="form" label="Form Dialog" ?active=${this.activeTab === 'form'}>
							Form Dialog
						</schmancy-tab>
						<schmancy-tab value="stacked" label="Stacked Dialogs" ?active=${this.activeTab === 'stacked'}>
							Stacked Dialogs
						</schmancy-tab>
					</schmancy-tabs-group>
				</div>

				<schmancy-typography type="body" token="md" class="mb-6">
					${this.descriptions[this.activeTab]}
				</schmancy-typography>

				<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
					<div>
						<schmancy-surface rounded="all" class="p-4 h-full flex flex-col">
							<div class="mb-2 flex justify-between items-center">
								<schmancy-typography type="subtitle" token="md">Code Example</schmancy-typography>
								<schmancy-button variant="text" size="sm" class="copy-button" @click=${this.copyCode}>
									Copy code
								</schmancy-button>
							</div>
							<div class="bg-gray-50 p-4 rounded overflow-auto font-mono text-sm flex-grow">
								<pre><code>${this.codeSnippets[this.activeTab]}</code></pre>
							</div>
						</schmancy-surface>
					</div>

					<div>
						<schmancy-surface rounded="all" class="p-4 h-full">
							<schmancy-typography type="subtitle" token="md" class="mb-4">Live Demo</schmancy-typography>
							<schmancy-typography type="body" token="sm" class="mb-4">
								Click the button below to see this dialog pattern in action:
							</schmancy-typography>

							${this.activeTab === 'basic'
								? html`
										<schmancy-button variant="filled" @click=${this.openBasicDialog}>
											Open Basic Dialog
										</schmancy-button>
									`
								: this.activeTab === 'custom'
									? html`
											<schmancy-button variant="filled" @click=${this.openCustomDialog}>
												Open Custom Component Dialog
											</schmancy-button>
										`
									: this.activeTab === 'form'
										? html`
												<schmancy-button variant="filled" @click=${this.openFormDialog}>
													Open Form Dialog
												</schmancy-button>
											`
										: html`
												<schmancy-button variant="filled" @click=${this.openStackedDialogs}>
													Open Stacked Dialogs
												</schmancy-button>
											`}
						</schmancy-surface>
					</div>
				</div>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'overlays-dialog-showcase': OverlaysDialogShowcase
	}
}