import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import hljs from 'highlight.js/lib/core'
import xml from 'highlight.js/lib/languages/xml'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import cssLang from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'

// Register languages
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('css', cssLang)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)

/**
 * @element schmancy-code
 * Code highlighting component using highlight.js with Schmancy dark theme
 */
@customElement('schmancy-code')
export class SchmancyCode extends TailwindElement(css`
	:host {
		display: block;
		width: 100%;
		overflow: hidden;
	}
	
	/* Highlight.js theme using Schmancy colors */
	.hljs {
		color: var(--schmancy-sys-color-surface-on);
		background: transparent;
	}
	.hljs-comment,
	.hljs-quote,
	.hljs-deletion {
		color: var(--schmancy-sys-color-surface-onVariant);
		opacity: 0.6;
		font-style: italic;
	}
	.hljs-keyword,
	.hljs-selector-tag,
	.hljs-built_in,
	.hljs-tag .hljs-name {
		color: var(--schmancy-sys-color-primary-default);
		font-weight: 500;
	}
	.hljs-string,
	.hljs-regexp,
	.hljs-addition,
	.hljs-selector-attr,
	.hljs-selector-pseudo {
		color: var(--schmancy-sys-color-success-default);
	}
	.hljs-number,
	.hljs-literal,
	.hljs-variable,
	.hljs-template-variable,
	.hljs-tag .hljs-attr {
		color: var(--schmancy-sys-color-tertiary-default);
	}
	.hljs-title,
	.hljs-section,
	.hljs-selector-id,
	.hljs-function .hljs-title {
		color: var(--schmancy-sys-color-secondary-default);
		font-weight: 500;
	}
	.hljs-type,
	.hljs-class .hljs-title,
	.hljs-title.class_,
	.hljs-doctag {
		color: var(--schmancy-sys-color-secondary-container);
		font-weight: 500;
	}
	.hljs-attribute,
	.hljs-attr,
	.hljs-meta {
		color: var(--schmancy-sys-color-primary-container);
	}
	.hljs-punctuation {
		color: var(--schmancy-sys-color-surface-onVariant);
		opacity: 0.8;
	}
	.hljs-tag {
		color: var(--schmancy-sys-color-surface-onVariant);
	}
	.hljs-strong,
	.hljs-name {
		font-weight: 600;
	}
	.hljs-emphasis {
		font-style: italic;
	}
	.hljs-link {
		color: var(--schmancy-sys-color-primary-default);
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

	@state()
	private copied: boolean = false

	private get highlightedCode(): string {
		if (!this.code) return ''
		
		try {
			const highlighted = hljs.highlight(this.code.trim(), { language: this.language })
			return this.lineNumbers ? this.addLineNumbers(highlighted.value) : highlighted.value
		} catch {
			// Fallback to auto-detection if language is not supported
			const highlighted = hljs.highlightAuto(this.code.trim())
			return this.lineNumbers ? this.addLineNumbers(highlighted.value) : highlighted.value
		}
	}

	private addLineNumbers(code: string): string {
		const lines = code.split('\n')
		return lines.map((line, index) => 
			`<span class="block"><span class="inline-block w-12 pr-4 text-right text-surface-onVariant opacity-50 select-none text-sm">${index + 1}</span>${line}</span>`
		).join('\n')
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
			xml: 'XML',
			css: 'CSS',
			json: 'JSON',
			bash: 'Bash',
			sh: 'Shell',
			jsx: 'JSX',
			tsx: 'TSX'
		}
		
		if (this.filename) {
			return this.filename
		}
		
		return languageMap[this.language] || this.language.toUpperCase()
	}


	render() {
		return html`
			<schmancy-theme mode="dark">
				<div class="border border-outline rounded-lg bg-surface-dim overflow-hidden">
					<!-- Header -->
					<div class="flex items-center justify-between px-4 py-3 bg-surface-container border-b border-outline">
						<span class="text-sm font-medium text-surface-onVariant opacity-80">
							${this.getLanguageLabel()}
						</span>
						${this.copyButton ? html`
							<schmancy-button
								.variant="${this.copied? "filled":'outlined'}"
								@click=${this.copyCode}
							>
								<schmancy-icon size="16px">
									${this.copied ? 'check' : 'content_copy'}
								</schmancy-icon>
								${this.copied ? 'Copied!' : 'Copy'}
							</schmancy-button>
						` : ''}
					</div>
					
					<!-- Code -->
					<div class="overflow-x-auto">
						<pre class="p-6 m-0 min-w-0"><code class="text-sm whitespace-pre" .innerHTML=${this.highlightedCode}></code></pre>
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