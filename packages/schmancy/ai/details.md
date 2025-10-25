# Schmancy Details - AI Reference

A Material Design 3 compliant expansion panel component with smooth animations, ripple effects, and interactive states.

```js
// Import
import '@schmancy/index'  // For all Schmancy components
// Or specific import: import '@schmancy/details'

// Basic Details Component
<schmancy-details
  summary="Section Title"                          // Summary text (also via slot)
  open?                                           // Whether details is expanded (default: false)
  variant="default|outlined|filled|elevated"      // Visual variant (default: "default")
  @toggle=${handleToggle}>                        // Fires when expanded/collapsed
  <!-- Content goes here -->
  <p>This content is shown when the details are expanded.</p>
</schmancy-details>

// Events
@toggle    // CustomEvent<{ open: boolean }> - Fires when toggling open/closed state

// Methods
details.open -> boolean     // Get/set open state
details.variant -> string   // Get/set visual variant
details.summary -> string   // Get/set summary text
```

## Material Design 3 Features

- **Interactive States**: Hover, focus, and pressed states with proper state layers
- **Ripple Effect**: Touch feedback animation on click/tap
- **Minimum Touch Target**: 48px height on mobile, 56px on desktop (M3 spec)
- **Smooth Animations**: 250ms slide-down animation with M3 easing curves
- **Keyboard Support**: Full keyboard navigation with Enter/Space activation
- **Elevation System**: Proper M3 elevation levels for elevated variant
- **Focus Indicators**: 2px primary color outline with 2px offset

## Visual Variants

### Default
```html
<schmancy-details summary="Default Details">
  <p>Plain details with no special styling.</p>
</schmancy-details>
```

### Outlined
```html
<schmancy-details variant="outlined" summary="Outlined Details">
  <p>Details with a border outline.</p>
</schmancy-details>
```

### Filled
```html
<schmancy-details variant="filled" summary="Filled Details">
  <p>Details with a filled background.</p>
</schmancy-details>
```

### Elevated
```html
<schmancy-details variant="elevated" summary="Elevated Details">
  <p>Details with elevation shadow that increases when opened.</p>
</schmancy-details>
```

## Usage Examples

### FAQ Section
```html
<div class="space-y-4">
  <schmancy-details
    variant="outlined"
    summary="How do I get started?">
    <p>To get started, simply install the package and import the components you need.</p>
    <schmancy-button variant="text" href="/docs">View Documentation</schmancy-button>
  </schmancy-details>

  <schmancy-details
    variant="outlined"
    summary="What browsers are supported?">
    <p>We support all modern browsers including Chrome, Firefox, Safari, and Edge.</p>
  </schmancy-details>

  <schmancy-details
    variant="outlined"
    summary="Is this free to use?">
    <p>Yes! This library is open source and free to use in your projects.</p>
  </schmancy-details>
</div>
```

### Settings Panel
```html
<schmancy-details
  variant="filled"
  summary="Advanced Settings"
  @toggle=${(e) => console.log('Settings panel:', e.detail.open ? 'opened' : 'closed')}>

  <div class="space-y-4 mt-4">
    <schmancy-checkbox label="Enable notifications"></schmancy-checkbox>
    <schmancy-checkbox label="Auto-save drafts"></schmancy-checkbox>
    <schmancy-select label="Theme preference">
      <schmancy-option value="light">Light</schmancy-option>
      <schmancy-option value="dark">Dark</schmancy-option>
      <schmancy-option value="auto">Auto</schmancy-option>
    </schmancy-select>
  </div>
</schmancy-details>
```

### Product Information
```html
<schmancy-card>
  <div slot="content">
    <h2>Product Name</h2>
    <p>Basic product description...</p>

    <div class="space-y-2 mt-4">
      <schmancy-details variant="elevated" summary="Technical Specifications">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Dimensions:</strong> 10" x 8" x 2"</div>
          <div><strong>Weight:</strong> 2.5 lbs</div>
          <div><strong>Material:</strong> Aluminum</div>
          <div><strong>Color:</strong> Space Gray</div>
        </div>
      </schmancy-details>

      <schmancy-details variant="elevated" summary="Shipping & Returns">
        <div class="text-sm space-y-2">
          <p><strong>Free shipping</strong> on orders over $50</p>
          <p><strong>30-day return policy</strong> - no questions asked</p>
          <p><strong>2-year warranty</strong> included</p>
        </div>
      </schmancy-details>

      <schmancy-details variant="elevated" summary="Customer Reviews">
        <div class="space-y-3">
          <div class="border-l-2 border-primary-default pl-3">
            <p class="text-sm">"Great quality product, exactly as described."</p>
            <p class="text-xs text-surface-onVariant">- Sarah M.</p>
          </div>
          <div class="border-l-2 border-primary-default pl-3">
            <p class="text-sm">"Fast shipping and excellent customer service."</p>
            <p class="text-xs text-surface-onVariant">- Mike R.</p>
          </div>
        </div>
      </schmancy-details>
    </div>
  </div>
</schmancy-card>
```

## Customization with Slots

You can use slots for more complex summary content:

```html
<schmancy-details variant="outlined">
  <div slot="summary" class="flex items-center gap-3">
    <schmancy-avatar src="/user.jpg" size="sm"></schmancy-avatar>
    <div>
      <div class="font-medium">User Profile</div>
      <div class="text-xs text-surface-onVariant">Last updated 2 hours ago</div>
    </div>
    <schmancy-badge color="success">Online</schmancy-badge>
  </div>

  <!-- Content -->
  <div class="mt-4">
    <p>User profile information and settings...</p>
  </div>
</schmancy-details>
```

## Accessibility

- Uses semantic HTML `<details>` and `<summary>` elements
- Keyboard navigation fully supported (Enter/Space to toggle)
- Screen reader compatible with proper ARIA attributes
- Focus management with visible focus indicators

## Animation

The component includes a smooth slide-down animation when content is revealed:
- 200ms duration with ease-out timing
- Slight upward translation and fade-in effect
- No animation when collapsing (native browser behavior)

## Related Components

- **[Card](./card.md)** - Container for details in card layouts
- **[List](./list.md)** - Use with list items for expandable content
- **[Typography](./typography.md)** - For summary and content text styling
- **[Surface](./surface.md)** - Background surface theming

## Common Use Cases

1. **FAQ Sections** - Collapsible question/answer pairs
2. **Settings Panels** - Group related configuration options
3. **Product Details** - Specifications, shipping, reviews
4. **Documentation** - Code examples, detailed explanations
5. **Form Sections** - Group related form fields
6. **Navigation** - Collapsible menu sections