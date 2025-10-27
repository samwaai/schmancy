# Divider Component

A sleek animated divider component that provides visual separation between content sections with customizable orientation and animation effects.

## Quick Start

```html
<!-- Basic horizontal divider -->
<schmancy-divider></schmancy-divider>

<!-- Vertical divider -->
<schmancy-divider orientation="vertical"></schmancy-divider>

<!-- Animated from center -->
<schmancy-divider grow="both"></schmancy-divider>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `outline` | `'default' \| 'variant'` | `'variant'` | Color style of the divider |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Divider direction |
| `grow` | `'start' \| 'end' \| 'both'` | `'start'` | Animation growth direction |

## Examples

### Section Separators
```html
<schmancy-surface>
  <h2>Section One</h2>
  <p>Content for the first section...</p>
  
  <schmancy-divider class="my-6"></schmancy-divider>
  
  <h2>Section Two</h2>
  <p>Content for the second section...</p>
</schmancy-surface>
```

### Sidebar Layout
```html
<div class="flex">
  <nav class="w-64 p-4">
    <!-- Navigation items -->
  </nav>
  
  <schmancy-divider orientation="vertical" class="h-screen"></schmancy-divider>
  
  <main class="flex-1 p-4">
    <!-- Main content -->
  </main>
</div>
```

### Animated List Separators
```html
<schmancy-list>
  ${items.map((item, index) => html`
    <schmancy-list-item>${item.name}</schmancy-list-item>
    ${index < items.length - 1 ? html`
      <schmancy-divider 
        grow="both" 
        style="--animation-duration: 0.3s"
      ></schmancy-divider>
    ` : ''}
  `)}
</schmancy-list>
```

### Card with Sections
```html
<schmancy-card>
  <div slot="header">
    <h3>User Profile</h3>
  </div>
  
  <div>
    <p>Name: John Doe</p>
    <p>Email: john@example.com</p>
  </div>
  
  <schmancy-divider outline="default" class="my-4"></schmancy-divider>
  
  <div>
    <h4>Recent Activity</h4>
    <ul>
      <li>Logged in - 2 hours ago</li>
      <li>Updated profile - Yesterday</li>
    </ul>
  </div>
</schmancy-card>
```

## Features

### Animation Options

**Growth Direction**:
- `start`: Animates from start (left/top)
- `end`: Animates from end (right/bottom)
- `both`: Animates from center outward

### RTL Support
The component automatically adjusts animation direction for right-to-left layouts.

### Color Variants
- `variant`: Uses `outlineVariant` color (subtle)
- `default`: Uses `outline` color (more prominent)

## Styling

### CSS Custom Properties
```css
schmancy-divider {
  --divider-color: var(--schmancy-sys-color-outlineVariant);
  --animation-duration: 1s;
  --transform-origin: left; /* or right, center */
}
```

### Animation Keyframes
The component uses CSS animations for smooth drawing effects:
- Horizontal dividers use `scaleX` transformation
- Vertical dividers use `scaleY` transformation

## Accessibility

- Uses `aria-hidden="true"` on decorative connector lines
- Semantic HTML structure
- No interactive elements

## Related Components

- [Surface](./surface.md) - Container for divided content
- [Card](./card.md) - Cards with divided sections
- [List](./list.md) - Lists with dividers
- [Layout](./layout.md) - Page layout divisions

## Best Practices

1. **Spacing**: Use consistent margin/padding around dividers
2. **Animation**: Keep animations subtle (300-500ms)
3. **Contrast**: Ensure sufficient contrast in both light/dark themes
4. **Semantic HTML**: Use dividers for visual separation, not structural

## Use Cases

1. **Form Sections**: Separate form groups
2. **Navigation**: Divide menu sections
3. **Content**: Break up long text content
4. **Lists**: Separate list items
5. **Layouts**: Create visual boundaries in layouts