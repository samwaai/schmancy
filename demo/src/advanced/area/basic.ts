import { $LitElement } from '@mhmo91/schmancy/mixins'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { area } from '@mhmo91/schmancy/area'

// Demo components for basic navigation
@customElement('area-basic-home')
class AreaBasicHome extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-6 rounded-lg">
				<schmancy-typography type="headline" token="md" class="mb-4">Home Page</schmancy-typography>
				<schmancy-typography type="body" token="lg">
					Welcome to the home page. This is a simple component loaded into the area.
				</schmancy-typography>
			</schmancy-surface>
		`
	}
}

@customElement('area-basic-about')
class AreaBasicAbout extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-6 rounded-lg">
				<schmancy-typography type="headline" token="md" class="mb-4">About Page</schmancy-typography>
				<schmancy-typography type="body" token="lg">
					This is the about page. Notice how the content changes when you navigate between components.
				</schmancy-typography>
			</schmancy-surface>
		`
	}
}

@customElement('area-basic-contact')
class AreaBasicContact extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-6 rounded-lg">
				<schmancy-typography type="headline" token="md" class="mb-4">Contact Page</schmancy-typography>
				<schmancy-typography type="body" token="lg">
					Get in touch with us through this contact page.
				</schmancy-typography>
			</schmancy-surface>
		`
	}
}

@customElement('demo-area-basic')
export class DemoAreaBasic extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-8">
				<schmancy-typography type="display" token="lg" class="mb-4 block">
					Basic Area Navigation
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					Learn how to implement basic navigation between components using the area system.
				</schmancy-typography>

				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Overview</schmancy-typography>
					<schmancy-typography type="body" token="md" class="mb-4 block">
						The most basic use of areas is to navigate between different components. Each area has a unique name,
						and you can push components to that area using the area service.
					</schmancy-typography>
				</div>

				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Live Example</schmancy-typography>
					
					<schmancy-surface type="container" class="rounded-lg p-6">
						<div class="mb-4 flex gap-4">
							<schmancy-button @click=${() => this.navigateHome()}>
								Home
							</schmancy-button>
							<schmancy-button @click=${() => this.navigateAbout()}>
								About
							</schmancy-button>
							<schmancy-button @click=${() => this.navigateContact()}>
								Contact
							</schmancy-button>
							<schmancy-button @click=${() => this.clearArea()} variant="outlined">
								Clear Area
							</schmancy-button>
						</div>
						
						<schmancy-surface type="surfaceDim" class="rounded-lg p-4 min-h-[200px]">
							<schmancy-area name="basic-demo"></schmancy-area>
						</schmancy-surface>
					</schmancy-surface>
				</div>

				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Implementation</schmancy-typography>
					
					<div class="space-y-6">
						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">1. Define the area in your HTML</schmancy-typography>
							<schmancy-code-preview language="html">
${`<schmancy-area name="basic-demo"></schmancy-area>`}
							</schmancy-code-preview>
						</div>

						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">2. Import the area service</schmancy-typography>
							<schmancy-code-preview language="javascript">
${`import { area } from '@mhmo91/schmancy/area'`}
							</schmancy-code-preview>
						</div>

						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">3. Navigate to components</schmancy-typography>
							<schmancy-code-preview language="javascript">
${`// Navigate to a component
area.push({
  area: 'basic-demo',
  component: 'area-basic-home'
})

// Clear the area
area.pop('basic-demo')`}
							</schmancy-code-preview>
						</div>

						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">4. Create your components</schmancy-typography>
							<schmancy-code-preview language="javascript">
${`import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('area-basic-home')
class AreaBasicHome extends LitElement {
  render() {
    return html\`
      <div>
        <h2>Home Page</h2>
        <p>Welcome to the home page.</p>
      </div>
    \`
  }
}`}
							</schmancy-code-preview>
						</div>
					</div>
				</div>

				<div>
					<schmancy-typography type="title" token="lg" class="mb-4 block">Key Points</schmancy-typography>
					<ul class="list-disc ml-6 space-y-2">
						<li>Each area must have a unique name</li>
						<li>Components are loaded by their tag name (e.g., 'area-basic-home')</li>
						<li>Use <code>area.push()</code> to navigate to a component</li>
						<li>Use <code>area.pop()</code> to clear an area</li>
						<li>Components must be registered with <code>@customElement()</code></li>
					</ul>
				</div>
			</schmancy-surface>
		`
	}

	private navigateHome() {
		area.push({
			area: 'basic-demo',
			component: 'area-basic-home'
		})
	}

	private navigateAbout() {
		area.push({
			area: 'basic-demo',
			component: 'area-basic-about'
		})
	}

	private navigateContact() {
		area.push({
			area: 'basic-demo',
			component: 'area-basic-contact'
		})
	}

	private clearArea() {
		area.pop('basic-demo')
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		// Clean up when leaving the demo
		area.pop('basic-demo')
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-area-basic': DemoAreaBasic
		'area-basic-home': AreaBasicHome
		'area-basic-about': AreaBasicAbout
		'area-basic-contact': AreaBasicContact
	}
}