# Schmancy Audio

> Emotional sound service — synthesizes short, empathetic sounds via Web Audio API keyed on feelings (joyful, tense, calm, etc.). No assets. No external players. Just tones + puffs generated on demand.

## Usage
```typescript
import { sound } from '@mhmo91/schmancy'

sound.play('joyful')     // trigger a feeling sound
sound.setVolume(0.2)     // 0..1
sound.setMuted(true)
sound.resetTheme()       // back to defaults
```

## Feelings
Organized by emotional category:

| Category | Feelings |
|----------|----------|
| Happy | `joyful`, `content`, `excited`, `grateful`, `proud`, `loved` |
| Sad | `sad`, `disappointed`, `hurt`, `lonely`, `melancholy` |
| Anxious | `worried`, `nervous`, `overwhelmed`, `tense` |
| Angry | `frustrated`, `angry`, `annoyed` |
| Tired | `tired`, `drained`, `bored` |
| Calm | `calm`, `peaceful`, `relaxed`, `focused` |
| Connected | `connected`, `supported`, `welcomed` |
| Mixed | `confused`, `nostalgic`, `bittersweet` |

(See `mood-audio.types.ts` for the authoritative list.)

## Observable API
```typescript
sound.theme$.subscribe(theme => console.log(theme?.name ?? 'default'))
sound.volume$.subscribe(v => {})
sound.muted$.subscribe(m => {})
```

## Settings Persistence
Volume, mute, and custom theme persist to `localStorage` under key `schmancy-sound-settings` (via `state(...).local(...)` from `@mhmo91/schmancy/state`).

## AI-Generated Themes
```typescript
import type { SoundTheme } from '@mhmo91/schmancy'

const customTheme: SoundTheme = {
  name: 'ocean',
  sounds: {
    joyful: { puffs: [...], tones: [...] },
    // partial override — falls through to defaults for anything omitted
  }
}

sound.setTheme(customTheme)
```

Each `FeelingSound` consists of:
- **puffs** — short bursts (air/noise, e.g. `{ startTime, duration, frequency, volume }`)
- **tones** — oscillators (`sine`/`triangle`/`square`/`sawtooth` with envelope)

## Built-in Feedback Hooks
Other Schmancy components play these automatically:
- [`schmancy-connectivity-status`](./connectivity.md) on offline/online.
- Some success/error paths in notifications and dialogs via the `$sounds` legacy helper.

## Legacy API
- `$sounds` — older generator exported for compatibility.
- `EmotionalSoundGenerator` — underlying class.

Prefer `sound` for new code.
