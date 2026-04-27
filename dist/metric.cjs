Object.defineProperty(exports,Symbol.toStringTag,{value:`Module`}),require(`./chunk-CncqDLb2.cjs`);const e=require(`./tailwind.mixin-BHX99hgX.cjs`),t=require(`./decorate-F9CuyeHg.cjs`);require(`./mixins.cjs`);let n=require(`lit/decorators.js`),r=require(`lit`);var i=class extends e.t(r.css`
	:host {
		display: inline-flex;
		flex-direction: column;
		gap: 0.25rem;
		min-width: 0;
	}
	:host([size='sm']) .label { font-size: 0.6875rem; }
	:host([size='sm']) .value { font-size: 1.25rem; }
	:host([size='md']) .label { font-size: 0.75rem; }
	:host([size='md']) .value { font-size: 1.75rem; }
	:host([size='lg']) .label { font-size: 0.8125rem; }
	:host([size='lg']) .value { font-size: 2.5rem; }
	.label {
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--schmancy-sys-color-surface-onVariant);
	}
	.value {
		font-weight: 600;
		line-height: 1.1;
		color: var(--schmancy-sys-color-surface-on);
		font-variant-numeric: tabular-nums;
	}
	.delta {
		display: inline-flex;
		align-items: center;
		gap: 0.125rem;
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.125rem 0.375rem;
		border-radius: 999px;
		font-variant-numeric: tabular-nums;
	}
	.delta[data-trend='up'] {
		color: var(--schmancy-sys-color-success-on);
		background: var(--schmancy-sys-color-success-default);
	}
	.delta[data-trend='down'] {
		color: var(--schmancy-sys-color-error-on);
		background: var(--schmancy-sys-color-error-default);
	}
	.delta[data-trend='neutral'] {
		color: var(--schmancy-sys-color-surface-on);
		background: var(--schmancy-sys-color-surface-containerHigh);
	}
	.arrow {
		font-size: 0.625rem;
		line-height: 1;
	}
	.row {
		display: inline-flex;
		align-items: baseline;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
`){constructor(...e){super(...e),this.label=``,this.value=``,this.size=`md`}_arrowFor(e){return e===`up`?`↑`:e===`down`?`↓`:`→`}render(){let e=this.trend??`neutral`;return r.html`
			<span class="label" part="label"><slot name="label">${this.label}</slot></span>
			<span class="row">
				<span class="value" part="value"><slot>${this.value}</slot></span>
				${this.delta?r.html`
							<span class="delta" part="delta" data-trend=${e}>
								${this.trend?r.html`<span class="arrow" aria-hidden="true">${this._arrowFor(this.trend)}</span>`:r.nothing}
								${this.delta}
							</span>
						`:r.nothing}
			</span>
		`}};t.t([(0,n.property)({type:String})],i.prototype,`label`,void 0),t.t([(0,n.property)({type:String})],i.prototype,`value`,void 0),t.t([(0,n.property)({type:String,reflect:!0})],i.prototype,`trend`,void 0),t.t([(0,n.property)({type:String})],i.prototype,`delta`,void 0),t.t([(0,n.property)({type:String,reflect:!0})],i.prototype,`size`,void 0),i=t.t([(0,n.customElement)(`schmancy-metric`)],i),Object.defineProperty(exports,`SchmancyMetric`,{enumerable:!0,get:function(){return i}});