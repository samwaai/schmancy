Object.defineProperty(exports,Symbol.toStringTag,{value:`Module`}),require(`./chunk-BCfY8kxB.cjs`);const e=require(`./decorate-F9CuyeHg.cjs`),t=require(`./litElement.mixin-DeT3kAOS.cjs`);require(`./mixins.cjs`);const n=require(`./theme.service-ETiKUwVy.cjs`),r=require(`./layout-PZCF3kwl.cjs`);require(`./scroll-hWt0b1gK.cjs`);let i=require(`rxjs`),a=require(`rxjs/operators`),o=require(`lit/decorators.js`),s=require(`lit`);var c=class extends t.t(s.css`
	:host {
		display: block;
		box-sizing: border-box;
		touch-action: pan-x pan-y;
		overscroll-behavior: none;
		-webkit-tap-highlight-color: transparent;
	}
`){constructor(...e){super(...e),this.rows=`auto_1fr_auto`,this.showScrollbar=!1,this.noSelect=!1,this.heightDisconnecting$=new i.Subject}calculateHeight(){let e=window.visualViewport?.height??window.innerHeight,t=this.getBoundingClientRect().top;return Math.max(0,e-t)}applyHeight(e,t){this.style.height=`${e}px`,this.style.paddingBottom=`${t}px`}setupHeightStream(){let e=(0,i.fromEvent)(window,`resize`,{passive:!0}),t=(0,i.merge)(e,window.visualViewport?(0,i.merge)((0,i.fromEvent)(window.visualViewport,`resize`,{passive:!0}),(0,i.fromEvent)(window.visualViewport,`scroll`,{passive:!0})):e,(0,i.fromEvent)(window,`orientationchange`),(0,i.fromEvent)(document,`focusout`,{passive:!0}).pipe((0,a.switchMap)(()=>(0,i.timer)(100)))).pipe((0,a.debounceTime)(16));(0,i.combineLatest)([(0,i.merge)(this.parentElement?r.t(this.parentElement):i.EMPTY,t).pipe((0,a.startWith)(null)),n.n.bottomOffset$,n.n.fullscreen$]).pipe((0,a.map)(([,e,t])=>({height:this.calculateHeight(),padding:t?0:e})),(0,a.distinctUntilChanged)((e,t)=>e.height===t.height&&e.padding===t.padding),(0,a.tap)(({height:e,padding:t})=>this.applyHeight(e,t)),(0,a.takeUntil)(this.heightDisconnecting$)).subscribe()}connectedCallback(){super.connectedCallback(),this.querySelectorAll(`:scope > header`).forEach(e=>e.setAttribute(`slot`,`header`)),this.querySelectorAll(`:scope > footer`).forEach(e=>e.setAttribute(`slot`,`footer`)),this.setupHeightStream()}disconnectedCallback(){super.disconnectedCallback(),this.heightDisconnecting$.next()}render(){return s.html`
			<section
				class=${this.classMap({"grid overflow-hidden h-full":!0,"select-none":this.noSelect})}
				style="grid-template-rows: ${this.rows.replace(/_/g,` `)}"
			>
				<slot name="header"></slot>
				<schmancy-scroll ?hide=${!this.showScrollbar}><slot></slot></schmancy-scroll>
				<schmancy-scroll ?hide=${!this.showScrollbar}>
					<slot name="footer"></slot>
				</schmancy-scroll>
			</section>
		`}};e.t([(0,o.property)({type:String})],c.prototype,`rows`,void 0),e.t([(0,o.property)({type:Boolean,attribute:`show-scrollbar`})],c.prototype,`showScrollbar`,void 0),e.t([(0,o.property)({type:Boolean,attribute:`no-select`})],c.prototype,`noSelect`,void 0),c=e.t([(0,o.customElement)(`schmancy-page`)],c),Object.defineProperty(exports,`SchmancyPage`,{enumerable:!0,get:function(){return c}});