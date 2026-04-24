require(`./chunk-BCfY8kxB.cjs`);const e=require(`./tailwind.mixin-BfdVIGgD.cjs`),t=require(`./decorate-F9CuyeHg.cjs`);require(`./mixins.cjs`);let n=require(`rxjs`),r=require(`lit/decorators.js`),i=require(`lit`);var a=class extends e.t(i.css`
	:host {
		display: block;
		cursor: pointer;
		user-select: none;
		outline: none;
	}

	:host(:focus-visible) {
		outline: 2px solid var(--schmancy-sys-color-primary-default);
		outline-offset: -2px;
	}

	:host([hidden]) {
		display: none;
	}

	:host([disabled]) {
		opacity: 0.5;
		pointer-events: none;
	}
`){constructor(...e){super(...e),this.value=``,this.label=``,this.selected=!1,this.disabled=!1,this.group=``,this.icon=``}connectedCallback(){super.connectedCallback(),this.id||=`schmancy-option-${Math.random().toString(36).substring(2,9)}`,this.label||=this.textContent?.trim()||this.value,!this.value&&this.textContent&&(this.value=this.textContent.trim()),(0,n.fromEvent)(this,`click`).pipe((0,n.takeUntil)(this.disconnecting)).subscribe(e=>{e.stopPropagation(),this.disabled||this.dispatchEvent(new CustomEvent(`option-select`,{bubbles:!0,composed:!0,detail:{value:this.value}}))}),(0,n.fromEvent)(this,`keydown`).pipe((0,n.takeUntil)(this.disconnecting)).subscribe(e=>{if(e.key===` `||e.key===`Enter`){if(e.preventDefault(),e.stopPropagation(),this.disabled)return;this.dispatchEvent(new CustomEvent(`option-select`,{bubbles:!0,composed:!0,detail:{value:this.value}}))}})}disconnectedCallback(){super.disconnectedCallback()}render(){let e={"py-2":!0,"px-3":!0,rounded:!0,"text-sm":!0,"w-full":!0,flex:!0,"items-center":!0,"gap-2":!0,"bg-primary-container":this.selected,"text-primary-onContainer":this.selected,"hover:bg-surface-high":!this.selected,"focus:outline-none":!0};return i.html`
			<div class=${this.classMap(e)} role="option" aria-selected=${this.selected} aria-disabled=${this.disabled}>
				${this.icon?i.html`<span class="icon">${this.icon}</span>`:``}
				<span class="flex-1">${this.label||this.value}</span>
				${this.selected?i.html`
							<span class="check">
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<polyline points="20 6 9 17 4 12"></polyline>
								</svg>
							</span>
						`:``}
			</div>
		`}};t.t([(0,r.property)({type:String})],a.prototype,`value`,void 0),t.t([(0,r.property)({type:String})],a.prototype,`label`,void 0),t.t([(0,r.property)({type:Boolean,reflect:!0})],a.prototype,`selected`,void 0),t.t([(0,r.property)({type:Boolean,reflect:!0})],a.prototype,`disabled`,void 0),t.t([(0,r.property)({type:String})],a.prototype,`group`,void 0),t.t([(0,r.property)({type:String})],a.prototype,`icon`,void 0),a=t.t([(0,r.customElement)(`schmancy-option`)],a);