import { $LitElement } from '@mhmo91/schmancy/mixins'
import { area, lazy } from '@mhmo91/schmancy/area'
import { $notify } from '@mhmo91/schmancy/notification'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { BehaviorSubject } from 'rxjs'

// Simple page components
@customElement('public-page')
export class PublicPage extends $LitElement() {
	render() {
		return html`
			<div class="p-4 bg-surface-container rounded">
				<schmancy-typography type="title" token="lg" class="text-primary mb-2">
					🌍 Public Page
				</schmancy-typography>
				<schmancy-typography type="body" token="md">
					This page is accessible to everyone.
				</schmancy-typography>
			</div>
		`
	}
}

@customElement('protected-page')
export class ProtectedPage extends $LitElement() {
	render() {
		return html`
			<div class="p-4 bg-surface-container rounded">
				<schmancy-typography type="title" token="lg" class="text-secondary mb-2">
					🔒 Protected Page
				</schmancy-typography>
				<schmancy-typography type="body" token="md">
					This page is only accessible when authenticated.
				</schmancy-typography>
			</div>
		`
	}
}

// Main Guard Demo Component
@customElement('demo-area-guards')
export class DemoAreaGuards extends $LitElement() {
	// Auth state
	private authState$ = new BehaviorSubject(false)
	@state() private isAuthenticated = false

	connectedCallback() {
		super.connectedCallback()
		this.authState$.subscribe(auth => {
			this.isAuthenticated = auth
		})
	}

	private toggleAuth() {
		this.authState$.next(!this.isAuthenticated)
	}

	render() {
		return html`
			<schmancy-surface class="max-w-4xl mx-auto p-8">
				<schmancy-typography type="headline" token="lg" class="mb-4">
					Route Guards Demo
				</schmancy-typography>

				<!-- Auth Control -->
				<schmancy-surface type="container" class="p-4 rounded-lg mb-6">
					<schmancy-checkbox
						?checked=${this.isAuthenticated}
						@change=${() => this.toggleAuth()}
						label="User is authenticated"
					>
						<schmancy-typography type="body" token="sm" class="mt-2 text-surface-onVariant">
							${this.isAuthenticated ? '✅ Authenticated' : '❌ Not authenticated'}
						</schmancy-typography>
					</schmancy-checkbox>
				</schmancy-surface>

				<!-- Navigation buttons -->
				<div class="mb-6 space-x-2">
					<schmancy-button
						variant="filled tonal"
						@click=${() => area.push({ component: 'public-page', area: 'guard-demo-area' })}
					>
						Go to Public
					</schmancy-button>
					<schmancy-button
						variant="filled tonal"
						color="secondary"
						@click=${() => area.push({ component: 'protected-page', area: 'guard-demo-area' })}
					>
						Go to Protected
					</schmancy-button>
				</div>

				<!-- Area with Routes -->
				<schmancy-surface type="surfaceDim" class="p-6 rounded-lg">
					<schmancy-area name="guard-demo-area">
						<!-- Public route - no guard -->
						<schmancy-route
							when="public-page"
							.component=${lazy(() => Promise.resolve({ default: PublicPage }))}
						></schmancy-route>

						<!-- Protected route - with guard -->
						<schmancy-route
							when="protected-page"
							.component=${lazy(() => Promise.resolve({ default: ProtectedPage }))}
							.guard=${this.authState$.asObservable()}
							@redirect=${()=>{
								$notify.error('Nope u may not!')
								area.push({
									component:'public-page',
									area:'guard-demo-area'
								})
							}}
						></schmancy-route>
					</schmancy-area>
				</schmancy-surface>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-area-guards': DemoAreaGuards
		'public-page': PublicPage
		'protected-page': ProtectedPage
	}
}