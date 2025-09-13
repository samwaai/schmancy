import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { area } from '@schmancy/area'


// Default components
@customElement('area-default-empty-state')
class AreaDefaultEmptyState extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-8 rounded-lg bg-surface-container text-center">
				<schmancy-icon name="inbox" size="48" class="text-surface-onVariant mb-4"></schmancy-icon>
				<schmancy-typography type="headline" token="sm" class="mb-2 block">No Content Available</schmancy-typography>
				<schmancy-typography type="body" token="md" class="text-surface-onVariant block">
					This area is empty. Click a button above to load content.
				</schmancy-typography>
			</schmancy-surface>
		`
	}
}

@customElement('area-default-loading-state')
class AreaDefaultLoadingState extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-8 rounded-lg bg-surface-container text-center">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-default mb-4"></div>
				<schmancy-typography type="body" token="lg" class="text-surface-onVariant block">
					Loading content...
				</schmancy-typography>
			</schmancy-surface>
		`
	}
}

@customElement('area-default-error-state')
class AreaDefaultErrorState extends $LitElement() {
	@property() message = 'An error occurred while loading content'

	render() {
		return html`
			<schmancy-surface class="p-8 rounded-lg bg-error-container text-center">
				<schmancy-icon name="error" size="48" class="text-error-onContainer mb-4"></schmancy-icon>
				<schmancy-typography type="headline" token="sm" class="mb-2 block text-error-onContainer">
					Error Loading Content
				</schmancy-typography>
				<schmancy-typography type="body" token="md" class="text-error-onContainer block">
					${this.message}
				</schmancy-typography>
			</schmancy-surface>
		`
	}
}

// Content components
@customElement('area-default-article')
class AreaDefaultArticle extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-6 rounded-lg">
				<schmancy-typography type="headline" token="md" class="mb-4">Article Content</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-3">
					This is the main article content that replaced the default empty state.
				</schmancy-typography>
				<schmancy-typography type="body" token="md" class="text-surface-onVariant">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
				</schmancy-typography>
			</schmancy-surface>
		`
	}
}

@customElement('demo-area-default')
export class DemoAreaDefault extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-8">
				<schmancy-typography type="display" token="lg" class="mb-4 block">
					Default Components in Areas
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					Display default components when an area is empty, perfect for loading states, empty states, or placeholder content.
				</schmancy-typography>

				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Overview</schmancy-typography>
					<schmancy-typography type="body" token="md" class="mb-4 block">
						Areas can have a default component that displays automatically when the area is empty. This is useful for
						showing loading states, empty states, or placeholder content while waiting for navigation.
					</schmancy-typography>
				</div>

				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Live Examples</schmancy-typography>
					
					<div class="space-y-6">
						<!-- Empty State Example -->
						<schmancy-surface type="container" class="rounded-lg p-6">
							<schmancy-typography type="title" token="md" class="mb-4 block">Empty State Default</schmancy-typography>
							
							<div class="mb-4 flex gap-4">
								<schmancy-button @click=${() => this.loadContent('default-demo-empty')}>
									Load Content
								</schmancy-button>
								<schmancy-button @click=${() => this.clearArea('default-demo-empty')} variant="outlined">
									Clear (Show Default)
								</schmancy-button>
							</div>
							
							<schmancy-surface type="surfaceDim" class="rounded-lg p-4 min-h-[200px]">
								<schmancy-area name="default-demo-empty" .default=${'area-default-empty-state'}></schmancy-area>
							</schmancy-surface>
						</schmancy-surface>

						<!-- Loading State Example -->
						<schmancy-surface type="container" class="rounded-lg p-6">
							<schmancy-typography type="title" token="md" class="mb-4 block">Loading State Default</schmancy-typography>
							
							<div class="mb-4 flex gap-4">
								<schmancy-button @click=${() => this.simulateLoading()}>
									Simulate Loading
								</schmancy-button>
							</div>
							
							<schmancy-surface type="surfaceDim" class="rounded-lg p-4 min-h-[200px]">
								<schmancy-area name="default-demo-loading" .default=${'area-default-loading-state'}></schmancy-area>
							</schmancy-surface>
						</schmancy-surface>

						<!-- Error State Example -->
						<schmancy-surface type="container" class="rounded-lg p-6">
							<schmancy-typography type="title" token="md" class="mb-4 block">Error State Default</schmancy-typography>
							
							<div class="mb-4 flex gap-4">
								<schmancy-button @click=${() => this.showError()}>
									Show Error State
								</schmancy-button>
								<schmancy-button @click=${() => this.clearArea('default-demo-error')} variant="outlined">
									Clear
								</schmancy-button>
							</div>
							
							<schmancy-surface type="surfaceDim" class="rounded-lg p-4 min-h-[200px]">
								<schmancy-area name="default-demo-error"></schmancy-area>
							</schmancy-surface>
						</schmancy-surface>
					</div>
				</div>

				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Implementation</schmancy-typography>
					
					<div class="space-y-6">
						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">1. Set a default component</schmancy-typography>
							<schmancy-code-preview language="html">
${`<!-- Using component tag name -->
<schmancy-area name="my-area" default="empty-state"></schmancy-area>

<!-- Using property binding -->
<schmancy-area name="my-area" .default=\${'empty-state'}></schmancy-area>`}
							</schmancy-code-preview>
						</div>

						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">2. Create default component</schmancy-typography>
							<schmancy-code-preview language="javascript">
${`import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('empty-state')
class EmptyState extends LitElement {
  render() {
    return html\`
      <div class="empty-state">
        <p>No content available</p>
        <button>Add Content</button>
      </div>
    \`
  }
}`}
							</schmancy-code-preview>
						</div>

						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">3. Dynamic default components</schmancy-typography>
							<schmancy-code-preview language="javascript">
${`// Change default component dynamically
const area = document.querySelector('schmancy-area')
area.default = 'loading-state'

// Or use different defaults based on state
const defaultComponent = isLoading ? 'loading-state' : 'empty-state'
html\`<schmancy-area name="content" .default=\${defaultComponent}></schmancy-area>\``}
							</schmancy-code-preview>
						</div>

						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">4. Common patterns</schmancy-typography>
							<schmancy-code-preview language="javascript">
${`// Loading pattern
async function loadData() {
  // Show loading state
  area.pop('content-area')
  
  try {
    const data = await fetchData()
    area.push({
      area: 'content-area',
      component: 'content-view',
      params: { data }
    })
  } catch (error) {
    area.push({
      area: 'content-area',
      component: 'error-state',
      params: { message: error.message }
    })
  }
}`}
							</schmancy-code-preview>
						</div>
					</div>
				</div>

				<div>
					<schmancy-typography type="title" token="lg" class="mb-4 block">Use Cases</schmancy-typography>
					<ul class="list-disc ml-6 space-y-2">
						<li><strong>Empty States:</strong> Show helpful messages when no data is available</li>
						<li><strong>Loading States:</strong> Display spinners or skeletons while fetching data</li>
						<li><strong>Error States:</strong> Show error messages with retry options</li>
						<li><strong>Onboarding:</strong> Guide new users with placeholder content</li>
						<li><strong>Permission States:</strong> Show access denied messages</li>
						<li><strong>Offline States:</strong> Display offline indicators</li>
					</ul>
				</div>
			</schmancy-surface>
		`
	}

	private loadContent(areaName: string) {
		area.push({
			area: areaName,
			component: 'area-default-article'
		})
	}

	private clearArea(areaName: string) {
		area.pop(areaName)
	}

	private simulateLoading() {
		// Clear to show loading state
		area.pop('default-demo-loading')
		
		// Simulate async loading
		setTimeout(() => {
			area.push({
				area: 'default-demo-loading',
				component: 'area-default-article'
			})
		}, 2000)
	}

	private showError() {
		area.push({
			area: 'default-demo-error',
			component: 'area-default-error-state',
			params: {
				message: 'Failed to load content. Please try again.'
			}
		})
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		// Clean up when leaving the demo
		area.pop('default-demo-empty')
		area.pop('default-demo-loading')
		area.pop('default-demo-error')
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-area-default': DemoAreaDefault
		'area-default-empty-state': AreaDefaultEmptyState
		'area-default-loading-state': AreaDefaultLoadingState
		'area-default-error-state': AreaDefaultErrorState
		'area-default-article': AreaDefaultArticle
	}
}