require(`./chunk-BCfY8kxB.cjs`);const e=require(`./tailwind.mixin-BfdVIGgD.cjs`),t=require(`./decorate-F9CuyeHg.cjs`);require(`./mixins.cjs`);let n=require(`rxjs`),r=require(`lit/decorators.js`),i=require(`lit`);var a=class extends e.t(i.css`
	:host {
		/* Flexible sizing for different layout contexts */
		width: 100%;
		min-height: 0; /* Allow flex shrinking */
		flex: 1; /* Grow in flex containers */
		box-sizing: border-box; /* Ensures proper sizing */
		display: block;
		position: relative;
		scroll-behavior: smooth;
		overscroll-behavior-x: contain;
		overscroll-behavior-y: auto;
	}
	/* Fallback for non-flex contexts */
	:host(.explicit-height) {
		height: 100%;
		flex: none;
	}
	:host([hide]) {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
	:host([hide])::-webkit-scrollbar {
		display: none; /* Chrome, Safari, and Opera */
	}
`){constructor(...e){super(...e),this.hide=!1,this.direction=`both`,this.debounce=10}get scroller(){return this}scrollTo(e,t){typeof e==`number`?super.scrollTo({top:e,behavior:t?`smooth`:`auto`}):e?super.scrollTo(e):super.scrollTo({top:0,left:0,behavior:`auto`})}scrollToLeft(e,t=`auto`){super.scrollTo({left:e,behavior:t})}connectedCallback(){super.connectedCallback(),this.updateScrollingStyles(),this.updateLayoutContext(),this.setAttribute(`part`,`scroller`)}updateScrollingStyles(){this.direction===`horizontal`?(this.style.setProperty(`overflow-y`,`hidden`),this.style.setProperty(`overflow-x`,`auto`)):this.direction===`vertical`?(this.style.setProperty(`overflow-y`,`auto`),this.style.setProperty(`overflow-x`,`hidden`)):(this.style.setProperty(`overflow-y`,`auto`),this.style.setProperty(`overflow-x`,`auto`))}updateLayoutContext(){requestAnimationFrame(()=>{let e=this.parentElement;if(e){let t=getComputedStyle(e);t.display===`flex`||t.display===`inline-flex`?this.classList.remove(`explicit-height`):this.classList.add(`explicit-height`)}else this.classList.add(`explicit-height`)})}updated(e){super.updated(e),e.has(`direction`)&&this.updateScrollingStyles(),this.updateLayoutContext()}firstUpdated(){(0,n.fromEvent)(this.scroller,`scroll`,{passive:!0}).pipe((0,n.debounceTime)(this.debounce),(0,n.takeUntil)(this.disconnecting)).subscribe(e=>{let t=this.scroller.scrollTop,n=this.scroller.scrollHeight,r=this.scroller.clientHeight,i=this.scroller.scrollLeft,a=this.scroller.scrollWidth,o=this.scroller.clientWidth;this.dispatchEvent(new CustomEvent(`scroll`,{detail:{scrollTop:t,scrollHeight:n,clientHeight:r,e,scrollLeft:i,scrollWidth:a,clientWidth:o},bubbles:!0,composed:!0}))}),(0,n.fromEvent)(window,`@schmancy:scrollTo`).pipe((0,n.filter)(e=>this.name!==void 0&&e.detail.name===this.name),(0,n.takeUntil)(this.disconnecting)).subscribe(e=>{if(e.detail.action===`scrollTo`&&typeof e.detail.top==`number`){let t={behavior:`smooth`,top:e.detail.top};typeof e.detail.left==`number`&&(t.left=e.detail.left),this.scrollTo(t)}})}render(){return i.html`<slot></slot>`}};t.t([(0,r.property)({type:Boolean,reflect:!0})],a.prototype,`hide`,void 0),t.t([(0,r.property)({type:String,reflect:!0})],a.prototype,`name`,void 0),t.t([(0,r.property)({type:String,reflect:!0})],a.prototype,`direction`,void 0),t.t([(0,r.property)({type:Number})],a.prototype,`debounce`,void 0),a=t.t([(0,r.customElement)(`schmancy-scroll`)],a),Object.defineProperty(exports,`t`,{enumerable:!0,get:function(){return a}});