# Schmancy Button - AI Reference

```js
// Component Tags
<schmancy-button
  variant="elevated|filled|filled tonal|outlined|text"  // Visual style (default: "text")
  width="full|auto"                                     // Button width (default: "auto")
  type="button|reset|submit"                            // HTML button type (default: "button")
  href?="string"                                        // Makes button a link
  disabled?                                             // Disable state
  aria-label?="string"                                  // Accessibility label
  @click=${handler}>
  <!-- Content with optional prefix/suffix slots -->
</schmancy-button>

// Icon Button Component
<schmancy-icon-button
  variant="elevated|filled|filled tonal|outlined|text"  // Visual style (default: "text")
  size="sm|md|lg"                                      // Button size (default: "md")
  width="full|auto"                                     // Button width (default: "auto")
  type="button|reset|submit"                            // HTML button type (default: "button")
  href?="string"                                        // Makes button a link
  disabled?                                             // Disable state
  aria-label="string">                                  // Accessibility label
  icon_name
</schmancy-icon-button>

// Component Methods
button.focus(options?: FocusOptions) -> void
button.blur() -> void
button.click() -> void

// Slots
default  // Button text content
prefix   // Icon or content before text
suffix   // Icon or content after text

// Examples
// 1. Basic button with text
<schmancy-button variant="filled">Save Changes</schmancy-button>

// 2. Button with icon
<schmancy-button variant="outlined">
  <schmancy-icon slot="prefix">add</schmancy-icon>
  Add Item
</schmancy-button>

// 3. Button as link
<schmancy-button href="/learn-more" variant="text">Learn More</schmancy-button>

// 4. Full width button
<schmancy-button width="full" variant="filled">Submit Form</schmancy-button>

// 5. Icon-only button
<schmancy-icon-button variant="filled" ariaLabel="Settings">
  settings
</schmancy-icon-button>

// 6. Form submission buttons
<schmancy-form @submit="${handleSubmit}">
  <div class="flex gap-2 justify-end">
    <schmancy-button type="button" variant="text">Cancel</schmancy-button>
    <schmancy-button type="submit" variant="filled">Submit</schmancy-button>
  </div>
</schmancy-form>

// 7. Loading state pattern
<schmancy-button variant="filled" ?disabled="${isLoading}">
  ${isLoading 
    ? html`<schmancy-circular-progress slot="prefix" size="sm"></schmancy-circular-progress>`
    : html`<schmancy-icon slot="prefix">send</schmancy-icon>`
  }
  ${isLoading ? 'Sending...' : 'Send Message'}
</schmancy-button>

// 8. Button group
<div class="flex gap-2">
  <schmancy-button variant="outlined">Edit</schmancy-button>
  <schmancy-button variant="outlined">Delete</schmancy-button>
  <schmancy-button variant="filled">Save</schmancy-button>
</div>
```

## Related Components
- **[Icon](./icon.md)**: Used for button icons in prefix/suffix slots
- **[Card Action](./card.md)**: Container for button groups in cards
- **[Dialog](./dialog.md)**: Common usage for action buttons
- **[Form](./form.md)**: Form submission context
- **[FAB](./fab.md)**: Floating action button alternative
- **[Circular Progress](./circular-progress.md)**: Loading indicator for buttons

## Technical Details

### Variant Hierarchy
Material Design 3 emphasis levels (highest to lowest):
1. `filled` - Primary actions, highest emphasis
2. `filled tonal` / `elevated` - Important secondary actions
3. `outlined` - Medium emphasis with clear boundaries
4. `text` - Low emphasis, tertiary actions

### Icon Button Sizes
- `sm`: 40×40px container, 18px icon
- `md`: 48×48px container, 24px icon (default)
- `lg`: 56×56px container, 28px icon

### CSS Custom Properties
```css
/* Applied to button host element */
--schmancy-button-width: auto | 100%;  /* Controls button width */
```

### Accessibility
- Buttons automatically include ARIA attributes
- Icon-only buttons MUST have `ariaLabel`
- Focus management methods available
- Keyboard navigation fully supported

### State Management
- `disabled` attribute prevents all interactions
- Loading states should disable button to prevent double-submission
- Visual feedback through variant system

## Common Use Cases

1. **Primary Action Button**
   ```html
   <schmancy-button variant="filled" type="submit">
     Complete Purchase
   </schmancy-button>
   ```

2. **Secondary Action with Icon**
   ```html
   <schmancy-button variant="outlined">
     <schmancy-icon slot="prefix">upload</schmancy-icon>
     Upload File
   </schmancy-button>
   ```

3. **Navigation Link Button**
   ```html
   <schmancy-button href="/documentation" variant="text">
     View Documentation
     <schmancy-icon slot="suffix">arrow_forward</schmancy-icon>
   </schmancy-button>
   ```

4. **Responsive Mobile-First Button**
   ```html
   <schmancy-button variant="filled" class="w-full sm:w-auto">
     Get Started
   </schmancy-button>
   ```