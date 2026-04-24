require(`./chunk-CncqDLb2.cjs`);const e=require(`./tailwind.mixin-BHX99hgX.cjs`),t=require(`./provide-B7b5TOCD.cjs`),n=require(`./decorate-F9CuyeHg.cjs`);require(`./mixins.cjs`);let r=require(`rxjs`),i=require(`lit/decorators.js`),a=require(`lit`),o=require(`lit/directives/repeat.js`);var s=e.o(`tabs`),c=class extends e.t(){updated(e){e.has(`active`)&&this.active&&requestAnimationFrame(()=>{window.dispatchEvent(new Event(`resize`))})}render(){return this.mode!==`tabs`||this.active?a.html`<slot></slot>`:a.html``}};n.t([(0,i.property)({type:String,reflect:!0})],c.prototype,`label`,void 0),n.t([(0,i.property)({type:String,reflect:!0})],c.prototype,`value`,void 0),n.t([(0,i.property)({type:Boolean,reflect:!0})],c.prototype,`active`,void 0),n.t([e.a({context:s,subscribe:!0}),(0,i.state)()],c.prototype,`mode`,void 0),c=n.t([(0,i.customElement)(`schmancy-tab`)],c);var l=class extends e.t(a.css`
	:host {
		display: block;
		height: 100%;
	}
`){constructor(...e){super(...e),this.mode=`tabs`,this.rounded=!0,this.tabs=[]}connectedCallback(){super.connectedCallback(),(0,r.fromEvent)(window,`scroll`).pipe((0,r.throttleTime)(1e3),(0,r.filter)(()=>this.mode===`scroll`),(0,r.map)(()=>{let e=null,t=1/0;return this.tabsElements.forEach(n=>{let r=n.getBoundingClientRect().top-this.navElement.clientHeight+document.body.offsetHeight/3;r<t&&r>0&&(t=r,e=n)}),e}),(0,r.filter)(e=>e!==null)).subscribe({next:e=>{this.activeTab=e.value}})}firstUpdated(){(0,r.interval)(0).pipe((0,r.filter)(()=>!!this.navElement.clientHeight),(0,r.take)(1)).subscribe(()=>{this.tabsElements.forEach(e=>{this.mode===`scroll`&&(e.style.paddingTop=this.navElement.clientHeight+`px`)})})}hydrateTabs(){this.tabs=this.tabsElements,!this.activeTab&&this.tabsElements[0]?(this.activeTab=this.tabsElements[0].value,this.tabsElements[0].active=!0):this.tabsElements.forEach(e=>{e.value===this.activeTab?e.active=!0:e.active=!1});let e=this.tabs?.[-1];e&&(e.style.paddingBottom=e.offsetHeight+`px`)}tabChanged(e){let t;this.tabsElements.forEach(n=>{n.value===e.value?(n.active=!0,t=n,this.mode===`scroll`&&t.scrollIntoView({behavior:`smooth`,block:`start`,inline:`start`})):n.active=!1}),this.mode===`tabs`&&(this.activeTab=e.value),this.dispatchEvent(new CustomEvent(`tab-changed`,{detail:this.activeTab}))}render(){let e={"bg-surface-default color-surface-on":!0,"flex z-50 overflow-auto":!0,"sticky top-0 shadow-md":this.mode===`scroll`,"rounded-full":this.rounded},t={"text-primary-default":!0},n={"border-transparent":!0,"hover:text-surface-on":!0,"hover:border-outlineVariant":!0,"text-surface-onVariant":!0};return a.html`
			<section id="tabsNavigation" class="${this.classMap(e)}" aria-label="Tabs">
				${(0,o.repeat)(this.tabs,e=>e.value,e=>a.html`
						<schmancy-button
							@click=${()=>{this.tabChanged({label:e.label,value:e.value})}}
							aria-current="page"
							class="h-auto relative"
						>
							<div
								class="px-4 py-3 ${this.activeTab===e.value?this.classMap(t):this.classMap(n)}"
							>
								<schmancy-typography class="h-full align-middle flex " type="title" token="md" weight="medium">
									${e.label}
								</schmancy-typography>
								<div
									.hidden=${this.activeTab!==e.value}
									class="border-primary-default absolute bottom-0 inset-x-6  border-solid border-2 rounded-t-full"
								></div>
							</div>
						</schmancy-button>
					`)}
			</section>
			<section id="tabsContent" class="h-full">
				<slot @slotchange=${()=>this.hydrateTabs()}></slot>
			</section>
		`}};n.t([t.t({context:s}),(0,i.property)({type:String})],l.prototype,`mode`,void 0),n.t([(0,i.property)({type:Boolean})],l.prototype,`rounded`,void 0),n.t([(0,i.property)({type:String,reflect:!0})],l.prototype,`activeTab`,void 0),n.t([(0,i.queryAssignedElements)({flatten:!0})],l.prototype,`tabsElements`,void 0),n.t([(0,i.query)(`#tabsNavigation`)],l.prototype,`navElement`,void 0),n.t([(0,i.query)(`#tabsContent`)],l.prototype,`tabsContent`,void 0),n.t([(0,i.state)()],l.prototype,`tabs`,void 0);var u=l=n.t([(0,i.customElement)(`schmancy-tab-group`)],l);customElements.define(`schmancy-tabs-group`,class extends u{});