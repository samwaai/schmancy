# Theme Service

Centralized theme management with reactive observables for color schemes, fullscreen mode, and Material Design 3 integration.

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

## Properties (Synchronous)

```typescript
theme.scheme        // 'dark' | 'light' | 'auto'
theme.color         // '#6200ee'
theme.fullscreen    // boolean
theme.themeComponent // SchmancyThemeComponent | null
theme.theme         // Partial<TSchmancyTheme>
```

## Observables

```typescript
// Scheme changes
theme.scheme$.subscribe(scheme => {
  console.log(scheme) // 'dark' | 'light' | 'auto'
})

// Resolved scheme (auto → actual)
theme.resolvedScheme$.subscribe(scheme => {
  console.log(scheme) // 'dark' | 'light' (never 'auto')
})

// Color changes
theme.color$.subscribe(color => {
  console.log(color) // '#6200ee'
})

// Fullscreen state
theme.fullscreen$.subscribe(isFullscreen => {
  console.log(isFullscreen) // true/false
})

// Theme configuration
theme.theme$.subscribe(themeConfig => {
  console.log(themeConfig) // Material Design 3 theme object
})
```

## Methods

### `setScheme(scheme)`
Set color scheme.
```typescript
theme.setScheme('dark')   // Force dark
theme.setScheme('light')  // Force light
theme.setScheme('auto')   // Follow system
```

### `toggleScheme()`
Toggle between light/dark modes.
```typescript
theme.toggleScheme() // light → dark → light
```

### `setColor(color)`
Set primary color.
```typescript
theme.setColor('#6750A4')
```

### `isDarkMode()`
Check if currently in dark mode.
```typescript
theme.isDarkMode().subscribe(isDark => {
  console.log(isDark) // true/false
})
```

### `setFullscreen(value)`
Control fullscreen mode.
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
Update multiple properties at once.
```typescript
theme.next({
  fullscreen: true,
  scheme: 'dark',
  color: '#6750A4'
})
```

### `getCSSVariable(name)`
Get CSS variable value.
```typescript
const primary = theme.getCSSVariable('color-primary')
// Returns computed value of --schmancy-color-primary
```

### `watchCSSVariable(name)`
Watch CSS variable changes.
```typescript
theme.watchCSSVariable('color-primary').subscribe(color => {
  console.log('Primary changed:', color)
})
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

## Component Usage

### Basic Theme Controls
```typescript
@customElement('theme-controls')
export class ThemeControls extends $LitElement() {
  @state() private currentScheme = theme.scheme
  @state() private isFullscreen = theme.fullscreen

  connectedCallback() {
    super.connectedCallback()

    theme.scheme$.pipe(
      tap(scheme => this.currentScheme = scheme),
      takeUntil(this.disconnecting)
    ).subscribe()

    theme.fullscreen$.pipe(
      tap(fullscreen => this.isFullscreen = fullscreen),
      takeUntil(this.disconnecting)
    ).subscribe()
  }

  render() {
    return html`
      <button @click=${() => theme.toggleScheme()}>
        ${this.currentScheme}
      </button>
      <button @click=${() => theme.toggleFullscreen()}>
        ${this.isFullscreen ? 'Exit' : 'Enter'} Fullscreen
      </button>
    `
  }
}
```

### Theme-Aware Component
```typescript
@customElement('theme-aware')
export class ThemeAware extends $LitElement() {
  @state() private isDark = false

  connectedCallback() {
    super.connectedCallback()

    theme.isDarkMode().pipe(
      tap(isDark => this.isDark = isDark),
      takeUntil(this.disconnecting)
    ).subscribe()
  }

  render() {
    return html`
      <div class=${this.isDark ? 'dark-theme' : 'light-theme'}>
        Content adapts to theme
      </div>
    `
  }
}
```

### Color Picker
```typescript
@customElement('color-picker')
export class ColorPicker extends $LitElement() {
  private colors = ['#6750A4', '#0061A4', '#006E1C']

  render() {
    return html`
      ${this.colors.map(color => html`
        <button
          style="background: ${color}"
          @click=${() => theme.setColor(color)}
        ></button>
      `)}
    `
  }
}
```

## System Preference Detection

Auto mode follows system preferences:

```typescript
// Internally handles MediaQueryList
theme.setScheme('auto')

// Resolved scheme updates automatically
theme.resolvedScheme$.subscribe(scheme => {
  // 'dark' or 'light' based on system
})
```

## Theme Discovery

Service automatically discovers theme components:

```typescript
// Manual discovery (rarely needed)
theme.discoverTheme().subscribe(component => {
  if (component) {
    console.log('Found theme component')
  }
})
```

## CSS Variables

Access Material Design 3 variables:

```typescript
// Get current value
const surface = theme.getCSSVariable('color-surface')

// Watch for changes
theme.watchCSSVariable('color-primary').pipe(
  tap(color => updateUI(color)),
  takeUntil(this.disconnecting)
).subscribe()
```

Common variables:
- `color-primary`
- `color-surface`
- `color-error`
- `elevation-1` through `elevation-5`

## Events

### Fullscreen Event
```typescript
window.addEventListener('fullscreen', (e: CustomEvent) => {
  const isFullscreen = e.detail
  // Hide/show UI elements
})
```

## State Management Pattern

```typescript
// All state changes through pipelines
of(newColor).pipe(
  tap(() => theme.setColor(newColor)),
  switchMap(() => theme.color$),
  tap(color => console.log('Color updated:', color)),
  takeUntil(this.disconnecting)
).subscribe()
```

## Best Practices

1. **Always use observables** for reactive updates
2. **Call `super.connectedCallback()`** when subscribing
3. **Use `takeUntil(this.disconnecting)`** for cleanup
4. **Prefer `resolvedScheme$`** over `scheme$` for UI logic
5. **Use `next()` method** for batch updates
6. **Let navigation components** handle fullscreen automatically

## Common Patterns

### Persist User Preference
```typescript
theme.scheme$.pipe(
  skip(1), // Skip initial value
  tap(scheme => localStorage.setItem('theme-scheme', scheme)),
  takeUntil(this.disconnecting)
).subscribe()

// Restore on load
const saved = localStorage.getItem('theme-scheme')
if (saved) theme.setScheme(saved as any)
```

### Theme Toggle Button
```typescript
html`
  <button @click=${() => theme.toggleScheme()}>
    ${theme.scheme === 'dark' ? '🌙' : '☀️'}
  </button>
`
```

### Fullscreen Video Player
```typescript
class VideoPlayer extends $LitElement() {
  private enterFullscreen() {
    theme.setFullscreen(true)
    this.video.requestFullscreen()
  }

  private exitFullscreen() {
    theme.setFullscreen(false)
    document.exitFullscreen()
  }
}
```

## Integration with Theme Component

The service works with `<schmancy-theme>` component:

```html
<schmancy-theme color="#6750A4" scheme="auto">
  <!-- Content -->
</schmancy-theme>
```

Component automatically registers with service and syncs state bidirectionally.