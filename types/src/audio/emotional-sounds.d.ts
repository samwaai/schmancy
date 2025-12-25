/**
 * Schmancy Emotional Sound Library
 *
 * A curated collection of soft, elegant sounds organized by emotional categories.
 * Each sound is designed to be non-intrusive, emotionally evocative, and beautiful.
 *
 * Inspired by the gentle sounds of nature - soft air, gentle chimes, and warm tones.
 *
 * @example
 * ```typescript
 * import { $sounds } from '@schmancy/audio'
 *
 * // Play a feeling
 * $sounds.play('joyful')
 * $sounds.play('relieved')
 * $sounds.play('curious')
 *
 * // Adjust volume
 * $sounds.setVolume(0.2)
 *
 * // Mute/unmute
 * $sounds.mute()
 * $sounds.unmute()
 * ```
 */
/** Happy / Pleasant feelings */
export type HappyFeeling = 'joyful' | 'content' | 'excited' | 'proud' | 'hopeful' | 'relieved' | 'grateful' | 'peaceful' | 'playful' | 'amused' | 'curious' | 'inspired' | 'confident' | 'loved' | 'comforted' | 'energized' | 'celebrated';
/** Sad / Low feelings */
export type SadFeeling = 'sad' | 'lonely' | 'disappointed' | 'heartbroken' | 'grieving' | 'hopeless' | 'empty' | 'discouraged' | 'melancholic' | 'homesick' | 'hurt' | 'miserable' | 'regretful' | 'ashamed' | 'inferior';
/** Anxious / Fearful feelings */
export type AnxiousFeeling = 'anxious' | 'worried' | 'afraid' | 'terrified' | 'panicked' | 'nervous' | 'uneasy' | 'insecure' | 'overwhelmed' | 'stressed' | 'tense' | 'apprehensive' | 'startled' | 'suspicious' | 'vulnerable';
/** Angry / Frustrated feelings */
export type AngryFeeling = 'annoyed' | 'irritated' | 'frustrated' | 'angry' | 'enraged' | 'bitter' | 'resentful' | 'jealous' | 'envious' | 'indignant' | 'impatient' | 'hostile' | 'contemptuous';
/** Tired / Drained feelings */
export type TiredFeeling = 'tired' | 'exhausted' | 'drained' | 'burnedOut' | 'numb' | 'bored' | 'unmotivated' | 'apathetic' | 'restless';
/** Calm / Grounded feelings */
export type CalmFeeling = 'calm' | 'relaxed' | 'atEase' | 'balanced' | 'stable' | 'secure' | 'safe' | 'centered' | 'grounded' | 'accepting';
/** Connected / Social feelings */
export type ConnectedFeeling = 'connected' | 'accepted' | 'included' | 'belonging' | 'appreciated' | 'valued' | 'respected' | 'supported' | 'protective' | 'compassionate' | 'empathetic';
/** Mixed / Complicated feelings */
export type MixedFeeling = 'conflicted' | 'confused' | 'ambivalent' | 'nostalgic' | 'guilty' | 'embarrassed' | 'surprised' | 'shocked' | 'awestruck' | 'skeptical';
/** All feelings */
export type Feeling = HappyFeeling | SadFeeling | AnxiousFeeling | AngryFeeling | TiredFeeling | CalmFeeling | ConnectedFeeling | MixedFeeling;
/** Feeling category */
export type FeelingCategory = 'happy' | 'sad' | 'anxious' | 'angry' | 'tired' | 'calm' | 'connected' | 'mixed';
/**
 * Emotional Sound Generator
 * Creates soft, beautiful sounds using Web Audio API
 */
export declare class EmotionalSoundGenerator {
    private audioContext;
    private volume;
    private muted;
    private getContext;
    /** Soft air puff - the foundation of our sound palette */
    private puff;
    /** Gentle tone with envelope */
    private tone;
    /** Warm filtered tone */
    private warmTone;
    /** Shimmer - multiple soft tones */
    private shimmer;
    private playJoyful;
    private playContent;
    private playExcited;
    private playProud;
    private playHopeful;
    private playRelieved;
    private playGrateful;
    private playPeaceful;
    private playPlayful;
    private playAmused;
    private playCurious;
    private playInspired;
    private playConfident;
    private playLoved;
    private playComforted;
    private playEnergized;
    private playCelebrated;
    private playSad;
    private playLonely;
    private playDisappointed;
    private playMelancholic;
    private playAnxious;
    private playWorried;
    private playNervous;
    private playStartled;
    private playAnnoyed;
    private playFrustrated;
    private playImpatient;
    private playTired;
    private playExhausted;
    private playBored;
    private playCalm;
    private playRelaxed;
    private playGrounded;
    private playSafe;
    private playConnected;
    private playAppreciated;
    private playSupported;
    private playNostalgic;
    private playSurprised;
    private playAwestruck;
    private playConfused;
    /** Set volume (0.0 - 1.0) */
    setVolume(vol: number): void;
    /** Get current volume */
    getVolume(): number;
    /** Mute all sounds */
    mute(): void;
    /** Unmute sounds */
    unmute(): void;
    /** Check if muted */
    isMuted(): boolean;
    /** Play a feeling */
    play(feeling: Feeling): void;
    /** Dispose audio context */
    dispose(): void;
}
/** Global emotional sound player */
export declare const $sounds: EmotionalSoundGenerator;
export default EmotionalSoundGenerator;
