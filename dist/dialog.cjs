Object.defineProperty(exports,Symbol.toStringTag,{value:`Module`}),require(`./chunk-CncqDLb2.cjs`);const e=require(`./decorate-F9CuyeHg.cjs`),t=require(`./litElement.mixin-qh5-IIUq.cjs`);require(`./mixins.cjs`);const n=require(`./animation-CQRdLgzX.cjs`),r=require(`./reduced-motion-9RjNnhIg.cjs`),i=require(`./cursor-glow-Duw9jHmh.cjs`),a=require(`./dialog-service-CzDO08Gy.cjs`);let o=require(`rxjs`),s=require(`rxjs/operators`),c=require(`lit/decorators.js`),l=require(`lit`),u=require(`lit/directives/ref.js`),d=require(`lit/directives/when.js`),f=require(`@floating-ui/dom`);var p=e=>class extends e{constructor(...e){super(...e),this.position={x:0,y:0},this.isMobile=!1,this.dragOffset=0,this.stopSwipe$=new o.Subject,this.lastFocusedElement=null,this.inertSiblings=[],this.animating=!1,this.dialogInternals=(()=>{try{return this.attachInternals()}catch{return}})()}isAnimating(){return this.animating}getDialogElement(){return null}getBackdropElement(){return null}getDragHandleElement(){return null}connectedCallback(){super.connectedCallback(),this.setupResizeListener()}setupResizeListener(){(0,o.fromEvent)(window,`resize`).pipe((0,o.map)(()=>window.innerWidth<640),(0,o.distinctUntilChanged)(),(0,o.filter)(()=>this.hasAttribute(`active`)),(0,o.tap)(e=>{if(this.isMobile!==e){this.isMobile=e,this.requestUpdate();let t=this.getDialogElement();t&&(e?(this.applyBottomSheetStyles(t),this.setupSwipeGesture(t)):(this.stopSwipe$.next(),this.setupPositioning()))}}),(0,o.takeUntil)(this.disconnecting)).subscribe()}setupSwipeGesture(e){this.stopSwipe$.next();let t=0,n=!1,r=0,i=this.getDragHandleElement();(0,o.merge)((0,o.fromEvent)(i||e,`touchstart`,{passive:!0}).pipe((0,o.tap)(a=>{let o=a.touches[0],s=e.getBoundingClientRect();o.clientY-s.top>80&&!i||(n=!0,t=o.clientY,r=0,this.dragOffset=0,e.style.transition=`none`,e.style.willChange=`transform`)})),(0,o.fromEvent)(e,`touchmove`,{passive:!1}).pipe((0,o.filter)(()=>n),(0,o.tap)(n=>{let i=n.touches[0].clientY-t;r=i<0?.2*i:i,this.dragOffset=Math.max(0,i),e.style.transform=`translateY(${r}px)`,n.preventDefault()})),(0,o.merge)((0,o.fromEvent)(e,`touchend`,{passive:!0}),(0,o.fromEvent)(e,`touchcancel`,{passive:!0})).pipe((0,o.filter)(()=>n),(0,o.tap)(()=>{n=!1,e.style.transition=`transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)`,e.style.willChange=``;let t=e.getBoundingClientRect().height,r=Math.min(100,.25*t);this.dragOffset>r?(e.style.transform=`translateY(100%)`,this.hide(!1)):(e.style.transform=`translateY(0)`,this.dragOffset=0)}))).pipe((0,o.takeUntil)((0,o.merge)(this.stopSwipe$,this.disconnecting))).subscribe()}applyBottomSheetStyles(e){this.cleanupAutoUpdate&&=(this.cleanupAutoUpdate(),void 0),Object.assign(e.style,{position:``,left:``,top:``,transform:``,maxWidth:``})}async show(e){let t,n;if(this.cleanupAutoUpdate&&=(this.cleanupAutoUpdate(),void 0),this.isMobile=window.innerWidth<640,e)if(`clientX`in e)t=e.clientX,n=e.clientY;else if(`touches`in e&&e.touches.length)t=e.touches[0].clientX,n=e.touches[0].clientY;else{let r=e;t=r.x,n=r.y}else t=window.innerWidth/2,n=window.innerHeight/2;this.position={x:t,y:n},this.virtualReference={getBoundingClientRect:()=>new DOMRect(t,n,0,0)},this.requestUpdate(),await this.updateComplete,this.setAttribute(`active`,``),this.dialogInternals?.states.add(`open`),await this.updateComplete,this.lastFocusedElement=document.activeElement;let r=this.parentElement;if(r){this.inertSiblings=[];for(let e=0;e<r.children.length;e++){let t=r.children[e];t!==this&&`inert`in t&&(t.inert=!0,this.inertSiblings.push(t))}}(0,o.fromEvent)(document,`keydown`).pipe((0,o.filter)(e=>e.key===`Escape`),(0,o.tap)(e=>{e.preventDefault(),this.hide(!1)}),(0,o.takeUntil)((0,o.merge)(this.stopSwipe$,this.disconnecting))).subscribe();let i=this.getDialogElement(),a=window.innerWidth<1024?.6:.8;return!this.isMobile&&i&&(i.scrollHeight>window.innerHeight*a||i.scrollWidth>window.innerWidth*a)&&(this.isMobile=!0,this.requestUpdate(),await this.updateComplete),this.isMobile?i&&(this.applyBottomSheetStyles(i),this.setupSwipeGesture(i)):this.setupPositioning(),this.animating=!0,await this.animateIn(),this.animating=!1,new Promise(e=>{this.resolvePromise=e})}async animateIn(){let e=this.getDialogElement(),t=this.getBackdropElement();if(r.t.value)return t&&(t.style.opacity=`1`),void(e&&(e.style.opacity=`1`));if(t?.animate([{opacity:0},{opacity:1}],{duration:200,easing:n.s,fill:`forwards`}),e){let t=this.isMobile?[{opacity:0,transform:`translateY(100%)`},{opacity:1,transform:`translateY(0)`}]:[{opacity:0,transform:`scale(0.92) translateY(16px)`},{opacity:1,transform:`scale(1) translateY(0)`}];await e.animate(t,{duration:n.i,easing:n.n,fill:`forwards`}).finished}}async animateOut(){let e=this.getDialogElement(),t=this.getBackdropElement();if(r.t.value)return t&&(t.style.opacity=`0`),void(e&&(e.style.opacity=`0`));let i=[];if(t&&i.push(t.animate([{opacity:1},{opacity:0}],{duration:150,easing:n.s,fill:`forwards`}).finished),e){let t=this.isMobile?[{opacity:1,transform:`translateY(0)`},{opacity:0,transform:`translateY(100%)`}]:[{opacity:1,transform:`scale(1) translateY(0)`},{opacity:0,transform:`scale(0.95) translateY(8px)`}];i.push(e.animate(t,{duration:150,easing:n.o,fill:`forwards`}).finished)}await Promise.all(i)}async hide(e=!1){this.stopSwipe$.next(),this.animating=!0,await this.animateOut(),this.animating=!1,this.removeAttribute(`active`),this.dialogInternals?.states.delete(`open`);for(let e of this.inertSiblings)e.inert=!1;if(this.inertSiblings=[],this.lastFocusedElement){let e=this.lastFocusedElement;typeof e.focus==`function`&&e.focus(),this.lastFocusedElement=null}this.cleanupAutoUpdate&&=(this.cleanupAutoUpdate(),void 0),this.resolvePromise&&=(this.resolvePromise(e),void 0)}isCentered(){let e=.05*window.innerWidth,t=.05*window.innerHeight;return Math.abs(this.position.x-window.innerWidth/2)<e&&Math.abs(this.position.y-window.innerHeight/2)<t}setupPositioning(){let e=this.getDialogElement();e&&(this.isCentered()||this.virtualReference&&(this.cleanupAutoUpdate=(0,f.autoUpdate)(this.virtualReference,e,()=>this.updatePosition(e),{ancestorScroll:!0,ancestorResize:!0,elementResize:!0}),this.updatePosition(e)))}async updatePosition(e){if(!this.virtualReference)return;let{x:t,y:n}=await(0,f.computePosition)(this.virtualReference,e,{strategy:`fixed`,middleware:[(0,f.offset)(8),(0,f.autoPlacement)({padding:16,allowedPlacements:[`top-start`,`top-end`,`bottom-start`,`bottom-end`,`left-start`,`left-end`,`right-start`,`right-end`]}),(0,f.shift)({padding:16}),(0,f.size)({padding:16,apply({availableWidth:e,elements:t}){t.floating.style.maxWidth=`${e}px`}})]});Object.assign(e.style,{position:`fixed`,left:`${Math.round(t)}px`,top:`${Math.round(n)}px`,transform:`none`})}disconnectedCallback(){this.stopSwipe$.next(),this.cleanupAutoUpdate&&=(this.cleanupAutoUpdate(),void 0),super.disconnectedCallback()}},m=class extends p(t.t(l.css`
		:host {
			position: fixed;
			z-index: var(--schmancy-overlay-z, 10000);
			inset: 0;
			display: none;
			--dialog-width: fit-content;
		}

		:host([active]) {
			display: block;
		}


		/* Luminous glow around the dialog container */
		.dialog {
			box-shadow: 0 8px 40px -8px color-mix(in srgb, var(--schmancy-sys-color-primary-default) 15%, transparent);
			border-radius: var(--schmancy-sys-shape-corner-large);
		}

		@media (prefers-reduced-motion: reduce) {
			.dialog { box-shadow: var(--schmancy-sys-elevation-2); }
		}
	`)){constructor(...e){super(...e),this.title=void 0,this.subtitle=void 0,this.message=void 0,this.confirmText=void 0,this.cancelText=void 0,this.variant=`default`,this.hideActions=!1,this._confirmDialogRef=(0,u.createRef)(),this._contentDialogRef=(0,u.createRef)(),this._backdropRef=(0,u.createRef)(),this._dragHandleRef=(0,u.createRef)(),this._a11yId=`schmancy-dialog-${Math.random().toString(36).slice(2,10)}`}get _titleId(){return`${this._a11yId}-title`}get _descId(){return`${this._a11yId}-desc`}getDialogElement(){return this._contentDialogRef.value?this._contentDialogRef.value:this._confirmDialogRef.value??null}getBackdropElement(){return this._backdropRef.value??null}getDragHandleElement(){return this._dragHandleRef.value??null}get isConfirmMode(){return!this.hideActions&&!(!this.confirmText?.trim()||!this.cancelText?.trim())}connectedCallback(){super.connectedCallback(),(0,o.fromEvent)(window,a.i).pipe((0,o.tap)(e=>{e.detail.uid===this.uid&&this.announcePresence()}),(0,s.takeUntil)(this.disconnecting)).subscribe()}announcePresence(){this.dispatchEvent(new CustomEvent(a.r,{detail:{dialog:this},bubbles:!0,composed:!0}))}handleConfirm(){this.hide(!0),this.dispatchEvent(new CustomEvent(`confirm`,{bubbles:!0,composed:!0}))}handleClose(){this.isAnimating()||(this.hide(!1),this.dispatchEvent(new CustomEvent(this.isConfirmMode?`cancel`:`close`,{bubbles:!0,composed:!0})))}renderDragHandle(){return l.html`
			<div ${(0,u.ref)(this._dragHandleRef)} class="dialog-drag-handle flex justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing touch-none">
				<div class="w-10 h-1 rounded-full bg-outline-variant"></div>
			</div>
		`}render(){let e=this.isCentered(),t=this._contentSlotElements?.length>0,n={dialog:!0,fixed:!0,"w-[var(--dialog-width)]":!0,"max-w-[calc(100vw-2rem)]":!0,"max-h-[90dvh]":!0,"overflow-hidden":!0,"top-1/2":e,"left-1/2":e,"-translate-x-1/2":e,"-translate-y-1/2":e},r=this.isMobile?{dialog:!0,fixed:!0,"inset-x-0":!0,"bottom-0":!0,"w-full":!0,"max-h-[90dvh]":!0,"overflow-hidden":!0,"pb-[env(safe-area-inset-bottom)]":!0}:n,a=this.isMobile?`flex flex-col-reverse gap-2 w-full`:`flex justify-end gap-3`;if(this.isConfirmMode){let e=!!this.title?.trim(),n=!!this.subtitle?.trim(),o=!!this.message?.trim(),s=[n&&this._descId+`-sub`,o&&this._descId+`-msg`].filter(Boolean).join(` `)||``;return l.html`
				<div ${(0,u.ref)(this._backdropRef)} class="fixed inset-0 bg-surface-container/10 backdrop-blur-lg backdrop-saturate-150 backdrop-brightness-105" @click=${this.handleClose}></div>

				<div
					${(0,u.ref)(this._confirmDialogRef)}
					class=${this.classMap(r)}
					role="alertdialog"
					aria-modal="true"
					aria-labelledby=${e?this._titleId:l.nothing}
					aria-describedby=${s||l.nothing}
				>
					<schmancy-surface
						${i.t({radius:250,intensity:.1})}
						rounded=${this.isMobile?`top`:`all`}
						type="glass"
						fill="all"
						class="overflow-hidden"
					>
						${this.isMobile?this.renderDragHandle():null}
						<schmancy-scroll direction="vertical" hide class="p-4 pt-2">
							<schmancy-form @submit=${this.handleConfirm}>
								${(0,d.when)(e,()=>l.html`
										<schmancy-typography id=${this._titleId} type="title" token="md" class="mb-1">${this.title}</schmancy-typography>
										${(0,d.when)(n,()=>l.html`
												<schmancy-typography id="${this._descId}-sub" type="subtitle" token="xs" class="mb-2">
													${this.subtitle}
												</schmancy-typography>
											`)}
									`)}
								${t?l.html`<div class="mb-4"><slot name="content"></slot></div>`:(0,d.when)(o,()=>l.html`<schmancy-typography id="${this._descId}-msg" type="body" class="mb-4">${this.message}</schmancy-typography>`)}
								<div class=${a}>
									<schmancy-button
										variant="outlined"
										@click=${this.handleClose}
										class=${this.isMobile?`w-full`:``}
									>
										${this.cancelText}
									</schmancy-button>
									<schmancy-button
										type="submit"
										variant="filled"
										class=${this.isMobile?`w-full`:``}
									>
										${this.confirmText}
									</schmancy-button>
								</div>
							</schmancy-form>
						</schmancy-scroll>
					</schmancy-surface>
				</div>
			`}return l.html`
			<div ${(0,u.ref)(this._backdropRef)} class="fixed inset-0 bg-surface-container/10 backdrop-blur-lg backdrop-saturate-150 backdrop-brightness-105" @click=${this.handleClose}></div>

			<section ${(0,u.ref)(this._contentDialogRef)} class=${this.classMap(r)} role="dialog" aria-modal="true">
				<schmancy-surface ${i.t({radius:250,intensity:.1})} rounded=${this.isMobile?`top`:`all`} type="glass" fill="all">
					${this.isMobile?this.renderDragHandle():null}
					<schmancy-scroll direction="vertical" hide class="max-h-[85dvh]">
						<slot></slot>
					</schmancy-scroll>
				</schmancy-surface>
			</section>
		`}static async confirm(e){let t=document.querySelector(`schmancy-dialog[data-static-confirm]`);return t||(t=document.createElement(`schmancy-dialog`),t.setAttribute(`data-static-confirm`,``),document.body.appendChild(t)),t.title=e.title,t.subtitle=e.subtitle,t.message=e.message,t.confirmText=e.confirmText??`Confirm`,t.cancelText=e.cancelText??`Cancel`,t.variant=e.variant??`default`,e.width&&t.style.setProperty(`--dialog-width`,e.width),t.show(e.position)}static async ask(e,t){return this.confirm({message:e,position:t})}};e.t([(0,c.property)({type:String,reflect:!0})],m.prototype,`uid`,void 0),e.t([(0,c.property)({type:String})],m.prototype,`title`,void 0),e.t([(0,c.property)({type:String})],m.prototype,`subtitle`,void 0),e.t([(0,c.property)({type:String})],m.prototype,`message`,void 0),e.t([(0,c.property)({type:String,attribute:`confirm-text`})],m.prototype,`confirmText`,void 0),e.t([(0,c.property)({type:String,attribute:`cancel-text`})],m.prototype,`cancelText`,void 0),e.t([(0,c.property)({type:String})],m.prototype,`variant`,void 0),e.t([(0,c.property)({type:Boolean,attribute:`hide-actions`})],m.prototype,`hideActions`,void 0),e.t([(0,c.queryAssignedElements)({slot:`content`,flatten:!0})],m.prototype,`_contentSlotElements`,void 0),m=e.t([(0,c.customElement)(`schmancy-dialog`)],m),exports.$dialog=a.t,Object.defineProperty(exports,`ConfirmDialog`,{enumerable:!0,get:function(){return m}}),Object.defineProperty(exports,`SchmancyDialog`,{enumerable:!0,get:function(){return m}}),exports.DialogBase=p,exports.DialogService=a.n;