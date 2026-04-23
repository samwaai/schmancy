Object.defineProperty(exports,Symbol.toStringTag,{value:`Module`});const e=require(`./chunk-BCfY8kxB.cjs`),t=require(`./decorate-F9CuyeHg.cjs`),n=require(`./litElement.mixin-Bx9Avv0M.cjs`);let r=require(`rxjs`),i=require(`rxjs/operators`),a=require(`lit/decorators.js`),o=require(`lit`),s=require(`lit/directives/when.js`),c=require(`jsqr`);c=e.n(c,1);var l=class extends n.t(o.css`
	:host {
		display: block;
		width: 100%;
		height: 100%;
		min-height: 300px;
	}
`){constructor(...e){super(...e),this.continuous=!0,this.hasPermission=!1,this.error=``,this.showSuccess=!1,this.stream=null,this.destroy$=new r.Subject,this.videoElement=null}connectedCallback(){super.connectedCallback(),this.startCamera()}async startCamera(){try{let e={video:{facingMode:`environment`,width:{ideal:1280},height:{ideal:720}}};this.stream=await navigator.mediaDevices.getUserMedia(e),this.hasPermission=!0,this.error=``,await this.updateComplete,this.videoElement=this.shadowRoot?.querySelector(`#video`),this.videoElement&&(this.videoElement.srcObject=this.stream,await this.videoElement.play(),this.startScanning())}catch{this.hasPermission=!1,this.error=`Camera access is required to scan QR codes. Please allow camera access and try again.`}}stopCamera(){this.destroy$.next(),this.stream&&=(this.stream.getTracks().forEach(e=>e.stop()),null),this.videoElement&&=(this.videoElement.srcObject=null,null),this.hasPermission=!1,this.error=``,this.showSuccess=!1}startScanning(){this.videoElement&&this.hasPermission&&(0,r.animationFrames)().pipe((0,i.map)(()=>this.scanFrame()),(0,i.filter)(e=>e!==null),(0,i.distinctUntilChanged)((e,t)=>e.data===t.data&&t.timestamp-e.timestamp<2e3),(0,i.throttleTime)(500),(0,i.takeUntil)(this.destroy$)).subscribe({next:e=>this.handleScanResult(e),error:e=>{}})}scanFrame(){if(!this.videoElement||this.videoElement.readyState!==HTMLMediaElement.HAVE_ENOUGH_DATA)return null;try{let e=document.createElement(`canvas`);e.width=this.videoElement.videoWidth,e.height=this.videoElement.videoHeight;let t=e.getContext(`2d`);if(!t)return null;t.drawImage(this.videoElement,0,0);let n=t.getImageData(0,0,e.width,e.height),r=(0,c.default)(n.data,n.width,n.height);if(r&&r.data)return{data:r.data,timestamp:Date.now()}}catch{}return null}handleScanResult(e){this.showSuccessFlash(),navigator.vibrate&&navigator.vibrate([100,50,100]),this.playSuccessSound(),this.dispatchEvent(new CustomEvent(`scan-result`,{detail:{data:e.data,timestamp:e.timestamp},bubbles:!0,composed:!0}))}showSuccessFlash(){this.showSuccess=!0,(0,r.timer)(500).pipe((0,i.takeUntil)(this.destroy$)).subscribe(()=>{this.showSuccess=!1})}playSuccessSound(){try{let e=new(window.AudioContext||window.webkitAudioContext),t=e.createOscillator(),n=e.createGain();t.connect(n),n.connect(e.destination),t.frequency.setValueAtTime(800,e.currentTime),t.frequency.setValueAtTime(1e3,e.currentTime+.1),n.gain.setValueAtTime(.3,e.currentTime),n.gain.exponentialRampToValueAtTime(.01,e.currentTime+.2),t.start(e.currentTime),t.stop(e.currentTime+.2)}catch{}}disconnectedCallback(){super.disconnectedCallback(),this.stopCamera(),this.destroy$.complete()}render(){return this.error?o.html`
				<div class="w-full h-full flex flex-col items-center justify-center bg-black text-white text-center p-5">
					<schmancy-icon size="64" class="mb-4">camera_alt</schmancy-icon>
					<schmancy-typography type="headline" token="md" class="mb-4">Camera Permission Required</schmancy-typography>
					<schmancy-typography type="body" token="md" class="mb-6 max-w-sm">${this.error}</schmancy-typography>
					<schmancy-button variant="filled" @click=${()=>window.location.reload()}>Retry</schmancy-button>
				</div>
			`:o.html`
			<div class="relative w-full h-full bg-black overflow-hidden rounded-xl">
				<!-- Video Stream -->
				<video id="video" class="absolute inset-0 w-full h-full object-cover" autoplay muted playsinline></video>

				<!-- Success Flash -->
				${(0,s.when)(this.showSuccess,()=>o.html`<div class="absolute inset-0 bg-green-400/30 pointer-events-none"></div>`)}

				<!-- Minimal corner brackets - Apple style -->
				<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] pointer-events-none animate-pulse">
					<!-- Top-left corner -->
					<div class="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-2xl"></div>
					<!-- Top-right corner -->
					<div class="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-2xl"></div>
					<!-- Bottom-left corner -->
					<div class="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-2xl"></div>
					<!-- Bottom-right corner -->
					<div class="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-2xl"></div>
				</div>
			</div>
		`}};t.t([(0,a.property)({type:Boolean})],l.prototype,`continuous`,void 0),t.t([(0,a.state)()],l.prototype,`hasPermission`,void 0),t.t([(0,a.state)()],l.prototype,`error`,void 0),t.t([(0,a.state)()],l.prototype,`showSuccess`,void 0),l=t.t([(0,a.customElement)(`schmancy-qr-scanner`)],l),Object.defineProperty(exports,`SchmancyQRScanner`,{enumerable:!0,get:function(){return l}});