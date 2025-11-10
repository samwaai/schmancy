# Schmancy Directives - AI Reference

## Quick Start

```typescript
import { ripple, color, height, visibility, drag, drop } from '@schmancy/index'
// Or specific import: import { ripple, color, height, visibility, drag, drop } from '@schmancy/directives'

// Import types
import type { SchmancyDropEvent } from '@schmancy/index'
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

### Drag & Drop Directives

```typescript
// Make element draggable
<div ${drag(id: string)}></div>

// Make element a drop zone
<div ${drop(destinationId: string)} @drop=${handleDrop}></div>

// Drop event type
export type SchmancyDropEvent = CustomEvent<{
  source: string;      // ID of dragged element
  destination: string; // ID of drop zone
}>

// Handle drop event
const handleDrop = (e: SchmancyDropEvent) => {
  const { source, destination } = e.detail
  // Handle the drop...
}
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

// Drag and drop list items
<div class="space-y-2">
  ${items.map(item => html`
    <div
      ${drag(item.id)}
      ${drop(item.id)}
      @drop=${handleReorder}
      class="p-4 bg-surface-container rounded cursor-grab">
      ${item.name}
    </div>
  `)}
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

// Warehouse hierarchy management with drag & drop
@customElement('warehouse-manager')
class WarehouseManager extends $LitElement() {
  @state()
  warehouses: Warehouse[] = []

  private handleWarehouseReparent = (e: SchmancyDropEvent) => {
    const { source, destination } = e.detail

    // Find the warehouse being dragged and the new parent
    const warehouse = this.warehouses.find(w => w.id === source)
    const newParent = this.warehouses.find(w => w.id === destination)

    if (!warehouse || !newParent) return

    // Update the warehouse's parent
    warehouse.parentID = newParent.id

    // Save to database
    this.saveWarehouse(warehouse)

    // Notify user
    this.dispatchEvent(new CustomEvent('warehouse-moved', {
      detail: { warehouse, newParent }
    }))
  }

  render() {
    return html`
      <div class="space-y-2">
        ${repeat(
          this.warehouses,
          w => w.id,
          w => html`
            <schmancy-surface
              ${drag(w.id)}
              ${drop(w.id)}
              @drop=${this.handleWarehouseReparent}
              type="containerLow"
              class="p-4 cursor-grab active:cursor-grabbing">
              <div class="flex items-center gap-3">
                <span>${w.emoji || '📦'}</span>
                <span>${w.name}</span>
              </div>
            </schmancy-surface>
          `
        )}
      </div>
    `
  }
}

// Sortable task list
@customElement('task-list')
class TaskList extends $LitElement() {
  @state()
  tasks: Task[] = []

  private handleTaskReorder = (e: SchmancyDropEvent) => {
    const { source, destination } = e.detail

    // Find indices
    const sourceIndex = this.tasks.findIndex(t => t.id === source)
    const destIndex = this.tasks.findIndex(t => t.id === destination)

    if (sourceIndex === -1 || destIndex === -1) return

    // Reorder array
    const [movedTask] = this.tasks.splice(sourceIndex, 1)
    this.tasks.splice(destIndex, 0, movedTask)

    // Trigger re-render
    this.tasks = [...this.tasks]

    // Persist order
    this.saveTasks()
  }

  render() {
    return html`
      <div class="space-y-2">
        ${repeat(
          this.tasks,
          t => t.id,
          t => html`
            <div
              ${drag(t.id)}
              ${drop(t.id)}
              @drop=${this.handleTaskReorder}
              class="p-4 bg-surface-container rounded cursor-grab hover:bg-surface-containerHigh transition-colors">
              <schmancy-checkbox
                ?checked=${t.completed}
                @change=${() => this.toggleTask(t)}>
                ${t.title}
              </schmancy-checkbox>
            </div>
          `
        )}
      </div>
    `
  }
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

### Drag & Drop Directives

**Drag Directive:**
- Sets `draggable="true"` on the element
- Sets cursor to `grab` (changes to `grabbing` during drag)
- Uses HTML5 Drag and Drop API
- Stores dragged element ID in global variable for access by drop zones
- Transfers data via `dataTransfer` API
- Implements `dragstart` and `dragend` event handlers
- Uses RxJS for event handling with automatic cleanup
- Prevents event bubbling with `stopPropagation()`

**Drop Directive:**
- Enables element as a drop zone
- Provides visual feedback during drag-over:
  - Dashed outline in tertiary color
  - Drop shadow effect for emphasis
- Prevents dropping element onto itself
- Cleans up visual feedback on drag leave
- Dispatches custom `SchmancyDropEvent` with source and destination IDs
- Event bubbles up for easy handling
- Uses RxJS to manage `dragover`, `dragleave`, and `drop` events
- Automatically calls `preventDefault()` to enable dropping

**Global State Management:**
- Uses module-level `currentDragSourceId` variable
- Tracks which element is being dragged
- Allows drop zones to prevent self-drop
- Cleared automatically when drag ends

**RxJS Integration:**
- All event listeners use RxJS `fromEvent()`
- Cleanup via `takeUntil(this.destroy$)` in `disconnected()`
- Combines multiple event streams with `merge()`
- Proper memory management and no event listener leaks

## Best Practices

1. **Ripple Usage**: Best on interactive elements (buttons, cards, list items)
2. **Color Variables**: Prefer theme CSS variables over hardcoded colors
3. **Height Animations**: Combine with CSS transitions for smooth effects
4. **Visibility**: Use for simple show/hide; consider v-show for more control
5. **Performance**: Directives are lightweight but avoid excessive updates
6. **Drag IDs**: Always use unique, stable IDs (not array indices that can change)
7. **Drop Zones**: Make drop zones visually distinct so users know where to drop
8. **Accessibility**: Drag & drop isn't accessible - provide alternative keyboard navigation
9. **Touch Devices**: HTML5 drag/drop has limited mobile support - consider alternatives for mobile
10. **Visual Feedback**: Use cursor changes and hover states to indicate draggable elements
11. **Prevent Self-Drop**: Both directives automatically prevent dropping onto self
12. **Event Bubbling**: Drop events bubble up - handle at parent level if needed

## Common Pitfalls

- **Ripple Overflow**: Parent element needs `position: relative` and `overflow: hidden`
- **Color Specificity**: Inline styles from color directive override CSS classes
- **Height Auto**: Transitioning to/from 'auto' requires special handling
- **Visibility vs Display**: Visibility directive uses display, not visibility property
- **Drag Ghost Image**: Browser creates default ghost image - customize with `setDragImage()`
- **Mobile Support**: Touch events don't trigger HTML5 drag/drop - polyfill required
- **Z-Index Issues**: Dragged element may appear behind other elements
- **Drop Validation**: Always validate source/destination IDs before processing
- **Memory Leaks**: Directives handle cleanup automatically via RxJS `takeUntil()`
- **Multiple Drops**: If element has both `drag()` and `drop()`, ensure IDs match intent
- **Event Order**: `dragstart` → `dragover` (repeated) → `drop` → `dragend`
- **DataTransfer**: Data is only accessible in `drop` event, not `dragover`

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

// Drag directive
drag(id: string): DirectiveResult

// Drop directive
drop(destinationId: string): DirectiveResult

// Drop event type
export type SchmancyDropEvent = CustomEvent<{
  source: string;      // ID of the dragged element
  destination: string; // ID of the drop zone
}>

// Example event handler signature
type DropHandler = (e: SchmancyDropEvent) => void
```