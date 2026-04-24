Object.defineProperty(exports,Symbol.toStringTag,{value:`Module`}),require(`./chunk-BCfY8kxB.cjs`);const e=require(`./tailwind.mixin-BfdVIGgD.cjs`),t=require(`./decorate-F9CuyeHg.cjs`);require(`./mixins.cjs`);let n=require(`rxjs`),r=require(`lit/decorators.js`),i=require(`lit`);var a=class extends e.t(i.css`
	:host {
		display: block;
		position: relative;
		background-color: initial;
	}
	::slotted([slot='root']) {
		width: 100%;
		text-align: left;
	}
	::slotted([slot='root'] + *) {
		margin-top: 0.5rem;
	}
`){constructor(...e){super(...e),this.open=!1,this._a11yId=`schmancy-tree-${Math.random().toString(36).slice(2,10)}`,this._internals=(()=>{try{return this.attachInternals()}catch{return}})()}get _contentId(){return`${this._a11yId}-content`}updated(e){super.updated?.(e),e.has(`open`)&&(this.open?this._internals?.states.add(`open`):this._internals?.states.delete(`open`))}firstUpdated(){this.open||(this.defaultSlot.hidden=!0),(0,n.merge)((0,n.fromEvent)(this.toggler,`click`).pipe((0,n.takeUntil)(this.disconnecting),(0,n.tap)(e=>{e.preventDefault(),e.stopPropagation(),this.dispatchEvent(new CustomEvent(`toggle`,{bubbles:!1,composed:!0}))})),(0,n.fromEvent)(this.chevron,`click`)).pipe((0,n.switchMap)(()=>{let e=this.open?180:0,t=this.open?0:180,r=this.chevron.animate([{transform:`rotate(${e}deg)`},{transform:`rotate(${t}deg)`}],{duration:150,easing:`ease-in`,fill:`forwards`});this.open||(this.defaultSlot.hidden=!1);let i=+!!this.open,a=+!this.open,o=this.defaultSlot.animate([{opacity:i},{opacity:a}],{duration:150,easing:`ease-out`,fill:`forwards`});return o.onfinish=()=>{this.open?this.defaultSlot.hidden=!0:(this.defaultSlot.style.height=`auto`,this.defaultSlot.style.opacity=`1`)},(0,n.zip)((0,n.fromEvent)(r,`finish`),(0,n.fromEvent)(o,`finish`)).pipe((0,n.takeUntil)(this.disconnecting))}),(0,n.tap)(()=>{this.open=!this.open}),(0,n.takeUntil)(this.disconnecting)).subscribe()}render(){return i.html`
			<div class="flex content-center items-center justify-between">
				<!-- Root toggler content -->
				<slot id="toggler" name="root"></slot>

				<!-- The chevron or arrow symbol -->
				<!-- Stop propagation on the schmancy-button itself just to avoid double triggers -->
				<schmancy-button
					slot="trailing"
					id="chevron"
					aria-expanded=${this.open?`true`:`false`}
					aria-controls=${this._contentId}
					aria-label=${this.open?`Collapse`:`Expand`}
					@click=${e=>e.stopPropagation()}
				>
					⌅
				</schmancy-button>
			</div>

			<!-- The default slot: tree children -->
			<slot id=${this._contentId}></slot>
		`}};t.t([(0,r.property)({type:Boolean})],a.prototype,`open`,void 0),t.t([(0,r.query)(`#toggler`)],a.prototype,`toggler`,void 0),t.t([(0,r.query)(`slot:not([name="root"])`)],a.prototype,`defaultSlot`,void 0),t.t([(0,r.query)(`#chevron`)],a.prototype,`chevron`,void 0),a=t.t([(0,r.customElement)(`schmancy-tree`)],a),Object.defineProperty(exports,`SchmancyTree`,{enumerable:!0,get:function(){return a}});