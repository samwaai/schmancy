Object.defineProperty(exports,Symbol.toStringTag,{value:`Module`}),require(`./chunk-CncqDLb2.cjs`);const e=require(`./tailwind.mixin-DRI1oTYQ.cjs`),t=require(`./decorate-F9CuyeHg.cjs`);require(`./mixins.cjs`);let n=require(`lit/decorators.js`),r=require(`lit`);var i=class extends e.t(r.css`
	:host {
		display: inline-block;
	}
	:host([disabled]) {
		opacity: 0.38;
		pointer-events: none;
	}
	button {
		appearance: none;
		background: none;
		border: 0;
		padding: 0;
		cursor: pointer;
		font: inherit;
	}
	.track {
		width: 2.25rem;
		height: 1.25rem;
		border-radius: 999px;
		background: var(--schmancy-sys-color-surface-containerHighest, #e0e0e0);
		border: 1px solid var(--schmancy-sys-color-outline, #79747e);
		position: relative;
		transition: background 150ms ease, border-color 150ms ease;
	}
	:host(:state(checked)) .track {
		background: var(--schmancy-sys-color-primary-default, #6750a4);
		border-color: var(--schmancy-sys-color-primary-default, #6750a4);
	}
	.thumb {
		position: absolute;
		top: 50%;
		left: 0.125rem;
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 999px;
		background: var(--schmancy-sys-color-outline, #79747e);
		transform: translateY(-50%);
		transition: transform 150ms ease, background 150ms ease, width 150ms ease, height 150ms ease;
	}
	:host(:state(checked)) .thumb {
		transform: translate(1rem, -50%);
		width: 1rem;
		height: 1rem;
		background: var(--schmancy-sys-color-primary-on, #ffffff);
	}
	button:focus-visible .track {
		outline: 2px solid var(--schmancy-sys-color-primary-default, #6750a4);
		outline-offset: 2px;
	}
	@media (prefers-reduced-motion: reduce) {
		.track, .thumb { transition: none; }
	}
`){static{this.formAssociated=!0}static{this.shadowRootOptions={...r.LitElement.shadowRootOptions,delegatesFocus:!0}}constructor(){super(),this.checked=!1,this.disabled=!1,this.required=!1,this.name=``,this.value=`on`,this.label=``,this._toggle=()=>{this.disabled||(this.checked=!this.checked,this.dispatchEvent(new CustomEvent(`change`,{detail:{value:this.checked},bubbles:!0,composed:!0})))},this._onKeydown=e=>{e.key!==` `&&e.key!==`Enter`||(e.preventDefault(),this._toggle())};try{this.internals=this.attachInternals()}catch{this.internals=void 0}}get form(){return this.internals?.form??null}updated(e){super.updated?.(e),(e.has(`checked`)||e.has(`value`)||e.has(`name`))&&(this.internals?.setFormValue(this.checked?this.value:null),this.checked?this.internals?.states.add(`checked`):this.internals?.states.delete(`checked`)),(e.has(`required`)||e.has(`checked`))&&(this.required&&!this.checked?this.internals?.setValidity({valueMissing:!0},`This switch is required.`):this.internals?.setValidity({}))}formResetCallback(){this.checked=this.hasAttribute(`checked`)}formDisabledCallback(e){this.disabled=e}checkValidity(){return this.internals?.checkValidity()??!0}reportValidity(){return this.internals?.reportValidity()??!0}render(){return r.html`
			<button
				type="button"
				role="switch"
				aria-checked=${this.checked?`true`:`false`}
				aria-label=${this.label||r.nothing}
				aria-required=${this.required?`true`:`false`}
				?disabled=${this.disabled}
				@click=${this._toggle}
				@keydown=${this._onKeydown}
			>
				<span part="track" class="track">
					<span part="thumb" class="thumb"></span>
				</span>
			</button>
		`}};t.t([(0,n.property)({type:Boolean,reflect:!0})],i.prototype,`checked`,void 0),t.t([(0,n.property)({type:Boolean,reflect:!0})],i.prototype,`disabled`,void 0),t.t([(0,n.property)({type:Boolean,reflect:!0})],i.prototype,`required`,void 0),t.t([(0,n.property)({type:String})],i.prototype,`name`,void 0),t.t([(0,n.property)({type:String})],i.prototype,`value`,void 0),t.t([(0,n.property)({type:String})],i.prototype,`label`,void 0),i=t.t([(0,n.customElement)(`schmancy-switch`)],i),Object.defineProperty(exports,`SchmancySwitch`,{enumerable:!0,get:function(){return i}});