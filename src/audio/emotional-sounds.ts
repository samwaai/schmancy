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

// ============================================================================
// TYPES
// ============================================================================

/** Happy / Pleasant feelings */
export type HappyFeeling =
  | 'joyful' | 'content' | 'excited' | 'proud' | 'hopeful'
  | 'relieved' | 'grateful' | 'peaceful' | 'playful' | 'amused'
  | 'curious' | 'inspired' | 'confident' | 'loved' | 'comforted' | 'energized'
  | 'celebrated'

/** Sad / Low feelings */
export type SadFeeling =
  | 'sad' | 'lonely' | 'disappointed' | 'heartbroken' | 'grieving'
  | 'hopeless' | 'empty' | 'discouraged' | 'melancholic' | 'homesick'
  | 'hurt' | 'miserable' | 'regretful' | 'ashamed' | 'inferior'

/** Anxious / Fearful feelings */
export type AnxiousFeeling =
  | 'anxious' | 'worried' | 'afraid' | 'terrified' | 'panicked'
  | 'nervous' | 'uneasy' | 'insecure' | 'overwhelmed' | 'stressed'
  | 'tense' | 'apprehensive' | 'startled' | 'suspicious' | 'vulnerable'

/** Angry / Frustrated feelings */
export type AngryFeeling =
  | 'annoyed' | 'irritated' | 'frustrated' | 'angry' | 'enraged'
  | 'bitter' | 'resentful' | 'jealous' | 'envious' | 'indignant'
  | 'impatient' | 'hostile' | 'contemptuous'

/** Tired / Drained feelings */
export type TiredFeeling =
  | 'tired' | 'exhausted' | 'drained' | 'burnedOut' | 'numb'
  | 'bored' | 'unmotivated' | 'apathetic' | 'restless'

/** Calm / Grounded feelings */
export type CalmFeeling =
  | 'calm' | 'relaxed' | 'atEase' | 'balanced' | 'stable'
  | 'secure' | 'safe' | 'centered' | 'grounded' | 'accepting'

/** Connected / Social feelings */
export type ConnectedFeeling =
  | 'connected' | 'accepted' | 'included' | 'belonging' | 'appreciated'
  | 'valued' | 'respected' | 'supported' | 'protective' | 'compassionate' | 'empathetic'

/** Mixed / Complicated feelings */
export type MixedFeeling =
  | 'conflicted' | 'confused' | 'ambivalent' | 'nostalgic' | 'guilty'
  | 'embarrassed' | 'surprised' | 'shocked' | 'awestruck' | 'skeptical'

/** All feelings */
export type Feeling =
  | HappyFeeling | SadFeeling | AnxiousFeeling | AngryFeeling
  | TiredFeeling | CalmFeeling | ConnectedFeeling | MixedFeeling

/** Feeling category */
export type FeelingCategory =
  | 'happy' | 'sad' | 'anxious' | 'angry'
  | 'tired' | 'calm' | 'connected' | 'mixed'

// ============================================================================
// SOUND GENERATOR
// ============================================================================

/**
 * Emotional Sound Generator
 * Creates soft, beautiful sounds using Web Audio API
 */
export class EmotionalSoundGenerator {
  private audioContext: AudioContext | null = null
  private volume = 0.15
  private muted = false

  private getContext(): AudioContext {
    if (!this.audioContext) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      this.audioContext = new AudioContextClass()
    }
    // Resume if suspended (autoplay policy)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
    return this.audioContext
  }

  // ==========================================================================
  // CORE SOUND PRIMITIVES
  // ==========================================================================

  /** Soft air puff - the foundation of our sound palette */
  private puff(startTime: number, duration: number, freq: number, vol: number): void {
    const ctx = this.getContext()
    const bufferSize = Math.floor(ctx.sampleRate * duration)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = freq
    filter.Q.value = 0.7

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, startTime)
    gain.gain.linearRampToValueAtTime(vol * this.volume, startTime + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

    noise.connect(filter).connect(gain).connect(ctx.destination)
    noise.start(startTime)
    noise.stop(startTime + duration)
  }

  /** Gentle tone with envelope */
  private tone(
    startTime: number,
    duration: number,
    freq: number,
    vol: number,
    type: OscillatorType = 'sine',
    freqEnd?: number
  ): void {
    const ctx = this.getContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = type
    osc.frequency.setValueAtTime(freq, startTime)
    if (freqEnd) {
      osc.frequency.exponentialRampToValueAtTime(freqEnd, startTime + duration * 0.8)
    }

    gain.gain.setValueAtTime(0, startTime)
    gain.gain.linearRampToValueAtTime(vol * this.volume, startTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

    osc.connect(gain).connect(ctx.destination)
    osc.start(startTime)
    osc.stop(startTime + duration)
  }

  /** Warm filtered tone */
  private warmTone(
    startTime: number,
    duration: number,
    freq: number,
    vol: number,
    filterFreq = 800
  ): void {
    const ctx = this.getContext()
    const osc = ctx.createOscillator()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.value = freq

    filter.type = 'lowpass'
    filter.frequency.value = filterFreq

    gain.gain.setValueAtTime(0, startTime)
    gain.gain.linearRampToValueAtTime(vol * this.volume, startTime + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

    osc.connect(filter).connect(gain).connect(ctx.destination)
    osc.start(startTime)
    osc.stop(startTime + duration)
  }

  /** Shimmer - multiple soft tones */
  private shimmer(startTime: number, duration: number, baseFreq: number, vol: number): void {
    const freqs = [baseFreq, baseFreq * 1.5, baseFreq * 2]
    freqs.forEach((f, i) => {
      this.tone(startTime + i * 0.02, duration - i * 0.02, f, vol * (1 - i * 0.2))
    })
  }

  // ==========================================================================
  // HAPPY / PLEASANT FEELINGS
  // ==========================================================================

  private playJoyful(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Double puff (excited exhale)
    this.puff(now, 0.08, 3000, 0.3)
    this.puff(now + 0.06, 0.1, 3500, 0.35)

    // Rising happy tones
    this.tone(now + 0.02, 0.15, 784, 0.25) // G5
    this.tone(now + 0.1, 0.2, 988, 0.3)    // B5
    this.tone(now + 0.18, 0.25, 1175, 0.25) // D6
  }

  private playContent(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Gentle satisfied sigh
    this.puff(now, 0.2, 1500, 0.25)
    this.warmTone(now + 0.05, 0.3, 523, 0.2) // C5
    this.warmTone(now + 0.15, 0.35, 659, 0.15) // E5
  }

  private playExcited(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Quick ascending puffs
    this.puff(now, 0.06, 2500, 0.25)
    this.puff(now + 0.05, 0.06, 3000, 0.3)
    this.puff(now + 0.1, 0.08, 3500, 0.35)

    // Sparkly ascending tones
    this.tone(now + 0.02, 0.12, 880, 0.2)
    this.tone(now + 0.08, 0.12, 1047, 0.25)
    this.tone(now + 0.14, 0.15, 1319, 0.3)
  }

  private playProud(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Confident puff
    this.puff(now, 0.15, 1800, 0.3)

    // Strong rising chord
    this.tone(now + 0.05, 0.25, 523, 0.25) // C5
    this.tone(now + 0.08, 0.25, 659, 0.2)  // E5
    this.tone(now + 0.11, 0.3, 784, 0.25)  // G5
  }

  private playHopeful(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Light ascending puff
    this.puff(now, 0.12, 2200, 0.2)

    // Gentle rising tone
    this.tone(now + 0.03, 0.3, 659, 0.2, 'sine', 880) // E5 -> A5
  }

  private playRelieved(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Long exhale
    this.puff(now, 0.25, 1200, 0.35)

    // Descending release
    this.warmTone(now + 0.1, 0.35, 659, 0.2)  // E5
    this.warmTone(now + 0.25, 0.4, 523, 0.15) // C5
  }

  private playGrateful(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Warm gentle puff
    this.puff(now, 0.15, 1500, 0.25)

    // Warm embracing tones
    this.warmTone(now + 0.05, 0.3, 440, 0.2)  // A4
    this.warmTone(now + 0.15, 0.35, 523, 0.2) // C5
    this.warmTone(now + 0.25, 0.4, 659, 0.15) // E5
  }

  private playPeaceful(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Very soft puff
    this.puff(now, 0.3, 800, 0.15)

    // Gentle sustained tone
    this.warmTone(now + 0.1, 0.5, 392, 0.12, 500) // G4
  }

  private playPlayful(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Bouncy puffs
    this.puff(now, 0.05, 2800, 0.2)
    this.puff(now + 0.08, 0.05, 3200, 0.25)
    this.puff(now + 0.14, 0.06, 2800, 0.2)

    // Playful tones
    this.tone(now + 0.03, 0.1, 784, 0.2)
    this.tone(now + 0.1, 0.08, 988, 0.25)
    this.tone(now + 0.16, 0.12, 784, 0.2)
  }

  private playAmused(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Little chuckle puffs
    this.puff(now, 0.04, 2500, 0.2)
    this.puff(now + 0.06, 0.04, 2800, 0.22)
    this.puff(now + 0.11, 0.05, 2600, 0.18)

    // Amused tone
    this.tone(now + 0.05, 0.15, 880, 0.15)
  }

  private playCurious(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Questioning puff
    this.puff(now, 0.1, 2000, 0.2)

    // Rising questioning tone
    this.tone(now + 0.03, 0.2, 659, 0.2, 'sine', 880) // E5 -> A5 (question)
  }

  private playInspired(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Bright puff
    this.puff(now, 0.1, 2500, 0.25)

    // Ascending shimmer
    this.shimmer(now + 0.05, 0.3, 523, 0.2)
  }

  private playConfident(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Solid puff
    this.puff(now, 0.12, 1500, 0.3)

    // Strong chord
    this.tone(now + 0.04, 0.2, 523, 0.25) // C5
    this.tone(now + 0.06, 0.22, 659, 0.2) // E5
  }

  private playLoved(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Warm embrace puff
    this.puff(now, 0.2, 1000, 0.2)

    // Warm loving tones
    this.warmTone(now + 0.08, 0.4, 392, 0.18, 600) // G4
    this.warmTone(now + 0.2, 0.45, 494, 0.15, 600)  // B4
  }

  private playComforted(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Soft blanket puff
    this.puff(now, 0.25, 900, 0.18)

    // Gentle descending comfort
    this.warmTone(now + 0.1, 0.35, 523, 0.15) // C5
    this.warmTone(now + 0.25, 0.4, 440, 0.12) // A4
  }

  private playEnergized(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Quick energetic puffs
    this.puff(now, 0.05, 3000, 0.25)
    this.puff(now + 0.04, 0.05, 3500, 0.28)

    // Bright ascending tones
    this.tone(now + 0.02, 0.1, 784, 0.2)
    this.tone(now + 0.08, 0.12, 988, 0.25)
    this.tone(now + 0.14, 0.15, 1175, 0.22)
  }

  private playCelebrated(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Bright celebratory chime
    this.puff(now, 0.08, 2500, 0.2)

    // Triumphant ascending arpeggio (C major -> resolve)
    this.tone(now + 0.02, 0.18, 523, 0.22)   // C5
    this.tone(now + 0.08, 0.18, 659, 0.24)   // E5
    this.tone(now + 0.14, 0.2, 784, 0.26)    // G5
    this.tone(now + 0.22, 0.3, 1047, 0.22)   // C6 - resolution

    // Warm shimmer on resolution
    this.shimmer(now + 0.25, 0.35, 523, 0.12)
  }

  // ==========================================================================
  // SAD / LOW FEELINGS
  // ==========================================================================

  private playSad(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Heavy sigh
    this.puff(now, 0.3, 600, 0.25)

    // Descending sad tone
    this.warmTone(now + 0.1, 0.4, 392, 0.2, 400) // G4
    this.warmTone(now + 0.3, 0.45, 294, 0.15, 350) // D4
  }

  private playLonely(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Single isolated puff
    this.puff(now, 0.2, 700, 0.2)

    // Sparse, distant tone
    this.warmTone(now + 0.15, 0.5, 330, 0.12, 450) // E4
  }

  private playDisappointed(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Deflating puff
    this.puff(now, 0.25, 800, 0.25)

    // Falling tone
    this.tone(now + 0.08, 0.3, 523, 0.18, 'sine', 349) // C5 -> F4
  }

  private playMelancholic(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Wistful puff
    this.puff(now, 0.3, 700, 0.18)

    // Bittersweet tones
    this.warmTone(now + 0.1, 0.45, 440, 0.15, 500) // A4
    this.warmTone(now + 0.3, 0.5, 392, 0.12, 450)  // G4
  }

  // ==========================================================================
  // ANXIOUS / FEARFUL FEELINGS
  // ==========================================================================

  private playAnxious(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Tight, quick puffs
    this.puff(now, 0.08, 1800, 0.2)
    this.puff(now + 0.12, 0.08, 1900, 0.22)

    // Uncertain wobble
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()

    osc.frequency.value = 440
    lfo.frequency.value = 8
    lfoGain.gain.value = 20

    lfo.connect(lfoGain).connect(osc.frequency)

    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(this.volume * 0.15, now + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

    osc.connect(gain).connect(ctx.destination)
    lfo.start(now)
    osc.start(now)
    osc.stop(now + 0.3)
    lfo.stop(now + 0.3)
  }

  private playWorried(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Hesitant puff
    this.puff(now, 0.15, 1200, 0.2)

    // Minor questioning tone
    this.tone(now + 0.05, 0.25, 349, 0.15, 'sine', 392) // F4 -> G4 (uncertain)
  }

  private playNervous(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Quick shallow puffs
    this.puff(now, 0.05, 2000, 0.18)
    this.puff(now + 0.08, 0.05, 2100, 0.18)
    this.puff(now + 0.15, 0.06, 2000, 0.16)

    // Trembling tone
    this.tone(now + 0.04, 0.2, 494, 0.12) // B4
  }

  private playStartled(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Quick sharp puff
    this.puff(now, 0.04, 3500, 0.3)

    // Quick high tone
    this.tone(now, 0.08, 1047, 0.25) // C6
    this.tone(now + 0.05, 0.15, 880, 0.15) // A5
  }

  // ==========================================================================
  // ANGRY / FRUSTRATED FEELINGS
  // ==========================================================================

  private playAnnoyed(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Short frustrated puff
    this.puff(now, 0.1, 1000, 0.25)

    // Low rumble
    this.warmTone(now + 0.03, 0.2, 294, 0.18, 400) // D4
  }

  private playFrustrated(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Tense puff
    this.puff(now, 0.12, 900, 0.28)

    // Blocked feeling
    this.tone(now + 0.04, 0.15, 349, 0.2) // F4
    this.tone(now + 0.12, 0.12, 330, 0.18) // E4
  }

  private playImpatient(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Quick tapping puffs
    this.puff(now, 0.04, 1500, 0.2)
    this.puff(now + 0.08, 0.04, 1500, 0.2)
    this.puff(now + 0.16, 0.04, 1500, 0.22)

    // Urgent tone
    this.tone(now + 0.06, 0.1, 523, 0.15)
  }

  // ==========================================================================
  // TIRED / DRAINED FEELINGS
  // ==========================================================================

  private playTired(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Heavy slow puff
    this.puff(now, 0.35, 500, 0.2)

    // Drooping tone
    this.warmTone(now + 0.1, 0.4, 330, 0.12, 350) // E4
  }

  private playExhausted(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Very slow, heavy exhale
    this.puff(now, 0.45, 400, 0.18)

    // Descending fade
    this.warmTone(now + 0.15, 0.5, 294, 0.1, 300) // D4
  }

  private playBored(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Flat sigh
    this.puff(now, 0.25, 600, 0.15)

    // Monotone
    this.warmTone(now + 0.1, 0.3, 349, 0.1, 400) // F4
  }

  // ==========================================================================
  // CALM / GROUNDED FEELINGS
  // ==========================================================================

  private playCalm(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Slow, peaceful puff
    this.puff(now, 0.3, 600, 0.12)

    // Sustained gentle tone
    this.warmTone(now + 0.1, 0.5, 392, 0.1, 500) // G4
  }

  private playRelaxed(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Long soft exhale
    this.puff(now, 0.35, 700, 0.15)

    // Gentle descending
    this.warmTone(now + 0.15, 0.45, 440, 0.1) // A4
    this.warmTone(now + 0.35, 0.5, 392, 0.08) // G4
  }

  private playGrounded(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Deep centered puff
    this.puff(now, 0.25, 500, 0.2)

    // Low stable tone
    this.warmTone(now + 0.1, 0.4, 262, 0.15, 350) // C4
  }

  private playSafe(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Soft enveloping puff
    this.puff(now, 0.3, 700, 0.15)

    // Warm embracing tones
    this.warmTone(now + 0.1, 0.4, 349, 0.12) // F4
    this.warmTone(now + 0.25, 0.45, 440, 0.1) // A4
  }

  // ==========================================================================
  // CONNECTED / SOCIAL FEELINGS
  // ==========================================================================

  private playConnected(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Warm shared breath
    this.puff(now, 0.2, 1200, 0.18)

    // Harmonious tones
    this.warmTone(now + 0.08, 0.3, 440, 0.15) // A4
    this.warmTone(now + 0.12, 0.32, 523, 0.12) // C5
  }

  private playAppreciated(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Touched puff
    this.puff(now, 0.15, 1500, 0.2)

    // Warm ascending
    this.warmTone(now + 0.05, 0.25, 440, 0.15)
    this.warmTone(now + 0.15, 0.3, 523, 0.18)
  }

  private playSupported(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Held puff
    this.puff(now, 0.25, 900, 0.18)

    // Stable harmonies
    this.warmTone(now + 0.1, 0.35, 349, 0.12)
    this.warmTone(now + 0.15, 0.4, 440, 0.1)
  }

  // ==========================================================================
  // MIXED / COMPLICATED FEELINGS
  // ==========================================================================

  private playNostalgic(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Wistful distant puff
    this.puff(now, 0.25, 800, 0.15)

    // Bittersweet memory tones
    this.warmTone(now + 0.1, 0.4, 440, 0.12, 500) // A4
    this.warmTone(now + 0.3, 0.45, 392, 0.1, 450) // G4
  }

  private playSurprised(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Quick gasp
    this.puff(now, 0.06, 2800, 0.25)

    // Rising tone
    this.tone(now + 0.02, 0.15, 659, 0.2, 'sine', 988) // E5 -> B5
  }

  private playAwestruck(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Wonder-filled breath
    this.puff(now, 0.2, 1500, 0.2)

    // Ascending wonder
    this.shimmer(now + 0.08, 0.4, 440, 0.15)
  }

  private playConfused(): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Uncertain puff
    this.puff(now, 0.12, 1200, 0.18)

    // Questioning wobble
    this.tone(now + 0.04, 0.2, 440, 0.12, 'sine', 494) // A4 -> B4
    this.tone(now + 0.15, 0.15, 466, 0.1)  // Bb4 (chromatic confusion)
  }

  // ==========================================================================
  // PUBLIC API
  // ==========================================================================

  /** Set volume (0.0 - 1.0) */
  setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol))
  }

  /** Get current volume */
  getVolume(): number {
    return this.volume
  }

  /** Mute all sounds */
  mute(): void {
    this.muted = true
  }

  /** Unmute sounds */
  unmute(): void {
    this.muted = false
  }

  /** Check if muted */
  isMuted(): boolean {
    return this.muted
  }

  /** Play a feeling */
  play(feeling: Feeling): void {
    if (this.muted) return

    // Map feelings to their sound methods
    const soundMap: Record<Feeling, () => void> = {
      // Happy
      joyful: () => this.playJoyful(),
      content: () => this.playContent(),
      excited: () => this.playExcited(),
      proud: () => this.playProud(),
      hopeful: () => this.playHopeful(),
      relieved: () => this.playRelieved(),
      grateful: () => this.playGrateful(),
      peaceful: () => this.playPeaceful(),
      playful: () => this.playPlayful(),
      amused: () => this.playAmused(),
      curious: () => this.playCurious(),
      inspired: () => this.playInspired(),
      confident: () => this.playConfident(),
      loved: () => this.playLoved(),
      comforted: () => this.playComforted(),
      energized: () => this.playEnergized(),
      celebrated: () => this.playCelebrated(),

      // Sad
      sad: () => this.playSad(),
      lonely: () => this.playLonely(),
      disappointed: () => this.playDisappointed(),
      heartbroken: () => this.playSad(), // Similar to sad
      grieving: () => this.playSad(),
      hopeless: () => this.playLonely(),
      empty: () => this.playLonely(),
      discouraged: () => this.playDisappointed(),
      melancholic: () => this.playMelancholic(),
      homesick: () => this.playNostalgic(),
      hurt: () => this.playSad(),
      miserable: () => this.playSad(),
      regretful: () => this.playMelancholic(),
      ashamed: () => this.playDisappointed(),
      inferior: () => this.playDisappointed(),

      // Anxious
      anxious: () => this.playAnxious(),
      worried: () => this.playWorried(),
      afraid: () => this.playAnxious(),
      terrified: () => this.playStartled(),
      panicked: () => this.playStartled(),
      nervous: () => this.playNervous(),
      uneasy: () => this.playWorried(),
      insecure: () => this.playNervous(),
      overwhelmed: () => this.playAnxious(),
      stressed: () => this.playAnxious(),
      tense: () => this.playAnxious(),
      apprehensive: () => this.playWorried(),
      startled: () => this.playStartled(),
      suspicious: () => this.playWorried(),
      vulnerable: () => this.playNervous(),

      // Angry
      annoyed: () => this.playAnnoyed(),
      irritated: () => this.playAnnoyed(),
      frustrated: () => this.playFrustrated(),
      angry: () => this.playFrustrated(),
      enraged: () => this.playFrustrated(),
      bitter: () => this.playFrustrated(),
      resentful: () => this.playAnnoyed(),
      jealous: () => this.playAnnoyed(),
      envious: () => this.playAnnoyed(),
      indignant: () => this.playFrustrated(),
      impatient: () => this.playImpatient(),
      hostile: () => this.playFrustrated(),
      contemptuous: () => this.playAnnoyed(),

      // Tired
      tired: () => this.playTired(),
      exhausted: () => this.playExhausted(),
      drained: () => this.playExhausted(),
      burnedOut: () => this.playExhausted(),
      numb: () => this.playExhausted(),
      bored: () => this.playBored(),
      unmotivated: () => this.playBored(),
      apathetic: () => this.playBored(),
      restless: () => this.playTired(),

      // Calm
      calm: () => this.playCalm(),
      relaxed: () => this.playRelaxed(),
      atEase: () => this.playRelaxed(),
      balanced: () => this.playCalm(),
      stable: () => this.playGrounded(),
      secure: () => this.playSafe(),
      safe: () => this.playSafe(),
      centered: () => this.playGrounded(),
      grounded: () => this.playGrounded(),
      accepting: () => this.playCalm(),

      // Connected
      connected: () => this.playConnected(),
      accepted: () => this.playAppreciated(),
      included: () => this.playConnected(),
      belonging: () => this.playConnected(),
      appreciated: () => this.playAppreciated(),
      valued: () => this.playAppreciated(),
      respected: () => this.playAppreciated(),
      supported: () => this.playSupported(),
      protective: () => this.playSupported(),
      compassionate: () => this.playConnected(),
      empathetic: () => this.playConnected(),

      // Mixed
      conflicted: () => this.playConfused(),
      confused: () => this.playConfused(),
      ambivalent: () => this.playConfused(),
      nostalgic: () => this.playNostalgic(),
      guilty: () => this.playDisappointed(),
      embarrassed: () => this.playNervous(),
      surprised: () => this.playSurprised(),
      shocked: () => this.playStartled(),
      awestruck: () => this.playAwestruck(),
      skeptical: () => this.playConfused(),
    }

    const playFn = soundMap[feeling]
    if (playFn) {
      playFn()
    }
  }

  /** Dispose audio context */
  dispose(): void {
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/** Global emotional sound player */
export const $sounds = new EmotionalSoundGenerator()

export default EmotionalSoundGenerator
