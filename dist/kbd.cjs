Object.defineProperty(exports,Symbol.toStringTag,{value:`Module`}),require(`./chunk-CncqDLb2.cjs`);const e=require(`./tailwind.mixin-DRI1oTYQ.cjs`),t=require(`./decorate-F9CuyeHg.cjs`);require(`./mixins.cjs`);let n=require(`lit/decorators.js`),r=require(`lit`);var i=class extends e.t(r.css`
	:host {
		display: inline-block;
		vertical-align: middle;
	}
	kbd {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: var(--_ksize, 1.5rem);
		height: var(--_ksize, 1.5rem);
		padding: 0 0.375rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		font-size: var(--_kfont, 0.75rem);
		font-weight: 500;
		line-height: 1;
		color: var(--schmancy-sys-color-surface-on, #1d1b20);
		background: var(--schmancy-sys-color-surface-container, #f3f0f7);
		border: 1px solid var(--schmancy-sys-color-outline-variant, #cac4d0);
		border-radius: 0.375rem;
		box-shadow: inset 0 -1px 0 var(--schmancy-sys-color-outline-variant, #cac4d0);
		white-space: nowrap;
	}
	:host([size='sm']) kbd {
		--_ksize: 1.25rem;
		--_kfont: 0.6875rem;
	}
`){constructor(...e){super(...e),this.size=`md`}render(){return r.html`<kbd part="base"><slot></slot></kbd>`}};t.t([(0,n.property)({type:String,reflect:!0})],i.prototype,`size`,void 0),i=t.t([(0,n.customElement)(`schmancy-kbd`)],i),Object.defineProperty(exports,`SchmancyKbd`,{enumerable:!0,get:function(){return i}});