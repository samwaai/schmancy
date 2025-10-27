import { TailwindElement } from '@mixins/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

/**
 * Email layout selector component for choosing email templates
 * 
 * Simple horizontal row of 5 layout options using Schmancy components only.
 * 
 * @fires layout-select - When a layout is selected with {detail: {layout: string}}
 */
@customElement('schmancy-email-layout-selector')
export class SchmancyEmailLayoutSelector extends TailwindElement() {
	
	private layouts = [
		{ id: 'columns-2', icon: 'view_week', label: '2 Col' },
		{ id: 'columns-3', icon: 'view_column', label: '3 Col' },
		{ id: 'sidebar-left', icon: 'view_sidebar', label: 'Left' },
		{ id: 'sidebar-right', icon: 'view_sidebar', label: 'Right', flipped: true },
		{ id: 'image-row', icon: 'collections', label: 'Images' }
	]

	private selectLayout(layoutType: string) {
		this.dispatchEvent(new CustomEvent('layout-select', {
			detail: { layout: layoutType },
			bubbles: true,
			composed: true
		}))
	}

	render() {
		return html`
			<div class="grid p-3 gap-2">
				${this.layouts.map(layout => html`
					<schmancy-button 
						variant="outlined"
						@click=${() => this.selectLayout(layout.id)}
					>
						<schmancy-icon 
							slot="prefix"
							size="20px"
							class=${layout.flipped ? 'scale-x-[-1]' : ''}
						>
							${layout.icon}
						</schmancy-icon>
						${layout.label}
					</schmancy-button>
				`)}
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-email-layout-selector': SchmancyEmailLayoutSelector
	}
}