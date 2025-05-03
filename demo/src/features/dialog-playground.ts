import { $LitElement } from '@mixins/index'
import '@schmancy/button'
import '@schmancy/form'
import '@schmancy/input'
import '@schmancy/surface'
import '@schmancy/tabs'
import '@schmancy/typography'
import { css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

// Import playground elements
import '@webcomponents/scoped-custom-element-registry'
import 'playground-elements/playground-file-editor.js'
import 'playground-elements/playground-preview.js'
import 'playground-elements/playground-project.js'

@customElement('demo-dialog-playground')
export class DemoDialogPlayground extends $LitElement(css`
	:host {
		display: block;
	}

	.component-demo {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 32px;
		margin-top: 24px;
	}

	.editor-container {
		height: 500px;
		overflow: hidden;
		border-radius: 8px;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06);
	}

	.preview-container {
		height: 500px;
		border-radius: 8px;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06);
	}

	playground-preview {
		height: 100%;
		width: 100%;
		border-radius: 8px;
		background-color: white;
	}

	playground-file-editor {
		height: 100%;
		border-radius: 8px;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	.controls {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-top: 24px;
	}

	/* Custom styling for playground elements */
	::part(line-numbers) {
		background-color: #f8fafc;
	}

	::part(editor) {
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 14px;
	}

	h3 {
		margin-top: 0;
		margin-bottom: 8px;
	}

	.controls-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}

	.tab-container {
		margin-top: 16px;
	}

	.example-select {
		margin-bottom: 16px;
	}
`) {
	@state() private activeExample = 'basic'

	// Basic Dialog Example
	private basicDialogExample = `
import { html, render } from 'lit';
import { $dialog } from '@schmancy/dialog';

document.addEventListener('DOMContentLoaded', () => {
  // Render the demo component
  render(html\`
    <div style="padding: 20px;">
      <h2 style="margin-bottom: 16px;">Dialog Examples</h2>
      <button id="openDialog" class="button">Open Dialog</button>
    </div>
  \`, document.body);

  // Add click handler
  document.getElementById('openDialog').addEventListener('click', () => {
    $dialog.confirm({
      title: 'Basic Dialog',
      subtitle: 'This is a subtitle with additional context',
      message: 'This is a basic confirmation dialog with title, subtitle, and buttons.',
      confirmText: 'Confirm',
      cancelText: 'Cancel'
    }).then(result => {
      console.log('Dialog result:', result);
    });
  });
});

// Add some basic styles
const style = document.createElement('style');
style.textContent = \`
  body { 
    font-family: system-ui, -apple-system, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
  }
  .button {
    background-color: #4f46e5;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }
  .button:hover {
    background-color: #4338ca;
  }
\`;
document.head.appendChild(style);
`

	// Custom Component Dialog
	private customDialogExample = `
import { html, render } from 'lit';
import { $dialog } from '@schmancy/dialog';

document.addEventListener('DOMContentLoaded', () => {
  // Render the demo component
  render(html\`
    <div style="padding: 20px;">
      <h2 style="margin-bottom: 16px;">Custom Component Dialog</h2>
      <button id="openDialog" class="button">Open Custom Dialog</button>
    </div>
  \`, document.body);

  // Add click handler
  document.getElementById('openDialog').addEventListener('click', () => {
    // Create a dynamic custom component
    $dialog.component(html\`
      <div class="custom-content">
        <div class="header">
          <div class="avatar"></div>
          <div class="info">
            <h3>John Doe</h3>
            <p>Software Engineer</p>
          </div>
        </div>
        
        <div class="body">
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
        
        <div class="footer">
          <button class="button-secondary" @click=\${() => $dialog.dismiss()}>Close</button>
          <button class="button-primary">View Profile</button>
        </div>
      </div>
    \`, { width: '400px' });
  });
});

// Add some custom styles
const style = document.createElement('style');
style.textContent = \`
  body { 
    font-family: system-ui, -apple-system, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
  }
  .button {
    background-color: #4f46e5;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }
  .button:hover {
    background-color: #4338ca;
  }
  
  .custom-content {
    width: 100%;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .header {
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
  
  .info h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
  
  .info p {
    margin: 4px 0 0;
    color: #6b7280;
    font-size: 14px;
  }
  
  .body {
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
  
  .footer {
    padding: 16px;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    border-top: 1px solid #e5e7eb;
  }
  
  .button-primary {
    background-color: #4f46e5;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }
  
  .button-secondary {
    background-color: white;
    color: #374151;
    border: 1px solid #d1d5db;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }
\`;
document.head.appendChild(style);
`

	// Advanced Dialog Example
	private advancedDialogExample = `
import { html, render } from 'lit';
import { $dialog } from '@schmancy/dialog';

document.addEventListener('DOMContentLoaded', () => {
  // Render the demo component
  render(html\`
    <div style="padding: 20px;">
      <h2 style="margin-bottom: 16px;">Interactive Dialog</h2>
      <button id="openDialog" class="button">Open Form Dialog</button>
    </div>
  \`, document.body);

  // Mock API function
  const mockSubmit = async (email) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, email });
      }, 1500);
    });
  };

  // Add click handler
  document.getElementById('openDialog').addEventListener('click', () => {
    // Create an interactive form dialog
    let emailValue = '';
    let isSubmitting = false;
    let errorMessage = '';
    
    const formDialog = () => {
      return html\`
        <div class="form-dialog">
          <div class="header">
            <h2>Subscribe to Newsletter</h2>
            <p>Get the latest updates directly to your inbox</p>
          </div>
          
          <div class="body">
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
                    // Force re-render of the component
                    $dialog.dismiss();
                    setTimeout(() => {
                      $dialog.component(formDialog(), { width: '400px' });
                    }, 0);
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
            </form>
          </div>
          
          <div class="footer">
            <button 
              class="button-secondary" 
              @click=\${() => $dialog.dismiss()}
              ?disabled=\${isSubmitting}
            >
              Cancel
            </button>
            <button 
              class="button-primary \${isSubmitting ? 'loading' : ''}" 
              type="submit"
              form="subscribeForm"
              ?disabled=\${isSubmitting}
            >
              \${isSubmitting ? 'Submitting...' : 'Subscribe'}
            </button>
          </div>
        </div>
      \`;
    };
    
    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!emailValue) {
        errorMessage = 'Email is required';
        // Force re-render
        $dialog.dismiss();
        setTimeout(() => {
          $dialog.component(formDialog(), { width: '400px' });
        }, 0);
        return;
      }
      
      // Show loading state
      isSubmitting = true;
      // Force re-render
      $dialog.dismiss();
      setTimeout(() => {
        $dialog.component(formDialog(), { width: '400px' });
      }, 0);
      
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
        
        // Force re-render
        $dialog.dismiss();
        setTimeout(() => {
          $dialog.component(formDialog(), { width: '400px' });
        }, 0);
      }
    };
    
    // Open the dialog
    $dialog.component(formDialog(), { width: '400px' });
  });
});

// Add custom styles
const style = document.createElement('style');
style.textContent = \`
  body { 
    font-family: system-ui, -apple-system, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
  }
  .button {
    background-color: #4f46e5;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }
  .button:hover {
    background-color: #4338ca;
  }
  
  .form-dialog {
    width: 100%;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .header {
    padding: 24px 24px 0;
  }
  
  .header h2 {
    margin: 0 0 8px;
    font-size: 20px;
    font-weight: 600;
    color: #111827;
  }
  
  .header p {
    margin: 0;
    color: #6b7280;
    font-size: 14px;
  }
  
  .body {
    padding: 16px 24px;
  }
  
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
  
  .form-field input[type="email"] {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 14px;
  }
  
  .form-field input[type="email"]:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  }
  
  .form-field.has-error input {
    border-color: #ef4444;
  }
  
  .error-message {
    margin-top: 4px;
    color: #ef4444;
    font-size: 12px;
  }
  
  .form-field.checkbox {
    display: flex;
    align-items: center;
  }
  
  .form-field.checkbox input {
    margin-right: 8px;
  }
  
  .form-field.checkbox label {
    margin-bottom: 0;
    font-weight: normal;
  }
  
  .footer {
    padding: 16px 24px;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    border-top: 1px solid #e5e7eb;
  }
  
  .button-primary {
    background-color: #4f46e5;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    min-width: 100px;
  }
  
  .button-primary:disabled {
    background-color: #c7d2fe;
    cursor: not-allowed;
  }
  
  .button-primary.loading {
    position: relative;
  }
  
  .button-primary.loading::after {
    content: '';
    position: absolute;
    width: 14px;
    height: 14px;
    top: calc(50% - 7px);
    left: calc(50% - 7px);
    border: 2px solid transparent;
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .button-secondary {
    background-color: white;
    color: #374151;
    border: 1px solid #d1d5db;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }
  
  .button-secondary:disabled {
    color: #9ca3af;
    border-color: #e5e7eb;
    cursor: not-allowed;
  }
\`;
document.head.appendChild(style);
`

	// Stacked Dialogs Example
	private stackedDialogExample = `
import { html, render } from 'lit';
import { $dialog } from '@schmancy/dialog';

document.addEventListener('DOMContentLoaded', () => {
  // Render the demo component
  render(html\`
    <div style="padding: 20px;">
      <h2 style="margin-bottom: 16px;">Stacked Dialogs</h2>
      <button id="openDialog" class="button">Open First Dialog</button>
    </div>
  \`, document.body);

  // Add click handler
  document.getElementById('openDialog').addEventListener('click', () => {
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
  });
});

// Add some basic styles
const style = document.createElement('style');
style.textContent = \`
  body { 
    font-family: system-ui, -apple-system, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
  }
  .button {
    background-color: #4f46e5;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }
  .button:hover {
    background-color: #4338ca;
  }
\`;
document.head.appendChild(style);
`

	private getExampleCode() {
		switch (this.activeExample) {
			case 'basic':
				return this.basicDialogExample
			case 'custom':
				return this.customDialogExample
			case 'advanced':
				return this.advancedDialogExample
			case 'stacked':
				return this.stackedDialogExample
			default:
				return this.basicDialogExample
		}
	}

	private getExampleDescription() {
		switch (this.activeExample) {
			case 'basic':
				return html`
					<p>
						A simple dialog with title, subtitle, message, and standard buttons. Shows how to use the basic dialog API
						with the new subtitle feature.
					</p>
				`
			case 'custom':
				return html`
					<p>
						A fully custom component dialog with profile card styling. Demonstrates how to create rich, custom UI within
						dialogs.
					</p>
				`
			case 'advanced':
				return html`
					<p>
						An interactive form dialog with validation, loading states, and dynamic content. Shows how to handle complex
						user interactions.
					</p>
				`
			case 'stacked':
				return html`
					<p>
						Demonstrates stacked dialogs that open on top of each other, creating a multi-step flow with proper
						layering.
					</p>
				`
			default:
				return html`<p>Select an example to see its description.</p>`
		}
	}

	private handleExampleChange(e: Event) {
		const select = e.target as HTMLSelectElement
		this.activeExample = select.value
	}

	firstUpdated() {
		// Initial project setup
		const project = this.renderRoot.querySelector('playground-project')
		if (project) {
			project.config = {
				files: {
					'index.html': {
						content: `<!DOCTYPE html>
<html>
  <head>
    <title>Schmancy Dialog Demo</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script type="module" src="./index.js"></script>
  </head>
  <body>
    <!-- Content will be rendered via Lit -->
  </body>
</html>`,
						type: 'html',
					},
					'index.js': {
						content: this.getExampleCode(),
						type: 'js',
					},
				},
				importMap: {
					imports: {
						lit: 'https://cdn.jsdelivr.net/npm/lit@2.8.0/+esm',
						'@schmancy/dialog': '/assets/dialog-bundle.js',
					},
				},
			}
		}
	}

	updated(changedProps: Map<string, any>) {
		if (changedProps.has('activeExample')) {
			const project = this.renderRoot.querySelector('playground-project')
			if (project) {
				project.fileByName('index.js').setContent(this.getExampleCode())
			}
		}
	}

	render() {
		return html`
			<schmancy-surface type="container" fill="all" rounded="left" class="p-4">
				<schmancy-typography type="headline" token="md">Interactive Dialog Playground</schmancy-typography>
				<schmancy-typography type="subtitle" token="sm" class="mt-2">
					Live code editor with real-time preview - edit and see results instantly
				</schmancy-typography>

				<div class="example-select">
					<schmancy-form>
						<div class="mb-4 mt-6">
							<label for="example-select" class="block text-sm font-medium mb-1">Select Example:</label>
							<select
								id="example-select"
								class="block w-full border border-gray-300 rounded-md p-2"
								.value=${this.activeExample}
								@change=${this.handleExampleChange}
							>
								<option value="basic">Basic Dialog</option>
								<option value="custom">Custom Component Dialog</option>
								<option value="advanced">Interactive Form Dialog</option>
								<option value="stacked">Stacked Dialogs</option>
							</select>
						</div>
					</schmancy-form>

					<div class="mb-4">${this.getExampleDescription()}</div>
				</div>

				<div class="component-demo">
					<div class="editor-container">
						<playground-project>
							<playground-file-editor filename="index.js" line-numbers theme="light"></playground-file-editor>
						</playground-project>
					</div>

					<div class="preview-container">
						<playground-preview></playground-preview>
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
