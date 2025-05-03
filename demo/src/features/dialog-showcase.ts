import { $LitElement } from '@mixins/index'
import '@schmancy/button'
import { $dialog } from '@schmancy/dialog'
import '@schmancy/form'
import '@schmancy/input'
import '@schmancy/surface'
import '@schmancy/tabs'
import '@schmancy/typography'
import { css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

@customElement('demo-dialog-showcase')
export class DemoDialogShowcase extends $LitElement(css`
	:host {
		display: block;
	}

	.component-demo {
		display: flex;
		flex-direction: column;
		gap: 32px;
		margin-top: 24px;
	}

	.example-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
		margin-bottom: 32px;
	}

	.code-preview {
		background-color: #f8fafc;
		border-radius: 8px;
		padding: 16px;
		font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
		font-size: 14px;
		line-height: 1.5;
		white-space: pre-wrap;
		overflow-x: auto;
		max-height: 400px;
		overflow-y: auto;
		border: 1px solid #e2e8f0;
	}

	.demo-preview {
		padding: 24px;
		background-color: white;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		gap: 16px;
		border: 1px solid #e2e8f0;
	}

	.copy-button {
		margin-top: 8px;
		font-size: 12px;
		padding: 4px 8px;
		background-color: #e2e8f0;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	.copy-button:hover {
		background-color: #cbd5e1;
	}

	.tab-container {
		margin-top: 16px;
	}

	.example-description {
		margin-bottom: 16px;
	}

	.tabs-container {
		margin-bottom: 24px;
	}

	/* For the fancy dialog example */
	.profile-card {
		display: flex;
		flex-direction: column;
		width: 100%;
		background-color: white;
		border-radius: 8px;
		overflow: hidden;
	}

	.card-header {
		display: flex;
		align-items: center;
		padding: 16px;
		border-bottom: 1px solid #e5e7eb;
	}

	.avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background-color: #6366f1;
		margin-right: 16px;
	}

	.user-info h3 {
		margin: 0;
		font-size: 18px;
		font-weight: 600;
	}

	.user-info p {
		margin: 4px 0 0;
		color: #6b7280;
		font-size: 14px;
	}

	.card-body {
		padding: 16px;
	}

	.stats {
		display: flex;
		justify-content: space-around;
		margin-top: 16px;
		text-align: center;
	}

	.stat {
		display: flex;
		flex-direction: column;
	}

	.value {
		font-size: 20px;
		font-weight: 600;
		color: #4f46e5;
	}

	.label {
		font-size: 14px;
		color: #6b7280;
	}

	.card-footer {
		padding: 16px;
		display: flex;
		justify-content: flex-end;
		gap: 8px;
		border-top: 1px solid #e5e7eb;
	}

	/* For the form dialog example */
	.form-field {
		margin-bottom: 16px;
	}

	.form-field label {
		display: block;
		margin-bottom: 4px;
		font-size: 14px;
		font-weight: 500;
		color: #374151;
	}

	.form-field input {
		width: 100%;
		padding: 8px 12px;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		font-size: 14px;
	}

	.form-field.checkbox {
		display: flex;
		align-items: center;
	}

	.form-field.checkbox input {
		width: auto;
		margin-right: 8px;
	}

	.form-field.checkbox label {
		margin-bottom: 0;
	}

	/* Animation for button loading state */
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.loading {
		position: relative;
		color: transparent !important;
	}

	.loading::after {
		content: '';
		position: absolute;
		width: 14px;
		height: 14px;
		top: calc(50% - 7px);
		left: calc(50% - 7px);
		border: 2px solid transparent;
		border-top-color: currentColor;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}
`) {
	@state() private activeTab = 'basic'
	@state() private formSubmitting = false
	@state() private formErrorMessage = ''
	@state() private formEmail = ''

	// Basic Dialog Example
	private basicDialogCode = `import { $dialog } from '@schmancy/dialog';

// Basic dialog with title, subtitle, message, and buttons
$dialog.confirm({
  title: 'Basic Dialog',
  subtitle: 'This is a subtitle with additional context',
  message: 'This is a basic confirmation dialog with title, subtitle, and buttons.',
  confirmText: 'Confirm',
  cancelText: 'Cancel'
}).then(result => {
  console.log('Dialog result:', result);
});
`

	// Custom Component Dialog
	private customDialogCode = `import { html } from 'lit';
import { $dialog } from '@schmancy/dialog';

// Create a custom component dialog with rich styling
$dialog.component(html\`
  <div class="profile-card">
    <div class="card-header">
      <div class="avatar"></div>
      <div class="user-info">
        <h3>John Doe</h3>
        <p>Software Engineer</p>
      </div>
    </div>
    
    <div class="card-body">
      <p>This dialog demonstrates a completely custom component with styling.</p>
      <div class="stats">
        <div class="stat">
          <span class="value">42</span>
          <span class="label">Projects</span>
        </div>
        <div class="stat">
          <span class="value">1.5k</span>
          <span class="label">Followers</span>
        </div>
        <div class="stat">
          <span class="value">120</span>
          <span class="label">Following</span>
        </div>
      </div>
    </div>
    
    <div class="card-footer">
      <schmancy-button variant="outlined" @click=\${() => $dialog.dismiss()}>Close</schmancy-button>
      <schmancy-button variant="filled">View Profile</schmancy-button>
    </div>
  </div>
\`, { width: '400px' });
`

	// Form Dialog Example
	private formDialogCode = `import { html } from 'lit';
import { $dialog } from '@schmancy/dialog';

// State variables
let isSubmitting = false;
let errorMessage = '';
let emailValue = '';

// Mock API function
const mockSubmit = async (email) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, email });
    }, 1500);
  });
};

// Create a form dialog
const formDialog = () => {
  return html\`
    <div class="form-container">
      <h2>Subscribe to Newsletter</h2>
      <p>Get the latest updates directly to your inbox</p>
      
      <form id="subscribeForm" @submit=\${handleSubmit}>
        <div class="form-field \${errorMessage ? 'has-error' : ''}">
          <label for="email">Email Address</label>
          <input 
            type="email" 
            id="email" 
            placeholder="your@email.com"
            .value=\${emailValue}
            @input=\${(e) => { 
              emailValue = e.target.value;
              errorMessage = '';
              // Force re-render
              updateDialog();
            }}
            ?disabled=\${isSubmitting}
            required
          />
          \${errorMessage ? html\`<div class="error-message">\${errorMessage}</div>\` : ''}
        </div>
        
        <div class="form-field checkbox">
          <input type="checkbox" id="terms" required />
          <label for="terms">I agree to the terms and conditions</label>
        </div>
        
        <div class="form-actions">
          <button 
            type="button" 
            @click=\${() => $dialog.dismiss()}
            ?disabled=\${isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit"
            class="\${isSubmitting ? 'loading' : ''}" 
            ?disabled=\${isSubmitting}
          >
            \${isSubmitting ? 'Submitting...' : 'Subscribe'}
          </button>
        </div>
      </form>
    </div>
  \`;
};

// Handler for form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!emailValue) {
    errorMessage = 'Email is required';
    updateDialog();
    return;
  }
  
  // Show loading state
  isSubmitting = true;
  updateDialog();
  
  try {
    // Submit form data
    const result = await mockSubmit(emailValue);
    
    if (result.success) {
      // Show success message
      $dialog.dismiss();
      setTimeout(() => {
        $dialog.confirm({
          title: 'Success!',
          message: \`Thank you for subscribing with \${result.email}. We've sent you a confirmation email.\`,
          confirmText: 'OK',
          cancelText: '',
        });
      }, 0);
    }
  } catch (error) {
    // Show error
    isSubmitting = false;
    errorMessage = 'An error occurred. Please try again.';
    updateDialog();
  }
};

// Helper function to update the dialog
const updateDialog = () => {
  $dialog.dismiss();
  setTimeout(() => {
    $dialog.component(formDialog(), { width: '400px' });
  }, 0);
};

// Open the dialog
$dialog.component(formDialog(), { width: '400px' });
`

	// Stacked Dialogs Example
	private stackedDialogCode = `import { $dialog } from '@schmancy/dialog';

// First dialog
$dialog.confirm({
  title: 'First Dialog',
  message: 'This is the first dialog in the stack.',
  confirmText: 'Open Second Dialog',
  cancelText: 'Cancel'
}).then(result => {
  if (result) {
    // Second dialog
    $dialog.confirm({
      title: 'Second Dialog',
      subtitle: 'Stacked on top of the first one',
      message: 'This is the second dialog, stacked on top of the first one.',
      confirmText: 'Open Third Dialog',
      cancelText: 'Go Back'
    }).then(result => {
      if (result) {
        // Third dialog
        $dialog.confirm({
          title: 'Third Dialog',
          subtitle: 'The deepest level',
          message: 'This is the third dialog in the stack. Notice how dialogs are managed and layered properly.',
          confirmText: 'Complete',
          cancelText: 'Go Back'
        }).then(result => {
          if (result) {
            // Final confirmation
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
});
`

	private getCodeForTab() {
		switch (this.activeTab) {
			case 'basic':
				return this.basicDialogCode
			case 'custom':
				return this.customDialogCode
			case 'form':
				return this.formDialogCode
			case 'stacked':
				return this.stackedDialogCode
			default:
				return this.basicDialogCode
		}
	}

	private handleTabChange(tab: string) {
		this.activeTab = tab
	}

	private copyCode() {
		const code = this.getCodeForTab()
		navigator.clipboard
			.writeText(code)
			.then(() => {
				const copyButton = this.shadowRoot?.querySelector('.copy-button')
				if (copyButton) {
					copyButton.textContent = 'Copied!'
					setTimeout(() => {
						copyButton.textContent = 'Copy code'
					}, 2000)
				}
			})
			.catch(err => {
				console.error('Failed to copy: ', err)
			})
	}

	// Demo functions
	private openBasicDialog() {
		$dialog
			.confirm({
				title: 'Basic Dialog',
				message: 'This is a basic confirmation dialog with title, subtitle, and buttons.',
				confirmText: 'Confirm',
				cancelText: 'Cancel',
			})
			.then(result => {
				console.log('Dialog result:', result)
			})
	}

	private openCustomDialog() {
		$dialog.component(
			html`
				<div class="profile-card">
					<div class="card-header">
						<div class="avatar"></div>
						<div class="user-info">
							<h3>John Doe</h3>
							<p>Software Engineer</p>
						</div>
					</div>

					<div class="card-body">
						<p>This dialog demonstrates a completely custom component with styling.</p>
						<div class="stats">
							<div class="stat">
								<span class="value">42</span>
								<span class="label">Projects</span>
							</div>
							<div class="stat">
								<span class="value">1.5k</span>
								<span class="label">Followers</span>
							</div>
							<div class="stat">
								<span class="value">120</span>
								<span class="label">Following</span>
							</div>
						</div>
					</div>

					<div class="card-footer">
						<schmancy-button variant="outlined" @click=${() => $dialog.dismiss()}>Close</schmancy-button>
						<schmancy-button variant="filled">View Profile</schmancy-button>
					</div>
				</div>
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
			<div style="padding: 24px;">
				<h2 style="margin: 0 0 8px; font-size: 20px; font-weight: 600;">Subscribe to Newsletter</h2>
				<p style="margin: 0 0 20px; color: #6b7280; font-size: 14px;">Get the latest updates directly to your inbox</p>

				<form id="subscribeForm" @submit=${this.handleFormSubmit}>
					<div class="form-field ${this.formErrorMessage ? 'has-error' : ''}">
						<label for="email">Email Address</label>
						<input
							type="email"
							id="email"
							placeholder="your@email.com"
							.value=${this.formEmail}
							@input=${(e: any) => {
								this.formEmail = e.target.value
								this.formErrorMessage = ''
								this.updateFormDialog()
							}}
							?disabled=${this.formSubmitting}
							required
						/>
						${this.formErrorMessage
							? html`<div style="color: #ef4444; font-size: 12px; margin-top: 4px;">${this.formErrorMessage}</div>`
							: ''}
					</div>

					<div class="form-field checkbox">
						<input type="checkbox" id="terms" required />
						<label for="terms">I agree to the terms and conditions</label>
					</div>

					<div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 24px;">
						<schmancy-button variant="outlined" @click=${() => $dialog.dismiss()} ?disabled=${this.formSubmitting}>
							Cancel
						</schmancy-button>
						<schmancy-button
							variant="filled"
							class="${this.formSubmitting ? 'loading' : ''}"
							type="submit"
							?disabled=${this.formSubmitting}
						>
							${this.formSubmitting ? 'Submitting...' : 'Subscribe'}
						</schmancy-button>
					</div>
				</form>
			</div>
		`

		$dialog.component(formDialog(), { width: '400px' })
	}

	private updateFormDialog() {
		$dialog.dismiss()
		setTimeout(() => {
			this.openFormDialog()
		}, 0)
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

	private openStackedDialogs() {
		// First dialog
		$dialog
			.confirm({
				title: 'First Dialog',
				message: 'This is the first dialog in the stack.',
				confirmText: 'Open Second Dialog',
				cancelText: 'Cancel',
			})
			.then(result => {
				if (result) {
					// Second dialog
					$dialog
						.confirm({
							title: 'Second Dialog',
							message: 'This is the second dialog, stacked on top of the first one.',
							confirmText: 'Open Third Dialog',
							cancelText: 'Go Back',
						})
						.then(result => {
							if (result) {
								// Third dialog
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
											// Final confirmation
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
			<schmancy-surface type="container" fill="all" rounded="left" class="p-4">
				<schmancy-typography type="headline" token="md">Dialog Component Showcase</schmancy-typography>
				<schmancy-typography type="subtitle" token="sm" class="mt-2 mb-6">
					Explore different dialog patterns with code examples
				</schmancy-typography>

				<div class="tabs-container">
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

				<div class="example-description">
					${this.activeTab === 'basic'
						? html`
								<p>
									A simple dialog with title, subtitle, message, and standard buttons. Shows how to use the basic dialog
									API with the new subtitle feature.
								</p>
							`
						: this.activeTab === 'custom'
							? html`
									<p>
										A fully custom component dialog with profile card styling. Demonstrates how to create rich, custom
										UI within dialogs.
									</p>
								`
							: this.activeTab === 'form'
								? html`
										<p>
											An interactive form dialog with validation, loading states, and dynamic content. Shows how to
											handle complex user interactions.
										</p>
									`
								: html`
										<p>
											Demonstrates stacked dialogs that open on top of each other, creating a multi-step flow with
											proper layering.
										</p>
									`}
				</div>

				<div class="example-container">
					<div>
						<div class="code-preview">
							<pre><code>${this.getCodeForTab()}</code></pre>
						</div>
						<button class="copy-button" @click=${this.copyCode}>Copy code</button>
					</div>

					<div class="demo-preview">
						<schmancy-typography type="subtitle" token="md" class="mb-2">Live Demo</schmancy-typography>
						<p>Click the button below to see this dialog pattern in action:</p>

						${this.activeTab === 'basic'
							? html`
									<schmancy-button variant="filled" @click=${this.openBasicDialog}>Open Basic Dialog</schmancy-button>
								`
							: this.activeTab === 'custom'
								? html`
										<schmancy-button variant="filled" @click=${this.openCustomDialog}
											>Open Custom Component Dialog</schmancy-button
										>
									`
								: this.activeTab === 'form'
									? html`
											<schmancy-button variant="filled" @click=${this.openFormDialog}>Open Form Dialog</schmancy-button>
										`
									: html`
											<schmancy-button variant="filled" @click=${this.openStackedDialogs}
												>Open Stacked Dialogs</schmancy-button
											>
										`}
					</div>
				</div>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-dialog-showcase': DemoDialogShowcase
	}
}
