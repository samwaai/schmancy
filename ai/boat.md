# schmancy-boat


Floating, draggable bottom sheet component with three states: `hidden`, `minimized`, `expanded`.

## API

```typescript
state: 'hidden' | 'minimized' | 'expanded'  // Current state
id: string                                   // Unique ID for position persistence
icon?: string                                // Material icon name
label?: string                               // Header text
badge?: string | number                      // Notification badge
lowered?: boolean                            // Reduced shadow elevation

// Methods
toggleState()  // Toggle minimized ↔ expanded
close()        // Hide and add to navigation

// Events
@toggle  // CustomEvent<'hidden' | 'minimized' | 'expanded'>
```

## Usage

```html
<!-- Basic -->
<schmancy-boat
  id="chat"
  icon="chat"
  label="Support"
  badge="3"
  state="minimized"
  @toggle=${e => this.state = e.detail}
>
  <div class="p-6">Content here</div>
</schmancy-boat>
```

## Critical Rules

- ✅ **ALWAYS** provide unique `id` (position persists to localStorage)
- ✅ **ALWAYS** use `icon`, `label`, `badge` properties (NOT `slot="header"`)
- ✅ **REQUIRES** content in default slot
- ❌ **NEVER** self-closing
- ❌ **NEVER** use deprecated `slot="header"`

## Features

- **Draggable**: Drag header to reposition, position saved to localStorage
- **Responsive**: Auto-adjusts width (mobile: full, desktop: 40vw)
- **Keyboard**: `Escape` to minimize/hide
- **Navigation**: Close button adds to nav rail/bar if available
