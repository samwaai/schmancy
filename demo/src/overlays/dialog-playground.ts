import { $LitElement } from '@mhmo91/schmancy/mixins'
import '@mhmo91/schmancy/button'
import '@mhmo91/schmancy/form'
import '@mhmo91/schmancy/input'
import '@mhmo91/schmancy/surface'
import '@mhmo91/schmancy/tabs'
import '@mhmo91/schmancy/typography'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

@customElement('demo-dialog-playground')
export class DemoDialogPlayground extends $LitElement() {
	@state() private activeExample = 'basic'

	private examples = {
		basic: {
			title: 'Basic Dialog',
			description: 'A simple dialog with title, subtitle, message, and standard buttons.',
			code: `import { $dialog } from '@mhmo91/schmancy/dialog';

// Basic dialog with title, subtitle, message, and buttons
function openBasicDialog() {
  $dialog.confirm({
    title: 'Basic Dialog',
    subtitle: 'This is a subtitle with additional context',
    message: 'This is a basic confirmation dialog with title, subtitle, and buttons.',
    confirmText: 'Confirm',
    cancelText: 'Cancel'
  }).then(result => {
  });
}

// Button to trigger dialog
const button = document.createElement('schmancy-button');
button.setAttribute('variant', 'filled');
button.textContent = 'Open Basic Dialog';
button.addEventListener('click', openBasicDialog);
document.body.appendChild(button);`,
		},
		custom: {
			title: 'Custom Component Dialog',
			description: 'A custom dialog with rich UI components and styling using Schmancy components.',
			code: `import { html } from 'lit';
import { $dialog } from '@mhmo91/schmancy/dialog';

// Function to open a custom component dialog
function openCustomDialog() {
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
  \`, { width: '400px' });
}

// Button to trigger dialog
const button = document.createElement('schmancy-button');
button.setAttribute('variant', 'filled');
button.textContent = 'Open Custom Component Dialog';
button.addEventListener('click', openCustomDialog);
document.body.appendChild(button);`,
		},
		form: {
			title: 'Form Dialog',
			description: 'An interactive form dialog with validation, loading states, and dynamic content.',
			code: `import { html } from 'lit';
import { $dialog } from '@mhmo91/schmancy/dialog';

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
    openFormDialog();
  }, 0);
};

// Create a form dialog
function openFormDialog() {
  $dialog.component(html\`
    <schmancy-surface rounded="all" class="p-5 max-w-md mx-auto">
      <schmancy-typography type="title" token="lg" class="mb-1">Subscribe to Newsletter</schmancy-typography>
      <schmancy-typography type="body" token="sm" class="text-gray-500 mb-4">
        Get the latest updates directly to your inbox
      </schmancy-typography>
      
      <form @submit=\${handleSubmit}>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium mb-1">Email Address</label>
          <input 
            type="email" 
            id="email" 
            class="w-full p-2 border rounded \${errorMessage ? 'border-red-500' : 'border-gray-300'}" 
            placeholder="your@email.com"
            .value=\${emailValue}
            @input=\${(e) => { 
              emailValue = e.target.value;
              errorMessage = '';
            }}
            ?disabled=\${isSubmitting}
            required
          />
          \${errorMessage ? html\`<div class="text-red-500 text-sm mt-1">\${errorMessage}</div>\` : ''}
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
            class="\${isSubmitting ? 'opacity-75' : ''}"
            ?disabled=\${isSubmitting}
          >
            \${isSubmitting ? 'Submitting...' : 'Subscribe'}
          </schmancy-button>
        </div>
      </form>
    </schmancy-surface>
  \`, { width: '400px' });
}

// Button to trigger dialog
const button = document.createElement('schmancy-button');
button.setAttribute('variant', 'filled');
button.textContent = 'Open Form Dialog';
button.addEventListener('click', openFormDialog);
document.body.appendChild(button);`,
		},
		stacked: {
			title: 'Stacked Dialogs',
			description: 'A series of stacked dialogs that open on top of each other, creating a multi-step flow.',
			code: `import { $dialog } from '@mhmo91/schmancy/dialog';

// Function to demonstrate stacked dialogs
function openStackedDialogs() {
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
}

// Button to trigger stacked dialogs
const button = document.createElement('schmancy-button');
button.setAttribute('variant', 'filled');
button.textContent = 'Open Stacked Dialogs';
button.addEventListener('click', openStackedDialogs);
document.body.appendChild(button);`,
		},
	}

	private handleChangeExample(e: Event) {
		const select = e.target as HTMLSelectElement
		if (select) {
			this.activeExample = select.value
		}
	}

	private getExampleCode() {
		return this.examples[this.activeExample]?.code || ''
	}

	private copyCode() {
		const code = this.getExampleCode()
		navigator.clipboard.writeText(code).then(() => {
			const copyButton = this.shadowRoot?.querySelector('.copy-button')
			if (copyButton instanceof HTMLElement) {
				copyButton.textContent = 'Copied!'
				setTimeout(() => {
					copyButton.textContent = 'Copy Code'
				}, 2000)
			}
		})
	}

	// Run button directly triggers the dialog example based on active selection
	private runExample() {
		// Execute the appropriate dialog example based on the active tab
		switch (this.activeExample) {
			case 'basic':
				this.runBasicDialog()
				break
			case 'custom':
				this.runCustomDialog()
				break
			case 'form':
				this.runFormDialog()
				break
			case 'stacked':
				this.runStackedDialogs()
				break
		}
	}

	// Example implementations
	private runBasicDialog() {
		import('@mhmo91/schmancy/dialog').then(module => {
			const $dialog = module.$dialog
			$dialog
				.confirm({
					title: 'Basic Dialog',
					message: 'This is a basic confirmation dialog with title, subtitle, and buttons.',
					confirmText: 'Confirm',
					cancelText: 'Cancel',
				})
				.then(() => {
				})
		})
	}

	private runCustomDialog() {
		import('@mhmo91/schmancy/dialog').then(module => {
			const $dialog = module.$dialog
			$dialog.component(
				html`
					<schmancy-surface rounded="all" class="p-0 overflow-hidden w-full">
						<div class="flex items-center p-4 border-b border-gray-200">
							<div class="w-12 h-12 rounded-full bg-primary-400 mr-4"></div>
							<div>
								<schmancy-typography type="title" token="md">John Doe</schmancy-typography>
								<schmancy-typography type="body" token="sm" class="text-gray-500"
									>Software Engineer</schmancy-typography
								>
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
		})
	}

	// State variables for form dialog
	private formDialogSubmitting = false
	private formDialogErrorMessage = ''
	private formDialogEmail = ''

	private runFormDialog() {
		// Reset form state
		this.formDialogSubmitting = false
		this.formDialogErrorMessage = ''
		this.formDialogEmail = ''

		this.showFormDialog()
	}

	private showFormDialog() {
		import('@mhmo91/schmancy/dialog').then(module => {
			const $dialog = module.$dialog
			$dialog.component(
				html`
					<schmancy-surface rounded="all" class="p-5 max-w-md mx-auto">
						<schmancy-typography type="title" token="lg" class="mb-1">Subscribe to Newsletter</schmancy-typography>
						<schmancy-typography type="body" token="sm" class="text-gray-500 mb-4">
							Get the latest updates directly to your inbox
						</schmancy-typography>

						<form @submit=${this.handleFormDialogSubmit}>
							<div class="mb-4">
								<label for="email" class="block text-sm font-medium mb-1">Email Address</label>
								<input
									type="email"
									id="email"
									class="w-full p-2 border rounded ${this.formDialogErrorMessage
										? 'border-red-500'
										: 'border-gray-300'}"
									placeholder="your@email.com"
									.value=${this.formDialogEmail}
									@input=${(e: any) => {
										this.formDialogEmail = e.target.value
										this.formDialogErrorMessage = ''
									}}
									?disabled=${this.formDialogSubmitting}
									required
								/>
								${this.formDialogErrorMessage
									? html`<div class="text-red-500 text-sm mt-1">${this.formDialogErrorMessage}</div>`
									: ''}
							</div>

							<div class="flex items-center mb-4">
								<input type="checkbox" id="terms" required class="mr-2" />
								<label for="terms" class="text-sm">I agree to the terms and conditions</label>
							</div>

							<div class="flex justify-end gap-2">
								<schmancy-button
									variant="outlined"
									@click=${() => {
										import('@mhmo91/schmancy/dialog').then(module => {
											module.$dialog.dismiss()
										})
									}}
									?disabled=${this.formDialogSubmitting}
								>
									Cancel
								</schmancy-button>
								<schmancy-button
									variant="filled"
									type="submit"
									class="${this.formDialogSubmitting ? 'opacity-75' : ''}"
									?disabled=${this.formDialogSubmitting}
								>
									${this.formDialogSubmitting ? 'Submitting...' : 'Subscribe'}
								</schmancy-button>
							</div>
						</form>
					</schmancy-surface>
				`,
				{ width: '400px' },
			)
		})
	}

	private async handleFormDialogSubmit(e: Event) {
		e.preventDefault()

		if (!this.formDialogEmail) {
			this.formDialogErrorMessage = 'Email is required'
			this.updateFormDialog()
			return
		}

		// Show loading state
		this.formDialogSubmitting = true
		this.updateFormDialog()

		try {
			// Mock API call
			await new Promise(resolve => setTimeout(resolve, 1500))

			// Show success message
			import('@mhmo91/schmancy/dialog').then(module => {
				const $dialog = module.$dialog
				$dialog.dismiss()
				setTimeout(() => {
					$dialog.confirm({
						title: 'Success!',
						message: `Thank you for subscribing with ${this.formDialogEmail}. We've sent you a confirmation email.`,
						confirmText: 'OK',
						cancelText: '',
					})
				}, 100)
			})
		} catch (error) {
			// Show error
			this.formDialogSubmitting = false
			this.formDialogErrorMessage = 'An error occurred. Please try again.'
			this.updateFormDialog()
		}
	}

	private updateFormDialog() {
		import('@mhmo91/schmancy/dialog').then(module => {
			module.$dialog.dismiss()
			setTimeout(() => {
				this.showFormDialog()
			}, 100)
		})
	}

	private runStackedDialogs() {
		import('@mhmo91/schmancy/dialog').then(module => {
			const $dialog = module.$dialog
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
		})
	}

	render() {
		const example = this.examples[this.activeExample]

		return html`
			<schmancy-surface type="container" rounded="left" class="p-6">
				<schmancy-typography type="headline" token="md" class="mb-1">Dialog Examples</schmancy-typography>
				<schmancy-typography type="subtitle" token="sm" class="text-gray-600 mb-6">
					Explore different dialog patterns with code examples
				</schmancy-typography>

				<div class="mb-6">
					<schmancy-typography type="subtitle" token="sm" class="mb-2">Select Example:</schmancy-typography>
					<select
						class="border border-gray-300 rounded p-2 w-full md:w-64"
						@change=${this.handleChangeExample}
						.value=${this.activeExample}
					>
						<option value="basic">Basic Dialog</option>
						<option value="custom">Custom Component Dialog</option>
						<option value="form">Form Dialog</option>
						<option value="stacked">Stacked Dialogs</option>
					</select>
				</div>

				<div class="border border-gray-300 rounded-lg p-6 mb-6 bg-white">
					<div class="flex justify-between items-center mb-4">
						<schmancy-typography type="title" token="lg">${example.title}</schmancy-typography>
						<schmancy-button variant="text" size="sm" class="copy-button" @click=${this.copyCode}>
							Copy Code
						</schmancy-button>
					</div>

					<schmancy-typography type="body" token="md" class="mb-4"> ${example.description} </schmancy-typography>

					<div class="bg-gray-50 rounded-md p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap overflow-x-auto mb-5 border border-gray-300">
						<pre><code>${this.getExampleCode()}</code></pre>
					</div>

					<div class="flex justify-end gap-2 mt-4">
						<schmancy-button variant="filled" @click=${this.runExample}> Run Example </schmancy-button>
					</div>
				</div>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-dialog-playground': DemoDialogPlayground
	}
}
