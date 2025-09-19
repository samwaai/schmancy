import { fromEvent, takeUntil } from 'rxjs'
import { NotificationType } from './notification'
import { NotificationSoundGenerator } from './notification-audio-generator'

/**
 * Audio service for playing notification sounds.
 * Uses Web Audio API with fallback to HTML5 Audio.
 */
export class NotificationAudioService {
	private audioContext: AudioContext | null = null
	private soundBuffers: Map<NotificationType, AudioBuffer> = new Map()
	private volume: number = 0.5
	private muted: boolean = false
	private soundGenerator = new NotificationSoundGenerator()
	private disconnecting = new EventTarget()

	// Default sound URLs (will be generated programmatically as fallback)
	private soundUrls: Record<NotificationType, string> = {
		info: '/assets/sounds/notification-info.mp3',
		success: '/assets/sounds/notification-success.mp3',
		warning: '/assets/sounds/notification-warning.mp3',
		error: '/assets/sounds/notification-error.mp3',
	}

	constructor() {
		// Initialize audio context when first needed
		this.initializeAudioFiles()
	}

	/**
	 * Initialize audio files - generate programmatically if needed
	 */
	private async initializeAudioFiles(): Promise<void> {
		try {
			// Try to load from default URLs
			await this.preloadSounds()
		} catch (err) {

			// If loading fails, generate programmatically
			try {
				const generatedUrls = await this.soundGenerator.generateAudioFiles(this.volume)
				this.soundUrls = generatedUrls
			} catch (genErr) {
				console.warn('Failed to generate notification sounds:', genErr)
				// Will fall back to direct playback when needed
			}
		}
	}

	/**
	 * Lazy-initialize the audio context
	 */
	private getAudioContext(): AudioContext {
		if (!this.audioContext) {
			// Use AudioContext with webkit prefix fallback for Safari
			const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
			this.audioContext = new AudioContextClass()
		}

		return this.audioContext
	}

	/**
	 * Preload all notification sounds
	 */
	private async preloadSounds(): Promise<void> {
		const types: NotificationType[] = ['info', 'success', 'warning', 'error']

		for (const type of types) {
			try {
				const buffer = await this.loadSound(type)
				this.soundBuffers.set(type, buffer)
			} catch (err) {
				console.warn(`Failed to preload ${type} sound:`, err)
			}
		}
	}

	/**
	 * Load a sound file and decode it
	 */
	private async loadSound(type: NotificationType): Promise<AudioBuffer> {
		const url = this.soundUrls[type]
		const response = await fetch(url)

		if (!response.ok) {
			throw new Error(`Failed to load sound from ${url}: ${response.statusText}`)
		}

		const arrayBuffer = await response.arrayBuffer()
		return await this.getAudioContext().decodeAudioData(arrayBuffer)
	}

	/**
	 * Play a notification sound
	 */
	public async playSound(type: NotificationType): Promise<void> {
		if (this.muted) return

		try {
			// Try to use Web Audio API first
			const context = this.getAudioContext()

			// Ensure audio context is resumed (needed due to autoplay policy)
			if (context.state === 'suspended') {
				await context.resume()
			}

			// Try to use programmatically generated sound first
			if (this.soundUrls[type].startsWith('blob:')) {
				this.playFallbackSound(type)
				return
			}

			// Load sound if not already cached
			if (!this.soundBuffers.has(type)) {
				try {
					const buffer = await this.loadSound(type)
					this.soundBuffers.set(type, buffer)
				} catch (err) {
					// Fall back to direct generator
					this.playDirectGeneratedSound(type)
					return
				}
			}

			const buffer = this.soundBuffers.get(type)
			if (!buffer) {
				throw new Error(`Sound buffer for ${type} not available`)
			}

			// Create source and gain nodes
			const source = context.createBufferSource()
			source.buffer = buffer

			const gainNode = context.createGain()
			gainNode.gain.value = this.volume

			// Connect and play
			source.connect(gainNode)
			gainNode.connect(context.destination)
			source.start(0)
		} catch (err) {
			console.warn(`Web Audio API buffer playback failed, trying direct generation:`, err)
			this.playDirectGeneratedSound(type)
		}
	}

	/**
	 * Play a directly generated sound when other methods fail
	 */
	private playDirectGeneratedSound(type: NotificationType): void {
		if (this.muted) return

		try {
			switch (type) {
				case 'info':
					this.soundGenerator.playInfoSound(this.volume)
					break
				case 'success':
					this.soundGenerator.playSuccessSound(this.volume)
					break
				case 'warning':
					this.soundGenerator.playWarningSound(this.volume)
					break
				case 'error':
					this.soundGenerator.playErrorSound(this.volume)
					break
			}
		} catch (err) {
			console.error(`Failed to play generated sound for ${type}:`, err)
		}
	}

	/**
	 * Handle audio ended event for cleanup
	 */
	private handleAudioEnded = (audio: HTMLAudioElement) => () => {
		audio.remove()
	}

	/**
	 * Play sound using HTML5 Audio as a fallback
	 */
	private playFallbackSound(type: NotificationType): void {
		if (this.muted) return

		try {
			const audio = new Audio(this.soundUrls[type])
			audio.volume = this.volume

			// Add event listener to clean up after playback using RxJS
			fromEvent(audio, 'ended').pipe(
				takeUntil(fromEvent(this.disconnecting, 'disconnect'))
			).subscribe(this.handleAudioEnded(audio))

			audio.play().catch(err => {
				console.error(`Failed to play fallback sound for ${type}:`, err)
				this.playDirectGeneratedSound(type)
			})
		} catch (err) {
			console.error('HTML5 Audio fallback failed:', err)
			this.playDirectGeneratedSound(type)
		}
	}

	/**
	 * Set volume for notification sounds (0.0 to 1.0)
	 */
	public setVolume(volume: number): void {
		this.volume = Math.max(0, Math.min(1, volume))
	}

	/**
	 * Get current volume level
	 */
	public getVolume(): number {
		return this.volume
	}

	/**
	 * Mute notification sounds
	 */
	public mute(): void {
		this.muted = true
	}

	/**
	 * Unmute notification sounds
	 */
	public unmute(): void {
		this.muted = false
	}

	/**
	 * Check if notification sounds are muted
	 */
	public isMuted(): boolean {
		return this.muted
	}

	/**
	 * Set custom sound URL for a notification type
	 */
	public setSoundUrl(type: NotificationType, url: string): void {
		this.soundUrls[type] = url

		// Clear cached buffer to force reload
		this.soundBuffers.delete(type)
	}

	/**
	 * Get the current sound URL for a notification type
	 */
	public getSoundUrl(type: NotificationType): string {
		return this.soundUrls[type]
	}

	/**
	 * Cleanup all subscriptions and resources
	 */
	public dispose(): void {
		this.disconnecting.dispatchEvent(new Event('disconnect'))

		// Close audio context if exists
		if (this.audioContext && this.audioContext.state !== 'closed') {
			this.audioContext.close().catch(err => {
				console.warn('Failed to close audio context:', err)
			})
		}
	}
}
