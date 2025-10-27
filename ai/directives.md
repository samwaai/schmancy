# Schmancy Directives - AI Reference

## Quick Start

```typescript
import { ripple, color, height, visibility } from '@schmancy/index'
// Or specific import: import { ripple, color, height, visibility } from '@schmancy/directives'
```

## Directives Overview

Lit directives that add common UI behaviors and styling capabilities to any element.

## API

### Ripple Directive

```typescript
// Add Material Design ripple effect to any element
<div ${ripple()}></div>

// Ripple automatically triggers on click
// Uses theme color: var(--schmancy-sys-color-surface-high)
```

### Color Directive

```typescript
// Apply dynamic colors to elements
<div ${color({ 
  bgColor?: string,  // Background color
  color?: string     // Text color
})}></div>

// Examples
<div ${color({ bgColor: '#ff0000' })}></div>
<div ${color({ color: 'blue' })}></div>
<div ${color({ bgColor: 'var(--schmancy-sys-color-primary)', color: 'white' })}></div>
```

### Height Directive

```typescript
// Dynamically set element height
<div ${height(value: string | number)}></div>

// Examples
<div ${height(200)}></div>           // 200px
<div ${height('50vh')}></div>        // 50% viewport height
<div ${height('calc(100% - 64px)')}></div>  // Calculated height
```

### Visibility Directive

```typescript
// Control element visibility
<div ${visibility(isVisible: boolean)}></div>

// When false, sets display: none
// When true, removes display style
```

## Examples

### Basic Usage

```typescript
// Button with ripple effect
<button ${ripple()} class="px-4 py-2 rounded">
  Click Me
</button>

// Colored container
<div ${color({ bgColor: 'var(--schmancy-sys-color-primary-container)' })} class="p-4">
  Primary Container
</div>

// Conditional visibility
<div ${visibility(showContent)} class="alert">
  This content is conditionally visible
</div>

// Dynamic height
<div ${height(collapsed ? 0 : 'auto')} class="transition-all">
  Collapsible content
</div>
```

### Combined Directives

```typescript
// Interactive card with multiple directives
<div 
  ${ripple()}
  ${color({ bgColor: 'var(--schmancy-sys-color-surface-container)' })}
  ${visibility(isActive)}
  class="p-4 rounded-lg cursor-pointer"
  @click=${handleClick}>
  Interactive Card
</div>

// Animated drawer
<div 
  ${height(isOpen ? '300px' : '0')}
  ${visibility(isOpen)}
  class="transition-all duration-300 overflow-hidden">
  Drawer Content
</div>
```

### Real-World Examples

```typescript
// Custom button component
render() {
  return html`
    <button
      ${ripple()}
      ${color({ 
        bgColor: this.variant === 'primary' 
          ? 'var(--schmancy-sys-color-primary)' 
          : 'var(--schmancy-sys-color-surface-container)'
      })}
      class="px-4 py-2 rounded-full relative overflow-hidden"
      ?disabled=${this.disabled}>
      <slot></slot>
    </button>
  `
}

// Expandable panel
render() {
  return html`
    <div class="border rounded-lg overflow-hidden">
      <div 
        ${ripple()}
        class="p-4 cursor-pointer relative"
        @click=${() => this.expanded = !this.expanded}>
        <schmancy-typography type="title" token="md">
          Panel Header
        </schmancy-typography>
      </div>
      <div 
        ${height(this.expanded ? 'auto' : '0')}
        class="transition-all duration-300">
        <div class="p-4">
          Panel content goes here...
        </div>
      </div>
    </div>
  `
}

// Theme-aware container
render() {
  const isDark = this.theme === 'dark'
  return html`
    <div 
      ${color({
        bgColor: isDark 
          ? 'var(--schmancy-sys-color-surface-dim)' 
          : 'var(--schmancy-sys-color-surface-bright)',
        color: 'var(--schmancy-sys-color-on-surface)'
      })}
      class="p-6 rounded-lg">
      <slot></slot>
    </div>
  `
}
```

## Implementation Details

### Ripple Directive
- Creates span element with ripple animation
- Calculates position relative to click coordinates
- Auto-removes previous ripple before adding new one
- Uses CSS keyframe animation (600ms duration)
- Scales from 0 to 4x size while fading out

### Color Directive
- Directly sets style.backgroundColor and style.color
- Accepts any valid CSS color value
- Supports CSS variables
- Updates immediately on value change

### Height Directive
- Sets style.height property
- Accepts numbers (converted to px) or strings
- Useful for animations and transitions
- Works with calc() expressions

### Visibility Directive
- Controls display property
- When false: display = 'none'
- When true: removes display style
- Preserves other display values

## Best Practices

1. **Ripple Usage**: Best on interactive elements (buttons, cards, list items)
2. **Color Variables**: Prefer theme CSS variables over hardcoded colors
3. **Height Animations**: Combine with CSS transitions for smooth effects
4. **Visibility**: Use for simple show/hide; consider v-show for more control
5. **Performance**: Directives are lightweight but avoid excessive updates

## Common Pitfalls

- **Ripple Overflow**: Parent element needs `position: relative` and `overflow: hidden`
- **Color Specificity**: Inline styles from color directive override CSS classes
- **Height Auto**: Transitioning to/from 'auto' requires special handling
- **Visibility vs Display**: Visibility directive uses display, not visibility property

## Related Components

- **[Button](./button.md)**: Could use ripple directive
- **[Card](./card.md)**: Interactive cards benefit from ripple
- **[Surface](./surface.md)**: Color directive for dynamic theming
- **[Theme](./theme.md)**: Use theme variables with color directive

## TypeScript Types

```typescript
// Ripple directive
ripple(): DirectiveResult

// Color directive
color(config: {
  bgColor?: string;
  color?: string;
}): DirectiveResult

// Height directive  
height(value: string | number): DirectiveResult

// Visibility directive
visibility(isVisible: boolean): DirectiveResult
```