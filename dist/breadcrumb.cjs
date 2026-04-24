Object.defineProperty(exports,Symbol.toStringTag,{value:`Module`}),require(`./chunk-CncqDLb2.cjs`);const e=require(`./tailwind.mixin-BHX99hgX.cjs`),t=require(`./decorate-F9CuyeHg.cjs`);require(`./mixins.cjs`);let n=require(`lit/decorators.js`),r=require(`lit`);var i=class extends e.t(r.css`
	:host {
		display: block;
	}
	nav {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.25rem;
	}
	.sep {
		color: var(--schmancy-sys-color-surface-onVariant, #79747e);
		user-select: none;
		padding: 0 0.25rem;
	}
	::slotted(schmancy-breadcrumb-item:last-of-type) {
		font-weight: 500;
	}
`){constructor(...e){super(...e),this.separator=`/`}connectedCallback(){super.connectedCallback(),this.hasAttribute(`aria-label`)||this.setAttribute(`aria-label`,`Breadcrumb`)}render(){return r.html`
			<nav role="navigation">
				<slot @slotchange=${()=>this._insertSeparators()}></slot>
			</nav>
		`}_insertSeparators(){let e=this.shadowRoot?.querySelector(`slot`);if(!e)return;let t=e.assignedElements({flatten:!0});this.querySelectorAll(`[data-schmancy-sep]`).forEach(e=>e.remove()),t.forEach((e,n)=>{if(n===t.length-1)return;let r=document.createElement(`span`);r.setAttribute(`data-schmancy-sep`,``),r.setAttribute(`aria-hidden`,`true`),r.setAttribute(`part`,`separator`),r.className=`sep`,r.textContent=this.separator,e.insertAdjacentElement(`afterend`,r)})}};t.t([(0,n.property)({type:String})],i.prototype,`separator`,void 0),i=t.t([(0,n.customElement)(`schmancy-breadcrumb`)],i);var a=class extends e.t(r.css`
	:host {
		display: inline-block;
	}
	a, span {
		color: inherit;
		text-decoration: none;
	}
	a:hover {
		text-decoration: underline;
	}
`){constructor(...e){super(...e),this.href=``,this.current=!1}render(){return this.href&&!this.current?r.html`<a href=${this.href}><slot></slot></a>`:r.html`<span aria-current=${this.current?`page`:`false`}><slot></slot></span>`}};t.t([(0,n.property)({type:String})],a.prototype,`href`,void 0),t.t([(0,n.property)({type:Boolean,reflect:!0})],a.prototype,`current`,void 0),a=t.t([(0,n.customElement)(`schmancy-breadcrumb-item`)],a),Object.defineProperty(exports,`SchmancyBreadcrumb`,{enumerable:!0,get:function(){return i}}),Object.defineProperty(exports,`SchmancyBreadcrumbItem`,{enumerable:!0,get:function(){return a}});