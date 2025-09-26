# Schmancy Autocomplete Component

A powerful, accessible autocomplete component with fuzzy search, multi-select support, and Gmail-style chip input display.

## Overview

The `schmancy-autocomplete` component provides an intelligent dropdown search interface with:
- **Fuzzy search** with configurable similarity threshold
- **Multi-select mode** with inline chip display (Gmail-style)
- **Auto-select behavior** on blur for improved UX
- **Debounced filtering** for performance optimization
- **Form association** with native HTML form support
- **Complete keyboard navigation** and accessibility
- **TypeScript support** with proper typing
- **Reactive state management** with RxJS

## Installation

```typescript
import '@schmancy/autocomplete/autocomplete'
// or
import { SchmancyAutocomplete } from '@schmancy/autocomplete/autocomplete'
```

## Basic Usage

### Single Select with Filtering

```html
<schmancy-autocomplete
  name="employee"
  label="Select Employee"
  placeholder="Type to search..."
  required
>
  <schmancy-option value="john-doe">John Doe</schmancy-option>
  <schmancy-option value="jane-smith">Jane Smith</schmancy-option>
  <schmancy-option value="bob-johnson">Bob Johnson</schmancy-option>
  <schmancy-option value="alice-williams">Alice Williams</schmancy-option>
</schmancy-autocomplete>
```

```typescript
// Setting value programmatically
const autocomplete = document.querySelector('schmancy-autocomplete')
autocomplete.value = 'john-doe'

// Getting value
console.log(autocomplete.value) // 'john-doe'
```

## Multi-Select Usage with Chips

### Using the `.values` Property (Recommended for Arrays)

The `.values` property provides a consistent API with `schmancy-select` for working with arrays in multi-select mode. Selected items are displayed as removable chips inline with the input field, similar to Gmail's recipient selection.

```html
<schmancy-autocomplete
  multi
  name="tags"
  label="Add Tags"
  placeholder="Type to add tags..."
  similarityThreshold="0.2"
>
  <schmancy-option value="javascript">JavaScript</schmancy-option>
  <schmancy-option value="typescript">TypeScript</schmancy-option>
  <schmancy-option value="react">React</schmancy-option>
  <schmancy-option value="vue">Vue</schmancy-option>
  <schmancy-option value="angular">Angular</schmancy-option>
  <schmancy-option value="svelte">Svelte</schmancy-option>
</schmancy-autocomplete>
```

```typescript
// Setting values using the .values property (RECOMMENDED)
const autocomplete = document.querySelector('schmancy-autocomplete')
autocomplete.values = ['javascript', 'typescript', 'react']

// Getting values as an array
console.log(autocomplete.values) // ['javascript', 'typescript', 'react']

// The .value property still works but returns comma-separated string
console.log(autocomplete.value) // 'javascript,typescript,react'
```

### Multi-Select Value Handling

The component provides two ways to work with multi-select values, consistent with `schmancy-select`:

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
| `name` | `string` | `''` | Form field name for submission |
| `value` | `string` | `''` | Current selected value(s). Returns comma-separated string for multi-select |
| `values` | `string[]` | `[]` | Array of selected values for multi-select mode (preferred for arrays) |
| `multi` | `boolean` | `false` | Enable multi-select mode with chip display |
| `required` | `boolean` | `false` | Make field required for form validation |
| `placeholder` | `string` | `''` | Placeholder text when no selection |
| `label` | `string` | `''` | Field label |
| `description` | `string` | `''` | Helper text for accessibility |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant of the autocomplete |
| `autocomplete` | `string` | `'off'` | HTML autocomplete attribute |
| `debounceMs` | `number` | `200` | Debounce delay for filtering in milliseconds |
| `similarityThreshold` | `number` | `0.3` | Minimum similarity score (0-1) to show option |
| `maxHeight` | `string` | `'300px'` | Maximum height of the dropdown |
| `error` | `boolean` | `false` | Show error state |
| `validationMessage` | `string` | `''` | Custom validation message to display |

## Events

### SchmancyAutocompleteChangeEvent

The component dispatches a `change` event when the selection changes:

```typescript
interface SchmancyAutocompleteChangeEvent extends CustomEvent {
  detail: {
    value: string | string[]  // string for single, comma-separated string for multi
    values?: string[]        // Array of values for multi-select mode
  }
}
```

```typescript
// Event handling
autocomplete.addEventListener('change', (e: SchmancyAutocompleteChangeEvent) => {
  if (autocomplete.multi) {
    console.log('Selected values:', e.detail.values) // string[]
    console.log('As string:', e.detail.value) // comma-separated string
  } else {
    console.log('Selected value:', e.detail.value) // string
  }
})
```

## Methods

### checkValidity()
Checks if the current value satisfies validation constraints.

```typescript
const isValid = autocomplete.checkValidity()
console.log(isValid) // true or false
```

### reportValidity()
Checks validity and reports validation state to the user.

```typescript
// Will show validation error if invalid
const isValid = autocomplete.reportValidity()
```

## Filtering and Search Behavior

### Fuzzy Search Algorithm

The component uses a sophisticated similarity algorithm to match user input against options:

- **Label prioritization**: Option labels are given slightly higher weight than values
- **Fuzzy matching**: Handles typos and partial matches intelligently
- **Relevance sorting**: Results are automatically sorted by match score
- **Configurable threshold**: Use `similarityThreshold` to control match sensitivity

```html
<!-- More permissive matching (shows more results) -->
<schmancy-autocomplete similarityThreshold="0.2">
  <!-- options -->
</schmancy-autocomplete>

<!-- Stricter matching (shows fewer, more relevant results) -->
<schmancy-autocomplete similarityThreshold="0.5">
  <!-- options -->
</schmancy-autocomplete>
```

### Auto-Select Behavior

When the user types and then blurs the input (tabs or clicks away), the component will automatically select the best matching option if:
1. The component is in single-select mode
2. There is typed text in the input
3. At least one option meets the similarity threshold
4. The dropdown was open

This behavior improves UX by reducing the need for explicit selection when the user's intent is clear.

### Debounced Filtering

Filtering is debounced by default (200ms) to improve performance with large option lists:

```html
<!-- Faster response for smaller lists -->
<schmancy-autocomplete debounceMs="100">
  <!-- options -->
</schmancy-autocomplete>

<!-- Slower response for better performance with huge lists -->
<schmancy-autocomplete debounceMs="500">
  <!-- options -->
</schmancy-autocomplete>
```

## Styling Options

### Size Variants

The component supports three size variants that affect the input height, padding, and font size:

```html
<!-- Small (40px height, 14px font) -->
<schmancy-autocomplete size="sm" label="Small">
  <!-- options -->
</schmancy-autocomplete>

<!-- Medium (50px height, 16px font) - Default -->
<schmancy-autocomplete size="md" label="Medium">
  <!-- options -->
</schmancy-autocomplete>

<!-- Large (60px height, 18px font) -->
<schmancy-autocomplete size="lg" label="Large">
  <!-- options -->
</schmancy-autocomplete>
```

### Multi-Select Chip Display

In multi-select mode, selected values are displayed as inline chips within the input field:

- **Gmail-style interface**: Chips appear inline with the text input
- **Backspace removal**: Press backspace with empty input to remove the last chip
- **Click to remove**: Each chip has a remove button
- **Responsive placeholder**: Changes to "Add more..." when items are selected

## Accessibility Features

### Keyboard Navigation

- **Tab**: Move focus to/from the autocomplete
- **Arrow Down**: Open dropdown or move to next option
- **Arrow Up**: Move to previous option
- **Home**: Move to first visible option
- **End**: Move to last visible option
- **Enter/Space**: Select focused option
- **Escape**: Close dropdown and restore previous value
- **Backspace** (multi-select): Remove last chip when input is empty
- **Type to search**: Real-time filtering as you type

### ARIA Attributes

The component automatically manages all necessary ARIA attributes:
- `role="combobox"` on the input
- `role="listbox"` on the dropdown
- `role="option"` on each option
- `aria-expanded` state management
- `aria-selected` on options
- `aria-multiselectable` for multi-select mode
- `aria-autocomplete="list"` for search behavior
- Live region announcements for screen readers

### Screen Reader Support

Full screen reader compatibility with proper announcements for:
- Number of available options after filtering
- Selected values and changes
- Chip additions and removals in multi-select
- "No results found" when filtering yields no matches

## TypeScript Usage

```typescript
import {
  SchmancyAutocomplete,
  SchmancyAutocompleteChangeEvent
} from '@schmancy/autocomplete/autocomplete'

// Get typed reference
const autocomplete = document.querySelector<SchmancyAutocomplete>('schmancy-autocomplete')

// Type-safe value setting for multi-select
if (autocomplete) {
  // Using .values for arrays (recommended)
  autocomplete.values = ['option1', 'option2']

  // Or using .value (backward compatible)
  autocomplete.value = ['option1', 'option2'] // Internally converted
}

// Typed event handling
autocomplete?.addEventListener('change', (event: SchmancyAutocompleteChangeEvent) => {
  if (autocomplete.multi && event.detail.values) {
    const selectedValues: string[] = event.detail.values
    console.log('Multiple selected:', selectedValues)
  } else {
    const selectedValue = event.detail.value as string
    console.log('Single selected:', selectedValue)
  }
})

// Form validation with types
const isValid: boolean = autocomplete?.checkValidity() ?? false
const reported: boolean = autocomplete?.reportValidity() ?? false
```

## Form Integration

The component fully supports HTML form integration:

```html
<form id="searchForm">
  <schmancy-autocomplete
    name="assignee"
    label="Assign to"
    required
    error="${hasError}"
    validationMessage="Please select an assignee"
  >
    <schmancy-option value="user1">Alice Johnson</schmancy-option>
    <schmancy-option value="user2">Bob Smith</schmancy-option>
    <schmancy-option value="user3">Charlie Brown</schmancy-option>
  </schmancy-autocomplete>

  <schmancy-autocomplete
    multi
    name="tags"
    label="Tags"
    placeholder="Add tags..."
  >
    <schmancy-option value="bug">Bug</schmancy-option>
    <schmancy-option value="feature">Feature</schmancy-option>
    <schmancy-option value="enhancement">Enhancement</schmancy-option>
  </schmancy-autocomplete>

  <button type="submit">Submit</button>
</form>
```

```typescript
// Form submission handling
document.getElementById('searchForm').addEventListener('submit', (e) => {
  e.preventDefault()
  const formData = new FormData(e.target)

  console.log({
    assignee: formData.get('assignee'),
    tags: formData.get('tags')?.split(',') // Convert back to array
  })
})
```

## Advanced Examples

### Dynamic Options with Filtering

```typescript
// Populate options dynamically from API
const autocomplete = document.querySelector<SchmancyAutocomplete>('schmancy-autocomplete')

async function loadUsers() {
  const users = await fetch('/api/users').then(r => r.json())

  // Clear existing options
  autocomplete.innerHTML = ''

  // Add new options
  users.forEach(user => {
    const option = document.createElement('schmancy-option')
    option.value = user.id
    option.textContent = user.name
    option.setAttribute('label', user.name) // For better search matching
    autocomplete.appendChild(option)
  })
}

// Configure for optimal search experience
autocomplete.similarityThreshold = 0.25 // More permissive for names
autocomplete.debounceMs = 150 // Faster response
```

### Email Recipient Selection (Gmail-style)

```html
<schmancy-autocomplete
  multi
  name="recipients"
  label="To"
  placeholder="Type email or name..."
  similarityThreshold="0.2"
  size="lg"
>
  <schmancy-option value="john@example.com" label="John Doe">
    John Doe &lt;john@example.com&gt;
  </schmancy-option>
  <schmancy-option value="jane@example.com" label="Jane Smith">
    Jane Smith &lt;jane@example.com&gt;
  </schmancy-option>
  <schmancy-option value="team@example.com" label="Team Mailing List">
    Team Mailing List &lt;team@example.com&gt;
  </schmancy-option>
</schmancy-autocomplete>
```

### Custom Validation

```typescript
const autocomplete = document.querySelector<SchmancyAutocomplete>('schmancy-autocomplete')

// Multi-select validation
autocomplete?.addEventListener('change', (e: SchmancyAutocompleteChangeEvent) => {
  if (autocomplete.multi && e.detail.values) {
    const values = e.detail.values

    if (values.length < 2) {
      autocomplete.error = true
      autocomplete.validationMessage = 'Please select at least 2 items'
    } else if (values.length > 10) {
      autocomplete.error = true
      autocomplete.validationMessage = 'Maximum 10 items allowed'
    } else {
      autocomplete.error = false
      autocomplete.validationMessage = ''
    }
  }
})
```

## Performance Considerations

### Large Option Lists

For lists with hundreds or thousands of options:

1. **Increase debounce delay**: `debounceMs="300"` or higher
2. **Adjust similarity threshold**: Higher values (0.4-0.5) show fewer results
3. **Consider lazy loading**: Load options on-demand
4. **Use option labels**: Improves search accuracy

```html
<!-- Optimized for large lists -->
<schmancy-autocomplete
  debounceMs="400"
  similarityThreshold="0.4"
  maxHeight="400px"
>
  <!-- Many options -->
</schmancy-autocomplete>
```

### Memory Management

The component automatically:
- Cleans up event listeners on disconnect
- Unsubscribes from RxJS observables
- Manages DOM references efficiently
- Debounces expensive operations

## Browser Support

The component uses modern web standards and requires browsers that support:
- Custom Elements v1
- Shadow DOM v1
- ES2015+
- CSS Custom Properties
- CSS Flexbox

For older browsers, consider using appropriate polyfills.

## Related Components

- `schmancy-option` - Option component for use within autocomplete
- `schmancy-input-chip` - Chip component used in multi-select mode
- `schmancy-select` - Standard select dropdown without search
- `schmancy-input` - Text input component with validation