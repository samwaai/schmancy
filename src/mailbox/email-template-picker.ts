import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { when } from 'lit/directives/when.js'
import { sheet } from '../sheet/sheet.service'
import type { EmailTemplate } from './types'

/**
 * Email template picker content component (for use inside sheets)
 * 
 * Features:
 * - Grid layout for template preview
 * - Search/filter templates
 * - Category filtering
 * - Preview before selection
 * - Confirm selection
 * 
 * @example
 * ```typescript
 * // Open as sheet
 * const picker = new SchmancyEmailTemplatePicker()
 * picker.templates = templates
 * picker.addEventListener('template-selected', handleSelection)
 * sheet.open({ component: picker, title: 'Choose Template' })
 * ```
 */
@customElement('schmancy-email-template-picker')
export class SchmancyEmailTemplatePicker extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	/** Available templates */
	@property({ type: Array }) templates: EmailTemplate[] = []
	
	/** Search query */
	@state() private searchQuery = ''
	
	/** Selected template for preview */
	@state() private selectedTemplate: EmailTemplate | null = null
	
	/** Filtered templates based on search */
	@state() private filteredTemplates: EmailTemplate[] = []
	
	/** Show template preview */
	@state() private showPreview = false
	
	/** Selected category filter */
	@state() private selectedCategory = 'all'

	connectedCallback() {
		super.connectedCallback()
		this.updateFilteredTemplates()
	}

	updated(changed: Map<string, any>) {
		if (changed.has('templates') || changed.has('searchQuery') || changed.has('selectedCategory')) {
			this.updateFilteredTemplates()
		}
	}

	/** Get unique categories from templates */
	get categories() {
		const cats = new Set<string>()
		this.templates.forEach(template => {
			if (template.category) {
				cats.add(template.category)
			}
		})
		return ['all', ...Array.from(cats)]
	}

	/** Update filtered templates */
	private updateFilteredTemplates() {
		let filtered = [...this.templates]
		
		// Filter by category
		if (this.selectedCategory !== 'all') {
			filtered = filtered.filter(template => template.category === this.selectedCategory)
		}
		
		// Filter by search query
		if (this.searchQuery.trim()) {
			const query = this.searchQuery.toLowerCase()
			filtered = filtered.filter(template => 
				template.name.toLowerCase().includes(query) ||
				template.category?.toLowerCase().includes(query) ||
				template.description?.toLowerCase().includes(query)
			)
		}
		
		this.filteredTemplates = filtered
	}

	/** Handle search input */
	private handleSearch = (e: Event) => {
		const input = e.target as HTMLInputElement
		this.searchQuery = input.value
	}

	/** Handle category selection */
	private handleCategorySelect = (category: string) => {
		this.selectedCategory = category
		this.updateFilteredTemplates()
	}

	/** Select template for preview */
	private selectTemplate = (template: EmailTemplate) => {
		this.selectedTemplate = template
		this.showPreview = true
	}

	/** Confirm template selection */
	private confirmSelection = () => {
		if (this.selectedTemplate) {
			this.dispatchEvent(new CustomEvent('template-selected', {
				detail: this.selectedTemplate,
				bubbles: true,
				composed: true
			}))
			sheet.dismiss()
		}
	}

	/** Close the picker */
	private close = () => {
		sheet.dismiss()
	}

	/** Go back from preview */
	private backToList = () => {
		this.showPreview = false
		this.selectedTemplate = null
	}

	render() {
		return html`
			<div class="flex flex-col h-full overflow-hidden">
				<!-- Header -->
				<div class="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
					<div class="flex items-center gap-3">
						<schmancy-icon size="24px" class="text-primary">
							${this.showPreview ? 'preview' : 'mail'}
						</schmancy-icon>
						<schmancy-typography type="headline" token="md">
							${this.showPreview ? 'Template Preview' : 'Choose Email Template'}
						</schmancy-typography>
					</div>
					<schmancy-button
						variant="text"
						@click=${this.close}
						class="hover:bg-surface-container rounded-full w-10 h-10 p-0"
					>
						<schmancy-icon>close</schmancy-icon>
					</schmancy-button>
				</div>

				<!-- Body -->
				<div class="flex-1 flex flex-col overflow-hidden">
					${when(
						this.showPreview && this.selectedTemplate,
						() => this.renderPreview(),
						() => this.renderTemplateList()
					)}
				</div>

				<!-- Footer -->
				<div class="flex justify-between px-6 py-4 border-t border-outline-variant bg-surface-containerLow">
					${when(
						this.showPreview,
						() => html`
							<schmancy-button
								variant="outlined"
								@click=${this.backToList}
								class="px-6 py-3"
							>
								<schmancy-icon slot="prefix">arrow_back</schmancy-icon>
								Back to Templates
							</schmancy-button>
							<schmancy-button
								variant="filled"
								@click=${this.confirmSelection}
								class="px-8 py-3 bg-primary text-primary-on shadow-md hover:shadow-lg transition-shadow"
							>
								<schmancy-icon slot="prefix">check_circle</schmancy-icon>
								Use This Template
							</schmancy-button>
						`,
						() => html`
							<div class="flex gap-3">
								<schmancy-button
									variant="text"
									@click=${this.close}
									class="px-6 py-3"
								>
									Cancel
								</schmancy-button>
							</div>
						`
					)}
				</div>
			</div>
		`
	}

	/** Render template list */
	private renderTemplateList() {
		return html`
			<!-- Search and Filter Bar -->
			<div class="px-6 py-4 border-b border-outline-variant bg-surface-containerLow">
				<div class="flex flex-col gap-4">
					<!-- Search Input -->
					<schmancy-input
						type="search"
						placeholder="Search templates by name, category, or description..."
						.value=${this.searchQuery}
						@input=${this.handleSearch}
						class="w-full"
					>
						<schmancy-icon slot="prefix" size="20px" class="text-surface-onVariant">search</schmancy-icon>
						${when(this.searchQuery, () => html`
							<schmancy-button
								slot="suffix"
								variant="text"
								@click=${() => { this.searchQuery = '' }}
								class="rounded-full w-8 h-8 p-0"
							>
								<schmancy-icon size="16px">close</schmancy-icon>
							</schmancy-button>
						`)}
					</schmancy-input>

					<!-- Category Filter -->
					${when(this.categories.length > 1, () => html`
						<div class="flex gap-2 flex-wrap">
							${repeat(
								this.categories,
								category => category,
								category => html`
									<schmancy-chip
										class="cursor-pointer transition-all hover:shadow-sm ${this.selectedCategory === category ? 'bg-primary text-primary-on' : 'border border-outline'}"
										@click=${() => this.handleCategorySelect(category)}
									>
										${category === 'all' ? 'All Templates' : category}
									</schmancy-chip>
								`
							)}
						</div>
					`)}
				</div>
			</div>

			<!-- Template List -->
			<div class="flex-1 overflow-y-auto px-6 py-6">
				${when(
					this.filteredTemplates.length > 0,
					() => html`
						<div class="space-y-4">
							${repeat(
								this.filteredTemplates,
								template => template.id,
								template => html`
									<schmancy-surface
										type="containerLow"
										elevation="1"
										rounded="all"
										class="group cursor-pointer hover:elevation-3 transition-all duration-200 p-4"
										@click=${() => this.selectTemplate(template)}
									>
										<div class="flex items-start justify-between gap-4">
											<div class="flex-1">
												<!-- Template Header -->
												<div class="flex items-start justify-between mb-2">
													<schmancy-typography type="title" token="md" class="font-semibold leading-tight">
														${template.name}
													</schmancy-typography>
													${when(template.isDefault, () => html`
														<schmancy-chip class="bg-primary text-primary-on text-xs">
															<schmancy-icon slot="prefix" size="12px">star</schmancy-icon>
															Default
														</schmancy-chip>
													`)}
												</div>
												
												<!-- Category Badge -->
												${when(template.category, () => html`
													<div class="mb-2">
														<schmancy-chip class="text-xs border border-outline">
															${template.category}
														</schmancy-chip>
													</div>
												`)}
												
												<!-- Description -->
												${when(
													template.description,
													() => html`
														<schmancy-typography type="body" token="sm" class="text-surface-onVariant leading-relaxed">
															${template.description}
														</schmancy-typography>
													`,
													() => html`
														<schmancy-typography type="body" token="sm" class="text-surface-onVariant opacity-60 italic">
															No description available
														</schmancy-typography>
													`
												)}
											</div>
											
											<!-- Preview Button -->
											<div class="flex-shrink-0">
												<schmancy-button variant="outlined" size="sm">
													<schmancy-icon slot="prefix">preview</schmancy-icon>
													Preview
												</schmancy-button>
											</div>
										</div>
									</schmancy-surface>
								`
							)}
						</div>
					`,
					() => html`
						<div class="flex flex-col items-center justify-center h-96 text-center">
							<div class="mb-6">
								<schmancy-icon size="64px" class="text-surface-onVariant opacity-20">mail_outline</schmancy-icon>
							</div>
							<schmancy-typography type="headline" token="sm" class="mb-2">
								${this.searchQuery || this.selectedCategory !== 'all' ? 'No templates found' : 'No templates available'}
							</schmancy-typography>
							<schmancy-typography type="body" token="md" class="text-surface-onVariant mb-6 max-w-md">
								${this.searchQuery 
									? `No templates match your search for "${this.searchQuery}"`
									: this.selectedCategory !== 'all'
										? `No templates found in the "${this.selectedCategory}" category`
										: 'Start by creating your first email template'
								}
							</schmancy-typography>
							${when(this.searchQuery || this.selectedCategory !== 'all', () => html`
								<div class="flex gap-3">
									${when(this.searchQuery, () => html`
										<schmancy-button
											variant="outlined"
											@click=${() => { this.searchQuery = '' }}
										>
											<schmancy-icon slot="prefix">clear</schmancy-icon>
											Clear Search
										</schmancy-button>
									`)}
									${when(this.selectedCategory !== 'all', () => html`
										<schmancy-button
											variant="filled"
											@click=${() => this.handleCategorySelect('all')}
										>
											<schmancy-icon slot="prefix">view_list</schmancy-icon>
											Show All Templates
										</schmancy-button>
									`)}
								</div>
							`)}
						</div>
					`
				)}
			</div>
		`
	}

	/** Render template preview */
	private renderPreview() {
		if (!this.selectedTemplate) return null
		
		return html`
			<div class="flex-1 overflow-y-auto">
				<!-- Template Header Section -->
				<div class="px-6 py-6 border-b border-outline-variant bg-surface-containerLow">
					<div class="flex items-start gap-6">
						<!-- Template Thumbnail -->
						${when(
							this.selectedTemplate.thumbnail,
							() => html`
								<div class="flex-shrink-0">
									<schmancy-surface elevation="2" rounded="all" class="overflow-hidden w-32 h-24">
										<img 
											src=${this.selectedTemplate.thumbnail} 
											alt=${this.selectedTemplate.name}
											class="w-full h-full object-cover"
										/>
									</schmancy-surface>
								</div>
							`,
							() => html`
								<div class="flex-shrink-0">
									<schmancy-surface elevation="1" rounded="all" class="w-32 h-24 bg-gradient-to-br from-surface-container to-surface-containerLow flex items-center justify-center">
										<schmancy-icon size="32px" class="text-surface-onVariant opacity-40">mail</schmancy-icon>
									</schmancy-surface>
								</div>
							`
						)}

						<!-- Template Info -->
						<div class="flex-1">
							<div class="flex items-start justify-between mb-3">
								<schmancy-typography type="headline" token="lg" class="font-semibold">
									${this.selectedTemplate.name}
								</schmancy-typography>
								${when(this.selectedTemplate.isDefault, () => html`
									<schmancy-chip class="bg-primary text-primary-on">
										<schmancy-icon slot="prefix" size="12px">star</schmancy-icon>
										Default
									</schmancy-chip>
								`)}
							</div>

							<div class="flex flex-wrap gap-2 mb-3">
								${when(this.selectedTemplate.category, () => html`
									<schmancy-chip class="border border-outline">
										<schmancy-icon slot="prefix" size="12px">category</schmancy-icon>
										${this.selectedTemplate.category}
									</schmancy-chip>
								`)}
								${when(this.selectedTemplate.createdAt, () => html`
									<schmancy-chip class="border border-outline">
										<schmancy-icon slot="prefix" size="12px">schedule</schmancy-icon>
										Created ${new Date(this.selectedTemplate.createdAt!).toLocaleDateString()}
									</schmancy-chip>
								`)}
							</div>

							${when(
								this.selectedTemplate.description,
								() => html`
									<schmancy-typography type="body" token="md" class="text-surface-onVariant leading-relaxed">
										${this.selectedTemplate.description}
									</schmancy-typography>
								`
							)}
						</div>
					</div>
				</div>

				<!-- Template Content -->
				<div class="px-6 py-6 space-y-8">
					<!-- Subject Preview -->
					<div>
						<div class="flex items-center gap-2 mb-4">
							<schmancy-icon size="20px" class="text-primary">subject</schmancy-icon>
							<schmancy-typography type="title" token="md" class="text-primary">
								Subject Line
							</schmancy-typography>
						</div>
						<schmancy-surface elevation="1" type="surface" class="p-4 border-l-4 border-primary">
							<schmancy-typography type="body" token="md" class="font-medium">
								${this.selectedTemplate.subject}
							</schmancy-typography>
						</schmancy-surface>
					</div>

					<!-- Body Preview -->
					<div>
						<div class="flex items-center gap-2 mb-4">
							<schmancy-icon size="20px" class="text-primary">article</schmancy-icon>
							<schmancy-typography type="title" token="md" class="text-primary">
								Email Preview
							</schmancy-typography>
						</div>
						<schmancy-email-viewer
							subject=${this.selectedTemplate.subject}
							body=${this.selectedTemplate.body}
							mode="desktop"
						></schmancy-email-viewer>
					</div>
				</div>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-email-template-picker': SchmancyEmailTemplatePicker
	}
}