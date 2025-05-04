# Schmancy Autocomplete - AI Reference

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
  
  <schmancy-option value="option1" label="Option 1"></schmancy-option>
  <schmancy-option value="option2" label="Option 2"></schmancy-option>
  <schmancy-option value="option3" label="Option 3"></schmancy-option>
</schmancy-autocomplete>

// Multi-Select Autocomplete
<schmancy-autocomplete
  label="Select multiple options"
  placeholder="Type to search..."
  multi
  .values=${['option1', 'option3']} // Array of selected values (preferred for multi-select)
  @change=${handleMultiChange}>
  
  <schmancy-option value="option1" label="Option 1"></schmancy-option>
  <schmancy-option value="option2" label="Option 2"></schmancy-option>
  <schmancy-option value="option3" label="Option 3"></schmancy-option>
</schmancy-autocomplete>

// Autocomplete with Custom Trigger
<schmancy-autocomplete>
  <button slot="trigger">Open Options</button>
  
  <schmancy-option value="option1" label="Option 1"></schmancy-option>
  <schmancy-option value="option2" label="Option 2"></schmancy-option>
</schmancy-autocomplete>

// Autocomplete Properties
value: string         // Selected value for single-select, comma-separated string for multi-select (legacy API)
values: string[]      // Array of selected values for multi-select (preferred API for multi-select)
multi: boolean        // Enable multi-select mode
label: string         // Input label
placeholder: string   // Input placeholder
required: boolean     // Mark as required for validation
size: string          // Input size: "sm", "md", "lg"
maxHeight: string     // Maximum height of dropdown
debounceMs: number    // Debounce delay in milliseconds for filtering
autocomplete: string  // Value for input's autocomplete attribute
description: string   // Description for screen readers

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
  
  <schmancy-option value="us" label="United States"></schmancy-option>
  <schmancy-option value="ca" label="Canada"></schmancy-option>
  <schmancy-option value="mx" label="Mexico"></schmancy-option>
  <schmancy-option value="fr" label="France"></schmancy-option>
  <schmancy-option value="de" label="Germany"></schmancy-option>
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
  
  <schmancy-option value="js" label="JavaScript"></schmancy-option>
  <schmancy-option value="ts" label="TypeScript"></schmancy-option>
  <schmancy-option value="py" label="Python"></schmancy-option>
  <schmancy-option value="java" label="Java"></schmancy-option>
  <schmancy-option value="go" label="Go"></schmancy-option>
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
    <schmancy-option
      value=${item.id}
      label=${item.name}>
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
    <schmancy-option value="hr" label="Human Resources"></schmancy-option>
    <schmancy-option value="eng" label="Engineering"></schmancy-option>
    <schmancy-option value="fin" label="Finance"></schmancy-option>
  </schmancy-autocomplete>
  
  <schmancy-button type="submit">Submit</schmancy-button>
</schmancy-form>
```