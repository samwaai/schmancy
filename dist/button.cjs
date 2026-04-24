Object.defineProperty(exports,Symbol.toStringTag,{value:`Module`}),require(`./chunk-BCfY8kxB.cjs`);const e=require(`./provide-CnXCF-UP.cjs`),t=require(`./decorate-F9CuyeHg.cjs`),n=require(`./litElement.mixin-DeT3kAOS.cjs`);require(`./mixins.cjs`);const r=require(`./magnetic-aBBnj_vk.cjs`),i=require(`./context-C6GwmNJJ.cjs`);let a=require(`lit/decorators.js`),o=require(`lit`),s=require(`lit/directives/when.js`),c=require(`lit/directives/if-defined.js`);var l=class extends n.t(o.css`:host{
		display: inline-block;
		min-width: fit-content;
		overflow: hidden;
		position: relative;
		touch-action: manipulation;
		border-radius: 1rem;
		transition:
			box-shadow 300ms cubic-bezier(0.34, 1.56, 0.64, 1),
			transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	:host(:hover:not([disabled])) {
		box-shadow: 0 4px 16px -4px color-mix(in srgb, var(--schmancy-sys-color-primary-default) 20%, transparent);
	}
	:host(:active:not([disabled])) {
		transform: scale(0.97);
		box-shadow: 0 1px 4px -2px color-mix(in srgb, var(--schmancy-sys-color-primary-default) 10%, transparent);
		transition-duration: 100ms;
	}
	@media (prefers-reduced-motion: reduce) {
		:host { transition: none; }
		:host(:hover:not([disabled])) { box-shadow: none; }
		:host(:active:not([disabled])) { transform: none; box-shadow: none; }
	}
	:host *,
	* {
		touch-action: manipulation;
	}`){static{this.shadowRootOptions={...o.LitElement.shadowRootOptions,mode:`open`,delegatesFocus:!0}}static{this.formAssociated=!0}constructor(){super(),this.variant=`text`,this.width=`auto`,this.size=`md`,this.type=`button`,this.disabled=!1;try{this.internals=this.attachInternals()}catch{this.internals=void 0}this.addEventListener(`click`,e=>{if(this.disabled)return e.preventDefault(),void e.stopImmediatePropagation();let t=this.internals?.form;t&&(this.type===`submit`?(e.preventDefault(),t.requestSubmit()):this.type===`reset`&&(e.preventDefault(),t.reset()))})}get form(){return this.internals?.form??null}formDisabledCallback(e){this.disabled=e}set ariaLabel(e){let t=this._ariaLabel;this._ariaLabel=e,this.hasAttribute(`aria-label`)&&this.removeAttribute(`aria-label`),this.requestUpdate(`ariaLabel`,t)}get ariaLabel(){return this._ariaLabel}focus(e){this.nativeElement.focus(e)}blur(){this.nativeElement.blur()}get effectiveColor(){return this.color?this.color:(this.variant===`tonal`?`filled tonal`:this.variant)===`filled tonal`?`secondary`:`primary`}get imgClasses(){return[{xxs:`w-3 h-3`,xs:`w-4 h-4`,sm:`w-5 h-5`,md:`w-6 h-6`,lg:`w-7 h-7`}[this.size],`object-contain`]}firstUpdated(){this.prefixImgs?.forEach(e=>{e.classList.add(...this.imgClasses),e.hasAttribute(`alt`)||e.setAttribute(`alt`,``)}),this.suffixImgs?.forEach(e=>{e.classList.add(...this.imgClasses),e.hasAttribute(`alt`)||e.setAttribute(`alt`,``)})}click(){this.dispatchEvent(new Event(`click`,{bubbles:!0,composed:!0}))}_preventDefault(e){e.preventDefault(),e.stopPropagation()}render(){let e=this.variant===`tonal`?`filled tonal`:this.variant,t={"z-0 transition-all duration-200 relative rounded-2xl inline-flex justify-center items-center outline-secondary-default focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 outline-hidden w-[inherit] overflow-hidden":!0,"h-6":this.size===`xxs`,"h-8":this.size===`xs`,"h-10":this.size===`sm`,"h-12":this.size===`md`,"h-14":this.size===`lg`,"py-1 px-2":this.size===`xxs`,"py-2 px-4":this.size===`xs`,"py-2.5 px-5":this.size===`sm`,"py-3 px-6":this.size===`md`,"py-4 px-7":this.size===`lg`,"text-[10px] font-medium leading-3":this.size===`xxs`,"text-xs font-medium leading-4":this.size===`xs`,"text-sm font-medium leading-5":this.size===`sm`||this.size===`md`,"text-base font-medium leading-6":this.size===`lg`,"tracking-[0.1px]":!0,"gap-0.5":this.size===`xxs`,"gap-1":this.size===`xs`,"gap-1.5":this.size===`sm`,"gap-2":this.size===`md`,"gap-2.5":this.size===`lg`,"cursor-pointer":!this.disabled,"opacity-[0.38]":this.disabled,"hover:shadow-sm":!this.disabled&&e===`elevated`,"w-full tex-center":this.width===`full`,"bg-surface-low shadow-xs":e===`elevated`,"bg-transparent border-1 border-solid":e===`outlined`,"border-outline":e===`outlined`&&this.effectiveColor===`primary`,"border-success-default":e===`outlined`&&this.effectiveColor===`success`,"border-error-default":e===`outlined`&&this.effectiveColor===`error`,"border-warning-default":e===`outlined`&&this.effectiveColor===`warning`,"border-info-default":e===`outlined`&&this.effectiveColor===`info`,"border-secondary-default":e===`outlined`&&this.effectiveColor===`secondary`,"border-outline-variant":e===`outlined`&&this.effectiveColor===`neutral`,"bg-primary-default":e===`filled`&&this.effectiveColor===`primary`,"bg-secondary-default":e===`filled`&&this.effectiveColor===`secondary`,"bg-success-default":e===`filled`&&this.effectiveColor===`success`,"bg-error-default":e===`filled`&&this.effectiveColor===`error`,"bg-warning-default":e===`filled`&&this.effectiveColor===`warning`,"bg-info-default":e===`filled`&&this.effectiveColor===`info`,"bg-surface-containerHighest":e===`filled`&&this.effectiveColor===`neutral`,"text-primary-on":e===`filled`&&this.effectiveColor===`primary`,"text-secondary-on":e===`filled`&&this.effectiveColor===`secondary`,"text-success-on":e===`filled`&&this.effectiveColor===`success`,"text-error-on":e===`filled`&&this.effectiveColor===`error`,"text-warning-on":e===`filled`&&this.effectiveColor===`warning`,"text-info-on":e===`filled`&&this.effectiveColor===`info`,"text-surface-on":e===`filled`&&this.effectiveColor===`neutral`,"bg-primary-container":e===`filled tonal`&&this.effectiveColor===`primary`,"bg-secondary-container":e===`filled tonal`&&this.effectiveColor===`secondary`,"bg-success-container":e===`filled tonal`&&this.effectiveColor===`success`,"bg-error-container":e===`filled tonal`&&this.effectiveColor===`error`,"bg-warning-container":e===`filled tonal`&&this.effectiveColor===`warning`,"bg-info-container":e===`filled tonal`&&this.effectiveColor===`info`,"bg-surface-containerLow":e===`filled tonal`&&this.effectiveColor===`neutral`,"text-primary-onContainer":e===`filled tonal`&&this.effectiveColor===`primary`,"text-secondary-onContainer":e===`filled tonal`&&this.effectiveColor===`secondary`,"text-success-onContainer":e===`filled tonal`&&this.effectiveColor===`success`,"text-error-onContainer":e===`filled tonal`&&this.effectiveColor===`error`,"text-warning-onContainer":e===`filled tonal`&&this.effectiveColor===`warning`,"text-info-onContainer":e===`filled tonal`&&this.effectiveColor===`info`,"text-primary-default":(e===`text`||e===`elevated`||e===`outlined`)&&this.effectiveColor===`primary`,"text-secondary-default":(e===`text`||e===`elevated`||e===`outlined`)&&this.effectiveColor===`secondary`,"text-success-default":(e===`text`||e===`elevated`||e===`outlined`)&&this.effectiveColor===`success`,"text-error-default":(e===`text`||e===`elevated`||e===`outlined`)&&this.effectiveColor===`error`,"text-warning-default":(e===`text`||e===`elevated`||e===`outlined`)&&this.effectiveColor===`warning`,"text-info-default":(e===`text`||e===`elevated`||e===`outlined`)&&this.effectiveColor===`info`,"text-surface-onVariant":(e===`text`||e===`elevated`||e===`outlined`||e===`filled tonal`)&&this.effectiveColor===`neutral`},n={"absolute inset-0 hover:opacity-[0.08] z-0 rounded-2xl":!0,"focus-visible:opacity-[0.10]":!0,"active:opacity-[0.10]":!0,"hover:bg-primary-on":e===`filled`&&this.effectiveColor===`primary`,"hover:bg-secondary-on":e===`filled`&&this.effectiveColor===`secondary`,"hover:bg-success-on":e===`filled`&&this.effectiveColor===`success`,"hover:bg-error-on":e===`filled`&&this.effectiveColor===`error`,"hover:bg-warning-on":e===`filled`&&this.effectiveColor===`warning`,"hover:bg-info-on":e===`filled`&&this.effectiveColor===`info`,"hover:bg-surface-on":e===`filled`&&this.effectiveColor===`neutral`,"hover:bg-primary-default":(e===`outlined`||e===`elevated`||e===`text`)&&this.effectiveColor===`primary`,"hover:bg-secondary-default":(e===`outlined`||e===`elevated`||e===`text`)&&this.effectiveColor===`secondary`,"hover:bg-success-default":(e===`outlined`||e===`elevated`||e===`text`)&&this.effectiveColor===`success`,"hover:bg-error-default":(e===`outlined`||e===`elevated`||e===`text`)&&this.effectiveColor===`error`,"hover:bg-warning-default":(e===`outlined`||e===`elevated`||e===`text`)&&this.effectiveColor===`warning`,"hover:bg-info-default":(e===`outlined`||e===`elevated`||e===`text`)&&this.effectiveColor===`info`,"hover:bg-surface-onVariant":(e===`outlined`||e===`elevated`||e===`text`)&&this.effectiveColor===`neutral`,"hover:bg-primary-container":e===`filled tonal`&&this.effectiveColor===`primary`,"hover:bg-secondary-container":e===`filled tonal`&&this.effectiveColor===`secondary`,"hover:bg-success-container":e===`filled tonal`&&this.effectiveColor===`success`,"hover:bg-error-container":e===`filled tonal`&&this.effectiveColor===`error`,"hover:bg-warning-container":e===`filled tonal`&&this.effectiveColor===`warning`,"hover:bg-info-container":e===`filled tonal`&&this.effectiveColor===`info`,"hover:bg-surface-containerLow":e===`filled tonal`&&this.effectiveColor===`neutral`};return this.href?o.html`
				<a
					${r.t({strength:3,radius:60})}
					part="base"
					href=${(0,c.ifDefined)(this.disabled?void 0:this.href)}
					aria-label=${(0,c.ifDefined)(this.ariaLabel)}
					class="${this.classMap(t)}"
					tabindex=${this.disabled?`-1`:`0`}
					aria-disabled=${this.disabled}
					@click=${this.disabled?this._preventDefault:void 0}
				>
					${(0,s.when)(!this.disabled,()=>o.html`<div class="${this.classMap(n)}"></div>`)}
					<slot name="prefix"></slot>
					<slot></slot>
					<slot name="suffix"></slot>
				</a>
			`:o.html`
			<button
				${r.t({strength:3,radius:60})}
				part="base"
				aria-label=${(0,c.ifDefined)(this.ariaLabel)}
				?disabled=${this.disabled}
				class="${this.classMap(t)}"
				type=${(0,c.ifDefined)(this.type)}
				tabindex=${(0,c.ifDefined)(this.disabled?`-1`:void 0)}
			>
				${(0,s.when)(!this.disabled,()=>o.html`<div class="${this.classMap(n)}"></div>`)}
				<slot name="prefix"></slot>
				<slot></slot>
				<slot name="suffix"></slot>
			</button>
		`}};t.t([(0,a.query)(`[part="base"]`,!0)],l.prototype,`nativeElement`,void 0),t.t([(0,a.property)({reflect:!0,type:String})],l.prototype,`variant`,void 0),t.t([(0,a.property)({reflect:!0,type:String})],l.prototype,`color`,void 0),t.t([(0,a.property)()],l.prototype,`width`,void 0),t.t([e.t({context:i.t}),(0,a.property)({type:String})],l.prototype,`size`,void 0),t.t([(0,a.property)({reflect:!0,type:String})],l.prototype,`type`,void 0),t.t([(0,a.property)()],l.prototype,`href`,void 0),t.t([(0,a.property)({type:Boolean,reflect:!0})],l.prototype,`disabled`,void 0),t.t([(0,a.property)({attribute:`aria-label`})],l.prototype,`ariaLabel`,null),t.t([(0,a.queryAssignedElements)({slot:`prefix`,flatten:!0,selector:`img`})],l.prototype,`prefixImgs`,void 0),t.t([(0,a.queryAssignedElements)({slot:`suffix`,flatten:!0,selector:`img`})],l.prototype,`suffixImgs`,void 0),l=t.t([(0,a.customElement)(`schmancy-button`)],l);var u=class extends n.t(o.css`
	:host {
		display: block;
		border-radius: 9999px;
		transition:
			box-shadow 300ms cubic-bezier(0.34, 1.56, 0.64, 1),
			transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	:host(:hover:not([disabled])) {
		box-shadow: 0 2px 12px -4px color-mix(in srgb, var(--schmancy-sys-color-primary-default) 18%, transparent);
	}
	:host(:active:not([disabled])) {
		transform: scale(0.92);
		box-shadow: none;
		transition-duration: 100ms;
	}
	@media (prefers-reduced-motion: reduce) {
		:host { transition: none; }
		:host(:hover:not([disabled])) { box-shadow: none; }
		:host(:active:not([disabled])) { transform: none; box-shadow: none; }
	}
`){constructor(...e){super(...e),this.size=`md`,this.variant=`text`,this.width=`auto`,this.type=`button`,this.disabled=!1,this.text=!1}static{this.shadowRootOptions={...o.LitElement.shadowRootOptions,mode:`open`,delegatesFocus:!0}}connectedCallback(){super.connectedCallback(),this._captureIconFromChildren()}_captureIconFromChildren(){if(!this.icon&&!this.text){for(let e of this.childNodes)if(e.nodeType===Node.TEXT_NODE){let t=e.textContent?.trim();if(t)return void(this._capturedIcon=t)}}}_handleSlotChange(e){if(this.icon||this.text)return;let t=e.target.assignedNodes({flatten:!0});for(let e of t)if(e.nodeType===Node.TEXT_NODE){let t=e.textContent?.trim();if(t)return void(this._capturedIcon=t)}}set ariaLabel(e){let t=this._ariaLabel;this._ariaLabel=e,this.hasAttribute(`aria-label`)&&this.removeAttribute(`aria-label`),this.requestUpdate(`ariaLabel`,t)}get ariaLabel(){return this._ariaLabel}focus(e){this.nativeElement.focus(e)}blur(){this.nativeElement.blur()}click(){this.dispatchEvent(new Event(`click`,{bubbles:!0,composed:!0}))}_preventDefault(e){e.preventDefault(),e.stopPropagation()}firstUpdated(e){}render(){let e=this.variant===`tonal`?`filled tonal`:this.variant,t={"z-0 h-full transition-all duration-200 relative rounded-full inline-flex justify-center items-center gap-[8px] outline-secondary-default focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 outline-hidden":!0,"opacity-[0.38]":this.disabled,"cursor-pointer":!this.disabled,"hover:shadow-xs":!this.disabled&&(e===`outlined`||e===`text`||e===`filled`||e===`filled tonal`),"hover:shadow-sm":!this.disabled&&e===`elevated`,"w-full text-center":this.width===`full`,"bg-surface-low text-primary-default shadow-xs":e===`elevated`,"bg-transparent text-primary-default border-1 border-outline":e===`outlined`,"bg-primary-default text-primary-on":e===`filled`,"bg-secondary-container text-secondary-onContainer":e===`filled tonal`,"text-primary-default":e===`text`,"p-1.5":this.size===`xxs`,"p-2":this.size===`xs`,"p-2.5":this.size===`sm`,"p-3":this.size===`md`,"p-4":this.size===`lg`,"p-5":this.size===`xl`},n={"hover:opacity-[0.08] rounded-full z-0":!0,"hover:bg-primary-on":e===`filled`,"hover:bg-primary-default":e===`outlined`||e===`elevated`||e===`text`,"hover:bg-secondary-container":e===`filled tonal`},i=this.size===`xxs`?`12px`:this.size===`xs`?`16px`:this.size===`sm`?`20px`:this.size===`md`||this.size===`lg`?`24px`:`40px`;return this.href?o.html`
				<a
					${r.t({strength:3,radius:50})}
					part="base"
					href=${(0,c.ifDefined)(this.disabled?void 0:this.href)}
					aria-label=${(0,c.ifDefined)(this.ariaLabel)}
					class="${this.classMap(t)}"
					tabindex=${this.disabled?`-1`:`0`}
					aria-disabled=${this.disabled}
					@click=${this.disabled?this._preventDefault:void 0}
				>
					${(0,s.when)(!this.disabled,()=>o.html`<div class="absolute inset-0 ${this.classMap(n)}"></div>`)}
					${this.text?o.html`<slot></slot>`:o.html`
							<slot style="display:none" @slotchange=${this._handleSlotChange}></slot>
							<schmancy-icon size=${i} icon=${this.icon||this._capturedIcon}></schmancy-icon>
						`}
				</a>
			`:o.html`
			<button
				${r.t({strength:3,radius:50})}
				part="base"
				aria-label=${(0,c.ifDefined)(this.ariaLabel)}
				?disabled=${this.disabled}
				class="${this.classMap(t)}"
				type=${(0,c.ifDefined)(this.type)}
				tabindex=${(0,c.ifDefined)(this.disabled?`-1`:void 0)}
			>
				${(0,s.when)(!this.disabled,()=>o.html`<div class="absolute inset-0 ${this.classMap(n)}"></div>`)}
				${this.text?o.html`<slot></slot>`:o.html`
						<slot style="display:none" @slotchange=${this._handleSlotChange}></slot>
						<schmancy-icon size=${i} icon=${this.icon||this._capturedIcon}></schmancy-icon>
					`}
			</button>
		`}};t.t([(0,a.query)(`[part="base"]`,!0)],u.prototype,`nativeElement`,void 0),t.t([(0,a.property)({type:String})],u.prototype,`size`,void 0),t.t([(0,a.property)({reflect:!0,type:String})],u.prototype,`variant`,void 0),t.t([(0,a.property)()],u.prototype,`width`,void 0),t.t([(0,a.property)({reflect:!0,type:String})],u.prototype,`type`,void 0),t.t([(0,a.property)()],u.prototype,`href`,void 0),t.t([(0,a.property)({type:Boolean,reflect:!0})],u.prototype,`disabled`,void 0),t.t([(0,a.property)({type:Boolean,reflect:!0})],u.prototype,`text`,void 0),t.t([(0,a.property)({type:String})],u.prototype,`icon`,void 0),t.t([(0,a.state)()],u.prototype,`_capturedIcon`,void 0),t.t([(0,a.property)({attribute:`aria-label`})],u.prototype,`ariaLabel`,null),u=t.t([(0,a.customElement)(`schmancy-icon-button`)],u),Object.defineProperty(exports,`SchmancyButton`,{enumerable:!0,get:function(){return l}}),Object.defineProperty(exports,`SchmnacyIconButton`,{enumerable:!0,get:function(){return u}});