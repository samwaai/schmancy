# Schmancy Select Component

A fully-featured, accessible select dropdown component with support for single and multi-select modes, form integration, and comprehensive validation strategies.

## Overview

The `schmancy-select` component provides a customizable dropdown selection interface with:
- Single and multi-select modes
- Full form association with native HTML form support
- Comprehensive validation strategies
- Complete keyboard navigation and accessibility
- TypeScript support with proper typing
- Reactive state management

## Installation

```typescript
import '@schmancy/select/select'
// or
import { SchmancySelect } from '@schmancy/select/select'
```

## Basic Usage

### Single Select

```html
<schmancy-select
  name="country"
  label="Select Country"
  placeholder="Choose a country"
  required
>
  <schmancy-option value="us">United States</schmancy-option>
  <schmancy-option value="uk">United Kingdom</schmancy-option>
  <schmancy-option value="ca">Canada</schmancy-option>
</schmancy-select>
```

```typescript
// Setting value programmatically
const select = document.querySelector('schmancy-select')
select.value = 'us'

// Getting value
console.log(select.value) // 'us'
```

## Multi-Select Usage

### Using the `.values` Property (Recommended for Arrays)

**New in latest version:** The `.values` property provides a cleaner API for working with arrays in multi-select mode.

```html
<schmancy-select
  multi
  name="skills"
  label="Select Skills"
  placeholder="Choose multiple skills"
>
  <schmancy-option value="javascript">JavaScript</schmancy-option>
  <schmancy-option value="typescript">TypeScript</schmancy-option>
  <schmancy-option value="react">React</schmancy-option>
  <schmancy-option value="vue">Vue</schmancy-option>
</schmancy-select>
```

```typescript
// Setting values using the .values property (RECOMMENDED)
const select = document.querySelector('schmancy-select')
select.values = ['javascript', 'typescript', 'react']

// Getting values as an array
console.log(select.values) // ['javascript', 'typescript', 'react']

// The .value property still works but returns comma-separated string
console.log(select.value) // 'javascript,typescript,react'
```

### Multi-Select Value Handling

The component provides two ways to work with multi-select values:

1. **`.values` property (Recommended)**: Works directly with arrays
   - Setter accepts: `string[]`
   - Getter returns: `string[]`
   - Cleaner API for array manipulation

2. **`.value` property**: Maintains backward compatibility
   - Setter accepts: `string | string[]` (arrays are converted internally)
   - Getter returns: comma-separated `string` for multi-select
   - Useful for form submissions that expect string values

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | `string` | `undefined` | Form field name for submission |
| `value` | `string \| string[]` | `''` | Current selected value(s). Returns comma-separated string for multi-select |
| `values` | `string[]` | `[]` | Array of selected values for multi-select mode (preferred for arrays) |
| `multi` | `boolean` | `false` | Enable multi-select mode |
| `required` | `boolean` | `false` | Make field required for form validation |
| `disabled` | `boolean` | `false` | Disable the select component |
| `placeholder` | `string` | `''` | Placeholder text when no selection |
| `label` | `string` | `''` | Field label |
| `hint` | `string` | `''` | Helper text shown below the field |
| `validateOn` | `'always' \| 'touched' \| 'dirty' \| 'submitted'` | `'touched'` | When to show validation errors |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant of the select |

## Events

### SchmancySelectChangeEvent

The component dispatches a `change` event when the selection changes:

```typescript
interface SchmancySelectChangeEvent extends CustomEvent {
  detail: {
    value: string | string[]  // string for single, array for multi
  }
}
```

```typescript
// Event handling
select.addEventListener('change', (e: SchmancySelectChangeEvent) => {
  if (select.multi) {
    console.log('Selected values:', e.detail.value) // string[]
  } else {
    console.log('Selected value:', e.detail.value) // string
  }
})
```

## Methods

### checkValidity()
Checks if the current value satisfies validation constraints.

```typescript
const isValid = select.checkValidity()
console.log(isValid) // true or false
```

### reportValidity()
Checks validity and displays validation message if invalid. Opens the dropdown if validation fails to help users see available options.

```typescript
// Will show validation error and open dropdown if invalid
const isValid = select.reportValidity()
```

### setCustomValidity(message: string)
Sets a custom validation message.

```typescript
select.setCustomValidity('Please select a valid option from the list')
// Clear custom validity
select.setCustomValidity('')
```

### reset()
Resets the select to its initial value and clears validation states.

```typescript
select.reset()
```

## Form Integration

The component fully supports HTML form integration with automatic validation and submission handling.

```html
<form id="myForm">
  <schmancy-select
    name="department"
    label="Department"
    required
    validateOn="dirty"
  >
    <schmancy-option value="engineering">Engineering</schmancy-option>
    <schmancy-option value="design">Design</schmancy-option>
    <schmancy-option value="marketing">Marketing</schmancy-option>
  </schmancy-select>

  <button type="submit">Submit</button>
</form>
```

```typescript
// Form submission handling
document.getElementById('myForm').addEventListener('submit', (e) => {
  e.preventDefault()
  const formData = new FormData(e.target)
  console.log(formData.get('department')) // Selected value
})

// Programmatic form validation
const form = document.getElementById('myForm')
const isValid = form.checkValidity() // Validates all form fields including select
```

## Validation Strategies

The `validateOn` property controls when validation errors are displayed:

- **`'always'`**: Always show validation errors
- **`'touched'`**: Show errors after the user has interacted with the field (default)
- **`'dirty'`**: Show errors after the value has been changed
- **`'submitted'`**: Only show errors after form submission attempt

```html
<!-- Only show errors after user changes the value -->
<schmancy-select validateOn="dirty" required>
  <!-- options -->
</schmancy-select>

<!-- Always show validation state -->
<schmancy-select validateOn="always" required>
  <!-- options -->
</schmancy-select>
```

## Accessibility Features

The component implements comprehensive accessibility features:

### Keyboard Navigation

- **Tab**: Move focus to/from the select
- **Space/Enter**: Open dropdown or select focused option
- **Arrow Down**: Open dropdown or move to next option
- **Arrow Up**: Move to previous option
- **Home**: Move to first option
- **End**: Move to last option
- **Escape**: Close dropdown
- **Type-ahead**: Start typing to jump to matching options (coming soon)

### ARIA Attributes

The component automatically manages all necessary ARIA attributes:
- `role="combobox"` on the trigger
- `role="listbox"` on the dropdown
- `role="option"` on each option
- `aria-expanded` state
- `aria-selected` on options
- `aria-multiselectable` for multi-select mode
- `aria-activedescendant` for keyboard navigation
- `aria-required` for required fields
- `aria-disabled` for disabled state

### Screen Reader Support

Full screen reader compatibility with proper announcements for:
- Field labels and descriptions
- Selected values
- Available options
- Validation states and error messages

## TypeScript Usage

```typescript
import { SchmancySelect, SchmancySelectChangeEvent } from '@schmancy/select/select'

// Get typed reference
const select = document.querySelector<SchmancySelect>('schmancy-select')

// Type-safe value setting for multi-select
if (select) {
  // Using .values for arrays (recommended)
  select.values = ['option1', 'option2']

  // Or using .value (backward compatible)
  select.value = ['option1', 'option2'] // Internally converted to handle arrays
}

// Typed event handling
select?.addEventListener('change', (event: SchmancySelectChangeEvent) => {
  if (select.multi) {
    const selectedValues = event.detail.value as string[]
    console.log('Multiple selected:', selectedValues)
  } else {
    const selectedValue = event.detail.value as string
    console.log('Single selected:', selectedValue)
  }
})

// Form validation with types
const isValid: boolean = select?.checkValidity() ?? false
const reported: boolean = select?.reportValidity() ?? false
```

## Advanced Examples

### Dynamic Options with Validation

```typescript
// Populate options dynamically
const select = document.querySelector<SchmancySelect>('schmancy-select')
const options = ['Option 1', 'Option 2', 'Option 3']

options.forEach(opt => {
  const option = document.createElement('schmancy-option')
  option.value = opt.toLowerCase().replace(' ', '-')
  option.textContent = opt
  select?.appendChild(option)
})

// Set initial values for multi-select
if (select?.multi) {
  select.values = ['option-1', 'option-3']
}

// Custom validation
select?.addEventListener('change', (e: SchmancySelectChangeEvent) => {
  if (select.multi) {
    const values = e.detail.value as string[]
    if (values.length < 2) {
      select.setCustomValidity('Please select at least 2 options')
    } else if (values.length > 5) {
      select.setCustomValidity('Maximum 5 options allowed')
    } else {
      select.setCustomValidity('')
    }
  }
})
```

### Form with Multiple Selects

```html
<form id="complexForm">
  <!-- Single select -->
  <schmancy-select
    name="priority"
    label="Priority"
    required
  >
    <schmancy-option value="low">Low</schmancy-option>
    <schmancy-option value="medium">Medium</schmancy-option>
    <schmancy-option value="high">High</schmancy-option>
  </schmancy-select>

  <!-- Multi-select with values -->
  <schmancy-select
    multi
    name="assignees"
    label="Assignees"
    placeholder="Select team members"
    validateOn="dirty"
  >
    <schmancy-option value="john">John Doe</schmancy-option>
    <schmancy-option value="jane">Jane Smith</schmancy-option>
    <schmancy-option value="bob">Bob Johnson</schmancy-option>
  </schmancy-select>

  <button type="submit">Create Task</button>
</form>

<script>
  const form = document.getElementById('complexForm')
  const prioritySelect = form.querySelector('[name="priority"]')
  const assigneesSelect = form.querySelector('[name="assignees"]')

  // Set default values
  prioritySelect.value = 'medium'
  assigneesSelect.values = ['john', 'jane']

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    // Validate all selects
    if (!form.checkValidity()) {
      // Show validation errors
      prioritySelect.reportValidity()
      assigneesSelect.reportValidity()
      return
    }

    // Get form data
    const formData = new FormData(form)
    console.log({
      priority: formData.get('priority'),
      assignees: formData.get('assignees')?.split(',') // Convert back to array
    })
  })
</script>
```

## Browser Support

The component uses modern web standards and requires browsers that support:
- Custom Elements v1
- Shadow DOM v1
- ES2015+
- CSS Custom Properties

For older browsers, consider using appropriate polyfills.

## Related Components

- `schmancy-option` - Option component for use within schmancy-select
- `schmancy-input` - Text input component with similar validation features
- `schmancy-autocomplete` - Searchable select with autocomplete functionality