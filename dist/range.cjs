Object.defineProperty(exports,Symbol.toStringTag,{value:`Module`}),require(`./chunk-CncqDLb2.cjs`);const e=require(`./tailwind.mixin-BHX99hgX.cjs`),t=require(`./decorate-F9CuyeHg.cjs`);require(`./mixins.cjs`);let n=require(`lit/decorators.js`),r=require(`lit`),i=require(`lit/directives/when.js`);var a=class extends e.t(r.css`
	input[type='range'] {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 4px;
		border-radius: 2px;
		background: linear-gradient(
			to right,
			var(--color-primary, #6750a4) 0%,
			var(--color-primary, #6750a4) var(--range-progress, 0%),
			color-mix(in srgb, var(--color-primary, #6750a4) 30%, transparent) var(--range-progress, 0%),
			color-mix(in srgb, var(--color-primary, #6750a4) 30%, transparent) 100%
		);
		outline: none;
		cursor: pointer;
	}
	input[type='range']:disabled {
		opacity: 0.38;
		cursor: not-allowed;
	}
	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--color-primary, #6750a4);
		cursor: pointer;
		transition: box-shadow 0.1s ease;
	}
	input[type='range']::-webkit-slider-thumb:hover {
		box-shadow: 0 0 0 8px color-mix(in srgb, var(--color-primary, #6750a4) 12%, transparent);
	}
	input[type='range']::-moz-range-thumb {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: none;
		background: var(--color-primary, #6750a4);
		cursor: pointer;
	}
`){constructor(...e){super(...e),this.min=0,this.max=1,this.step=.01,this.value=0,this.disabled=!1}get progress(){return(this.value-this.min)/(this.max-this.min)*100+`%`}render(){return r.html`
			<div class="flex flex-col gap-1 w-full">
				${(0,i.when)(this.label,()=>r.html`
						<div class="flex justify-between items-center">
							<schmancy-typography type="label" token="sm" class="text-surface-on">${this.label}</schmancy-typography>
							<schmancy-typography type="label" token="sm" class="text-surface-on opacity-60">${this.value}</schmancy-typography>
						</div>
					`)}
				<input
					type="range"
					.min=${String(this.min)}
					.max=${String(this.max)}
					.step=${String(this.step)}
					.value=${String(this.value)}
					?disabled=${this.disabled}
					style="--range-progress: ${this.progress}"
					@input=${e=>{this.value=Number(e.target.value),this.dispatchEvent(new CustomEvent(`change`,{detail:{value:this.value},bubbles:!0,composed:!0}))}}
				/>
			</div>
		`}};t.t([(0,n.property)({type:Number})],a.prototype,`min`,void 0),t.t([(0,n.property)({type:Number})],a.prototype,`max`,void 0),t.t([(0,n.property)({type:Number})],a.prototype,`step`,void 0),t.t([(0,n.property)({type:Number})],a.prototype,`value`,void 0),t.t([(0,n.property)({type:String})],a.prototype,`label`,void 0),t.t([(0,n.property)({type:Boolean})],a.prototype,`disabled`,void 0),a=t.t([(0,n.customElement)(`schmancy-range`)],a),Object.defineProperty(exports,`SchmancyRange`,{enumerable:!0,get:function(){return a}});