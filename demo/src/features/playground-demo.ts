import { $LitElement } from '@mhmo91/schmancy/mixins'
import '@mhmo91/schmancy/button'
import '@mhmo91/schmancy/icons'
import '@mhmo91/schmancy/surface'
import '@mhmo91/schmancy/tabs'
import '@mhmo91/schmancy/typography'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

// Use a simplified approach with a text editor and iframe
@customElement('demo-playground')
export class DemoPlayground extends $LitElement() {
	@state() private activeTab = 'button'
	@state() private isMobile = window.innerWidth < 768
	@state() private code: { [key: string]: string } = {}

	// Initial code templates
	private buttonCode = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Schmancy Button Demo</title>
  <script type="module">
    // Import the components directly
    import '@mhmo91/schmancy/button';
    import '@mhmo91/schmancy/theme';
  </script>
  <style>
    body {
      font-family: 'GT-Eesti', sans-serif;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin: 0;
      min-height: 100vh;
    }
    .demo-section {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 16px;
    }
    h3 {
      width: 100%;
      margin-bottom: 8px;
    }
  </style>
</head>
<body>
  <schmancy-theme>
    <h3>Button Variants</h3>
    <div class="demo-section">
      <schmancy-button variant="filled">Filled</schmancy-button>
      <schmancy-button variant="outlined">Outlined</schmancy-button>
      <schmancy-button variant="text">Text</schmancy-button>
    </div>
    
    <h3>Button Sizes</h3>
    <div class="demo-section">
      <schmancy-button variant="filled" size="sm">Small</schmancy-button>
      <schmancy-button variant="filled" size="md">Medium</schmancy-button>
      <schmancy-button variant="filled" size="lg">Large</schmancy-button>
    </div>
    
    <h3>Button States</h3>
    <div class="demo-section">
      <schmancy-button variant="filled" disabled>Disabled</schmancy-button>
      <schmancy-button variant="filled" loading>Loading</schmancy-button>
    </div>
    
    <h3>Try editing the code!</h3>
    <div class="demo-section">
      <schmancy-button id="customButton" variant="filled">Click Me</schmancy-button>
    </div>

    <script>
      // Add some interactivity
      const button = document.getElementById('customButton');
      button.addEventListener('click', () => {
        alert('Button clicked!');
      });
    </script>
  </schmancy-theme>
</body>
</html>`

	private dialogCode = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Schmancy Dialog Demo</title>
  <script type="module">
    // Import components with standard path
    import '@mhmo91/schmancy/button';
    import '@mhmo91/schmancy/theme';
    import { $dialog } from '@mhmo91/schmancy/dialog';
    
    // Set up event handlers after components are loaded
    document.addEventListener('DOMContentLoaded', () => {
      // Basic dialog
      document.getElementById('basicDialog').addEventListener('click', () => {
        $dialog.alert({
          title: 'Basic Dialog',
          message: 'This is a simple alert dialog.',
          confirmText: 'OK'
        });
      });

      // Confirm dialog
      document.getElementById('confirmDialog').addEventListener('click', () => {
        $dialog.confirm({
          title: 'Confirm Action',
          message: 'Are you sure you want to proceed with this action?',
          confirmText: 'Yes',
          cancelText: 'No'
        }).then(result => {
          if (result) {
            alert('Action confirmed!');
          } else {
            alert('Action cancelled.');
          }
        });
      });

      // Custom dialog
      document.getElementById('customDialog').addEventListener('click', () => {
        const customHtml = document.createElement('div');
        customHtml.innerHTML = \`
          <div style="padding: 20px;">
            <h2 style="margin-top: 0;">Custom Content</h2>
            <p>This dialog has custom HTML content.</p>
            <input type="text" placeholder="Type something..." style="width: 100%; padding: 8px; margin: 10px 0;">
            <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
              <schmancy-button id="closeCustomDialog" variant="outlined">Close</schmancy-button>
              <schmancy-button id="submitCustomDialog" variant="filled">Submit</schmancy-button>
            </div>
          </div>
        \`;
        
        $dialog.element(customHtml, { width: '400px' });
        
        // Set up event listeners for the dialog buttons
        setTimeout(() => {
          document.getElementById('closeCustomDialog')?.addEventListener('click', () => {
            $dialog.dismiss();
          });
          
          document.getElementById('submitCustomDialog')?.addEventListener('click', () => {
            alert('Custom form submitted!');
            $dialog.dismiss();
          });
        }, 100);
      });
    });
  </script>
  <style>
    body {
      font-family: 'GT-Eesti', sans-serif;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin: 0;
      min-height: 100vh;
    }
    .demo-section {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 16px;
    }
  </style>
</head>
<body>
  <schmancy-theme>
    <h3>Dialog Examples</h3>
    <div class="demo-section">
      <schmancy-button id="basicDialog" variant="filled">Basic Dialog</schmancy-button>
      <schmancy-button id="confirmDialog" variant="outlined">Confirm Dialog</schmancy-button>
      <schmancy-button id="customDialog" variant="filled">Custom Dialog</schmancy-button>
    </div>
  </schmancy-theme>
</body>
</html>`

	private surfaceCode = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Schmancy Surface Demo</title>
  <script type="module">
    // Import components directly
    import '@mhmo91/schmancy/surface';
    import '@mhmo91/schmancy/typography';
    import '@mhmo91/schmancy/theme';
  </script>
  <style>
    body {
      font-family: 'GT-Eesti', sans-serif;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      background-color: #f5f5f5;
      margin: 0;
      min-height: 100vh;
    }
    .demo-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .surface-demo {
      padding: 20px;
      height: 100%;
    }
  </style>
</head>
<body>
  <schmancy-theme>
    <h2>Surface Types</h2>
    <div class="demo-container">
      <schmancy-surface class="surface-demo" rounded="all">
        <schmancy-typography type="title" token="md">Default Surface</schmancy-typography>
        <schmancy-typography type="body" token="md">This is the default surface with rounded corners.</schmancy-typography>
      </schmancy-surface>
      
      <schmancy-surface class="surface-demo" type="container" rounded="all">
        <schmancy-typography type="title" token="md">Container Surface</schmancy-typography>
        <schmancy-typography type="body" token="md">This surface has the container type.</schmancy-typography>
      </schmancy-surface>
      
      <schmancy-surface class="surface-demo" type="containerHigh" rounded="all">
        <schmancy-typography type="title" token="md">Elevated Surface</schmancy-typography>
        <schmancy-typography type="body" token="md">This surface has the elevated type with a shadow.</schmancy-typography>
      </schmancy-surface>
    </div>
    
    <h2>Rounding Options</h2>
    <div class="demo-container">
      <schmancy-surface class="surface-demo" rounded="all">
        <schmancy-typography type="title" token="md">All Corners Rounded</schmancy-typography>
        <schmancy-typography type="body" token="md">rounded="all"</schmancy-typography>
      </schmancy-surface>
      
      <schmancy-surface class="surface-demo" rounded="left">
        <schmancy-typography type="title" token="md">Left Corners Rounded</schmancy-typography>
        <schmancy-typography type="body" token="md">rounded="left"</schmancy-typography>
      </schmancy-surface>
      
      <schmancy-surface class="surface-demo" rounded="right">
        <schmancy-typography type="title" token="md">Right Corners Rounded</schmancy-typography>
        <schmancy-typography type="body" token="md">rounded="right"</schmancy-typography>
      </schmancy-surface>
    </div>
    
    <h2>Custom Surface</h2>
    <div class="demo-container">
      <schmancy-surface 
        class="surface-demo" 
        rounded="all" 
        style="--schmancy-surface-color: var(--primary-50); --schmancy-surface-border-color: var(--primary-300);"
      >
        <schmancy-typography type="title" token="md">Custom Surface</schmancy-typography>
        <schmancy-typography type="body" token="md">
          This surface has custom colors using CSS variables.
        </schmancy-typography>
      </schmancy-surface>
    </div>
  </schmancy-theme>
</body>
</html>`

	private typographyCode = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Schmancy Typography Demo</title>
  <script type="module">
    // Import components directly
    import '@mhmo91/schmancy/typography';
    import '@mhmo91/schmancy/icons';
    import '@mhmo91/schmancy/surface';
    import '@mhmo91/schmancy/theme';
  </script>
  <style>
    body {
      font-family: 'GT-Eesti', sans-serif;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      background-color: #f5f5f5;
      margin: 0;
      min-height: 100vh;
    }
    .demo-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .demo-section {
      margin-bottom: 20px;
    }
    .typography-demo {
      padding: 20px;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <schmancy-theme>
    <h2>Typography with Nested Icons</h2>
    <div class="demo-section">
      <schmancy-surface class="typography-demo" type="container" rounded="all">
        <!-- Example from user request -->
        <schmancy-typography type="label" token="sm" class="text-on-surface-variant flex items-center justify-center gap-1">
          Displayed Transactions
          <schmancy-icon class="text-on-surface-variant text-sm">info</schmancy-icon>
        </schmancy-typography>
      </schmancy-surface>
      
      <schmancy-surface class="typography-demo" type="container" rounded="all">
        <schmancy-typography type="body" token="md" class="flex items-center gap-2">
          <schmancy-icon>check_circle</schmancy-icon>
          Text with preceding icon
        </schmancy-typography>
      </schmancy-surface>
      
      <schmancy-surface class="typography-demo" type="container" rounded="all">
        <schmancy-typography type="headline" token="md" class="flex items-center gap-2">
          Icons on both sides
          <schmancy-icon>arrow_forward</schmancy-icon>
        </schmancy-typography>
      </schmancy-surface>
    </div>
    
    <h2>Typography Types</h2>
    <div class="demo-section">
      <schmancy-surface class="typography-demo" type="container" rounded="all">
        <schmancy-typography type="display" token="lg">Display Large</schmancy-typography>
        <schmancy-typography type="headline" token="md">Headline Medium</schmancy-typography>
        <schmancy-typography type="title" token="md">Title Medium</schmancy-typography>
        <schmancy-typography type="subtitle" token="sm">Subtitle Small</schmancy-typography>
        <schmancy-typography type="body" token="md">Body Medium</schmancy-typography>
        <schmancy-typography type="label" token="sm">Label Small</schmancy-typography>
      </schmancy-surface>
    </div>
    
    <h2>Typography Alignment</h2>
    <div class="demo-container">
      <schmancy-surface class="typography-demo" type="container" rounded="all">
        <schmancy-typography align="left" type="body" token="md">
          This text is left-aligned. Left alignment is used for most body content.
        </schmancy-typography>
      </schmancy-surface>
      
      <schmancy-surface class="typography-demo" type="container" rounded="all">
        <schmancy-typography align="center" type="body" token="md">
          This text is center-aligned. Center alignment is often used for headings or special content.
        </schmancy-typography>
      </schmancy-surface>
      
      <schmancy-surface class="typography-demo" type="container" rounded="all">
        <schmancy-typography align="right" type="body" token="md">
          This text is right-aligned. Right alignment may be used for numbers or specific design elements.
        </schmancy-typography>
      </schmancy-surface>
    </div>
  </schmancy-theme>
</body>
</html>`

	// Component descriptions
	private descriptions = {
		button:
			'Explore the Schmancy Button component with different variants, sizes, and states. Edit the code to create your own custom button implementations.',
		dialog:
			'Explore the Schmancy Dialog component with alert, confirm, and custom dialogs. Edit the code to create your own dialog implementations.',
		surface:
			'Explore the Schmancy Surface component with different types, rounding options, and custom styling. Edit the code to create your own surface implementations.',
		typography:
			'Explore the Schmancy Typography component with different types, sizes, and nested icons. Edit the code to create your own typography implementations.',
	}

	constructor() {
		super()
		this.handleResize = this.handleResize.bind(this)
		window.addEventListener('resize', this.handleResize)

		// Initialize code state
		this.code = {
			button: this.buttonCode,
			dialog: this.dialogCode,
			surface: this.surfaceCode,
			typography: this.typographyCode,
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		window.removeEventListener('resize', this.handleResize)
	}

	handleResize() {
		this.isMobile = window.innerWidth < 768
	}

	private handleTabChange(e: CustomEvent) {
		this.activeTab = e.detail
	}

	private handleCodeChange(e: Event) {
		const textarea = e.target as HTMLTextAreaElement
		this.code[this.activeTab] = textarea.value
		this.updatePreview()
	}

	private updatePreview() {
		const iframe = this.shadowRoot?.querySelector('iframe')
		if (iframe) {
			// Determine if we're in dev mode by checking the URL
			const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

			// Choose the right base URL for loading components
			const baseUrl = isDev
				? window.location.origin // Local development path
				: 'https://cdn.jsdelivr.net/npm/@mhmo91/schmancy@latest' // CDN path

			// Fix import paths in the code
			let updatedCode = this.code[this.activeTab]
				.replace(/@schmancy\//g, `${baseUrl}/dist/`)
				.replace('/dist/dialog/index.js', `${baseUrl}/dist/dialog/index.js`)

			// Set base href to ensure all resources load correctly
			updatedCode = updatedCode.replace(
				'<head>',
				`<head>
        <base href="${window.location.origin}/">
        <script type="module">
          // This helps debug where resources are loading from
        </script>`,
			)

			iframe.srcdoc = updatedCode
		}
	}

	private handleRunClick() {
		this.updatePreview()
	}

	protected firstUpdated() {
		// Initial update of the preview
		this.updateComplete.then(() => {
			this.updatePreview()
		})
	}

	render() {
		return html`
			<schmancy-surface type="container" rounded="left" class="p-6">
				<schmancy-typography type="headline" token="md" class="mb-1">
					Interactive Component Playground
				</schmancy-typography>
				<schmancy-typography type="subtitle" token="sm" class="text-gray-600 mb-6">
					Explore and modify Schmancy components in real-time
				</schmancy-typography>

				<div class="mb-4">
					<schmancy-tabs-group activeTab=${this.activeTab} @tab-changed=${this.handleTabChange}>
						<schmancy-tab value="button" label="Button" ?active=${this.activeTab === 'button'}> Button </schmancy-tab>
						<schmancy-tab value="dialog" label="Dialog" ?active=${this.activeTab === 'dialog'}> Dialog </schmancy-tab>
						<schmancy-tab value="surface" label="Surface" ?active=${this.activeTab === 'surface'}>
							Surface
						</schmancy-tab>
						<schmancy-tab value="typography" label="Typography" ?active=${this.activeTab === 'typography'}>
							Typography
						</schmancy-tab>
					</schmancy-tabs-group>
				</div>

				<schmancy-typography type="body" token="md" class="mb-6">
					${this.descriptions[this.activeTab]}
				</schmancy-typography>

				<div class="${this.isMobile ? 'grid grid-cols-1 grid-rows-2 gap-5 h-[600px]' : 'grid grid-cols-2 gap-5 h-[600px]'}">
					<div class="h-full rounded-lg overflow-hidden shadow-lg flex flex-col">
						<div class="flex justify-between items-center p-3 bg-gray-100 border-b border-gray-300">
							<div class="font-mono text-sm text-gray-600">index.html</div>
							<schmancy-button variant="filled" size="sm" @click=${this.handleRunClick}>Run</schmancy-button>
						</div>
						<textarea
							class="w-full h-full font-mono text-sm border-none bg-gray-50 p-3 resize-none leading-6 flex-1"
							@input=${this.handleCodeChange}
							spellcheck="false"
							.value=${this.code[this.activeTab]}
						></textarea>
					</div>

					<div class="h-full rounded-lg overflow-hidden shadow-lg">
						<iframe class="w-full h-full border-none" allow="fullscreen"></iframe>
					</div>
				</div>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-playground': DemoPlayground
	}
}
