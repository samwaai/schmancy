import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import '@schmancy/boat'
import '@schmancy/button'
import '@schmancy/typography'
import '@schmancy/surface'
import '@schmancy/grid'
import '@schmancy/icon'

@customElement('demo-boat')
export class DemoBoat extends $LitElement() {
	@state() boatState: 'hidden' | 'minimized' | 'expanded' = 'hidden'
	@state() boatContent: string = 'simple'

	private toggleBoat() {
		const boat = this.shadowRoot?.querySelector('schmancy-boat') as any
		if (boat) {
			if (boat.state === 'hidden') {
				boat.state = 'minimized'
			} else if (boat.state === 'minimized') {
				boat.state = 'expanded'
			} else {
				boat.state = 'hidden'
			}
			this.boatState = boat.state
		}
	}

	private showSimpleBoat() {
		this.boatContent = 'simple'
		const boat = this.shadowRoot?.querySelector('schmancy-boat') as any
		if (boat) {
			boat.state = 'expanded'
			this.boatState = 'expanded'
		}
	}

	private showFormBoat() {
		this.boatContent = 'form'
		const boat = this.shadowRoot?.querySelector('schmancy-boat') as any
		if (boat) {
			boat.state = 'expanded'
			this.boatState = 'expanded'
		}
	}

	private showListBoat() {
		this.boatContent = 'list'
		const boat = this.shadowRoot?.querySelector('schmancy-boat') as any
		if (boat) {
			boat.state = 'expanded'
			this.boatState = 'expanded'
		}
	}

	render() {
		return html`
			<schmancy-grid gap="xl">
				<!-- Demo Header -->
				<div class="demo-section">
					<schmancy-typography type="headline" token="lg">
						Boat Component Demo
					</schmancy-typography>
					<schmancy-typography type="body" token="lg" class="mt-2">
						The boat component provides a sliding panel that can be minimized, expanded, or hidden. 
						It's perfect for displaying contextual information, forms, or any content that needs to be easily accessible but not always visible.
					</schmancy-typography>
				</div>

				<!-- Control Buttons -->
				<schmancy-surface type="container" class="demo-section p-6 rounded-xl">
					<schmancy-typography type="title" token="md" class="mb-4">
						Boat Controls
					</schmancy-typography>
					
					<div class="button-group">
						<schmancy-button variant="filled" @click=${this.toggleBoat}>
							Toggle Boat State
						</schmancy-button>
						
						<schmancy-button variant="filled tonal" @click=${this.showSimpleBoat}>
							Show Simple Content
						</schmancy-button>
						
						<schmancy-button variant="filled tonal" @click=${this.showFormBoat}>
							Show Form Example
						</schmancy-button>
						
						<schmancy-button variant="filled tonal" @click=${this.showListBoat}>
							Show List Example
						</schmancy-button>
					</div>

					<schmancy-typography type="body" token="md" class="mt-4">
						Current boat state: <strong>${this.boatState}</strong>
					</schmancy-typography>
				</schmancy-surface>

				<!-- Features Section -->
				<schmancy-surface type="container" class="demo-section p-6 rounded-xl">
					<schmancy-typography type="title" token="md" class="mb-4">
						Features
					</schmancy-typography>
					
					<schmancy-grid gap="md">
						<div class="flex items-start gap-3">
							<schmancy-icon>check_circle</schmancy-icon>
							<schmancy-typography type="body" token="md">
								Three states: hidden, minimized, and expanded
							</schmancy-typography>
						</div>
						
						<div class="flex items-start gap-3">
							<schmancy-icon>check_circle</schmancy-icon>
							<schmancy-typography type="body" token="md">
								Smooth slide-up animation from bottom
							</schmancy-typography>
						</div>
						
						<div class="flex items-start gap-3">
							<schmancy-icon>check_circle</schmancy-icon>
							<schmancy-typography type="body" token="md">
								Responsive width based on viewport size
							</schmancy-typography>
						</div>
						
						<div class="flex items-start gap-3">
							<schmancy-icon>check_circle</schmancy-icon>
							<schmancy-typography type="body" token="md">
								Header slot for custom title and actions
							</schmancy-typography>
						</div>
						
						<div class="flex items-start gap-3">
							<schmancy-icon>check_circle</schmancy-icon>
							<schmancy-typography type="body" token="md">
								Close button with customizable action
							</schmancy-typography>
						</div>
					</schmancy-grid>
				</schmancy-surface>

				<!-- Usage Example -->
				<schmancy-surface type="container" class="demo-section p-6 rounded-xl">
					<schmancy-typography type="title" token="md" class="mb-4">
						Usage Example
					</schmancy-typography>
					
					<schmancy-code-preview language="html">
						<schmancy-boat state="minimized">
							<schmancy-typography slot="header" type="title" token="md">
								Boat Title
							</schmancy-typography>
							
							<!-- Main content goes in default slot -->
							<div class="p-4">
								Your content here...
							</div>
						</schmancy-boat>
					</schmancy-code-preview>
				</schmancy-surface>

				<!-- The Actual Boat Component -->
				<schmancy-boat 
					state="hidden"
					@change=${(e: CustomEvent) => this.boatState = e.detail}
				>
					<schmancy-typography slot="header" type="title" token="md">
						${this.boatContent === 'simple' ? 'Simple Content' : 
						  this.boatContent === 'form' ? 'Form Example' : 
						  'List Example'}
					</schmancy-typography>
					
					<!-- Dynamic content based on selection -->
					${this.boatContent === 'simple' ? html`
						<schmancy-surface type="container" class="boat-content">
							<schmancy-typography type="headline" token="sm" class="mb-4">
								Welcome to Schmancy Boat!
							</schmancy-typography>
							<schmancy-typography type="body" token="md" class="mb-4">
								This is a simple content example. The boat component can hold any content you need.
								It's perfect for displaying additional information without taking up permanent screen space.
							</schmancy-typography>
							<schmancy-button variant="filled" @click=${() => {
								const boat = this.shadowRoot?.querySelector('schmancy-boat') as any
								boat.state = 'minimized'
								this.boatState = 'minimized'
							}}>
								Minimize
							</schmancy-button>
						</schmancy-surface>
					` : this.boatContent === 'form' ? html`
						<schmancy-surface type="container" class="boat-content">
							<schmancy-typography type="headline" token="sm" class="mb-4">
								Contact Form
							</schmancy-typography>
							<schmancy-grid gap="md">
								<schmancy-input label="Name" placeholder="Enter your name"></schmancy-input>
								<schmancy-input label="Email" type="email" placeholder="Enter your email"></schmancy-input>
								<schmancy-input label="Message" placeholder="Enter your message" multiline rows="4"></schmancy-input>
								<div class="flex gap-2">
									<schmancy-button variant="filled">Submit</schmancy-button>
									<schmancy-button variant="text" @click=${() => {
										const boat = this.shadowRoot?.querySelector('schmancy-boat') as any
										boat.state = 'hidden'
										this.boatState = 'hidden'
									}}>
										Cancel
									</schmancy-button>
								</div>
							</schmancy-grid>
						</schmancy-surface>
					` : html`
						<schmancy-surface type="container" class="boat-content">
							<schmancy-typography type="headline" token="sm" class="mb-4">
								Task List
							</schmancy-typography>
							<schmancy-grid gap="sm">
								${[
									'Complete the boat component demo',
									'Test responsive behavior',
									'Add accessibility features',
									'Write documentation',
									'Review code with team'
								].map(task => html`
									<schmancy-surface type="surfaceLowest" class="p-3 rounded-lg flex items-center gap-3">
										<schmancy-icon>check_box_outline_blank</schmancy-icon>
										<schmancy-typography type="body" token="md">${task}</schmancy-typography>
									</schmancy-surface>
								`)}
							</schmancy-grid>
						</schmancy-surface>
					`}
				</schmancy-boat>
			</schmancy-grid>
		`
	}
}