import { t as e } from "./tailwind.mixin-CNdR3zFD.js";
import { t } from "./decorate-D_utPUsC.js";
import "./mixins.js";
import { timer as n } from "rxjs";
import { take as r } from "rxjs/operators";
import { customElement as i, property as a, state as o } from "lit/decorators.js";
import { css as s, html as c } from "lit";
import l from "highlight.js/lib/core";
import u from "highlight.js/lib/languages/bash";
import d from "highlight.js/lib/languages/javascript";
import f from "highlight.js/lib/languages/markdown";
import p from "highlight.js/lib/languages/typescript";
import m from "highlight.js/lib/languages/xml";
import { unsafeHTML as h } from "lit/directives/unsafe-html.js";
l.registerLanguage("javascript", d), l.registerLanguage("typescript", p), l.registerLanguage("html", m), l.registerLanguage("xml", m), l.registerLanguage("markdown", f), l.registerLanguage("bash", u);
var g = class extends e(s`
	:host {
		display: block;
		width: 100%;
		overflow: hidden;
	}

	/* Code block styling using schmancy color system */
	.hljs {
		display: block;
		overflow-x: auto;
		padding: 0.5em;
		color: var(--md-sys-color-on-surface-variant);
		background: var(--md-sys-color-surface-container-lowest);
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
	}

	/* Comments and documentation */
	.hljs-comment,
	.hljs-quote {
		color: var(--md-sys-color-outline);
		font-style: italic;
	}

	/* Keywords, doctags, formulas */
	.hljs-doctag,
	.hljs-keyword,
	.hljs-formula {
		color: var(--md-sys-color-primary);
	}

	/* Tags, sections, names, deletions */
	.hljs-section,
	.hljs-name,
	.hljs-selector-tag,
	.hljs-deletion,
	.hljs-subst {
		color: var(--md-sys-color-error);
	}

	/* Literals */
	.hljs-literal {
		color: var(--md-sys-color-tertiary);
	}

	/* Strings, regex, additions */
	.hljs-string,
	.hljs-regexp,
	.hljs-addition,
	.hljs-attribute,
	.hljs-meta-string {
		color: var(--md-sys-color-secondary);
	}

	/* Built-ins and class titles */
	.hljs-built_in,
	.hljs-class .hljs-title {
		color: var(--md-sys-color-tertiary);
	}

	/* Variables, attributes, types */
	.hljs-attr,
	.hljs-variable,
	.hljs-template-variable,
	.hljs-type,
	.hljs-selector-class,
	.hljs-selector-attr,
	.hljs-selector-pseudo,
	.hljs-number {
		color: var(--md-sys-color-on-surface);
	}

	/* Symbols, bullets, links, meta */
	.hljs-symbol,
	.hljs-bullet,
	.hljs-link,
	.hljs-meta,
	.hljs-selector-id,
	.hljs-title {
		color: var(--md-sys-color-secondary);
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

	/* Line features styling */
	.code-with-lines {
		background: transparent;
		padding: 0;
	}

	.code-line {
		display: block;
		padding-left: 0;
		transition: background-color 0.2s ease;
	}

	.code-line.highlighted {
		background-color: var(--md-sys-color-primary-container);
		opacity: 0.2;
	}

	.line-number {
		display: inline-block;
		width: 3rem;
		padding-right: 1rem;
		text-align: right;
		color: var(--md-sys-color-outline);
		user-select: none;
		font-size: inherit;
	}
`) {
	constructor(...e) {
		super(...e), this.language = "javascript", this.code = "", this.lineNumbers = !1, this.copyButton = !0, this.copied = !1;
	}
	get highlightedCode() {
		if (!this.code) return "";
		let e = "";
		try {
			e = l.highlight(this.code.trim(), { language: this.language }).value;
		} catch {
			try {
				e = l.highlightAuto(this.code.trim()).value;
			} catch {
				e = this.escapeHtml(this.code.trim());
			}
		}
		return this.lineNumbers || this.highlightLines ? this.addLineFeatures(e) : e;
	}
	escapeHtml(e) {
		let t = document.createElement("div");
		return t.textContent = e, t.innerHTML;
	}
	getHighlightedLines() {
		let e = /* @__PURE__ */ new Set();
		if (!this.highlightLines) return e;
		let t = this.highlightLines.split(",");
		for (let n of t) {
			let t = n.trim();
			if (t.includes("-")) {
				let [n, r] = t.split("-").map((e) => parseInt(e.trim()));
				if (!isNaN(n) && !isNaN(r)) for (let t = n; t <= r; t++) e.add(t);
			} else {
				let n = parseInt(t);
				isNaN(n) || e.add(n);
			}
		}
		return e;
	}
	addLineFeatures(e) {
		let t = e.split("\n"), n = this.getHighlightedLines();
		return t.map((e, t) => {
			let r = t + 1, i = n.has(r) ? "code-line highlighted" : "code-line", a = "";
			return this.lineNumbers && (a += `<span class="line-number">${r}</span>`), a += e, `<div class="${i}">${a}</div>`;
		}).join("");
	}
	async copyCode() {
		try {
			await navigator.clipboard.writeText(this.code), this.copied = !0, setTimeout(() => {
				this.copied = !1;
			}, 2e3);
		} catch {}
	}
	getLanguageLabel() {
		return this.filename ? this.filename : {
			javascript: "JavaScript",
			typescript: "TypeScript",
			html: "HTML",
			markdown: "Markdown",
			bash: "Bash"
		}[this.language.toLowerCase()] || this.language.toUpperCase();
	}
	render() {
		let e = this.lineNumbers || this.highlightLines ? "code-with-lines" : "hljs";
		return c`
			<schmancy-details class="bg-surface-default">
				<section slot="summary">
					<!-- Header -->
					<div class="flex items-center justify-between"
						>
						<div class="flex items-center gap-2">
							<div class="flex gap-1.5">
								<div class="w-3 h-3 rounded-full opacity-60" style="background-color: var(--md-sys-color-error);"></div>
								<div class="w-3 h-3 rounded-full opacity-60" style="background-color: var(--md-sys-color-tertiary);"></div>
								<div class="w-3 h-3 rounded-full opacity-60" style="background-color: var(--md-sys-color-secondary);"></div>
							</div>
							<span class="text-xs font-medium opacity-70 ml-2" style="color: var(--md-sys-color-on-surface-variant);">
								${this.getLanguageLabel()}
							</span>
						</div>
						${this.copyButton ? c`
									<schmancy-button
										.variant="${this.copied ? "filled tonal" : "text"}"
										@click=${this.copyCode}
										class="transition-all"
									>
										<schmancy-icon > ${this.copied ? "check" : "content_copy"} </schmancy-icon>
										<span class="ml-1">${this.copied ? "Copied!" : "Copy"}</span>
									</schmancy-button>
								` : ""}
					</div>
				</section>
				<!-- Code -->
				<div class="overflow-auto" style="${this.maxHeight ? `max-height: ${this.maxHeight}` : ""}">
					<pre class="m-0"><code class="${e}">${h(this.highlightedCode)}</code></pre>
				</div>
			</schmancy-details>
		`;
	}
};
t([a({ type: String })], g.prototype, "language", void 0), t([a({ type: String })], g.prototype, "code", void 0), t([a({ type: String })], g.prototype, "filename", void 0), t([a({ type: Boolean })], g.prototype, "lineNumbers", void 0), t([a({ type: Boolean })], g.prototype, "copyButton", void 0), t([a({ type: String })], g.prototype, "highlightLines", void 0), t([a({ type: String })], g.prototype, "maxHeight", void 0), t([o()], g.prototype, "copied", void 0), g = t([i("schmancy-code")], g);
var _ = class extends e(s`:host{
		display:block;
		overflow:hidden;
		position:relative;
		inset:0;
	}`) {
	constructor(...e) {
		super(...e), this.language = "html", this.layout = "vertical", this.preview = !0, this.slotContent = "";
	}
	connectedCallback() {
		super.connectedCallback(), n(0).pipe(r(1)).subscribe(() => {
			let e = this.shadowRoot?.querySelector("slot");
			if (e) {
				let t = e.assignedNodes({ flatten: !0 }).map((e) => e.nodeType === Node.ELEMENT_NODE ? e.outerHTML : e.nodeType === Node.TEXT_NODE && e.textContent || "").join("").split("\n"), n = t.filter((e) => e.trim().length > 0).reduce((e, t) => {
					let n = t.match(/^(\s*)/)?.[1].length || 0;
					return Math.min(e, n);
				}, Infinity);
				this.slotContent = t.map((e) => e.slice(n)).join("\n").trim();
			}
		});
	}
	render() {
		let e = this.layout === "horizontal" ? "grid grid-cols-1 lg:grid-cols-2 gap-0" : "flex flex-col", t = this.preview && this.language.toLowerCase() === "html";
		return c`
			<schmancy-surface class="rounded-lg overflow-hidden">
				<div class="${t ? e : ""}">
					<!-- Code section with proper overflow handling -->
					<div class="min-w-0 overflow-hidden">
						<schmancy-code
							language="${this.language}"
							.code="${this.slotContent}"
							?copyButton="${!0}"
							class="block w-full"
						></schmancy-code>
					</div>
					
					<!-- Preview section (only visible for HTML and when preview is enabled) -->
					${t ? c`
						<div class="min-w-0 overflow-auto">
							<schmancy-surface type="solid" class="p-2 h-full">
								<slot></slot>
							</schmancy-surface>
						</div>
					` : c`
						<!-- Hidden slot to capture content -->
						<div class="hidden">
							<slot></slot>
						</div>
					`}
				</div>
			</schmancy-surface>
		`;
	}
};
t([a({ type: String })], _.prototype, "language", void 0), t([a({ type: String })], _.prototype, "layout", void 0), t([a({ type: Boolean })], _.prototype, "preview", void 0), t([o()], _.prototype, "slotContent", void 0), _ = t([i("schmancy-code-preview")], _);
export { g as n, _ as t };
