import { TailwindElement } from '@mixins/index'
import { css, html, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'

/** Sensible document reset for iframe content — font, spacing, word-wrap */
const DEFAULT_BASE_CSS = `html,body{margin:0;padding:0;overflow:hidden;background:#fff;color:#1a1a1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:1.6;word-wrap:break-word;overflow-wrap:break-word}
body{padding:16px}
p{margin:0 0 1em}p:last-child{margin-bottom:0}
ul,ol{margin:0 0 1em;padding-left:1.5em}li{margin-bottom:.25em}
h1,h2,h3,h4{margin:0 0 .5em;line-height:1.3}h1{font-size:1.5em}h2{font-size:1.25em}h3{font-size:1.1em}h4{font-size:1em}
hr{border:none;border-top:1px solid #dadce0;margin:1em 0}
img{max-width:100%;height:auto}
table{border-collapse:collapse;max-width:100%}td,th{padding:4px 8px;border:1px solid #dadce0}
blockquote{margin:0 0 1em;padding:.5em 0 .5em 1em;border-left:3px solid #dadce0;color:#5f6368}
pre{background:#f5f5f5;padding:.75em;border-radius:4px;overflow-x:auto;font-size:.9em}
code{background:#f5f5f5;padding:.1em .3em;border-radius:3px;font-size:.9em}`

/**
 * Renders an HTML fragment inside a sandboxed, auto-sizing iframe.
 *
 * @slot - (none)
 * @fires load — native iframe load event
 *
 * @example
 * ```html
 * <schmancy-iframe .html=${bodyHtml} .css=${extraStyles}></schmancy-iframe>
 * ```
 */
@customElement('schmancy-iframe')
export default class SchmancyIframe extends TailwindElement(css`
	:host {
		display: block;
	}
	iframe {
		border: 0;
		width: 100%;
	}
`) {
	/** HTML body fragment to render inside the iframe */
	@property({ type: String }) html = ''

	/** Additional CSS injected after the base styles (consumer-specific) */
	@property({ type: String }) css = ''

	/** Base document CSS (font, spacing, resets). Override for fully custom styling */
	@property({ type: String }) baseCss = DEFAULT_BASE_CSS

	/** iframe sandbox attribute */
	@property({ type: String }) sandbox = 'allow-same-origin allow-popups'

	/** Minimum height in pixels */
	@property({ type: Number }) minHeight = 60

	@state() private _height = 60
	private _srcdoc = ''
	private _iframeRef = createRef<HTMLIFrameElement>()

	protected willUpdate(changed: PropertyValues) {
		if (changed.has('html') || changed.has('css') || changed.has('baseCss')) {
			this._srcdoc = this.html ? this.buildSrcdoc() : ''
			this._height = this.minHeight
		}
	}

	protected updated(changed: PropertyValues) {
		if (changed.has('sandbox')) {
			this._iframeRef.value?.setAttribute('sandbox', this.sandbox)
		}
	}

	private buildSrcdoc(): string {
		const styles = this.css ? `${this.baseCss}\n${this.css}` : this.baseCss
		return `<!DOCTYPE html><html><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<base target="_blank">
<style>${styles}</style></head><body>${this.html}</body></html>`
	}

	private onLoad(e: Event) {
		const iframe = e.target as HTMLIFrameElement
		try {
			const doc = iframe.contentDocument
			if (!doc) return
			this._height = Math.max(doc.documentElement.scrollHeight, this.minHeight)
		} catch {
			this._height = Math.max(200, this.minHeight)
		}
	}

	protected render() {
		if (!this.html) return html``
		return html`<iframe
			${ref(this._iframeRef)}
			.srcdoc=${this._srcdoc}
			style="height:${this._height}px;min-height:${this.minHeight}px;overflow:hidden"
			@load=${this.onLoad}
		></iframe>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-iframe': SchmancyIframe
	}
}
