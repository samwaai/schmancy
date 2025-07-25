import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { timer } from 'rxjs'
import { take } from 'rxjs/operators'

/**
 * @element schmancy-code-preview
 * A component that shows code and its rendered preview side by side
 * Takes the content as a slot and displays both the source and rendered result
 */
@customElement('schmancy-code-preview')
export class SchmancyCodePreview extends TailwindElement(
	css`:host{
		display:block;
		overflow:hidden;
		position:relative;
		inset:0;
	}`
) {
	/**
	 * Programming language for syntax highlighting
	 */
	@property({ type: String })
	language: string = 'html'

	/**
	 * Show code on top or side-by-side
	 */
	@property({ type: String })
	layout: 'vertical' | 'horizontal' = 'vertical'

	/**
	 * Whether to render/execute the code in preview section
	 * When false, only shows the code without rendering
	 */
	@property({ type: Boolean })
	preview: boolean = true

	@state()
	private slotContent: string = ''

	connectedCallback() {
		super.connectedCallback()
		// Capture the slot content as HTML string
		timer(0).pipe(take(1)).subscribe(() => {
			const slot = this.shadowRoot?.querySelector('slot')
			if (slot) {
				const nodes = slot.assignedNodes({ flatten: true })
				const htmlStrings = nodes.map(node => {
					if (node.nodeType === Node.ELEMENT_NODE) {
						return (node as HTMLElement).outerHTML
					} else if (node.nodeType === Node.TEXT_NODE) {
						return node.textContent || ''
					}
					return ''
				})
				
				// Clean up the HTML string
				const rawContent = htmlStrings.join('')
				
				// Find the minimum indentation (excluding empty lines)
				const lines = rawContent.split('\n')
				const minIndent = lines
					.filter(line => line.trim().length > 0)
					.reduce((min, line) => {
						const indent = line.match(/^(\s*)/)?.[1].length || 0
						return Math.min(min, indent)
					}, Infinity)
				
				// Remove the minimum indentation from all lines
				this.slotContent = lines
					.map(line => line.slice(minIndent))
					.join('\n')
					.trim()
			}
		})
	}

	render() {
		const containerClass = this.layout === 'horizontal' 
			? 'grid grid-cols-1 lg:grid-cols-2 gap-0' 
			: 'flex flex-col'

		const showPreview = this.preview && this.language.toLowerCase() === 'html'
		
		return html`
			<schmancy-surface class="rounded-lg overflow-hidden">
				<div class="${showPreview ? containerClass : ''}">
					<!-- Code section with proper overflow handling -->
					<div class="min-w-0 overflow-hidden">
						<schmancy-code
							language="${this.language}"
							.code="${this.slotContent}"
							?copyButton="${true}"
							class="block w-full"
						></schmancy-code>
					</div>
					
					<!-- Preview section (only visible for HTML and when preview is enabled) -->
					${showPreview ? html`
						<div class="min-w-0 overflow-auto">
							<schmancy-surface type="surfaceBright" class="p-6 h-full">
								<slot></slot>
							</schmancy-surface>
						</div>
					` : html`
						<!-- Hidden slot to capture content -->
						<div class="hidden">
							<slot></slot>
						</div>
					`}
				</div>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-code-preview': SchmancyCodePreview
	}
}