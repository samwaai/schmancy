# Theme Button Component

A simple, animated button component for theme switching functionality with a rotating palette icon.

## Quick Start

```html
<!-- Basic theme button -->
<schmancy-theme-button></schmancy-theme-button>

<!-- In a toolbar -->
<schmancy-appbar>
  <h1 slot="title">My App</h1>
  <schmancy-theme-button slot="actions"></schmancy-theme-button>
</schmancy-appbar>
```

## Properties

The component inherits all properties from the base button component through `TailwindElement`.

## Features

### Animated Icon
The palette icon rotates 360 degrees when clicked:

```javascript
this.color.animate([
  { transform: 'rotate(0deg)' },
  { transform: 'rotate(360deg)' }
], {
  duration: 300
});
```

### Native Web Animations
Uses the Web Animations API for smooth, performant animations without external dependencies.

## Examples

### In Navigation Bar
```html
<nav class="flex items-center justify-between p-4">
  <h1>Brand</h1>
  <div class="flex gap-2">
    <schmancy-theme-button></schmancy-theme-button>
    <schmancy-icon-button>settings</schmancy-icon-button>
  </div>
</nav>
```

### With Custom Theme Logic
```html
<schmancy-theme-button @click="${() => {
  // Toggle between themes
  const currentTheme = document.querySelector('schmancy-theme');
  currentTheme.scheme = currentTheme.scheme === 'light' ? 'dark' : 'light';
}}"></schmancy-theme-button>
```

### In a Settings Panel
```html
<schmancy-card>
  <h3 slot="header">Appearance Settings</h3>
  
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <span>Theme</span>
      <schmancy-theme-button></schmancy-theme-button>
    </div>
    
    <schmancy-divider></schmancy-divider>
    
    <schmancy-select label="Color Scheme">
      <schmancy-option value="auto">Auto</schmancy-option>
      <schmancy-option value="light">Light</schmancy-option>
      <schmancy-option value="dark">Dark</schmancy-option>
    </schmancy-select>
  </div>
</schmancy-card>
```

### With Tooltip
```html
<schmancy-tooltip content="Change theme">
  <schmancy-theme-button></schmancy-theme-button>
</schmancy-tooltip>
```

## Implementation Details

The component structure:
- Uses `schmancy-button` with text variant
- Contains `schmancy-icon` with palette icon
- Applies rotation animation on click
- Maintains reference to icon element via `@query`

## Styling

Since it uses the base button component, all button styling applies:

```css
/* Custom positioning in toolbar */
schmancy-theme-button {
  margin-left: auto;
}

/* Adjust icon size */
schmancy-theme-button schmancy-icon {
  font-size: 1.25rem;
}
```

## Animation Customization

You can extend the animation behavior:

```javascript
// Custom animation options
{
  duration: 300,
  easing: 'ease-out',
  fill: 'forwards'  // Keep final rotation state
}
```

## Integration with Theme System

While the button provides the UI, you'll need to implement the theme switching logic:

```javascript
// Example theme toggle implementation
class MyApp extends LitElement {
  toggleTheme() {
    const theme = this.shadowRoot.querySelector('schmancy-theme');
    const themes = ['#6750A4', '#00695C', '#D32F2F', '#1976D2'];
    const currentIndex = themes.indexOf(theme.color);
    theme.color = themes[(currentIndex + 1) % themes.length];
  }
  
  render() {
    return html`
      <schmancy-theme>
        <schmancy-theme-button @click="${this.toggleTheme}">
        </schmancy-theme-button>
      </schmancy-theme>
    `;
  }
}
```

## Best Practices

1. **Placement**: Put in consistent location (usually top-right)
2. **Feedback**: The rotation provides immediate feedback
3. **Persistence**: Save theme preference to localStorage
4. **Accessibility**: Include proper ARIA labels
5. **Mobile**: Ensure adequate touch target size

## Related Components

- [Theme](./theme.md) - The theming system
- [Button](./button.md) - Base button component
- [Icon](./icons.md) - Icon system
- [Tooltip](./tooltip.md) - Help text

## Use Cases

1. **App Headers**: Quick theme toggle in navigation
2. **Settings Pages**: Part of appearance settings
3. **Demos**: Showcase theme capabilities
4. **User Preferences**: Personalization options
5. **Accessibility**: High contrast mode switching