require(`./chunk-CncqDLb2.cjs`);const e=require(`./decorate-F9CuyeHg.cjs`),t=require(`./litElement.mixin-CtQOmwq6.cjs`);require(`./mixins.cjs`);const n=require(`./area-DBjAhgjP.cjs`),r=require(`./animation-CQRdLgzX.cjs`),i=require(`./sheet.service-BfNDB0K0.cjs`);let a=require(`rxjs`),o=require(`lit/decorators.js`),s=require(`lit`);var c,l,u=class extends t.t(s.css`
	:host {
		position: fixed;
		inset: 0;
		z-index: var(--schmancy-overlay-z, 999);
		display: none;
	}
	:host([open]) {
		display: block;
	}

	/* Luminous edge glow on sheet panel */
	.content {
		box-shadow: -8px 0 40px -8px color-mix(in srgb, var(--schmancy-sys-color-primary-default) 15%, transparent);
	}

	:host([position='bottom']) .content {
		box-shadow: 0 -8px 40px -8px color-mix(in srgb, var(--schmancy-sys-color-primary-default) 15%, transparent);
	}

	@media (prefers-reduced-motion: reduce) {
		.content { box-shadow: var(--schmancy-sys-elevation-3); }
	}
`){constructor(...e){super(...e),this.open=!1,this.position=i.t.Side,this.persist=!1,this.lock=!1,this.handleHistory=!0,this.lastFocusedElement=null,this.handleOverlayClick=e=>{e.stopPropagation(),this.lock||i.n.dismiss(this.uid)}}onOpenChange(e,t){t?(this.lastFocusedElement=document.activeElement,this.setBackgroundInert(!0),this.animateIn(),this.focus()):(this.animateOut(),this.setBackgroundInert(!1),this.lastFocusedElement?.focus(),this.lastFocusedElement=null)}animateIn(){if(!this.overlayEl||!this.contentEl)return;this.overlayEl.animate([{opacity:0},{opacity:1}],{duration:200,easing:r.s,fill:`forwards`});let e=this.position===i.t.Side?[{opacity:0,transform:`translateX(100%) scale(0.95)`},{opacity:1,transform:`translateX(0) scale(1)`}]:[{opacity:0,transform:`translateY(100%) scale(0.95)`},{opacity:1,transform:`translateY(0) scale(1)`}];this.contentEl.animate(e,{duration:r.i,easing:r.n,fill:`forwards`})}animateOut(){if(!this.overlayEl||!this.contentEl)return;this.overlayEl.animate([{opacity:1},{opacity:0}],{duration:150,easing:r.s,fill:`forwards`});let e=this.position===i.t.Side?[{opacity:1,transform:`translateX(0) scale(1)`},{opacity:0,transform:`translateX(100%) scale(0.98)`}]:[{opacity:1,transform:`translateY(0) scale(1)`},{opacity:0,transform:`translateY(100%) scale(0.98)`}];this.contentEl.animate(e,{duration:150,easing:r.o,fill:`forwards`})}connectedCallback(){super.connectedCallback(),this.setupEventListeners()}disconnectedCallback(){super.disconnectedCallback(),this.disconnecting.next(!0)}setupEventListeners(){(0,a.merge)((0,a.fromEvent)(window,`popstate`).pipe((0,a.filter)(()=>this.handleHistory),(0,a.tap)(e=>{e.preventDefault(),this.closeSheet()})),(0,a.fromEvent)(this,`keydown`).pipe((0,a.tap)(e=>{e.key===`Escape`&&!this.lock&&this.open&&(e.preventDefault(),e.stopPropagation(),i.n.dismiss(this.uid))})),(0,a.fromEvent)(window,`schmancy-sheet-render`).pipe((0,a.filter)(e=>e.detail.uid===this.uid),(0,a.tap)(e=>{n.S.push({area:this.uid,component:e.detail.component,props:e.detail.props,historyStrategy:`silent`})})),(0,a.fromEvent)(window,`schmancy-sheet-dismiss`).pipe((0,a.filter)(e=>e.detail.uid===this.uid),(0,a.tap)(()=>{this.closeSheet()}))).pipe((0,a.takeUntil)(this.disconnecting)).subscribe()}setBackgroundInert(e){let t=this.parentElement;t&&Array.from(t.children).forEach(t=>{t!==this&&t instanceof HTMLElement&&t.toggleAttribute(`inert`,e)})}closeSheet(){this.open=!1,this.dispatchEvent(new CustomEvent(`close`))}focus(){let e=this.querySelector(`[autofocus]`);e instanceof HTMLElement&&e.focus()}render(){let e=`overlay absolute inset-0 bg-surface-container/10 backdrop-blur-lg backdrop-saturate-150 `+(this.lock?``:`cursor-pointer`),t=this.position===i.t.Side?`content h-full min-w-[320px] max-w-[90vw] w-fit ml-auto z-10`:`content w-full mt-auto rounded-t-2xl max-h-[90vh] z-10`,n=this.position===i.t.Side?`h-full overflow-auto`:`max-h-[90vh] overflow-auto`;return s.html`
			<div class=${`absolute inset-0 flex h-full`} role="dialog" aria-hidden=${!this.open} aria-modal=${this.open} tabindex="0">
				<div class=${e} @click=${this.handleOverlayClick}></div>
				<div class=${t}>
					<schmancy-surface rounded="left" fill="all" id="body" class=${n} type="solid">
						<schmancy-area class="size-full overflow-auto" name=${this.uid}>
							<slot></slot>
						</schmancy-area>
					</schmancy-surface>
				</div>
			</div>
		`}};e.t([(0,o.property)({type:Boolean,reflect:!0})],u.prototype,`open`,void 0),e.t([(0,o.property)({type:String,reflect:!0})],u.prototype,`position`,void 0),e.t([(0,o.property)({type:Boolean,reflect:!0})],u.prototype,`persist`,void 0),e.t([(0,o.property)({type:Boolean,reflect:!0})],u.prototype,`lock`,void 0),e.t([(0,o.property)({type:Boolean,reflect:!0})],u.prototype,`handleHistory`,void 0),e.t([(0,o.query)(`.overlay`)],u.prototype,`overlayEl`,void 0),e.t([(0,o.query)(`.content`)],u.prototype,`contentEl`,void 0),e.t([(c=`open`,(e,t)=>{let{willUpdate:n}=e;l=Object.assign({waitUntilFirstUpdate:!1},l),e.willUpdate=function(e){if(n.call(this,e),e.has(c)){let n=e.get(c),r=this[c];n!==r&&(l?.waitUntilFirstUpdate&&!this.hasUpdated||this[t].call(this,n,r))}}})],u.prototype,`onOpenChange`,null),u=e.t([(0,o.customElement)(`schmancy-sheet`)],u);