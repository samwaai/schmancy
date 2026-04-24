require(`./chunk-CncqDLb2.cjs`);const e=require(`./tailwind.mixin-Bh58QnlW.cjs`),t=require(`./decorate-F9CuyeHg.cjs`);require(`./mixins.cjs`);const n=require(`./context-CAYQh-mx.cjs`);let r=require(`rxjs`),i=require(`rxjs/operators`),a=require(`lit/decorators.js`),o=require(`lit`);var s,c=class extends e.t(o.css`
	:host {
		--schmancy-icon-size: 24px;
		--schmancy-icon-fill: 0;
		--schmancy-icon-weight: 400;
		--schmancy-icon-grade: 0;
		--schmancy-icon-opsz: 24;

		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: var(--schmancy-icon-size);
		height: var(--schmancy-icon-size);
		font-size: var(--schmancy-icon-size);
		color: inherit;
		transition: font-variation-settings 0.2s ease;
	}

	.material-symbols {
		font-family: var(--schmancy-icon-font, 'Material Symbols Outlined');
		font-weight: normal;
		font-style: normal;
		line-height: 1;
		letter-spacing: normal;
		text-transform: none;
		display: inline-block;
		white-space: nowrap;
		word-wrap: normal;
		direction: ltr;
		-webkit-font-smoothing: antialiased;
		-webkit-font-feature-settings: 'liga';
		font-feature-settings: 'liga';
		font-variation-settings:
			'FILL' var(--schmancy-icon-fill),
			'wght' var(--schmancy-icon-weight),
			'GRAD' var(--schmancy-icon-grade),
			'opsz' var(--schmancy-icon-opsz);
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* CSS-generated content is NOT translated by Google Translate */
	.material-symbols[data-icon]::before {
		content: attr(data-icon);
	}
`){static{s=this}constructor(...e){super(...e),this.fill=0,this.weight=400,this.grade=0,this.variant=`outlined`,this.size=`md`,this.fill$=new r.BehaviorSubject(this.fill),this.weight$=new r.BehaviorSubject(this.weight),this.grade$=new r.BehaviorSubject(this.grade),this.variant$=new r.BehaviorSubject(this.variant)}static{this.fontsLoaded=!1}static loadFonts(){if(s.fontsLoaded)return;let e=document.createElement(`link`);e.rel=`stylesheet`,e.href=`https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap`,document.head.appendChild(e),s.fontsLoaded=!0}static{this.tokenSizes={xxs:{size:`12px`,opsz:20},xs:{size:`16px`,opsz:20},sm:{size:`20px`,opsz:20},md:{size:`24px`,opsz:24},lg:{size:`32px`,opsz:40}}}static computeOpticalSize(e){let t=parseFloat(e);return isNaN(t)?24:Math.max(20,Math.min(48,Math.round(t)))}connectedCallback(){super.connectedCallback(),this._updateCapturedIcon(),this._observer=new MutationObserver(()=>this._updateCapturedIcon()),this._observer.observe(this,{childList:!0,characterData:!0,subtree:!0}),s.loadFonts(),this.setAttribute(`translate`,`no`),this.classList.add(`notranslate`),this.hasAttribute(`aria-label`)||this.hasAttribute(`aria-labelledby`)||this.hasAttribute(`aria-hidden`)||this.hasAttribute(`role`)||this.setAttribute(`aria-hidden`,`true`),(0,r.combineLatest)([this.fill$,this.weight$,this.grade$,this.variant$]).pipe((0,i.tap)(([e,t,n,r])=>{this.style.setProperty(`--schmancy-icon-fill`,String(e)),this.style.setProperty(`--schmancy-icon-weight`,String(t)),this.style.setProperty(`--schmancy-icon-grade`,String(n));let i={outlined:`Material Symbols Outlined`,rounded:`Material Symbols Rounded`,sharp:`Material Symbols Sharp`}[r]||`Material Symbols Outlined`;this.style.setProperty(`--schmancy-icon-font`,i)}),(0,r.takeUntil)(this.disconnecting)).subscribe()}_updateCapturedIcon(){if(!this.icon){let e=this.textContent?.trim();e&&e!==this._capturedIcon&&(this._capturedIcon=e)}}updated(e){super.updated(e),e.has(`fill`)&&this.fill$.next(this.fill),e.has(`weight`)&&this.weight$.next(this.weight),e.has(`grade`)&&this.grade$.next(this.grade),e.has(`variant`)&&this.variant$.next(this.variant)}render(){let e={outlined:`Material Symbols Outlined`,rounded:`Material Symbols Rounded`,sharp:`Material Symbols Sharp`}[this.variant]||`Material Symbols Outlined`,t=this._buttonSize??this.size,n=s.tokenSizes[t],r=!n&&/^\d+(\.\d+)?$/.test(t),i=n?.size||(r?`${t}px`:t),a=n?.opsz||s.computeOpticalSize(i);this.style.setProperty(`--schmancy-icon-size`,i),this.style.setProperty(`--schmancy-icon-opsz`,String(a));let c={"--schmancy-icon-fill":this.fill,"--schmancy-icon-weight":this.weight,"--schmancy-icon-grade":this.grade,"--schmancy-icon-font":e};return o.html`
			<span class="material-symbols notranslate" part="icon" translate="no" data-icon=${this.icon||this._capturedIcon||``} style=${this.styleMap(c)}></span>
			<slot style="display:none"></slot>
		`}};t.t([(0,a.property)({type:Number,reflect:!0})],c.prototype,`fill`,void 0),t.t([(0,a.property)({type:Number,reflect:!0})],c.prototype,`weight`,void 0),t.t([(0,a.property)({type:Number,reflect:!0})],c.prototype,`grade`,void 0),t.t([(0,a.property)({type:String,reflect:!0})],c.prototype,`variant`,void 0),t.t([(0,a.property)({type:String,reflect:!0})],c.prototype,`size`,void 0),t.t([e.a({context:n.t,subscribe:!0}),(0,a.state)()],c.prototype,`_buttonSize`,void 0),t.t([(0,a.property)({type:String})],c.prototype,`icon`,void 0),t.t([(0,a.state)()],c.prototype,`_capturedIcon`,void 0),c=s=t.t([(0,a.customElement)(`schmancy-icon`)],c);