# Schmancy Details - AI Reference

A Material Design 3 compliant expansion panel component with smooth Web Animations API transitions, customizable indicators, and flexible padding control.
```js
// Import
import '@schmancy/index'  // For all Schmancy components
// Or specific import: import '@schmancy/details'

// Basic Details Component
<schmancy-details
  summary="Section Title"                          // Summary text (also via slot)
  open?                                           // Whether details is expanded (default: false)
  variant="outlined|filled|elevated"              // Visual variant (default: "outlined")
  type="success|error|warning"                    // Semantic type with color coding
  summary-padding="px-3 py-2"                     // Tailwind padding classes for summary
  content-padding="px-3 pb-2"                     // Tailwind padding classes for content
  indicator-placement="start|end"                 // Indicator position (default: "end")
  hide-indicator?                                 // Hide the expand/collapse indicator
  @toggle=${handleToggle}>                        // Fires when expanded/collapsed
  
  <!-- Custom indicator (optional) -->
  <schmancy-icon slot="indicator">expand_more</schmancy-icon>
  
  <!-- Custom summary (optional) -->
  <div slot="summary">Custom Summary Content</div>
  
  <!-- Content -->
  <p>This content is shown when the details are expanded.</p>
</schmancy-details>

// Events
@toggle    // CustomEvent<{ open: boolean }> - Fires when toggling open/closed state

// Properties
details.open -> boolean                    // Get/set open state
details.variant -> string                  // Get/set visual variant
details.type -> string | undefined         // Get/set semantic type
details.summary -> string                  // Get/set summary text
details.summaryPadding -> string          // Get/set summary padding classes
details.contentPadding -> string          // Get/set content padding classes
details.indicatorPlacement -> string      // Get/set indicator position
details.hideIndicator -> boolean          // Get/set indicator visibility
```

## Material Design 3 Features

- **Web Animations API**: GPU-accelerated 200ms rotation with ease-out timing
- **Interactive States**: Hover effects with proper state layers
- **Tailwind Integration**: Full utility class support for spacing control
- **Keyboard Support**: Full keyboard navigation with Enter/Space activation
- **Elevation System**: Proper M3 elevation levels for elevated variant
- **Focus Indicators**: 2px primary color outline with 2px offset
- **Semantic Colors**: Type-based color coding with M3 color roles
- **Performance Optimized**: Uses Lit directives (ref, when, classMap) for efficient rendering

## Visual Variants

### Outlined (Default)
```html
<schmancy-details variant="outlined" summary="Outlined Details">
  <p>Details with a border outline and surface background.</p>
</schmancy-details>
```

### Filled
```html
<schmancy-details variant="filled" summary="Filled Details">
  <p>Details with surface-container background.</p>
</schmancy-details>
```

### Elevated
```html
<schmancy-details variant="elevated" summary="Elevated Details">
  <p>Details with elevation shadow that increases when opened (shadow-md → shadow-lg).</p>
</schmancy-details>
```

## Semantic Types

Add semantic meaning with colored left borders and tinted backgrounds:
```html
<!-- Success state -->
<schmancy-details type="success" summary="Success Notification">
  <p>Your changes have been saved successfully!</p>
</schmancy-details>

<!-- Error state -->
<schmancy-details type="error" summary="Error Details">
  <p>There was a problem processing your request.</p>
</schmancy-details>

<!-- Warning state -->
<schmancy-details type="warning" summary="Important Warning">
  <p>Please review these important changes before proceeding.</p>
</schmancy-details>
```

## Padding Customization

Control spacing with Tailwind utility classes:
```html
<!-- Compact spacing -->
<schmancy-details
  summary-padding="px-2 py-1.5"
  content-padding="px-2 pb-1.5"
  summary="Compact Details">
  <p class="text-sm">Minimal padding for dense UIs.</p>
</schmancy-details>

<!-- Spacious layout -->
<schmancy-details
  summary-padding="px-6 py-4"
  content-padding="px-6 pb-4"
  summary="Spacious Details">
  <p>Extra breathing room for important content.</p>
</schmancy-details>

<!-- Asymmetric padding -->
<schmancy-details
  summary-padding="pl-4 pr-6 py-3"
  content-padding="pl-4 pr-6 pb-3"
  summary="Custom Spacing">
  <p>Fine-tuned padding control.</p>
</schmancy-details>

<!-- No padding content (for nested components) -->
<schmancy-details
  summary-padding="px-4 py-3"
  content-padding="p-0"
  summary="Full Width Content">
  <img src="/banner.jpg" alt="Banner" class="w-full">
</schmancy-details>
```

## Custom Indicators

### Using Material Icons
```html
<schmancy-details indicator-placement="start">
  <schmancy-icon slot="indicator">arrow_drop_down</schmancy-icon>
  <div slot="summary">Expand for Details</div>
  <p>Content here...</p>
</schmancy-details>
```

### Custom SVG or Component
```html
<schmancy-details>
  <div slot="indicator" class="text-primary-default">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 10l5 5 5-5z"/>
    </svg>
  </div>
  <div slot="summary">Custom Icon</div>
  <p>Your content...</p>
</schmancy-details>
```

### Hide Indicator
```html
<schmancy-details hide-indicator summary="No Indicator">
  <p>Details without an expansion indicator.</p>
</schmancy-details>
```

### Indicator Placement
```html
<!-- Indicator on the left -->
<schmancy-details indicator-placement="start" summary="Left Indicator">
  <p>Indicator appears before the summary text.</p>
</schmancy-details>

<!-- Indicator on the right (default) -->
<schmancy-details indicator-placement="end" summary="Right Indicator">
  <p>Indicator appears after the summary text.</p>
</schmancy-details>
```

## Usage Examples

### FAQ Section with Types
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
    type="success"
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
  summary-padding="px-4 py-3"
  content-padding="px-4 pb-4"
  @toggle=${(e) => console.log('Settings panel:', e.detail.open ? 'opened' : 'closed')}>

  <div class="mt-2 space-y-4">
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

    <div class="mt-4 space-y-2">
      <schmancy-details variant="elevated" summary="Technical Specifications">
        <div class="grid grid-cols-2 gap-4 mt-2 text-sm">
          <div><strong>Dimensions:</strong> 10" x 8" x 2"</div>
          <div><strong>Weight:</strong> 2.5 lbs</div>
          <div><strong>Material:</strong> Aluminum</div>
          <div><strong>Color:</strong> Space Gray</div>
        </div>
      </schmancy-details>

      <schmancy-details variant="elevated" summary="Shipping & Returns">
        <div class="mt-2 space-y-2 text-sm">
          <p><strong>Free shipping</strong> on orders over $50</p>
          <p><strong>30-day return policy</strong> - no questions asked</p>
          <p><strong>2-year warranty</strong> included</p>
        </div>
      </schmancy-details>

      <schmancy-details variant="elevated" summary="Customer Reviews">
        <div class="mt-2 space-y-3">
          <div class="pl-3 border-l-2 border-primary-default">
            <p class="text-sm">"Great quality product, exactly as described."</p>
            <p class="text-xs text-surface-onVariant">- Sarah M.</p>
          </div>
          <div class="pl-3 border-l-2 border-primary-default">
            <p class="text-sm">"Fast shipping and excellent customer service."</p>
            <p class="text-xs text-surface-onVariant">- Mike R.</p>
          </div>
        </div>
      </schmancy-details>
    </div>
  </div>
</schmancy-card>
```

### Alert/Notification Panel
```html
<!-- Success notification -->
<schmancy-details
  variant="filled"
  type="success"
  summary="Deployment Successful"
  summary-padding="px-4 py-3">
  <div class="mt-2 text-sm">
    <p class="mb-2">Your application has been deployed to production.</p>
    <ul class="space-y-1 list-disc list-inside">
      <li>Build completed in 2m 34s</li>
      <li>All tests passed (127/127)</li>
      <li>Zero security vulnerabilities found</li>
    </ul>
  </div>
</schmancy-details>

<!-- Error notification -->
<schmancy-details
  variant="filled"
  type="error"
  summary="Build Failed"
  open
  summary-padding="px-4 py-3">
  <div class="mt-2 text-sm">
    <p class="mb-2">The build process encountered errors:</p>
    <code class="block p-2 rounded bg-black/10">
      TypeError: Cannot read property 'map' of undefined<br>
      at components/UserList.tsx:45:12
    </code>
  </div>
</schmancy-details>

<!-- Warning notification -->
<schmancy-details
  variant="filled"
  type="warning"
  summary="Action Required"
  summary-padding="px-4 py-3">
  <div class="mt-2 text-sm">
    <p class="mb-2">Your trial period expires in 3 days.</p>
    <schmancy-button variant="filled">Upgrade Now</schmancy-button>
  </div>
</schmancy-details>
```

## Customization with Slots

Use slots for complex summary content:
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
  <div class="mt-2">
    <p>User profile information and settings...</p>
  </div>
</schmancy-details>
```

### With Custom Indicators
```html
<schmancy-details variant="filled" indicator-placement="start">
  <!-- Custom animated icon -->
  <div slot="indicator" class="text-primary-default">
    <schmancy-icon>expand_circle_down</schmancy-icon>
  </div>
  
  <!-- Rich summary content -->
  <div slot="summary" class="flex items-center justify-between flex-1">
    <span>Section Title</span>
    <schmancy-chip size="sm">3 items</schmancy-chip>
  </div>

  <p>Content here...</p>
</schmancy-details>
```

## Programmatic Control
```typescript
// Get reference to details element
const details = document.querySelector('schmancy-details')

// Open/close programmatically
details.open = true
details.open = false

// Listen to toggle events
details.addEventListener('toggle', (e) => {
  console.log('Details is now:', e.detail.open ? 'open' : 'closed')
})

// Change variant dynamically
details.variant = 'elevated'

// Update padding
details.summaryPadding = 'px-6 py-4'
details.contentPadding = 'px-6 pb-4'

// Hide indicator
details.hideIndicator = true
```

## Accordion Pattern

Create accordion groups where only one item is open at a time:
```html
<div class="space-y-2" id="accordion">
  <schmancy-details
    variant="outlined"
    summary="Section 1"
    @toggle=${handleAccordionToggle}>
    <p>Content for section 1</p>
  </schmancy-details>

  <schmancy-details
    variant="outlined"
    summary="Section 2"
    @toggle=${handleAccordionToggle}>
    <p>Content for section 2</p>
  </schmancy-details>

  <schmancy-details
    variant="outlined"
    summary="Section 3"
    @toggle=${handleAccordionToggle}>
    <p>Content for section 3</p>
  </schmancy-details>
</div>

<script>
function handleAccordionToggle(e) {
  if (e.detail.open) {
    const accordion = document.getElementById('accordion')
    const allDetails = accordion.querySelectorAll('schmancy-details')
    allDetails.forEach(detail => {
      if (detail !== e.target) {
        detail.open = false
      }
    })
  }
}
</script>
```

## Accessibility

- Uses semantic HTML `<details>` and `<summary>` elements
- Keyboard navigation fully supported (Enter/Space to toggle)
- Focus management with visible focus indicators (2px primary outline)
- Screen reader compatible with proper ARIA attributes
- Minimum touch target sizes for mobile accessibility
- `delegatesFocus: true` for proper focus handling

## Performance

- **Web Animations API**: Hardware-accelerated transforms with `will-change-transform`
- **Lit Directives**: Optimized rendering with `ref`, `when`, and `classMap`
- **Animation Cancellation**: Previous animations are cancelled to prevent conflicts
- **RxJS Cleanup**: Proper subscription cleanup with `takeUntil(this.disconnecting)`
- **Minimal Reflows**: Uses GPU-accelerated CSS transforms for smooth animations

## Related Components

- **[Card](./card.md)** - Container for details in card layouts
- **[List](./list.md)** - Use with list items for expandable content
- **[Icon](./icon.md)** - Custom indicator icons
- **[Typography](./typography.md)** - For summary and content text styling
- **[Badge](./badge.md)** - Add status indicators to summaries
- **[Chip](./chip.md)** - Count or category indicators

## Common Use Cases

1. **FAQ Sections** - Collapsible question/answer pairs with semantic types
2. **Settings Panels** - Group related configuration options
3. **Product Details** - Specifications, shipping, reviews
4. **Documentation** - Code examples, detailed explanations
5. **Form Sections** - Group related form fields with validation states
6. **Navigation** - Collapsible menu sections
7. **Notifications** - Alert panels with expandable details
8. **Dashboard Widgets** - Expandable data panels with custom padding

## Design Tokens

The component uses the following Schmancy design tokens:

- `--schmancy-sys-color-surface-*` - Surface colors for backgrounds
- `--schmancy-sys-color-outline-variant` - Border colors
- `--schmancy-sys-color-primary-default` - Focus indicators
- `--schmancy-sys-color-success-*` - Success type colors
- `--schmancy-sys-color-error-*` - Error type colors
- `--schmancy-sys-color-warning-*` - Warning type colors
- `--schmancy-sys-elevation-*` - Shadow levels for elevation
- `--schmancy-sys-shape-corner-medium` - Border radius
