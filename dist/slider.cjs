Object.defineProperty(exports,Symbol.toStringTag,{value:`Module`}),require(`./chunk-CncqDLb2.cjs`);const e=require(`./decorate-F9CuyeHg.cjs`),t=require(`./litElement.mixin-lYlKxxjR.cjs`);require(`./mixins.cjs`);let n=require(`rxjs`),r=require(`rxjs/operators`),i=require(`lit/decorators.js`),a=require(`lit`),o=require(`lit/directives/cache.js`);var s=class extends t.t(a.css`
	:host {
		display: block;
		scroll-snap-align: center; /* If your slider uses scroll-snap */
	}

	.slide {
		display: block;
		width: 100%;
		height: auto;
		object-fit: var(--object-fit, cover);
	}
`){constructor(...e){super(...e),this.type=`content`,this.src=``,this.alt=``,this.controls=!0,this.autoplay=!1,this.loop=!1,this.muted=!1,this.fit=`cover`}render(){return a.html` <div style="--object-fit: ${this.fit}">${(0,o.cache)(this.renderSlide())}</div> `}renderSlide(){switch(this.type){case`image`:return a.html` <img class="slide" src="${this.src}" alt="${this.alt}" loading="lazy" /> `;case`video`:return a.html`
					<video
						class="slide"
						src="${this.src}"
						?controls="${this.controls}"
						?autoplay="${this.autoplay}"
						?loop="${this.loop}"
						?muted="${this.muted}"
					>
						Your browser does not support HTML video.
					</video>
				`;default:return a.html`<slot></slot>`}}};e.t([(0,i.property)({type:String})],s.prototype,`type`,void 0),e.t([(0,i.property)({type:String})],s.prototype,`src`,void 0),e.t([(0,i.property)({type:String})],s.prototype,`alt`,void 0),e.t([(0,i.property)({type:Boolean})],s.prototype,`controls`,void 0),e.t([(0,i.property)({type:Boolean})],s.prototype,`autoplay`,void 0),e.t([(0,i.property)({type:Boolean})],s.prototype,`loop`,void 0),e.t([(0,i.property)({type:Boolean})],s.prototype,`muted`,void 0),e.t([(0,i.property)({type:String})],s.prototype,`fit`,void 0),s=e.t([(0,i.customElement)(`schmancy-slide`)],s);var c=class extends t.t(a.css`
	.slider {
		/* Lay out slides horizontally, one after another */
		display: flex;
		overflow-x: auto;

		/* Optional: scroll snapping */
		scroll-snap-type: x mandatory;

		/* Hide scrollbars */
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
	.slider::-webkit-scrollbar {
		display: none; /* Chrome, Safari, Opera */
	}

	/* 
      Ensure each slide takes up the full slider width.
      "schmancy-slide" is the child custom element.
    */
	::slotted(schmancy-slide) {
		flex: 0 0 100%;
		box-sizing: border-box;
	}
`){constructor(...e){super(...e),this.selectedIndex=0,this.showArrows=!0}firstUpdated(){this.slider.scrollLeft=0,(0,n.fromEvent)(this.slider,`scroll`).pipe((0,r.throttleTime)(100,void 0,{trailing:!0})).subscribe(()=>{this.updateSelectedIndexOnScroll()})}updateSelectedIndexOnScroll(){let e=this.defaultSlot?.assignedElements({flatten:!0})??[];if(!e.length)return;let t=this.selectedIndex,n=this.slider.scrollLeft+this.slider.clientWidth/2,r=0,i=1/0;e.forEach((e,t)=>{let a=e.offsetLeft+e.clientWidth/2,o=Math.abs(n-a);o<i&&(i=o,r=t)}),this.selectedIndex=r,this.selectedIndex!==t&&this.dispatchEvent(new CustomEvent(`slide-changed`,{detail:{index:this.selectedIndex}}))}goToSlide(e){let t=this.defaultSlot?.assignedElements({flatten:!0})??[];t[e]&&this.slider.scrollTo({left:t[e].offsetLeft,behavior:`smooth`})}onPrevClick(){this.goToSlide(this.selectedIndex-1)}onNextClick(){let e=this.defaultSlot?.assignedElements({flatten:!0})??[];this.selectedIndex<e.length-1&&this.goToSlide(this.selectedIndex+1)}render(){let e=this.defaultSlot?.assignedElements({flatten:!0})??[];return a.html`
			<div class="relative inset-0">
				<!-- The scrollable track -->
				<div class="slider" id="slider">
					<slot></slot>
				</div>

				<!-- Next/Prev Buttons (Optional) -->
				${this.showArrows?a.html`
							<schmancy-icon-button
								class="absolute left-2 top-1/2 -translate-y-1/2"
								@click=${this.onPrevClick}
								?disabled=${this.selectedIndex===0}
							>
								chevron_left
							</schmancy-icon-button>
							<schmancy-icon-button
								class="absolute right-2 top-1/2 -translate-y-1/2"
								@click=${this.onNextClick}
								?disabled=${this.selectedIndex===e.length-1}
							>
								chevron_right
							</schmancy-icon-button>
						`:null}

				<!-- Dots / indicators -->
				<div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex  space-x-2">
					${e.map((e,t)=>a.html`
							<schmancy-button .variant=${t===this.selectedIndex?`filled tonal`:`outlined`} class="rounded-full ">
							</schmancy-button>
						`)}
				</div>
			</div>
		`}};e.t([(0,i.state)()],c.prototype,`selectedIndex`,void 0),e.t([(0,i.property)({type:Boolean})],c.prototype,`showArrows`,void 0),e.t([(0,i.query)(`#slider`)],c.prototype,`slider`,void 0),e.t([(0,i.query)(`slot`)],c.prototype,`defaultSlot`,void 0),c=e.t([(0,i.customElement)(`schmancy-slider`)],c),Object.defineProperty(exports,`SchmancySlide`,{enumerable:!0,get:function(){return s}}),Object.defineProperty(exports,`SchmancySlider`,{enumerable:!0,get:function(){return c}});