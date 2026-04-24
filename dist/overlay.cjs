Object.defineProperty(exports,Symbol.toStringTag,{value:`Module`});const e=require(`./chunk-CncqDLb2.cjs`),t=require(`./decorate-F9CuyeHg.cjs`),n=require(`./litElement.mixin-lYlKxxjR.cjs`);require(`./mixins.cjs`);const r=require(`./lazy-BDNnH_r7.cjs`),i=require(`./animation-CQRdLgzX.cjs`);let a=require(`rxjs`),o=require(`lit/decorators.js`),s=require(`lit`),c=require(`lit/directives/when.js`),l=require(`lit/directives/choose.js`);function u(e,t){if(i.v())return t===`in`?{keyframes:[{opacity:0,transform:`none`},{opacity:1,transform:`none`}],options:{duration:1,easing:`linear`,fill:`forwards`}}:{keyframes:[{opacity:1,transform:`none`},{opacity:0,transform:`none`}],options:{duration:1,easing:`linear`,fill:`forwards`}};switch(e){case`centered`:return t===`in`?{keyframes:[{opacity:0,transform:`scale(0.92) translateY(16px)`},{opacity:1,transform:`scale(1) translateY(0)`}],options:{duration:i.f.duration,easing:i.f.easingFallback,fill:`forwards`}}:{keyframes:[{opacity:1,transform:`scale(1) translateY(0)`},{opacity:0,transform:`scale(0.96) translateY(8px)`}],options:{duration:150,easing:i.o,fill:`forwards`}};case`sheet`:return t===`in`?{keyframes:[{opacity:0,transform:`translateY(100%)`},{opacity:1,transform:`translateY(0)`}],options:{duration:i.u.duration,easing:i.u.easingFallback,fill:`forwards`}}:{keyframes:[{opacity:1,transform:`translateY(0)`},{opacity:0,transform:`translateY(100%)`}],options:{duration:150,easing:i.o,fill:`forwards`}};case`anchored`:return t===`in`?{keyframes:[{opacity:0},{opacity:1}],options:{duration:i.f.duration,easing:i.f.easingFallback,fill:`forwards`}}:{keyframes:[{opacity:1},{opacity:0}],options:{duration:150,easing:i.o,fill:`forwards`}}}}var d=`overlay-mount`,f=class extends n.t(s.css`
	:host {
		position: fixed;
		inset: 0;
		z-index: var(--schmancy-overlay-z, 10000);
		display: contents;
		pointer-events: none;
	}
	dialog {
		margin: 0;
		padding: 0;
		border: 0;
		background: transparent;
		overflow: visible;
		max-width: none;
		max-height: none;
		pointer-events: auto;
	}
	dialog::backdrop {
		background: rgba(12, 12, 16, 0.28);
		backdrop-filter: blur(18px) saturate(150%);
		-webkit-backdrop-filter: blur(18px) saturate(150%);
	}
	.surface {
		position: fixed;
		pointer-events: auto;
		max-width: calc(100vw - 2rem);
		max-height: 90dvh;
		overflow: auto;
		border-radius: var(--schmancy-sys-shape-corner-large, 16px);
		background: var(--schmancy-sys-color-surface, #ffffff);
		box-shadow: 0 24px 64px -16px rgba(0, 0, 0, 0.35);
	}
	.surface[data-layout='centered'] {
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.surface[data-layout='sheet'] {
		left: 0;
		right: 0;
		bottom: 0;
		max-width: none;
		max-height: 90dvh;
		width: 100%;
		border-radius: var(--schmancy-sys-shape-corner-large, 16px) var(--schmancy-sys-shape-corner-large, 16px) 0 0;
		padding-bottom: env(safe-area-inset-bottom);
	}
	.surface[data-layout='anchored'] {
		max-width: min(480px, calc(100vw - 2rem));
		box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.28);
	}
	.drag-handle {
		display: flex;
		justify-content: center;
		padding: 8px 0 4px;
		touch-action: none;
		cursor: grab;
	}
	.drag-handle::before {
		content: '';
		width: 40px;
		height: 4px;
		border-radius: 999px;
		background: var(--schmancy-sys-color-outline-variant, #cac4cf);
	}
	@media (prefers-reduced-motion: reduce) {
		.surface { box-shadow: var(--schmancy-sys-elevation-2, 0 2px 6px rgba(0,0,0,0.2)); }
	}
`){constructor(...e){super(...e),this.layout=`centered`,this.dismissable=!0,this.modal=!0,this._closed$=new a.Subject,this._mounted=!1,this._closing=!1}get closed$(){return this._closed$.asObservable()}async open(e,t){if(this._mounted)throw Error(`schmancy-overlay: open() called twice on the same element`);this._mounted=!0,this.dismissable=!1!==t.dismissable,await this.updateComplete;let n=this.renderRoot.querySelector(`#${d}`);if(!n)throw Error(`schmancy-overlay: mount point missing`);await p(e,n,t.props);let r={width:window.innerWidth,height:window.innerHeight,isCoarsePointer:window.matchMedia(`(pointer: coarse)`).matches},i={width:n.scrollWidth,height:n.scrollHeight},a=function(e){let{anchor:t,content:n,viewport:r}=e,i=r.width<640,a=r.isCoarsePointer,o=n.height>.8*r.height,s=n.width>.9*r.width;return i||a||o||s?`sheet`:t===void 0?`centered`:`anchored`}({anchor:t.anchor,content:i,viewport:r});this.layout=a;let o=t.modal??(a===`centered`||a===`sheet`);this.modal=o,await this.updateComplete,o?this._dialog.showModal():this._dialog.show(),a===`anchored`&&t.anchor&&this.positionAnchored(t.anchor),this.wireCloseTriggers(t.signal),await this.playEnterAnimations()}async close(e,t){if(!this._closing&&this._mounted){this._closing=!0;try{await this.playExitAnimations()}catch{}try{this._dialog?.close()}catch{}this._closed$.next({reason:e,result:t}),this._closed$.complete()}}wireCloseTriggers(e){let t=this.disconnecting;if((0,a.fromEvent)(this._dialog,`close`).pipe((0,a.filter)(()=>!this._closing),(0,a.tap)(()=>{let e=this._dialog.returnValue;e!==``&&e!==void 0?this.close(`native-submit`,e):this.close(`escape`)}),(0,a.takeUntil)(t)).subscribe(),(0,a.fromEvent)(this,`close`).pipe((0,a.filter)(e=>e instanceof CustomEvent),(0,a.filter)(e=>e.target!==this._dialog),(0,a.tap)(e=>{e.stopPropagation(),this.close(`structured`,e.detail)}),(0,a.takeUntil)(t)).subscribe(),(0,a.fromEvent)(this._dialog,`cancel`).pipe((0,a.tap)(e=>{this.dismissable||e.preventDefault()}),(0,a.takeUntil)(t)).subscribe(),(0,a.fromEvent)(this._dialog,`click`).pipe((0,a.filter)(e=>this.dismissable&&e.target===this._dialog),(0,a.tap)(()=>{this.close(`backdrop`)}),(0,a.takeUntil)(t)).subscribe(),this.layout===`sheet`&&this.dismissable){let e=this.renderRoot.querySelector(`.drag-handle`);(function(e){let{surface:t,dragHandle:n,until$:r}=e;return new a.Observable(e=>{let i=n??t,o=new a.Subject,s=!1,c=0,l=0,u=0;return(0,a.merge)((0,a.fromEvent)(i,`touchstart`,{passive:!0}).pipe((0,a.filter)(e=>e.touches.length===1),(0,a.filter)(e=>{if(n)return!0;let r=e.touches[0],i=t.getBoundingClientRect();return r.clientY-i.top<=40}),(0,a.tap)(e=>{s=!0,c=e.touches[0].clientY,l=performance.now(),u=0,t.style.transition=`none`,t.style.willChange=`transform`})),(0,a.fromEvent)(t,`touchmove`,{passive:!1}).pipe((0,a.filter)(()=>s),(0,a.filter)(e=>e.touches.length===1),(0,a.tap)(e=>{let n=e.touches[0].clientY-c;u=n<0?.2*n:n,t.style.transform=`translateY(${u}px)`,e.preventDefault()})),(0,a.merge)((0,a.fromEvent)(t,`touchend`,{passive:!0}),(0,a.fromEvent)(t,`touchcancel`,{passive:!0})).pipe((0,a.filter)(()=>s),(0,a.tap)(()=>{s=!1;let n=Math.max(1,performance.now()-l),r=u/n,i=t.getBoundingClientRect().height,a=Math.min(80,.3*i),o=u>a||u>20&&r>.5;t.style.willChange=``,o?(t.style.transition=`transform 300ms cubic-bezier(0.16, 1, 0.3, 1)`,t.style.transform=`translateY(100%)`,e.next(`dismiss`),e.complete()):(t.style.transition=`transform 300ms cubic-bezier(0.16, 1, 0.3, 1)`,t.style.transform=`translateY(0)`)}))).pipe((0,a.takeUntil)((0,a.merge)(o,r))).subscribe(),()=>{o.next(),o.complete(),t.style.transition=``,t.style.transform=``,t.style.willChange=``}}).pipe((0,a.take)(1))})({surface:this._surface,dragHandle:e,until$:(0,a.merge)(t,this._closed$)}).pipe((0,a.take)(1)).subscribe(()=>{this.close(`swipe`)})}e&&(e.aborted?queueMicrotask(()=>{this.close(`abort`)}):(0,a.fromEvent)(e,`abort`).pipe((0,a.take)(1),(0,a.tap)(()=>{this.close(`abort`)}),(0,a.takeUntil)(t)).subscribe())}positionAnchored(e){let t=function(e){if(e instanceof Element){let t=e.getBoundingClientRect();return{top:t.top,left:t.left,right:t.right,bottom:t.bottom,width:t.width,height:t.height}}if(`clientX`in e&&`clientY`in e)return{top:e.clientY,left:e.clientX,right:e.clientX,bottom:e.clientY,width:0,height:0};let t=e;return{top:t.y,left:t.x,right:t.x,bottom:t.y,width:0,height:0}}(e),n=this._surface.getBoundingClientRect(),r=window.innerWidth,i=window.innerHeight,a=t.bottom+8;if(a+n.height>i-16){let e=t.top-8-n.height;a=e>=16?e:Math.max(16,i-16-n.height)}let o=t.left;o+n.width>r-16&&(o=r-16-n.width),o<16&&(o=16),this._surface.style.top=`${a}px`,this._surface.style.left=`${o}px`,this._surface.style.transform=`none`}async playEnterAnimations(){let e=this._dialog,t=this._surface;if(!e||!t)return;let n=u(this.layout,`in`);await t.animate(n.keyframes,n.options).finished.catch(()=>{})}async playExitAnimations(){let e=this._surface;if(!e)return;let t=u(this.layout,`out`);await e.animate(t.keyframes,t.options).finished.catch(()=>{})}render(){return s.html`
			<dialog>
				<section
					class="surface"
					data-layout=${this.layout}
					role="dialog"
					aria-modal=${this.modal?`true`:`false`}
				>
					${(0,c.when)(this.layout===`sheet`,()=>s.html`<div class="drag-handle" role="button" aria-label="Dismiss" tabindex="0"></div>`)}
					<div id=${d}></div>
				</section>
			</dialog>
		`}};async function p(e,t,n){if(typeof(r=e)==`object`&&r!==null&&`_$litType$`in r)return(0,s.render)(e,t),t;var r;if(e instanceof HTMLElement)return n&&Object.assign(e,n),t.appendChild(e),e;if(function(e){return typeof e==`function`&&(`preload`in e||`_promise`in e)}(e))return p((await e()).default,t,n);if(typeof e==`function`){let r=new e;return n&&Object.assign(r,n),t.appendChild(r),r}if(typeof e==`string`){let r=document.createElement(e);return n&&Object.assign(r,n),t.appendChild(r),r}throw Error(`schmancy-overlay: unsupported content type`)}t.t([(0,o.property)({type:String,reflect:!0})],f.prototype,`layout`,void 0),t.t([(0,o.property)({type:Boolean,reflect:!0})],f.prototype,`dismissable`,void 0),t.t([(0,o.property)({type:Boolean,reflect:!0})],f.prototype,`modal`,void 0),t.t([(0,o.query)(`dialog`)],f.prototype,`_dialog`,void 0),t.t([(0,o.query)(`.surface`)],f.prototype,`_surface`,void 0),f=t.t([(0,o.customElement)(`schmancy-overlay`)],f);var m=e.n({SchmancyOverlayPromptBody:()=>h}),h=class extends n.t(s.css`
	:host {
		display: block;
		padding: 20px 24px;
		min-width: 280px;
		max-width: 480px;
		color: var(--schmancy-sys-color-on-surface, #1a1a1a);
		background: var(--schmancy-sys-color-surface, #ffffff);
		border-radius: var(--schmancy-sys-shape-corner-large, 16px);
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
	}
	:host([variant='danger']) .cta-confirm {
		background: var(--schmancy-sys-color-error, #b3261e);
		color: var(--schmancy-sys-color-on-error, #ffffff);
	}
`){constructor(...e){super(...e),this.confirmText=`Confirm`,this.cancelText=`Cancel`,this.variant=`default`,this.mode=`confirm`,this.defaultValue=``,this.inputType=`text`,this.required=!1,this.handleCancel=()=>{this.dismiss(this.mode===`prompt`&&null)},this.handleConfirm=()=>{if(this.mode===`prompt`){let e=this._input;if(e&&!e.reportValidity())return;this.dismiss(e?.value??``)}else this.dismiss(!0)},this.handleSubmit=e=>{e.preventDefault(),this.handleConfirm()}}firstUpdated(){this.mode===`prompt`&&queueMicrotask(()=>this._input?.focus())}dismiss(e){this.dispatchEvent(new CustomEvent(`close`,{detail:e,bubbles:!0,composed:!0}))}render(){return s.html`
			<form @submit=${this.handleSubmit}>
				${(0,c.when)(this.heading,()=>s.html`<h2 class="text-lg font-semibold mb-1">${this.heading}</h2>`)}
				${(0,c.when)(this.subtitle,()=>s.html`<p class="text-sm opacity-70 mb-2">${this.subtitle}</p>`)}
				${(0,l.choose)(this.mode,[[`prompt`,()=>s.html`
								${(0,c.when)(this.label,()=>s.html`<label class="block text-sm mb-1">${this.label}</label>`)}
								<input
									type=${this.inputType}
									.value=${this.defaultValue}
									placeholder=${this.placeholder??s.nothing}
									pattern=${this.pattern??s.nothing}
									?required=${this.required}
									class="w-full px-3 py-2 rounded-md border border-outline-variant text-base mb-2"
								/>
								${(0,c.when)(this.message,()=>s.html`<p class="text-sm mb-3">${this.message}</p>`)}
							`]],()=>s.html`${(0,c.when)(this.message,()=>s.html`<p class="text-sm mb-4">${this.message}</p>`)}`)}

				<div class="flex justify-end gap-2 mt-4">
					<button
						type="button"
						@click=${this.handleCancel}
						class="px-4 py-2 rounded-md border border-outline-variant bg-transparent cursor-pointer"
					>
						${this.cancelText}
					</button>
					<button
						type="submit"
						class="cta-confirm px-4 py-2 rounded-md border-0 bg-primary text-on-primary cursor-pointer font-medium"
					>
						${this.confirmText}
					</button>
				</div>
			</form>
		`}};t.t([(0,o.property)({type:String})],h.prototype,`heading`,void 0),t.t([(0,o.property)({type:String})],h.prototype,`subtitle`,void 0),t.t([(0,o.property)({type:String})],h.prototype,`message`,void 0),t.t([(0,o.property)({type:String,attribute:`confirm-text`})],h.prototype,`confirmText`,void 0),t.t([(0,o.property)({type:String,attribute:`cancel-text`})],h.prototype,`cancelText`,void 0),t.t([(0,o.property)({type:String,reflect:!0})],h.prototype,`variant`,void 0),t.t([(0,o.property)({type:String})],h.prototype,`mode`,void 0),t.t([(0,o.property)({type:String})],h.prototype,`label`,void 0),t.t([(0,o.property)({type:String,attribute:`default-value`})],h.prototype,`defaultValue`,void 0),t.t([(0,o.property)({type:String})],h.prototype,`placeholder`,void 0),t.t([(0,o.property)({type:String,attribute:`input-type`})],h.prototype,`inputType`,void 0),t.t([(0,o.property)({type:String})],h.prototype,`pattern`,void 0),t.t([(0,o.property)({type:Boolean})],h.prototype,`required`,void 0),t.t([(0,o.query)(`input`)],h.prototype,`_input`,void 0),h=t.t([(0,o.customElement)(`schmancy-overlay-prompt-body`)],h);var g=new a.BehaviorSubject([]),_=g.asObservable(),v=!1,y=``,b=``;g.pipe((0,a.map)(e=>e.length>0),(0,a.distinctUntilChanged)()).subscribe(e=>{typeof document<`u`&&(e&&!v?(y=document.documentElement.style.overflow,b=document.documentElement.style.getPropertyValue(`scrollbar-gutter`),document.documentElement.style.overflow=`hidden`,document.documentElement.style.setProperty(`scrollbar-gutter`,`stable`),v=!0):!e&&v&&(document.documentElement.style.overflow=y,b?document.documentElement.style.setProperty(`scrollbar-gutter`,b):document.documentElement.style.removeProperty(`scrollbar-gutter`),y=``,b=``,v=!1))});var x=new Set,S=new Set;function C(e,t){x.add(e),x.size===1&&function(e){let t=e.parentElement??document.body;for(let n=0;n<t.children.length;n++){let r=t.children[n];r!==e&&r instanceof HTMLElement&&!r.inert&&(r.inert=!0,S.add(r))}}(t)}function w(e){x.delete(e),x.size===0&&function(){for(let e of S)e.inert=!1;S.clear()}()}var T=_;function E(e,t={}){return(0,a.defer)(()=>new a.Observable(n=>{let r=null,i=null,o=!1,s=!1,c=new a.Subject;return(async()=>{try{r=document.createElement(`schmancy-overlay`),(document.body??document.documentElement).appendChild(r),await r.updateComplete,await r.open(e,t);let l=`ov_`+Math.random().toString(36).slice(2,10)+Date.now().toString(36);i={id:l,element:r,layout:r.layout},function(e){g.next([...g.value,e])}(i),r.modal&&r.parentElement&&C(l,r);let u=t.historyStrategy??`push`;u===`push`?(history.pushState({i:l},``,location.href),o=!0):u===`replace`&&history.replaceState({i:l},``,location.href),o&&(0,a.fromEvent)(window,`popstate`).pipe((0,a.take)(1),(0,a.takeUntil)(c)).subscribe(()=>{s=!0,r?.close(`popstate`)}),r.closed$.pipe((0,a.take)(1),(0,a.takeUntil)(c)).subscribe(({result:e})=>{s=!0,n.next(e),n.complete()})}catch(e){n.error(e)}})(),()=>{c.next(),c.complete(),r&&!s&&r.close(`programmatic`),i&&(w(i.id),function(e){let t=g.value,n=t.filter(t=>t.id!==e);n.length!==t.length&&g.next(n)}(i.id)),o&&!s&&(history.state?.i===i?.id&&history.back(),o=!1),queueMicrotask(()=>{r?.remove(),r=null})}}))}Object.defineProperty(exports,`SchmancyOverlay`,{enumerable:!0,get:function(){return f}}),Object.defineProperty(exports,`SchmancyOverlayPromptBody`,{enumerable:!0,get:function(){return h}}),exports.confirm=async function(e={}){let{SchmancyOverlayPromptBody:t}=await Promise.resolve().then(()=>m);return!0===await(0,a.firstValueFrom)(E(t,{anchor:e.anchor,signal:e.signal,props:{mode:`confirm`,heading:e.title,subtitle:e.subtitle,message:e.message,confirmText:e.confirmText??`Confirm`,cancelText:e.cancelText??`Cancel`,variant:e.variant??`default`}}).pipe((0,a.defaultIfEmpty)(!1)))},exports.dismissAll=function(){let e=[...g.value];for(let t=e.length-1;t>=0;t--)e[t].element.close(`programmatic`);g.value.length>0&&g.next([])},exports.lazy=r.t,exports.openOverlays$=T,exports.overlayEvents=function(e,t){return function(e){let t=e.toLowerCase();return g.pipe((0,a.map)(e=>{let n=[];for(let r of e){let e=r.element.querySelector(t);e&&n.push(e)}return n}),(0,a.distinctUntilChanged)((e,t)=>e.length===t.length&&e.every((e,n)=>e===t[n])))}(e).pipe((0,a.distinctUntilChanged)((e,t)=>e.length===t.length&&e.every((e,n)=>e===t[n])),(0,a.switchMap)(e=>e.length===0?a.EMPTY:(0,a.merge)(...e.map(e=>(0,a.fromEvent)(e,t)))),(0,a.map)(e=>e))},exports.prompt=async function(e={}){let{SchmancyOverlayPromptBody:t}=await Promise.resolve().then(()=>m),n=await(0,a.firstValueFrom)(E(t,{anchor:e.anchor,signal:e.signal,props:{mode:`prompt`,heading:e.title,subtitle:e.subtitle,message:e.message,label:e.label,defaultValue:e.defaultValue??``,placeholder:e.placeholder,inputType:e.inputType??`text`,pattern:e.pattern,required:e.required??!1,confirmText:e.confirmText??`OK`,cancelText:e.cancelText??`Cancel`}}).pipe((0,a.defaultIfEmpty)(null)));return typeof n==`string`?n:null},exports.show=E;