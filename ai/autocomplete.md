# Schmancy Autocomplete - AI Reference

## Overview
A searchable dropdown component with fuzzy search, keyboard navigation, and multi-select support. Uses similarity scoring for intelligent option filtering.

```js
// Basic Autocomplete (Single-Select)
<schmancy-autocomplete
  label="Select an option"
  placeholder="Type to search..."
  value="selected-value"
  size="sm|md|lg"
  required?
  maxHeight="300px"
  @change=${handleChange}>
  
  <schmancy-option value="option1">Option 1</schmancy-option>
  <schmancy-option value="option2">Option 2</schmancy-option>
  <schmancy-option value="option3">Option 3</schmancy-option>
</schmancy-autocomplete>

// Multi-Select Autocomplete
<schmancy-autocomplete
  label="Select multiple options"
  placeholder="Type to search..."
  multi
  .values=${['option1', 'option3']} // Array of selected values (preferred for multi-select)
  @change=${handleMultiChange}>
  
  <schmancy-option value="option1">Option 1</schmancy-option>
  <schmancy-option value="option2">Option 2</schmancy-option>
  <schmancy-option value="option3">Option 3</schmancy-option>
</schmancy-autocomplete>

// Autocomplete with Custom Trigger
<schmancy-autocomplete>
  <button slot="trigger">Open Options</button>
  
  <schmancy-option value="option1" label="Option 1"></schmancy-option>
  <schmancy-option value="option2" label="Option 2"></schmancy-option>
</schmancy-autocomplete>

// Autocomplete Properties
value: string              // Selected value for single-select, comma-separated string for multi-select (legacy API)
values: string[]           // Array of selected values for multi-select (preferred API for multi-select)
multi: boolean             // Enable multi-select mode
label: string              // Input label
placeholder: string        // Input placeholder
required: boolean          // Mark as required for validation
size: string               // Input size: "sm", "md", "lg"
maxHeight: string          // Maximum height of dropdown (default: "300px")
debounceMs: number         // Debounce delay in milliseconds for filtering (default: 200)
similarityThreshold: number // Minimum similarity score to show option (0-1, default: 0.3)
autocomplete: string       // Value for input's autocomplete attribute
description: string        // Description for screen readers
name: string               // Form field name for form submission

// Autocomplete Events
@change   // Fires when selection changes with { detail: { value, values? } }

// Autocomplete Methods
checkValidity() -> boolean    // Check if the input is valid
reportValidity() -> boolean   // Show validation state and return validity

// Examples
// Basic usage
<schmancy-autocomplete
  label="Country"
  placeholder="Select country"
  @change=${(e) => selectedCountry = e.detail.value}>
  
  <schmancy-option value="us">United States</schmancy-option>
  <schmancy-option value="ca">Canada</schmancy-option>
  <schmancy-option value="mx">Mexico</schmancy-option>
  <schmancy-option value="fr">France</schmancy-option>
  <schmancy-option value="de">Germany</schmancy-option>
</schmancy-autocomplete>

// Multi-select with preferred API
<schmancy-autocomplete
  label="Programming Languages"
  placeholder="Select languages"
  multi
  .values=${selectedLanguages}
  @change=${(e) => {
    selectedLanguages = e.detail.values; // Use the new values array property
  }}>
  
  <schmancy-option value="js">JavaScript</schmancy-option>
  <schmancy-option value="ts">TypeScript</schmancy-option>
  <schmancy-option value="py">Python</schmancy-option>
  <schmancy-option value="java">Java</schmancy-option>
  <schmancy-option value="go">Go</schmancy-option>
</schmancy-autocomplete>

// Handling the change event
handleChange(e) {
  if (e.target.multi) {
    const selectedValues = e.detail.values; // Array of values (preferred)
    const legacyValue = e.detail.value;     // Comma-separated string (legacy)
    console.log('Selected:', selectedValues);
  } else {
    const selectedValue = e.detail.value;   // Single value
    console.log('Selected:', selectedValue);
  }
}

// Dynamic options from data
<schmancy-autocomplete
  label="Select Item"
  .value=${selectedItem}>
  
  ${items.map(item => html`
    <schmancy-option value=${item.id}>
      ${item.name}
    </schmancy-option>
  `)}
</schmancy-autocomplete>

// In a form
<schmancy-form @submit=${handleSubmit}>
  <schmancy-input
    name="name"
    label="Name"
    required>
  </schmancy-input>
  
  <schmancy-autocomplete
    name="department"
    label="Department"
    required>
    <schmancy-option value="hr">Human Resources</schmancy-option>
    <schmancy-option value="eng">Engineering</schmancy-option>
    <schmancy-option value="fin">Finance</schmancy-option>
  </schmancy-autocomplete>
  
  <schmancy-button type="submit">Submit</schmancy-button>
</schmancy-form>
```

## Key Features

### Fuzzy Search
- Uses similarity scoring algorithm to find best matches
- Searches both option labels and values
- Configurable similarity threshold (0-1)
- Options are sorted by relevance score

### Keyboard Navigation
- `ArrowDown/ArrowUp` - Navigate through options
- `Enter/Space` - Select focused option
- `Escape` - Close dropdown
- `Tab` - Move to next field and close dropdown
- `Home/End` - Jump to first/last option

### Auto-Select on Blur
- In single-select mode, automatically selects the best matching option when input loses focus
- Only triggers if there's a search term and a good match
- Helps with quick data entry

### Accessibility
- Full ARIA support with proper roles and attributes
- Screen reader announcements for option counts and selections
- Keyboard-only navigation support
- Focus management

### Performance
- Debounced search input (configurable delay)
- Efficient RxJS-based state management
- Virtual scrolling for large option lists
- Options are only filtered when dropdown is open