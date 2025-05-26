# Delay Component

A utility component that delays the rendering of its content with sophisticated animation support and session-based memory.

## Quick Start

```html
<!-- Basic delay -->
<schmancy-delay delay="300">
  <schmancy-card>Welcome!</schmancy-card>
</schmancy-delay>

<!-- Staggered delays for list items -->
<div>
  <schmancy-delay delay="100">
    <div>First item</div>
  </schmancy-delay>
  <schmancy-delay delay="100">
    <div>Second item (200ms total)</div>
  </schmancy-delay>
  <schmancy-delay delay="100">
    <div>Third item (300ms total)</div>
  </schmancy-delay>
</div>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `delay` | `number` | `0` | Delay in milliseconds |
| `motion` | `string` | `'flyBelow'` | Animation type: 'flyBelow', 'flyAbove', or 'fadeIn' |
| `once` | `boolean` | `true` | Only animate once per session |

## Context Integration

The component participates in a delay context system, allowing nested delays to accumulate:

```html
<!-- Parent provides 500ms base delay -->
<schmancy-delay delay="500">
  <div>
    <!-- Child adds 200ms (700ms total) -->
    <schmancy-delay delay="200">
      <schmancy-card>Nested content</schmancy-card>
    </schmancy-delay>
  </div>
</schmancy-delay>
```

## Examples

### Hero Section Animation
```html
<schmancy-delay delay="0" motion="fadeIn">
  <h1>Welcome to Our App</h1>
</schmancy-delay>
<schmancy-delay delay="300" motion="flyBelow">
  <p>Discover amazing features</p>
</schmancy-delay>
<schmancy-delay delay="600" motion="flyBelow">
  <schmancy-button variant="filled">Get Started</schmancy-button>
</schmancy-delay>
```

### Staggered List Animation
```html
<schmancy-list>
  ${items.map((item, index) => html`
    <schmancy-delay delay="${index * 100}" motion="flyBelow">
      <schmancy-list-item>
        ${item.title}
      </schmancy-list-item>
    </schmancy-delay>
  `)}
</schmancy-list>
```

### Dashboard Cards
```html
<div class="grid grid-cols-3 gap-4">
  <schmancy-delay delay="0">
    <schmancy-card>
      <h3>Total Sales</h3>
      <p>$45,231</p>
    </schmancy-card>
  </schmancy-delay>
  
  <schmancy-delay delay="150">
    <schmancy-card>
      <h3>New Users</h3>
      <p>1,234</p>
    </schmancy-card>
  </schmancy-delay>
  
  <schmancy-delay delay="300">
    <schmancy-card>
      <h3>Active Sessions</h3>
      <p>892</p>
    </schmancy-card>
  </schmancy-delay>
</div>
```

## Features

### Session Memory
When `once` is true, the component remembers if content has been shown and skips the delay on subsequent visits within the same session.

### Intelligent Staggering
Sibling delay components automatically accumulate delays, creating smooth staggered animations without manual calculation.

### Motion Types
- `flyBelow`: Content slides up from below with fade
- `flyAbove`: Content slides down from above with fade
- `fadeIn`: Simple opacity fade

### Performance Optimized
- Uses native Web Animations API
- Cleans up observers on disconnect
- Efficient session storage usage

## Animation Customization

The component uses Lit's `@lit-labs/motion` for animations:

```typescript
// Animation duration and easing are configurable
${animate({
  in: this.motionLit,
  keyframeOptions: { 
    duration: 300, 
    easing: 'ease-out' 
  }
})}
```

## Best Practices

1. **Performance**: Use reasonable delays (typically under 1000ms)
2. **Accessibility**: Respect `prefers-reduced-motion`
3. **UX**: Don't delay critical content
4. **Staggering**: Keep increments small (50-150ms) for smooth effects

## Related Components

- [Animated Text](./animated-text.md) - For text-specific animations
- [Typewriter](./typewriter.md) - For typing animations
- [Card](./card.md) - Common content to delay
- [List](./list.md) - For staggered list animations

## Use Cases

1. **Landing Pages**: Create engaging hero sections
2. **Dashboards**: Stagger widget appearances
3. **Onboarding**: Guide user attention
4. **Data Loading**: Smooth transitions for async content
5. **Navigation**: Animate route transitions