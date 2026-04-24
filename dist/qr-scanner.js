import { t as e } from "./decorate-D_utPUsC.js";
import { t } from "./litElement.mixin-Mi8bar6B.js";
import { Subject as n, animationFrames as r, timer as i } from "rxjs";
import { distinctUntilChanged as a, filter as o, map as s, takeUntil as c, throttleTime as l } from "rxjs/operators";
import { customElement as u, property as d, state as f } from "lit/decorators.js";
import { css as p, html as m } from "lit";
import { when as h } from "lit/directives/when.js";
import g from "jsqr";
var _ = class extends t(p`
	:host {
		display: block;
		width: 100%;
		height: 100%;
		min-height: 300px;
	}
`) {
	constructor(...e) {
		super(...e), this.continuous = !0, this.hasPermission = !1, this.error = "", this.showSuccess = !1, this.stream = null, this.destroy$ = new n(), this.videoElement = null;
	}
	connectedCallback() {
		super.connectedCallback(), this.startCamera();
	}
	async startCamera() {
		try {
			let e = { video: {
				facingMode: "environment",
				width: { ideal: 1280 },
				height: { ideal: 720 }
			} };
			this.stream = await navigator.mediaDevices.getUserMedia(e), this.hasPermission = !0, this.error = "", await this.updateComplete, this.videoElement = this.shadowRoot?.querySelector("#video"), this.videoElement && (this.videoElement.srcObject = this.stream, await this.videoElement.play(), this.startScanning());
		} catch {
			this.hasPermission = !1, this.error = "Camera access is required to scan QR codes. Please allow camera access and try again.";
		}
	}
	stopCamera() {
		this.destroy$.next(), this.stream &&= (this.stream.getTracks().forEach((e) => e.stop()), null), this.videoElement &&= (this.videoElement.srcObject = null, null), this.hasPermission = !1, this.error = "", this.showSuccess = !1;
	}
	startScanning() {
		this.videoElement && this.hasPermission && r().pipe(s(() => this.scanFrame()), o((e) => e !== null), a((e, t) => e.data === t.data && t.timestamp - e.timestamp < 2e3), l(500), c(this.destroy$)).subscribe({
			next: (e) => this.handleScanResult(e),
			error: (e) => {}
		});
	}
	scanFrame() {
		if (!this.videoElement || this.videoElement.readyState !== HTMLMediaElement.HAVE_ENOUGH_DATA) return null;
		try {
			let e = document.createElement("canvas");
			e.width = this.videoElement.videoWidth, e.height = this.videoElement.videoHeight;
			let t = e.getContext("2d");
			if (!t) return null;
			t.drawImage(this.videoElement, 0, 0);
			let n = t.getImageData(0, 0, e.width, e.height), r = g(n.data, n.width, n.height);
			if (r && r.data) return {
				data: r.data,
				timestamp: Date.now()
			};
		} catch {}
		return null;
	}
	handleScanResult(e) {
		this.showSuccessFlash(), navigator.vibrate && navigator.vibrate([
			100,
			50,
			100
		]), this.playSuccessSound(), this.dispatchEvent(new CustomEvent("scan-result", {
			detail: {
				data: e.data,
				timestamp: e.timestamp
			},
			bubbles: !0,
			composed: !0
		}));
	}
	showSuccessFlash() {
		this.showSuccess = !0, i(500).pipe(c(this.destroy$)).subscribe(() => {
			this.showSuccess = !1;
		});
	}
	playSuccessSound() {
		try {
			let e = new (window.AudioContext || window.webkitAudioContext)(), t = e.createOscillator(), n = e.createGain();
			t.connect(n), n.connect(e.destination), t.frequency.setValueAtTime(800, e.currentTime), t.frequency.setValueAtTime(1e3, e.currentTime + .1), n.gain.setValueAtTime(.3, e.currentTime), n.gain.exponentialRampToValueAtTime(.01, e.currentTime + .2), t.start(e.currentTime), t.stop(e.currentTime + .2);
		} catch {}
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.stopCamera(), this.destroy$.complete();
	}
	render() {
		return this.error ? m`
				<div class="w-full h-full flex flex-col items-center justify-center bg-black text-white text-center p-5">
					<schmancy-icon size="64" class="mb-4">camera_alt</schmancy-icon>
					<schmancy-typography type="headline" token="md" class="mb-4">Camera Permission Required</schmancy-typography>
					<schmancy-typography type="body" token="md" class="mb-6 max-w-sm">${this.error}</schmancy-typography>
					<schmancy-button variant="filled" @click=${() => window.location.reload()}>Retry</schmancy-button>
				</div>
			` : m`
			<div class="relative w-full h-full bg-black overflow-hidden rounded-xl">
				<!-- Video Stream -->
				<video id="video" class="absolute inset-0 w-full h-full object-cover" autoplay muted playsinline></video>

				<!-- Success Flash -->
				${h(this.showSuccess, () => m`<div class="absolute inset-0 bg-green-400/30 pointer-events-none"></div>`)}

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
		`;
	}
};
e([d({ type: Boolean })], _.prototype, "continuous", void 0), e([f()], _.prototype, "hasPermission", void 0), e([f()], _.prototype, "error", void 0), e([f()], _.prototype, "showSuccess", void 0), _ = e([u("schmancy-qr-scanner")], _);
export { _ as SchmancyQRScanner };
