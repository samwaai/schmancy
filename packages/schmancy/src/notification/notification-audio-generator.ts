/**
 * Programmatic sound generator for Schmancy notifications
 * Uses Web Audio API to generate gentle, subtle and soft sounds for each notification type
 */
export class NotificationSoundGenerator {
	private audioContext: AudioContext | null = null

	/**
	 * Get or create AudioContext
	 */
	private getAudioContext(): AudioContext {
		if (!this.audioContext) {
			const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
			this.audioContext = new AudioContextClass()
		}
		return this.audioContext
	}

	public playInfoSound(volume = 0.2): void {
		const ctx = this.getAudioContext()
		const now = ctx.currentTime

		const oscillator = ctx.createOscillator()
		const gainNode = ctx.createGain()
		const filter = ctx.createBiquadFilter()

		oscillator.type = 'sine'
		oscillator.frequency.setValueAtTime(392, now) // G4
		oscillator.frequency.exponentialRampToValueAtTime(523.25, now + 0.25) // C5

		filter.type = 'lowpass'
		filter.frequency.value = 1500

		gainNode.gain.setValueAtTime(0.0001, now)
		gainNode.gain.exponentialRampToValueAtTime(volume, now + 0.15)
		gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.4)

		oscillator.connect(filter).connect(gainNode).connect(ctx.destination)
		oscillator.start(now)
		oscillator.stop(now + 0.45)
	}

	public playSuccessSound(volume = 0.2): void {
		const ctx = this.getAudioContext()
		const now = ctx.currentTime

		const createBell = (freq: number, start: number, duration: number) => {
			const osc = ctx.createOscillator()
			const gain = ctx.createGain()
			const filter = ctx.createBiquadFilter()

			osc.type = 'sine'
			osc.frequency.setValueAtTime(freq, now)
			filter.type = 'lowpass'
			filter.frequency.value = freq * 4

			gain.gain.setValueAtTime(0.0001, now)
			gain.gain.exponentialRampToValueAtTime(volume, now + 0.1)
			gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

			osc.connect(filter).connect(gain).connect(ctx.destination)
			osc.start(now + start)
			osc.stop(now + duration)
		}

		createBell(659.25, 0, 0.6) // E5
		createBell(523.25, 0.05, 0.55) // C5
	}

	public playWarningSound(volume = 0.25): void {
		const ctx = this.getAudioContext()
		const now = ctx.currentTime

		const osc1 = ctx.createOscillator()
		const osc2 = ctx.createOscillator()
		const gain = ctx.createGain()
		const filter = ctx.createBiquadFilter()

		osc1.type = 'sine'
		osc2.type = 'sine'
		osc1.frequency.setValueAtTime(349.23, now) // F4
		osc2.frequency.setValueAtTime(440, now) // A4

		filter.type = 'lowpass'
		filter.frequency.value = 1000

		gain.gain.setValueAtTime(0.0001, now)
		gain.gain.exponentialRampToValueAtTime(volume, now + 0.08)
		gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5)

		osc1.connect(filter)
		osc2.connect(filter)
		filter.connect(gain).connect(ctx.destination)

		osc1.start(now)
		osc2.start(now)
		osc1.stop(now + 0.55)
		osc2.stop(now + 0.55)
	}

	public playErrorSound(volume = 0.25): void {
		const ctx = this.getAudioContext()
		const now = ctx.currentTime

		const osc = ctx.createOscillator()
		const gain = ctx.createGain()
		const filter = ctx.createBiquadFilter()

		osc.type = 'triangle'
		osc.frequency.setValueAtTime(220, now) // A3
		osc.frequency.exponentialRampToValueAtTime(1760, now + 0.3) // A6

		filter.type = 'lowpass'
		filter.frequency.value = 800
		filter.Q.value = 0.5

		gain.gain.setValueAtTime(0.0001, now)
		gain.gain.exponentialRampToValueAtTime(volume * 0.8, now + 0.1)
		gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7)

		osc.connect(filter).connect(gain).connect(ctx.destination)
		osc.start(now)
		osc.stop(now + 0.75)
	}

	/**
	 * Generate audio blob files for all notification sounds
	 * Returns a Promise that resolves with URLs to the generated audio files
	 */
	public async generateAudioFiles(volume = 0.25): Promise<Record<string, string>> {
		// Create offline audio context for rendering
		const sampleRate = 44100
		const duration = 1 // 1 second duration to capture the full sound

		const audioUrls: Record<string, string> = {}

		// Generate info sound
		audioUrls.info = await this.generateAudioFile(
			async ctx => {
				// Create oscillator for main tone
				const oscillator = ctx.createOscillator()
				oscillator.type = 'sine'
				oscillator.frequency.setValueAtTime(320, 0)
				oscillator.frequency.exponentialRampToValueAtTime(520, 0.3)

				// Create gain node for volume control with softer attack/release
				const gainNode = ctx.createGain()
				gainNode.gain.setValueAtTime(0, 0)
				gainNode.gain.linearRampToValueAtTime(volume, 0.1)
				gainNode.gain.linearRampToValueAtTime(0, 0.5)

				// Connect and play
				oscillator.connect(gainNode)
				gainNode.connect(ctx.destination)
				oscillator.start()
				oscillator.stop(0.5)
			},
			sampleRate,
			duration,
		)

		// Generate success sound
		audioUrls.success = await this.generateAudioFile(
			async ctx => {
				// Create main oscillator (higher note)
				const osc1 = ctx.createOscillator()
				osc1.type = 'sine'
				osc1.frequency.setValueAtTime(660, 0)

				// Create secondary oscillator (lower note)
				const osc2 = ctx.createOscillator()
				osc2.type = 'sine'
				osc2.frequency.setValueAtTime(440, 0)

				// Create gain nodes with softer envelope
				const gain1 = ctx.createGain()
				gain1.gain.setValueAtTime(0, 0)
				gain1.gain.linearRampToValueAtTime(volume, 0.1)
				gain1.gain.linearRampToValueAtTime(0, 0.5)

				const gain2 = ctx.createGain()
				gain2.gain.setValueAtTime(0, 0)
				gain2.gain.linearRampToValueAtTime(volume * 0.6, 0.15)
				gain2.gain.linearRampToValueAtTime(0, 0.7)

				// Connect and play
				osc1.connect(gain1)
				gain1.connect(ctx.destination)

				osc2.connect(gain2)
				gain2.connect(ctx.destination)

				osc1.start()
				osc2.start(0.15)

				osc1.stop(0.5)
				osc2.stop(0.7)
			},
			sampleRate,
			duration,
		)

		// Generate warning sound
		audioUrls.warning = await this.generateAudioFile(
			async ctx => {
				// Create oscillators for a two-tone warning
				const osc1 = ctx.createOscillator()
				osc1.type = 'sine'
				osc1.frequency.setValueAtTime(293.66, 0)

				const osc2 = ctx.createOscillator()
				osc2.type = 'sine'
				osc2.frequency.setValueAtTime(349.23, 0)

				// Create gain node with softer envelope
				const gain = ctx.createGain()
				gain.gain.setValueAtTime(0, 0)
				gain.gain.linearRampToValueAtTime(volume, 0.1)
				gain.gain.linearRampToValueAtTime(volume * 0.6, 0.2)
				gain.gain.linearRampToValueAtTime(volume * 0.8, 0.3)
				gain.gain.linearRampToValueAtTime(0, 0.6)

				// Connect and play
				osc1.connect(gain)
				osc2.connect(gain)
				gain.connect(ctx.destination)

				osc1.start()
				osc2.start()

				osc1.stop(0.6)
				osc2.stop(0.6)
			},
			sampleRate,
			duration,
		)

		// Generate error sound
		audioUrls.error = await this.generateAudioFile(
			async ctx => {
				// Create main oscillator
				const osc = ctx.createOscillator()
				osc.type = 'sine'
				osc.frequency.setValueAtTime(196, 0)

				// Create gain node with softer envelope
				const gain = ctx.createGain()
				gain.gain.setValueAtTime(0, 0)
				gain.gain.linearRampToValueAtTime(volume, 0.1)
				gain.gain.linearRampToValueAtTime(volume * 0.4, 0.2)
				gain.gain.linearRampToValueAtTime(volume * 0.6, 0.3)
				gain.gain.linearRampToValueAtTime(0, 0.7)

				// Additional filter to make it even softer
				const filter = ctx.createBiquadFilter()
				filter.type = 'lowpass'
				filter.frequency.value = 600
				filter.Q.value = 0.7

				// Connect and play
				osc.connect(filter)
				filter.connect(gain)
				gain.connect(ctx.destination)

				osc.start()
				osc.stop(0.7)
			},
			sampleRate,
			duration,
		)

		return audioUrls
	}

	/**
	 * Generate an audio file from a sound generation function
	 * @param renderFunction Function that creates the sound in the provided context
	 * @param sampleRate Sample rate for the audio
	 * @param duration Duration in seconds
	 * @returns Promise that resolves with the URL to the generated audio file
	 */
	private async generateAudioFile(
		renderFunction: (ctx: OfflineAudioContext) => Promise<void>,
		sampleRate = 44100,
		duration = 1,
	): Promise<string> {
		// Create offline context
		const offlineCtx = new OfflineAudioContext(2, sampleRate * duration, sampleRate)

		// Render the sound
		await renderFunction(offlineCtx)

		// Render the audio
		const audioBuffer = await offlineCtx.startRendering()

		// Convert to WAV format
		const wavBlob = this.audioBufferToWav(audioBuffer)

		// Create URL
		return URL.createObjectURL(wavBlob)
	}

	/**
	 * Convert AudioBuffer to WAV format
	 * Based on https://github.com/Jam3/audiobuffer-to-wav
	 */
	private audioBufferToWav(buffer: AudioBuffer): Blob {
		const numChannels = buffer.numberOfChannels
		const sampleRate = buffer.sampleRate
		const format = 1 // PCM
		const bitDepth = 16

		const bytesPerSample = bitDepth / 8
		const blockAlign = numChannels * bytesPerSample

		const samples = this.getAudioSamples(buffer, bitDepth)
		const dataLength = samples.length * bytesPerSample

		// Create WAV header
		const headerLength = 44
		const wavBuffer = new ArrayBuffer(headerLength + dataLength)
		const view = new DataView(wavBuffer)

		// RIFF identifier
		this.writeString(view, 0, 'RIFF')
		// File length minus RIFF identifier and file size
		view.setUint32(4, 36 + dataLength, true)
		// RIFF type
		this.writeString(view, 8, 'WAVE')
		// Format chunk identifier
		this.writeString(view, 12, 'fmt ')
		// Format chunk length
		view.setUint32(16, 16, true)
		// Sample format (PCM)
		view.setUint16(20, format, true)
		// Channel count
		view.setUint16(22, numChannels, true)
		// Sample rate
		view.setUint32(24, sampleRate, true)
		// Byte rate (sample rate * block align)
		view.setUint32(28, sampleRate * blockAlign, true)
		// Block align (channel count * bytes per sample)
		view.setUint16(32, blockAlign, true)
		// Bits per sample
		view.setUint16(34, bitDepth, true)
		// Data chunk identifier
		this.writeString(view, 36, 'data')
		// Data chunk length
		view.setUint32(40, dataLength, true)

		// Write the audio data
		if (bitDepth === 16) {
			this.writeInt16Samples(view, headerLength, samples)
		} else {
			throw new Error('Only 16-bit audio is supported')
		}

		return new Blob([wavBuffer], { type: 'audio/wav' })
	}

	/**
	 * Get audio samples from an AudioBuffer
	 */
	private getAudioSamples(buffer: AudioBuffer, bitDepth: number): number[] {
		const numChannels = buffer.numberOfChannels
		const length = buffer.length
		const samples: number[] = []
		const scale = bitDepth === 16 ? 32768 : 128

		// Get samples from all channels
		for (let i = 0; i < length; i++) {
			for (let channel = 0; channel < numChannels; channel++) {
				const sample = buffer.getChannelData(channel)[i]
				// Convert float32 to int16 or int8
				const intSample = Math.max(-1, Math.min(1, sample))
				samples.push(intSample * scale)
			}
		}

		return samples
	}

	/**
	 * Write 16-bit samples to a DataView
	 */
	private writeInt16Samples(view: DataView, offset: number, samples: number[]): void {
		for (let i = 0; i < samples.length; i++) {
			view.setInt16(offset + i * 2, samples[i], true)
		}
	}

	/**
	 * Write a string to a DataView
	 */
	private writeString(view: DataView, offset: number, string: string): void {
		for (let i = 0; i < string.length; i++) {
			view.setUint8(offset + i, string.charCodeAt(i))
		}
	}
}
