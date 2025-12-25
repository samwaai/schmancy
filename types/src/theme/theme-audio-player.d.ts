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
import type { GenerateMoodAudioRequest, GenerateMoodAudioResponse } from '@schmancy/types/mood-audio.types';
/** Event detail for mood audio generation request */
export interface GenerateMoodAudioEventDetail extends GenerateMoodAudioRequest {
}
/** Custom event for requesting mood audio generation */
export declare class SchmancyGenerateMoodAudioEvent extends CustomEvent<GenerateMoodAudioEventDetail> {
    constructor(detail: GenerateMoodAudioEventDetail);
}
declare global {
    interface HTMLElementEventMap {
        'schmancy-generate-mood-audio': SchmancyGenerateMoodAudioEvent;
    }
}
declare const SchmancyThemeAudioPlayer_base: CustomElementConstructor & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
/**
 * Mood Audio Player - Generates emotional sounds based on mood and theme
 * Integrates with the Sound Service for consistent sound management
 */
export declare class SchmancyThemeAudioPlayer extends SchmancyThemeAudioPlayer_base {
    /** Current theme color */
    private currentColor;
    /** Current color scheme */
    private currentScheme;
    /** User's mood input */
    private moodText;
    /** Loading state for AI generation */
    private isGenerating;
    /** Generated audio sequence */
    private audioSequence;
    /** Detected mood from AI */
    private detectedMood;
    /** Error message */
    private error;
    /** Current volume from sound service */
    private volume;
    /** Current sound theme name */
    private currentThemeName;
    /** Reference to theme component */
    private themeComponent;
    /** Subject for mood input changes */
    private moodInput$;
    connectedCallback(): void;
    /** Handle mood input change */
    private handleMoodInput;
    /** Request mood audio generation - dispatches event for host app to handle */
    private requestMoodAudio;
    /**
     * Set the response from the API call.
     * Called by the host app after handling the schmancy-generate-mood-audio event.
     */
    setResponse(response: GenerateMoodAudioResponse): void;
    /**
     * Convert an AI-generated AudioSequence to a SoundTheme
     */
    private audioSequenceToSoundTheme;
    /**
     * Map a detected mood string to a Feeling type
     */
    private mapMoodToFeeling;
    /**
     * Play the detected mood using the sound service
     */
    private playDetectedMood;
    /**
     * Set an error state. Called by host app if API call fails.
     */
    setError(message: string): void;
    /** Replay the current audio sequence using sound service */
    private replay;
    /** Handle volume change */
    private handleVolumeChange;
    /** Reset to default sounds */
    private resetToDefaults;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-theme-audio-player': SchmancyThemeAudioPlayer;
    }
}
export {};
