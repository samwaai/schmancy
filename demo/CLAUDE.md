# Schmancy Demo Patterns

## Demo Component Structure

### Base Pattern
```typescript
@customElement('demo-{category}-{name}')
export default class Demo{Category}{Name} extends $LitElement() {
  @state() private stateValue = initialValue

  render() {
    return html`
      <schmancy-surface class="p-8">
        <!-- Header -->
        <schmancy-typography type="display" token="lg" class="mb-4 block">
          Component Name
        </schmancy-typography>
        <schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
          Component description
        </schmancy-typography>

        <!-- Examples with code preview -->
        <schmancy-grid gap="lg" class="w-full mb-8">
          <schmancy-code-preview language="html">
            <!-- Live component example -->
          </schmancy-code-preview>
        </schmancy-grid>
      </schmancy-surface>
    `
  }
}
```

### Demo Organization
- `/demo/src/features/{category}-demos/{specific}.ts`
- Categories: core, forms, navigation, data-display, feedback, overlays, layout, misc
- Each category has `index.ts` exporting all demos

## Code Preview Component

### Usage Pattern
```typescript
<schmancy-code-preview language="html">
  <!-- Component usage examples -->
  <schmancy-button variant="filled">Example</schmancy-button>
</schmancy-code-preview>
```

- **Auto-captures** slotted content as code
- **Auto-renders** HTML content in preview pane
- **Auto-formats** by removing minimum indentation
- Side-by-side: code + live preview
- Copy button included automatically

### Languages Supported
- `language="html"` - Shows code + renders preview
- `language="typescript"` - Shows code only
- `language="javascript"` - Shows code only

## State Management in Demos

### Multi-State Examples
```typescript
// Track multiple variations
@state() private basicValue = 'default'
@state() private multiValues: string[] = ['one', 'two']
@state() private formState = { field1: '', field2: '' }

// Arrays for dynamic rendering
@state() private items = [
  { id: '1', name: 'Item 1', data: {...} },
  { id: '2', name: 'Item 2', data: {...} }
]
```

### Event Handlers in Demos
```typescript
@change=${(e: CustomEvent) => {
  this.stateValue = e.detail.value
  console.log('Demo:', e.detail) // Show in console for testing
}}
```

## Dynamic Data Patterns

### Using Repeat Directive
```typescript
import { repeat } from 'lit/directives/repeat.js'

${repeat(
  this.items,
  item => item.id,  // Stable key
  item => html`
    <schmancy-option .value=${item.id}>
      ${item.name}
    </schmancy-option>
  `
)}
```

**Always use stable keys** (IDs, not indices) for proper DOM diffing.

## Demo Layout Sections

### Standard Structure
1. **Header**: Component title + description
2. **Installation**: Import/setup code (if complex)
3. **API Reference**: Props table (for core components)
4. **Basic Examples**: Simple usage patterns
5. **Advanced Examples**: Complex scenarios
6. **Real-World Examples**: Practical use cases
7. **Best Practices**: Tips surface at end

### Grid Layout
```typescript
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <!-- Examples -->
</div>
```

## Navigation Integration

### Main Demo Router
```typescript
// index.ts - Register all demos
const allDemos = [
  {
    name: 'Component Name',
    component: lazy(() => import('./path')),
    icon: 'material-icon',
    value: 'unique-id'
  }
]

// Navigate
area.push({
  area: 'main',
  component: demo.component
})
```

### Lazy Loading
```typescript
component: lazy(() => import('./features/category/component'))
```
Use for all route-based demos to optimize initial load.

## Shared Demo Components

### Installation Section
```typescript
import '../../shared/installation-section'

<installation-section></installation-section>
```

### Code Sections
```typescript
<schmancy-surface type="surfaceDim" class="rounded-lg p-6">
  <schmancy-typography type="headline" token="sm" class="mb-3 flex items-center gap-2">
    <schmancy-icon size="sm" class="text-primary">icon_name</schmancy-icon>
    Section Title
  </schmancy-typography>
  <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
    Description text
  </schmancy-typography>
</schmancy-surface>
```

## Form Demo Patterns

### Validation Examples
```typescript
<schmancy-form
  @submit=${(e: Event) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    console.log('Submitted:', Object.fromEntries(formData))
  }}
>
  <!-- Form fields -->
</schmancy-form>
```

### Multi-Select with Chips Display
```typescript
${this.selectedValues.length > 0 ? html`
  <div class="flex flex-wrap gap-2">
    ${this.selectedValues.map(val => html`
      <schmancy-chip type="assist">${val}</schmancy-chip>
    `)}
  </div>
` : ''}
```

## Styling Demos

### Responsive Examples
```typescript
class="w-full sm:w-auto"     // Full mobile, auto desktop
class="flex-col sm:flex-row"  // Stack mobile, row desktop
class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" // Responsive grid
```

### Theme-Aware Colors
- `text-surface-onVariant` - muted text
- `text-primary-default` - accent text
- `bg-surface-container` - subtle background
- Always use theme color tokens, never hardcoded colors

## Performance Tips for Demos

1. **State Updates**: Only update what changes
2. **Repeat Directive**: Use for lists > 5 items
3. **Lazy Loading**: All route components
4. **Event Logging**: `console.log()` for demo clarity, not production

## Demo Conventions

- Export as `default class`
- Use descriptive state variable names
- Include variety: basic → advanced → real-world
- Show both success and error states
- Demonstrate responsive behavior
- Always include accessibility features in examples
