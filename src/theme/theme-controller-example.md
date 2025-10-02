# Theme Controller Components Usage Guide

## Overview

The theme controller functionality has been refactored into two components to provide better flexibility:

1. **`schmancy-theme-controller`** - Base theme controller (standalone)
2. **`schmancy-theme-controller-boat`** - BOAT UX-wrapped theme controller

## Component Architecture

```
schmancy-theme-controller (Base)
    ↑
    └── schmancy-theme-controller-boat (with BOAT UX)
```

## Usage Examples

### 1. Standalone Theme Controller

Use this when you want theme controls without the floating BOAT UI:

```html
<!-- Basic usage -->
<schmancy-theme-controller></schmancy-theme-controller>

<!-- With custom colors -->
<schmancy-theme-controller
  .customColors="${[
    { name: 'Brand Blue', value: '#1976D2', category: 'primary' },
    { name: 'Brand Red', value: '#D32F2F', category: 'accent' }
  ]}"
></schmancy-theme-controller>
```

### 2. BOAT UX Theme Controller

Use this for a floating, draggable theme control panel:

```html
<!-- Basic usage -->
<schmancy-theme-controller-boat></schmancy-theme-controller-boat>

<!-- With custom colors -->
<schmancy-theme-controller-boat
  .customColors="${[
    { name: 'Ocean', value: '#006994', category: 'primary' },
    { name: 'Sunset', value: '#FF6B35', category: 'accent' }
  ]}"
></schmancy-theme-controller-boat>
```


## Integration in Custom Components

### Example: Embedding in a Settings Panel

```typescript
import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@schmancy/theme/theme-controller'

@customElement('my-settings-panel')
export class MySettingsPanel extends LitElement {
  render() {
    return html`
      <div class="settings-container">
        <h2>Theme Settings</h2>
        <schmancy-theme-controller></schmancy-theme-controller>

        <h2>Other Settings</h2>
        <!-- Other settings content -->
      </div>
    `
  }
}
```

### Example: Custom Branded Theme Colors

```typescript
import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import type { ColorPreset } from '@schmancy/theme/theme-controller'

@customElement('branded-app')
export class BrandedApp extends LitElement {
  private brandColors: ColorPreset[] = [
    { name: 'Primary Brand', value: '#2E7D32', category: 'primary' },
    { name: 'Secondary Brand', value: '#558B2F', category: 'secondary' },
    { name: 'Accent Brand', value: '#FF6F00', category: 'accent' },
  ]

  render() {
    return html`
      <schmancy-theme-controller-boat
        .customColors="${this.brandColors}"
      ></schmancy-theme-controller-boat>

      <!-- App content -->
    `
  }
}
```

## Benefits of the Refactored Architecture

1. **Separation of Concerns**: Core theme functionality is separated from UI container
2. **Flexibility**: Choose between standalone or floating UI based on your needs
3. **Reusability**: Base controller can be embedded in any custom container
4. **Type Safety**: Properly typed interfaces for TypeScript users

## API Reference

### Properties

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `customColors` | `ColorPreset[]` | Custom color palette | Built-in palette |

### ColorPreset Interface

```typescript
interface ColorPreset {
  name: string           // Display name for the color
  value: string         // Hex color value
  category?: 'primary' | 'secondary' | 'accent'  // Optional categorization
}
```

## Migration Guide

If you're currently using `schmancy-theme-controls`:

1. **Update your imports** - Replace with `schmancy-theme-controller-boat`
2. **For floating UI** - Use `schmancy-theme-controller-boat`
3. **For embedded scenarios** - Use `schmancy-theme-controller` directly

```typescript
// Old (removed - no longer available)
// import '@schmancy/theme/theme.controls' // This file has been removed
html`<schmancy-theme-controls></schmancy-theme-controls>`

// New (for floating UI)
import '@schmancy/theme/theme-controller-boat'
html`<schmancy-theme-controller-boat></schmancy-theme-controller-boat>`

// New (for embedded/standalone)
import '@schmancy/theme/theme-controller'
html`<schmancy-theme-controller></schmancy-theme-controller>`
```