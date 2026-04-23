require(`./chunk-BCfY8kxB.cjs`);const e=require(`./tailwind.mixin-ZzkXQTFA.cjs`),t=require(`./provide-BbFbvIEk.cjs`),n=require(`./decorate-F9CuyeHg.cjs`);require(`./mixins.cjs`);let r=require(`lit/decorators.js`),i=require(`lit`);var a=e.o(void 0),o=e.o(`surface`),s=class extends e.t(i.css`
	:host {
		display: block;
		border-radius: 0.5rem;
		transition:
			background 200ms ease,
			box-shadow 300ms ease,
			transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	:host(:hover:not([readonly])) {
		background: color-mix(in srgb, var(--schmancy-sys-color-surface-on) 8%, transparent);
		box-shadow: 0 2px 8px -4px color-mix(in srgb, var(--schmancy-sys-color-primary-default) 10%, transparent);
	}
	:host(:active:not([readonly])) {
		transform: scale(0.98);
		transition-duration: 100ms;
	}
	:host([selected]) {
		background: color-mix(in srgb, var(--schmancy-sys-color-secondary-container) 30%, transparent);
		box-shadow: 0 0 10px -3px color-mix(in srgb, var(--schmancy-sys-color-secondary-default) 12%, transparent);
	}
	@media (prefers-reduced-motion: reduce) {
		:host { transition: background 200ms ease; }
		:host(:active:not([readonly])) { transform: none; }
	}
`){constructor(...e){super(...e),this.selected=!1}get imgClasses(){return[`h-4`,`w-4`,`sm:h-5`,`sm:w-5`,`object-contain`]}firstUpdated(){this.leading?.forEach(e=>{e.classList.add(...this.imgClasses)}),this.trailing?.forEach(e=>{e.classList.add(...this.imgClasses)})}render(){let e={"w-full flex items-center min-h-[36px] sm:min-h-[40px] py-1 px-2 sm:px-3 text-sm":!0,"focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:z-1 outline-secondary-default outline-hidden":!0,"cursor-pointer":!this.readonly};return i.html`<li .tabIndex=${this.readonly?-1:0} class=${this.classMap(e)}>
			<slot></slot>
		</li>`}};n.t([e.a({context:o,subscribe:!0}),(0,r.property)()],s.prototype,`variant`,void 0),n.t([(0,r.property)({type:Boolean,reflect:!0})],s.prototype,`rounded`,void 0),n.t([(0,r.property)({type:Boolean,reflect:!0})],s.prototype,`readonly`,void 0),n.t([(0,r.property)({type:Boolean,reflect:!0})],s.prototype,`selected`,void 0),n.t([(0,r.queryAssignedElements)({slot:`leading`,flatten:!0})],s.prototype,`leading`,void 0),n.t([(0,r.queryAssignedElements)({slot:`trailing`,flatten:!0})],s.prototype,`trailing`,void 0),s=n.t([(0,r.customElement)(`schmancy-list-item`)],s);var c=class extends e.t(i.css`
	:host {
		display: block;
		padding-top: 8px;
		padding-bottom: 8px;
	}
`){constructor(...e){super(...e),this.fill=`auto`,this.elevation=0}render(){return i.html`
			<schmancy-surface .elevation=${this.elevation} .fill=${this.fill} type=${this.surface}>
				<ul>
					<slot></slot>
				</ul>
			</schmancy-surface>
		`}};n.t([t.t({context:a}),(0,r.property)()],c.prototype,`surface`,void 0),n.t([(0,r.property)({type:String,reflect:!0})],c.prototype,`fill`,void 0),n.t([(0,r.property)({type:Number})],c.prototype,`elevation`,void 0),c=n.t([(0,r.customElement)(`schmancy-list`)],c),Object.defineProperty(exports,`n`,{enumerable:!0,get:function(){return s}}),Object.defineProperty(exports,`r`,{enumerable:!0,get:function(){return a}}),Object.defineProperty(exports,`t`,{enumerable:!0,get:function(){return c}});