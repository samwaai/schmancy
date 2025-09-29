import { animate } from '@lit-labs/motion'
import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

@customElement('demo-navigation-rail')
export default class NavigationRail extends $LitElement() {
	@state() private activeRailItem = 'home'
	@state() private extendedRail = false
	@state() private railWithBadges = 'inbox'

	private railItems = [
		{ id: 'home', icon: 'home', label: 'Home' },
		{ id: 'search', icon: 'search', label: 'Search' },
		{ id: 'favorites', icon: 'favorite', label: 'Favorites' },
		{ id: 'settings', icon: 'settings', label: 'Settings' },
	]

	private badgeItems = [
		{ id: 'inbox', icon: 'inbox', label: 'Inbox', badge: '3' },
		{ id: 'drafts', icon: 'drafts', label: 'Drafts' },
		{ id: 'sent', icon: 'send', label: 'Sent' },
		{ id: 'trash', icon: 'delete', label: 'Trash', badge: '12' },
	]

	render() {
		return html`
			<div class="max-w-6xl mx-auto p-6" ${animate()}>
				<!-- Header -->
				<div class="mb-12 text-center">
					<schmancy-typography type="display" token="lg" class="mb-4"> Navigation Rail </schmancy-typography>
					<schmancy-typography type="body" token="lg" class="text-on-surface-variant max-w-3xl mx-auto">
						Vertical navigation for desktop applications. Rails provide access to primary destinations while maintaining
						a compact footprint.
					</schmancy-typography>
				</div>

				<!-- Basic Rail Demo -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-6"> Basic Navigation Rail </schmancy-typography>
					<schmancy-surface type="container" class="p-6 rounded-xl">
						<div class="flex h-96 rounded-lg overflow-hidden bg-surface">
							<div class="w-20 bg-surface-container flex flex-col items-center py-4 gap-3">
								${this.railItems.map(
									item => html`
										<div
											class="w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer transition-all
                           ${this.activeRailItem === item.id
												? 'bg-secondary-container text-on-secondary-container'
												: 'text-on-surface-variant hover:bg-surface-container-high'}"
											@click=${() => (this.activeRailItem = item.id)}
											title=${item.label}
										>
											<schmancy-icon>${item.icon}</schmancy-icon>
										</div>
									`,
								)}
							</div>
							<div class="flex-1 p-8 flex items-center justify-center text-on-surface">
								<div class="text-center">
									<schmancy-icon size="xl" class="mb-4"
										>${this.railItems.find(i => i.id === this.activeRailItem)?.icon}</schmancy-icon
									>
									<schmancy-typography type="title" token="lg">
										${this.railItems.find(i => i.id === this.activeRailItem)?.label} Section
									</schmancy-typography>
									<schmancy-typography type="body" token="md" class="mt-2 text-on-surface-variant">
										Content for the ${this.railItems.find(i => i.id === this.activeRailItem)?.label.toLowerCase()}
										section would be displayed here.
									</schmancy-typography>
								</div>
							</div>
						</div>
					</schmancy-surface>
				</div>

				<!-- Extended Rail Demo -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-6"> Extended Navigation Rail </schmancy-typography>
					<schmancy-surface type="container" class="p-6 rounded-xl">
						<div class="mb-4">
							<schmancy-button variant="outlined" @click=${() => (this.extendedRail = !this.extendedRail)}>
								${this.extendedRail ? 'Collapse' : 'Extend'} Rail
							</schmancy-button>
						</div>
						<div class="flex h-96 rounded-lg overflow-hidden bg-surface">
							<div
								class="${this.extendedRail
									? 'w-48'
									: 'w-20'} bg-surface-container flex flex-col py-4 transition-all duration-300"
							>
								${this.railItems.map(
									item => html`
										<div
											class="flex items-center cursor-pointer transition-all mx-2 mb-2
                           ${this.extendedRail
												? 'px-4 py-3 rounded-full justify-start gap-3'
												: 'w-14 h-14 rounded-2xl justify-center'}
                           ${this.activeRailItem === item.id
												? 'bg-secondary-container text-on-secondary-container'
												: 'text-on-surface-variant hover:bg-surface-container-high'}"
											@click=${() => (this.activeRailItem = item.id)}
										>
											<schmancy-icon>${item.icon}</schmancy-icon>
											${this.extendedRail
												? html` <schmancy-typography type="body" token="md"> ${item.label} </schmancy-typography> `
												: ''}
										</div>
									`,
								)}
							</div>
							<div class="flex-1 p-8 flex items-center justify-center text-on-surface">
								<div class="text-center">
									<schmancy-typography type="title" token="lg">
										${this.extendedRail ? 'Extended' : 'Compact'} Rail Mode
									</schmancy-typography>
									<schmancy-typography type="body" token="md" class="mt-2 text-on-surface-variant">
										Rails can expand to show labels for better accessibility and clarity.
									</schmancy-typography>
								</div>
							</div>
						</div>
					</schmancy-surface>
				</div>

				<!-- Rail with Badges Demo -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-6"> Navigation Rail with Badges </schmancy-typography>
					<schmancy-surface type="container" class="p-6 rounded-xl">
						<div class="flex h-96 rounded-lg overflow-hidden bg-surface">
							<div class="w-20 bg-surface-container flex flex-col items-center py-4 gap-3">
								${this.badgeItems.map(
									item => html`
										<div
											class="w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer transition-all relative
                           ${this.railWithBadges === item.id
												? 'bg-secondary-container text-on-secondary-container'
												: 'text-on-surface-variant hover:bg-surface-container-high'}"
											@click=${() => (this.railWithBadges = item.id)}
											title=${item.label}
										>
											<schmancy-icon>${item.icon}</schmancy-icon>
											${item.badge
												? html`
														<div
															class="absolute -top-1 -right-1 w-5 h-5 bg-error text-on-error rounded-full flex items-center justify-center text-xs font-medium"
														>
															${item.badge}
														</div>
													`
												: ''}
										</div>
									`,
								)}
							</div>
							<div class="flex-1 p-8 flex items-center justify-center text-on-surface">
								<div class="text-center">
									<schmancy-icon size="xl" class="mb-4"
										>${this.badgeItems.find(i => i.id === this.railWithBadges)?.icon}</schmancy-icon
									>
									<schmancy-typography type="title" token="lg">
										${this.badgeItems.find(i => i.id === this.railWithBadges)?.label}
									</schmancy-typography>
									${this.badgeItems.find(i => i.id === this.railWithBadges)?.badge
										? html`
												<schmancy-typography type="body" token="md" class="mt-2 text-on-surface-variant">
													${this.badgeItems.find(i => i.id === this.railWithBadges)?.badge} unread items
												</schmancy-typography>
											`
										: html`
												<schmancy-typography type="body" token="md" class="mt-2 text-on-surface-variant">
													No unread items
												</schmancy-typography>
											`}
								</div>
							</div>
						</div>
					</schmancy-surface>
				</div>

				<!-- Best Practices -->
				<div class="mt-12">
					<schmancy-typography type="title" token="lg" class="mb-6">
						Navigation Rail Best Practices
					</schmancy-typography>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<schmancy-surface type="containerLow" class="p-6 rounded-lg border-l-4 border-tertiary">
							<schmancy-typography type="title" token="md" class="mb-3 text-tertiary"> ✓ Do </schmancy-typography>
							<ul class="space-y-2 text-on-surface-variant list-none">
								<li class="border-b border-outline-variant pb-2">✓ Use for 3-7 primary destinations</li>
								<li class="border-b border-outline-variant pb-2">✓ Position on the left side for LTR layouts</li>
								<li class="border-b border-outline-variant pb-2">✓ Include clear, recognizable icons</li>
								<li class="border-b border-outline-variant pb-2">✓ Provide tooltips for compact rails</li>
								<li>✓ Use badges sparingly for important notifications</li>
							</ul>
						</schmancy-surface>

						<schmancy-surface type="containerLow" class="p-6 rounded-lg border-l-4 border-error">
							<schmancy-typography type="title" token="md" class="mb-3 text-error"> ✗ Don't </schmancy-typography>
							<ul class="space-y-2 text-on-surface-variant list-none">
								<li class="border-b border-outline-variant pb-2">✗ Use for more than 7 destinations</li>
								<li class="border-b border-outline-variant pb-2">✗ Hide on smaller desktop screens</li>
								<li class="border-b border-outline-variant pb-2">✗ Use unclear or decorative icons</li>
								<li class="border-b border-outline-variant pb-2">✗ Forget to indicate the active destination</li>
								<li>✗ Overcrowd with too many badges</li>
							</ul>
						</schmancy-surface>
					</div>
				</div>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-navigation-rail': NavigationRail
	}
}
