# Schmancy Emotional Sound Library - AI Reference

## Overview

A curated collection of soft, elegant sounds organized by emotional categories. Each sound is designed to be non-intrusive, emotionally evocative, and beautiful - inspired by the gentle sounds of nature like soft air puffs and warm tones.

## Quick Start

```typescript
// Import from the main Schmancy package
import { $sounds } from '@mhmo91/schmancy'

// Play a feeling
$sounds.play('joyful')
$sounds.play('relieved')
$sounds.play('curious')

// Adjust volume (0.0 - 1.0)
$sounds.setVolume(0.2)

// Mute/unmute
$sounds.mute()
$sounds.unmute()
```

## Feeling Categories

### 1. Happy / Pleasant
```typescript
type HappyFeeling =
  | 'joyful' | 'content' | 'excited' | 'proud' | 'hopeful'
  | 'relieved' | 'grateful' | 'peaceful' | 'playful' | 'amused'
  | 'curious' | 'inspired' | 'confident' | 'loved' | 'comforted' | 'energized'

// Examples
$sounds.play('joyful')     // Double puff + rising happy tones
$sounds.play('content')    // Gentle satisfied sigh + warm tones
$sounds.play('excited')    // Quick ascending puffs + sparkly tones
$sounds.play('curious')    // Questioning puff + rising tone
$sounds.play('relieved')   // Long exhale + descending release
```

### 2. Sad / Low
```typescript
type SadFeeling =
  | 'sad' | 'lonely' | 'disappointed' | 'heartbroken' | 'grieving'
  | 'hopeless' | 'empty' | 'discouraged' | 'melancholic' | 'homesick'
  | 'hurt' | 'miserable' | 'regretful' | 'ashamed' | 'inferior'

// Examples
$sounds.play('sad')           // Heavy sigh + descending tone
$sounds.play('disappointed')  // Deflating puff + falling tone
$sounds.play('melancholic')   // Wistful puff + bittersweet tones
```

### 3. Anxious / Fearful
```typescript
type AnxiousFeeling =
  | 'anxious' | 'worried' | 'afraid' | 'terrified' | 'panicked'
  | 'nervous' | 'uneasy' | 'insecure' | 'overwhelmed' | 'stressed'
  | 'tense' | 'apprehensive' | 'startled' | 'suspicious' | 'vulnerable'

// Examples
$sounds.play('anxious')   // Tight quick puffs + uncertain wobble
$sounds.play('nervous')   // Quick shallow puffs + trembling tone
$sounds.play('startled')  // Quick sharp puff + high tone
```

### 4. Angry / Frustrated
```typescript
type AngryFeeling =
  | 'annoyed' | 'irritated' | 'frustrated' | 'angry' | 'enraged'
  | 'bitter' | 'resentful' | 'jealous' | 'envious' | 'indignant'
  | 'impatient' | 'hostile' | 'contemptuous'

// Examples
$sounds.play('annoyed')     // Short frustrated puff + low rumble
$sounds.play('frustrated')  // Tense puff + blocked feeling
$sounds.play('impatient')   // Quick tapping puffs + urgent tone
```

### 5. Tired / Drained
```typescript
type TiredFeeling =
  | 'tired' | 'exhausted' | 'drained' | 'burnedOut' | 'numb'
  | 'bored' | 'unmotivated' | 'apathetic' | 'restless'

// Examples
$sounds.play('tired')     // Heavy slow puff + drooping tone
$sounds.play('exhausted') // Very slow heavy exhale + descending fade
$sounds.play('bored')     // Flat sigh + monotone
```

### 6. Calm / Grounded
```typescript
type CalmFeeling =
  | 'calm' | 'relaxed' | 'atEase' | 'balanced' | 'stable'
  | 'secure' | 'safe' | 'centered' | 'grounded' | 'accepting'

// Examples
$sounds.play('calm')      // Slow peaceful puff + sustained gentle tone
$sounds.play('relaxed')   // Long soft exhale + gentle descending
$sounds.play('grounded')  // Deep centered puff + low stable tone
$sounds.play('safe')      // Soft enveloping puff + warm embracing tones
```

### 7. Connected / Social
```typescript
type ConnectedFeeling =
  | 'connected' | 'accepted' | 'included' | 'belonging' | 'appreciated'
  | 'valued' | 'respected' | 'supported' | 'protective' | 'compassionate' | 'empathetic'

// Examples
$sounds.play('connected')   // Warm shared breath + harmonious tones
$sounds.play('appreciated') // Touched puff + warm ascending
$sounds.play('supported')   // Held puff + stable harmonies
```

### 8. Mixed / Complicated
```typescript
type MixedFeeling =
  | 'conflicted' | 'confused' | 'ambivalent' | 'nostalgic' | 'guilty'
  | 'embarrassed' | 'surprised' | 'shocked' | 'awestruck' | 'skeptical'

// Examples
$sounds.play('nostalgic')  // Wistful distant puff + bittersweet memory tones
$sounds.play('surprised')  // Quick gasp + rising tone
$sounds.play('awestruck')  // Wonder-filled breath + ascending shimmer
$sounds.play('confused')   // Uncertain puff + questioning wobble
```

## API Reference

```typescript
class EmotionalSoundGenerator {
  // Play any feeling
  play(feeling: Feeling): void

  // Volume control (0.0 - 1.0, default 0.15)
  setVolume(vol: number): void
  getVolume(): number

  // Mute control
  mute(): void
  unmute(): void
  isMuted(): boolean

  // Cleanup
  dispose(): void
}

// Singleton instance
export const $sounds: EmotionalSoundGenerator
```

## Sound Design Philosophy

All sounds are built from these core primitives:

1. **Puff** - Filtered white noise creating soft air sounds
2. **Tone** - Simple sine wave with gentle envelope
3. **Warm Tone** - Low-pass filtered tone for warmth
4. **Shimmer** - Multiple harmonically related tones

Each feeling combines these primitives with:
- Quick attack (15-30ms) for responsiveness
- Gentle exponential release for softness
- Low default volume (0.15) for subtlety
- Short duration (0.2-0.5s) for non-intrusiveness

## Use Cases

```typescript
// Form validation feedback
onValidationError() {
  $sounds.play('disappointed')
}

onValidationSuccess() {
  $sounds.play('relieved')
}

// User actions
onSaveComplete() {
  $sounds.play('content')
}

onDelete() {
  $sounds.play('sad')
}

// Navigation
onPageLoad() {
  $sounds.play('curious')
}

// Achievements
onMilestoneReached() {
  $sounds.play('proud')
}

// Connections
onFriendJoined() {
  $sounds.play('connected')
}

// Waiting states
onLoadingTimeout() {
  $sounds.play('impatient')
}
```

## Type Exports

```typescript
import type {
  Feeling,
  FeelingCategory,
  HappyFeeling,
  SadFeeling,
  AnxiousFeeling,
  AngryFeeling,
  TiredFeeling,
  CalmFeeling,
  ConnectedFeeling,
  MixedFeeling,
} from '@mhmo91/schmancy'
```

## All 88 Feelings at a Glance

| Category | Feelings |
|----------|----------|
| **Happy** | joyful, content, excited, proud, hopeful, relieved, grateful, peaceful, playful, amused, curious, inspired, confident, loved, comforted, energized |
| **Sad** | sad, lonely, disappointed, heartbroken, grieving, hopeless, empty, discouraged, melancholic, homesick, hurt, miserable, regretful, ashamed, inferior |
| **Anxious** | anxious, worried, afraid, terrified, panicked, nervous, uneasy, insecure, overwhelmed, stressed, tense, apprehensive, startled, suspicious, vulnerable |
| **Angry** | annoyed, irritated, frustrated, angry, enraged, bitter, resentful, jealous, envious, indignant, impatient, hostile, contemptuous |
| **Tired** | tired, exhausted, drained, burnedOut, numb, bored, unmotivated, apathetic, restless |
| **Calm** | calm, relaxed, atEase, balanced, stable, secure, safe, centered, grounded, accepting |
| **Connected** | connected, accepted, included, belonging, appreciated, valued, respected, supported, protective, compassionate, empathetic |
| **Mixed** | conflicted, confused, ambivalent, nostalgic, guilty, embarrassed, surprised, shocked, awestruck, skeptical |
