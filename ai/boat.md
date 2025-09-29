# Boat Component

## Overview
The boat component is a bottom sheet that slides up from the bottom of the screen. It can be in one of three states: hidden, minimized, or expanded. This component is perfect for displaying additional content or actions while keeping the main interface accessible.

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `state` | `'hidden' \| 'minimized' \| 'expanded'` | `'hidden'` | The current state of the boat component |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `toggle` | `'hidden' \| 'minimized' \| 'expanded'` | Fired when the state changes |

> **Note:** The component uses the `toggle` event name following HTML standards (similar to `<details>` and `<dialog>` elements). This prevents event name collisions with child components that might emit `change` events.

## Slots

| Slot | Description |
|------|-------------|
| `header` | Content to display in the header area (visible in both minimized and expanded states) |
| Default | Main content displayed when the boat is expanded |

## Usage

### Basic Example
```html
<schmancy-boat state="minimized">
  <schmancy-typography slot="header" variant="title">
    Boat Title
  </schmancy-typography>
  
  <div class="flex flex-col gap-4 p-4">
    <schmancy-typography>
      This is the main content of the boat component.
    </schmancy-typography>
  </div>
</schmancy-boat>
```

### With Icon in Header
```html
<schmancy-boat state="minimized" @toggle="${(e) => console.log(e.detail)}">
  <div slot="header" class="flex gap-2 justify-center">
    <schmancy-icon>info</schmancy-icon>
    <schmancy-typography variant="title">Settings</schmancy-typography>
  </div>

  <div class="flex flex-col gap-4 p-4">
    <!-- Settings content -->
  </div>
</schmancy-boat>
```

### Controlling State
```typescript
// Get reference to boat
const boat = document.querySelector('schmancy-boat');

// Show minimized
boat.state = 'minimized';

// Show expanded
boat.state = 'expanded';

// Hide
boat.state = 'hidden';

// Listen for state changes
boat.addEventListener('toggle', (e) => {
  console.log('New state:', e.detail);
});
```

## Features

- **Three States**: Hidden (completely off-screen), minimized (shows only header), and expanded (shows all content)
- **Smooth Transitions**: Animated transitions between states using CSS transforms
- **Responsive Design**: Different widths on various screen sizes:
  - Mobile: 100% width
  - Tablet: 70% width
  - Desktop: 60% width
  - Large screens: 40% width
- **Fixed Positioning**: Always appears at the bottom-right of the viewport
- **Overflow Handling**: Content scrolls when it exceeds 80vh max height
- **Sticky Header**: Header remains visible when scrolling through content

## CSS Classes

The component uses internal CSS classes for styling:
- `.translate-y-full`: Positions the boat completely off-screen (hidden state)
- `.translate-y-full-minus-64`: Shows only the header (minimized state)
- `.translate-y-0`: Shows the entire boat (expanded state)

## Use Cases

- **Chat Interfaces**: Keep a chat window accessible while browsing
- **Media Players**: Minimize music/video controls while using other features
- **Quick Settings**: Provide easy access to frequently used settings
- **Notifications**: Show important information that users can minimize
- **Form Wizards**: Multi-step forms that can be minimized during the process
- **Help/Support**: Keep help documentation accessible while working

## Accessibility

- The component uses semantic HTML structure
- State changes are announced via events
- Keyboard navigation is supported through the button controls
- Focus management is handled automatically

## Best Practices

1. **Header Content**: Keep header content concise and descriptive
2. **State Management**: Store the boat state in your application state if persistence is needed
3. **Content Height**: Design content to work well within the max-height constraint
4. **Mobile Considerations**: Test thoroughly on mobile devices where the boat takes full width
5. **Z-Index**: The component uses `z-[100]` - ensure this works with your app's z-index hierarchy