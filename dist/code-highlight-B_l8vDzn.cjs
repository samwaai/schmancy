require(`./chunk-CncqDLb2.cjs`);const e=require(`./tailwind.mixin-Bh58QnlW.cjs`),t=require(`./decorate-F9CuyeHg.cjs`);require(`./mixins.cjs`);let n=require(`rxjs`),r=require(`rxjs/operators`),i=require(`lit/decorators.js`),a=require(`lit`),o=require(`lit/directives/unsafe-html.js`);var s=null,c=class extends e.t(a.css`
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
`){constructor(...e){super(...e),this.language=`javascript`,this.code=``,this.lineNumbers=!1,this.copyButton=!0,this.copied=!1,this._highlightedCode=``}updated(e){super.updated?.(e),(e.has(`code`)||e.has(`language`)||e.has(`lineNumbers`)||e.has(`highlightLines`))&&this._rehighlight()}async _rehighlight(){if(!this.code)return void(this._highlightedCode=``);let e=await(s||=Promise.all([import(`highlight.js/lib/core`),import(`highlight.js/lib/languages/bash`),import(`highlight.js/lib/languages/javascript`),import(`highlight.js/lib/languages/markdown`),import(`highlight.js/lib/languages/typescript`),import(`highlight.js/lib/languages/xml`)]).then(([e,t,n,r,i,a])=>{let o=e.default;return o.registerLanguage(`javascript`,n.default),o.registerLanguage(`typescript`,i.default),o.registerLanguage(`html`,a.default),o.registerLanguage(`xml`,a.default),o.registerLanguage(`markdown`,r.default),o.registerLanguage(`bash`,t.default),o}));if(!this.isConnected)return;let t=``;try{t=e.highlight(this.code.trim(),{language:this.language}).value}catch{try{t=e.highlightAuto(this.code.trim()).value}catch{t=this.escapeHtml(this.code.trim())}}this.lineNumbers||this.highlightLines?this._highlightedCode=this.addLineFeatures(t):this._highlightedCode=t}escapeHtml(e){let t=document.createElement(`div`);return t.textContent=e,t.innerHTML}getHighlightedLines(){let e=new Set;if(!this.highlightLines)return e;let t=this.highlightLines.split(`,`);for(let n of t){let t=n.trim();if(t.includes(`-`)){let[n,r]=t.split(`-`).map(e=>parseInt(e.trim()));if(!isNaN(n)&&!isNaN(r))for(let t=n;t<=r;t++)e.add(t)}else{let n=parseInt(t);isNaN(n)||e.add(n)}}return e}addLineFeatures(e){let t=e.split(`
`),n=this.getHighlightedLines();return t.map((e,t)=>{let r=t+1,i=n.has(r)?`code-line highlighted`:`code-line`,a=``;return this.lineNumbers&&(a+=`<span class="line-number">${r}</span>`),a+=e,`<div class="${i}">${a}</div>`}).join(``)}async copyCode(){try{await navigator.clipboard.writeText(this.code),this.copied=!0,setTimeout(()=>{this.copied=!1},2e3)}catch{}}getLanguageLabel(){return this.filename?this.filename:{javascript:`JavaScript`,typescript:`TypeScript`,html:`HTML`,markdown:`Markdown`,bash:`Bash`}[this.language.toLowerCase()]||this.language.toUpperCase()}render(){let e=this.lineNumbers||this.highlightLines?`code-with-lines`:`hljs`;return a.html`
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
						${this.copyButton?a.html`
									<schmancy-button
										.variant="${this.copied?`filled tonal`:`text`}"
										@click=${this.copyCode}
										class="transition-all"
									>
										<schmancy-icon > ${this.copied?`check`:`content_copy`} </schmancy-icon>
										<span class="ml-1">${this.copied?`Copied!`:`Copy`}</span>
									</schmancy-button>
								`:``}
					</div>
				</section>
				<!-- Code -->
				<div class="overflow-auto" style="${this.maxHeight?`max-height: ${this.maxHeight}`:``}">
					<pre class="m-0"><code class="${e}">${(0,o.unsafeHTML)(this._highlightedCode)}</code></pre>
				</div>
			</schmancy-details>
		`}};t.t([(0,i.property)({type:String})],c.prototype,`language`,void 0),t.t([(0,i.property)({type:String})],c.prototype,`code`,void 0),t.t([(0,i.property)({type:String})],c.prototype,`filename`,void 0),t.t([(0,i.property)({type:Boolean})],c.prototype,`lineNumbers`,void 0),t.t([(0,i.property)({type:Boolean})],c.prototype,`copyButton`,void 0),t.t([(0,i.property)({type:String})],c.prototype,`highlightLines`,void 0),t.t([(0,i.property)({type:String})],c.prototype,`maxHeight`,void 0),t.t([(0,i.state)()],c.prototype,`copied`,void 0),t.t([(0,i.state)()],c.prototype,`_highlightedCode`,void 0),c=t.t([(0,i.customElement)(`schmancy-code`)],c);var l=class extends e.t(a.css`:host{
		display:block;
		overflow:hidden;
		position:relative;
		inset:0;
	}`){constructor(...e){super(...e),this.language=`html`,this.layout=`vertical`,this.preview=!0,this.slotContent=``}connectedCallback(){super.connectedCallback(),(0,n.timer)(0).pipe((0,r.take)(1)).subscribe(()=>{let e=this.shadowRoot?.querySelector(`slot`);if(e){let t=e.assignedNodes({flatten:!0}).map(e=>e.nodeType===Node.ELEMENT_NODE?e.outerHTML:e.nodeType===Node.TEXT_NODE&&e.textContent||``).join(``).split(`
`),n=t.filter(e=>e.trim().length>0).reduce((e,t)=>{let n=t.match(/^(\s*)/)?.[1].length||0;return Math.min(e,n)},1/0);this.slotContent=t.map(e=>e.slice(n)).join(`
`).trim()}})}render(){let e=this.layout===`horizontal`?`grid grid-cols-1 lg:grid-cols-2 gap-0`:`flex flex-col`,t=this.preview&&this.language.toLowerCase()===`html`;return a.html`
			<schmancy-surface class="rounded-lg overflow-hidden">
				<div class="${t?e:``}">
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
					${t?a.html`
						<div class="min-w-0 overflow-auto">
							<schmancy-surface type="solid" class="p-2 h-full">
								<slot></slot>
							</schmancy-surface>
						</div>
					`:a.html`
						<!-- Hidden slot to capture content -->
						<div class="hidden">
							<slot></slot>
						</div>
					`}
				</div>
			</schmancy-surface>
		`}};t.t([(0,i.property)({type:String})],l.prototype,`language`,void 0),t.t([(0,i.property)({type:String})],l.prototype,`layout`,void 0),t.t([(0,i.property)({type:Boolean})],l.prototype,`preview`,void 0),t.t([(0,i.state)()],l.prototype,`slotContent`,void 0),l=t.t([(0,i.customElement)(`schmancy-code-preview`)],l),Object.defineProperty(exports,`n`,{enumerable:!0,get:function(){return c}}),Object.defineProperty(exports,`t`,{enumerable:!0,get:function(){return l}});