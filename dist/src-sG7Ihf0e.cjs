require(`./chunk-CncqDLb2.cjs`);const e=require(`./tailwind.mixin-Bh58QnlW.cjs`),t=require(`./provide-MvHcXKzT.cjs`),n=require(`./decorate-F9CuyeHg.cjs`),r=require(`./litElement.mixin-CtQOmwq6.cjs`);require(`./mixins.cjs`);const i=require(`./area-DBjAhgjP.cjs`);require(`./store-CjFHCSDb.cjs`),require(`./audio-Dvr-RBzE.cjs`),require(`./autocomplete-EM0jE7X2.cjs`);const a=require(`./theme.service-DxJPUGlu.cjs`),o=require(`./directives.cjs`);require(`./boat-BjYJI1HS.cjs`),require(`./busy-BmiumJpB.cjs`),require(`./button.cjs`),require(`./card-BslSqOsf.cjs`),require(`./charts.cjs`),require(`./checkbox-DtcFMgZL.cjs`),require(`./chips-DoCu5YQb.cjs`),require(`./code-highlight-B_l8vDzn.cjs`),require(`./components-TJT8-tva.cjs`),require(`./connectivity.cjs`),require(`./date-range-CIWYm3eS.cjs`);const s=require(`./sheet.service-BfNDB0K0.cjs`);require(`./date-range-inline-B9Dp2z6C.cjs`),require(`./delay-Bu4WMQlV.cjs`),require(`./details-B8p62xmR.cjs`),require(`./dialog.cjs`),require(`./discovery.cjs`),require(`./divider-JyyFw_3J.cjs`),require(`./dropdown.cjs`),require(`./expand-BmwIPNjq.cjs`),require(`./float-BQwhfibw.cjs`),require(`./window.cjs`),require(`./extra-BUgyMgjl.cjs`),require(`./form-wI58M85H.cjs`),require(`./icons-B6V3nZ4-.cjs`),require(`./iframe-C7sHg7RC.cjs`),require(`./input-BGNZlfL8.cjs`),require(`./notification-DPUkuifB.cjs`),require(`./json.cjs`),require(`./layout-B0_IXfov.cjs`),require(`./lightbox-BWKTzA03.cjs`),require(`./list-CMWHu6cV.cjs`),require(`./mailbox-Tg1CROVz.cjs`),require(`./map-Z_dsu-dv.cjs`),require(`./menu-DS8Iz4fJ.cjs`),require(`./navigation-rail.cjs`),require(`./option-OIp0joyN.cjs`),require(`./page.cjs`),require(`./progress.cjs`),require(`./qr-scanner.cjs`),require(`./radio-group-B7DuNxUq.cjs`),require(`./range.cjs`),require(`./rxjs-utils-DJbZRjp3.cjs`);const c=require(`./theme.interface-DTwkuAKJ.cjs`);require(`./select-DFxoBgEf.cjs`),require(`./sheet-DdlZhnDG.cjs`),require(`./slider.cjs`),require(`./steps.cjs`),require(`./surface.cjs`),require(`./table-DFlJhG5E.cjs`),require(`./tabs-DZaLZUBy.cjs`),require(`./textarea-B2544vx9.cjs`),require(`./theme-DU5yXaV-.cjs`),require(`./theme-button-CPujUbgV.cjs`),require(`./tooltip.cjs`),require(`./tree.cjs`);const l=require(`./types.cjs`);require(`./typewriter.cjs`),require(`./typography.cjs`),require(`./utils-CBPQvxNW.cjs`),require(`./breadcrumb.cjs`),require(`./kbd.cjs`),require(`./skeleton.cjs`),require(`./splash-screen-DteUfSV3.cjs`),require(`./switch.cjs`),require(`./visually-hidden.cjs`);let u=require(`rxjs`),d=require(`rxjs/operators`),f=require(`lit/decorators.js`),p=require(`lit`),m=require(`lit/directives/when.js`);var h=class extends e.t(p.css`
	:host {
		display: inline-flex;
		width: fit-content;
	}

	/* Enhanced pulse animation for better attention-getting */
	@keyframes elegant-pulse {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.85;
		}
	}

	.animate-pulse {
		animation: elegant-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
`){constructor(...e){super(...e),this.color=`primary`,this.size=`md`,this.shape=`pill`,this.outlined=!1,this.icon=``,this.pulse=!1}getSizeClasses(){switch(this.size){case`xs`:return`text-xs py-0.75 px-1.5 gap-0.5 leading-none`;case`sm`:return`text-xs py-1.5 px-2.5 gap-0.5 tracking-wide leading-none`;case`lg`:return`text-base py-2 px-4 gap-1 tracking-wide`;default:return`text-sm py-1.5 px-3 gap-0.5`}}getShapeClasses(){switch(this.shape){case`square`:return`rounded`;case`rounded`:return`rounded-md`;default:return`rounded-full`}}getIconSize(){switch(this.size){case`xs`:return`11px`;case`sm`:return`13px`;case`lg`:return`18px`;default:return`15px`}}getExoticStyles(){let e={};return this.size===`lg`&&(e.letterSpacing=`0.03em`,e.fontWeight=`500`),this.size===`sm`&&(e.letterSpacing=`0.02em`),e}getColorStyles(){return{primary:{bg:this.outlined?`transparent`:`color-mix(in srgb, ${c.t.sys.color.primary.container} 92%, ${c.t.sys.color.primary.default} 8%)`,text:this.outlined?c.t.sys.color.primary.default:c.t.sys.color.primary.onContainer,border:this.outlined?`color-mix(in srgb, ${c.t.sys.color.primary.default} 90%, ${c.t.sys.color.surface.highest} 10%)`:void 0},secondary:{bg:this.outlined?`transparent`:`color-mix(in srgb, ${c.t.sys.color.secondary.container} 95%, ${c.t.sys.color.secondary.default} 5%)`,text:this.outlined?c.t.sys.color.secondary.default:c.t.sys.color.secondary.onContainer,border:this.outlined?`color-mix(in srgb, ${c.t.sys.color.secondary.default} 85%, ${c.t.sys.color.surface.highest} 15%)`:void 0},tertiary:{bg:this.outlined?`transparent`:`color-mix(in srgb, ${c.t.sys.color.tertiary.container} 94%, ${c.t.sys.color.tertiary.default} 6%)`,text:this.outlined?c.t.sys.color.tertiary.default:c.t.sys.color.tertiary.onContainer,border:this.outlined?`color-mix(in srgb, ${c.t.sys.color.tertiary.default} 88%, ${c.t.sys.color.surface.highest} 12%)`:void 0},success:{bg:this.outlined?`transparent`:`color-mix(in srgb, ${c.t.sys.color.success.container} 90%, ${c.t.sys.color.success.default} 10%)`,text:this.outlined?c.t.sys.color.success.default:c.t.sys.color.success.onContainer,border:this.outlined?`color-mix(in srgb, ${c.t.sys.color.success.default} 85%, ${c.t.sys.color.surface.bright} 15%)`:void 0},warning:{bg:this.outlined?`transparent`:`color-mix(in srgb, ${c.t.sys.color.tertiary.container} 85%, ${c.t.sys.color.tertiary.default} 15%)`,text:this.outlined?c.t.sys.color.tertiary.default:c.t.sys.color.tertiary.onContainer,border:this.outlined?`color-mix(in srgb, ${c.t.sys.color.tertiary.default} 90%, ${c.t.sys.color.surface.highest} 10%)`:void 0},error:{bg:this.outlined?`transparent`:`color-mix(in srgb, ${c.t.sys.color.error.container} 92%, ${c.t.sys.color.error.default} 8%)`,text:this.outlined?c.t.sys.color.error.default:c.t.sys.color.error.onContainer,border:this.outlined?`color-mix(in srgb, ${c.t.sys.color.error.default} 88%, ${c.t.sys.color.surface.bright} 12%)`:void 0},neutral:{bg:this.outlined?`transparent`:`color-mix(in srgb, ${c.t.sys.color.surface.high} 95%, ${c.t.sys.color.outline} 5%)`,text:this.outlined?`color-mix(in srgb, ${c.t.sys.color.surface.on} 95%, ${c.t.sys.color.surface.default} 5%)`:c.t.sys.color.surface.on,border:this.outlined?`color-mix(in srgb, ${c.t.sys.color.outline} 85%, ${c.t.sys.color.surface.highest} 15%)`:void 0},surface:{bg:this.outlined?`transparent`:c.t.sys.color.surface.high,text:c.t.sys.color.surface.on,border:this.outlined?c.t.sys.color.outline:void 0}}[this.color]}render(){let e=this.getSizeClasses(),t=this.getShapeClasses(),n=this.getColorStyles(),r=this.getIconSize(),i=this.getExoticStyles(),a={"inline-flex items-center justify-center font-medium":!0,"transition-all duration-200 ease-in-out":!0,[e]:!0,[t]:!0,"animate-pulse":this.pulse,"border border-solid":this.outlined,"shadow-sm":!this.outlined&&this.size===`sm`,shadow:!this.outlined&&this.size===`md`,"shadow-md":!this.outlined&&this.size===`lg`,"hover:brightness-95 hover:-translate-y-px":this.outlined,"hover:brightness-[0.98]":!this.outlined},s={borderColor:n.border,backdropFilter:this.outlined?`blur(4px)`:void 0,boxShadow:this.size!==`lg`||this.outlined?void 0:`0 1px 2px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1)`,...i};return p.html`
			<div
				part="badge"
				class="${this.classMap(a)}"
				style="${this.styleMap(s)}"
				${o.color({bgColor:n.bg,color:n.text})}
			>
				<!-- Icon slot or named icon -->
				<slot name="icon">
					${this.icon?p.html`
								<div part="icon" class="shrink-0 flex items-center justify-center leading-none">
									<schmancy-icon .size=${r} class="flex items-center justify-center">${this.icon}</schmancy-icon>
								</div>
							`:``}
				</slot>

				<!-- Content with proper spacing from icon -->
				<div part="content" class="flex items-center leading-none tracking-[0.01em] ${this.icon?`ml-[0.38em]`:``}">
					<slot></slot>
				</div>
			</div>
		`}};n.t([(0,f.property)({type:String,reflect:!0})],h.prototype,`color`,void 0),n.t([(0,f.property)({type:String,reflect:!0})],h.prototype,`size`,void 0),n.t([(0,f.property)({type:String,reflect:!0})],h.prototype,`shape`,void 0),n.t([(0,f.property)({type:Boolean,reflect:!0})],h.prototype,`outlined`,void 0),n.t([(0,f.property)({type:String})],h.prototype,`icon`,void 0),n.t([(0,f.property)({type:Boolean,reflect:!0})],h.prototype,`pulse`,void 0),h=n.t([(0,f.customElement)(`schmancy-badge`)],h);var g=class extends h{};g=n.t([(0,f.customElement)(`sch-badge`)],g);var _=new class{constructor(){this.$drawer=new u.Subject,this.pushCounter=0,this.isDismissing$=new u.BehaviorSubject(!1),this.$drawer.pipe((0,u.concatMap)(e=>{switch(e.action){case`dismiss`:return(0,u.of)(e).pipe((0,u.tap)(()=>{this.isDismissing$.next(!0),this.dispatchToggleEvent(e.ref,`close`)}),(0,u.delay)(300),(0,u.tap)(()=>this.isDismissing$.next(!1)));case`render`:return(0,u.of)(e).pipe((0,u.tap)(()=>{this.dispatchToggleEvent(e.ref,`open`),this.dispatchRenderEvent(e.ref,e.component,e.title)}));case`push`:return(0,u.of)(e).pipe((0,u.tap)(()=>this.handlePush(e.ref,e.component,e.state,e.params,e.props)));default:return(0,u.of)(null)}})).subscribe()}dispatchToggleEvent(e,t){e.dispatchEvent(new CustomEvent(l.SchmancyEvents.ContentDrawerToggle,{detail:{state:t},bubbles:!0,composed:!0}))}dispatchRenderEvent(e,t,n,r,i,a){e.dispatchEvent(new CustomEvent(`schmancy-content-drawer-render`,{detail:{component:t,title:n,state:r,params:i,props:a},bubbles:!0,composed:!0}))}dimiss(e){this.$drawer.next({action:`dismiss`,ref:e})}render(e,t,n){e.dispatchEvent(new CustomEvent(`custom-event`)),this.$drawer.next({action:`render`,ref:e,component:t,title:n})}handlePush(e,t,n,r,i){let a={...n,_drawerPushId:++this.pushCounter};this.dispatchToggleEvent(e,`open`),this.dispatchRenderEvent(e,t,void 0,a,r,i)}push(e){this.$drawer.next({action:`push`,ref:window,...e})}},v=e.o(`push`),y=e.o(`close`),b=e.o(Math.floor(Math.random()*Date.now()).toString()),x=e.o(`100%`),S=e.o({}),C=class extends r.t(p.css`
	:host {
		position: relative;
		inset: 0;
		display: block;
		overflow: hidden;
	}
`){constructor(...e){super(...e),this.minWidth={main:360,sheet:576},this.schmancyContentDrawerID=Math.floor(Math.random()*Date.now()).toString(),this.maxHeight=`100%`}firstUpdated(){this.setupResizeListener(),this.setupToggleListener(),this.setupRenderListener()}setupResizeListener(){(0,u.merge)((0,u.fromEvent)(window,`resize`),(0,u.fromEvent)(window,l.SchmancyEvents.ContentDrawerResize)).pipe((0,u.startWith)(!0),(0,u.debounceTime)(100),(0,u.map)(()=>this.clientWidth||window.innerWidth),(0,u.map)(e=>e>=this.minWidth.main+this.minWidth.sheet),(0,u.distinctUntilChanged)(),(0,u.tap)(()=>this.updateMaxHeight()),(0,u.takeUntil)(this.disconnecting)).subscribe(e=>this.updateMode(e))}setupToggleListener(){(0,u.fromEvent)(window,l.SchmancyEvents.ContentDrawerToggle).pipe((0,u.tap)(e=>e.stopPropagation()),(0,u.map)(e=>e.detail.state),(0,u.takeUntil)(this.disconnecting)).subscribe(e=>{this.open=e})}setupRenderListener(){(0,u.fromEvent)(window,`schmancy-content-drawer-render`).pipe((0,u.tap)(e=>e.stopPropagation()),(0,u.map)(e=>e.detail),(0,u.takeUntil)(this.disconnecting)).subscribe(e=>this.handleRender(e))}updateMaxHeight(){this.maxHeight=window.innerHeight-this.getOffsetTop(this)+`px`,this.style.setProperty(`max-height`,this.maxHeight)}updateMode(e){e?(this.mode=`push`,this.open=`open`):(this.mode=`overlay`,this.open=`close`)}handleRender(e){this.mode===`push`?i.S.push({area:this.schmancyContentDrawerID,component:e.component,historyStrategy:`silent`,state:e.state,params:e.params,props:e.props}):this.mode===`overlay`&&s.n.open({component:e.component,uid:this.schmancyContentDrawerID,props:e.props})}getOffsetTop(e){let t=0;for(;e;)t+=e.offsetTop,e=e.offsetParent;return t}render(){return this.mode&&this.open?p.html`
			<div class=${[`grid h-full`,`grid-flow-col auto-cols-max`,`grid-rows-[1fr]`,`justify-items-stretch items-stretch`,this.mode===`overlay`?`grid-cols-[1fr]`:`grid-cols-[auto_1fr]`].join(` `)}>
				<slot></slot>
			</div>
		`:p.nothing}};n.t([t.t({context:S})],C.prototype,`minWidth`,void 0),n.t([t.t({context:y}),(0,f.property)()],C.prototype,`open`,void 0),n.t([t.t({context:v}),(0,f.state)()],C.prototype,`mode`,void 0),n.t([t.t({context:b})],C.prototype,`schmancyContentDrawerID`,void 0),n.t([t.t({context:x})],C.prototype,`maxHeight`,void 0),n.t([(0,f.queryAssignedElements)({flatten:!0})],C.prototype,`assignedElements`,void 0),C=n.t([(0,f.customElement)(`schmancy-content-drawer`)],C);var w=class extends r.t(p.css`
	:host {
		display: block;
		overflow: hidden;
	}
`){connectedCallback(){super.connectedCallback(),this.minWidth?this.drawerMinWidth.main=this.minWidth:this.minWidth=this.drawerMinWidth.main}update(e){super.update(e),e.has(`minWidth`)&&this.minWidth&&(this.drawerMinWidth.main=this.minWidth,this.dispatchEvent(new CustomEvent(l.SchmancyEvents.ContentDrawerResize,{bubbles:!0,composed:!0})))}render(){let e={minWidth:`${this.minWidth}px`,maxHeight:this.maxHeight};return p.html`
			<section class="relative inset-0 h-full">
				<div class=${[`grid h-full relative overflow-scroll`,`grid-flow-col auto-cols-max`,`grid-rows-[1fr]`,`items-stretch justify-items-stretch`,this.mode===`push`?`grid-cols-[auto_1fr]`:`grid-cols-[1fr]`].join(` `)}>
					<section style=${this.styleMap(e)}>
						<slot></slot>
					</section>
				</div>
				${(0,m.when)(this.mode===`push`,()=>p.html` <schmancy-divider class="absolute right-0 top-0" orientation="vertical"></schmancy-divider>`)}
			</section>
		`}};n.t([(0,f.property)({type:Number})],w.prototype,`minWidth`,void 0),n.t([e.a({context:S,subscribe:!0})],w.prototype,`drawerMinWidth`,void 0),n.t([e.a({context:v,subscribe:!0}),(0,f.state)()],w.prototype,`mode`,void 0),n.t([e.a({context:x,subscribe:!0}),(0,f.state)()],w.prototype,`maxHeight`,void 0),w=n.t([(0,f.customElement)(`schmancy-content-drawer-main`)],w);var T=class extends r.t(p.css`
	:host {
		overflow: scroll;
	}
`){connectedCallback(){super.connectedCallback(),this.minWidth?this.drawerMinWidth.sheet=this.minWidth:this.minWidth=this.drawerMinWidth.sheet}updated(e){super.updated(e),e.has(`minWidth`)&&this.minWidth?(this.drawerMinWidth.sheet=this.minWidth,this.dispatchEvent(new CustomEvent(l.SchmancyEvents.ContentDrawerResize,{bubbles:!0,composed:!0}))):(e.has(`state`)||e.has(`mode`))&&(this.mode===`overlay`?this.state===`close`?this.closeAll():this.state:this.mode===`push`&&(s.n.dismiss(this.schmancyContentDrawerID),this.state===`close`?this.closeAll():this.state===`open`&&this.open()))}open(){this.mode===`overlay`?this.sheet.style.position=`fixed`:this.sheet.style.position=`relative`,this.sheet.style.display=`block`,this.sheet.animate([{opacity:0,transform:`translateX(100%)`},{opacity:1,transform:`translateX(0%)`}],{duration:250,easing:`cubic-bezier(0.5, 0.01, 0.25, 1)`})}closeAll(){(0,u.merge)((0,u.from)(this.closeModalSheet()),(0,u.from)(this.closeSheet())).pipe((0,u.takeUntil)(this.disconnecting)).subscribe()}closeModalSheet(){return(0,u.of)(!0).pipe((0,u.tap)(()=>s.n.dismiss(this.schmancyContentDrawerID)))}closeSheet(){return new u.Observable(e=>{this.sheet.animate([{opacity:1,transform:`translateX(0%)`},{opacity:1,transform:`translateX(100%)`}],{duration:250,easing:`cubic-bezier(0.5, 0.01, 0.25, 1)`}).onfinish=()=>{this.sheet.style.display=`none`,e.next(),e.complete()}})}render(){let e={"block h-full w-full":this.mode===`push`,"absolute z-50":this.mode===`overlay`,"opacity-1":this.mode===`overlay`&&this.state===`open`},t={minWidth:`${this.minWidth}px`,maxHeight:this.maxHeight};return p.html`
			<section id="sheet" class="${this.classMap(e)}" style=${this.styleMap(t)}>
				<schmancy-area class="h-full w-full" name="${this.schmancyContentDrawerID}">
					<slot name="placeholder"></slot>
				</schmancy-area>
			</section>
		`}};n.t([(0,f.property)({type:Number})],T.prototype,`minWidth`,void 0),n.t([e.a({context:v,subscribe:!0}),(0,f.state)()],T.prototype,`mode`,void 0),n.t([e.a({context:y,subscribe:!0}),(0,f.state)()],T.prototype,`state`,void 0),n.t([e.a({context:b})],T.prototype,`schmancyContentDrawerID`,void 0),n.t([(0,f.query)(`#sheet`)],T.prototype,`sheet`,void 0),n.t([(0,f.queryAssignedElements)({flatten:!0,slot:void 0})],T.prototype,`defaultSlot`,void 0),n.t([e.a({context:S,subscribe:!0})],T.prototype,`drawerMinWidth`,void 0),n.t([e.a({context:x,subscribe:!0}),(0,f.state)()],T.prototype,`maxHeight`,void 0),T=n.t([(0,f.customElement)(`schmancy-content-drawer-sheet`)],T);var E=new class{constructor(){this.$drawer=new u.Subject,this.$drawer.pipe((0,u.debounceTime)(10)).subscribe(e=>{e.state?window.dispatchEvent(new CustomEvent(l.SchmancyEvents.NavDrawer_toggle,{detail:{state:`open`},bubbles:!0,composed:!0})):window.dispatchEvent(new CustomEvent(l.SchmancyEvents.NavDrawer_toggle,{detail:{state:`close`},bubbles:!0,composed:!0}))})}open(e){this.$drawer.next({self:e,state:!0})}close(e){this.$drawer.next({self:e,state:!1})}},D=E,O=class extends e.t(p.css`
	:host {
		display: block;
		width: 100%;
		min-width: 0;
	}
`){render(){return p.html`<slot></slot>`}};O=n.t([(0,f.customElement)(`schmancy-nav-drawer-appbar`)],O);var k=class extends r.t(p.css`
	:host {
		display: block;
		position: relative;
		inset: 0;
		overflow-y: auto;
	}
`){connectedCallback(){super.connectedCallback(),(0,u.fromEvent)(this,`scroll`).pipe((0,u.takeUntil)(this.disconnecting)).subscribe(e=>{this.parentElement.dispatchEvent(new CustomEvent(`scroll`,{detail:e,bubbles:!0,composed:!0}))})}render(){return p.html` <slot></slot> `}};k=n.t([(0,f.customElement)(`schmancy-nav-drawer-content`)],k);var A,j=e.o(`push`),M=e.o(`close`),N=class extends r.t(p.css`
	:host {
		display: grid;
		grid-template-columns: auto 1fr;
		grid-template-rows: 1fr;
		flex-grow: 1;
		height: 100%;
		overflow: hidden;
		/* Initially hide the component until it's ready */
		visibility: hidden;
	}

	:host([data-ready]) {
		visibility: visible;
	}

	:host([fullscreen]) {
		grid-template-columns: 1fr;
	}
`){static{A=this}constructor(...e){super(...e),this.fullscreen=!1,this.breakpoint=`md`}static{this.BREAKPOINTS={sm:640,md:768,lg:1024,xl:1280}}firstUpdated(){this.updateState(window.innerWidth),this.setAttribute(`data-ready`,``),(0,u.fromEvent)(window,`resize`).pipe((0,u.map)(e=>e.target.innerWidth),(0,u.map)(e=>e>=A.BREAKPOINTS[this.breakpoint]),(0,u.distinctUntilChanged)(),(0,u.debounceTime)(100),(0,u.takeUntil)(this.disconnecting)).subscribe(e=>{e?(this.mode=`push`,this.open=`open`):(this.mode=`overlay`,this.open=`close`)}),(0,u.fromEvent)(window,`fullscreen`).pipe((0,u.tap)(e=>{let t=e;this.fullscreen=t.detail}),(0,u.takeUntil)(this.disconnecting)).subscribe(),(0,u.fromEvent)(window,l.SchmancyEvents.NavDrawer_toggle).pipe((0,u.tap)(e=>{e.stopPropagation()}),(0,u.map)(e=>e.detail.state),(0,u.takeUntil)(this.disconnecting),(0,u.debounceTime)(10)).subscribe(e=>{e===`toggle`&&(e=this.open===`open`?`close`:`open`),this.mode===`push`&&e===`close`||(this.open=e)})}updateState(e){let t=e>=A.BREAKPOINTS[this.breakpoint];this.mode=t?`push`:`overlay`,this.open=t?`open`:`close`}render(){return p.html`<slot></slot>`}};n.t([(0,f.property)({type:Boolean,reflect:!0})],N.prototype,`fullscreen`,void 0),n.t([(0,f.property)({type:String,attribute:`breakpoint`})],N.prototype,`breakpoint`,void 0),n.t([t.t({context:j}),(0,f.state)()],N.prototype,`mode`,void 0),n.t([t.t({context:M}),(0,f.property)()],N.prototype,`open`,void 0),N=A=n.t([(0,f.customElement)(`schmancy-nav-drawer`)],N);var P=`cubic-bezier(0.5, 0.01, 0.25, 1)`,F=class extends r.t(){constructor(...e){super(...e),this.width=`220px`,this._initialized=!1}firstUpdated(){this.mode===`overlay`?this.drawerState===`close`?(this.nav.style.transform=`translateX(-100%)`,this.overlay.style.display=`none`):this.drawerState===`open`&&(this.nav.style.transform=`translateX(0)`,this.overlay.style.display=`block`,this.overlay.style.opacity=`0.4`):this.mode===`push`&&(this.nav.style.transform=`translateX(0)`,this.overlay.style.display=`none`),this._initialized=!0}updated(e){this._initialized&&(e.has(`drawerState`)||e.has(`mode`))&&(this.mode===`overlay`?this.drawerState===`open`?this.nav.style.transform!==`translateX(0)`&&(this.openOverlay(),this.showNavDrawer()):this.drawerState===`close`&&this.nav.style.transform!==`translateX(-100%)`&&(this.hideNavDrawer(),this.closeOverlay()):this.mode===`push`&&(this.nav.style.transform!==`translateX(0)`&&this.showNavDrawer(),this.overlay.style.display!==`none`&&this.closeOverlay()))}openOverlay(){this.overlay.style.display=`block`,this.overlay.animate([{opacity:0},{opacity:.4}],{duration:200,easing:P,fill:`forwards`})}closeOverlay(){this.overlay.animate([{opacity:.4},{opacity:0}],{duration:150,easing:P,fill:`forwards`}).onfinish=()=>{this.overlay.style.display=`none`}}showNavDrawer(){this.nav.animate([{transform:`translateX(-100%)`},{transform:`translateX(0)`}],{duration:200,easing:P,fill:`forwards`}).onfinish=()=>{this.nav.style.transform=`translateX(0)`}}hideNavDrawer(){this.nav.animate([{transform:`translateX(0)`},{transform:`translateX(-100%)`}],{duration:200,easing:P,fill:`forwards`}).onfinish=()=>{this.nav.style.transform=`translateX(-100%)`}}handleOverlayClick(){window.dispatchEvent(new CustomEvent(l.SchmancyEvents.NavDrawer_toggle,{detail:{state:`close`},bubbles:!0,composed:!0}))}render(){let e={"max-w-[360px] w-fit h-full overflow-auto":!0,block:this.mode===`push`,"fixed inset-0 z-50":this.mode===`overlay`},t={width:this.width};return p.html`
			<nav
				style=${this.styleMap(t)}
				class="${this.classMap({...e})}"
				${o.color({bgColor:c.t.sys.color.surface.containerLowest})}
			>
				<slot></slot>
			</nav>
			<div
				id="overlay"
				${o.color({bgColor:c.t.sys.color.scrim})}
				@click=${this.handleOverlayClick}
				class="${this.classMap({"fixed inset-0 z-49 hidden":!0})}"
			></div>
		`}};n.t([e.a({context:j,subscribe:!0}),(0,f.state)()],F.prototype,`mode`,void 0),n.t([e.a({context:M,subscribe:!0}),(0,f.state)()],F.prototype,`drawerState`,void 0),n.t([(0,f.query)(`#overlay`)],F.prototype,`overlay`,void 0),n.t([(0,f.query)(`nav`)],F.prototype,`nav`,void 0),n.t([(0,f.property)({type:String})],F.prototype,`width`,void 0),n.t([(0,f.state)()],F.prototype,`_initialized`,void 0),F=n.t([(0,f.customElement)(`schmancy-nav-drawer-navbar`)],F);var I=class extends e.t(p.css`
	:host {
		display: flex;
		flex: 1;
		min-width: 48px;
		max-width: 168px;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
	}

	:host([disabled]) {
		pointer-events: none;
	}

	button {
		font-family: inherit;
		border: none;
		background: none;
		width: 100%;
		padding: 0;
		margin: 0;
		text-align: center;
		color: inherit;
	}

	button:focus {
		outline: none;
	}

	button:focus-visible {
		outline: 2px solid var(--focus-color);
		outline-offset: 2px;
		border-radius: 8px;
	}

	/* Ripple animation */
	@keyframes ripple {
		to {
			transform: scale(4);
			opacity: 0;
		}
	}

	.ripple-effect {
		position: absolute;
		border-radius: 50%;
		width: 20px;
		height: 20px;
		background-color: currentColor;
		opacity: 0.25;
		animation: ripple 0.6s ease-out;
		pointer-events: none;
	}
`){constructor(...e){super(...e),this.icon=``,this.label=``,this.badge=``,this.active$=new u.BehaviorSubject(!1),this.disabled=!1,this.hideLabels=!1,this.ripples=[],this.addRippleEffect=e=>{if(this.disabled)return;let t=this.shadowRoot?.querySelector(`.w-16.h-8`);if(t){let n=t.getBoundingClientRect(),r={x:e.clientX-n.left,y:e.clientY-n.top,id:Date.now()};this.ripples=[...this.ripples,r],(0,u.timer)(600).pipe((0,d.tap)(()=>{this.ripples=this.ripples.filter(e=>e.id!==r.id)}),(0,d.takeUntil)(this.disconnecting)).subscribe()}},this.handleClick=e=>{if(this.disabled)return e.preventDefault(),void e.stopPropagation();this.addRippleEffect(e)},this.handleKeyDown=e=>{this.disabled||e.key!==`Enter`&&e.key!==` `||e.preventDefault()}}get active(){return this.active$.value}set active(e){this.active$.next(e)}setActive(e){this.active=e}connectedCallback(){super.connectedCallback(),this.active$.pipe((0,d.takeUntil)(this.disconnecting)).subscribe(()=>{this.requestUpdate()}),this.setupNavigationStream()}setupNavigationStream(){let e=this.shadowRoot?.querySelector(`button`);e&&(0,u.merge)((0,u.fromEvent)(e,`click`).pipe((0,d.filter)(()=>!this.disabled)),(0,u.fromEvent)(e,`keydown`).pipe((0,d.filter)(()=>!this.disabled),(0,d.filter)(e=>e.key===`Enter`||e.key===` `),(0,d.tap)(e=>e.preventDefault()))).pipe((0,d.tap)(()=>{this.dispatchEvent(new CustomEvent(`bar-item-click`,{detail:{icon:this.icon,label:this.label,active:this.active},bubbles:!0,composed:!0}))}),(0,d.takeUntil)(this.disconnecting)).subscribe()}formatBadge(e){let t=Number(e);return isNaN(t)?e.slice(0,3):t>99?`99+`:String(t)}firstUpdated(){this.setupNavigationStream()}render(){let e=this.querySelector(`[slot]`)||this.textContent?.trim()&&!this.label,t=this.badge?this.formatBadge(this.badge):``,n=t&&t!==`0`,r=this.querySelector(`[slot="icon"]`),i={"relative flex flex-col items-center justify-center":!0,"flex-1 min-w-[48px] max-w-[168px]":!0,"py-2 px-1 cursor-pointer":!this.disabled,"transition-all duration-200":!0,"hover:bg-surface-containerHigh":!this.disabled&&!this.active,"cursor-not-allowed opacity-38":this.disabled,"outline-none":!0,"focus-visible:outline-2 focus-visible:outline-offset-2":!0},a={"w-16 h-8 rounded-2xl":!0,"flex items-center justify-center":!0,"transition-all duration-200":!0,"bg-secondary-container":this.active,"group-hover:bg-surface-containerHighest":!this.active&&!this.disabled,"relative overflow-hidden":!0},s={"absolute top-0 right-3":!0,"min-w-[6px] h-1.5":!n,"min-w-[16px] h-4":n,"rounded-full":!n,"rounded-lg":n,"flex items-center justify-center":n,"px-1":n,"transition-all duration-200":!0,"z-10":!0},l=this.active?{color:c.t.sys.color.secondary.onContainer}:{color:c.t.sys.color.surface.onVariant},u={"--focus-color":c.t.sys.color.primary.default};return p.html`
			<button
				type="button"
				class=${this.classMap(i)}
				@click=${this.handleClick}
				@keydown=${this.handleKeyDown}
				?disabled=${this.disabled}
				aria-pressed=${this.active}
				aria-label=${this.label||`Navigation item`}
				style=${this.styleMap({...u,"outline-color":`var(--focus-color)`})}
				${o.color(l)}
			>
				<!-- Icon with indicator background -->
				<div class=${this.classMap(a)}>
					<!-- Ripple effects -->
					${this.ripples.map(e=>p.html`
							<span
								class="ripple-effect"
								style=${this.styleMap({left:`${e.x}px`,top:`${e.y}px`,transform:`translate(-50%, -50%)`})}
							></span>
						`)}

					${r?p.html`<slot name="icon"></slot>`:this.icon?p.html`
									<schmancy-icon
										.fill=${+!!this.active}
										class="relative z-10 flex items-center justify-center transition-all duration-200"
										style="--schmancy-icon-size: 24px;"
										aria-hidden="true"
									>
										${this.icon}
									</schmancy-icon>
							  `:e?p.html`<slot></slot>`:``}
				</div>

				<!-- Label below icon -->
				${!this.hideLabels&&this.label?p.html`
					<span class=${this.classMap({"text-xs font-medium leading-4 mt-1":!0,"text-center max-w-full":!0,"overflow-hidden text-ellipsis whitespace-nowrap":!0,"transition-all duration-200":!0})}>${this.label}</span>
				`:``}

				<!-- Badge -->
				${n?p.html`
					<span
						class=${this.classMap(s)}
						aria-label="${t} notifications"
						${o.color({bgColor:c.t.sys.color.error.default,color:c.t.sys.color.error.on})}
					>
						<span class="text-[10px] font-medium leading-none">${t}</span>
					</span>
				`:this.badge?p.html`
					<span
						class=${this.classMap(s)}
						aria-label="Has notifications"
						${o.color({bgColor:c.t.sys.color.error.default})}
					></span>
				`:``}
			</button>
		`}};n.t([(0,f.property)({type:String})],I.prototype,`icon`,void 0),n.t([(0,f.property)({type:String})],I.prototype,`label`,void 0),n.t([(0,f.property)({type:String})],I.prototype,`badge`,void 0),n.t([(0,f.property)({type:Boolean,reflect:!0})],I.prototype,`active`,null),n.t([(0,f.property)({type:Boolean,reflect:!0})],I.prototype,`disabled`,void 0),n.t([(0,f.property)({type:Boolean,reflect:!0})],I.prototype,`hideLabels`,void 0),n.t([(0,f.state)()],I.prototype,`ripples`,void 0),I=n.t([(0,f.customElement)(`schmancy-navigation-bar-item`)],I);var L=class extends e.t(p.css`
	:host {
		display: block;
		transition: transform 0.3s ease-in-out;
	}

	:host([hide-on-scroll]) {
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Support 3-7 items with equal distribution */
	::slotted(schmancy-navigation-bar-item) {
		flex: 1;
		max-width: 168px; /* Prevent items from being too wide */
	}

	/* Accessibility focus indicators */
	:host(:focus-within) {
		outline: 2px solid var(--schmancy-sys-color-primary);
		outline-offset: -2px;
	}
`){constructor(...e){super(...e),this.activeIndex$=new u.BehaviorSubject(-1),this.hideLabels=!1,this.elevation=2,this.hideOnScroll=!1,this.focusedIndex=-1,this.isHiddenByScroll=!1,this.isFullscreen=!1,this.SCROLL_THRESHOLD=10,this.mobileMediaQuery=null,this.visibility$=new u.Subject,this.handleItemClick=e=>{let t=this.getItems(),n=e.target,r=t.indexOf(n);if(r===-1)return;if(this.activeIndex===r)return void this.dispatchEvent(new CustomEvent(l.SchmancyEvents.NavDrawer_toggle,{detail:{state:`toggle`},bubbles:!0,composed:!0}));let i=this.activeIndex;this.activeIndex=r,this.dispatchEvent(new CustomEvent(`navigation-change`,{detail:{oldIndex:i,newIndex:r,item:n},bubbles:!0,composed:!0}))},this.handleKeyDown=e=>{let t=this.getItems(),n=this.focusedIndex===-1?this.activeIndex:this.focusedIndex;switch(e.key){case`ArrowLeft`:e.preventDefault(),n>0&&this.focusItem(n-1);break;case`ArrowRight`:e.preventDefault(),n<t.length-1&&this.focusItem(n+1);break;case`Home`:e.preventDefault(),this.focusItem(0);break;case`End`:e.preventDefault(),this.focusItem(t.length-1);break;case`Enter`:case` `:e.preventDefault(),this.focusedIndex!==-1&&t[this.focusedIndex]?.click()}}}get activeIndex(){return this.activeIndex$.value}set activeIndex(e){this.activeIndex$.next(e)}getItems(){let e=this.shadowRoot?.querySelector(`slot`);return e?e.assignedElements({flatten:!0}).filter(e=>e.tagName.toLowerCase()===`schmancy-navigation-bar-item`):[]}isMobileViewport(){return this.mobileMediaQuery?.matches??!1}updateBottomOffset(){let e=!this.isFullscreen&&this.isMobileViewport();a.n.setBottomOffset(e?80:0)}connectedCallback(){super.connectedCallback(),this.mobileMediaQuery=window.matchMedia(`(max-width: 767px)`),(0,u.fromEvent)(this.mobileMediaQuery,`change`).pipe((0,d.tap)(()=>this.updateBottomOffset()),(0,d.takeUntil)(this.disconnecting)).subscribe(),a.n.fullscreen$.pipe((0,d.tap)(e=>{this.isFullscreen=e,this.visibility$.next(!this.isFullscreen&&!this.isHiddenByScroll),this.updateBottomOffset()}),(0,d.takeUntil)(this.disconnecting)).subscribe(),this.updateBottomOffset(),(0,u.fromEvent)(this,`bar-item-click`).pipe((0,d.tap)(e=>this.handleItemClick(e)),(0,d.takeUntil)(this.disconnecting)).subscribe(),(0,u.fromEvent)(this,`keydown`).pipe((0,d.tap)(e=>this.handleKeyDown(e)),(0,d.takeUntil)(this.disconnecting)).subscribe(),this.activeIndex$.pipe((0,d.takeUntil)(this.disconnecting)).subscribe(e=>{this.updateActiveStates(e)}),this.hideOnScroll&&this.setupScrollListener(),this.updateItems()}disconnectedCallback(){super.disconnectedCallback(),a.n.setBottomOffset(0),this.mobileMediaQuery=null}setupScrollListener(){(0,u.fromEvent)(window,`scroll`).pipe((0,d.throttleTime)(100),(0,d.map)(()=>window.scrollY),(0,d.pairwise)(),(0,d.filter)(([e,t])=>Math.abs(t-e)>this.SCROLL_THRESHOLD),(0,d.tap)(([e,t])=>{let n=t>e,r=t<e,i=this.isHiddenByScroll;n&&!this.isHiddenByScroll?this.isHiddenByScroll=!0:r&&this.isHiddenByScroll&&(this.isHiddenByScroll=!1),t<=this.SCROLL_THRESHOLD&&(this.isHiddenByScroll=!1),i!==this.isHiddenByScroll&&this.visibility$.next(!this.isHiddenByScroll&&!this.isFullscreen)}),(0,d.takeUntil)(this.disconnecting)).subscribe()}focusItem(e){let t=this.getItems();t[e]&&(this.focusedIndex=e,t[e].focus())}updateItems(){let e=this.shadowRoot?.querySelector(`slot`);if(e){let t=()=>{this.updateActiveStates(this.activeIndex)};e.addEventListener(`slotchange`,t),t()}}addBoatItem(e){let t=this.querySelector(`[value="${e.id}"]`);if(t)return t;let n=document.createElement(`schmancy-navigation-bar-item`);return n.setAttribute(`value`,e.id),n.innerHTML=`\n\t\t\t<schmancy-icon>${e.icon||`widgets`}</schmancy-icon>\n\t\t\t<span>${e.title}</span>\n\t\t`,this.appendChild(n),n}updateActiveStates(e){this.getItems().forEach((t,n)=>{let r=t;r.setActive?r.setActive(n===e):r.active=n===e,r.hideLabels=this.hideLabels,t.tabIndex=n===e?0:-1})}updated(e){super.updated(e),e.has(`hideLabels`)&&this.updateActiveStates(this.activeIndex),e.has(`hideOnScroll`)&&(this.hideOnScroll&&!e.get(`hideOnScroll`)?this.setupScrollListener():this.hideOnScroll||(this.isHiddenByScroll=!1,this.visibility$.next(!this.isFullscreen)))}render(){let e=this.isFullscreen||this.isHiddenByScroll,t={"h-20":!0,"flex items-center justify-around":!0,"px-2 py-3 box-border":!0,"transition-all duration-300 ease-in-out":!0,"z-10":!0,"shadow-none":this.elevation===0,"shadow-sm":this.elevation===1,"shadow-md":this.elevation===2,"shadow-lg":this.elevation===3,"shadow-xl":this.elevation===4,"shadow-2xl":this.elevation===5},n=e?`translateY(100%)`:`translateY(0)`;return p.html`
			<nav
				class=${this.classMap(t)}
				role="navigation"
				aria-label="Main navigation"
				aria-hidden=${e}
				style="transform: ${n};"
				${o.color({bgColor:c.t.sys.color.surface.container,color:c.t.sys.color.surface.on})}
			>
				<slot></slot>
			</nav>
		`}};n.t([(0,f.property)({type:Number})],L.prototype,`activeIndex`,null),n.t([(0,f.property)({type:Boolean,reflect:!0})],L.prototype,`hideLabels`,void 0),n.t([(0,f.property)({type:Number,reflect:!0})],L.prototype,`elevation`,void 0),n.t([(0,f.property)({type:Boolean,reflect:!0})],L.prototype,`hideOnScroll`,void 0),n.t([(0,f.state)()],L.prototype,`focusedIndex`,void 0),n.t([(0,f.state)()],L.prototype,`isHiddenByScroll`,void 0),n.t([(0,f.state)()],L.prototype,`isFullscreen`,void 0),L=n.t([(0,f.customElement)(`schmancy-navigation-bar`)],L);var R=`whereAreYouRicky`,z=`hereMorty`,B=new class{constructor(){this.activeTeleportations=new Map,this.flipRequests=new u.Subject,this.find=e=>(0,u.zip)([(0,u.fromEvent)(window,z).pipe((0,u.filter)(t=>!!t.detail.component.uuid&&!!e.id&&t.detail.component.id===e.id&&t.detail.component.uuid!==e.uuid),(0,u.map)(e=>e.detail.component),(0,u.take)(1)),(0,u.of)(e).pipe((0,u.tap)(()=>{window.dispatchEvent(new CustomEvent(R,{detail:{id:e.id,callerID:e.uuid}}))}))]).pipe((0,u.map)(([e])=>e),(0,u.timeout)(0)),this.flip=e=>{let{from:t,to:n}=e,r=n.element.style.zIndex;n.element.style.transformOrigin=`top left`,n.element.style.setProperty(`visibility`,`visible`),n.element.style.zIndex=`1000`;let i=[{transform:`translate(${t.rect.left-n.rect.left}px, ${t.rect.top-n.rect.top}px) scale(${t.rect.width/n.rect.width}, ${t.rect.height/n.rect.height})`},{transform:`translate(0, 0) scale(1, 1)`}];n.element.animate(i,{duration:250,delay:10,easing:`cubic-bezier(0.455, 0.03, 0.515, 0.955)`}).onfinish=()=>{n.element.style.zIndex=r,n.element.style.transformOrigin=``}},this.flipRequests.pipe((0,u.bufferTime)(1),(0,u.map)(e=>e.map(({from:e,to:t,host:n},r)=>({from:e,to:t,host:n,i:r}))),(0,u.concatMap)(e=>(0,u.zip)(e.map(e=>(0,u.of)(this.flip(e)))))).subscribe()}};function V(e){return(0,u.interval)(50).pipe((0,d.map)(()=>e.getBoundingClientRect()),(0,d.distinctUntilChanged)((e,t)=>e.width===t.width&&e.height===t.height&&e.top===t.top&&e.right===t.right&&e.bottom===t.bottom&&e.left===t.left),(0,d.take)(1))}var H=class extends r.t(p.css``){constructor(...e){super(...e),this.uuid=Math.floor(Math.random()*Date.now()),this.delay=0,this.debugging=!1}get _slottedChildren(){return this.shadowRoot.querySelector(`slot`).assignedElements({flatten:!0})}connectedCallback(){if(this.id===void 0)throw Error(`id is required`);super.connectedCallback(),(0,u.merge)((0,u.fromEvent)(window,i.b).pipe((0,u.tap)({next:()=>{this.dispatchEvent(new CustomEvent(i.x,{detail:{component:this},bubbles:!0,composed:!0}))}})),(0,u.fromEvent)(window,R).pipe((0,u.tap)({next:e=>{e.detail.id===this.id&&this.uuid&&e.detail.callerID!==this.uuid&&this.dispatchEvent(new CustomEvent(z,{detail:{component:this},bubbles:!0,composed:!0}))}}))).pipe((0,u.takeUntil)(this.disconnecting)).subscribe()}async firstUpdated(){(0,u.of)(B.activeTeleportations.get(this.id)).pipe((0,u.filter)(e=>!!e),(0,u.takeUntil)(this.disconnecting),(0,u.throwIfEmpty)()).subscribe({next:e=>{this.style.setProperty(`visibility`,`hidden`),V(this).pipe((0,u.takeUntil)(this.disconnecting)).subscribe({next:t=>{B.activeTeleportations.set(this.id,t),B.flipRequests.next({from:{rect:e},to:{rect:t,element:this._slottedChildren[0]},host:this})}})},error:()=>{this.style.setProperty(`visibility`,`visible`),V(this).pipe((0,u.takeUntil)(this.disconnecting)).subscribe({next:e=>{B.activeTeleportations.set(this.id,e)}})},complete:()=>{}})}render(){return p.html`<slot></slot>`}};n.t([(0,f.property)({type:Number,reflect:!0})],H.prototype,`uuid`,void 0),n.t([(0,f.property)({type:String})],H.prototype,`id`,void 0),n.t([(0,f.property)({type:Number})],H.prototype,`delay`,void 0),H=n.t([(0,f.customElement)(`schmancy-teleport`)],H);var U=class extends r.t(){constructor(...e){super(...e),this.initials=``,this.src=``,this.icon=``,this.size=`md`,this.color=`primary`,this.shape=`circle`,this.bordered=!1,this.status=`none`}render(){let e;e=this.src?p.html`<img class="w-full h-full object-cover" src="${this.src}" alt="Avatar" />`:this.initials?p.html`<span class="text-center font-medium">${this.initials.substring(0,2).toUpperCase()}</span>`:this.icon?p.html`<schmancy-icon>${this.icon}</schmancy-icon>`:p.html`<schmancy-icon>person</schmancy-icon>`;let t={"relative flex items-center justify-center overflow-hidden":!0,[{xxs:`w-5 h-5 text-[8px]`,xs:`w-6 h-6 text-xs`,sm:`w-8 h-8 text-sm`,md:`w-10 h-10 text-base`,lg:`w-12 h-12 text-lg`,xl:`w-16 h-16 text-xl`}[this.size]]:!0,[{circle:`rounded-full`,square:`rounded-md`}[this.shape]]:!0,"border-2 border-surface-container":this.bordered},n=this.getColorAttributes();return p.html`
			<div class="${this.classMap(t)}" ${n}>
				${e} ${this.status===`none`?``:this.renderStatusIndicator()}
			</div>
		`}getColorAttributes(){return o.color({primary:{bgColor:c.t.sys.color.primary.container,color:c.t.sys.color.primary.onContainer},secondary:{bgColor:c.t.sys.color.secondary.container,color:c.t.sys.color.secondary.onContainer},tertiary:{bgColor:c.t.sys.color.tertiary.container,color:c.t.sys.color.tertiary.onContainer},success:{bgColor:c.t.sys.color.success.container,color:c.t.sys.color.success.onContainer},error:{bgColor:c.t.sys.color.error.container,color:c.t.sys.color.error.onContainer},neutral:{bgColor:c.t.sys.color.surface.container,color:c.t.sys.color.surface.on}}[this.color])}renderStatusIndicator(){let e={online:c.t.sys.color.success.default,offline:c.t.sys.color.surface.onVariant,busy:c.t.sys.color.error.default,away:c.t.sys.color.tertiary.default},t={"absolute bottom-0 right-0 rounded-full border-2 border-surface-default":!0,[{xxs:`w-1 h-1`,xs:`w-1.5 h-1.5`,sm:`w-2 h-2`,md:`w-2.5 h-2.5`,lg:`w-3 h-3`,xl:`w-4 h-4`}[this.size]]:!0};return p.html`
			<div class="${this.classMap(t)}" style="background-color: ${e[this.status]};"></div>
		`}};n.t([(0,f.property)({type:String})],U.prototype,`initials`,void 0),n.t([(0,f.property)({type:String})],U.prototype,`src`,void 0),n.t([(0,f.property)({type:String})],U.prototype,`icon`,void 0),n.t([(0,f.property)({type:String})],U.prototype,`size`,void 0),n.t([(0,f.property)({type:String})],U.prototype,`color`,void 0),n.t([(0,f.property)({type:String})],U.prototype,`shape`,void 0),n.t([(0,f.property)({type:Boolean})],U.prototype,`bordered`,void 0),n.t([(0,f.property)({type:String})],U.prototype,`status`,void 0),U=n.t([(0,f.customElement)(`schmancy-avatar`)],U),Object.defineProperty(exports,`C`,{enumerable:!0,get:function(){return y}}),Object.defineProperty(exports,`E`,{enumerable:!0,get:function(){return h}}),Object.defineProperty(exports,`S`,{enumerable:!0,get:function(){return v}}),Object.defineProperty(exports,`T`,{enumerable:!0,get:function(){return g}}),Object.defineProperty(exports,`_`,{enumerable:!0,get:function(){return w}}),Object.defineProperty(exports,`a`,{enumerable:!0,get:function(){return B}}),Object.defineProperty(exports,`b`,{enumerable:!0,get:function(){return x}}),Object.defineProperty(exports,`c`,{enumerable:!0,get:function(){return F}}),Object.defineProperty(exports,`d`,{enumerable:!0,get:function(){return M}}),Object.defineProperty(exports,`f`,{enumerable:!0,get:function(){return k}}),Object.defineProperty(exports,`g`,{enumerable:!0,get:function(){return T}}),Object.defineProperty(exports,`h`,{enumerable:!0,get:function(){return E}}),Object.defineProperty(exports,`i`,{enumerable:!0,get:function(){return R}}),Object.defineProperty(exports,`l`,{enumerable:!0,get:function(){return N}}),Object.defineProperty(exports,`m`,{enumerable:!0,get:function(){return D}}),Object.defineProperty(exports,`n`,{enumerable:!0,get:function(){return H}}),Object.defineProperty(exports,`o`,{enumerable:!0,get:function(){return L}}),Object.defineProperty(exports,`p`,{enumerable:!0,get:function(){return O}}),Object.defineProperty(exports,`r`,{enumerable:!0,get:function(){return z}}),Object.defineProperty(exports,`s`,{enumerable:!0,get:function(){return I}}),Object.defineProperty(exports,`t`,{enumerable:!0,get:function(){return U}}),Object.defineProperty(exports,`u`,{enumerable:!0,get:function(){return j}}),Object.defineProperty(exports,`v`,{enumerable:!0,get:function(){return C}}),Object.defineProperty(exports,`w`,{enumerable:!0,get:function(){return _}}),Object.defineProperty(exports,`x`,{enumerable:!0,get:function(){return S}}),Object.defineProperty(exports,`y`,{enumerable:!0,get:function(){return b}});