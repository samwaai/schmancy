import { $LitElement } from '@mhmo91/schmancy/mixins'
import '@mhmo91/schmancy/nav-drawer'
import '@mhmo91/schmancy/navigation-rail'
import { theme } from '@mhmo91/schmancy/theme'
import { html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'

@customElement('fullscreen-mode-demo')
export class FullscreenModeDemo extends $LitElement(css`
	:host {
		display: block;
		height: 100vh;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	.demo-container {
		height: 100vh;
		display: flex;
		background: var(--schmancy-sys-color-surface-container);
	}

	.content {
		flex: 1;
		padding: 2rem;
		overflow: auto;
	}

	.sidebar {
		width: 280px;
		background: var(--schmancy-sys-color-surface-container-low);
		padding: 1.5rem;
		border-right: 1px solid var(--schmancy-sys-color-outline-variant);
	}

	.controls {
		background: var(--schmancy-sys-color-surface);
		padding: 1.5rem;
		border-radius: 12px;
		margin-bottom: 2rem;
	}

	.status {
		background: var(--schmancy-sys-color-primary-container);
		color: var(--schmancy-sys-color-on-primary-container);
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 1rem;
		font-weight: 500;
	}

	h1, h2 {
		margin: 0 0 1rem 0;
		color: var(--schmancy-sys-color-on-surface);
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	li {
		padding: 0.75rem;
		background: var(--schmancy-sys-color-surface-container-high);
		border-radius: 8px;
		color: var(--schmancy-sys-color-on-surface-variant);
	}

	.icon-status {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 1rem;
	}
`) {
	@state()
	private isFullscreen = false

	@state()
	private activeNavIndex = 0

	render() {
		return html`
			<div class="demo-container">
				<!-- Navigation Rail -->
				<schmancy-navigation-rail
					.activeIndex=${this.activeNavIndex}
					@navigate=${(e: CustomEvent) => {
						console.log('Navigation:', e.detail)
					}}
				>
					<schmancy-button slot="fab" variant="filled">
						<schmancy-icon>add</schmancy-icon>
					</schmancy-button>

					<schmancy-navigation-rail-item value="home">
						<schmancy-icon slot="icon">home</schmancy-icon>
						Home
					</schmancy-navigation-rail-item>
					<schmancy-navigation-rail-item value="search">
						<schmancy-icon slot="icon">search</schmancy-icon>
						Search
					</schmancy-navigation-rail-item>
					<schmancy-navigation-rail-item value="favorites">
						<schmancy-icon slot="icon">favorite</schmancy-icon>
						Favorites
					</schmancy-navigation-rail-item>
					<schmancy-navigation-rail-item value="settings">
						<schmancy-icon slot="icon">settings</schmancy-icon>
						Settings
					</schmancy-navigation-rail-item>
				</schmancy-navigation-rail>

				<!-- Nav Drawer -->
				<schmancy-nav-drawer>
					<!-- Sidebar Content -->
					<div class="sidebar">
						<h2>Navigation Drawer</h2>
						<schmancy-typography variant="body" size="medium" class="mb-4">
							This drawer content should also hide in fullscreen mode.
						</schmancy-typography>
						<ul>
							<li>Dashboard</li>
							<li>Analytics</li>
							<li>Reports</li>
							<li>Users</li>
							<li>Settings</li>
						</ul>
					</div>

					<!-- Main Content Area -->
					<div class="content">
						<h1>Fullscreen Mode Demo</h1>

						<div class="controls">
							<div class="status">
								${this.isFullscreen ? 'Fullscreen Mode Active' : 'Normal Mode'}
							</div>

							<schmancy-button
								variant="filled"
								@click=${this.toggleFullscreen}
							>
								<schmancy-icon>${this.isFullscreen ? 'fullscreen_exit' : 'fullscreen'}</schmancy-icon>
								${this.isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
							</schmancy-button>

							<div class="icon-status">
								<schmancy-icon>info</schmancy-icon>
								<schmancy-typography variant="body" size="small">
									Navigation components ${this.isFullscreen ? 'hidden' : 'visible'}
								</schmancy-typography>
							</div>
						</div>

						<schmancy-surface type="filled" class="p-6">
							<h2>How It Works</h2>
							<schmancy-typography variant="body" size="medium">
								This demo shows how the navigation components respond to fullscreen mode:
							</schmancy-typography>

							<ul class="mt-4">
								<li>
									<strong>Navigation Rail:</strong> Collapses width to 0 with smooth animation, removing it from the layout flow.
								</li>
								<li>
									<strong>Nav Drawer:</strong> Collapses its grid column, hiding the sidebar and expanding content to full width.
								</li>
								<li>
									<strong>Transition:</strong> Both components animate smoothly using the Material Design emphasis timing.
								</li>
								<li>
									<strong>Event System:</strong> Uses a global 'fullscreen' event that components listen to.
								</li>
							</ul>
						</schmancy-surface>

						<schmancy-surface type="filled" class="p-6 mt-4">
							<h2>Implementation</h2>
							<pre><code>// Trigger fullscreen mode
theme.setFullscreen(true)

// Or dispatch the event directly
window.dispatchEvent(new CustomEvent('fullscreen', {
    detail: true
}))

// Components automatically respond to the event</code></pre>
						</schmancy-surface>
					</div>
				</schmancy-nav-drawer>
			</div>
		`
	}

	private toggleFullscreen = () => {
		this.isFullscreen = !this.isFullscreen

		// Use the theme service method
		theme.setFullscreen(this.isFullscreen)

		// Alternative: dispatch event directly
		// window.dispatchEvent(new CustomEvent('fullscreen', {
		//     detail: this.isFullscreen
		// }))
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'fullscreen-mode-demo': FullscreenModeDemo
	}
}