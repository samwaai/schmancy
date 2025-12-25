/**
 * Schmancy Audio Module
 *
 * A curated library of emotional sounds for creating beautiful, empathetic interfaces.
 *
 * The sound system follows the same pattern as the theme system:
 * - Default sounds as fallback
 * - Can receive custom sound themes from AI
 * - Reactive observables for state changes
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
 * ```
 */
export { sound, schmancySound } from './sound.service';
export type { Feeling, FeelingCategory, FeelingSound, SoundTheme, SoundThemeSettings, GenerateSoundThemeRequest, GenerateSoundThemeResponse, HappyFeeling, SadFeeling, AnxiousFeeling, AngryFeeling, TiredFeeling, CalmFeeling, ConnectedFeeling, MixedFeeling, } from '../types/mood-audio.types';
export { EmotionalSoundGenerator, $sounds } from './emotional-sounds';
