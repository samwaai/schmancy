Object.defineProperty(exports,Symbol.toStringTag,{value:`Module`}),require(`./chunk-BCfY8kxB.cjs`);const e=require(`./tailwind.mixin-BfdVIGgD.cjs`),t=require(`./decorate-F9CuyeHg.cjs`);require(`./mixins.cjs`);const n=require(`./notification-DE5dFf8G.cjs`);let r=require(`lit/decorators.js`),i=require(`lit`),a=require(`lit/directives/unsafe-html.js`);var o=class extends e.t(i.css`:host { display: block }`){constructor(...e){super(...e),this.data={},this.highlightKeys=[],this.compact=!1}highlightChanges(e,t){let n=e;return t.forEach(e=>{let t=RegExp(`("${e}":\\s*)([^,\\n}]+)`,`g`);n=n.replace(t,(e,t,n)=>`${t}<span class="text-warning-default font-bold">${n}</span>`)}),n}async copyJSON(){try{await navigator.clipboard.writeText(JSON.stringify(this.data,null,2)),n.r.success(`JSON copied to clipboard`)}catch{n.r.error(`Failed to copy JSON`)}}render(){let e=JSON.stringify(this.data,null,this.compact?0:2),t=this.highlightKeys.length>0?this.highlightChanges(e,this.highlightKeys):e;return i.html`
			<div
				class="bg-surface-container rounded-lg p-2 font-mono overflow-auto cursor-pointer hover:bg-surface-container-high transition-colors"
				@click=${this.copyJSON}
			>
				<div class="flex items-center justify-between mb-1">
					<schmancy-icon size="12px" class="text-on-surface-variant">content_copy</schmancy-icon>
				</div>
				<pre class="text-[10px] leading-tight">${(0,a.unsafeHTML)(t)}</pre>
			</div>
		`}};t.t([(0,r.property)({type:Object})],o.prototype,`data`,void 0),t.t([(0,r.property)({type:Array})],o.prototype,`highlightKeys`,void 0),t.t([(0,r.property)({type:Boolean})],o.prototype,`compact`,void 0),o=t.t([(0,r.customElement)(`schmancy-json`)],o),Object.defineProperty(exports,`SchmancyJson`,{enumerable:!0,get:function(){return o}});