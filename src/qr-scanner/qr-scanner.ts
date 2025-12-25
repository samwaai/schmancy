import { $LitElement } from '@mixins/litElement.mixin'
import jsQR from 'jsqr'
import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { animationFrames, Subject, timer } from 'rxjs'
import { distinctUntilChanged, filter, map, takeUntil, throttleTime } from 'rxjs/operators'

interface QRScanResult {
	data: string
	timestamp: number
}

@customElement('schmancy-qr-scanner')
export class SchmancyQRScanner extends $LitElement(css`
	:host {
		display: block;
		width: 100%;
		height: 100%;
		min-height: 300px;
	}
`) {
	@property({ type: Boolean }) continuous = true

	@state() private hasPermission = false
	@state() private error = ''
	@state() private showSuccess = false

	private stream: MediaStream | null = null
	private destroy$ = new Subject<void>()
	private videoElement: HTMLVideoElement | null = null

	connectedCallback() {
		super.connectedCallback()
		this.startCamera()
	}

	private async startCamera(): Promise<void> {
		try {
			const constraints: MediaStreamConstraints = {
				video: {
					facingMode: 'environment',
					width: { ideal: 1280 },
					height: { ideal: 720 },
				},
			}

			this.stream = await navigator.mediaDevices.getUserMedia(constraints)
			this.hasPermission = true
			this.error = ''

			await this.updateComplete

			this.videoElement = this.shadowRoot?.querySelector('#video') as HTMLVideoElement
			if (this.videoElement) {
				this.videoElement.srcObject = this.stream
				await this.videoElement.play()
				this.startScanning()
			}
		} catch (error) {
			console.error('Camera access denied:', error)
			this.hasPermission = false
			this.error = 'Camera access is required to scan QR codes. Please allow camera access and try again.'
		}
	}

	private stopCamera(): void {
		this.destroy$.next()

		if (this.stream) {
			this.stream.getTracks().forEach(track => track.stop())
			this.stream = null
		}

		if (this.videoElement) {
			this.videoElement.srcObject = null
			this.videoElement = null
		}

		this.hasPermission = false
		this.error = ''
		this.showSuccess = false
	}

	private startScanning(): void {
		if (!this.videoElement || !this.hasPermission) {
			return
		}

		animationFrames()
			.pipe(
				map(() => this.scanFrame()),
				filter((result): result is QRScanResult => result !== null),
				distinctUntilChanged((prev, curr) => {
					if (prev.data !== curr.data) return false
					return curr.timestamp - prev.timestamp < 2000
				}),
				throttleTime(500),
				takeUntil(this.destroy$),
			)
			.subscribe({
				next: result => this.handleScanResult(result),
				error: error => {
					console.error('Scanning error:', error)
				},
			})
	}

	private scanFrame(): QRScanResult | null {
		if (!this.videoElement || this.videoElement.readyState !== HTMLMediaElement.HAVE_ENOUGH_DATA) {
			return null
		}

		try {
			const canvas = document.createElement('canvas')
			canvas.width = this.videoElement.videoWidth
			canvas.height = this.videoElement.videoHeight

			const ctx = canvas.getContext('2d')
			if (!ctx) return null

			ctx.drawImage(this.videoElement, 0, 0)
			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

			const code = jsQR(imageData.data, imageData.width, imageData.height)

			if (code && code.data) {
				return {
					data: code.data,
					timestamp: Date.now(),
				}
			}
		} catch (error) {
			console.error('Frame scan error:', error)
		}

		return null
	}

	private handleScanResult(result: QRScanResult): void {
		this.showSuccessFlash()

		// Haptic feedback if available
		if (navigator.vibrate) {
			navigator.vibrate([100, 50, 100])
		}

		// Audio feedback
		this.playSuccessSound()

		// Dispatch scan result
		this.dispatchEvent(
			new CustomEvent('scan-result', {
				detail: { data: result.data, timestamp: result.timestamp },
				bubbles: true,
				composed: true,
			}),
		)

	}

	private showSuccessFlash(): void {
		this.showSuccess = true
		timer(500)
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				this.showSuccess = false
			})
	}

	private playSuccessSound(): void {
		try {
			const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
			const audioContext = new AudioContextClass()
			const oscillator = audioContext.createOscillator()
			const gainNode = audioContext.createGain()

			oscillator.connect(gainNode)
			gainNode.connect(audioContext.destination)

			oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
			oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1)

			gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
			gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)

			oscillator.start(audioContext.currentTime)
			oscillator.stop(audioContext.currentTime + 0.2)
		} catch {
			// Audio feedback failed silently
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this.stopCamera()
		this.destroy$.complete()
	}

	render() {
		if (this.error) {
			return html`
				<div class="w-full h-full flex flex-col items-center justify-center bg-black text-white text-center p-5">
					<schmancy-icon size="64" class="mb-4">camera_alt</schmancy-icon>
					<schmancy-typography type="headline" token="md" class="mb-4">Camera Permission Required</schmancy-typography>
					<schmancy-typography type="body" token="md" class="mb-6 max-w-sm">${this.error}</schmancy-typography>
					<schmancy-button variant="filled" @click=${() => window.location.reload()}>Retry</schmancy-button>
				</div>
			`
		}

		return html`
			<div class="relative w-full h-full bg-black overflow-hidden rounded-xl">
				<!-- Video Stream -->
				<video id="video" class="absolute inset-0 w-full h-full object-cover" autoplay muted playsinline></video>

				<!-- Success Flash -->
				${when(this.showSuccess, () => html`<div class="absolute inset-0 bg-green-400/30 pointer-events-none"></div>`)}

				<!-- Glassmorphism guide - centered -->
				<div
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-white/5 backdrop-blur-sm rounded-3xl pointer-events-none"
				></div>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-qr-scanner': SchmancyQRScanner
	}
}
