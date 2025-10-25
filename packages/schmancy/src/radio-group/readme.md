# Schmancy Radio Group Component

A flexible radio button group component with support for both declarative options and slotted radio buttons, built with reactive state management.

## Overview

The `schmancy-radio-group` component provides two usage patterns:
- **Declarative options**: Pass an array of options for automatic radio button generation
- **Slotted radio buttons**: Use individual `schmancy-radio-button` components for maximum flexibility
- **Form integration**: Full HTML form support with validation
- **Reactive state management**: Built with RxJS for predictable state updates
- **TypeScript support**: Complete type safety with proper interfaces

## Installation

```typescript
import '@schmancy/radio-group'
// or
import { RadioGroup, RadioButton } from '@schmancy/radio-group'
```

## Basic Usage

### Declarative Options

```html
<schmancy-radio-group
  name="fruit"
  label="Select your favorite fruit"
  value="apple"
  required
  .options=${[
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Orange', value: 'orange' }
  ]}
></schmancy-radio-group>
```

```typescript
// Setting value programmatically
const radioGroup = document.querySelector('schmancy-radio-group')
radioGroup.value = 'banana'

// Getting selected value
console.log(radioGroup.value) // 'banana'
```

### Slotted Radio Buttons

For more control over individual radio buttons:

```html
<schmancy-radio-group name="size" label="Select size" value="medium">
  <schmancy-radio-button value="small">
    <span slot="label">Small (S)</span>
  </schmancy-radio-button>
  <schmancy-radio-button value="medium">
    <span slot="label">Medium (M)</span>
  </schmancy-radio-button>
  <schmancy-radio-button value="large">
    <span slot="label">Large (L)</span>
  </schmancy-radio-button>
</schmancy-radio-group>
```

## Properties

### SchmancyRadioGroup

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | `string` | `''` | Form field name for submission |
| `value` | `string` | `''` | Currently selected value |
| `label` | `string` | `''` | Group label displayed above options |
| `options` | `SchmancyRadioGroupOption[]` | `[]` | Array of options for declarative mode |
| `required` | `boolean` | `false` | Make field required for form validation |

### SchmancyRadioButton

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string` | `''` | Value of this radio button |
| `checked` | `boolean` | `false` | Whether this button is selected |
| `disabled` | `boolean` | `false` | Disable this radio button |
| `name` | `string` | `''` | Form field name (usually inherited from group) |

## Types

```typescript
interface SchmancyRadioGroupOption {
  label: string
  value: string
}

interface SchmancyRadioGroupChangeEvent extends CustomEvent {
  detail: {
    value: string
  }
}
```

## Events

### SchmancyRadioGroupChangeEvent

The component dispatches a `change` event when the selection changes:

```typescript
// Event handling
radioGroup.addEventListener('change', (e: SchmancyRadioGroupChangeEvent) => {
  console.log('Selected value:', e.detail.value)
})
```

## Form Integration

The component fully supports HTML form integration:

```html
<form id="preferencesForm">
  <schmancy-radio-group
    name="theme"
    label="Theme Preference"
    required
    .options=${[
      { label: 'Light Mode', value: 'light' },
      { label: 'Dark Mode', value: 'dark' },
      { label: 'Auto (System)', value: 'auto' }
    ]}
  ></schmancy-radio-group>

  <schmancy-radio-group
    name="notifications"
    label="Notification Frequency"
    value="daily"
    .options=${[
      { label: 'Immediate', value: 'immediate' },
      { label: 'Daily Digest', value: 'daily' },
      { label: 'Weekly Summary', value: 'weekly' },
      { label: 'Disabled', value: 'never' }
    ]}
  ></schmancy-radio-group>

  <button type="submit">Save Preferences</button>
</form>
```

```typescript
// Form submission handling
document.getElementById('preferencesForm').addEventListener('submit', (e) => {
  e.preventDefault()
  const formData = new FormData(e.target)

  console.log({
    theme: formData.get('theme'),
    notifications: formData.get('notifications')
  })
})
```

## Advanced Examples

### Mixed Usage Pattern

```html
<schmancy-radio-group name="plan" label="Select Plan" value="pro">
  <!-- Custom radio button with rich content -->
  <schmancy-radio-button value="free">
    <div slot="label" class="flex items-center justify-between w-full">
      <div>
        <div class="font-semibold">Free Plan</div>
        <div class="text-sm text-gray-500">Basic features</div>
      </div>
      <div class="text-lg font-bold">$0</div>
    </div>
  </schmancy-radio-button>

  <!-- Another custom radio button -->
  <schmancy-radio-button value="pro">
    <div slot="label" class="flex items-center justify-between w-full">
      <div>
        <div class="font-semibold">Pro Plan</div>
        <div class="text-sm text-gray-500">Advanced features</div>
      </div>
      <div class="text-lg font-bold">$19/mo</div>
    </div>
  </schmancy-radio-button>

  <schmancy-radio-button value="enterprise">
    <div slot="label" class="flex items-center justify-between w-full">
      <div>
        <div class="font-semibold">Enterprise Plan</div>
        <div class="text-sm text-gray-500">All features + support</div>
      </div>
      <div class="text-lg font-bold">$99/mo</div>
    </div>
  </schmancy-radio-button>
</schmancy-radio-group>
```

### Dynamic Options

```typescript
// Populate options dynamically
const radioGroup = document.querySelector<RadioGroup>('schmancy-radio-group')

async function loadCategories() {
  const categories = await fetch('/api/categories').then(r => r.json())

  radioGroup.options = categories.map(cat => ({
    label: cat.name,
    value: cat.id
  }))
}

// Set initial selection
radioGroup.value = 'default-category'

// Listen for changes
radioGroup.addEventListener('change', (e: SchmancyRadioGroupChangeEvent) => {
  console.log('Category selected:', e.detail.value)
  updateContentForCategory(e.detail.value)
})
```

### Standalone Radio Button

Radio buttons can also be used independently outside of a radio group:

```html
<schmancy-radio-button
  name="standalone"
  value="option1"
  checked
>
  <span slot="label">I agree to the terms and conditions</span>
</schmancy-radio-button>
```

```typescript
const standaloneRadio = document.querySelector('schmancy-radio-button')
standaloneRadio.addEventListener('change', (e) => {
  console.log('Checkbox changed:', e.detail.value)
})
```

## Accessibility Features

The component implements comprehensive accessibility features:

### Keyboard Navigation
- **Tab**: Move focus between radio buttons
- **Arrow Keys**: Navigate between options within a group
- **Space**: Select the focused radio button

### ARIA Attributes
The component automatically manages ARIA attributes:
- `role="radiogroup"` on the container
- `role="radio"` on individual buttons
- `aria-checked` state management
- `aria-required` for required groups
- `aria-disabled` for disabled buttons

### Screen Reader Support
Full screen reader compatibility with proper announcements for:
- Group labels and descriptions
- Selected values
- Required field states

## TypeScript Usage

```typescript
import {
  RadioGroup,
  RadioButton,
  SchmancyRadioGroupChangeEvent,
  SchmancyRadioGroupOption
} from '@schmancy/radio-group'

// Create options with type safety
const themeOptions: SchmancyRadioGroupOption[] = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' }
]

// Get typed reference
const radioGroup = document.querySelector<RadioGroup>('schmancy-radio-group')

// Type-safe value setting
radioGroup.options = themeOptions
radioGroup.value = 'light'

// Typed event handling
radioGroup?.addEventListener('change', (event: SchmancyRadioGroupChangeEvent) => {
  const selectedValue: string = event.detail.value
  console.log('Selected:', selectedValue)
})
```

## Browser Support

The component uses modern web standards and requires browsers that support:
- Custom Elements v1
- Shadow DOM v1
- ES2015+
- CSS Custom Properties

For older browsers, consider using appropriate polyfills.

## Related Components

- `schmancy-radio-button` - Individual radio button component
- `schmancy-checkbox` - Checkbox component for multi-select scenarios
- `schmancy-select` - Dropdown selection component
