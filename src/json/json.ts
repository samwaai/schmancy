import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { $notify } from '@schmancy/notification'

@customElement('schmancy-json')
export class SchmancyJson extends TailwindElement(css`:host { display: block }`) {
	@property({ type: Object }) data: Record<string, any> = {}
	@property({ type: Array }) highlightKeys: string[] = []
	@property({ type: Boolean }) compact = false

	private highlightChanges(json: string, changedKeys: string[]): string {
		let highlighted = json
		changedKeys.forEach(key => {
			const regex = new RegExp(`("${key}":\\s*)([^,\\n}]+)`, 'g')
			highlighted = highlighted.replace(regex, (_match, keyPart, valuePart) => {
				return `${keyPart}<span class="text-warning-default font-bold">${valuePart}</span>`
			})
		})
		return highlighted
	}

	private async copyJSON() {
		try {
			await navigator.clipboard.writeText(JSON.stringify(this.data, null, 2))
			$notify.success('JSON copied to clipboard')
		} catch (error) {
			$notify.error('Failed to copy JSON')
		}
	}

	render() {
		const jsonString = JSON.stringify(this.data, null, this.compact ? 0 : 2)
		const highlighted = this.highlightKeys.length > 0 ? this.highlightChanges(jsonString, this.highlightKeys) : jsonString

		return html`
			<div
				class="bg-surface-container rounded-lg p-2 font-mono overflow-auto cursor-pointer hover:bg-surface-container-high transition-colors"
				@click=${this.copyJSON}
			>
				<div class="flex items-center justify-between mb-1">
					<schmancy-icon size="12px" class="text-on-surface-variant">content_copy</schmancy-icon>
				</div>
				<pre class="text-[10px] leading-tight">${unsafeHTML(highlighted)}</pre>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-json': SchmancyJson
	}
}
