import { $LitElement } from '@mhmo91/schmancy/mixins'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

@customElement('demo-boat')
export default class DemoBoat extends $LitElement() {
	@state() boatState: 'hidden' | 'minimized' | 'expanded' = 'minimized'
	@state() boatWithChipsState: 'hidden' | 'minimized' | 'expanded' = 'hidden'
	@state() selectedFilter: string = 'all'

	// Demo data for filtering
	private demoItems = [
		{ id: 1, name: 'Project Alpha', status: 'active', priority: 'high' },
		{ id: 2, name: 'Project Beta', status: 'inactive', priority: 'low' },
		{ id: 3, name: 'Project Gamma', status: 'active', priority: 'medium' },
		{ id: 4, name: 'Project Delta', status: 'completed', priority: 'high' },
		{ id: 5, name: 'Project Epsilon', status: 'active', priority: 'low' },
	]

	private handleFilterChange = (e: CustomEvent) => {
		this.selectedFilter = e.detail.values[0] || 'all'
	}

	private get filteredItems() {
		if (this.selectedFilter === 'all') return this.demoItems
		return this.demoItems.filter(item => item.status === this.selectedFilter)
	}

	render() {
		return html`
			<schmancy-surface class="p-8">
				<!-- Component Title -->
				<schmancy-typography type="display" token="lg" class="mb-4"> Boat </schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant">
					A bottom sheet component that slides up from the bottom of the screen. Perfect for chat interfaces, media
					players, and quick settings panels.
				</schmancy-typography>

				<!-- API Table -->
				<schmancy-surface class="mb-12 rounded-lg overflow-hidden">
					<table class="w-full">
						<thead class="bg-surface-dim">
							<tr>
								<th class="text-left p-4">
									<schmancy-typography type="label" token="md">Property</schmancy-typography>
								</th>
								<th class="text-left p-4"><schmancy-typography type="label" token="md">Type</schmancy-typography></th>
								<th class="text-left p-4">
									<schmancy-typography type="label" token="md">Default</schmancy-typography>
								</th>
							</tr>
						</thead>
						<tbody>
							<tr class="border-t border-outline">
								<td class="p-4">
									<sch-badge class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded"
										>state</sch-badge
									>
								</td>
								<td class="p-4"><code class="text-sm">'hidden' | 'minimized' | 'expanded'</code></td>
								<td class="p-4"><code class="text-sm">'hidden'</code></td>
							</tr>
						</tbody>
					</table>
				</schmancy-surface>

				<!-- Events Table -->
				<schmancy-surface class="mb-12 rounded-lg overflow-hidden">
					<table class="w-full">
						<thead class="bg-surface-dim">
							<tr>
								<th class="text-left p-4"><schmancy-typography type="label" token="md">Event</schmancy-typography></th>
								<th class="text-left p-4"><schmancy-typography type="label" token="md">Detail</schmancy-typography></th>
								<th class="text-left p-4">
									<schmancy-typography type="label" token="md">Description</schmancy-typography>
								</th>
							</tr>
						</thead>
						<tbody>
							<tr class="border-t border-outline">
								<td class="p-4"><sch-badge type="filled">change</sch-badge></td>
								<td class="p-4"><code class="text-sm">'hidden' | 'minimized' | 'expanded'</code></td>
								<td class="p-4">Fired when the state changes</td>
							</tr>
						</tbody>
					</table>
				</schmancy-surface>

				<!-- Interactive Controls -->
				<schmancy-surface class="mb-8 p-4 rounded-lg">
					<schmancy-grid gap="md">
						<schmancy-typography type="title" token="md">Try it out</schmancy-typography>
						<schmancy-flex gap="md">
							<schmancy-button variant="filled" @click=${() => (this.boatState = 'minimized')}>
								Show Minimized
							</schmancy-button>
							<schmancy-button variant="filled tonal" @click=${() => (this.boatState = 'expanded')}>
								Show Expanded
							</schmancy-button>
							<schmancy-button variant="outlined" @click=${() => (this.boatState = 'hidden')}> Hide </schmancy-button>
						</schmancy-flex>
						<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
							Current state: <strong>${this.boatState}</strong>
						</schmancy-typography>
					</schmancy-grid>
				</schmancy-surface>

				<!-- Example -->
				<schmancy-code-preview language="html">
					&lt;schmancy-boat state="minimized" &lt;schmancy-flex slot="header" gap="sm" content="center"&gt;
					&lt;schmancy-icon&gt;chat&lt;/schmancy-icon&gt; &lt;schmancy-typography type="title" token="md"&gt;Chat
					Support&lt;/schmancy-typography&gt; &lt;/schmancy-flex&gt; &lt;schmancy-flex direction="column" gap="md"
					class="p-4"&gt; &lt;schmancy-typography type="body" token="md"&gt; How can we help you today?
					&lt;/schmancy-typography&gt; &lt;schmancy-button variant="filled"&gt; Start Conversation
					&lt;/schmancy-button&gt; &lt;/schmancy-flex&gt; &lt;/schmancy-boat&gt;
				</schmancy-code-preview>

				<!-- Demo Section: Boat with Interactive Content (Chips) -->
				<schmancy-surface class="mt-12 mb-12 p-8 rounded-lg">
					<schmancy-typography type="headline" token="md" class="mb-4">
						Boat with Interactive Content
					</schmancy-typography>
					<schmancy-typography type="body" token="md" class="mb-6 text-surface-onVariant">
						This demo shows how the boat component handles interactive content like chips. Clicking on chips should NOT
						collapse the boat.
					</schmancy-typography>

					<schmancy-flex gap="md" class="mb-6">
						<schmancy-button variant="filled" @click=${() => (this.boatWithChipsState = 'expanded')}>
							Show Boat with Chips
						</schmancy-button>
						<schmancy-button variant="outlined" @click=${() => (this.boatWithChipsState = 'hidden')}>
							Hide
						</schmancy-button>
					</schmancy-flex>

					<schmancy-code-preview language="html">
						&lt;schmancy-boat state="expanded"&gt; &lt;schmancy-flex slot="header" gap="sm" content="center"&gt;
						&lt;schmancy-icon&gt;filter_list&lt;/schmancy-icon&gt; &lt;schmancy-typography type="title"
						token="md"&gt;Project Filters&lt;/schmancy-typography&gt; &lt;/schmancy-flex&gt; &lt;div class="p-4"&gt;
						&lt;!-- Filter chips - clicking these should NOT collapse the boat --&gt; &lt;schmancy-chips&gt;
						&lt;schmancy-chip value="all"&gt;All&lt;/schmancy-chip&gt; &lt;schmancy-chip
						value="active"&gt;Active&lt;/schmancy-chip&gt; &lt;schmancy-chip
						value="completed"&gt;Completed&lt;/schmancy-chip&gt; &lt;/schmancy-chips&gt; &lt;!-- Filtered content --&gt;
						&lt;div class="mt-4"&gt; &lt;!-- ... filtered items ... --&gt; &lt;/div&gt; &lt;/div&gt;
						&lt;/schmancy-boat&gt;
					</schmancy-code-preview>
				</schmancy-surface>
			</schmancy-surface>

			<!-- Live Demo Boat with Chips -->
			<schmancy-boat
				.state=${this.boatWithChipsState}
				@toggle=${(e: CustomEvent) => (this.boatWithChipsState = e.detail)}
			>
				<schmancy-flex slot="header" gap="sm" center>
					<schmancy-icon>filter_list</schmancy-icon>
					<schmancy-typography type="title" token="md">Project Filters</schmancy-typography>
					<schmancy-badge class="ml-2">${this.filteredItems.length}</schmancy-badge>
				</schmancy-flex>

				<div class="overflow-y-auto max-h-[60vh]">
					<!-- Filter chips at the top -->
					<div class="px-4 py-3 border-b border-outline-variant bg-surface-container">
						<schmancy-chips .values=${[this.selectedFilter]} @change=${this.handleFilterChange}>
							<schmancy-chip value="all">
								<section class="flex items-center gap-1">
									<schmancy-icon size="14px">list</schmancy-icon>
									<span>All (${this.demoItems.length})</span>
								</section>
							</schmancy-chip>
							<schmancy-chip value="active">
								<section class="flex items-center gap-1">
									<schmancy-icon size="14px">radio_button_checked</schmancy-icon>
									<span>Active (${this.demoItems.filter(i => i.status === 'active').length})</span>
								</section>
							</schmancy-chip>
							<schmancy-chip value="completed">
								<section class="flex items-center gap-1">
									<schmancy-icon size="14px">check_circle</schmancy-icon>
									<span>Completed (${this.demoItems.filter(i => i.status === 'completed').length})</span>
								</section>
							</schmancy-chip>
							<schmancy-chip value="inactive">
								<section class="flex items-center gap-1">
									<schmancy-icon size="14px">pause_circle</schmancy-icon>
									<span>Inactive (${this.demoItems.filter(i => i.status === 'inactive').length})</span>
								</section>
							</schmancy-chip>
						</schmancy-chips>
					</div>

					<!-- Filtered items -->
					<div class="p-4 space-y-2">
						${this.filteredItems.map(
							item => html`
								<schmancy-surface type="containerLow" class="p-3 rounded">
									<div class="flex items-center justify-between">
										<div>
											<schmancy-typography type="title" token="sm">${item.name}</schmancy-typography>
											<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
												Status: ${item.status} • Priority: ${item.priority}
											</schmancy-typography>
										</div>
										<schmancy-button variant="text">
											<schmancy-icon>arrow_forward</schmancy-icon>
										</schmancy-button>
									</div>
								</schmancy-surface>
							`,
						)}
					</div>
				</div>
			</schmancy-boat>

			<!-- Original Live Demo Boat -->
			<schmancy-boat .state=${this.boatState} @toggle=${(e: CustomEvent) => (this.boatState = e.detail)}>
				<schmancy-flex slot="header" gap="sm" center>
					<schmancy-icon>sailing</schmancy-icon>
					<schmancy-typography type="title" token="md">Interactive Demo</schmancy-typography>
				</schmancy-flex>

				<schmancy-flex gap="lg" class="p-6 flex-col">
					<schmancy-typography type="headline" token="md"> Welcome to the Boat Component! </schmancy-typography>

					<schmancy-typography type="body" token="md">
						This component slides up from the bottom of the screen and can be minimized to show just the header, or
						expanded to show all content.
					</schmancy-typography>

					<schmancy-flex gap="md">
						<schmancy-button variant="filled">
							<schmancy-icon>thumb_up</schmancy-icon>
							Like
						</schmancy-button>
						<schmancy-button variant="filled tonal">
							<schmancy-icon>share</schmancy-icon>
							Share
						</schmancy-button>
					</schmancy-flex>
				</schmancy-flex>
			</schmancy-boat>
		`
	}
}

