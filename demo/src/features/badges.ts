import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('demo-badges')
export default class DemoBadges extends $LitElement(css`
	:host {
		display: block;
	}

	.badge-group {
		margin-bottom: 2rem;
	}

	.badge-row {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.section-title {
		margin-bottom: 0.5rem;
	}
`) {
	protected render() {
		return html`
			<schmancy-grid gap="lg">
				<!-- Title -->
				<schmancy-typography type="headline" token="lg">Badge Component Demo</schmancy-typography>

				<!-- Color Variants -->
				<div class="badge-group">
					<schmancy-typography class="section-title" type="title" token="md">Color Variants</schmancy-typography>
					<div class="badge-row">
						<sch-badge color="primary">Primary</sch-badge>
						<sch-badge color="secondary">Secondary</sch-badge>
						<sch-badge color="tertiary">Tertiary</sch-badge>
						<sch-badge color="success">Success</sch-badge>
						<sch-badge color="warning">Warning</sch-badge>
						<sch-badge color="error">Error</sch-badge>
						<sch-badge color="neutral">Neutral</sch-badge>
					</div>
				</div>

				<!-- Size Variants -->
				<div class="badge-group">
					<schmancy-typography class="section-title" type="title" token="md">Size Variants</schmancy-typography>
					<div class="badge-row">
						<sch-badge size="xs">Extra Small</sch-badge>
						<sch-badge size="sm">Small</sch-badge>
						<sch-badge size="md">Medium (Default)</sch-badge>
						<sch-badge size="lg">Large</sch-badge>
					</div>
				</div>

				<!-- Shape Variants -->
				<div class="badge-group">
					<schmancy-typography class="section-title" type="title" token="md">Shape Variants</schmancy-typography>
					<div class="badge-row">
						<sch-badge shape="pill">Pill (Default)</sch-badge>
						<sch-badge shape="rounded">Rounded</sch-badge>
						<sch-badge shape="square">Square</sch-badge>
					</div>
				</div>

				<!-- Outlined Variants -->
				<div class="badge-group">
					<schmancy-typography class="section-title" type="title" token="md">Outlined Variants</schmancy-typography>
					<div class="badge-row">
						<sch-badge color="primary" outlined>Primary</sch-badge>
						<sch-badge color="secondary" outlined>Secondary</sch-badge>
						<sch-badge color="tertiary" outlined>Tertiary</sch-badge>
						<sch-badge color="success" outlined>Success</sch-badge>
						<sch-badge color="warning" outlined>Warning</sch-badge>
						<sch-badge color="error" outlined>Error</sch-badge>
						<sch-badge color="neutral" outlined>Neutral</sch-badge>
					</div>
				</div>

				<!-- With Icons -->
				<div class="badge-group">
					<schmancy-typography class="section-title" type="title" token="md">With Icons</schmancy-typography>
					<div class="badge-row">
						<sch-badge color="primary" icon="check_circle">Success</sch-badge>
						<sch-badge color="error" icon="error">Error</sch-badge>
						<sch-badge color="warning" icon="warning">Warning</sch-badge>
						<sch-badge color="success" icon="verified">Verified</sch-badge>
						<sch-badge color="neutral" icon="info">Info</sch-badge>
					</div>
				</div>

				<!-- Icon Only -->
				<div class="badge-group">
					<schmancy-typography class="section-title" type="title" token="md">Icon Only</schmancy-typography>
					<div class="badge-row">
						<sch-badge color="primary" icon="check_circle"></sch-badge>
						<sch-badge color="error" icon="error"></sch-badge>
						<sch-badge color="warning" icon="warning"></sch-badge>
						<sch-badge color="success" icon="verified"></sch-badge>
						<sch-badge color="neutral" icon="info"></sch-badge>
					</div>
				</div>

				<!-- Icons with Different Sizes -->
				<div class="badge-group">
					<schmancy-typography class="section-title" type="title" token="md"
						>Icons with Different Sizes</schmancy-typography
					>
					<div class="badge-row">
						<sch-badge size="xs" color="primary" icon="check_circle">XS</sch-badge>
						<sch-badge size="sm" color="secondary" icon="star">SM</sch-badge>
						<sch-badge size="md" color="tertiary" icon="favorite">MD</sch-badge>
						<sch-badge size="lg" color="success" icon="verified">LG</sch-badge>
					</div>
				</div>

				<!-- Pulse Animation -->
				<div class="badge-group">
					<schmancy-typography class="section-title" type="title" token="md">Pulse Animation</schmancy-typography>
					<div class="badge-row">
						<sch-badge color="primary" pulse>Pulsing Badge</sch-badge>
						<sch-badge color="error" icon="error" pulse>Error</sch-badge>
					</div>
				</div>

				<!-- Badge Combinations - Size + Shape + Color -->
				<div class="badge-group">
					<schmancy-typography class="section-title" type="title" token="md">Combined Variations</schmancy-typography>
					<div class="badge-row">
						<sch-badge size="xs" shape="square" color="primary">XS Square</sch-badge>
						<sch-badge size="sm" shape="rounded" color="secondary">SM Rounded</sch-badge>
						<sch-badge size="md" shape="pill" color="tertiary">MD Pill</sch-badge>
						<sch-badge size="lg" shape="square" color="success">LG Square</sch-badge>
					</div>
				</div>

				<!-- Outlined with Icons -->
				<div class="badge-group">
					<schmancy-typography class="section-title" type="title" token="md">Outlined with Icons</schmancy-typography>
					<div class="badge-row">
						<sch-badge color="primary" outlined icon="check_circle">Outlined</sch-badge>
						<sch-badge color="error" outlined icon="error">Error</sch-badge>
						<sch-badge color="warning" outlined icon="warning">Warning</sch-badge>
					</div>
				</div>

				<!-- Number Badges -->
				<div class="badge-group">
					<schmancy-typography class="section-title" type="title" token="md">Number Badges</schmancy-typography>
					<div class="badge-row">
						<sch-badge color="primary" shape="pill">1</sch-badge>
						<sch-badge color="secondary" shape="pill">25</sch-badge>
						<sch-badge color="tertiary" shape="pill">99+</sch-badge>
						<sch-badge color="error" shape="rounded">7</sch-badge>
						<sch-badge color="success" shape="square">3</sch-badge>
					</div>
				</div>

				<!-- Status Indicators -->
				<div class="badge-group">
					<schmancy-typography class="section-title" type="title" token="md">Status Indicators</schmancy-typography>
					<div class="badge-row">
						<sch-badge size="xs" color="success" icon="circle">Active</sch-badge>
						<sch-badge size="xs" color="error" icon="circle">Offline</sch-badge>
						<sch-badge size="xs" color="warning" icon="circle">Away</sch-badge>
						<sch-badge size="xs" color="neutral" icon="circle">Invisible</sch-badge>
					</div>
				</div>

				<!-- Complex Layout -->
				<div class="badge-group">
					<schmancy-typography class="section-title" type="title" token="md">In Context</schmancy-typography>
					<schmancy-surface type="surfaceBright" elevation="1" rounded="all" style="padding: 1rem;">
						<div style="display: flex; align-items: center; gap: 0.5rem;">
							<schmancy-icon>account_circle</schmancy-icon>
							<schmancy-typography type="title" token="sm">User Profile</schmancy-typography>
							<sch-badge color="success" size="xs">Online</sch-badge>
						</div>
						<div style="margin-top: 1rem; display: flex; gap: 1rem;">
							<div>
								<schmancy-typography type="body" token="sm">Messages</schmancy-typography>
								<sch-badge color="primary">12</sch-badge>
							</div>
							<div>
								<schmancy-typography type="body" token="sm">Notifications</schmancy-typography>
								<sch-badge color="error">5</sch-badge>
							</div>
							<div>
								<schmancy-typography type="body" token="sm">Status</schmancy-typography>
								<sch-badge color="success" icon="verified">Verified</sch-badge>
							</div>
						</div>
					</schmancy-surface>
				</div>
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-badges': DemoBadges
	}
}
