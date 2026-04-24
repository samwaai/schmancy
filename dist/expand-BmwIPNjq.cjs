require(`./chunk-CncqDLb2.cjs`);const e=require(`./tailwind.mixin-Bh58QnlW.cjs`),t=require(`./decorate-F9CuyeHg.cjs`),n=require(`./surface.mixin-DxOi-xo0.cjs`);require(`./mixins.cjs`);const r=require(`./animation-CQRdLgzX.cjs`),i=require(`./reduced-motion-9RjNnhIg.cjs`);require(`./surface-B6DA01kL.cjs`);let a=require(`rxjs`),o=require(`rxjs/operators`),s=require(`lit/directives/style-map.js`),c=require(`lit/decorators.js`),l=require(`lit`),u=require(`lit/directives/ref.js`);var d=class extends n.t(e.t(l.css`
	:host {
		display: contents;
	}

	.portal-panel {
		position: fixed;
		transform-origin: top left;
		will-change: clip-path, opacity;
		border-radius: 1rem;
		box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.5);
		z-index: 9999;
	}

	.minimize-btn {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: 9999px;
		border: none;
		background: transparent;
		cursor: pointer;
		opacity: 0.5;
		transition: opacity 150ms, background 150ms;
		color: inherit;
	}

	.minimize-btn:hover {
		opacity: 1;
		background: rgb(0 0 0 / 0.08);
	}
`)){constructor(...e){super(...e),this.type=`solid`,this.isOpen=!1,this.summaryRect=null,this._panelRef=(0,u.createRef)(),this._backdropRef=(0,u.createRef)(),this._btnRef=(0,u.createRef)(),this._owner=null,this._hideIndicator=!1,this._backdrop=!0}prepare(e,t,n=!1,r=!0){this.summaryRect=e,this._owner=t,this._hideIndicator=n,this._backdrop=r}async triggerOpen(){this.isOpen=!0,await this.updateComplete;let e=this._panelRef.value;if(!e)return;let t=this.summaryRect;Object.assign(e.style,{visibility:`hidden`,top:`${t.top}px`,left:`${t.left}px`,minWidth:`${t.width}px`,width:`max-content`,maxWidth:window.innerWidth-t.left+`px`,height:`auto`,maxHeight:window.innerHeight-32+`px`,overflowY:`auto`});let n=e.getBoundingClientRect(),r=n.width,i=n.height,a=t.top,o=t.left;a+i>window.innerHeight&&(a=Math.max(0,t.bottom-i)),o+r>window.innerWidth&&(o=Math.max(0,window.innerWidth-r));let s=Math.max(0,t.top-a),c=Math.max(0,t.left-o),l=Math.max(0,o+r-(t.left+t.width)),u=Math.max(0,a+i-(t.top+t.height));Object.assign(e.style,{visibility:``,top:`${a}px`,left:`${o}px`,minWidth:`${t.width}px`,width:`${r}px`,height:`${i}px`,maxWidth:``,maxHeight:``,clipPath:`inset(${s}px ${l}px ${u}px ${c}px round 0.5rem)`}),this._animateOpen(s,l,u,c,a)}async triggerClose(e){await this._animateClose(e),this.isOpen=!1,this.summaryRect=null}_animateOpen(e,t,n,a,o){let s=this._panelRef.value;if(!s)return;if(i.t.value)return void(s.style.clipPath=``);let c=this._backdropRef.value;c&&c.animate([{opacity:0},{opacity:1}],{duration:r.d.duration,easing:r.d.easingFallback,fill:`forwards`});let l=[{clipPath:`inset(${e}px ${t}px ${n}px ${a}px round 0.5rem)`,opacity:.9},{clipPath:`inset(0px 0px 0px 0px round 1rem)`,opacity:1}];s.animate(l,{duration:r.d.duration,easing:r.d.easingFallback,fill:`forwards`}).finished.then(()=>{s.isConnected&&(s.style.clipPath=``,s.style.height=`auto`,s.style.maxHeight=window.innerHeight-o-16+`px`)});let u=this._btnRef.value;u&&u.animate([{transform:`rotate(0deg)`},{transform:`rotate(180deg)`}],{duration:r.d.duration,easing:r.d.easingFallback,fill:`forwards`})}_animateClose(e){let t=this._panelRef.value;if(!t||i.t.value)return Promise.resolve();let n=t.getBoundingClientRect(),a=Math.max(0,e.top-n.top),o=Math.max(0,e.left-n.left),s=Math.max(0,n.right-e.right),c=Math.max(0,n.bottom-e.bottom),l=Math.round(.4*r.d.duration),u=`cubic-bezier(0.4, 0, 1, 1)`,d=[{clipPath:`inset(0px 0px 0px 0px round 1rem)`,opacity:1},{clipPath:`inset(${a}px ${s}px ${c}px ${o}px round 0.5rem)`,opacity:.6}],f=t.animate(d,{duration:l,easing:u,fill:`forwards`}),p=this._backdropRef.value;p&&p.animate([{opacity:1},{opacity:0}],{duration:l,easing:u,fill:`forwards`});let m=this._btnRef.value;return m&&m.animate([{transform:`rotate(180deg)`},{transform:`rotate(0deg)`}],{duration:l,easing:u,fill:`forwards`}),f.finished}render(){return this.isOpen?l.html`
			${this._backdrop?l.html`
				<div
					${(0,u.ref)(this._backdropRef)}
					class="fixed inset-0 z-9998 backdrop-blur-sm backdrop-saturate-150 backdrop-brightness-105 bg-black/[0.07] will-change-[opacity]"
					@click=${()=>this._owner?.close?.()}
				></div>
			`:l.nothing}
			<schmancy-surface
				${(0,u.ref)(this._panelRef)}
				class="portal-panel"
				type=${this.type}
				style="overflow-y: auto;"
			>
				${this._hideIndicator?l.nothing:l.html`
					<button
						${(0,u.ref)(this._btnRef)}
						class="minimize-btn"
						aria-label="Minimize"
						@click=${()=>this._owner?.close?.()}
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<path d="M19 9L12 16L5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</button>
				`}
				<slot></slot>
			</schmancy-surface>
		`:l.nothing}};t.t([(0,c.property)({reflect:!0})],d.prototype,`type`,void 0),t.t([(0,c.state)()],d.prototype,`isOpen`,void 0),d=t.t([(0,c.customElement)(`schmancy-expand-root`)],d);var f=class extends e.t(l.css`
	:host {
		display: block;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	summary {
		list-style: none;
		color: inherit;
	}

	.inline-grid {
		display: grid;
		grid-template-rows: 0fr;
		overflow: hidden;
		transition: grid-template-rows 300ms cubic-bezier(0.22, 1.25, 0.36, 1),
		            opacity 300ms cubic-bezier(0.22, 1.25, 0.36, 1);
		opacity: 0;
	}

	.inline-grid[data-open] {
		grid-template-rows: 1fr;
		opacity: 1;
	}

	.inline-grid > .inner {
		min-height: 0;
		overflow: hidden;
	}
`){constructor(...e){super(...e),this.summary=``,this.open=!1,this.summaryPadding=``,this.contentPadding=``,this.hideIndicator=!1,this.indicatorRotate=90,this.backdrop=!0,this.inline=!1,this._summaryRef=(0,u.createRef)(),this._contentSlotRef=(0,u.createRef)(),this._root=null,this._movedNodes=[]}connectedCallback(){super.connectedCallback(),(0,a.fromEvent)(window,`keydown`).pipe((0,a.filter)(e=>e.key===`Escape`),(0,a.filter)(()=>this.open),(0,o.tap)(()=>{this._handleClose()}),(0,o.takeUntil)(this.disconnecting)).subscribe(),(0,a.fromEvent)(document,`pointerdown`).pipe((0,a.filter)(()=>this.open),(0,a.filter)(e=>!!this._root&&!e.composedPath().includes(this._root)),(0,o.tap)(()=>{this._handleClose()}),(0,o.takeUntil)(this.disconnecting)).subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._movedNodes.length>0&&(this._movedNodes.forEach(e=>this.appendChild(e)),this._movedNodes=[]),this._root&&this._root.children.length===0&&(this._root.remove(),this._root=null)}async _getOrCreateRoot(){let e=await(0,a.lastValueFrom)(this.discover(`schmancy-theme`))??document.querySelector(`schmancy-theme`)??document.body,t=e.querySelector(`schmancy-expand-root`);return t||(t=new d,e.appendChild(t)),t}close(){this._handleClose()}expand(){this.open||this._expand()}updated(e){super.updated(e),e.has(`open`)&&this.open&&!this.inline&&!this._root&&this._expand()}_toggle(){this.inline?(this.open=!this.open,this._animateIndicator(this.open)):this.open||this._expand()}_handleSummaryClick(e){e.preventDefault(),this._toggle()}async _expand(){if(this.inline)return this.open=!0,void this._animateIndicator(!0);let e=await this._getOrCreateRoot();this._root=e;let t=this._summaryRef.value,n=this._contentSlotRef.value;if(!t||!n)return;let r=t.getBoundingClientRect(),i=n.assignedElements({flatten:!0});i.length!==0&&(e.prepare(r,this,this.hideIndicator,this.backdrop),this._movedNodes=[...i],this._movedNodes.forEach(t=>e.appendChild(t)),e.triggerOpen(),this._animateIndicator(!0),this.open=!0)}async _handleClose(){if(this.inline)return this._animateIndicator(!1),void(this.open=!1);let e=this._root,t=this._summaryRef.value;if(!e||!t)return;let n=t.getBoundingClientRect();this._animateIndicator(!1),await e.triggerClose(n),this._movedNodes.forEach(e=>this.appendChild(e)),this._movedNodes=[],this.open=!1}_animateIndicator(e){if(i.t.value)return;let t=this.shadowRoot?.querySelector(`.indicator`);t&&(this._currentIndicatorAnim?.cancel(),this._currentIndicatorAnim=t.animate([{transform:`rotate(${e?`0deg`:`${this.indicatorRotate}deg`})`},{transform:`rotate(${e?`${this.indicatorRotate}deg`:`0deg`})`}],{duration:r.f.duration,easing:r.f.easingFallback,fill:`forwards`}))}render(){let e=this.classMap({[this.summaryPadding]:!0,"select-none relative flex items-center gap-2 rounded-xl transition-all duration-150":!0,"hover:brightness-[0.92] active:brightness-[0.85] cursor-pointer group":!0,"flex-row-reverse":!0});return l.html`
			<div class="w-full rounded-xl">
				<div
					${(0,u.ref)(this._summaryRef)}
					class=${e}
					tabindex="0"
					role="button"
					@click=${this._handleSummaryClick}
					@keydown=${e=>{e.key!==`Enter`&&e.key!==` `||(e.preventDefault(),this._toggle())}}
				>
					${this.hideIndicator?l.nothing:l.html`
								<span class="indicator flex items-center justify-center w-5 h-5 rounded-full shrink-0 opacity-70 group-hover:opacity-100 will-change-transform">
									<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
										<path
											d="M9 6L15 12L9 18"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</span>
							`}

					<span class="flex-1 font-medium text-base min-w-0">
						<slot name="summary">${this.summary}</slot>
					</span>

					<slot name="actions"></slot>
				</div>

				${this.inline?l.html`
						<div class="inline-grid" ?data-open=${this.open}>
							<div class="inner">
								<slot ${(0,u.ref)(this._contentSlotRef)}></slot>
							</div>
						</div>
					`:l.html`
						<div style=${(0,s.styleMap)(this.open?{}:{display:`none`})}>
							<slot ${(0,u.ref)(this._contentSlotRef)}></slot>
						</div>
					`}
			</div>
		`}};t.t([(0,c.property)()],f.prototype,`summary`,void 0),t.t([(0,c.property)({type:Boolean,reflect:!0})],f.prototype,`open`,void 0),t.t([(0,c.property)({attribute:`summary-padding`})],f.prototype,`summaryPadding`,void 0),t.t([(0,c.property)({attribute:`content-padding`})],f.prototype,`contentPadding`,void 0),t.t([(0,c.property)({type:Boolean,attribute:`hide-indicator`})],f.prototype,`hideIndicator`,void 0),t.t([(0,c.property)({type:Number,attribute:`indicator-rotate`})],f.prototype,`indicatorRotate`,void 0),t.t([(0,c.property)({type:Boolean})],f.prototype,`backdrop`,void 0),t.t([(0,c.property)({type:Boolean})],f.prototype,`inline`,void 0),f=t.t([(0,c.customElement)(`schmancy-expand`)],f),Object.defineProperty(exports,`n`,{enumerable:!0,get:function(){return d}}),Object.defineProperty(exports,`t`,{enumerable:!0,get:function(){return`schmancy-expand-request-close`}});