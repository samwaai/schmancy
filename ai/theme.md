# Theme System Documentation

A comprehensive theming system that provides both a visual configuration component and a programmatic service API. Built on Material Design 3 principles, it generates complete color schemes with automatic dark/light mode support and CSS custom property injection.

## Overview

The Schmancy theme system consists of two main parts:
1. **Theme Component** (`<schmancy-theme>`) - Visual theme configuration interface
2. **Theme Service API** (`themeService`) - Programmatic theme management and subscriptions

## Quick Start

### Using the Theme Component

```html
<!-- Basic theme with auto color -->
<schmancy-theme>
  <div class="my-app">
    <!-- All children inherit theme -->
  </div>
</schmancy-theme>

<!-- Custom color theme -->
<schmancy-theme color="#6750A4" scheme="light">
  <schmancy-card>
    <h2>Themed Content</h2>
  </schmancy-card>
</schmancy-theme>

<!-- Root-level theme -->
<schmancy-theme color="#00695C" root>
  <!-- Theme applies to entire document -->
</schmancy-theme>
```

### Using the Theme Service

```typescript
import { themeService } from '@schmancy/index'
// Or specific import: import { themeService } from '@schmancy/theme'

// Get current theme
const theme = themeService.getCurrentTheme()

// Set theme mode
themeService.setMode('dark')

// Set primary color
themeService.setPrimaryColor('#6750A4')

// Subscribe to theme changes
themeService.theme$.subscribe(theme => {
  console.log('Theme updated:', theme)
})
```

## Component Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `color` | `string` | `random` | Source color for theme generation |
| `scheme` | `'dark' \| 'light' \| 'auto'` | `'auto'` | Color scheme mode |
| `root` | `boolean` | `false` | Apply theme to document root |
| `theme` | `Partial<TSchmancyTheme>` | `{}` | Custom theme overrides |

## Material Design 3 Integration

The component uses Google's Material Color Utilities to generate a complete color system:

```typescript
import { argbFromHex, themeFromSourceColor } from '@material/material-color-utilities';

// Generates full MD3 color palette
const theme = themeFromSourceColor(argbFromHex('#6750A4'));
```

## Examples

### App-Wide Theme
```html
<!-- In your app root -->
<schmancy-theme color="#1976D2" root>
  <schmancy-app>
    <!-- Entire app uses this theme -->
  </schmancy-app>
</schmancy-theme>
```

### Component-Level Theming
```html
<!-- Different sections with different themes -->
<div class="dashboard">
  <schmancy-theme color="#00897B">
    <section class="analytics">
      <!-- Teal theme -->
    </section>
  </schmancy-theme>
  
  <schmancy-theme color="#E53935">
    <section class="alerts">
      <!-- Red theme for alerts -->
    </section>
  </schmancy-theme>
</div>
```

### Dark Mode Support
```html
<!-- Automatic dark/light switching -->
<schmancy-theme scheme="auto">
  <schmancy-surface>
    <p>Adapts to system preferences</p>
  </schmancy-surface>
</schmancy-theme>

<!-- Force dark mode -->
<schmancy-theme scheme="dark" color="#673AB7">
  <schmancy-card>
    <h3>Always Dark</h3>
  </schmancy-card>
</schmancy-theme>
```

### Theme Overrides
```html
<schmancy-theme 
  color="#FF5722"
  .theme="${{
    sys: {
      color: {
        primary: {
          default: '#FF5722',
          onDefault: '#FFFFFF'
        }
      }
    }
  }}"
>
  <schmancy-button variant="filled">
    Custom Themed Button
  </schmancy-button>
</schmancy-theme>
```

## Generated CSS Properties

The theme generates a comprehensive set of CSS custom properties:

```css
/* Primary colors */
--schmancy-sys-color-primary-default
--schmancy-sys-color-primary-onDefault
--schmancy-sys-color-primary-container
--schmancy-sys-color-primary-onContainer

/* Secondary colors */
--schmancy-sys-color-secondary-default
--schmancy-sys-color-secondary-onDefault
--schmancy-sys-color-secondary-container
--schmancy-sys-color-secondary-onContainer

/* Tertiary colors */
--schmancy-sys-color-tertiary-default
--schmancy-sys-color-tertiary-onDefault

/* Surface colors */
--schmancy-sys-color-surface-default
--schmancy-sys-color-surface-on
--schmancy-sys-color-surface-container
--schmancy-sys-color-surface-containerHigh
--schmancy-sys-color-surface-containerHighest

/* And many more... */
```

## Auto Color Scheme Detection

```javascript
// Automatically detects system preference
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

// Reactive updates when system preference changes
scheme === 'auto' && mediaQuery.addEventListener('change', updateTheme);
```

## Random Color Generation

When no color is specified, generates a random color:

```javascript
generateRandomColor() {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return '#' + randomColor.padStart(6, '0');
}
```

## Context Provider

The theme component provides its theme via Lit Context:

```javascript
import { consume } from '@lit/context';
import { themeContext } from '@schmancy/index';
// Or specific import: import { themeContext } from '@schmancy/index'
// Or specific import: import { themeContext } from '@schmancy/theme';

// In child components
@consume({ context: themeContext })
theme: TSchmancyTheme;
```

## Advanced Usage

### Nested Themes
```html
<schmancy-theme color="#2196F3" scheme="light">
  <div class="main-content">
    <!-- Blue light theme -->
    
    <schmancy-theme color="#F44336" scheme="dark">
      <aside class="sidebar">
        <!-- Red dark theme -->
      </aside>
    </schmancy-theme>
  </div>
</schmancy-theme>
```

### Dynamic Theme Changes
```javascript
const themeEl = document.querySelector('schmancy-theme');

// Change color
themeEl.color = '#9C27B0';

// Switch scheme
themeEl.scheme = 'dark';

// Apply custom overrides
themeEl.theme = {
  sys: {
    color: {
      error: {
        default: '#FF0000'
      }
    }
  }
};
```

## Theme Service API

The theme service provides programmatic control over the theme system with reactive observables for state management.

### Service Methods

#### `getCurrentTheme()`
Returns the current theme configuration.

```typescript
const theme = themeService.getCurrentTheme()
console.log(theme.mode) // 'light' | 'dark' | 'auto'
console.log(theme.primaryColor) // hex color string
console.log(theme.isDark) // boolean
```

#### `setMode(mode: 'light' | 'dark' | 'auto')`
Sets the theme mode.

```typescript
// Force light mode
themeService.setMode('light')

// Force dark mode
themeService.setMode('dark')

// Auto mode (follows system preference)
themeService.setMode('auto')
```

#### `setPrimaryColor(color: string)`
Sets the primary color and regenerates the theme palette.

```typescript
themeService.setPrimaryColor('#6750A4')
```

#### `setTheme(theme: ThemeConfig)`
Sets the complete theme configuration at once.

```typescript
themeService.setTheme({
  mode: 'dark',
  primaryColor: '#00897B',
  fontFamily: 'Roboto',
  borderRadius: 'medium'
})
```

#### `reset()`
Resets the theme to default settings.

```typescript
themeService.reset()
```

### Reactive Subscriptions

The theme service exposes RxJS observables for reactive updates:

#### `theme$` - Complete Theme State
```typescript
import { takeUntil } from 'rxjs'

themeService.theme$
  .pipe(takeUntil(this.disconnecting))
  .subscribe(theme => {
    console.log('Theme updated:', theme)
    // theme.mode, theme.primaryColor, theme.isDark, etc.
  })
```

#### `mode$` - Mode Changes Only
```typescript
themeService.mode$
  .pipe(takeUntil(this.disconnecting))
  .subscribe(mode => {
    console.log('Mode changed to:', mode)
  })
```

#### `primaryColor$` - Color Changes Only
```typescript
themeService.primaryColor$
  .pipe(takeUntil(this.disconnecting))
  .subscribe(color => {
    console.log('Primary color changed to:', color)
  })
```

### Using with Lit Context

Components can also access theme state via context:

```typescript
import { select } from '@schmancy/index'
// Or specific import: import { select } from '@schmancy/store'
import { themeContext } from '@schmancy/index'
// Or specific import: import { themeContext } from '@schmancy/theme'

@customElement('my-component')
class MyComponent extends LitElement {
  @select(themeContext) theme!: ThemeState

  render() {
    return html`
      <div>Current mode: ${this.theme.mode}</div>
      <div>Is dark: ${this.theme.isDark}</div>
      <div>Primary: ${this.theme.primaryColor}</div>
    `
  }
}
```

### Practical Examples

#### Theme Toggle Button
```typescript
@customElement('theme-toggle')
export class ThemeToggle extends LitElement {
  @state() private currentMode: 'light' | 'dark' | 'auto' = 'auto'

  connectedCallback() {
    super.connectedCallback()

    themeService.mode$
      .pipe(takeUntil(this.disconnecting))
      .subscribe(mode => {
        this.currentMode = mode
      })
  }

  private toggleMode() {
    const modes: Array<'light' | 'dark' | 'auto'> = ['light', 'dark', 'auto']
    const currentIndex = modes.indexOf(this.currentMode)
    const nextMode = modes[(currentIndex + 1) % modes.length]
    themeService.setMode(nextMode)
  }

  render() {
    const icon = this.currentMode === 'light' ? 'light_mode' :
                 this.currentMode === 'dark' ? 'dark_mode' : 'brightness_auto'

    return html`
      <schmancy-button @click=${this.toggleMode}>
        <schmancy-icon slot="leading">${icon}</schmancy-icon>
        ${this.currentMode}
      </schmancy-button>
    `
  }
}
```

#### Dynamic Color Picker
```typescript
@customElement('color-picker')
export class ColorPicker extends LitElement {
  @state() private selectedColor = '#6750A4'

  private colors = [
    { name: 'Purple', value: '#6750A4' },
    { name: 'Blue', value: '#0061A4' },
    { name: 'Green', value: '#006E1C' },
    { name: 'Orange', value: '#D84315' },
    { name: 'Pink', value: '#C2185B' }
  ]

  connectedCallback() {
    super.connectedCallback()

    themeService.primaryColor$
      .pipe(takeUntil(this.disconnecting))
      .subscribe(color => {
        this.selectedColor = color
      })
  }

  private selectColor(color: string) {
    themeService.setPrimaryColor(color)
  }

  render() {
    return html`
      <div class="flex gap-2 p-4">
        ${this.colors.map(color => html`
          <button
            @click=${() => this.selectColor(color.value)}
            style="background-color: ${color.value}"
            class="w-10 h-10 rounded-full border-2 transition-all ${
              this.selectedColor === color.value ?
              'border-white shadow-lg scale-110' :
              'border-transparent'
            }"
            title=${color.name}
          ></button>
        `)}
      </div>
    `
  }
}
```

#### Persisting Theme Preferences
```typescript
import { debounceTime } from 'rxjs'

// Save theme to localStorage
class ThemePersistence {
  constructor() {
    // Load saved theme on initialization
    this.loadTheme()

    // Save theme changes
    themeService.theme$
      .pipe(
        debounceTime(500) // Debounce to avoid excessive saves
      )
      .subscribe(theme => {
        this.saveTheme(theme)
      })
  }

  private loadTheme() {
    const saved = localStorage.getItem('user-theme')
    if (saved) {
      try {
        const theme = JSON.parse(saved)
        themeService.setTheme(theme)
      } catch (e) {
        console.error('Failed to load saved theme', e)
      }
    }
  }

  private saveTheme(theme: ThemeState) {
    localStorage.setItem('user-theme', JSON.stringify({
      mode: theme.mode,
      primaryColor: theme.primaryColor
    }))
  }
}

// Initialize once in your app
new ThemePersistence()
```

#### Responding to System Preferences
```typescript
@customElement('system-aware')
export class SystemAware extends LitElement {
  @state() private isDark = false
  @state() private isAuto = false

  connectedCallback() {
    super.connectedCallback()

    // Subscribe to theme changes
    themeService.theme$
      .pipe(takeUntil(this.disconnecting))
      .subscribe(theme => {
        this.isAuto = theme.mode === 'auto'
        this.isDark = theme.isDark
      })

    // Listen to system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      if (this.isAuto) {
        this.isDark = e.matches
      }
    })
  }

  render() {
    return html`
      <div class="p-4">
        <p>Mode: ${this.isAuto ? 'Auto' : this.isDark ? 'Dark' : 'Light'}</p>
        <p>System prefers: ${
          window.matchMedia('(prefers-color-scheme: dark)').matches ?
          'Dark' : 'Light'
        }</p>
      </div>
    `
  }
}
```

## TypeScript Types

```typescript
interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto'
  primaryColor: string
  fontFamily?: string
  borderRadius?: 'none' | 'small' | 'medium' | 'large' | 'full'
  contrast?: 'standard' | 'medium' | 'high'
}

interface ThemeState extends ThemeConfig {
  isDark: boolean
  isAuto: boolean
  systemPreference: 'light' | 'dark'
  theme: TSchmancyTheme // Full Material Design 3 theme object
}

interface ThemeService {
  // Observables
  theme$: Observable<ThemeState>
  mode$: Observable<'light' | 'dark' | 'auto'>
  primaryColor$: Observable<string>

  // Methods
  getCurrentTheme(): ThemeState
  setMode(mode: 'light' | 'dark' | 'auto'): void
  setPrimaryColor(color: string): void
  setTheme(theme: ThemeConfig): void
  reset(): void
}
```

## Best Practices

1. **Root Theme**: Use one root theme for consistency
2. **Color Choice**: Pick colors with good contrast ratios
3. **Scheme Handling**: Respect user preferences with 'auto'
4. **Performance**: Limit nested themes, debounce theme changes
5. **Accessibility**: Test themes with contrast checkers
6. **Persistence**: Save user preferences to localStorage
7. **Cleanup**: Always use `takeUntil(this.disconnecting)` in components
8. **Type Safety**: Use provided TypeScript interfaces

## CSS Variables Reference

### Using Theme Variables in Styles

```css
/* Always use CSS variables for theme-aware styling */
.my-component {
  /* Backgrounds */
  background: var(--schmancy-sys-color-surface-default);

  /* Text colors */
  color: var(--schmancy-sys-color-surface-on);

  /* Borders */
  border: 1px solid var(--schmancy-sys-color-outline);

  /* Elevation/shadows */
  box-shadow: var(--schmancy-sys-elevation-1);
}

/* Semantic color usage */
.primary-action {
  background: var(--schmancy-sys-color-primary-default);
  color: var(--schmancy-sys-color-primary-onDefault);
}

.error-message {
  background: var(--schmancy-sys-color-error-container);
  color: var(--schmancy-sys-color-error-onContainer);
}
```

### Complete Variable List

#### Primary Colors
- `--schmancy-sys-color-primary-default`
- `--schmancy-sys-color-primary-onDefault`
- `--schmancy-sys-color-primary-container`
- `--schmancy-sys-color-primary-onContainer`

#### Secondary Colors
- `--schmancy-sys-color-secondary-default`
- `--schmancy-sys-color-secondary-onDefault`
- `--schmancy-sys-color-secondary-container`
- `--schmancy-sys-color-secondary-onContainer`

#### Tertiary Colors
- `--schmancy-sys-color-tertiary-default`
- `--schmancy-sys-color-tertiary-onDefault`
- `--schmancy-sys-color-tertiary-container`
- `--schmancy-sys-color-tertiary-onContainer`

#### Error Colors
- `--schmancy-sys-color-error-default`
- `--schmancy-sys-color-error-onDefault`
- `--schmancy-sys-color-error-container`
- `--schmancy-sys-color-error-onContainer`

#### Surface Colors
- `--schmancy-sys-color-surface-default`
- `--schmancy-sys-color-surface-on`
- `--schmancy-sys-color-surface-onVariant`
- `--schmancy-sys-color-surface-container`
- `--schmancy-sys-color-surface-containerLow`
- `--schmancy-sys-color-surface-containerHigh`
- `--schmancy-sys-color-surface-containerHighest`

#### Background & Outline
- `--schmancy-sys-color-background-default`
- `--schmancy-sys-color-background-on`
- `--schmancy-sys-color-outline-default`
- `--schmancy-sys-color-outline-variant`

## Migration Guide

### From Hardcoded Colors

```css
/* Before - Hardcoded colors */
.card {
  background: #ffffff;
  color: #000000;
  border: 1px solid #e0e0e0;
}

/* After - Theme-aware */
.card {
  background: var(--schmancy-sys-color-surface-default);
  color: var(--schmancy-sys-color-surface-on);
  border: 1px solid var(--schmancy-sys-color-outline-variant);
}
```

### From CSS-in-JS

```typescript
// Before - CSS-in-JS theme object
const styles = {
  card: {
    backgroundColor: theme.colors.background,
    color: theme.colors.text
  }
}

// After - CSS with variables
static styles = css`
  .card {
    background: var(--schmancy-sys-color-surface-default);
    color: var(--schmancy-sys-color-surface-on);
  }
`
```

### From Manual Dark Mode

```typescript
// Before - Manual dark mode handling
@state() isDark = false

render() {
  return html`
    <div class=${this.isDark ? 'dark-theme' : 'light-theme'}>
      <!-- content -->
    </div>
  `
}

// After - Automatic with theme service
render() {
  // CSS variables automatically update
  return html`
    <div>
      <!-- content automatically themed -->
    </div>
  `
}
```

## Advanced Patterns

### Theme-Aware Component

```typescript
@customElement('themed-card')
export class ThemedCard extends LitElement {
  @select(themeContext) theme!: ThemeState

  static styles = css`
    :host {
      display: block;
      background: var(--schmancy-sys-color-surface-container);
      color: var(--schmancy-sys-color-surface-on);
      border-radius: var(--schmancy-sys-shape-corner-medium);
      padding: 16px;
      transition: all 200ms ease-in-out;
    }

    :host([elevated]) {
      box-shadow: var(--schmancy-sys-elevation-2);
    }

    .header {
      color: var(--schmancy-sys-color-primary-default);
      font-size: var(--schmancy-sys-typescale-headline-small-size);
    }
  `

  render() {
    return html`
      <div class="header">
        <slot name="header"></slot>
      </div>
      <slot></slot>
    `
  }
}
```

### Theme Presets

```typescript
class ThemePresets {
  static readonly presets = {
    corporate: {
      mode: 'light' as const,
      primaryColor: '#003D82',
      fontFamily: 'Inter, system-ui',
      borderRadius: 'small'
    },

    vibrant: {
      mode: 'auto' as const,
      primaryColor: '#FF6B6B',
      fontFamily: 'Poppins, sans-serif',
      borderRadius: 'large'
    },

    minimal: {
      mode: 'auto' as const,
      primaryColor: '#2C3E50',
      fontFamily: 'system-ui',
      borderRadius: 'none'
    },

    accessibility: {
      mode: 'light' as const,
      primaryColor: '#0055AA',
      contrast: 'high',
      fontFamily: 'Arial, sans-serif',
      borderRadius: 'medium'
    }
  }

  static apply(presetName: keyof typeof ThemePresets.presets) {
    const preset = ThemePresets.presets[presetName]
    themeService.setTheme(preset)
  }
}

// Usage
ThemePresets.apply('corporate')
```

### Multi-Brand Support

```typescript
class BrandManager {
  private brands = {
    main: {
      primaryColor: '#6750A4',
      logo: '/assets/main-logo.svg'
    },
    partner: {
      primaryColor: '#00897B',
      logo: '/assets/partner-logo.svg'
    }
  }

  switchBrand(brandKey: keyof typeof this.brands) {
    const brand = this.brands[brandKey]
    themeService.setPrimaryColor(brand.primaryColor)
    // Update logo and other brand assets
    this.updateBrandAssets(brand)
  }

  private updateBrandAssets(brand: any) {
    // Update logos, fonts, etc.
  }
}
```

## Testing Themes

```typescript
// Test component in different themes
describe('ThemedComponent', () => {
  beforeEach(() => {
    themeService.reset()
  })

  it('renders correctly in light mode', async () => {
    themeService.setMode('light')
    const el = await fixture(html`<themed-component></themed-component>`)
    // Test light mode rendering
  })

  it('renders correctly in dark mode', async () => {
    themeService.setMode('dark')
    const el = await fixture(html`<themed-component></themed-component>`)
    // Test dark mode rendering
  })

  it('responds to theme changes', async () => {
    const el = await fixture(html`<themed-component></themed-component>`)

    themeService.setPrimaryColor('#FF5722')
    await el.updateComplete

    // Verify component updated with new theme
  })
})
```

## Performance Optimization

### Debouncing Theme Changes

```typescript
import { debounceTime, distinctUntilChanged } from 'rxjs'

themeService.theme$
  .pipe(
    debounceTime(300), // Debounce rapid changes
    distinctUntilChanged((a, b) =>
      a.primaryColor === b.primaryColor &&
      a.mode === b.mode
    ),
    takeUntil(this.disconnecting)
  )
  .subscribe(theme => {
    // Handle theme changes
  })
```

### Lazy Loading Theme Components

```typescript
// Only load theme UI when needed
async function openThemeSettings() {
  const { ThemeSettings } = await import('./theme-settings')
  const settings = new ThemeSettings()
  document.body.appendChild(settings)
}
```

## Troubleshooting

### Common Issues

1. **Theme not applying**: Ensure theme component or service is initialized at app root
2. **CSS variables undefined**: Check that schmancy-theme is imported before use
3. **Dark mode not working**: Verify `scheme="auto"` and system preferences
4. **Performance issues**: Use debouncing and avoid excessive nesting
5. **Colors not updating**: Ensure using CSS variables, not hardcoded values

## Related Components

- [Theme Button](./theme-button.md) - Theme switcher
- [Surface](./surface.md) - Themed containers
- [Button](./button.md) - Themed interactions
- [Card](./card.md) - Themed content

## Use Cases

1. **App Theming**: Consistent app-wide styling
2. **White-Label**: Dynamic branding for multiple clients
3. **User Preferences**: Personalized themes saved per user
4. **Section Theming**: Different themes for app sections
5. **A/B Testing**: Theme variations for testing
6. **Accessibility**: High contrast modes for better readability
7. **Dark Mode**: Automatic or manual dark mode support
8. **Brand Compliance**: Enforce brand colors across components