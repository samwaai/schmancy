import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import '../shared/installation-section'

@customElement('demo-card')
export class DemoCard extends $LitElement() {
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
										<schmancy-typography type="label" token="md">Component</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Properties</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Description</schmancy-typography>
									</th>
								</tr>
							</thead>
							<tbody>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">schmancy-card</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											type: 'elevated' | 'filled' | 'outlined'<br>
											elevation: 0 | 1 | 2 | 3 | 4 | 5
										</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Main card container</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">schmancy-card-media</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											src: string<br>
											alt: string<br>
											fit: 'cover' | 'contain' | 'fill' | 'none'
										</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Card media/image section</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">schmancy-card-content</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											slots: headline, subhead, default
										</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Card content area</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">schmancy-card-action</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											-
										</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Card action buttons area</schmancy-typography>
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
								<schmancy-card type="elevated">
									<schmancy-card-content>
										<span slot="headline">Elevated Card</span>
										<span slot="subhead">Subtle shadow</span>
										Cards contain content and actions about a single subject.
									</schmancy-card-content>
								</schmancy-card>

								<!-- Filled Card -->
								<schmancy-card type="filled">
									<schmancy-card-content>
										<span slot="headline">Filled Card</span>
										<span slot="subhead">Background fill</span>
										Cards contain content and actions about a single subject.
									</schmancy-card-content>
								</schmancy-card>

								<!-- Outlined Card -->
								<schmancy-card type="outlined">
									<schmancy-card-content>
										<span slot="headline">Outlined Card</span>
										<span slot="subhead">Border style</span>
										Cards contain content and actions about a single subject.
									</schmancy-card-content>
								</schmancy-card>
							</div>
						</schmancy-code-preview>

						<!-- Card with Media -->
						<schmancy-code-preview language="html">
							<schmancy-card type="elevated" class="max-w-sm">
								<schmancy-card-media
									src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"
									alt="Red sneaker"
									fit="cover"
								></schmancy-card-media>
								<schmancy-card-content>
									<span slot="headline">Running Shoes</span>
									<span slot="subhead">$129.99</span>
									Premium running shoes designed for comfort and performance on any terrain.
								</schmancy-card-content>
								<schmancy-card-action>
									<schmancy-button variant="filled">Add to Cart</schmancy-button>
									<schmancy-button variant="text">Learn More</schmancy-button>
								</schmancy-card-action>
							</schmancy-card>
						</schmancy-code-preview>

						<!-- Interactive Card Grid -->
						<schmancy-code-preview language="html">
							<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								<!-- Product Card 1 -->
								<schmancy-card type="outlined">
									<schmancy-card-media
										src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"
										alt="Watch"
										fit="cover"
									></schmancy-card-media>
									<schmancy-card-content>
										<span slot="headline">Classic Watch</span>
										<span slot="subhead">Timeless design</span>
										Elegant timepiece with leather strap and precision movement.
									</schmancy-card-content>
									<schmancy-card-action>
										<schmancy-button variant="filled tonal" width="full">View Details</schmancy-button>
									</schmancy-card-action>
								</schmancy-card>

								<!-- Product Card 2 -->
								<schmancy-card type="outlined">
									<schmancy-card-media
										src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400"
										alt="Sunglasses"
										fit="cover"
									></schmancy-card-media>
									<schmancy-card-content>
										<span slot="headline">Sunglasses</span>
										<span slot="subhead">UV Protection</span>
										Stylish sunglasses with 100% UV protection and polarized lenses.
									</schmancy-card-content>
									<schmancy-card-action>
										<schmancy-button variant="filled tonal" width="full">View Details</schmancy-button>
									</schmancy-card-action>
								</schmancy-card>

								<!-- Product Card 3 -->
								<schmancy-card type="outlined">
									<schmancy-card-media
										src="https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400"
										alt="Headphones"
										fit="cover"
									></schmancy-card-media>
									<schmancy-card-content>
										<span slot="headline">Headphones</span>
										<span slot="subhead">Noise Cancelling</span>
										Premium sound quality with active noise cancellation technology.
									</schmancy-card-content>
									<schmancy-card-action>
										<schmancy-button variant="filled tonal" width="full">View Details</schmancy-button>
									</schmancy-card-action>
								</schmancy-card>
							</div>
						</schmancy-code-preview>

						<!-- Horizontal Card -->
						<schmancy-code-preview language="html">
							<schmancy-card type="elevated" class="max-w-2xl">
								<div class="flex">
									<schmancy-card-media
										src="https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=200"
										alt="Breakfast"
										fit="cover"
										class="w-48 h-full"
									></schmancy-card-media>
									<div class="flex-1">
										<schmancy-card-content>
											<span slot="headline">Healthy Breakfast</span>
											<span slot="subhead">Start your day right</span>
											Nutritious breakfast bowl with fresh fruits, granola, and yogurt. Perfect for a healthy morning routine.
										</schmancy-card-content>
										<schmancy-card-action>
											<schmancy-button variant="text">View Recipe</schmancy-button>
											<schmancy-button variant="text">Save</schmancy-button>
										</schmancy-card-action>
									</div>
								</div>
							</schmancy-card>
						</schmancy-code-preview>

						<!-- Card with Custom Styling -->
						<schmancy-code-preview language="html">
							<schmancy-card type="filled" class="bg-gradient-to-br from-primary-container to-secondary-container">
								<schmancy-card-content>
									<span slot="headline" class="text-primary-onContainer">Special Offer</span>
									<span slot="subhead" class="text-primary-onContainer opacity-80">Limited time only</span>
									<schmancy-typography type="body" token="lg" class="text-primary-onContainer">
										Get 20% off on all premium memberships this month. Don't miss out on exclusive features and benefits!
									</schmancy-typography>
								</schmancy-card-content>
								<schmancy-card-action>
									<schmancy-button variant="filled" class="bg-primary-default">
										Claim Offer
									</schmancy-button>
								</schmancy-card-action>
							</schmancy-card>
						</schmancy-code-preview>

						<!-- Article Card -->
						<schmancy-code-preview language="html">
							<schmancy-card type="outlined" class="max-w-md">
								<schmancy-card-content>
									<schmancy-typography type="label" token="sm" class="text-primary-default block mb-2">
										TECHNOLOGY
									</schmancy-typography>
									<span slot="headline">The Future of Web Development</span>
									<span slot="subhead">5 min read • March 15, 2024</span>
									<schmancy-typography type="body" token="md" class="mt-2">
										Explore the latest trends in web development, from Web Components to edge computing, 
										and learn how these technologies are shaping the future of the internet.
									</schmancy-typography>
								</schmancy-card-content>
								<schmancy-card-action>
									<schmancy-button variant="text">Read More</schmancy-button>
									<schmancy-button variant="text">
										<schmancy-icon>share</schmancy-icon>
									</schmancy-button>
									<schmancy-button variant="text">
										<schmancy-icon>bookmark_border</schmancy-icon>
									</schmancy-button>
								</schmancy-card-action>
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
		'demo-card': DemoCard
	}
}