# Theme Service

Comprehensive Material Design 3 theme management with reactive observables, automatic persistence, and a complete token system for colors, typography, motion, and more.

## Import

```typescript
import { theme } from '@schmancy/theme'
// Alternative: schmancyTheme
```

## Core Concepts

- **Scheme**: Color mode (`'dark'` | `'light'` | `'auto'`)
- **Resolved Scheme**: Actual theme after resolving `'auto'` based on system preferences
- **Color**: Primary theme color in hex format
- **Fullscreen**: Navigation visibility state
- **Theme Component**: Visual theme provider that registers with service
- **Material Design 3 Tokens**: Complete design system with colors, surfaces, typography, motion, and more

## Properties (Synchronous)

```typescript
theme.scheme        // 'dark' | 'light' | 'auto'
theme.color         // '#6200ee'
theme.fullscreen    // boolean
theme.themeComponent // SchmancyThemeComponent | null
theme.theme         // Partial<TSchmancyTheme> - Full M3 token system
```

## Observables

```typescript
// Scheme changes
theme.scheme$.subscribe(scheme => {
  console.log(scheme) // 'dark' | 'light' | 'auto'
})

// Resolved scheme (auto → actual) - NEVER returns 'auto'
theme.resolvedScheme$.subscribe(scheme => {
  console.log(scheme) // 'dark' | 'light' (automatically resolved)
})

// Color changes
theme.color$.subscribe(color => {
  console.log(color) // '#6200ee'
})

// Fullscreen state
theme.fullscreen$.subscribe(isFullscreen => {
  console.log(isFullscreen) // true/false
})

// Complete theme configuration
theme.theme$.subscribe(themeConfig => {
  console.log(themeConfig) // Full Material Design 3 theme object
})
```

## Methods

### `setScheme(scheme)`
Set color scheme with automatic persistence.
```typescript
theme.setScheme('dark')   // Force dark
theme.setScheme('light')  // Force light
theme.setScheme('auto')   // Follow system preferences
```

### `toggleScheme()`
Toggle between light/dark modes.
```typescript
theme.toggleScheme() // light → dark → light
```

### `setColor(color)`
Set primary color - automatically generates full M3 palette.
```typescript
theme.setColor('#6750A4') // Generates all tones and color roles
```

### `isDarkMode()`
Observable that emits current dark mode state.
```typescript
theme.isDarkMode().subscribe(isDark => {
  console.log(isDark) // true/false
})
```

### `setFullscreen(value)`
Control fullscreen mode for immersive experiences.
```typescript
theme.setFullscreen(true)  // Hide navigation
theme.setFullscreen(false) // Show navigation
```

### `toggleFullscreen()`
Toggle fullscreen state.
```typescript
theme.toggleFullscreen()
```

### `next(values)`
Update multiple properties atomically.
```typescript
theme.next({
  fullscreen: true,
  scheme: 'dark',
  color: '#6750A4'
})
```

### `getCSSVariable(name)`
Get computed CSS variable value.
```typescript
const primary = theme.getCSSVariable('color-primary')
const elevation = theme.getCSSVariable('elevation-3')
// Returns computed value of --schmancy-{name}
```

### `watchCSSVariable(name)`
Watch CSS variable changes reactively.
```typescript
theme.watchCSSVariable('color-primary').subscribe(color => {
  console.log('Primary changed:', color)
})
```

## Theme Controller Components

Two theme controller components are available:

### 1. Standalone Theme Controller
Embeddable theme controls for integration into settings panels:

```html
<schmancy-theme-controller
  .customColors=${[
    { name: 'Brand Blue', value: '#1976D2', category: 'primary' },
    { name: 'Brand Red', value: '#D32F2F', category: 'accent' }
  ]}
></schmancy-theme-controller>
```

### 2. BOAT UX Theme Controller
Floating, draggable theme control panel:

```html
<schmancy-theme-controller-boat
  .customColors=${[
    { name: 'Ocean', value: '#006994', category: 'primary' },
    { name: 'Sunset', value: '#FF6B35', category: 'accent' }
  ]}
></schmancy-theme-controller-boat>
```

### Features
- **Color Picker**: Visual color selection with debounced input
- **Scheme Toggle**: Beautiful icons for light/dark/auto modes
- **Random Color**: Generate random theme colors
- **Custom Presets**: Define your own color palette with categories

### Implementation Example
```typescript
import '@schmancy/theme-controller'
// or
import '@schmancy/theme-controller-boat'

@customElement('my-settings')
export class MySettings extends $LitElement() {
  private brandColors = [
    { name: 'Brand Primary', value: '#6750A4', category: 'primary' },
    { name: 'Brand Secondary', value: '#0061A4', category: 'secondary' },
    { name: 'Brand Success', value: '#006E1C', category: 'accent' },
    { name: 'Brand Error', value: '#BA1B1B', category: 'accent' }
  ]

  render() {
    return html`
      <schmancy-surface type="container" class="p-4">
        <schmancy-typography type="title" token="medium">
          Theme Settings
        </schmancy-typography>

        <schmancy-theme-controller
          .customColors=${this.brandColors}
        ></schmancy-theme-controller>
      </schmancy-surface>
    `
  }
}
```

## Complete Material Design 3 Token System

The theme service generates a COMPLETE M3 design system with hundreds of tokens:

### Extended Color System

Beyond primary/secondary/tertiary/error, the theme includes:

```typescript
// Additional semantic colors
theme.theme.success     // Success states (#006E1C base)
theme.theme.onSuccess    // Text on success backgrounds
theme.theme.successContainer
theme.theme.onSuccessContainer

theme.theme.warning     // Warning states (#FFB800 base)
theme.theme.onWarning
theme.theme.warningContainer
theme.theme.onWarningContainer

theme.theme.info        // Info states (#0061A4 base)
theme.theme.onInfo
theme.theme.infoContainer
theme.theme.onInfoContainer
```

### Surface System

Complete surface hierarchy with proper elevation:

```typescript
// Base surfaces
theme.theme.surface           // Default surface
theme.theme.surfaceDim        // Dimmed surface
theme.theme.surfaceBright     // Bright surface

// Container hierarchy
theme.theme.surfaceContainerLowest   // Lowest elevation
theme.theme.surfaceContainerLow      // Low elevation
theme.theme.surfaceContainer         // Default container
theme.theme.surfaceContainerHigh     // High elevation
theme.theme.surfaceContainerHighest  // Highest elevation

// Fixed color variants (don't change with theme)
theme.theme.primaryFixed        // Fixed primary
theme.theme.primaryFixedDim     // Dimmed fixed primary
theme.theme.onPrimaryFixed      // Text on fixed primary
theme.theme.onPrimaryFixedVariant
// (Same for secondary, tertiary)
```

### Typography System

Complete type scale with three axes:

```typescript
// Display - Largest, for hero text
theme.theme.typeface.scale.display.large  // 57px
theme.theme.typeface.scale.display.medium // 45px
theme.theme.typeface.scale.display.small  // 36px

// Headline - For section headers
theme.theme.typeface.scale.headline.large  // 32px
theme.theme.typeface.scale.headline.medium // 28px
theme.theme.typeface.scale.headline.small  // 24px

// Title - For cards and lists
theme.theme.typeface.scale.title.large    // 22px
theme.theme.typeface.scale.title.medium   // 16px
theme.theme.typeface.scale.title.small    // 14px

// Body - For content
theme.theme.typeface.scale.body.large     // 16px
theme.theme.typeface.scale.body.medium    // 14px
theme.theme.typeface.scale.body.small     // 12px

// Label - For UI elements
theme.theme.typeface.scale.label.large    // 14px
theme.theme.typeface.scale.label.medium   // 12px
theme.theme.typeface.scale.label.small    // 11px
```

### Motion System

Sophisticated animation tokens:

```typescript
// Easing curves
theme.theme.motion.easing.emphasized           // Expressive motion
theme.theme.motion.easing.emphasizedDecelerate // Enter animations
theme.theme.motion.easing.emphasizedAccelerate // Exit animations
theme.theme.motion.easing.standard            // Standard transitions
theme.theme.motion.easing.standardDecelerate
theme.theme.motion.easing.standardAccelerate
theme.theme.motion.easing.legacy              // Backward compatibility
theme.theme.motion.easing.linear              // Constant speed

// Duration scales (in ms)
theme.theme.motion.duration.short1    // 50ms  - Micro interactions
theme.theme.motion.duration.short2    // 100ms
theme.theme.motion.duration.short3    // 150ms
theme.theme.motion.duration.short4    // 200ms

theme.theme.motion.duration.medium1   // 250ms - Standard transitions
theme.theme.motion.duration.medium2   // 300ms
theme.theme.motion.duration.medium3   // 350ms
theme.theme.motion.duration.medium4   // 400ms

theme.theme.motion.duration.long1     // 450ms - Complex animations
theme.theme.motion.duration.long2     // 500ms
theme.theme.motion.duration.long3     // 550ms
theme.theme.motion.duration.long4     // 600ms

theme.theme.motion.duration.extraLong1 // 700ms - Dramatic effects
theme.theme.motion.duration.extraLong2 // 800ms
theme.theme.motion.duration.extraLong3 // 900ms
theme.theme.motion.duration.extraLong4 // 1000ms
```

### Shape System

Corner radius tokens:

```typescript
theme.theme.shape.corner.none       // 0px
theme.theme.shape.corner.extraSmall // 4px
theme.theme.shape.corner.small      // 8px
theme.theme.shape.corner.medium     // 12px
theme.theme.shape.corner.large      // 16px
theme.theme.shape.corner.extraLarge // 28px
theme.theme.shape.corner.full       // 9999px (pill shape)
```

### Elevation System

Elevation with tinted shadows in dark mode:

```typescript
theme.theme.elevation.level0 // Flat
theme.theme.elevation.level1 // Cards
theme.theme.elevation.level2 // Raised cards
theme.theme.elevation.level3 // Floating action buttons
theme.theme.elevation.level4 // Dialogs
theme.theme.elevation.level5 // Highest elevation

// In dark mode, shadows are tinted with primary color
```

### State Layer Opacities

Interaction state opacities:

```typescript
theme.theme.states.hover.stateLayerOpacity    // 0.08
theme.theme.states.focus.stateLayerOpacity    // 0.1
theme.theme.states.pressed.stateLayerOpacity  // 0.1
theme.theme.states.dragged.stateLayerOpacity  // 0.15
theme.theme.states.disabled.containerOpacity  // 0.12
theme.theme.states.disabled.contentOpacity    // 0.38
```

### Spacing System

4dp grid spacing:

```typescript
theme.theme.spacing.size.none   // 0px
theme.theme.spacing.size.s1     // 4px
theme.theme.spacing.size.s2     // 8px
theme.theme.spacing.size.s3     // 12px
theme.theme.spacing.size.s4     // 16px
theme.theme.spacing.size.s5     // 20px
theme.theme.spacing.size.s6     // 24px
theme.theme.spacing.size.s7     // 28px
theme.theme.spacing.size.s8     // 32px
theme.theme.spacing.size.s9     // 36px
theme.theme.spacing.size.s10    // 40px
theme.theme.spacing.size.s11    // 44px
theme.theme.spacing.size.s12    // 48px
```

## State Management & Persistence

The theme service uses a **persistent context** that automatically saves to localStorage:

```typescript
// No manual localStorage code needed!
// Settings persist automatically via context

// The context key 'schmancy-theme-settings' stores:
// - scheme: 'dark' | 'light' | 'auto'
// - color: hex color string

// Automatic restoration on page load
// Just use the service - persistence is handled
```

## Theme Discovery Pattern

The service uses a sophisticated bidirectional event system:

```typescript
// Service dispatches discovery event
dispatchEvent(new CustomEvent('ThemeWhereAreYou'))

// Theme component responds
dispatchEvent(new CustomEvent('ThemeHereIAm', {
  detail: themeComponent
}))

// Automatic registration with timeout
theme.discoverTheme().pipe(
  timeout(1000), // 1 second timeout
  catchError(() => of(null))
).subscribe(component => {
  if (component) {
    console.log('Theme component found and registered')
  }
})
```

## Advanced Patterns

### Activity Logging for Debugging

```typescript
@customElement('theme-debugger')
export class ThemeDebugger extends $LitElement() {
  @state() private activities: string[] = []

  connectedCallback() {
    super.connectedCallback()

    // Log all theme changes
    combineLatest([
      theme.scheme$,
      theme.color$,
      theme.fullscreen$
    ]).pipe(
      tap(([scheme, color, fullscreen]) => {
        const activity = `[${new Date().toLocaleTimeString()}] ` +
          `Scheme: ${scheme}, Color: ${color}, Fullscreen: ${fullscreen}`
        this.activities = [...this.activities, activity].slice(-10)
      }),
      takeUntil(this.disconnecting)
    ).subscribe()
  }

  render() {
    return html`
      <div class="font-mono text-xs">
        ${this.activities.map(a => html`<div>${a}</div>`)}
      </div>
    `
  }
}
```

### Custom Color Presets with Categories

```typescript
interface ColorPreset {
  category: string
  colors: Array<{ name: string; value: string }>
}

const presets: ColorPreset[] = [
  {
    category: 'Brand',
    colors: [
      { name: 'Primary', value: '#6750A4' },
      { name: 'Secondary', value: '#625B71' }
    ]
  },
  {
    category: 'Semantic',
    colors: [
      { name: 'Success', value: '#006E1C' },
      { name: 'Warning', value: '#FFB800' },
      { name: 'Error', value: '#BA1B1B' },
      { name: 'Info', value: '#0061A4' }
    ]
  }
]

// Use in component
html`
  ${presets.map(preset => html`
    <div>
      <h3>${preset.category}</h3>
      ${preset.colors.map(color => html`
        <button
          style="background: ${color.value}"
          @click=${() => theme.setColor(color.value)}
          title=${color.name}
        ></button>
      `)}
    </div>
  `)}
`
```

### Animated Theme Transitions

```typescript
@customElement('smooth-theme')
export class SmoothTheme extends $LitElement(css`
  :host {
    transition: background-color
      var(--schmancy-motion-duration-medium2)
      var(--schmancy-motion-easing-standard);
  }
`) {
  connectedCallback() {
    super.connectedCallback()

    // Apply smooth transitions using motion tokens
    theme.resolvedScheme$.pipe(
      tap(() => {
        // Background transitions automatically via CSS variables
        this.style.setProperty('background-color',
          'var(--schmancy-color-surface)')
      }),
      takeUntil(this.disconnecting)
    ).subscribe()
  }
}
```

### Responsive Theme Based on Time

```typescript
@customElement('time-aware-theme')
export class TimeAwareTheme extends $LitElement() {
  connectedCallback() {
    super.connectedCallback()

    // Auto-switch theme based on time
    interval(60000).pipe( // Check every minute
      startWith(0),
      map(() => new Date().getHours()),
      map(hour => hour >= 6 && hour < 18 ? 'light' : 'dark'),
      distinctUntilChanged(),
      tap(scheme => theme.setScheme(scheme)),
      takeUntil(this.disconnecting)
    ).subscribe()
  }
}
```

### Theme-Aware Data Visualization

```typescript
@customElement('theme-chart')
export class ThemeChart extends $LitElement() {
  @state() private chartColors = {
    primary: '',
    surface: '',
    error: ''
  }

  connectedCallback() {
    super.connectedCallback()

    // Update chart colors when theme changes
    theme.theme$.pipe(
      tap(themeData => {
        this.chartColors = {
          primary: themeData.primary,
          surface: themeData.surface,
          error: themeData.error
        }
        this.updateChart()
      }),
      takeUntil(this.disconnecting)
    ).subscribe()
  }

  private updateChart() {
    // Use theme colors in charts/visualizations
    // Colors automatically adapt to light/dark mode
  }
}
```

## Complete CSS Variable Reference

All tokens are available as CSS variables with `--schmancy-` prefix:

### Color Variables
```css
/* Core colors */
--schmancy-color-primary
--schmancy-color-onPrimary
--schmancy-color-primaryContainer
--schmancy-color-onPrimaryContainer

--schmancy-color-secondary
--schmancy-color-onSecondary
--schmancy-color-secondaryContainer
--schmancy-color-onSecondaryContainer

--schmancy-color-tertiary
--schmancy-color-onTertiary
--schmancy-color-tertiaryContainer
--schmancy-color-onTertiaryContainer

--schmancy-color-error
--schmancy-color-onError
--schmancy-color-errorContainer
--schmancy-color-onErrorContainer

/* Extended semantic colors */
--schmancy-color-success
--schmancy-color-onSuccess
--schmancy-color-successContainer
--schmancy-color-onSuccessContainer

--schmancy-color-warning
--schmancy-color-onWarning
--schmancy-color-warningContainer
--schmancy-color-onWarningContainer

--schmancy-color-info
--schmancy-color-onInfo
--schmancy-color-infoContainer
--schmancy-color-onInfoContainer

/* Surface hierarchy */
--schmancy-color-surface
--schmancy-color-onSurface
--schmancy-color-surfaceVariant
--schmancy-color-onSurfaceVariant
--schmancy-color-surfaceDim
--schmancy-color-surfaceBright
--schmancy-color-surfaceContainerLowest
--schmancy-color-surfaceContainerLow
--schmancy-color-surfaceContainer
--schmancy-color-surfaceContainerHigh
--schmancy-color-surfaceContainerHighest

/* Fixed variants */
--schmancy-color-primaryFixed
--schmancy-color-primaryFixedDim
--schmancy-color-onPrimaryFixed
--schmancy-color-onPrimaryFixedVariant
/* (Same pattern for secondary, tertiary) */

/* Other */
--schmancy-color-outline
--schmancy-color-outlineVariant
--schmancy-color-shadow
--schmancy-color-scrim
--schmancy-color-inverseSurface
--schmancy-color-inverseOnSurface
--schmancy-color-inversePrimary
```

### Typography Variables
```css
/* Display scale */
--schmancy-typeface-scale-display-large
--schmancy-typeface-scale-display-medium
--schmancy-typeface-scale-display-small

/* Headline scale */
--schmancy-typeface-scale-headline-large
--schmancy-typeface-scale-headline-medium
--schmancy-typeface-scale-headline-small

/* Title scale */
--schmancy-typeface-scale-title-large
--schmancy-typeface-scale-title-medium
--schmancy-typeface-scale-title-small

/* Body scale */
--schmancy-typeface-scale-body-large
--schmancy-typeface-scale-body-medium
--schmancy-typeface-scale-body-small

/* Label scale */
--schmancy-typeface-scale-label-large
--schmancy-typeface-scale-label-medium
--schmancy-typeface-scale-label-small
```

### Motion Variables
```css
/* Easing curves */
--schmancy-motion-easing-emphasized
--schmancy-motion-easing-emphasizedDecelerate
--schmancy-motion-easing-emphasizedAccelerate
--schmancy-motion-easing-standard
--schmancy-motion-easing-standardDecelerate
--schmancy-motion-easing-standardAccelerate
--schmancy-motion-easing-legacy
--schmancy-motion-easing-linear

/* Duration scales */
--schmancy-motion-duration-short1    /* 50ms */
--schmancy-motion-duration-short2    /* 100ms */
--schmancy-motion-duration-short3    /* 150ms */
--schmancy-motion-duration-short4    /* 200ms */

--schmancy-motion-duration-medium1   /* 250ms */
--schmancy-motion-duration-medium2   /* 300ms */
--schmancy-motion-duration-medium3   /* 350ms */
--schmancy-motion-duration-medium4   /* 400ms */

--schmancy-motion-duration-long1     /* 450ms */
--schmancy-motion-duration-long2     /* 500ms */
--schmancy-motion-duration-long3     /* 550ms */
--schmancy-motion-duration-long4     /* 600ms */

--schmancy-motion-duration-extraLong1 /* 700ms */
--schmancy-motion-duration-extraLong2 /* 800ms */
--schmancy-motion-duration-extraLong3 /* 900ms */
--schmancy-motion-duration-extraLong4 /* 1000ms */
```

### Shape Variables
```css
--schmancy-shape-corner-none       /* 0px */
--schmancy-shape-corner-extraSmall /* 4px */
--schmancy-shape-corner-small      /* 8px */
--schmancy-shape-corner-medium     /* 12px */
--schmancy-shape-corner-large      /* 16px */
--schmancy-shape-corner-extraLarge /* 28px */
--schmancy-shape-corner-full       /* 9999px */
```

### Elevation Variables
```css
--schmancy-elevation-level0
--schmancy-elevation-level1
--schmancy-elevation-level2
--schmancy-elevation-level3
--schmancy-elevation-level4
--schmancy-elevation-level5
```

### State Variables
```css
--schmancy-states-hover-stateLayerOpacity      /* 0.08 */
--schmancy-states-focus-stateLayerOpacity      /* 0.1 */
--schmancy-states-pressed-stateLayerOpacity    /* 0.1 */
--schmancy-states-dragged-stateLayerOpacity    /* 0.15 */
--schmancy-states-disabled-containerOpacity    /* 0.12 */
--schmancy-states-disabled-contentOpacity      /* 0.38 */
```

### Spacing Variables
```css
--schmancy-spacing-size-none  /* 0px */
--schmancy-spacing-size-s1    /* 4px */
--schmancy-spacing-size-s2    /* 8px */
--schmancy-spacing-size-s3    /* 12px */
--schmancy-spacing-size-s4    /* 16px */
--schmancy-spacing-size-s5    /* 20px */
--schmancy-spacing-size-s6    /* 24px */
--schmancy-spacing-size-s7    /* 28px */
--schmancy-spacing-size-s8    /* 32px */
--schmancy-spacing-size-s9    /* 36px */
--schmancy-spacing-size-s10   /* 40px */
--schmancy-spacing-size-s11   /* 44px */
--schmancy-spacing-size-s12   /* 48px */
```

## Fullscreen Integration

Navigation components automatically respond to fullscreen:

```typescript
// Enter fullscreen (hides navigation)
theme.setFullscreen(true)

// Custom component integration
fromEvent(window, 'fullscreen').pipe(
  tap((e: CustomEvent) => {
    this.hidden = e.detail
  }),
  takeUntil(this.disconnecting)
).subscribe()
```

## System Preference Detection

Auto mode follows system preferences with automatic updates:

```typescript
// Set to auto - follows system preference
theme.setScheme('auto')

// resolvedScheme$ automatically updates when system changes
// Uses MediaQueryList with listeners for real-time updates
theme.resolvedScheme$.subscribe(scheme => {
  // Always 'dark' or 'light', never 'auto'
  // Updates immediately when user changes OS theme
})
```

## Best Practices

1. **Always use observables** for reactive updates
2. **Prefer `resolvedScheme$`** over `scheme$` for UI logic (never returns 'auto')
3. **Use `next()` method** for batch updates to avoid multiple emissions
4. **Let theme persist automatically** - no manual localStorage needed
5. **Use motion tokens** for consistent animations across the app
6. **Leverage extended colors** (success, warning, info) for semantic meaning
7. **Use surface hierarchy** for proper elevation and depth
8. **Apply state opacities** for consistent interaction feedback
9. **Call `super.connectedCallback()`** when subscribing to observables
10. **Use `takeUntil(this.disconnecting)`** for proper cleanup

## Common Patterns

### Complete Theme Toggle Component
```typescript
@customElement('advanced-theme-toggle')
export class AdvancedThemeToggle extends $LitElement() {
  @state() private resolvedScheme: 'dark' | 'light' = 'light'
  @state() private actualScheme: string = 'auto'

  connectedCallback() {
    super.connectedCallback()

    // Track both actual and resolved scheme
    combineLatest([
      theme.scheme$,
      theme.resolvedScheme$
    ]).pipe(
      tap(([scheme, resolved]) => {
        this.actualScheme = scheme
        this.resolvedScheme = resolved
      }),
      takeUntil(this.disconnecting)
    ).subscribe()
  }

  render() {
    return html`
      <div class="flex gap-2">
        <button
          @click=${() => theme.setScheme('light')}
          class=${this.actualScheme === 'light' ? 'active' : ''}
        >
          ☀️ Light
        </button>
        <button
          @click=${() => theme.setScheme('dark')}
          class=${this.actualScheme === 'dark' ? 'active' : ''}
        >
          🌙 Dark
        </button>
        <button
          @click=${() => theme.setScheme('auto')}
          class=${this.actualScheme === 'auto' ? 'active' : ''}
        >
          🔄 Auto (${this.resolvedScheme})
        </button>
      </div>
    `
  }
}
```

### Fullscreen Video Player
```typescript
@customElement('video-player')
export class VideoPlayer extends $LitElement() {
  private videoRef = createRef<HTMLVideoElement>()

  private enterFullscreen() {
    theme.setFullscreen(true)
    this.videoRef.value?.requestFullscreen()
  }

  private exitFullscreen() {
    theme.setFullscreen(false)
    document.exitFullscreen()
  }

  render() {
    return html`
      <video ${ref(this.videoRef)}>
        <!-- Video content -->
      </video>
    `
  }
}
```

### Dynamic Motion Timing
```typescript
@customElement('animated-component')
export class AnimatedComponent extends $LitElement() {
  @state() private isExpanded = false

  render() {
    return html`
      <style>
        .panel {
          transition: height
            var(--schmancy-motion-duration-medium2)
            var(--schmancy-motion-easing-emphasized);
        }

        .fade-in {
          animation: fadeIn
            var(--schmancy-motion-duration-short3)
            var(--schmancy-motion-easing-emphasizedDecelerate);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      </style>

      <div class="panel ${this.isExpanded ? 'expanded' : ''}">
        <!-- Content with smooth animations -->
      </div>
    `
  }
}
```

## Integration with Theme Component

The service works bidirectionally with `<schmancy-theme>` component:

```html
<schmancy-theme color="#6750A4" scheme="auto">
  <!-- All children have access to theme tokens -->
</schmancy-theme>
```

Component automatically:
- Registers with service via discovery events
- Syncs state bidirectionally
- Generates full M3 token system
- Updates CSS variables in real-time
- Persists settings to localStorage

## Error Handling

```typescript
// Graceful fallback when theme component is missing
theme.discoverTheme().pipe(
  timeout(1000),
  catchError(() => {
    console.warn('Theme component not found, using defaults')
    return of(null)
  })
).subscribe()

// Validate color input
const isValidHex = (color: string) => /^#[0-9A-F]{6}$/i.test(color)

if (isValidHex(newColor)) {
  theme.setColor(newColor)
} else {
  console.error('Invalid color format')
}
```

## Performance Considerations

1. **Token Generation**: Full M3 theme is generated once per color change
2. **CSS Variables**: Updated atomically via `adoptedStyleSheets`
3. **Persistence**: Debounced writes to localStorage (via context)
4. **Discovery**: One-time discovery with 1s timeout
5. **MediaQuery**: Single listener for system preference changes
6. **Observables**: Multicast for efficient subscriptions

## Migration Guide

From manual theme management:
```typescript
// Old way
localStorage.setItem('theme', 'dark')
document.body.classList.add('dark-theme')

// New way
theme.setScheme('dark') // Automatic persistence & styling
```

From custom CSS variables:
```typescript
// Old way
:root {
  --primary: #6750A4;
}

// New way - Full M3 system generated
theme.setColor('#6750A4') // Generates 100+ tokens
```

## Summary

The theme service provides a complete Material Design 3 implementation with:
- 🎨 **Extended color system** with semantic colors
- 📐 **Complete surface hierarchy** for proper elevation
- 🔤 **Full typography scale** across 5 categories
- 🎬 **Sophisticated motion system** with easing and duration
- 🔲 **Shape tokens** for consistent corner radii
- 💾 **Automatic persistence** via context
- 🔍 **Smart discovery** with bidirectional events
- 🌓 **System preference detection** with real-time updates
- 🎯 **Ready-to-use controls** component
- ⚡ **Reactive observables** for all properties

Use the theme service as your single source of truth for all design tokens and theming needs.