import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import markdown from 'highlight.js/lib/languages/markdown'
import bash from 'highlight.js/lib/languages/bash'

// Register only the languages we need
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('bash', bash)

/**
 * @element schmancy-code
 * Code highlighting component using highlight.js with custom dark theme
 */
@customElement('schmancy-code')
export class SchmancyCode extends TailwindElement(css`
	:host {
		display: block;
		width: 100%;
		overflow: hidden;
	}
	
	/* Custom dark theme for highlight.js */
	.hljs {
		display: block;
		overflow-x: auto;
		color: #abb2bf;
		background: transparent;
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
		
		try {
			const result = hljs.highlight(this.code.trim(), { language: this.language })
			return this.lineNumbers ? this.addLineNumbers(result.value) : result.value
		} catch {
			// Fallback to auto-detection if language is not supported
			const result = hljs.highlightAuto(this.code.trim())
			return this.lineNumbers ? this.addLineNumbers(result.value) : result.value
		}
	}

	private getHighlightedLines(): Set<number> {
		const lines = new Set<number>()
		if (!this.highlightLines) return lines
		
		const parts = this.highlightLines.split(',')
		for (const part of parts) {
			if (part.includes('-')) {
				const [start, end] = part.split('-').map(n => parseInt(n.trim()))
				for (let i = start; i <= end; i++) {
					lines.add(i)
				}
			} else {
				lines.add(parseInt(part.trim()))
			}
		}
		return lines
	}

	private addLineNumbers(code: string): string {
		const lines = code.split('\n')
		const highlightedLines = this.getHighlightedLines()
		
		return lines.map((line, index) => {
			const lineNumber = index + 1
			const isHighlighted = highlightedLines.has(lineNumber)
			const highlightClass = isHighlighted ? 'bg-primary-container bg-opacity-20' : ''
			
			return `<span class="block ${highlightClass}"><span class="inline-block w-12 pr-4 text-right text-surface-onVariant opacity-50 select-none text-sm">${lineNumber}</span>${line}</span>`
		}).join('\n')
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
			bash: 'Bash'
		}
		
		if (this.filename) {
			return this.filename
		}
		
		return languageMap[this.language.toLowerCase()] || this.language.toUpperCase()
	}


	render() {
		return html`
			<schmancy-theme mode="dark">
				<div class="border border-outline rounded-lg bg-surface-dim overflow-hidden">
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
						${this.copyButton ? html`
							<schmancy-button
								.variant="${this.copied ? 'filled tonal' : 'text'}"
								size="sm"
								@click=${this.copyCode}
								class="transition-all"
							>
								<schmancy-icon size="16">
									${this.copied ? 'check' : 'content_copy'}
								</schmancy-icon>
								<span class="ml-1">${this.copied ? 'Copied!' : 'Copy'}</span>
							</schmancy-button>
						` : ''}
					</div>
					
					<!-- Code -->
					<div class="overflow-auto" style="${this.maxHeight ? `max-height: ${this.maxHeight}` : ''}">
						<pre class="p-4 m-0 min-w-0"><code class="hljs text-sm leading-relaxed whitespace-pre font-mono" .innerHTML=${this.highlightedCode}></code></pre>
					</div>
				</div>
			</schmancy-theme>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-code': SchmancyCode
	}
}