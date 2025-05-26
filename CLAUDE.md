# Schmancy Development Guidelines

## Theme Variables

When styling components, use Schmancy theme variables instead of hardcoded values. The theme variables are defined in `src/theme/theme.interface.ts`.

### Elevation Variables

For shadows, use the elevation variables instead of custom box-shadow values:

- `var(--schmancy-sys-elevation-0)` - No elevation
- `var(--schmancy-sys-elevation-1)` - Lowest elevation
- `var(--schmancy-sys-elevation-2)` - Low elevation
- `var(--schmancy-sys-elevation-3)` - Medium elevation
- `var(--schmancy-sys-elevation-4)` - High elevation
- `var(--schmancy-sys-elevation-5)` - Highest elevation

### Color Variables

The theme provides a comprehensive color system:

- **Surface colors**: `var(--schmancy-sys-color-surface-*)` (default, dim, bright, container, low, high, highest, lowest, on, onVariant)
- **Primary colors**: `var(--schmancy-sys-color-primary-*)` (default, on, container, onContainer)
- **Secondary colors**: `var(--schmancy-sys-color-secondary-*)` (default, on, container, onContainer)
- **Tertiary colors**: `var(--schmancy-sys-color-tertiary-*)` (default, on, container, onContainer)
- **Error colors**: `var(--schmancy-sys-color-error-*)` (default, on, container, onContainer)
- **Success colors**: `var(--schmancy-sys-color-success-*)` (default, on, container, onContainer)
- **Outline colors**: `var(--schmancy-sys-color-outline)`, `var(--schmancy-sys-color-outlineVariant)`
- **Scrim color**: `var(--schmancy-sys-color-scrim)`

### Example Usage

Instead of:
```css
box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
```

Use:
```css
box-shadow: var(--schmancy-sys-elevation-1);
```



## Component Refactoring Summary: From Wrapper Div to Clean Host Styling

### Before (Anti-pattern):
```typescript
// ❌ Problems: Wrapper div, class management complexity, external class issues
render() {
  const classes = {
    'rounded-md': true,
    'shadow-xs': this.elevation === 1,
    'bg-surface-low shadow-xs hover:shadow-sm': this.type === 'elevated',
    // ... many conditional classes
  }
  return html`<div class="${this.classMap(classes)} ${this.className || ''}">
    <slot></slot>
  </div>`
}
```

### After (Best Practice):
```typescript
// ✅ Solution: CSS :host selectors with custom properties
@customElement('schmancy-card')
export default class SchmancyCard extends TailwindElement(css`
  :host {
    display: block;
    position: relative;
    border-radius: 0.375rem;
  }
  :host([type="elevated"]) {
    background-color: var(--schmancy-sys-color-surface-low);
    box-shadow: var(--schmancy-sys-elevation-1);
  }
  /* ... other :host rules */
`) {
  @property({ reflect: true }) type: 'elevated' | 'filled' | 'outlined' = 'elevated'
  @property({ type: Number, reflect: true }) elevation: 0 | 1 | 2 | 3 | 4 | 5 = 0
  
  render() {
    return html`<slot></slot>`
  }
}
```

### Key Refactoring Principles:

1. **Remove Wrapper Elements**
   - Before: `<div class="..."><slot></slot></div>`
   - After: `<slot></slot>` (styles on host)

2. **Use CSS :host Instead of Classes**
   - Before: JavaScript class manipulation, string concatenation
   - After: CSS attribute selectors with `:host([prop="value"])`

3. **Enable Property Reflection**
   - Add `reflect: true` to `@property()` decorators
   - This creates HTML attributes that CSS can target

4. **Leverage CSS Custom Properties**
   - Before: Hardcoded Tailwind classes (`shadow-xs`, `bg-surface-low`)
   - After: Design system tokens (`var(--schmancy-sys-elevation-1)`)

5. **Eliminate Runtime Logic**
   - Before: Complex conditional logic in `render()` or `updated()`
   - After: Pure CSS rules, no JavaScript styling logic

### Benefits Achieved:
- ✅ **Performance**: CSS is parsed once, no runtime class updates
- ✅ **Simplicity**: ~50% less code, easier to understand
- ✅ **External Classes**: Users can add classes without conflicts
- ✅ **Design System**: Clean integration via CSS custom properties
- ✅ **Encapsulation**: Styles scoped to component
- ✅ **No Side Effects**: No DOM mutations after render

### When Refactoring Other Components:
1. Identify components with wrapper divs around `<slot>`
2. Check if using `classMap()` or dynamic class strings
3. Convert dynamic classes to `:host` CSS rules
4. Add `reflect: true` to properties used for styling
5. Replace hardcoded values with CSS custom properties
6. Remove all JavaScript styling logic

This pattern works best for components where:
- Styles are based on property values
- You need clean external API
- Performance is important
- Design system integration is needed