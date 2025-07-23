import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import '../shared/installation-section'

@customElement('demo-chips')
export class DemoChips extends $LitElement() {
	@state()
	private selectedSingle: string = 'javascript'

	@state()
	private selectedMultiple: string[] = ['react', 'vue']

	@state()
	private selectedSize: string = 'md'

	@state()
	private selectedCategories: string[] = ['electronics', 'books']

	@state()
	private selectedSkills: string[] = ['javascript', 'html']

	private handleSingleChange(e: CustomEvent<string>) {
		this.selectedSingle = e.detail
	}

	private handleMultipleChange(e: CustomEvent<string[]>) {
		this.selectedMultiple = e.detail
	}

	render() {
		return html`
			<schmancy-surface class="p-8">
				<!-- Component Title -->
				<schmancy-typography type="display" token="lg" class="mb-4 block">
					Chips
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					Interactive chips for selections, filters, and tags with single or multiple selection support.
				</schmancy-typography>

				<!-- Installation -->
				<installation-section></installation-section>

				<!-- Import -->
				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
					<schmancy-code-preview language="javascript">
						import '@mhmo91/schmancy/chips' // Chips container
						import '@mhmo91/schmancy/chip'  // Individual chip
					</schmancy-code-preview>
				</div>

				<!-- API Reference -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-4 block">API Reference</schmancy-typography>
					
					<!-- Single Chip Component -->
					<schmancy-typography type="title" token="md" class="mb-2 block">schmancy-chip</schmancy-typography>
					<schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden mb-6">
						<table class="w-full">
							<thead class="bg-surface-container">
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
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">value</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">string</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">''</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Value for selection purposes</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">selected</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">false</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Whether the chip is selected</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">icon</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">string</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">''</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Emoji icon to display</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">readOnly</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">false</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Makes chip non-interactive</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">disabled</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">false</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Disable the chip</schmancy-typography>
									</td>
								</tr>
							</tbody>
						</table>
					</schmancy-surface>

					<!-- Chips Container Component -->
					<schmancy-typography type="title" token="md" class="mb-2 block">schmancy-chips</schmancy-typography>
					<schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden">
						<table class="w-full">
							<thead class="bg-surface-container">
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
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">multi</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">false</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Enable multiple selection mode</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">value</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">string</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">''</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Selected value (single selection)</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">values</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">string[]</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">[]</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Selected values (multiple selection)</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">wrap</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">true</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Whether chips wrap to new lines</schmancy-typography>
									</td>
								</tr>
							</tbody>
						</table>
					</schmancy-surface>
				</div>

				<!-- Events -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Events</schmancy-typography>
					<schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden">
						<table class="w-full">
							<thead class="bg-surface-container">
								<tr>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Event</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Component</schmancy-typography>
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
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">@change</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">schmancy-chip</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">{value: string, selected: boolean}</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Fires when chip selection changes</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">@change</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">schmancy-chips</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">string | string[]</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Fires when container selection changes</schmancy-typography>
									</td>
								</tr>
							</tbody>
						</table>
					</schmancy-surface>
				</div>

				<!-- Examples -->
				<div>
					<schmancy-typography type="title" token="lg" class="mb-6 block">Examples</schmancy-typography>
					
					<schmancy-grid gap="lg" class="w-full">
						<!-- Basic Chips -->
						<schmancy-code-preview language="html">
							<div class="flex flex-wrap gap-2">
								<schmancy-chip value="basic">Basic</schmancy-chip>
								<schmancy-chip value="javascript" icon="📝">JavaScript</schmancy-chip>
								<schmancy-chip value="react" icon="⚛️">React</schmancy-chip>
								<schmancy-chip value="vue" icon="💚">Vue</schmancy-chip>
								<schmancy-chip value="angular" icon="🅰️">Angular</schmancy-chip>
							</div>
						</schmancy-code-preview>

						<!-- Chips with Icons -->
						<schmancy-code-preview language="html">
							<div class="flex flex-wrap gap-2">
								<schmancy-chip value="edit">
									<schmancy-icon>edit</schmancy-icon>
									Edit
								</schmancy-chip>
								<schmancy-chip value="delete">
									<schmancy-icon>delete</schmancy-icon>
									Delete
								</schmancy-chip>
								<schmancy-chip value="star" selected>
									<schmancy-icon>star</schmancy-icon>
									Starred
								</schmancy-chip>
							</div>
						</schmancy-code-preview>

						<!-- Chips with Complex Content -->
						<schmancy-code-preview language="html">
							<div class="flex flex-wrap gap-2">
								<!-- User chip with avatar -->
								<schmancy-chip value="user1" class="flex items-center gap-2">
									<schmancy-avatar size="sm">JD</schmancy-avatar>
									<schmancy-typography type="body" token="sm">john.doe@example.com</schmancy-typography>
								</schmancy-chip>
								
								<!-- Selected user -->
								<schmancy-chip value="user2" selected class="flex items-center gap-2">
									<schmancy-avatar size="sm">AS</schmancy-avatar>
									<schmancy-typography type="body" token="sm">alice.smith@example.com</schmancy-typography>
								</schmancy-chip>

								<!-- With remove button -->
								<schmancy-chip value="tag1" class="flex items-center gap-2 pr-1">
									<span>Important</span>
									<schmancy-icon size="sm" class="opacity-60 hover:opacity-100">close</schmancy-icon>
								</schmancy-chip>

								<!-- With badge -->
								<schmancy-chip value="notifications" class="flex items-center gap-2">
									<schmancy-icon>notifications</schmancy-icon>
									<span>Notifications</span>
									<schmancy-badge>5</schmancy-badge>
								</schmancy-chip>
							</div>
						</schmancy-code-preview>

						<!-- Single Selection -->
						<schmancy-code-preview language="html">
							<schmancy-chips .value="${this.selectedSingle}" @change="${this.handleSingleChange}">
								<schmancy-chip value="javascript" icon="🟨">JavaScript</schmancy-chip>
								<schmancy-chip value="typescript" icon="🔷">TypeScript</schmancy-chip>
								<schmancy-chip value="python" icon="🐍">Python</schmancy-chip>
								<schmancy-chip value="rust" icon="🦀">Rust</schmancy-chip>
								<schmancy-chip value="go" icon="🐹">Go</schmancy-chip>
							</schmancy-chips>
							<schmancy-typography type="body" token="sm" class="mt-2 block text-surface-onVariant">
								Selected: ${this.selectedSingle}
							</schmancy-typography>
						</schmancy-code-preview>

						<!-- Multiple Selection -->
						<schmancy-code-preview language="html">
							<schmancy-chips multi .values="${this.selectedMultiple}" @change="${this.handleMultipleChange}">
								<schmancy-chip value="react" icon="⚛️">React</schmancy-chip>
								<schmancy-chip value="vue" icon="💚">Vue</schmancy-chip>
								<schmancy-chip value="angular" icon="🅰️">Angular</schmancy-chip>
								<schmancy-chip value="svelte" icon="🔥">Svelte</schmancy-chip>
								<schmancy-chip value="solid" icon="🪨">Solid</schmancy-chip>
							</schmancy-chips>
							<schmancy-typography type="body" token="sm" class="mt-2 block text-surface-onVariant">
								Selected: ${this.selectedMultiple.join(', ')}
							</schmancy-typography>
						</schmancy-code-preview>

						<!-- Size Selector (Single) -->
						<schmancy-code-preview language="html">
							<schmancy-chips .value="${this.selectedSize}" @change="${(e: CustomEvent) => this.selectedSize = e.detail}">
								<schmancy-chip value="xs">XS</schmancy-chip>
								<schmancy-chip value="sm">Small</schmancy-chip>
								<schmancy-chip value="md">Medium</schmancy-chip>
								<schmancy-chip value="lg">Large</schmancy-chip>
								<schmancy-chip value="xl">XL</schmancy-chip>
							</schmancy-chips>
						</schmancy-code-preview>

						<!-- Category Filters (Multiple) -->
						<schmancy-code-preview language="html">
							<schmancy-chips multi .values="${this.selectedCategories}" @change="${(e: CustomEvent) => this.selectedCategories = e.detail}">
								<schmancy-chip value="electronics" icon="💻">Electronics</schmancy-chip>
								<schmancy-chip value="clothing" icon="👕">Clothing</schmancy-chip>
								<schmancy-chip value="books" icon="📚">Books</schmancy-chip>
								<schmancy-chip value="home" icon="🏠">Home & Garden</schmancy-chip>
								<schmancy-chip value="sports" icon="⚽">Sports</schmancy-chip>
								<schmancy-chip value="toys" icon="🧸">Toys & Games</schmancy-chip>
							</schmancy-chips>
						</schmancy-code-preview>

						<!-- Horizontal Scrolling -->
						<schmancy-code-preview language="html">
							<schmancy-chips wrap="false" class="overflow-x-auto">
								<schmancy-chip value="mon">Monday</schmancy-chip>
								<schmancy-chip value="tue">Tuesday</schmancy-chip>
								<schmancy-chip value="wed">Wednesday</schmancy-chip>
								<schmancy-chip value="thu">Thursday</schmancy-chip>
								<schmancy-chip value="fri">Friday</schmancy-chip>
								<schmancy-chip value="sat">Saturday</schmancy-chip>
								<schmancy-chip value="sun">Sunday</schmancy-chip>
							</schmancy-chips>
						</schmancy-code-preview>

						<!-- Read-only Status Chips -->
						<schmancy-code-preview language="html">
							<div class="flex flex-wrap gap-2">
								<schmancy-chip value="completed" icon="✅" readOnly selected>Completed</schmancy-chip>
								<schmancy-chip value="pending" icon="⏳" readOnly>Pending</schmancy-chip>
								<schmancy-chip value="cancelled" icon="❌" readOnly>Cancelled</schmancy-chip>
								<schmancy-chip value="approved" icon="👍" readOnly selected>Approved</schmancy-chip>
							</div>
						</schmancy-code-preview>

						<!-- Disabled Chips -->
						<schmancy-code-preview language="html">
							<div class="flex flex-wrap gap-2">
								<schmancy-chip value="disabled1" disabled>Disabled</schmancy-chip>
								<schmancy-chip value="disabled2" disabled selected>Disabled Selected</schmancy-chip>
								<schmancy-chip value="disabled3" disabled icon="🚫">With Icon</schmancy-chip>
							</div>
						</schmancy-code-preview>

						<!-- Skills Selection with Dynamic Data -->
						<schmancy-code-preview language="javascript">
							const skills = [
								{ id: 'javascript', name: 'JavaScript', icon: '🟨' },
								{ id: 'html', name: 'HTML', icon: '🟧' },
								{ id: 'css', name: 'CSS', icon: '🟦' },
								{ id: 'react', name: 'React', icon: '⚛️' },
								{ id: 'node', name: 'Node.js', icon: '🟩' }
							];
							
							html\`
								<schmancy-chips multi .values="\${this.selectedSkills}" @change="\${this.handleSkillsChange}">
									\${skills.map(skill => html\`
										<schmancy-chip value="\${skill.id}" icon="\${skill.icon}">
											\${skill.name}
										</schmancy-chip>
									\`)}
								</schmancy-chips>
							\`
						</schmancy-code-preview>

						<!-- Real-World Example: Filter Bar -->
						<schmancy-code-preview language="html">
							<schmancy-card>
								<div class="p-4 space-y-4">
									<schmancy-typography type="title" token="md" class="block">Product Filters</schmancy-typography>
									
									<div class="space-y-3">
										<schmancy-typography type="label" token="sm" class="block text-surface-onVariant">Categories</schmancy-typography>
										<schmancy-chips multi .values="${['electronics', 'books']}">
											<schmancy-chip value="electronics" icon="💻">Electronics</schmancy-chip>
											<schmancy-chip value="clothing" icon="👕">Clothing</schmancy-chip>
											<schmancy-chip value="books" icon="📚">Books</schmancy-chip>
											<schmancy-chip value="home" icon="🏠">Home</schmancy-chip>
										</schmancy-chips>
									</div>
									
									<div class="space-y-3">
										<schmancy-typography type="label" token="sm" class="block text-surface-onVariant">Price Range</schmancy-typography>
										<schmancy-chips .value="${'mid'}">
											<schmancy-chip value="low">$0-50</schmancy-chip>
											<schmancy-chip value="mid">$50-100</schmancy-chip>
											<schmancy-chip value="high">$100-200</schmancy-chip>
											<schmancy-chip value="premium">$200+</schmancy-chip>
										</schmancy-chips>
									</div>
									
									<div class="space-y-3">
										<schmancy-typography type="label" token="sm" class="block text-surface-onVariant">Availability</schmancy-typography>
										<schmancy-chips multi .values="${['in-stock']}">
											<schmancy-chip value="in-stock" icon="✅">In Stock</schmancy-chip>
											<schmancy-chip value="shipping" icon="🚚">Free Shipping</schmancy-chip>
											<schmancy-chip value="sale" icon="🏷️">On Sale</schmancy-chip>
										</schmancy-chips>
									</div>
								</div>
							</schmancy-card>
						</schmancy-code-preview>

						<!-- Tag Input Pattern -->
						<schmancy-code-preview language="html">
							<schmancy-card>
								<div class="p-4 space-y-3">
									<schmancy-typography type="label" token="md" class="block">Selected Tags</schmancy-typography>
									<div class="flex flex-wrap gap-2">
										<schmancy-chip value="design" class="flex items-center gap-1">
											design
											<schmancy-icon size="sm">close</schmancy-icon>
										</schmancy-chip>
										<schmancy-chip value="development" class="flex items-center gap-1">
											development
											<schmancy-icon size="sm">close</schmancy-icon>
										</schmancy-chip>
										<schmancy-chip value="ux" class="flex items-center gap-1">
											user experience
											<schmancy-icon size="sm">close</schmancy-icon>
										</schmancy-chip>
										<schmancy-button variant="text" class="h-8">
											<schmancy-icon slot="prefix">add</schmancy-icon>
											Add Tag
										</schmancy-button>
									</div>
								</div>
							</schmancy-card>
						</schmancy-code-preview>
					</schmancy-grid>
				</div>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-chips': DemoChips
	}
}