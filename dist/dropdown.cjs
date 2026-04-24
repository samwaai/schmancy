Object.defineProperty(exports,Symbol.toStringTag,{value:`Module`}),require(`./chunk-CncqDLb2.cjs`);const e=require(`./tailwind.mixin-BHX99hgX.cjs`),t=require(`./decorate-F9CuyeHg.cjs`),n=require(`./litElement.mixin-lYlKxxjR.cjs`);require(`./mixins.cjs`);let r=require(`rxjs`),i=require(`lit/decorators.js`),a=require(`lit`),o=require(`@floating-ui/dom`);var s=class extends n.t(){constructor(...e){super(...e),this.open=!1,this.placement=`bottom-start`,this.distance=8,this.portal=null,this.portalSubscriptions=[]}connectedCallback(){super.connectedCallback(),this.setupPortal(),(0,r.fromEvent)(document,`click`).pipe((0,r.filter)(e=>this.open&&!this.isEventFromSelf(e)),(0,r.takeUntil)(this.disconnecting)).subscribe(()=>{this.open=!1}),(0,r.fromEvent)(document,`keydown`).pipe((0,r.filter)(e=>this.open&&e.key===`Escape`),(0,r.takeUntil)(this.disconnecting)).subscribe(()=>{this.open=!1})}setupPortal(){let e=document.getElementById(`schmancy-portal-container`);e||(e=document.createElement(`div`),e.id=`schmancy-portal-container`,e.style.position=`fixed`,e.style.zIndex=`10000`,e.style.top=`0`,e.style.left=`0`,e.style.pointerEvents=`none`,document.body.appendChild(e));let t=document.createElement(`div`);t.className=`schmancy-dropdown-portal`,t.style.position=`absolute`,t.style.pointerEvents=`auto`,t.style.display=`none`,e.appendChild(t),this.portal=t}isEventFromSelf(e){return e.composedPath().some(e=>e===this)}disconnectedCallback(){this.cleanupPositioner?.(),this.portalSubscriptions.forEach(e=>e.unsubscribe()),this.portalSubscriptions=[],this.portal&&=(this.portal.remove(),null),super.disconnectedCallback()}toggle(){this.open=!this.open}updated(e){super.updated(e),e.has(`open`)&&(this.open?this.setupPositioner():(this.cleanupPositioner?.(),this.portal&&(this.portal.style.display=`none`,this.portal.innerHTML=``,this.portalSubscriptions.forEach(e=>e.unsubscribe()),this.portalSubscriptions=[])))}setupPositioner(){this.triggerContainer&&this.portal&&(this.portal.style.display=`block`,this.teleportContentToPortal(),this.cleanupPositioner=(0,o.autoUpdate)(this.triggerContainer,this.portal,()=>{(0,o.computePosition)(this.triggerContainer,this.portal,{placement:this.placement,middleware:[(0,o.offset)(this.distance),(0,o.flip)({fallbackPlacements:[`top-start`,`bottom-start`]}),(0,o.shift)({padding:0})]}).then(({x:e,y:t})=>{Object.assign(this.portal.style,{left:`${e}px`,top:t-8+`px`})})}))}teleportContentToPortal(){this.portal&&(this.portalSubscriptions.forEach(e=>e.unsubscribe()),this.portalSubscriptions=[],this.portal.innerHTML=``,this.contentElements.forEach(e=>{let t=e.cloneNode(!0);if(e.tagName.toLowerCase()===`schmancy-dropdown-content`){let e=(0,r.fromEvent)(t,`slotchange`).subscribe(()=>{let e=t.shadowRoot?.querySelector(`[part="content"]`);e&&e.classList.add(`schmancy-dropdown-content`)});this.portalSubscriptions.push(e)}this.portal?.appendChild(t)}))}handleTriggerClick(e){e.stopPropagation(),this.toggle()}render(){return a.html`
			<div class="trigger-container" @click=${this.handleTriggerClick}>
				<slot name="trigger"></slot>
			</div>

			<div class="dropdown-content-container" ?hidden=${!this.open}>
				<slot
					@slotchange=${()=>{this.open&&(this.teleportContentToPortal(),this.setupPositioner())}}
				></slot>
			</div>
		`}};t.t([(0,i.property)({type:Boolean,reflect:!0})],s.prototype,`open`,void 0),t.t([(0,i.property)({type:String})],s.prototype,`placement`,void 0),t.t([(0,i.property)({type:Number})],s.prototype,`distance`,void 0),t.t([(0,i.query)(`.trigger-container`)],s.prototype,`triggerContainer`,void 0),t.t([(0,i.query)(`.dropdown-content-container`)],s.prototype,`contentContainer`,void 0),t.t([(0,i.queryAssignedElements)({flatten:!0})],s.prototype,`contentElements`,void 0),t.t([(0,i.state)()],s.prototype,`portal`,void 0),t.t([(0,i.queryAssignedElements)({slot:`trigger`,flatten:!0})],s.prototype,`triggerElements`,void 0),s=t.t([(0,i.customElement)(`schmancy-dropdown`)],s);var c=class extends e.t(a.css`
	:host {
		display: block;
		position: absolute;
		z-index: 1000;
		min-width: 10rem;
		margin: 0;
		text-align: left;
		list-style: none;
		background-color: var(--schmancy-sys-color-surface-container);
		background-clip: padding-box;
		border-radius: 0.375rem;
		box-shadow: var(--schmancy-sys-elevation-3);
		will-change: transform;
		transform-origin: top left;
		animation: dropdownAnimation 0.1s ease-out forwards;
	}

	:host([hidden]) {
		display: none;
	}

	@keyframes dropdownAnimation {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	/* Apply styles to content both in the component and when teleported to the portal */
	.schmancy-dropdown-content {
		background-color: var(--schmancy-sys-color-surface-container);
		border-radius: 0.375rem;
		box-shadow: var(--schmancy-sys-elevation-3);
		will-change: transform;
		transform-origin: top left;
		animation: dropdownAnimation 0.1s ease-out forwards;
	}
`){constructor(...e){super(...e),this.width=`auto`,this.maxHeight=`80vh`,this.shadow=!0,this.radius=`md`}render(){let e={"schmancy-dropdown-content":!0,"overflow-auto":!0,"shadow-none":!this.shadow,"rounded-none":this.radius===`none`,"rounded-sm":this.radius===`sm`,"rounded-md":this.radius===`md`,"rounded-lg":this.radius===`lg`,"rounded-full":this.radius===`full`},t={width:this.width,maxHeight:this.maxHeight};return a.html`
			<div class=${this.classMap(e)} style=${this.styleMap(t)} part="content">
				<slot></slot>
			</div>
		`}};t.t([(0,i.property)({type:String})],c.prototype,`width`,void 0),t.t([(0,i.property)({type:String})],c.prototype,`maxHeight`,void 0),t.t([(0,i.property)({type:Boolean})],c.prototype,`shadow`,void 0),t.t([(0,i.property)({type:String})],c.prototype,`radius`,void 0),c=t.t([(0,i.customElement)(`schmancy-dropdown-content`)],c),Object.defineProperty(exports,`SchmancyDropdown`,{enumerable:!0,get:function(){return s}}),Object.defineProperty(exports,`SchmancyDropdownContent`,{enumerable:!0,get:function(){return c}});