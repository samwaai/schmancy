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

import { BehaviorSubject, distinctUntilChanged, map, shareReplay } from 'rxjs'
import { createContext } from '../store'
import type {
	Feeling,
	FeelingCategory,
	FeelingSound,
	PuffParams,
	SoundTheme,
	SoundThemeSettings,
	ToneParams,
} from '../types/mood-audio.types'

// ============================================================================
// CONTEXT
// ============================================================================

/** Sound settings context - persists to local storage */
const SoundContext = createContext<SoundThemeSettings>(
	{
		theme: null,
		volume: 0.15,
		muted: false,
	},
	'local',
	'schmancy-sound-settings'
)

// ============================================================================
// DEFAULT SOUND THEME
// ============================================================================

/**
 * Default sound definitions for all feelings
 * These are used when no custom theme is applied
 */
const DEFAULT_SOUNDS: Record<Feeling, FeelingSound> = {
	// ========== HAPPY / PLEASANT ==========
	joyful: {
		puffs: [
			{ startTime: 0, duration: 0.08, frequency: 3000, volume: 0.3 },
			{ startTime: 0.06, duration: 0.1, frequency: 3500, volume: 0.35 },
		],
		tones: [
			{ startTime: 0.02, duration: 0.15, frequency: 784, volume: 0.25, type: 'sine' },
			{ startTime: 0.1, duration: 0.2, frequency: 988, volume: 0.3, type: 'sine' },
			{ startTime: 0.18, duration: 0.25, frequency: 1175, volume: 0.25, type: 'sine' },
		],
	},
	content: {
		puffs: [{ startTime: 0, duration: 0.2, frequency: 1500, volume: 0.25 }],
		tones: [
			{ startTime: 0.05, duration: 0.3, frequency: 523, volume: 0.2, type: 'sine', filterFrequency: 800 },
			{ startTime: 0.15, duration: 0.35, frequency: 659, volume: 0.15, type: 'sine', filterFrequency: 800 },
		],
	},
	excited: {
		puffs: [
			{ startTime: 0, duration: 0.06, frequency: 2500, volume: 0.25 },
			{ startTime: 0.05, duration: 0.06, frequency: 3000, volume: 0.3 },
			{ startTime: 0.1, duration: 0.08, frequency: 3500, volume: 0.35 },
		],
		tones: [
			{ startTime: 0.02, duration: 0.12, frequency: 880, volume: 0.2, type: 'sine' },
			{ startTime: 0.08, duration: 0.12, frequency: 1047, volume: 0.25, type: 'sine' },
			{ startTime: 0.14, duration: 0.15, frequency: 1319, volume: 0.3, type: 'sine' },
		],
	},
	proud: {
		puffs: [{ startTime: 0, duration: 0.15, frequency: 1800, volume: 0.3 }],
		tones: [
			{ startTime: 0.05, duration: 0.25, frequency: 523, volume: 0.25, type: 'sine' },
			{ startTime: 0.08, duration: 0.25, frequency: 659, volume: 0.2, type: 'sine' },
			{ startTime: 0.11, duration: 0.3, frequency: 784, volume: 0.25, type: 'sine' },
		],
	},
	hopeful: {
		puffs: [{ startTime: 0, duration: 0.12, frequency: 2200, volume: 0.2 }],
		tones: [{ startTime: 0.03, duration: 0.3, frequency: 659, volume: 0.2, type: 'sine', frequencyEnd: 880 }],
	},
	relieved: {
		puffs: [{ startTime: 0, duration: 0.25, frequency: 1200, volume: 0.35 }],
		tones: [
			{ startTime: 0.1, duration: 0.35, frequency: 659, volume: 0.2, type: 'sine', filterFrequency: 800 },
			{ startTime: 0.25, duration: 0.4, frequency: 523, volume: 0.15, type: 'sine', filterFrequency: 800 },
		],
	},
	grateful: {
		puffs: [{ startTime: 0, duration: 0.15, frequency: 1500, volume: 0.25 }],
		tones: [
			{ startTime: 0.05, duration: 0.3, frequency: 440, volume: 0.2, type: 'sine', filterFrequency: 800 },
			{ startTime: 0.15, duration: 0.35, frequency: 523, volume: 0.2, type: 'sine', filterFrequency: 800 },
			{ startTime: 0.25, duration: 0.4, frequency: 659, volume: 0.15, type: 'sine', filterFrequency: 800 },
		],
	},
	peaceful: {
		puffs: [{ startTime: 0, duration: 0.3, frequency: 800, volume: 0.15 }],
		tones: [{ startTime: 0.1, duration: 0.5, frequency: 392, volume: 0.12, type: 'sine', filterFrequency: 500 }],
	},
	playful: {
		puffs: [
			{ startTime: 0, duration: 0.05, frequency: 2800, volume: 0.2 },
			{ startTime: 0.08, duration: 0.05, frequency: 3200, volume: 0.25 },
			{ startTime: 0.14, duration: 0.06, frequency: 2800, volume: 0.2 },
		],
		tones: [
			{ startTime: 0.03, duration: 0.1, frequency: 784, volume: 0.2, type: 'sine' },
			{ startTime: 0.1, duration: 0.08, frequency: 988, volume: 0.25, type: 'sine' },
			{ startTime: 0.16, duration: 0.12, frequency: 784, volume: 0.2, type: 'sine' },
		],
	},
	amused: {
		puffs: [
			{ startTime: 0, duration: 0.04, frequency: 2500, volume: 0.2 },
			{ startTime: 0.06, duration: 0.04, frequency: 2800, volume: 0.22 },
			{ startTime: 0.11, duration: 0.05, frequency: 2600, volume: 0.18 },
		],
		tones: [{ startTime: 0.05, duration: 0.15, frequency: 880, volume: 0.15, type: 'sine' }],
	},
	curious: {
		puffs: [{ startTime: 0, duration: 0.1, frequency: 2000, volume: 0.2 }],
		tones: [{ startTime: 0.03, duration: 0.2, frequency: 659, volume: 0.2, type: 'sine', frequencyEnd: 880 }],
	},
	inspired: {
		puffs: [{ startTime: 0, duration: 0.1, frequency: 2500, volume: 0.25 }],
		tones: [
			{ startTime: 0.05, duration: 0.3, frequency: 523, volume: 0.2, type: 'sine' },
			{ startTime: 0.07, duration: 0.28, frequency: 784.5, volume: 0.16, type: 'sine' },
			{ startTime: 0.09, duration: 0.26, frequency: 1046, volume: 0.12, type: 'sine' },
		],
	},
	confident: {
		puffs: [{ startTime: 0, duration: 0.12, frequency: 1500, volume: 0.3 }],
		tones: [
			{ startTime: 0.04, duration: 0.2, frequency: 523, volume: 0.25, type: 'sine' },
			{ startTime: 0.06, duration: 0.22, frequency: 659, volume: 0.2, type: 'sine' },
		],
	},
	loved: {
		puffs: [{ startTime: 0, duration: 0.2, frequency: 1000, volume: 0.2 }],
		tones: [
			{ startTime: 0.08, duration: 0.4, frequency: 392, volume: 0.18, type: 'sine', filterFrequency: 600 },
			{ startTime: 0.2, duration: 0.45, frequency: 494, volume: 0.15, type: 'sine', filterFrequency: 600 },
		],
	},
	comforted: {
		puffs: [{ startTime: 0, duration: 0.25, frequency: 900, volume: 0.18 }],
		tones: [
			{ startTime: 0.1, duration: 0.35, frequency: 523, volume: 0.15, type: 'sine', filterFrequency: 800 },
			{ startTime: 0.25, duration: 0.4, frequency: 440, volume: 0.12, type: 'sine', filterFrequency: 800 },
		],
	},
	energized: {
		puffs: [
			{ startTime: 0, duration: 0.05, frequency: 3000, volume: 0.25 },
			{ startTime: 0.04, duration: 0.05, frequency: 3500, volume: 0.28 },
		],
		tones: [
			{ startTime: 0.02, duration: 0.1, frequency: 784, volume: 0.2, type: 'sine' },
			{ startTime: 0.08, duration: 0.12, frequency: 988, volume: 0.25, type: 'sine' },
			{ startTime: 0.14, duration: 0.15, frequency: 1175, volume: 0.22, type: 'sine' },
		],
	},
	celebrated: {
		puffs: [{ startTime: 0, duration: 0.08, frequency: 2500, volume: 0.2 }],
		tones: [
			{ startTime: 0.02, duration: 0.18, frequency: 523, volume: 0.22, type: 'sine' },
			{ startTime: 0.08, duration: 0.18, frequency: 659, volume: 0.24, type: 'sine' },
			{ startTime: 0.14, duration: 0.2, frequency: 784, volume: 0.26, type: 'sine' },
			{ startTime: 0.22, duration: 0.3, frequency: 1047, volume: 0.22, type: 'sine' },
		],
	},

	// ========== SAD / LOW ==========
	sad: {
		puffs: [{ startTime: 0, duration: 0.3, frequency: 600, volume: 0.25 }],
		tones: [
			{ startTime: 0.1, duration: 0.4, frequency: 392, volume: 0.2, type: 'sine', filterFrequency: 400 },
			{ startTime: 0.3, duration: 0.45, frequency: 294, volume: 0.15, type: 'sine', filterFrequency: 350 },
		],
	},
	lonely: {
		puffs: [{ startTime: 0, duration: 0.2, frequency: 700, volume: 0.2 }],
		tones: [{ startTime: 0.15, duration: 0.5, frequency: 330, volume: 0.12, type: 'sine', filterFrequency: 450 }],
	},
	disappointed: {
		puffs: [{ startTime: 0, duration: 0.25, frequency: 800, volume: 0.25 }],
		tones: [{ startTime: 0.08, duration: 0.3, frequency: 523, volume: 0.18, type: 'sine', frequencyEnd: 349 }],
	},
	heartbroken: {
		puffs: [{ startTime: 0, duration: 0.3, frequency: 600, volume: 0.25 }],
		tones: [
			{ startTime: 0.1, duration: 0.4, frequency: 392, volume: 0.2, type: 'sine', filterFrequency: 400 },
			{ startTime: 0.3, duration: 0.45, frequency: 294, volume: 0.15, type: 'sine', filterFrequency: 350 },
		],
	},
	grieving: {
		puffs: [{ startTime: 0, duration: 0.3, frequency: 600, volume: 0.25 }],
		tones: [
			{ startTime: 0.1, duration: 0.4, frequency: 392, volume: 0.2, type: 'sine', filterFrequency: 400 },
			{ startTime: 0.3, duration: 0.45, frequency: 294, volume: 0.15, type: 'sine', filterFrequency: 350 },
		],
	},
	hopeless: {
		puffs: [{ startTime: 0, duration: 0.2, frequency: 700, volume: 0.2 }],
		tones: [{ startTime: 0.15, duration: 0.5, frequency: 330, volume: 0.12, type: 'sine', filterFrequency: 450 }],
	},
	empty: {
		puffs: [{ startTime: 0, duration: 0.2, frequency: 700, volume: 0.2 }],
		tones: [{ startTime: 0.15, duration: 0.5, frequency: 330, volume: 0.12, type: 'sine', filterFrequency: 450 }],
	},
	discouraged: {
		puffs: [{ startTime: 0, duration: 0.25, frequency: 800, volume: 0.25 }],
		tones: [{ startTime: 0.08, duration: 0.3, frequency: 523, volume: 0.18, type: 'sine', frequencyEnd: 349 }],
	},
	melancholic: {
		puffs: [{ startTime: 0, duration: 0.3, frequency: 700, volume: 0.18 }],
		tones: [
			{ startTime: 0.1, duration: 0.45, frequency: 440, volume: 0.15, type: 'sine', filterFrequency: 500 },
			{ startTime: 0.3, duration: 0.5, frequency: 392, volume: 0.12, type: 'sine', filterFrequency: 450 },
		],
	},
	homesick: {
		puffs: [{ startTime: 0, duration: 0.25, frequency: 800, volume: 0.15 }],
		tones: [
			{ startTime: 0.1, duration: 0.4, frequency: 440, volume: 0.12, type: 'sine', filterFrequency: 500 },
			{ startTime: 0.3, duration: 0.45, frequency: 392, volume: 0.1, type: 'sine', filterFrequency: 450 },
		],
	},
	hurt: {
		puffs: [{ startTime: 0, duration: 0.3, frequency: 600, volume: 0.25 }],
		tones: [
			{ startTime: 0.1, duration: 0.4, frequency: 392, volume: 0.2, type: 'sine', filterFrequency: 400 },
			{ startTime: 0.3, duration: 0.45, frequency: 294, volume: 0.15, type: 'sine', filterFrequency: 350 },
		],
	},
	miserable: {
		puffs: [{ startTime: 0, duration: 0.3, frequency: 600, volume: 0.25 }],
		tones: [
			{ startTime: 0.1, duration: 0.4, frequency: 392, volume: 0.2, type: 'sine', filterFrequency: 400 },
			{ startTime: 0.3, duration: 0.45, frequency: 294, volume: 0.15, type: 'sine', filterFrequency: 350 },
		],
	},
	regretful: {
		puffs: [{ startTime: 0, duration: 0.3, frequency: 700, volume: 0.18 }],
		tones: [
			{ startTime: 0.1, duration: 0.45, frequency: 440, volume: 0.15, type: 'sine', filterFrequency: 500 },
			{ startTime: 0.3, duration: 0.5, frequency: 392, volume: 0.12, type: 'sine', filterFrequency: 450 },
		],
	},
	ashamed: {
		puffs: [{ startTime: 0, duration: 0.25, frequency: 800, volume: 0.25 }],
		tones: [{ startTime: 0.08, duration: 0.3, frequency: 523, volume: 0.18, type: 'sine', frequencyEnd: 349 }],
	},
	inferior: {
		puffs: [{ startTime: 0, duration: 0.25, frequency: 800, volume: 0.25 }],
		tones: [{ startTime: 0.08, duration: 0.3, frequency: 523, volume: 0.18, type: 'sine', frequencyEnd: 349 }],
	},

	// ========== ANXIOUS / FEARFUL ==========
	anxious: {
		puffs: [
			{ startTime: 0, duration: 0.08, frequency: 1800, volume: 0.2 },
			{ startTime: 0.12, duration: 0.08, frequency: 1900, volume: 0.22 },
		],
		tones: [{ startTime: 0.03, duration: 0.25, frequency: 440, volume: 0.15, type: 'sine' }],
		description: 'Tight, quick puffs with uncertain wobble',
	},
	worried: {
		puffs: [{ startTime: 0, duration: 0.15, frequency: 1200, volume: 0.2 }],
		tones: [{ startTime: 0.05, duration: 0.25, frequency: 349, volume: 0.15, type: 'sine', frequencyEnd: 392 }],
	},
	afraid: {
		puffs: [
			{ startTime: 0, duration: 0.08, frequency: 1800, volume: 0.2 },
			{ startTime: 0.12, duration: 0.08, frequency: 1900, volume: 0.22 },
		],
		tones: [{ startTime: 0.03, duration: 0.25, frequency: 440, volume: 0.15, type: 'sine' }],
	},
	terrified: {
		puffs: [{ startTime: 0, duration: 0.04, frequency: 3500, volume: 0.3 }],
		tones: [
			{ startTime: 0, duration: 0.08, frequency: 1047, volume: 0.25, type: 'sine' },
			{ startTime: 0.05, duration: 0.15, frequency: 880, volume: 0.15, type: 'sine' },
		],
	},
	panicked: {
		puffs: [{ startTime: 0, duration: 0.04, frequency: 3500, volume: 0.3 }],
		tones: [
			{ startTime: 0, duration: 0.08, frequency: 1047, volume: 0.25, type: 'sine' },
			{ startTime: 0.05, duration: 0.15, frequency: 880, volume: 0.15, type: 'sine' },
		],
	},
	nervous: {
		puffs: [
			{ startTime: 0, duration: 0.05, frequency: 2000, volume: 0.18 },
			{ startTime: 0.08, duration: 0.05, frequency: 2100, volume: 0.18 },
			{ startTime: 0.15, duration: 0.06, frequency: 2000, volume: 0.16 },
		],
		tones: [{ startTime: 0.04, duration: 0.2, frequency: 494, volume: 0.12, type: 'sine' }],
	},
	uneasy: {
		puffs: [{ startTime: 0, duration: 0.15, frequency: 1200, volume: 0.2 }],
		tones: [{ startTime: 0.05, duration: 0.25, frequency: 349, volume: 0.15, type: 'sine', frequencyEnd: 392 }],
	},
	insecure: {
		puffs: [
			{ startTime: 0, duration: 0.05, frequency: 2000, volume: 0.18 },
			{ startTime: 0.08, duration: 0.05, frequency: 2100, volume: 0.18 },
			{ startTime: 0.15, duration: 0.06, frequency: 2000, volume: 0.16 },
		],
		tones: [{ startTime: 0.04, duration: 0.2, frequency: 494, volume: 0.12, type: 'sine' }],
	},
	overwhelmed: {
		puffs: [
			{ startTime: 0, duration: 0.08, frequency: 1800, volume: 0.2 },
			{ startTime: 0.12, duration: 0.08, frequency: 1900, volume: 0.22 },
		],
		tones: [{ startTime: 0.03, duration: 0.25, frequency: 440, volume: 0.15, type: 'sine' }],
	},
	stressed: {
		puffs: [
			{ startTime: 0, duration: 0.08, frequency: 1800, volume: 0.2 },
			{ startTime: 0.12, duration: 0.08, frequency: 1900, volume: 0.22 },
		],
		tones: [{ startTime: 0.03, duration: 0.25, frequency: 440, volume: 0.15, type: 'sine' }],
	},
	tense: {
		puffs: [
			{ startTime: 0, duration: 0.08, frequency: 1800, volume: 0.2 },
			{ startTime: 0.12, duration: 0.08, frequency: 1900, volume: 0.22 },
		],
		tones: [{ startTime: 0.03, duration: 0.25, frequency: 440, volume: 0.15, type: 'sine' }],
	},
	apprehensive: {
		puffs: [{ startTime: 0, duration: 0.15, frequency: 1200, volume: 0.2 }],
		tones: [{ startTime: 0.05, duration: 0.25, frequency: 349, volume: 0.15, type: 'sine', frequencyEnd: 392 }],
	},
	startled: {
		puffs: [{ startTime: 0, duration: 0.04, frequency: 3500, volume: 0.3 }],
		tones: [
			{ startTime: 0, duration: 0.08, frequency: 1047, volume: 0.25, type: 'sine' },
			{ startTime: 0.05, duration: 0.15, frequency: 880, volume: 0.15, type: 'sine' },
		],
	},
	suspicious: {
		puffs: [{ startTime: 0, duration: 0.15, frequency: 1200, volume: 0.2 }],
		tones: [{ startTime: 0.05, duration: 0.25, frequency: 349, volume: 0.15, type: 'sine', frequencyEnd: 392 }],
	},
	vulnerable: {
		puffs: [
			{ startTime: 0, duration: 0.05, frequency: 2000, volume: 0.18 },
			{ startTime: 0.08, duration: 0.05, frequency: 2100, volume: 0.18 },
			{ startTime: 0.15, duration: 0.06, frequency: 2000, volume: 0.16 },
		],
		tones: [{ startTime: 0.04, duration: 0.2, frequency: 494, volume: 0.12, type: 'sine' }],
	},

	// ========== ANGRY / FRUSTRATED ==========
	annoyed: {
		puffs: [{ startTime: 0, duration: 0.1, frequency: 1000, volume: 0.25 }],
		tones: [{ startTime: 0.03, duration: 0.2, frequency: 294, volume: 0.18, type: 'sine', filterFrequency: 400 }],
	},
	irritated: {
		puffs: [{ startTime: 0, duration: 0.1, frequency: 1000, volume: 0.25 }],
		tones: [{ startTime: 0.03, duration: 0.2, frequency: 294, volume: 0.18, type: 'sine', filterFrequency: 400 }],
	},
	frustrated: {
		puffs: [{ startTime: 0, duration: 0.12, frequency: 900, volume: 0.28 }],
		tones: [
			{ startTime: 0.04, duration: 0.15, frequency: 349, volume: 0.2, type: 'sine' },
			{ startTime: 0.12, duration: 0.12, frequency: 330, volume: 0.18, type: 'sine' },
		],
	},
	angry: {
		puffs: [{ startTime: 0, duration: 0.12, frequency: 900, volume: 0.28 }],
		tones: [
			{ startTime: 0.04, duration: 0.15, frequency: 349, volume: 0.2, type: 'sine' },
			{ startTime: 0.12, duration: 0.12, frequency: 330, volume: 0.18, type: 'sine' },
		],
	},
	enraged: {
		puffs: [{ startTime: 0, duration: 0.12, frequency: 900, volume: 0.28 }],
		tones: [
			{ startTime: 0.04, duration: 0.15, frequency: 349, volume: 0.2, type: 'sine' },
			{ startTime: 0.12, duration: 0.12, frequency: 330, volume: 0.18, type: 'sine' },
		],
	},
	bitter: {
		puffs: [{ startTime: 0, duration: 0.12, frequency: 900, volume: 0.28 }],
		tones: [
			{ startTime: 0.04, duration: 0.15, frequency: 349, volume: 0.2, type: 'sine' },
			{ startTime: 0.12, duration: 0.12, frequency: 330, volume: 0.18, type: 'sine' },
		],
	},
	resentful: {
		puffs: [{ startTime: 0, duration: 0.1, frequency: 1000, volume: 0.25 }],
		tones: [{ startTime: 0.03, duration: 0.2, frequency: 294, volume: 0.18, type: 'sine', filterFrequency: 400 }],
	},
	jealous: {
		puffs: [{ startTime: 0, duration: 0.1, frequency: 1000, volume: 0.25 }],
		tones: [{ startTime: 0.03, duration: 0.2, frequency: 294, volume: 0.18, type: 'sine', filterFrequency: 400 }],
	},
	envious: {
		puffs: [{ startTime: 0, duration: 0.1, frequency: 1000, volume: 0.25 }],
		tones: [{ startTime: 0.03, duration: 0.2, frequency: 294, volume: 0.18, type: 'sine', filterFrequency: 400 }],
	},
	indignant: {
		puffs: [{ startTime: 0, duration: 0.12, frequency: 900, volume: 0.28 }],
		tones: [
			{ startTime: 0.04, duration: 0.15, frequency: 349, volume: 0.2, type: 'sine' },
			{ startTime: 0.12, duration: 0.12, frequency: 330, volume: 0.18, type: 'sine' },
		],
	},
	impatient: {
		puffs: [
			{ startTime: 0, duration: 0.04, frequency: 1500, volume: 0.2 },
			{ startTime: 0.08, duration: 0.04, frequency: 1500, volume: 0.2 },
			{ startTime: 0.16, duration: 0.04, frequency: 1500, volume: 0.22 },
		],
		tones: [{ startTime: 0.06, duration: 0.1, frequency: 523, volume: 0.15, type: 'sine' }],
	},
	hostile: {
		puffs: [{ startTime: 0, duration: 0.12, frequency: 900, volume: 0.28 }],
		tones: [
			{ startTime: 0.04, duration: 0.15, frequency: 349, volume: 0.2, type: 'sine' },
			{ startTime: 0.12, duration: 0.12, frequency: 330, volume: 0.18, type: 'sine' },
		],
	},
	contemptuous: {
		puffs: [{ startTime: 0, duration: 0.1, frequency: 1000, volume: 0.25 }],
		tones: [{ startTime: 0.03, duration: 0.2, frequency: 294, volume: 0.18, type: 'sine', filterFrequency: 400 }],
	},

	// ========== TIRED / DRAINED ==========
	tired: {
		puffs: [{ startTime: 0, duration: 0.35, frequency: 500, volume: 0.2 }],
		tones: [{ startTime: 0.1, duration: 0.4, frequency: 330, volume: 0.12, type: 'sine', filterFrequency: 350 }],
	},
	exhausted: {
		puffs: [{ startTime: 0, duration: 0.45, frequency: 400, volume: 0.18 }],
		tones: [{ startTime: 0.15, duration: 0.5, frequency: 294, volume: 0.1, type: 'sine', filterFrequency: 300 }],
	},
	drained: {
		puffs: [{ startTime: 0, duration: 0.45, frequency: 400, volume: 0.18 }],
		tones: [{ startTime: 0.15, duration: 0.5, frequency: 294, volume: 0.1, type: 'sine', filterFrequency: 300 }],
	},
	burnedOut: {
		puffs: [{ startTime: 0, duration: 0.45, frequency: 400, volume: 0.18 }],
		tones: [{ startTime: 0.15, duration: 0.5, frequency: 294, volume: 0.1, type: 'sine', filterFrequency: 300 }],
	},
	numb: {
		puffs: [{ startTime: 0, duration: 0.45, frequency: 400, volume: 0.18 }],
		tones: [{ startTime: 0.15, duration: 0.5, frequency: 294, volume: 0.1, type: 'sine', filterFrequency: 300 }],
	},
	bored: {
		puffs: [{ startTime: 0, duration: 0.25, frequency: 600, volume: 0.15 }],
		tones: [{ startTime: 0.1, duration: 0.3, frequency: 349, volume: 0.1, type: 'sine', filterFrequency: 400 }],
	},
	unmotivated: {
		puffs: [{ startTime: 0, duration: 0.25, frequency: 600, volume: 0.15 }],
		tones: [{ startTime: 0.1, duration: 0.3, frequency: 349, volume: 0.1, type: 'sine', filterFrequency: 400 }],
	},
	apathetic: {
		puffs: [{ startTime: 0, duration: 0.25, frequency: 600, volume: 0.15 }],
		tones: [{ startTime: 0.1, duration: 0.3, frequency: 349, volume: 0.1, type: 'sine', filterFrequency: 400 }],
	},
	restless: {
		puffs: [{ startTime: 0, duration: 0.35, frequency: 500, volume: 0.2 }],
		tones: [{ startTime: 0.1, duration: 0.4, frequency: 330, volume: 0.12, type: 'sine', filterFrequency: 350 }],
	},

	// ========== CALM / GROUNDED ==========
	calm: {
		puffs: [{ startTime: 0, duration: 0.3, frequency: 600, volume: 0.12 }],
		tones: [{ startTime: 0.1, duration: 0.5, frequency: 392, volume: 0.1, type: 'sine', filterFrequency: 500 }],
	},
	relaxed: {
		puffs: [{ startTime: 0, duration: 0.35, frequency: 700, volume: 0.15 }],
		tones: [
			{ startTime: 0.15, duration: 0.45, frequency: 440, volume: 0.1, type: 'sine', filterFrequency: 800 },
			{ startTime: 0.35, duration: 0.5, frequency: 392, volume: 0.08, type: 'sine', filterFrequency: 800 },
		],
	},
	atEase: {
		puffs: [{ startTime: 0, duration: 0.35, frequency: 700, volume: 0.15 }],
		tones: [
			{ startTime: 0.15, duration: 0.45, frequency: 440, volume: 0.1, type: 'sine', filterFrequency: 800 },
			{ startTime: 0.35, duration: 0.5, frequency: 392, volume: 0.08, type: 'sine', filterFrequency: 800 },
		],
	},
	balanced: {
		puffs: [{ startTime: 0, duration: 0.3, frequency: 600, volume: 0.12 }],
		tones: [{ startTime: 0.1, duration: 0.5, frequency: 392, volume: 0.1, type: 'sine', filterFrequency: 500 }],
	},
	stable: {
		puffs: [{ startTime: 0, duration: 0.25, frequency: 500, volume: 0.2 }],
		tones: [{ startTime: 0.1, duration: 0.4, frequency: 262, volume: 0.15, type: 'sine', filterFrequency: 350 }],
	},
	secure: {
		puffs: [{ startTime: 0, duration: 0.3, frequency: 700, volume: 0.15 }],
		tones: [
			{ startTime: 0.1, duration: 0.4, frequency: 349, volume: 0.12, type: 'sine', filterFrequency: 800 },
			{ startTime: 0.25, duration: 0.45, frequency: 440, volume: 0.1, type: 'sine', filterFrequency: 800 },
		],
	},
	safe: {
		puffs: [{ startTime: 0, duration: 0.3, frequency: 700, volume: 0.15 }],
		tones: [
			{ startTime: 0.1, duration: 0.4, frequency: 349, volume: 0.12, type: 'sine', filterFrequency: 800 },
			{ startTime: 0.25, duration: 0.45, frequency: 440, volume: 0.1, type: 'sine', filterFrequency: 800 },
		],
	},
	centered: {
		puffs: [{ startTime: 0, duration: 0.25, frequency: 500, volume: 0.2 }],
		tones: [{ startTime: 0.1, duration: 0.4, frequency: 262, volume: 0.15, type: 'sine', filterFrequency: 350 }],
	},
	grounded: {
		puffs: [{ startTime: 0, duration: 0.25, frequency: 500, volume: 0.2 }],
		tones: [{ startTime: 0.1, duration: 0.4, frequency: 262, volume: 0.15, type: 'sine', filterFrequency: 350 }],
	},
	accepting: {
		puffs: [{ startTime: 0, duration: 0.3, frequency: 600, volume: 0.12 }],
		tones: [{ startTime: 0.1, duration: 0.5, frequency: 392, volume: 0.1, type: 'sine', filterFrequency: 500 }],
	},

	// ========== CONNECTED / SOCIAL ==========
	connected: {
		puffs: [{ startTime: 0, duration: 0.2, frequency: 1200, volume: 0.18 }],
		tones: [
			{ startTime: 0.08, duration: 0.3, frequency: 440, volume: 0.15, type: 'sine', filterFrequency: 800 },
			{ startTime: 0.12, duration: 0.32, frequency: 523, volume: 0.12, type: 'sine', filterFrequency: 800 },
		],
	},
	accepted: {
		puffs: [{ startTime: 0, duration: 0.15, frequency: 1500, volume: 0.2 }],
		tones: [
			{ startTime: 0.05, duration: 0.25, frequency: 440, volume: 0.15, type: 'sine', filterFrequency: 800 },
			{ startTime: 0.15, duration: 0.3, frequency: 523, volume: 0.18, type: 'sine', filterFrequency: 800 },
		],
	},
	included: {
		puffs: [{ startTime: 0, duration: 0.2, frequency: 1200, volume: 0.18 }],
		tones: [
			{ startTime: 0.08, duration: 0.3, frequency: 440, volume: 0.15, type: 'sine', filterFrequency: 800 },
			{ startTime: 0.12, duration: 0.32, frequency: 523, volume: 0.12, type: 'sine', filterFrequency: 800 },
		],
	},
	belonging: {
		puffs: [{ startTime: 0, duration: 0.2, frequency: 1200, volume: 0.18 }],
		tones: [
			{ startTime: 0.08, duration: 0.3, frequency: 440, volume: 0.15, type: 'sine', filterFrequency: 800 },
			{ startTime: 0.12, duration: 0.32, frequency: 523, volume: 0.12, type: 'sine', filterFrequency: 800 },
		],
	},
	appreciated: {
		puffs: [{ startTime: 0, duration: 0.15, frequency: 1500, volume: 0.2 }],
		tones: [
			{ startTime: 0.05, duration: 0.25, frequency: 440, volume: 0.15, type: 'sine', filterFrequency: 800 },
			{ startTime: 0.15, duration: 0.3, frequency: 523, volume: 0.18, type: 'sine', filterFrequency: 800 },
		],
	},
	valued: {
		puffs: [{ startTime: 0, duration: 0.15, frequency: 1500, volume: 0.2 }],
		tones: [
			{ startTime: 0.05, duration: 0.25, frequency: 440, volume: 0.15, type: 'sine', filterFrequency: 800 },
			{ startTime: 0.15, duration: 0.3, frequency: 523, volume: 0.18, type: 'sine', filterFrequency: 800 },
		],
	},
	respected: {
		puffs: [{ startTime: 0, duration: 0.15, frequency: 1500, volume: 0.2 }],
		tones: [
			{ startTime: 0.05, duration: 0.25, frequency: 440, volume: 0.15, type: 'sine', filterFrequency: 800 },
			{ startTime: 0.15, duration: 0.3, frequency: 523, volume: 0.18, type: 'sine', filterFrequency: 800 },
		],
	},
	supported: {
		puffs: [{ startTime: 0, duration: 0.25, frequency: 900, volume: 0.18 }],
		tones: [
			{ startTime: 0.1, duration: 0.35, frequency: 349, volume: 0.12, type: 'sine', filterFrequency: 800 },
			{ startTime: 0.15, duration: 0.4, frequency: 440, volume: 0.1, type: 'sine', filterFrequency: 800 },
		],
	},
	protective: {
		puffs: [{ startTime: 0, duration: 0.25, frequency: 900, volume: 0.18 }],
		tones: [
			{ startTime: 0.1, duration: 0.35, frequency: 349, volume: 0.12, type: 'sine', filterFrequency: 800 },
			{ startTime: 0.15, duration: 0.4, frequency: 440, volume: 0.1, type: 'sine', filterFrequency: 800 },
		],
	},
	compassionate: {
		puffs: [{ startTime: 0, duration: 0.2, frequency: 1200, volume: 0.18 }],
		tones: [
			{ startTime: 0.08, duration: 0.3, frequency: 440, volume: 0.15, type: 'sine', filterFrequency: 800 },
			{ startTime: 0.12, duration: 0.32, frequency: 523, volume: 0.12, type: 'sine', filterFrequency: 800 },
		],
	},
	empathetic: {
		puffs: [{ startTime: 0, duration: 0.2, frequency: 1200, volume: 0.18 }],
		tones: [
			{ startTime: 0.08, duration: 0.3, frequency: 440, volume: 0.15, type: 'sine', filterFrequency: 800 },
			{ startTime: 0.12, duration: 0.32, frequency: 523, volume: 0.12, type: 'sine', filterFrequency: 800 },
		],
	},

	// ========== MIXED / COMPLICATED ==========
	conflicted: {
		puffs: [{ startTime: 0, duration: 0.12, frequency: 1200, volume: 0.18 }],
		tones: [
			{ startTime: 0.04, duration: 0.2, frequency: 440, volume: 0.12, type: 'sine', frequencyEnd: 494 },
			{ startTime: 0.15, duration: 0.15, frequency: 466, volume: 0.1, type: 'sine' },
		],
	},
	confused: {
		puffs: [{ startTime: 0, duration: 0.12, frequency: 1200, volume: 0.18 }],
		tones: [
			{ startTime: 0.04, duration: 0.2, frequency: 440, volume: 0.12, type: 'sine', frequencyEnd: 494 },
			{ startTime: 0.15, duration: 0.15, frequency: 466, volume: 0.1, type: 'sine' },
		],
	},
	ambivalent: {
		puffs: [{ startTime: 0, duration: 0.12, frequency: 1200, volume: 0.18 }],
		tones: [
			{ startTime: 0.04, duration: 0.2, frequency: 440, volume: 0.12, type: 'sine', frequencyEnd: 494 },
			{ startTime: 0.15, duration: 0.15, frequency: 466, volume: 0.1, type: 'sine' },
		],
	},
	nostalgic: {
		puffs: [{ startTime: 0, duration: 0.25, frequency: 800, volume: 0.15 }],
		tones: [
			{ startTime: 0.1, duration: 0.4, frequency: 440, volume: 0.12, type: 'sine', filterFrequency: 500 },
			{ startTime: 0.3, duration: 0.45, frequency: 392, volume: 0.1, type: 'sine', filterFrequency: 450 },
		],
	},
	guilty: {
		puffs: [{ startTime: 0, duration: 0.25, frequency: 800, volume: 0.25 }],
		tones: [{ startTime: 0.08, duration: 0.3, frequency: 523, volume: 0.18, type: 'sine', frequencyEnd: 349 }],
	},
	embarrassed: {
		puffs: [
			{ startTime: 0, duration: 0.05, frequency: 2000, volume: 0.18 },
			{ startTime: 0.08, duration: 0.05, frequency: 2100, volume: 0.18 },
			{ startTime: 0.15, duration: 0.06, frequency: 2000, volume: 0.16 },
		],
		tones: [{ startTime: 0.04, duration: 0.2, frequency: 494, volume: 0.12, type: 'sine' }],
	},
	surprised: {
		puffs: [{ startTime: 0, duration: 0.06, frequency: 2800, volume: 0.25 }],
		tones: [{ startTime: 0.02, duration: 0.15, frequency: 659, volume: 0.2, type: 'sine', frequencyEnd: 988 }],
	},
	shocked: {
		puffs: [{ startTime: 0, duration: 0.04, frequency: 3500, volume: 0.3 }],
		tones: [
			{ startTime: 0, duration: 0.08, frequency: 1047, volume: 0.25, type: 'sine' },
			{ startTime: 0.05, duration: 0.15, frequency: 880, volume: 0.15, type: 'sine' },
		],
	},
	awestruck: {
		puffs: [{ startTime: 0, duration: 0.2, frequency: 1500, volume: 0.2 }],
		tones: [
			{ startTime: 0.08, duration: 0.4, frequency: 440, volume: 0.15, type: 'sine' },
			{ startTime: 0.1, duration: 0.38, frequency: 660, volume: 0.12, type: 'sine' },
			{ startTime: 0.12, duration: 0.36, frequency: 880, volume: 0.09, type: 'sine' },
		],
	},
	skeptical: {
		puffs: [{ startTime: 0, duration: 0.12, frequency: 1200, volume: 0.18 }],
		tones: [
			{ startTime: 0.04, duration: 0.2, frequency: 440, volume: 0.12, type: 'sine', frequencyEnd: 494 },
			{ startTime: 0.15, duration: 0.15, frequency: 466, volume: 0.1, type: 'sine' },
		],
	},
}

// ============================================================================
// SOUND SERVICE
// ============================================================================

/**
 * Sound Service - Provides centralized sound management for Schmancy components
 *
 * Following the theme service pattern:
 * - Has default sounds as fallback
 * - Can receive custom sound theme from AI
 * - Reactive observables for state changes
 * - Persists settings to session storage
 */
class SoundService {
	private static instance: SoundService

	/** Audio context for Web Audio API */
	private audioContext: AudioContext | null = null

	// Public observables derived from context
	// Don't use distinctUntilChanged for theme - we need all emissions including storage loads
	public readonly theme$ = SoundContext.$.pipe(
		map(settings => settings.theme),
		shareReplay(1)
	)

	public readonly volume$ = SoundContext.$.pipe(
		map(settings => settings.volume),
		distinctUntilChanged(),
		shareReplay(1)
	)

	public readonly muted$ = SoundContext.$.pipe(
		map(settings => settings.muted),
		distinctUntilChanged(),
		shareReplay(1)
	)

	/** BehaviorSubject for current theme name (for debugging/display) */
	private readonly _themeName$ = new BehaviorSubject<string>('default')
	public readonly themeName$ = this._themeName$.asObservable()

	// Getters for synchronous access
	get theme(): SoundTheme | null {
		return SoundContext.value.theme
	}

	get volume(): number {
		return SoundContext.value.volume
	}

	get muted(): boolean {
		return SoundContext.value.muted
	}

	get themeName(): string {
		return this.theme?.name ?? 'default'
	}

	private constructor() {
		// Subscribe to theme changes to update theme name
		this.theme$.subscribe(theme => {
			this._themeName$.next(theme?.name ?? 'default')
		})
	}

	// ==========================================================================
	// AUDIO CONTEXT MANAGEMENT
	// ==========================================================================

	private getContext(): AudioContext {
		if (!this.audioContext) {
			const AudioContextClass =
				window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
			this.audioContext = new AudioContextClass()
		}
		if (this.audioContext.state === 'suspended') {
			this.audioContext.resume()
		}
		return this.audioContext
	}

	// ==========================================================================
	// SOUND PRIMITIVES
	// ==========================================================================

	/** Play a puff (breath/air) sound */
	private playPuff(startTime: number, params: PuffParams, masterVolume: number): void {
		const ctx = this.getContext()
		const bufferSize = Math.floor(ctx.sampleRate * params.duration)
		const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
		const data = buffer.getChannelData(0)

		for (let i = 0; i < bufferSize; i++) {
			data[i] = Math.random() * 2 - 1
		}

		const noise = ctx.createBufferSource()
		noise.buffer = buffer

		const filter = ctx.createBiquadFilter()
		filter.type = 'bandpass'
		filter.frequency.value = params.frequency
		filter.Q.value = 0.7

		const gain = ctx.createGain()
		gain.gain.setValueAtTime(0, startTime)
		gain.gain.linearRampToValueAtTime(params.volume * masterVolume, startTime + 0.015)
		gain.gain.exponentialRampToValueAtTime(0.001, startTime + params.duration)

		noise.connect(filter).connect(gain).connect(ctx.destination)
		noise.start(startTime)
		noise.stop(startTime + params.duration)
	}

	/** Play a tone (musical) sound */
	private playTone(startTime: number, params: ToneParams, masterVolume: number): void {
		const ctx = this.getContext()
		const osc = ctx.createOscillator()
		const gain = ctx.createGain()

		osc.type = params.type
		osc.frequency.setValueAtTime(params.frequency, startTime)

		if (params.frequencyEnd) {
			osc.frequency.exponentialRampToValueAtTime(params.frequencyEnd, startTime + params.duration * 0.8)
		}

		// Apply filter if specified
		let lastNode: AudioNode = osc
		if (params.filterFrequency) {
			const filter = ctx.createBiquadFilter()
			filter.type = 'lowpass'
			filter.frequency.value = params.filterFrequency
			osc.connect(filter)
			lastNode = filter
		}

		gain.gain.setValueAtTime(0, startTime)
		gain.gain.linearRampToValueAtTime(params.volume * masterVolume, startTime + 0.02)
		gain.gain.exponentialRampToValueAtTime(0.001, startTime + params.duration)

		lastNode.connect(gain).connect(ctx.destination)
		osc.start(startTime)
		osc.stop(startTime + params.duration)
	}

	// ==========================================================================
	// PUBLIC API - THEME MANAGEMENT
	// ==========================================================================

	/**
	 * Set a custom sound theme (e.g., from AI generation)
	 * @param theme The sound theme to apply
	 */
	public setTheme(theme: SoundTheme): void {
		SoundContext.set({ theme })
	}

	/**
	 * Reset to default sounds (removes custom theme)
	 */
	public resetTheme(): void {
		SoundContext.set({ theme: null })
	}

	/**
	 * Set volume level (0.0 - 1.0)
	 * @param volume Volume level
	 */
	public setVolume(volume: number): void {
		SoundContext.set({ volume: Math.max(0, Math.min(1, volume)) })
	}

	/**
	 * Mute all sounds
	 */
	public mute(): void {
		SoundContext.set({ muted: true })
	}

	/**
	 * Unmute sounds
	 */
	public unmute(): void {
		SoundContext.set({ muted: false })
	}

	/**
	 * Toggle mute state
	 */
	public toggleMute(): void {
		SoundContext.set({ muted: !this.muted })
	}

	// ==========================================================================
	// PUBLIC API - SOUND PLAYBACK
	// ==========================================================================

	/**
	 * Get the sound definition for a feeling
	 * Uses custom theme if available, falls back to defaults
	 */
	public getSoundForFeeling(feeling: Feeling): FeelingSound {
		const customTheme = this.theme

		// Try custom theme first
		if (customTheme?.feelings?.[feeling]) {
			return customTheme.feelings[feeling]!
		}

		// Try category default from custom theme
		if (customTheme?.categoryDefaults) {
			const category = this.getCategoryForFeeling(feeling)
			if (customTheme.categoryDefaults[category]) {
				return customTheme.categoryDefaults[category]!
			}
		}

		// Fall back to defaults
		return DEFAULT_SOUNDS[feeling]
	}

	/**
	 * Get the category for a feeling
	 */
	private getCategoryForFeeling(feeling: Feeling): FeelingCategory {
		const happyFeelings: Feeling[] = [
			'joyful',
			'content',
			'excited',
			'proud',
			'hopeful',
			'relieved',
			'grateful',
			'peaceful',
			'playful',
			'amused',
			'curious',
			'inspired',
			'confident',
			'loved',
			'comforted',
			'energized',
			'celebrated',
		]
		const sadFeelings: Feeling[] = [
			'sad',
			'lonely',
			'disappointed',
			'heartbroken',
			'grieving',
			'hopeless',
			'empty',
			'discouraged',
			'melancholic',
			'homesick',
			'hurt',
			'miserable',
			'regretful',
			'ashamed',
			'inferior',
		]
		const anxiousFeelings: Feeling[] = [
			'anxious',
			'worried',
			'afraid',
			'terrified',
			'panicked',
			'nervous',
			'uneasy',
			'insecure',
			'overwhelmed',
			'stressed',
			'tense',
			'apprehensive',
			'startled',
			'suspicious',
			'vulnerable',
		]
		const angryFeelings: Feeling[] = [
			'annoyed',
			'irritated',
			'frustrated',
			'angry',
			'enraged',
			'bitter',
			'resentful',
			'jealous',
			'envious',
			'indignant',
			'impatient',
			'hostile',
			'contemptuous',
		]
		const tiredFeelings: Feeling[] = ['tired', 'exhausted', 'drained', 'burnedOut', 'numb', 'bored', 'unmotivated', 'apathetic', 'restless']
		const calmFeelings: Feeling[] = ['calm', 'relaxed', 'atEase', 'balanced', 'stable', 'secure', 'safe', 'centered', 'grounded', 'accepting']
		const connectedFeelings: Feeling[] = [
			'connected',
			'accepted',
			'included',
			'belonging',
			'appreciated',
			'valued',
			'respected',
			'supported',
			'protective',
			'compassionate',
			'empathetic',
		]

		if (happyFeelings.includes(feeling)) return 'happy'
		if (sadFeelings.includes(feeling)) return 'sad'
		if (anxiousFeelings.includes(feeling)) return 'anxious'
		if (angryFeelings.includes(feeling)) return 'angry'
		if (tiredFeelings.includes(feeling)) return 'tired'
		if (calmFeelings.includes(feeling)) return 'calm'
		if (connectedFeelings.includes(feeling)) return 'connected'
		return 'mixed'
	}

	/**
	 * Play a feeling sound
	 * @param feeling The feeling to play
	 */
	public play(feeling: Feeling): void {
		if (this.muted) return

		const sound = this.getSoundForFeeling(feeling)
		const ctx = this.getContext()
		const now = ctx.currentTime

		// Calculate master volume (theme + user setting)
		const themeMasterVolume = this.theme?.masterVolume ?? 1
		const masterVolume = this.volume * themeMasterVolume

		// Play puffs
		sound.puffs.forEach(puff => {
			this.playPuff(now + puff.startTime, puff, masterVolume)
		})

		// Play tones
		sound.tones.forEach(tone => {
			this.playTone(now + tone.startTime, tone, masterVolume)
		})
	}

	/**
	 * Dispose audio context
	 */
	public dispose(): void {
		if (this.audioContext) {
			this.audioContext.close()
			this.audioContext = null
		}
	}

	/**
	 * Get singleton instance
	 */
	static getInstance(): SoundService {
		if (!SoundService.instance) {
			SoundService.instance = new SoundService()
		}
		return SoundService.instance
	}
}

// ============================================================================
// EXPORTS
// ============================================================================

/** Global sound service singleton */
export const sound = SoundService.getInstance()
export const schmancySound = sound // Alias for consistency with theme

export default sound
