Object.defineProperty(exports,Symbol.toStringTag,{value:`Module`}),require(`./chunk-BCfY8kxB.cjs`);const e=require(`./tailwind.mixin-BfdVIGgD.cjs`),t=require(`./decorate-F9CuyeHg.cjs`);require(`./mixins.cjs`);let n=require(`lit/decorators.js`),r=require(`lit`);var i=class extends e.t(r.css`
	:host {
		display: block;
		width: var(--_sw, 100%);
		height: var(--_sh, 1rem);
	}
	.surface {
		width: 100%;
		height: 100%;
		border-radius: var(--_sr, 0.25rem);
		background: linear-gradient(
			90deg,
			var(--schmancy-sys-color-surface-containerHighest, #e6e6e6) 25%,
			var(--schmancy-sys-color-surface-container, #f2f2f2) 37%,
			var(--schmancy-sys-color-surface-containerHighest, #e6e6e6) 63%
		);
		background-size: 400% 100%;
		animation: schmancy-skeleton-shimmer 1.4s ease infinite;
	}
	:host([shape='circle']) .surface {
		border-radius: 50%;
	}
	@keyframes schmancy-skeleton-shimmer {
		0% { background-position: 100% 50%; }
		100% { background-position: 0 50%; }
	}
	@media (prefers-reduced-motion: reduce) {
		.surface {
			animation: none;
			background: var(--schmancy-sys-color-surface-containerHighest, #e6e6e6);
		}
	}
`){constructor(...e){super(...e),this.shape=`rect`,this.width=``,this.height=``,this.radius=``}connectedCallback(){super.connectedCallback(),this.setAttribute(`role`,`status`),this.setAttribute(`aria-busy`,`true`),this.setAttribute(`aria-label`,`Loading`)}updated(){this.width&&this.style.setProperty(`--_sw`,this.width);let e=this.shape===`text`?`1em`:`1rem`;this.style.setProperty(`--_sh`,this.height||e),this.radius&&this.style.setProperty(`--_sr`,this.radius)}render(){return r.html`<div part="surface" class="surface"></div>`}};t.t([(0,n.property)({type:String,reflect:!0})],i.prototype,`shape`,void 0),t.t([(0,n.property)({type:String})],i.prototype,`width`,void 0),t.t([(0,n.property)({type:String})],i.prototype,`height`,void 0),t.t([(0,n.property)({type:String})],i.prototype,`radius`,void 0),i=t.t([(0,n.customElement)(`schmancy-skeleton`)],i),Object.defineProperty(exports,`SchmancySkeleton`,{enumerable:!0,get:function(){return i}});