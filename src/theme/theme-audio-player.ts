/**
 * Theme Audio Player Component
 *
 * A generic audio player that generates emotional sounds based on user mood and theme color.
 * Integrates with the Sound Service for playback and theme management.
 * Uses local storage for persistence via the Sound Service.
 *
 * @element schmancy-theme-audio-player
 *
 * @fires schmancy-generate-mood-audio - Dispatched when user requests audio generation
 *   detail: { moodText: string, themeColor: string, scheme: 'dark' | 'light' | 'auto' }
 *
 * @example
 * ```html
 * <schmancy-theme-audio-player
 *   @schmancy-generate-mood-audio=${(e) => handleGenerate(e.detail)}
 * ></schmancy-theme-audio-player>
 * ```
 */

import { $LitElement } from '@mixins/litElement.mixin'
import { html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { debounceTime, Subject, takeUntil, tap, switchMap, of } from 'rxjs'
import { sound } from '../audio/sound.service'
import type { SchmancyThemeComponent } from './theme.component'
import type {
	AudioSequence,
	GenerateMoodAudioRequest,
	GenerateMoodAudioResponse,
	SoundTheme,
	Feeling,
} from '@schmancy/types/mood-audio.types'

/** Event detail for mood audio generation request */
export interface GenerateMoodAudioEventDetail extends GenerateMoodAudioRequest {}

/** Custom event for requesting mood audio generation */
export class SchmancyGenerateMoodAudioEvent extends CustomEvent<GenerateMoodAudioEventDetail> {
	constructor(detail: GenerateMoodAudioEventDetail) {
		super('schmancy-generate-mood-audio', {
			detail,
			bubbles: true,
			composed: true,
		})
	}
}

// Add to global event map
declare global {
	interface HTMLElementEventMap {
		'schmancy-generate-mood-audio': SchmancyGenerateMoodAudioEvent
	}
}

/**
 * Mood Audio Player - Generates emotional sounds based on mood and theme
 * Integrates with the Sound Service for consistent sound management
 */
@customElement('schmancy-theme-audio-player')
export class SchmancyThemeAudioPlayer extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	/** Current theme color */
	@state() private currentColor: string = '#6200ee'

	/** Current color scheme */
	@state() private currentScheme: 'dark' | 'light' | 'auto' = 'auto'

	/** User's mood input */
	@state() private moodText: string = ''

	/** Loading state for AI generation */
	@state() private isGenerating: boolean = false

	/** Generated audio sequence */
	@state() private audioSequence: AudioSequence | null = null

	/** Detected mood from AI */
	@state() private detectedMood: string = ''

	/** Error message */
	@state() private error: string = ''

	/** Current volume from sound service */
	@state() private volume: number = 0.15

	/** Current sound theme name */
	@state() private currentThemeName: string = 'default'

	/** Reference to theme component */
	private themeComponent: SchmancyThemeComponent | null = null

	/** Subject for mood input changes */
	private moodInput$ = new Subject<string>()

	connectedCallback() {
		super.connectedCallback()

		// Sync with sound service
		sound.volume$.pipe(takeUntil(this.disconnecting)).subscribe(vol => {
			this.volume = vol
		})

		sound.themeName$.pipe(takeUntil(this.disconnecting)).subscribe(name => {
			this.currentThemeName = name
		})

		// Sync the current theme from local storage to update UI
		sound.theme$.pipe(takeUntil(this.disconnecting)).subscribe(theme => {
			if (theme) {
				this.detectedMood = theme.name.replace('AI: ', '')
			}
		})

		// Discover the nearest theme component
		this.discover<SchmancyThemeComponent>('schmancy-theme')
			.pipe(
				switchMap(theme => {
					if (theme) {
						this.themeComponent = theme
						this.currentScheme = theme.scheme
						this.currentColor = theme.color

						// Create observer for theme changes
						return new Subject().pipe(
							tap(() => {
								if (this.themeComponent) {
									this.currentScheme = this.themeComponent.scheme
									this.currentColor = this.themeComponent.color
								}
							})
						)
					}
					return of(null)
				}),
				takeUntil(this.disconnecting)
			)
			.subscribe()

		// Debounced mood input for AI generation
		this.moodInput$
			.pipe(
				debounceTime(500),
				tap(text => {
					this.moodText = text
				}),
				takeUntil(this.disconnecting)
			)
			.subscribe()
	}

	/** Handle mood input change */
	private handleMoodInput(e: Event): void {
		const input = e.target as HTMLInputElement
		this.moodInput$.next(input.value)
	}

	/** Request mood audio generation - dispatches event for host app to handle */
	private requestMoodAudio(): void {
		if (!this.moodText.trim()) {
			this.error = 'Please enter how you are feeling'
			return
		}

		this.error = ''
		this.isGenerating = true
		this.audioSequence = null
		this.detectedMood = ''

		// Dispatch event for host app to handle the API call
		this.dispatchEvent(
			new SchmancyGenerateMoodAudioEvent({
				moodText: this.moodText.trim(),
				themeColor: this.currentColor,
				scheme: this.currentScheme,
			})
		)
	}

	/**
	 * Set the response from the API call.
	 * Called by the host app after handling the schmancy-generate-mood-audio event.
	 */
	public setResponse(response: GenerateMoodAudioResponse): void {
		this.isGenerating = false

		if (response.success && response.audioSequence) {
			this.audioSequence = response.audioSequence
			this.detectedMood = response.detectedMood

			// Convert AudioSequence to a SoundTheme and apply it (persists to local storage)
			const soundTheme = this.audioSequenceToSoundTheme(response.audioSequence, response.detectedMood)
			sound.setTheme(soundTheme)

			// Play the detected mood feeling
			this.playDetectedMood(response.detectedMood)
		} else {
			this.error = response.error || 'Failed to generate audio'
		}
	}

	/**
	 * Convert an AI-generated AudioSequence to a SoundTheme
	 */
	private audioSequenceToSoundTheme(sequence: AudioSequence, detectedMood: string): SoundTheme {
		const feeling = this.mapMoodToFeeling(detectedMood)

		return {
			name: `AI: ${detectedMood}`,
			description: sequence.emotionalDescription,
			masterVolume: sequence.masterVolume,
			feelings: {
				[feeling]: {
					puffs: sequence.puffs,
					tones: sequence.tones,
					description: sequence.emotionalDescription,
				},
			},
			metadata: {
				sourceColor: this.currentColor,
				sourceMood: this.moodText,
				scheme: this.currentScheme,
				generatedAt: new Date().toISOString(),
				generatedBy: 'AI',
			},
		}
	}

	/**
	 * Map a detected mood string to a Feeling type
	 */
	private mapMoodToFeeling(mood: string): Feeling {
		const normalizedMood = mood.toLowerCase().trim()

		const directMatches: Record<string, Feeling> = {
			joyful: 'joyful',
			happy: 'joyful',
			joy: 'joyful',
			content: 'content',
			satisfied: 'content',
			excited: 'excited',
			thrilled: 'excited',
			proud: 'proud',
			hopeful: 'hopeful',
			relieved: 'relieved',
			grateful: 'grateful',
			thankful: 'grateful',
			peaceful: 'peaceful',
			serene: 'peaceful',
			playful: 'playful',
			amused: 'amused',
			curious: 'curious',
			interested: 'curious',
			inspired: 'inspired',
			confident: 'confident',
			loved: 'loved',
			comforted: 'comforted',
			energized: 'energized',
			celebrated: 'celebrated',
			sad: 'sad',
			unhappy: 'sad',
			lonely: 'lonely',
			alone: 'lonely',
			disappointed: 'disappointed',
			melancholic: 'melancholic',
			anxious: 'anxious',
			worried: 'worried',
			nervous: 'nervous',
			stressed: 'stressed',
			overwhelmed: 'overwhelmed',
			annoyed: 'annoyed',
			frustrated: 'frustrated',
			angry: 'angry',
			tired: 'tired',
			exhausted: 'exhausted',
			bored: 'bored',
			calm: 'calm',
			relaxed: 'relaxed',
			connected: 'connected',
			nostalgic: 'nostalgic',
			surprised: 'surprised',
			confused: 'confused',
		}

		if (directMatches[normalizedMood]) {
			return directMatches[normalizedMood]
		}

		for (const [keyword, feeling] of Object.entries(directMatches)) {
			if (normalizedMood.includes(keyword)) {
				return feeling
			}
		}

		return 'calm'
	}

	/**
	 * Play the detected mood using the sound service
	 */
	private playDetectedMood(mood: string): void {
		const feeling = this.mapMoodToFeeling(mood)
		sound.play(feeling)
	}

	/**
	 * Set an error state. Called by host app if API call fails.
	 */
	public setError(message: string): void {
		this.isGenerating = false
		this.error = message
	}

	/** Replay the current audio sequence using sound service */
	private replay(): void {
		if (this.detectedMood) {
			this.playDetectedMood(this.detectedMood)
		}
	}

	/** Handle volume change */
	private handleVolumeChange(e: Event): void {
		const value = parseInt((e.target as HTMLInputElement).value) / 100
		sound.setVolume(value)
	}

	/** Reset to default sounds */
	private resetToDefaults(): void {
		sound.resetTheme()
		this.audioSequence = null
		this.detectedMood = ''
	}

	render() {
		return html`
			<div class="space-y-4">
				<!-- Current Theme Status -->
				<div class="flex items-center justify-between">
					<schmancy-typography type="label" token="sm" class="opacity-60">
						Sound Theme: ${this.currentThemeName}
					</schmancy-typography>
					${when(
						this.currentThemeName !== 'default',
						() => html`
							<schmancy-button variant="text" size="sm" @click=${() => this.resetToDefaults()}>
								<schmancy-icon size="16px">refresh</schmancy-icon>
								Reset
							</schmancy-button>
						`
					)}
				</div>

				<!-- Mood Input -->
				<div class="space-y-2">
					<schmancy-typography type="label" token="lg" class="text-surface-on">
						How are you feeling today?
					</schmancy-typography>
					<schmancy-input
						type="text"
						placeholder="I'm feeling..."
						.value=${this.moodText}
						@input=${this.handleMoodInput}
						?disabled=${this.isGenerating}
						class="w-full"
					></schmancy-input>
				</div>

				<!-- Current Color Preview -->
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-lg border border-outline" style="background: ${this.currentColor}"></div>
					<schmancy-typography type="body" token="sm" class="opacity-60"> Current theme color </schmancy-typography>
				</div>

				<!-- Generate Button -->
				<schmancy-button
					variant="filled"
					@click=${() => this.requestMoodAudio()}
					?disabled=${this.isGenerating || !this.moodText.trim()}
					class="w-full"
				>
					${when(
						this.isGenerating,
						() => html`
							<schmancy-progress-circular indeterminate size="20"></schmancy-progress-circular>
							<span class="ml-2">Generating...</span>
						`,
						() => html`
							<schmancy-icon>music_note</schmancy-icon>
							<span class="ml-2">Generate Mood Sound</span>
						`
					)}
				</schmancy-button>

				<!-- Error Message -->
				${when(
					this.error,
					() => html`
						<schmancy-surface type="error" class="p-3 rounded-lg">
							<schmancy-typography type="body" token="sm" class="text-error"> ${this.error} </schmancy-typography>
						</schmancy-surface>
					`
				)}

				<!-- Generated Audio Info -->
				${when(
					this.audioSequence,
					() => html`
						<schmancy-surface type="containerLow" rounded="all" class="p-4 space-y-3">
							<div class="flex items-center justify-between">
								<div>
									<schmancy-typography type="label" token="lg"> ${this.detectedMood} </schmancy-typography>
									<schmancy-typography type="body" token="sm" class="opacity-70">
										${this.audioSequence?.emotionalDescription}
									</schmancy-typography>
								</div>
								<schmancy-button variant="tonal" @click=${() => this.replay()}>
									<schmancy-icon>replay</schmancy-icon>
								</schmancy-button>
							</div>

							<!-- Audio Visualization -->
							<div class="flex items-center gap-1 h-8">
								${this.audioSequence?.puffs.map(
									(_, i) => html`
										<div
											class="w-2 bg-primary rounded-full animate-pulse"
											style="height: ${20 + i * 8}px; animation-delay: ${i * 0.1}s"
										></div>
									`
								)}
								${this.audioSequence?.tones.map(
									t => html`
										<div
											class="w-1 bg-secondary rounded-full"
											style="height: ${Math.min(32, t.frequency / 40)}px; opacity: ${0.5 + t.volume * 0.5}"
										></div>
									`
								)}
							</div>

							<!-- Volume Control -->
							<div class="flex items-center gap-2">
								<schmancy-icon class="opacity-50">volume_down</schmancy-icon>
								<input
									type="range"
									min="0"
									max="100"
									.value=${String(this.volume * 100)}
									@input=${this.handleVolumeChange}
									class="flex-1 h-1 bg-surface-containerHighest rounded-full appearance-none cursor-pointer"
								/>
								<schmancy-icon class="opacity-50">volume_up</schmancy-icon>
							</div>
						</schmancy-surface>
					`
				)}
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-theme-audio-player': SchmancyThemeAudioPlayer
	}
}
