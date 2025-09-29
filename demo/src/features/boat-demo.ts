import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import '@schmancy/boat'
import '@schmancy/button'
import '@schmancy/typography'
import '@schmancy/surface'
import '@schmancy/icon'
import '@schmancy/input'
import '@schmancy/chips'
import '@schmancy/chip'
import '@schmancy/badge'
import '@schmancy/code-preview'

@customElement('demo-boat')
export class DemoBoat extends $LitElement() {
	// Main demo boat states
	@state() basicBoatState: 'hidden' | 'minimized' | 'expanded' = 'hidden'
	@state() draggableBoatState: 'hidden' | 'minimized' | 'expanded' = 'hidden'
	@state() interactiveBoatState: 'hidden' | 'minimized' | 'expanded' = 'hidden'

	// Content and interaction states
	@state() selectedFilter: string = 'all'
	@state() taskList = [
		{ id: 1, text: 'Review pull requests', completed: false, priority: 'high' },
		{ id: 2, text: 'Update documentation', completed: true, priority: 'medium' },
		{ id: 3, text: 'Fix critical bug', completed: false, priority: 'high' },
		{ id: 4, text: 'Implement new feature', completed: false, priority: 'low' },
		{ id: 5, text: 'Code review', completed: true, priority: 'medium' },
	]

	// Demo data for filtering
	private demoItems = [
		{ id: 1, name: 'Chat Support', icon: 'chat', description: 'Get help from our support team' },
		{ id: 2, name: 'Settings', icon: 'settings', description: 'Configure your preferences' },
		{ id: 3, name: 'Media Player', icon: 'play_circle', description: 'Control your media playback' },
		{ id: 4, name: 'Quick Notes', icon: 'edit_note', description: 'Jot down quick thoughts' },
	]

	private get filteredTasks() {
		if (this.selectedFilter === 'all') return this.taskList
		if (this.selectedFilter === 'active') return this.taskList.filter(t => !t.completed)
		if (this.selectedFilter === 'completed') return this.taskList.filter(t => t.completed)
		return this.taskList
	}

	private handleFilterChange = (e: CustomEvent) => {
		this.selectedFilter = e.detail.values[0] || 'all'
	}

	private toggleTaskComplete(taskId: number) {
		this.taskList = this.taskList.map(task =>
			task.id === taskId ? { ...task, completed: !task.completed } : task
		)
	}

	render() {
		return html`
			<div class="grid gap-8 pb-32">
				<!-- Component Header -->
				<div class="demo-section">
					<schmancy-typography type="display" token="lg" class="mb-4">
						Boat Component
					</schmancy-typography>
					<schmancy-typography type="body" token="lg" class="text-surface-onVariant">
						A versatile bottom sheet component that slides up from the bottom of the screen. Perfect for chat interfaces,
						media players, quick settings panels, and any content that needs to be accessible but not always visible.
					</schmancy-typography>
				</div>

				<!-- API Documentation -->
				<schmancy-surface type="container" rounded="all" class="p-6">
					<schmancy-typography type="headline" token="md" class="mb-6">
						API Reference
					</schmancy-typography>

					<!-- Properties Table -->
					<schmancy-surface type="surfaceLowest" rounded="all" class="overflow-hidden mb-6">
						<table class="w-full">
							<thead class="bg-surface-dim">
								<tr>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Property</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Type</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Default</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Description</schmancy-typography>
									</th>
								</tr>
							</thead>
							<tbody>
								<tr class="border-t border-outline-variant">
									<td class="p-4">
										<schmancy-badge type="filled">state</schmancy-badge>
									</td>
									<td class="p-4">
										<code class="text-sm">'hidden' | 'minimized' | 'expanded'</code>
									</td>
									<td class="p-4">
										<code class="text-sm">'hidden'</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Controls the visibility state of the boat</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline-variant">
									<td class="p-4">
										<schmancy-badge type="filled">lowered</schmancy-badge>
									</td>
									<td class="p-4">
										<code class="text-sm">boolean</code>
									</td>
									<td class="p-4">
										<code class="text-sm">false</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Reduces elevation when minimized</schmancy-typography>
									</td>
								</tr>
							</tbody>
						</table>
					</schmancy-surface>

					<!-- Events Table -->
					<schmancy-surface type="surfaceLowest" rounded="all" class="overflow-hidden">
						<table class="w-full">
							<thead class="bg-surface-dim">
								<tr>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Event</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Detail</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Description</schmancy-typography>
									</th>
								</tr>
							</thead>
							<tbody>
								<tr class="border-t border-outline-variant">
									<td class="p-4">
										<schmancy-badge>toggle</schmancy-badge>
									</td>
									<td class="p-4">
										<code class="text-sm">'hidden' | 'minimized' | 'expanded'</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Fired when the state changes</schmancy-typography>
									</td>
								</tr>
							</tbody>
						</table>
					</schmancy-surface>
				</schmancy-surface>

				<!-- Key Features -->
				<schmancy-surface type="container" rounded="all" class="p-6">
					<schmancy-typography type="headline" token="md" class="mb-6">
						Key Features
					</schmancy-typography>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="flex gap-2 items-start">
							<schmancy-icon class="text-primary">layers</schmancy-icon>
							<div>
								<schmancy-typography type="title" token="sm">Three States</schmancy-typography>
								<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
									Hidden, minimized, and expanded modes
								</schmancy-typography>
							</div>
						</div>

						<div class="flex gap-2 items-start">
							<schmancy-icon class="text-primary">open_with</schmancy-icon>
							<div>
								<schmancy-typography type="title" token="sm">Draggable</schmancy-typography>
								<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
									Fully draggable with position persistence
								</schmancy-typography>
							</div>
						</div>

						<div class="flex gap-2 items-start">
							<schmancy-icon class="text-primary">animation</schmancy-icon>
							<div>
								<schmancy-typography type="title" token="sm">Smooth Animations</schmancy-typography>
								<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
									Fluid Material Design 3 transitions
								</schmancy-typography>
							</div>
						</div>

						<div class="flex gap-2 items-start">
							<schmancy-icon class="text-primary">memory</schmancy-icon>
							<div>
								<schmancy-typography type="title" token="sm">Position Memory</schmancy-typography>
								<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
									Remembers position across sessions
								</schmancy-typography>
							</div>
						</div>

						<div class="flex gap-2 items-start">
							<schmancy-icon class="text-primary">responsive_layout</schmancy-icon>
							<div>
								<schmancy-typography type="title" token="sm">Responsive</schmancy-typography>
								<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
									Adapts to different screen sizes
								</schmancy-typography>
							</div>
						</div>

						<div class="flex gap-2 items-start">
							<schmancy-icon class="text-primary">tune</schmancy-icon>
							<div>
								<schmancy-typography type="title" token="sm">Customizable</schmancy-typography>
								<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
									Flexible header and content slots
								</schmancy-typography>
							</div>
						</div>
					</div>
				</schmancy-surface>

				<!-- Demo Section 1: Basic Boat -->
				<schmancy-surface type="container" rounded="all" class="p-6">
					<schmancy-typography type="headline" token="md" class="mb-4">
						Basic Boat Example
					</schmancy-typography>
					<schmancy-typography type="body" token="md" class="mb-6 text-surface-onVariant">
						A simple boat with standard controls demonstrating the three states.
					</schmancy-typography>

					<div class="flex gap-4 mb-4">
						<schmancy-button variant="filled" @click=${() => this.basicBoatState = 'minimized'}>
							Show Minimized
						</schmancy-button>
						<schmancy-button variant="filled tonal" @click=${() => this.basicBoatState = 'expanded'}>
							Show Expanded
						</schmancy-button>
						<schmancy-button variant="outlined" @click=${() => this.basicBoatState = 'hidden'}>
							Hide
						</schmancy-button>
					</div>

					<schmancy-typography type="body" token="sm" class="mb-6 text-surface-onVariant">
						Current state: <strong>${this.basicBoatState}</strong>
					</schmancy-typography>

					<schmancy-code-preview language="html">
&lt;schmancy-boat state="minimized" @toggle="${e => handleStateChange(e)}"&gt;
  &lt;div slot="header" class="flex gap-2 items-center"&gt;
    &lt;schmancy-icon&gt;info&lt;/schmancy-icon&gt;
    &lt;schmancy-typography type="title" token="md"&gt;
      Information Panel
    &lt;/schmancy-typography&gt;
  &lt;/div&gt;

  &lt;div class="p-6"&gt;
    &lt;schmancy-typography type="body" token="md"&gt;
      This is the main content area of the boat component.
    &lt;/schmancy-typography&gt;
  &lt;/div&gt;
&lt;/schmancy-boat&gt;
					</schmancy-code-preview>
				</schmancy-surface>

				<!-- Demo Section 2: Draggable Boat -->
				<schmancy-surface type="container" rounded="all" class="p-6">
					<schmancy-typography type="headline" token="md" class="mb-4">
						Draggable Boat Example
					</schmancy-typography>
					<schmancy-typography type="body" token="md" class="mb-6 text-surface-onVariant">
						Drag the boat to reposition it anywhere on screen. Position is saved to localStorage.
					</schmancy-typography>

					<div class="flex gap-4 mb-4">
						<schmancy-button variant="filled" @click=${() => this.draggableBoatState = 'minimized'}>
							<schmancy-icon>open_with</schmancy-icon>
							Show Draggable Boat
						</schmancy-button>
						<schmancy-button variant="outlined" @click=${() => this.draggableBoatState = 'hidden'}>
							Hide
						</schmancy-button>
					</div>

					<schmancy-typography type="body" token="sm" class="mb-6 text-surface-onVariant">
						💡 Tip: Try dragging the minimized boat to different corners of the screen!
					</schmancy-typography>

					<schmancy-code-preview language="typescript">
// The boat component automatically handles dragging
// Position is persisted to localStorage with a unique key
// based on the component's tag name

&lt;schmancy-boat
  state="minimized"
  lowered="true"  // Optional: reduces elevation when minimized
&gt;
  &lt;div slot="header" class="flex gap-2 items-center"&gt;
    &lt;schmancy-icon&gt;drag_indicator&lt;/schmancy-icon&gt;
    &lt;schmancy-typography type="title" token="md"&gt;
      Drag Me!
    &lt;/schmancy-typography&gt;
  &lt;/div&gt;

  &lt;div class="p-4"&gt;
    Content here...
  &lt;/div&gt;
&lt;/schmancy-boat&gt;
					</schmancy-code-preview>
				</schmancy-surface>

				<!-- Demo Section 3: Interactive Content -->
				<schmancy-surface type="container" rounded="all" class="p-6">
					<schmancy-typography type="headline" token="md" class="mb-4">
						Interactive Content Example
					</schmancy-typography>
					<schmancy-typography type="body" token="md" class="mb-6 text-surface-onVariant">
						Boat with interactive elements like filters, forms, and task lists.
					</schmancy-typography>

					<div class="flex gap-4 mb-6">
						<schmancy-button variant="filled" @click=${() => this.interactiveBoatState = 'expanded'}>
							<schmancy-icon>checklist</schmancy-icon>
							Show Task Manager
						</schmancy-button>
						<schmancy-button variant="outlined" @click=${() => this.interactiveBoatState = 'hidden'}>
							Hide
						</schmancy-button>
					</div>

					<schmancy-code-preview language="html">
&lt;schmancy-boat state="expanded"&gt;
  &lt;div slot="header" class="flex gap-2 items-center"&gt;
    &lt;schmancy-icon&gt;checklist&lt;/schmancy-icon&gt;
    &lt;schmancy-typography type="title" token="md"&gt;
      Task Manager
    &lt;/schmancy-typography&gt;
    &lt;schmancy-badge class="ml-2"&gt;5&lt;/schmancy-badge&gt;
  &lt;/div&gt;

  &lt;!-- Filter chips --&gt;
  &lt;div class="p-4 border-b border-outline-variant"&gt;
    &lt;schmancy-chips&gt;
      &lt;schmancy-chip value="all"&gt;All&lt;/schmancy-chip&gt;
      &lt;schmancy-chip value="active"&gt;Active&lt;/schmancy-chip&gt;
      &lt;schmancy-chip value="completed"&gt;Completed&lt;/schmancy-chip&gt;
    &lt;/schmancy-chips&gt;
  &lt;/div&gt;

  &lt;!-- Task list --&gt;
  &lt;div class="p-4"&gt;
    &lt;!-- Task items... --&gt;
  &lt;/div&gt;
&lt;/schmancy-boat&gt;
					</schmancy-code-preview>
				</schmancy-surface>

				<!-- Live Demo Boats -->

				<!-- Basic Boat -->
				<schmancy-boat
					.state=${this.basicBoatState}
					@toggle=${(e: CustomEvent) => this.basicBoatState = e.detail}
				>
					<div slot="header" class="flex gap-2 items-center">
						<schmancy-icon>info</schmancy-icon>
						<schmancy-typography type="title" token="md">Information Panel</schmancy-typography>
					</div>

					<div class="p-6">
						<schmancy-typography type="headline" token="sm" class="mb-4">
							Welcome to Schmancy Boat!
						</schmancy-typography>
						<schmancy-typography type="body" token="md" class="mb-6">
							This is a basic boat component demonstration. The boat can be minimized to show just the header,
							expanded to show all content, or hidden completely. Try clicking the header to toggle between states!
						</schmancy-typography>

						<div class="grid gap-4">
							${this.demoItems.map(item => html`
								<schmancy-surface type="containerLow" rounded="all" class="p-4">
									<div class="flex gap-2 items-center">
										<schmancy-icon>${item.icon}</schmancy-icon>
										<div class="flex-1">
											<schmancy-typography type="title" token="sm">${item.name}</schmancy-typography>
											<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
												${item.description}
											</schmancy-typography>
										</div>
									</div>
								</schmancy-surface>
							`)}
						</div>
					</div>
				</schmancy-boat>

				<!-- Draggable Boat -->
				<schmancy-boat
					.state=${this.draggableBoatState}
					lowered
					@toggle=${(e: CustomEvent) => this.draggableBoatState = e.detail}
				>
					<div slot="header" class="flex gap-2 items-center">
						<schmancy-icon>drag_indicator</schmancy-icon>
						<schmancy-typography type="title" token="md">Drag Me!</schmancy-typography>
						<schmancy-badge type="filled" class="ml-auto">Draggable</schmancy-badge>
					</div>

					<div class="p-6">
						<schmancy-typography type="headline" token="sm" class="mb-4">
							Draggable Boat Demo
						</schmancy-typography>
						<schmancy-typography type="body" token="md" class="mb-4">
							This boat can be dragged to any position on the screen. Try dragging it by the header!
							The position will be saved and restored when you reload the page.
						</schmancy-typography>

						<schmancy-surface type="surfaceLowest" rounded="all" class="p-4">
							<schmancy-typography type="title" token="sm" class="mb-2">Features:</schmancy-typography>
							<ul class="space-y-2">
								<li class="flex items-center gap-2">
									<schmancy-icon size="16">check</schmancy-icon>
									<schmancy-typography type="body" token="sm">Drag from header area</schmancy-typography>
								</li>
								<li class="flex items-center gap-2">
									<schmancy-icon size="16">check</schmancy-icon>
									<schmancy-typography type="body" token="sm">Position saved to localStorage</schmancy-typography>
								</li>
								<li class="flex items-center gap-2">
									<schmancy-icon size="16">check</schmancy-icon>
									<schmancy-typography type="body" token="sm">Smart anchor detection</schmancy-typography>
								</li>
								<li class="flex items-center gap-2">
									<schmancy-icon size="16">check</schmancy-icon>
									<schmancy-typography type="body" token="sm">GPU accelerated animations</schmancy-typography>
								</li>
							</ul>
						</schmancy-surface>
					</div>
				</schmancy-boat>

				<!-- Interactive Boat with Task Manager -->
				<schmancy-boat
					.state=${this.interactiveBoatState}
					@toggle=${(e: CustomEvent) => this.interactiveBoatState = e.detail}
				>
					<div slot="header" class="flex gap-2 items-center">
						<schmancy-icon>checklist</schmancy-icon>
						<schmancy-typography type="title" token="md">Task Manager</schmancy-typography>
						<schmancy-badge class="ml-2">${this.filteredTasks.length}</schmancy-badge>
					</div>

					<div class="overflow-y-auto max-h-[60vh]">
						<!-- Filter chips -->
						<div class="p-4 border-b border-outline-variant bg-surface-container sticky top-0 z-10">
							<schmancy-chips .values=${[this.selectedFilter]} @change=${this.handleFilterChange}>
								<schmancy-chip value="all">
									<section class="flex items-center gap-1">
										<schmancy-icon size="14px">list</schmancy-icon>
										<span>All (${this.taskList.length})</span>
									</section>
								</schmancy-chip>
								<schmancy-chip value="active">
									<section class="flex items-center gap-1">
										<schmancy-icon size="14px">pending</schmancy-icon>
										<span>Active (${this.taskList.filter(t => !t.completed).length})</span>
									</section>
								</schmancy-chip>
								<schmancy-chip value="completed">
									<section class="flex items-center gap-1">
										<schmancy-icon size="14px">check_circle</schmancy-icon>
										<span>Done (${this.taskList.filter(t => t.completed).length})</span>
									</section>
								</schmancy-chip>
							</schmancy-chips>
					</div>

					<!-- Task items -->
					<div class="p-4 space-y-2">
						${this.filteredTasks.map(task => html`
							<schmancy-surface
								type="containerLow"
								rounded="all"
								class="p-3 cursor-pointer transition-all hover:elevation-2"
								@click=${() => this.toggleTaskComplete(task.id)}
							>
								<div class="flex items-center gap-3">
									<schmancy-icon>
										${task.completed ? 'check_box' : 'check_box_outline_blank'}
									</schmancy-icon>
									<div class="flex-1">
										<schmancy-typography
											type="body"
											token="md"
											class="${task.completed ? 'line-through opacity-60' : ''}"
										>
											${task.text}
										</schmancy-typography>
									</div>
									<schmancy-badge
										type="${task.priority === 'high' ? 'filled' : 'tonal'}"
										class="text-xs"
									>
										${task.priority}
									</schmancy-badge>
								</div>
							</schmancy-surface>
						`)}

						${this.filteredTasks.length === 0 ? html`
							<schmancy-surface type="surfaceLowest" rounded="all" class="p-8 text-center">
								<schmancy-icon size="48" class="text-surface-onVariant opacity-50">inbox</schmancy-icon>
								<schmancy-typography type="body" token="md" class="mt-4 text-surface-onVariant">
									No tasks found
								</schmancy-typography>
							</schmancy-surface>
						` : ''}
					</div>
				</div>
				</schmancy-boat>
			</div>
		`
	}
}

export default DemoBoat