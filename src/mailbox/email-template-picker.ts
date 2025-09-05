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
 * - Inline preview with direct selection
 * - Single-click template selection
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
	
	/** Filtered templates based on search */
	@state() private filteredTemplates: EmailTemplate[] = []
	
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

	/** Select template directly */
	private selectTemplate = (template: EmailTemplate) => {
		this.dispatchEvent(new CustomEvent('template-selected', {
			detail: template,
			bubbles: true,
			composed: true
		}))
		sheet.dismiss()
	}

	/** Close the picker */
	private close = () => {
		sheet.dismiss()
	}

	render() {
		return html`
			<div class="flex flex-col h-full overflow-hidden">
				<!-- Header -->
				<div class="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
					<div class="flex items-center gap-3">
						<schmancy-icon size="24px" class="text-primary">mail</schmancy-icon>
						<schmancy-typography type="headline" token="md">
							Choose Email Template
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
					${this.renderTemplateList()}
				</div>
			</div>
		`
	}

	/** Render template list with inline previews */
	private renderTemplateList() {
		return html`
			<!-- Search and Filter Bar -->
			<div class="px-6 py-4 border-b border-outline-variant bg-surface-containerLow">
				<div class="flex flex-col gap-4">
					<!-- Search Input -->
					<schmancy-input
						type="search"
						placeholder="Search templates..."
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

			<!-- Template List with Previews -->
			<div class="flex-1 overflow-y-auto px-6 py-6">
				${when(
					this.filteredTemplates.length > 0,
					() => html`
						<div class="space-y-6">
							${repeat(
								this.filteredTemplates,
								template => template.id,
								template => html`
									<schmancy-surface
										type="containerLow"
										elevation="1"
										rounded="all"
										class="group cursor-pointer hover:elevation-3 transition-all duration-200 overflow-hidden"
										@click=${() => this.selectTemplate(template)}
									>
										<!-- Template Header -->
										<div class="p-4 border-b border-outline-variant">
											<div class="flex items-start justify-between">
												<div class="flex-1">
													<schmancy-typography type="title" token="md" class="font-semibold leading-tight mb-1">
														${template.name}
													</schmancy-typography>
													${when(template.category, () => html`
														<schmancy-chip class="text-xs border border-outline">
															${template.category}
														</schmancy-chip>
													`)}
												</div>
												<schmancy-button 
													variant="filled" 
													size="sm"
													class="opacity-0 group-hover:opacity-100 transition-opacity"
												>
													Use This
												</schmancy-button>
											</div>
										</div>
										
										<!-- Email Preview -->
										<div class="p-4 bg-surface">
											<schmancy-email-viewer
												subject=${template.subject}
												body=${template.body}
												mode="desktop"
												class="max-h-96 overflow-y-auto"
											></schmancy-email-viewer>
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
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-email-template-picker': SchmancyEmailTemplatePicker
	}
}