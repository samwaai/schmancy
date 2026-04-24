Object.defineProperty(exports,Symbol.toStringTag,{value:`Module`}),require(`./chunk-CncqDLb2.cjs`);const e=require(`./tailwind.mixin-BHX99hgX.cjs`),t=require(`./decorate-F9CuyeHg.cjs`),n=require(`./audio-Dvr-RBzE.cjs`);let r=require(`rxjs`),i=require(`rxjs/operators`),a=require(`lit/decorators.js`),o=require(`lit`),s=require(`lit/directives/ref.js`);var c=class extends e.t(o.css`
	:host {
		display: block;
	}

	.banner {
		transform: translateY(-100%);
		opacity: 0;
		transition: transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 400ms ease-out;
	}

	.banner.visible {
		transform: translateY(0);
		opacity: 1;
	}

	.banner.exiting {
		transform: translateY(-100%);
		opacity: 0;
		transition: transform 300ms ease-out, opacity 300ms ease-out;
	}

	@keyframes icon-pulse {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.2); }
	}

	@keyframes icon-bounce {
		0%, 100% { transform: translateY(0); }
		25% { transform: translateY(-6px); }
		50% { transform: translateY(0); }
		75% { transform: translateY(-3px); }
	}

	.icon-pulse {
		animation: icon-pulse 1s ease-in-out infinite;
	}

	.icon-bounce {
		animation: icon-bounce 600ms ease-out;
	}
`){constructor(...e){super(...e),this.bannerRef=(0,s.createRef)(),this.surfaceRef=(0,s.createRef)(),this.iconRef=(0,s.createRef)(),this.messageRef=(0,s.createRef)()}connectedCallback(){super.connectedCallback();let e=(0,r.merge)((0,r.fromEvent)(window,`online`).pipe((0,i.map)(()=>!0)),(0,r.fromEvent)(window,`offline`).pipe((0,i.map)(()=>!1))).pipe((0,i.distinctUntilChanged)());e.pipe((0,i.tap)(e=>this.updateBanner(e)),(0,i.takeUntil)(this.disconnecting)).subscribe(),e.pipe((0,i.skip)(1),(0,i.tap)(e=>n.t.play(e?`celebrated`:`disappointed`)),(0,i.takeUntil)(this.disconnecting)).subscribe()}updateBanner(e){let t=this.bannerRef.value,n=this.surfaceRef.value,a=this.iconRef.value,o=this.messageRef.value;t&&n&&a&&o&&(e?(n.setAttribute(`type`,`primary`),a.textContent=`🎉`,a.className=`text-2xl icon-bounce`,o.textContent=`Back online`,t.classList.remove(`exiting`),t.classList.add(`visible`),(0,r.timer)(1500).pipe((0,i.tap)(()=>{t.classList.add(`exiting`),(0,r.timer)(300).pipe((0,i.tap)(()=>t.classList.remove(`visible`,`exiting`)),(0,i.takeUntil)(this.disconnecting)).subscribe()}),(0,i.takeUntil)(this.disconnecting)).subscribe()):(n.setAttribute(`type`,`error`),a.textContent=`🙀`,a.className=`text-2xl icon-pulse`,o.textContent=`You're offline`,t.classList.remove(`exiting`),t.classList.add(`visible`)))}render(){return o.html`
			<div ${(0,s.ref)(this.bannerRef)} class="banner fixed top-0 inset-x-0 z-50 p-2 pointer-events-none">
				<schmancy-surface
					${(0,s.ref)(this.surfaceRef)}
					type="error"
					rounded="all"
					elevation="3"
					class="mx-auto max-w-sm shadow-lg pointer-events-auto"
				>
					<div class="flex items-center gap-3 px-4 py-3">
						<span ${(0,s.ref)(this.iconRef)} class="text-2xl">🙀</span>
						<schmancy-typography type="body" token="md">
							<span ${(0,s.ref)(this.messageRef)}>You're offline</span>
						</schmancy-typography>
					</div>
				</schmancy-surface>
			</div>
		`}};c=t.t([(0,a.customElement)(`schmancy-connectivity-status`)],c),Object.defineProperty(exports,`SchmancyConnectivityStatus`,{enumerable:!0,get:function(){return c}});