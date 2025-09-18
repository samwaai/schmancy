import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import '../../shared/installation-section'

@customElement('layout-layout')
export default class LayoutLayout extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-8">
				<!-- Component Title -->
				<schmancy-typography type="display" token="lg" class="mb-4 block">
					Layout
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					Flexible grid system for creating responsive layouts with CSS Grid.
				</schmancy-typography>

				<!-- Installation -->
				<installation-section></installation-section>

				<!-- Import -->
				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
					<schmancy-code-preview language="javascript">
						import '@mhmo91/schmancy/grid'
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
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">cols</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">string</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">'1fr'</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Grid template columns</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">gap</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">'xs' | 'sm' | 'md' | 'lg' | 'xl'</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">'md'</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Gap between items</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">flow</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">'row' | 'column'</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">'row'</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Grid flow direction</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">align</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">'start' | 'center' | 'end' | 'stretch'</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">'stretch'</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Align items</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">justify</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">'start' | 'center' | 'end' | 'stretch'</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">'stretch'</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Justify items</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">rcols</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">object</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">{}</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Responsive columns (sm, md, lg, xl)</schmancy-typography>
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
						<!-- Basic Grid -->
						<schmancy-code-preview language="html">
							<schmancy-grid cols="1fr 1fr 1fr" gap="md">
								<schmancy-surface type="containerLow" class="p-4 text-center">
									<schmancy-typography>Item 1</schmancy-typography>
								</schmancy-surface>
								<schmancy-surface type="containerLow" class="p-4 text-center">
									<schmancy-typography>Item 2</schmancy-typography>
								</schmancy-surface>
								<schmancy-surface type="containerLow" class="p-4 text-center">
									<schmancy-typography>Item 3</schmancy-typography>
								</schmancy-surface>
							</schmancy-grid>
						</schmancy-code-preview>

						<!-- Responsive Grid -->
						<schmancy-code-preview language="html">
							<schmancy-grid
								.rcols="${{
									sm: '1fr',
									md: '1fr 1fr',
									lg: '1fr 1fr 1fr',
									xl: '1fr 1fr 1fr 1fr'
								}}"
								gap="md"
							>
								<schmancy-card type="outlined">
									<schmancy-card-content>Card 1</schmancy-card-content>
								</schmancy-card>
								<schmancy-card type="outlined">
									<schmancy-card-content>Card 2</schmancy-card-content>
								</schmancy-card>
								<schmancy-card type="outlined">
									<schmancy-card-content>Card 3</schmancy-card-content>
								</schmancy-card>
								<schmancy-card type="outlined">
									<schmancy-card-content>Card 4</schmancy-card-content>
								</schmancy-card>
							</schmancy-grid>
						</schmancy-code-preview>

						<!-- Mixed Column Sizes -->
						<schmancy-code-preview language="html">
							<schmancy-grid cols="2fr 1fr" gap="lg">
								<schmancy-surface type="containerLow" class="p-6">
									<schmancy-typography type="title" token="lg" class="block mb-2">
										Main Content
									</schmancy-typography>
									<schmancy-typography type="body" token="md">
										This column takes up 2/3 of the available space
									</schmancy-typography>
								</schmancy-surface>
								<schmancy-surface type="containerHigh" class="p-6">
									<schmancy-typography type="title" token="lg" class="block mb-2">
										Sidebar
									</schmancy-typography>
									<schmancy-typography type="body" token="md">
										This column takes up 1/3
									</schmancy-typography>
								</schmancy-surface>
							</schmancy-grid>
						</schmancy-code-preview>

						<!-- Gap Variations -->
						<schmancy-code-preview language="html">
							<div class="space-y-4">
								<schmancy-typography type="label" token="md">Gap XS</schmancy-typography>
								<schmancy-grid cols="1fr 1fr 1fr 1fr" gap="xs">
									<schmancy-surface type="primary-container" class="p-2 text-center">1</schmancy-surface>
									<schmancy-surface type="primary-container" class="p-2 text-center">2</schmancy-surface>
									<schmancy-surface type="primary-container" class="p-2 text-center">3</schmancy-surface>
									<schmancy-surface type="primary-container" class="p-2 text-center">4</schmancy-surface>
								</schmancy-grid>

								<schmancy-typography type="label" token="md">Gap MD</schmancy-typography>
								<schmancy-grid cols="1fr 1fr 1fr 1fr" gap="md">
									<schmancy-surface type="primary-container" class="p-2 text-center">1</schmancy-surface>
									<schmancy-surface type="primary-container" class="p-2 text-center">2</schmancy-surface>
									<schmancy-surface type="primary-container" class="p-2 text-center">3</schmancy-surface>
									<schmancy-surface type="primary-container" class="p-2 text-center">4</schmancy-surface>
								</schmancy-grid>

								<schmancy-typography type="label" token="md">Gap XL</schmancy-typography>
								<schmancy-grid cols="1fr 1fr 1fr 1fr" gap="xl">
									<schmancy-surface type="primary-container" class="p-2 text-center">1</schmancy-surface>
									<schmancy-surface type="primary-container" class="p-2 text-center">2</schmancy-surface>
									<schmancy-surface type="primary-container" class="p-2 text-center">3</schmancy-surface>
									<schmancy-surface type="primary-container" class="p-2 text-center">4</schmancy-surface>
								</schmancy-grid>
							</div>
						</schmancy-code-preview>

						<!-- Column Flow -->
						<schmancy-code-preview language="html">
							<schmancy-grid flow="column" cols="1fr 1fr" gap="md" style="height: 200px">
								<schmancy-surface type="containerLow" class="p-2 text-center">1</schmancy-surface>
								<schmancy-surface type="containerLow" class="p-2 text-center">2</schmancy-surface>
								<schmancy-surface type="containerLow" class="p-2 text-center">3</schmancy-surface>
								<schmancy-surface type="containerLow" class="p-2 text-center">4</schmancy-surface>
								<schmancy-surface type="containerLow" class="p-2 text-center">5</schmancy-surface>
								<schmancy-surface type="containerLow" class="p-2 text-center">6</schmancy-surface>
							</schmancy-grid>
						</schmancy-code-preview>

						<!-- Alignment Options -->
						<schmancy-code-preview language="html">
							<div class="space-y-4">
								<schmancy-grid cols="1fr 1fr 1fr" gap="md" align="center" style="height: 150px">
									<schmancy-surface type="containerLow" class="p-4 text-center" style="height: 60px">
										Align Center
									</schmancy-surface>
									<schmancy-surface type="containerLow" class="p-4 text-center" style="height: 80px">
										Different Height
									</schmancy-surface>
									<schmancy-surface type="containerLow" class="p-4 text-center" style="height: 40px">
										Short
									</schmancy-surface>
								</schmancy-grid>

								<schmancy-grid cols="1fr 1fr 1fr" gap="md" justify="center">
									<schmancy-surface type="containerLow" class="p-4 text-center" style="width: 100px">
										Narrow
									</schmancy-surface>
									<schmancy-surface type="containerLow" class="p-4 text-center" style="width: 150px">
										Medium Width
									</schmancy-surface>
									<schmancy-surface type="containerLow" class="p-4 text-center" style="width: 80px">
										Small
									</schmancy-surface>
								</schmancy-grid>
							</div>
						</schmancy-code-preview>

						<!-- Complex Layout Example -->
						<schmancy-code-preview language="html">
							<schmancy-grid cols="1fr 3fr" gap="lg">
								<!-- Sidebar -->
								<schmancy-surface type="surfaceDim" class="p-4">
									<schmancy-typography type="title" token="md" class="block mb-4">
										Navigation
									</schmancy-typography>
									<schmancy-list>
										<schmancy-list-item>Dashboard</schmancy-list-item>
										<schmancy-list-item>Analytics</schmancy-list-item>
										<schmancy-list-item>Reports</schmancy-list-item>
										<schmancy-list-item>Settings</schmancy-list-item>
									</schmancy-list>
								</schmancy-surface>

								<!-- Main Content -->
								<div>
									<schmancy-grid cols="1fr 1fr" gap="md" class="mb-4">
										<schmancy-card type="elevated">
											<schmancy-card-content>
												<schmancy-typography type="label" token="sm" class="text-primary-default block mb-2">
													REVENUE
												</schmancy-typography>
												<schmancy-typography type="display" token="sm">
													$24,500
												</schmancy-typography>
											</schmancy-card-content>
										</schmancy-card>
										<schmancy-card type="elevated">
											<schmancy-card-content>
												<schmancy-typography type="label" token="sm" class="text-success-default block mb-2">
													GROWTH
												</schmancy-typography>
												<schmancy-typography type="display" token="sm">
													+15%
												</schmancy-typography>
											</schmancy-card-content>
										</schmancy-card>
									</schmancy-grid>

									<schmancy-surface type="surface" elevation="1" class="p-4">
										<schmancy-typography type="title" token="lg" class="block mb-4">
											Recent Activity
										</schmancy-typography>
										<schmancy-typography type="body" token="md">
											Content area for charts, tables, or other data
										</schmancy-typography>
									</schmancy-surface>
								</div>
							</schmancy-grid>
						</schmancy-code-preview>
					</schmancy-grid>
				</div>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'layout-layout': LayoutLayout
	}
}