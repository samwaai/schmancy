require(`./chunk-CncqDLb2.cjs`);const e=require(`./decorate-F9CuyeHg.cjs`),t=require(`./litElement.mixin-CtQOmwq6.cjs`);require(`./mixins.cjs`);let n=require(`lit/decorators.js`),r=require(`lit`);var i=class extends t.t(r.css`
	:host {
		display: block;
	}

	@keyframes grow-horizontal {
		from {
			transform: scaleX(0);
		}
		to {
			transform: scaleX(1);
		}
	}

	@keyframes grow-vertical {
		from {
			transform: scaleY(0);
		}
		to {
			transform: scaleY(1);
		}
	}

	/* Horizontal divider grow animations */
	.grow-start:not(.h-full) {
		animation: grow-horizontal 400ms ease-out;
		transform-origin: left;
	}

	.grow-end:not(.h-full) {
		animation: grow-horizontal 400ms ease-out;
		transform-origin: right;
	}

	.grow-both:not(.h-full) {
		animation: grow-horizontal 400ms ease-out;
		transform-origin: center;
	}

	/* Vertical divider grow animations */
	.grow-start.h-full {
		animation: grow-vertical 400ms ease-out;
		transform-origin: top;
	}

	.grow-end.h-full {
		animation: grow-vertical 400ms ease-out;
		transform-origin: bottom;
	}

	.grow-both.h-full {
		animation: grow-vertical 400ms ease-out;
		transform-origin: center;
	}
`){constructor(...e){super(...e),this.outline=`variant`,this.vertical=!1,this.grow=`start`}set orientation(e){this.vertical=e===`vertical`}get orientation(){return this.vertical?`vertical`:`horizontal`}render(){return r.html`<div
			class=${this.classMap({"w-full h-px":!this.vertical,"h-full w-px":this.vertical,"border-outlineVariant":this.outline===`variant`,"border-outline":this.outline===`default`,"border-t":!this.vertical,"border-l":this.vertical,[`grow-${this.grow}`]:!0})}
		></div>`}};e.t([(0,n.property)({type:String})],i.prototype,`outline`,void 0),e.t([(0,n.property)({type:Boolean})],i.prototype,`vertical`,void 0),e.t([(0,n.property)({type:String})],i.prototype,`grow`,void 0),e.t([(0,n.property)({reflect:!0,type:String})],i.prototype,`orientation`,null),i=e.t([(0,n.customElement)(`schmancy-divider`)],i);