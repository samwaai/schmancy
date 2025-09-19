import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import '../../shared/installation-section'

@customElement('demo-core-cards')
export class DemoCoreCards extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-8">
				<!-- Component Title -->
				<schmancy-typography type="display" token="lg" class="mb-4 block">
					Card
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					Material Design 3 cards for displaying content in a contained, elevated surface.
				</schmancy-typography>

				<!-- Installation -->
				<installation-section></installation-section>

				<!-- Import -->
				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
					<schmancy-code-preview language="javascript">
						import '@mhmo91/schmancy/card'
					</schmancy-code-preview>
				</div>

				<!-- API Reference -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-4 block">API Reference</schmancy-typography>

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
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">type</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											'elevated' | 'filled' | 'outlined'
										</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">'elevated'</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Visual style of the card</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">interactive</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">false</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Makes the card clickable with hover/focus states</schmancy-typography>
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
										<schmancy-typography type="body" token="sm">false</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Disables the card interaction</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">dragged</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">false</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Indicates the card is being dragged</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">href</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">string</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">undefined</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">URL to navigate to when clicked</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">target</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">string</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">undefined</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Target for link navigation (e.g., '_blank')</schmancy-typography>
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
						<!-- Basic Card Types -->
						<schmancy-code-preview language="html">
							<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
								<!-- Elevated Card -->
								<schmancy-card type="elevated" class="p-4">
									<schmancy-typography type="headline" token="md" class="mb-2">Elevated Card</schmancy-typography>
									<schmancy-typography type="body" token="sm" class="text-surface-onVariant mb-3">Subtle shadow effect</schmancy-typography>
									<schmancy-typography type="body" token="md">
										Cards contain content and actions about a single subject. The elevated style provides a subtle depth.
									</schmancy-typography>
								</schmancy-card>

								<!-- Filled Card -->
								<schmancy-card type="filled" class="p-4">
									<schmancy-typography type="headline" token="md" class="mb-2">Filled Card</schmancy-typography>
									<schmancy-typography type="body" token="sm" class="text-surface-onVariant mb-3">Background fill style</schmancy-typography>
									<schmancy-typography type="body" token="md">
										Cards contain content and actions about a single subject. The filled style uses a surface color.
									</schmancy-typography>
								</schmancy-card>

								<!-- Outlined Card -->
								<schmancy-card type="outlined" class="p-4">
									<schmancy-typography type="headline" token="md" class="mb-2">Outlined Card</schmancy-typography>
									<schmancy-typography type="body" token="sm" class="text-surface-onVariant mb-3">Border style</schmancy-typography>
									<schmancy-typography type="body" token="md">
										Cards contain content and actions about a single subject. The outlined style has a subtle border.
									</schmancy-typography>
								</schmancy-card>
							</div>
						</schmancy-code-preview>

						<!-- Interactive Cards -->
						<schmancy-code-preview language="html">
							<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
								<!-- Interactive Elevated -->
								<schmancy-card type="elevated" interactive class="p-4">
									<schmancy-typography type="headline" token="md" class="mb-2">Clickable Card</schmancy-typography>
									<schmancy-typography type="body" token="md">
										This card is interactive. Click to see the ripple effect and hover for elevation change.
									</schmancy-typography>
								</schmancy-card>

								<!-- Card with Link -->
								<schmancy-card type="outlined" interactive href="https://material.io" target="_blank" class="p-4">
									<schmancy-typography type="headline" token="md" class="mb-2">Link Card</schmancy-typography>
									<schmancy-typography type="body" token="md">
										This card navigates to Material Design website when clicked.
									</schmancy-typography>
								</schmancy-card>

								<!-- Disabled Card -->
								<schmancy-card type="filled" interactive disabled class="p-4">
									<schmancy-typography type="headline" token="md" class="mb-2">Disabled Card</schmancy-typography>
									<schmancy-typography type="body" token="md">
										This card is disabled and cannot be interacted with.
									</schmancy-typography>
								</schmancy-card>
							</div>
						</schmancy-code-preview>

						<!-- Card with Image -->
						<schmancy-code-preview language="html">
							<schmancy-card type="elevated" class="max-w-sm overflow-hidden">
								<img
									src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"
									alt="Red sneaker"
									class="w-full h-48 object-cover"
								/>
								<div class="p-4">
									<schmancy-typography type="headline" token="lg" class="mb-1">Running Shoes</schmancy-typography>
									<schmancy-typography type="title" token="md" class="text-primary-default mb-3">$129.99</schmancy-typography>
									<schmancy-typography type="body" token="md" class="mb-4">
										Premium running shoes designed for comfort and performance on any terrain.
									</schmancy-typography>
									<div class="flex gap-2">
										<schmancy-button variant="filled">Add to Cart</schmancy-button>
										<schmancy-button variant="text">Learn More</schmancy-button>
									</div>
								</div>
							</schmancy-card>
						</schmancy-code-preview>

						<!-- Interactive Product Grid -->
						<schmancy-code-preview language="html">
							<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								<!-- Product Card 1 -->
								<schmancy-card type="outlined" interactive class="overflow-hidden">
									<img
										src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"
										alt="Watch"
										class="w-full h-48 object-cover"
									/>
									<div class="p-4">
										<schmancy-typography type="headline" token="md" class="mb-1">Classic Watch</schmancy-typography>
										<schmancy-typography type="body" token="sm" class="text-surface-onVariant mb-2">Timeless design</schmancy-typography>
										<schmancy-typography type="body" token="md" class="mb-4">
											Elegant timepiece with leather strap and precision movement.
										</schmancy-typography>
										<schmancy-button variant="filled tonal" width="full">View Details</schmancy-button>
									</div>
								</schmancy-card>

								<!-- Product Card 2 -->
								<schmancy-card type="outlined" interactive class="overflow-hidden">
									<img
										src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400"
										alt="Sunglasses"
										class="w-full h-48 object-cover"
									/>
									<div class="p-4">
										<schmancy-typography type="headline" token="md" class="mb-1">Sunglasses</schmancy-typography>
										<schmancy-typography type="body" token="sm" class="text-surface-onVariant mb-2">UV Protection</schmancy-typography>
										<schmancy-typography type="body" token="md" class="mb-4">
											Stylish sunglasses with 100% UV protection and polarized lenses.
										</schmancy-typography>
										<schmancy-button variant="filled tonal" width="full">View Details</schmancy-button>
									</div>
								</schmancy-card>

								<!-- Product Card 3 -->
								<schmancy-card type="outlined" interactive class="overflow-hidden">
									<img
										src="https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400"
										alt="Headphones"
										class="w-full h-48 object-cover"
									/>
									<div class="p-4">
										<schmancy-typography type="headline" token="md" class="mb-1">Headphones</schmancy-typography>
										<schmancy-typography type="body" token="sm" class="text-surface-onVariant mb-2">Noise Cancelling</schmancy-typography>
										<schmancy-typography type="body" token="md" class="mb-4">
											Premium sound quality with active noise cancellation technology.
										</schmancy-typography>
										<schmancy-button variant="filled tonal" width="full">View Details</schmancy-button>
									</div>
								</schmancy-card>
							</div>
						</schmancy-code-preview>

						<!-- Horizontal Card -->
						<schmancy-code-preview language="html">
							<schmancy-card type="elevated" class="max-w-2xl overflow-hidden">
								<div class="flex flex-col md:flex-row">
									<img
										src="https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=200"
										alt="Breakfast"
										class="w-full md:w-48 h-48 md:h-auto object-cover"
									/>
									<div class="flex-1 p-4">
										<schmancy-typography type="headline" token="lg" class="mb-1">Healthy Breakfast</schmancy-typography>
										<schmancy-typography type="body" token="sm" class="text-surface-onVariant mb-3">Start your day right</schmancy-typography>
										<schmancy-typography type="body" token="md" class="mb-4">
											Nutritious breakfast bowl with fresh fruits, granola, and yogurt. Perfect for a healthy morning routine.
										</schmancy-typography>
										<div class="flex gap-2">
											<schmancy-button variant="text">View Recipe</schmancy-button>
											<schmancy-button variant="text">Save</schmancy-button>
										</div>
									</div>
								</div>
							</schmancy-card>
						</schmancy-code-preview>

						<!-- Card with Rich Content -->
						<schmancy-code-preview language="html">
							<schmancy-card type="filled" class="max-w-md bg-gradient-to-br from-primary-container to-secondary-container p-6">
								<schmancy-typography type="label" token="lg" class="text-primary-onContainer mb-2">SPECIAL OFFER</schmancy-typography>
								<schmancy-typography type="headline" token="xl" class="text-primary-onContainer mb-2">20% Off Premium</schmancy-typography>
								<schmancy-typography type="body" token="lg" class="text-primary-onContainer mb-6">
									Get 20% off on all premium memberships this month. Don't miss out on exclusive features and benefits!
								</schmancy-typography>
								<schmancy-button variant="filled" class="bg-primary text-primary-on">
									Claim Offer
								</schmancy-button>
							</schmancy-card>
						</schmancy-code-preview>

						<!-- Article Card -->
						<schmancy-code-preview language="html">
							<schmancy-card type="outlined" interactive class="max-w-md p-4">
								<schmancy-typography type="label" token="sm" class="text-primary-default mb-2">TECHNOLOGY</schmancy-typography>
								<schmancy-typography type="headline" token="lg" class="mb-1">The Future of Web Development</schmancy-typography>
								<schmancy-typography type="body" token="sm" class="text-surface-onVariant mb-3">5 min read • March 15, 2024</schmancy-typography>
								<schmancy-typography type="body" token="md" class="mb-4">
									Explore the latest trends in web development, from Web Components to edge computing,
									and learn how these technologies are shaping the future of the internet.
								</schmancy-typography>
								<div class="flex gap-2">
									<schmancy-button variant="text">Read More</schmancy-button>
									<schmancy-icon-button>
										<schmancy-icon>share</schmancy-icon>
									</schmancy-icon-button>
									<schmancy-icon-button>
										<schmancy-icon>bookmark_border</schmancy-icon>
									</schmancy-icon-button>
								</div>
							</schmancy-card>
						</schmancy-code-preview>

						<!-- Card Grid with Hover Effects -->
						<schmancy-code-preview language="html">
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<!-- Stats Card -->
								<schmancy-card type="elevated" interactive class="p-6">
									<div class="flex items-center justify-between mb-4">
										<schmancy-icon class="text-primary-default">trending_up</schmancy-icon>
										<schmancy-typography type="label" token="md" class="text-surface-onVariant">+12%</schmancy-typography>
									</div>
									<schmancy-typography type="display" token="sm" class="mb-2">2,543</schmancy-typography>
									<schmancy-typography type="body" token="md" class="text-surface-onVariant">Active users this month</schmancy-typography>
								</schmancy-card>

								<!-- Info Card -->
								<schmancy-card type="elevated" interactive class="p-6">
									<div class="flex items-center justify-between mb-4">
										<schmancy-icon class="text-secondary-default">analytics</schmancy-icon>
										<schmancy-typography type="label" token="md" class="text-surface-onVariant">Live</schmancy-typography>
									</div>
									<schmancy-typography type="display" token="sm" class="mb-2">98.5%</schmancy-typography>
									<schmancy-typography type="body" token="md" class="text-surface-onVariant">System uptime</schmancy-typography>
								</schmancy-card>
							</div>
						</schmancy-code-preview>
					</schmancy-grid>
				</div>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-core-cards': DemoCoreCards
	}
}