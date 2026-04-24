require(`./chunk-CncqDLb2.cjs`);const e=require(`./decorate-F9CuyeHg.cjs`),t=require(`./litElement.mixin-CtQOmwq6.cjs`);let n=require(`rxjs`),r=require(`rxjs/operators`),i=require(`lit/directives/style-map.js`),a=require(`lit/decorators.js`),o=require(`lit`);var s=class extends t.t(o.css`
	:host {
		display: block;
		position: relative;
	}

	.splash-layer {
		position: fixed;
		inset: 0;
		z-index: 50;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(
			--schmancy-splash-background,
			var(--schmancy-sys-color-surface-containerLowest, #000)
		);
		transition: opacity var(--schmancy-splash-transition, 500ms) ease-out;
	}

	.content-layer {
		display: block;
		width: 100%;
		transition: opacity var(--schmancy-splash-transition, 500ms) ease-in-out;
	}
`){constructor(...e){super(...e),this.minDuration=1500,this.auto=!1,this.initiallyHidden=!1,this._visible=!0}connectedCallback(){super.connectedCallback(),this.initiallyHidden?this._visible=!1:(0,n.zip)(this.auto?(0,n.of)(null):(0,n.fromEvent)(this,`ready`).pipe((0,r.take)(1)),(0,n.timer)(this.minDuration)).pipe((0,r.take)(1),(0,r.tap)(()=>this._dismiss()),(0,r.takeUntil)(this.disconnecting)).subscribe()}ready(){this.dispatchEvent(new Event(`ready`))}show(){this._visible=!0}_dismiss(){this._visible=!1,this.dispatchEvent(new CustomEvent(`schmancy-splash-done`,{bubbles:!0,composed:!0}))}render(){return o.html`
			<div
				class="splash-layer"
				aria-hidden=${!this._visible}
				style=${(0,i.styleMap)({opacity:this._visible?`1`:`0`,pointerEvents:this._visible?`auto`:`none`})}
			>
				<slot name="splash"></slot>
			</div>
			<div
				class="content-layer"
				style=${(0,i.styleMap)({opacity:this._visible?`0`:`1`,pointerEvents:this._visible?`none`:`auto`})}
			>
				<slot></slot>
			</div>
		`}};e.t([(0,a.property)({type:Number,attribute:`min-duration`})],s.prototype,`minDuration`,void 0),e.t([(0,a.property)({type:Boolean})],s.prototype,`auto`,void 0),e.t([(0,a.property)({type:Boolean,attribute:`initially-hidden`})],s.prototype,`initiallyHidden`,void 0),e.t([(0,a.state)()],s.prototype,`_visible`,void 0),s=e.t([(0,a.customElement)(`schmancy-splash-screen`)],s);