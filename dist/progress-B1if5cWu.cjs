require(`./chunk-BCfY8kxB.cjs`);const e=require(`./decorate-F9CuyeHg.cjs`),t=require(`./litElement.mixin-Bx9Avv0M.cjs`);let n=require(`lit/directives/class-map.js`),r=require(`lit/directives/style-map.js`),i=require(`lit/decorators.js`),a=require(`lit`);var o=class extends t.t(a.css`
  :host {
    display: block;
  }

  /* Blackbird-style indeterminate animation with organic easing */
  @keyframes indeterminate {
    0% {
      left: -30%;
      width: 20%;
      opacity: 0.6;
    }
    25% {
      width: 35%;
      opacity: 1;
    }
    50% {
      left: 40%;
      width: 30%;
    }
    75% {
      width: 25%;
      opacity: 0.9;
    }
    100% {
      left: 100%;
      width: 20%;
      opacity: 0.6;
    }
  }

  .indeterminate-animation {
    animation: indeterminate 1.8s cubic-bezier(0.34, 1.2, 0.64, 1) infinite;
  }
`){constructor(...e){super(...e),this.value=0,this.max=100,this.indeterminate=!1,this.size=`md`,this.color=`primary`,this.glass=!1}get percentage(){return this.indeterminate?0:Math.min(100,Math.max(0,this.value/this.max*100))}render(){let e={"w-full":!0,relative:!0,"overflow-hidden":!0,"rounded-full":!0,"h-px":this.size===`xs`,"h-0.5":this.size===`sm`,"h-1":this.size===`md`,"h-2":this.size===`lg`,"backdrop-blur-xl":this.glass,"backdrop-saturate-150":this.glass,"bg-surface-container/20":this.glass&&!this.indeterminate,"bg-surface-container":!this.glass,"shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.1)]":this.glass,border:this.glass,"border-outline/20":this.glass},t={"h-full":!0,"rounded-full":!0,"transition-all":!0,"duration-300":!0,"ease-in-out":!0,relative:!0,"bg-primary-default":this.color===`primary`&&!this.glass,"bg-secondary-default":this.color===`secondary`&&!this.glass,"bg-tertiary-default":this.color===`tertiary`&&!this.glass,"bg-error-default":this.color===`error`&&!this.glass,"bg-success-default":this.color===`success`&&!this.glass,absolute:this.indeterminate,"indeterminate-animation":this.indeterminate},i=this.indeterminate?{}:{width:`${this.percentage}%`},o={"backdrop-blur-sm":this.glass,"shadow-[0_0_20px_rgba(0,0,0,0.1)]":this.glass,"bg-primary-default/70":this.glass&&this.color===`primary`,"bg-secondary-default/70":this.glass&&this.color===`secondary`,"bg-tertiary-default/70":this.glass&&this.color===`tertiary`,"bg-error-default/70":this.glass&&this.color===`error`,"bg-success-default/70":this.glass&&this.color===`success`};return a.html`
      <div class="${(0,n.classMap)(e)}">
        <div 
          class="${(0,n.classMap)({...t,...o})}"
          style="${(0,r.styleMap)(i)}"
          role="progressbar"
          aria-valuenow="${this.value}"
          aria-valuemin="0"
          aria-valuemax="${this.max}"
        >
          ${this.glass?a.html`
            <!-- Glass shine effect -->
            <div class="absolute inset-0 bg-linear-to-b from-surface-on/20 to-transparent rounded-full"></div>
          `:``}
        </div>
      </div>
    `}};e.t([(0,i.property)({type:Number,reflect:!0})],o.prototype,`value`,void 0),e.t([(0,i.property)({type:Number,reflect:!0})],o.prototype,`max`,void 0),e.t([(0,i.property)({type:Boolean,reflect:!0})],o.prototype,`indeterminate`,void 0),e.t([(0,i.property)({type:String,reflect:!0})],o.prototype,`size`,void 0),e.t([(0,i.property)({type:String,reflect:!0})],o.prototype,`color`,void 0),e.t([(0,i.property)({type:Boolean,reflect:!0})],o.prototype,`glass`,void 0),o=e.t([(0,i.customElement)(`schmancy-progress`)],o);