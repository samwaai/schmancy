import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import markdown from 'highlight.js/lib/languages/markdown'
import bash from 'highlight.js/lib/languages/bash'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'

// Register only the languages we need
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('bash', bash)

/**
 * @element schmancy-code
 * Code highlighting component using highlight.js with default theme
 */
@customElement('schmancy-code')
export class SchmancyCode extends TailwindElement(css`
	:host {
		display: block;
		width: 100%;
		overflow: hidden;
	}

	/* Import highlight.js default dark theme */
	.hljs {
		display: block;
		overflow-x: auto;
		padding: 0.5em;
		color: #abb2bf;
		background: #282c34;
	}

	.hljs-comment,
	.hljs-quote {
		color: #5c6370;
		font-style: italic;
	}

	.hljs-doctag,
	.hljs-keyword,
	.hljs-formula {
		color: #c678dd;
	}

	.hljs-section,
	.hljs-name,
	.hljs-selector-tag,
	.hljs-deletion,
	.hljs-subst {
		color: #e06c75;
	}

	.hljs-literal {
		color: #56b6c2;
	}

	.hljs-string,
	.hljs-regexp,
	.hljs-addition,
	.hljs-attribute,
	.hljs-meta-string {
		color: #98c379;
	}

	.hljs-built_in,
	.hljs-class .hljs-title {
		color: #e6c07b;
	}

	.hljs-attr,
	.hljs-variable,
	.hljs-template-variable,
	.hljs-type,
	.hljs-selector-class,
	.hljs-selector-attr,
	.hljs-selector-pseudo,
	.hljs-number {
		color: #d19a66;
	}

	.hljs-symbol,
	.hljs-bullet,
	.hljs-link,
	.hljs-meta,
	.hljs-selector-id,
	.hljs-title {
		color: #61aeee;
	}

	.hljs-emphasis {
		font-style: italic;
	}

	.hljs-strong {
		font-weight: bold;
	}

	.hljs-link {
		text-decoration: underline;
	}

	/* Minimal custom styles for line numbers and highlighting */
	.code-with-lines {
		background: transparent;
		padding: 0;
	}

	.code-line {
		display: block;
		padding-left: 0;
	}

	.code-line.highlighted {
		background-color: rgba(97, 174, 238, 0.15);
	}

	.line-number {
		display: inline-block;
		width: 3rem;
		padding-right: 1rem;
		text-align: right;
		color: #5c6370;
		user-select: none;
		font-size: inherit;
	}
`) {
	/**
	 * Programming language for syntax highlighting
	 */
	@property({ type: String })
	language: string = 'javascript'

	/**
	 * Code content to highlight
	 */
	@property({ type: String })
	code: string = ''

	/**
	 * Optional filename or title to display in header
	 */
	@property({ type: String })
	filename?: string

	/**
	 * Show line numbers
	 */
	@property({ type: Boolean })
	lineNumbers: boolean = false

	/**
	 * Show copy button
	 */
	@property({ type: Boolean })
	copyButton: boolean = true

	/**
	 * Highlighted line numbers (comma-separated or ranges like "1-3,5,7-9")
	 */
	@property({ type: String })
	highlightLines?: string

	/**
	 * Maximum height before scrolling
	 */
	@property({ type: String })
	maxHeight?: string

	@state()
	private copied: boolean = false

	private get highlightedCode(): string {
		if (!this.code) return ''

		let highlightedHtml = ''

		try {
			// Use highlight.js to get highlighted code
			const result = hljs.highlight(this.code.trim(), { language: this.language })
			highlightedHtml = result.value
		} catch {
			// Fallback to auto-detection if language is not supported
			try {
				const result = hljs.highlightAuto(this.code.trim())
				highlightedHtml = result.value
			} catch {
				// Final fallback to escaped plain text
				highlightedHtml = this.escapeHtml(this.code.trim())
			}
		}

		// Process for line numbers and highlighting if needed
		if (this.lineNumbers || this.highlightLines) {
			return this.addLineFeatures(highlightedHtml)
		}

		return highlightedHtml
	}

	private escapeHtml(text: string): string {
		const div = document.createElement('div')
		div.textContent = text
		return div.innerHTML
	}

	private getHighlightedLines(): Set<number> {
		const lines = new Set<number>()
		if (!this.highlightLines) return lines

		const parts = this.highlightLines.split(',')
		for (const part of parts) {
			const trimmed = part.trim()
			if (trimmed.includes('-')) {
				const [start, end] = trimmed.split('-').map(n => parseInt(n.trim()))
				if (!isNaN(start) && !isNaN(end)) {
					for (let i = start; i <= end; i++) {
						lines.add(i)
					}
				}
			} else {
				const lineNum = parseInt(trimmed)
				if (!isNaN(lineNum)) {
					lines.add(lineNum)
				}
			}
		}
		return lines
	}

	private addLineFeatures(highlightedHtml: string): string {
		const lines = highlightedHtml.split('\n')
		const highlightedLines = this.getHighlightedLines()

		return lines
			.map((line, index) => {
				const lineNumber = index + 1
				const isHighlighted = highlightedLines.has(lineNumber)
				const lineClass = isHighlighted ? 'code-line highlighted' : 'code-line'

				let content = ''
				if (this.lineNumbers) {
					content += `<span class="line-number">${lineNumber}</span>`
				}
				content += line

				return `<div class="${lineClass}">${content}</div>`
			})
			.join('')
	}

	private async copyCode() {
		try {
			await navigator.clipboard.writeText(this.code)
			this.copied = true
			setTimeout(() => {
				this.copied = false
			}, 2000)
		} catch (err) {
			console.error('Failed to copy code:', err)
		}
	}

	private getLanguageLabel(): string {
		const languageMap: Record<string, string> = {
			javascript: 'JavaScript',
			typescript: 'TypeScript',
			html: 'HTML',
			markdown: 'Markdown',
			bash: 'Bash',
		}

		if (this.filename) {
			return this.filename
		}

		return languageMap[this.language.toLowerCase()] || this.language.toUpperCase()
	}

	render() {
		const codeClass = this.lineNumbers || this.highlightLines ? 'code-with-lines' : 'hljs'

		return html`
			<schmancy-theme mode="dark">
				<schmancy-details>
					<section slot="summary">
						<!-- Header -->
						<div class="flex items-center justify-between px-4 py-2 bg-surface-container border-b border-outline">
							<div class="flex items-center gap-2">
								<div class="flex gap-1.5">
									<div class="w-3 h-3 rounded-full bg-error-default opacity-60"></div>
									<div class="w-3 h-3 rounded-full bg-warning-default opacity-60"></div>
									<div class="w-3 h-3 rounded-full bg-success-default opacity-60"></div>
								</div>
								<span class="text-xs font-medium text-surface-onVariant opacity-70 ml-2">
									${this.getLanguageLabel()}
								</span>
							</div>
							${this.copyButton
								? html`
										<schmancy-button
											.variant="${this.copied ? 'filled tonal' : 'text'}"
											size="sm"
											@click=${this.copyCode}
											class="transition-all"
										>
											<schmancy-icon size="16"> ${this.copied ? 'check' : 'content_copy'} </schmancy-icon>
											<span class="ml-1">${this.copied ? 'Copied!' : 'Copy'}</span>
										</schmancy-button>
									`
								: ''}
						</div>
					</section>
					<!-- Code -->
					<div class="overflow-auto" style="${this.maxHeight ? `max-height: ${this.maxHeight}` : ''}">
						<pre class="m-0"><code class="${codeClass}">${unsafeHTML(this.highlightedCode)}</code></pre>
					</div>
				</schmancy-details>
			</schmancy-theme>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-code': SchmancyCode
	}
}
