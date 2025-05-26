# Theme Component

A powerful theming system that generates Material Design 3 color schemes from a source color, with automatic dark/light mode support and CSS custom property injection.

## Quick Start

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

## Properties

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
import { themeContext } from '@schmancy/theme';

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

## Best Practices

1. **Root Theme**: Use one root theme for consistency
2. **Color Choice**: Pick colors with good contrast ratios
3. **Scheme Handling**: Respect user preferences with 'auto'
4. **Performance**: Limit nested themes
5. **Accessibility**: Test themes with contrast checkers

## Related Components

- [Theme Button](./theme-button.md) - Theme switcher
- [Surface](./surface.md) - Themed containers
- [Button](./button.md) - Themed interactions
- [Card](./card.md) - Themed content

## Use Cases

1. **App Theming**: Consistent app-wide styling
2. **White-Label**: Dynamic branding
3. **User Preferences**: Personalized themes
4. **Section Theming**: Different themes for app sections
5. **A/B Testing**: Theme variations for testing