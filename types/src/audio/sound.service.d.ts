/**
 * Schmancy Sound Service
 *
 * Centralized sound management following the theme service pattern.
 * Provides reactive observables for sound state and methods to control sounds.
 *
 * @example
 * ```typescript
 * import { sound } from '@schmancy/audio'
 *
 * // Play a feeling sound
 * sound.play('joyful')
 *
 * // Set volume
 * sound.setVolume(0.2)
 *
 * // Apply AI-generated sound theme
 * sound.setTheme(aiGeneratedTheme)
 *
 * // Reset to defaults
 * sound.resetTheme()
 *
 * // Subscribe to theme changes
 * sound.theme$.subscribe(theme => {
 *   console.log('Current theme:', theme?.name ?? 'default')
 * })
 * ```
 */
import type { Feeling, FeelingSound, SoundTheme } from '../types/mood-audio.types';
/**
 * Sound Service - Provides centralized sound management for Schmancy components
 *
 * Following the theme service pattern:
 * - Has default sounds as fallback
 * - Can receive custom sound theme from AI
 * - Reactive observables for state changes
 * - Persists settings to session storage
 */
declare class SoundService {
    private static instance;
    /** Audio context for Web Audio API */
    private audioContext;
    readonly theme$: import("rxjs").Observable<SoundTheme>;
    readonly volume$: import("rxjs").Observable<number>;
    readonly muted$: import("rxjs").Observable<boolean>;
    /** BehaviorSubject for current theme name (for debugging/display) */
    private readonly _themeName$;
    readonly themeName$: import("rxjs").Observable<string>;
    get theme(): SoundTheme | null;
    get volume(): number;
    get muted(): boolean;
    get themeName(): string;
    private constructor();
    private getContext;
    /** Play a puff (breath/air) sound */
    private playPuff;
    /** Play a tone (musical) sound */
    private playTone;
    /**
     * Set a custom sound theme (e.g., from AI generation)
     * @param theme The sound theme to apply
     */
    setTheme(theme: SoundTheme): void;
    /**
     * Reset to default sounds (removes custom theme)
     */
    resetTheme(): void;
    /**
     * Set volume level (0.0 - 1.0)
     * @param volume Volume level
     */
    setVolume(volume: number): void;
    /**
     * Mute all sounds
     */
    mute(): void;
    /**
     * Unmute sounds
     */
    unmute(): void;
    /**
     * Toggle mute state
     */
    toggleMute(): void;
    /**
     * Get the sound definition for a feeling
     * Uses custom theme if available, falls back to defaults
     */
    getSoundForFeeling(feeling: Feeling): FeelingSound;
    /**
     * Get the category for a feeling
     */
    private getCategoryForFeeling;
    /**
     * Play a feeling sound
     * @param feeling The feeling to play
     */
    play(feeling: Feeling): void;
    /**
     * Dispose audio context
     */
    dispose(): void;
    /**
     * Get singleton instance
     */
    static getInstance(): SoundService;
}
/** Global sound service singleton */
export declare const sound: SoundService;
export declare const schmancySound: SoundService;
export default sound;
