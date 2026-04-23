Object.defineProperty(exports,Symbol.toStringTag,{value:`Module`}),require(`./chunk-BCfY8kxB.cjs`);const e=require(`./tailwind.mixin-ZzkXQTFA.cjs`),t=require(`./decorate-F9CuyeHg.cjs`);let n=require(`rxjs`),r=require(`rxjs/operators`),i=require(`lit/decorators.js`),a=require(`lit`),o=require(`lit/directives/ref.js`);var s=class extends e.t(a.css`
	:host {
		display: block;
		font-family: inherit;
		hyphens: none;
	}

	/* Text alignment */
	:host([align='center']) {
		text-align: center;
	}

	:host([align='left']) {
		text-align: start;
	}

	:host([align='right']) {
		text-align: right;
	}

	:host([align='justify']) {
		text-align: justify;
	}

	/* Font weight */
	:host([weight='bold']) {
		font-weight: 700;
	}

	:host([weight='medium']) {
		font-weight: 500;
	}

	:host([weight='normal']) {
		font-weight: 400;
	}

	/* Text transform */
	:host([transform='uppercase']) {
		text-transform: uppercase;
	}

	:host([transform='lowercase']) {
		text-transform: lowercase;
	}

	:host([transform='capitalize']) {
		text-transform: capitalize;
	}

	:host([transform='normal']) {
		text-transform: none;
	}

	/* Type-based weight defaults (when using Tailwind classes without token) */
	:host([type='display']),
	:host([type='headline']),
	:host([type='body']) {
		font-weight: 400;
	}

	:host([type='label']),
	:host([type='subtitle']),
	:host([type='title']) {
		font-weight: 500;
	}

	/* Display typography variants - Material Design 3 + Extended */
	:host([type='display'][token='xl']) {
		font-size: 72px;
		line-height: 80px;
		font-weight: 400;
	}

	:host([type='display'][token='lg']) {
		font-size: 57px;
		line-height: 64px;
		font-weight: 400;
	}

	:host([type='display'][token='md']) {
		font-size: 45px;
		line-height: 52px;
		font-weight: 400;
	}

	:host([type='display'][token='sm']) {
		font-size: 36px;
		line-height: 44px;
		font-weight: 400;
	}

	:host([type='display'][token='xs']) {
		font-size: 28px;
		line-height: 36px;
		font-weight: 400;
	}

	/* Headline typography variants - Material Design 3 + Extended */
	:host([type='headline'][token='xl']) {
		font-size: 36px;
		line-height: 44px;
		font-weight: 400;
	}

	:host([type='headline'][token='lg']) {
		font-size: 32px;
		line-height: 40px;
		font-weight: 400;
	}

	:host([type='headline'][token='md']) {
		font-size: 28px;
		line-height: 36px;
		font-weight: 400;
	}

	:host([type='headline'][token='sm']) {
		font-size: 24px;
		line-height: 32px;
		font-weight: 400;
	}

	:host([type='headline'][token='xs']) {
		font-size: 20px;
		line-height: 28px;
		font-weight: 400;
	}

	/* Title typography variants - Material Design 3 + Extended */
	:host([type='title'][token='xl']) {
		font-size: 24px;
		line-height: 32px;
		font-weight: 400;
	}

	:host([type='title'][token='lg']) {
		font-size: 22px;
		line-height: 28px;
		font-weight: 400;
	}

	:host([type='title'][token='md']) {
		font-size: 16px;
		line-height: 24px;
		font-weight: 500;
	}

	:host([type='title'][token='sm']) {
		font-size: 14px;
		line-height: 20px;
		font-weight: 500;
	}

	:host([type='title'][token='xs']) {
		font-size: 12px;
		line-height: 16px;
		font-weight: 500;
	}

	/* Subtitle typography variants - Extended from Material Design 3 */
	:host([type='subtitle'][token='xl']) {
		font-size: 20px;
		line-height: 28px;
		font-weight: 500;
	}

	:host([type='subtitle'][token='lg']) {
		font-size: 18px;
		line-height: 24px;
		font-weight: 500;
	}

	:host([type='subtitle'][token='md']) {
		font-size: 16px;
		line-height: 24px;
		font-weight: 500;
	}

	:host([type='subtitle'][token='sm']) {
		font-size: 14px;
		line-height: 20px;
		font-weight: 500;
	}

	:host([type='subtitle'][token='xs']) {
		font-size: 12px;
		line-height: 16px;
		font-weight: 500;
	}

	/* Body typography variants - Material Design 3 + Extended */
	:host([type='body'][token='xl']) {
		font-size: 18px;
		line-height: 28px;
		font-weight: 400;
	}

	:host([type='body'][token='lg']) {
		font-size: 16px;
		line-height: 24px;
		font-weight: 400;
	}

	:host([type='body'][token='md']) {
		font-size: 14px;
		line-height: 20px;
		font-weight: 400;
	}

	:host([type='body'][token='sm']) {
		font-size: 12px;
		line-height: 16px;
		font-weight: 400;
	}

	:host([type='body'][token='xs']) {
		font-size: 10px;
		line-height: 14px;
		font-weight: 400;
	}

	/* Label typography variants - Material Design 3 + Extended */
	:host([type='label'][token='xl']) {
		font-size: 16px;
		line-height: 22px;
		font-weight: 500;
	}

	:host([type='label'][token='lg']) {
		font-size: 14px;
		line-height: 20px;
		font-weight: 500;
	}

	:host([type='label'][token='md']) {
		font-size: 12px;
		line-height: 16px;
		font-weight: 500;
	}

	:host([type='label'][token='sm']) {
		font-size: 11px;
		line-height: 16px;
		font-weight: 500;
	}

	:host([type='label'][token='xs']) {
		font-size: 10px;
		line-height: 14px;
		font-weight: 500;
	}

	/* Note: Custom letter-spacing, font-size, and line-height should be applied via inline styles or Tailwind classes */

	:host([editable]) {
		cursor: text;
		border-radius: 4px;
		transition: background 150ms;
		min-height: 1em;
	}
	/* Editable div lives in shadow DOM so light DOM (Lit markers) is untouched */
	.edit {
		outline: none;
		min-height: 1em;
		font: inherit;
		color: inherit;
		letter-spacing: inherit;
		line-height: inherit;
	}
	.edit:empty::before {
		content: attr(data-placeholder);
		pointer-events: none;
		display: block;
		opacity: 0.35;
	}
`){constructor(...e){super(...e),this.type=`body`,this.token=`md`,this.editable=!1,this.value=``,this.placeholder=``,this._editRef=(0,o.createRef)()}static{this.shadowRootOptions={mode:`open`,delegatesFocus:!0}}selectAll(){let e=this._editRef.value;if(!e)return;e.focus();let t=window.getSelection();if(t&&e.textContent){let n=document.createRange();n.selectNodeContents(e),t.removeAllRanges(),t.addRange(n)}}connectedCallback(){super.connectedCallback(),(0,n.fromEvent)(this,`focusout`).pipe((0,r.filter)(()=>this.editable),(0,r.tap)(()=>{let e=this._editRef.value;if(!e)return;let t=e.innerText.trim();t!==this.value&&this.dispatchEvent(new CustomEvent(`change`,{detail:{value:t},bubbles:!0,composed:!0})),t||(e.textContent=``)}),(0,r.takeUntil)(this.disconnecting)).subscribe(),(0,n.fromEvent)(this,`input`).pipe((0,r.filter)(()=>this.editable),(0,r.tap)(()=>{let e=this._editRef.value;e&&!e.innerText.trim()&&(e.textContent=``)}),(0,r.takeUntil)(this.disconnecting)).subscribe(),(0,n.fromEvent)(this,`keydown`).pipe((0,r.filter)(()=>this.editable),(0,r.filter)(e=>e.key===`Enter`),(0,r.tap)(e=>{e.preventDefault(),(this._editRef.value??this).blur()}),(0,r.takeUntil)(this.disconnecting)).subscribe()}updated(e){if(super.updated(e),e.has(`maxLines`)&&(this.classList.remove(`line-clamp-1`,`line-clamp-2`,`line-clamp-3`,`line-clamp-4`,`line-clamp-5`,`line-clamp-6`),this.maxLines&&this.classList.add(`line-clamp-${this.maxLines}`)),(e.has(`value`)||e.has(`editable`))&&this.editable){let e=this._editRef.value;e&&document.activeElement!==e&&(this.value?e.innerText=this.value:e.textContent=``)}}render(){return this.editable?a.html`<div
				${(0,o.ref)(this._editRef)}
				class="edit"
				contenteditable="true"
				data-placeholder=${this.placeholder??``}
			></div>`:a.html`<slot></slot>`}};t.t([(0,i.property)({type:String,reflect:!0})],s.prototype,`type`,void 0),t.t([(0,i.property)({type:String,reflect:!0})],s.prototype,`token`,void 0),t.t([(0,i.property)({type:String,reflect:!0})],s.prototype,`align`,void 0),t.t([(0,i.property)({type:String,reflect:!0})],s.prototype,`weight`,void 0),t.t([(0,i.property)({type:String,reflect:!0})],s.prototype,`transform`,void 0),t.t([(0,i.property)({type:Number})],s.prototype,`maxLines`,void 0),t.t([(0,i.property)({type:Boolean,reflect:!0})],s.prototype,`editable`,void 0),t.t([(0,i.property)({type:String})],s.prototype,`value`,void 0),t.t([(0,i.property)({type:String})],s.prototype,`placeholder`,void 0),s=t.t([(0,i.customElement)(`schmancy-typography`)],s),Object.defineProperty(exports,`SchmancyTypography`,{enumerable:!0,get:function(){return s}});