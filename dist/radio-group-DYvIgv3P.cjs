require(`./chunk-CncqDLb2.cjs`);const e=require(`./tailwind.mixin-BHX99hgX.cjs`),t=require(`./decorate-F9CuyeHg.cjs`),n=require(`./mixins.cjs`);let r=require(`rxjs`),i=require(`lit/decorators.js`),a=require(`lit`),o=require(`lit/directives/when.js`);var s=class extends n.FormFieldMixin(e.t(`:host{display:inherit;position:inherit}`)){constructor(...e){super(...e),this.label=``,this.name=``,this.value=``,this.options=[],this.required=!1,this.selection$=new r.Subject}connectedCallback(){super.connectedCallback(),this.selection$.pipe((0,r.takeUntil)(this.disconnecting)).subscribe(e=>{this.value=e,this.emitChange({value:e}),this.updateChildRadioButtons()}),(0,r.fromEvent)(this,`radio-button-click`).pipe((0,r.takeUntil)(this.disconnecting)).subscribe(e=>{this.selection$.next(e.detail.value)})}disconnectedCallback(){super.disconnectedCallback(),this.selection$?.complete()}handleSelection(e){this.selection$.next(e)}updateChildRadioButtons(){this.querySelectorAll(`schmancy-radio-button`).forEach(e=>{e.getAttribute(`value`)===this.value?e.setAttribute(`checked`,``):e.removeAttribute(`checked`)})}updated(e){super.updated(e),e.has(`value`)&&this.updateChildRadioButtons()}render(){let e=this.childElementCount>0;return a.html`
			<div class="grid gap-4">
				${(0,o.when)(this.label,()=>a.html` <label class="text-base font-semibold text-surface-on">${this.label}</label> `)}
				
				${e?a.html`<slot></slot>`:this.options?.map(e=>a.html`
						<div class="flex items-center">
							<input
								.required=${this.required}
								id=${e.value}
								class="h-4 w-4 border-outline text-primary-default focus:ring-primary-default"
								type="radio"
								name=${this.name}
								.value=${e.value}
								.checked=${e.value===this.value}
								@change=${()=>this.handleSelection(e.value)}
							/>
							<label for=${e.value} class="ml-3 block text-sm font-medium leading-6 text-surface-on">
								${e.label||e.value}
							</label>
						</div>
					`)}
			</div>
		`}};t.t([(0,i.property)({type:String})],s.prototype,`label`,void 0),t.t([(0,i.property)({type:String})],s.prototype,`name`,void 0),t.t([(0,i.property)({type:String})],s.prototype,`value`,void 0),t.t([(0,i.property)({type:Array})],s.prototype,`options`,void 0),t.t([(0,i.property)({type:Boolean})],s.prototype,`required`,void 0),s=t.t([(0,i.customElement)(`schmancy-radio-group`)],s);var c=class extends n.FormFieldMixin(e.t()){constructor(...e){super(...e),this.value=``,this.checked=!1,this.disabled=!1,this.name=``}connectedCallback(){super.connectedCallback(),(0,r.fromEvent)(this,`click`).pipe((0,r.takeUntil)(this.disconnecting)).subscribe(this.handleClick)}disconnectedCallback(){super.disconnectedCallback()}handleClick(){if(!this.disabled)if(this.closest(`schmancy-radio-group`)){let e=new CustomEvent(`radio-button-click`,{detail:{value:this.value},bubbles:!0,composed:!0});this.dispatchEvent(e)}else this.checked=!0,this.emitChange({value:this.value})}render(){return a.html`
			<label class="relative flex items-start cursor-pointer">
				<div class="flex items-center h-6">
					<input
						type="radio"
						class="h-4 w-4 text-primary-default focus:ring-primary-container border-outline"
						.value=${this.value}
						.checked=${this.checked}
						.disabled=${this.disabled}
						.name=${this.name}
						@change=${()=>{}}
					/>
				</div>
				<div class="ml-3">
					<slot name="label"></slot>
				</div>
			</label>
		`}};t.t([(0,i.property)({type:String})],c.prototype,`value`,void 0),t.t([(0,i.property)({type:Boolean,reflect:!0})],c.prototype,`checked`,void 0),t.t([(0,i.property)({type:Boolean})],c.prototype,`disabled`,void 0),t.t([(0,i.property)({type:String})],c.prototype,`name`,void 0),c=t.t([(0,i.customElement)(`schmancy-radio-button`)],c),Object.defineProperty(exports,`n`,{enumerable:!0,get:function(){return s}}),Object.defineProperty(exports,`t`,{enumerable:!0,get:function(){return c}});