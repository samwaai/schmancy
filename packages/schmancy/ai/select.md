# Schmancy Select - AI Reference

```js
// Basic Select
<schmancy-select
  name="select-name"
  label="Select Label"
  value="selected-value"
  placeholder="Choose an option"
  required?
  disabled?
  error="Error message"
  @change=${handleChange}>
  
  <schmancy-option value="option1">Option 1</schmancy-option>
  <schmancy-option value="option2">Option 2</schmancy-option>
  <schmancy-option value="option3" disabled>Option 3</schmancy-option>
</schmancy-select>

// Select with hint text
<schmancy-select
  label="Country"
  hint="Select your country of residence"
  required>
  <!-- Options -->
</schmancy-select>

// Multiple select
<schmancy-select
  multi
  label="Select Skills"
  .value=${['html', 'css']}
  @change=${(e) => console.log('Selected:', e.detail.value)}>
  
  <schmancy-option value="html">HTML</schmancy-option>
  <schmancy-option value="css">CSS</schmancy-option>
  <schmancy-option value="js">JavaScript</schmancy-option>
  <schmancy-option value="ts">TypeScript</schmancy-option>
</schmancy-select>

// Select with option groups
<schmancy-select label="Programming Language">
  <optgroup label="Frontend">
    <schmancy-option value="html">HTML</schmancy-option>
    <schmancy-option value="css">CSS</schmancy-option>
    <schmancy-option value="js">JavaScript</schmancy-option>
  </optgroup>
  
  <optgroup label="Backend">
    <schmancy-option value="node">Node.js</schmancy-option>
    <schmancy-option value="python">Python</schmancy-option>
    <schmancy-option value="java">Java</schmancy-option>
  </optgroup>
</schmancy-select>

// Select with search
<schmancy-select
  searchable
  label="Search Countries"
  placeholder="Type to search...">
  <!-- Many options -->
</schmancy-select>

// Different sizes
<schmancy-select size="sm" label="Small Select">
  <schmancy-option value="1">Option 1</schmancy-option>
  <schmancy-option value="2">Option 2</schmancy-option>
</schmancy-select>

<schmancy-select size="md" label="Medium Select (default)">
  <schmancy-option value="1">Option 1</schmancy-option>
  <schmancy-option value="2">Option 2</schmancy-option>
</schmancy-select>

<schmancy-select size="lg" label="Large Select">
  <schmancy-option value="1">Option 1</schmancy-option>
  <schmancy-option value="2">Option 2</schmancy-option>
</schmancy-select>

// Aligned with input (same size)
<div style="display: flex; gap: 16px;">
  <schmancy-input 
    size="md" 
    label="First Name" 
    placeholder="Enter first name">
  </schmancy-input>
  
  <schmancy-select 
    size="md" 
    label="Country"
    placeholder="Select country">
    <schmancy-option value="us">United States</schmancy-option>
    <schmancy-option value="uk">United Kingdom</schmancy-option>
    <schmancy-option value="ca">Canada</schmancy-option>
  </schmancy-select>
</div>

// Select Methods
select.focus() -> void          // Focus the select
select.blur() -> void           // Remove focus
select.open() -> void           // Open the dropdown
select.close() -> void          // Close the dropdown
select.validate() -> boolean    // Validate and show error if invalid
select.reset() -> void          // Reset to initial value

// Select Properties
value: string | string[]   // Currently selected value(s)
name: string               // The name attribute
label: string              // Label text
placeholder: string        // Placeholder text
multiple: boolean          // Whether multiple selection is allowed
disabled: boolean          // Whether the select is disabled
required: boolean          // Whether a selection is required
error: string              // Error message to display
searchable: boolean        // Whether to allow searching within options
open: boolean              // Whether the dropdown is open
size: 'sm' | 'md' | 'lg'   // Size of the select (default: 'md')

// Option Properties
value: string              // Value of this option
disabled: boolean          // Whether this option is disabled
selected: boolean          // Whether this option is selected

// Select Events
@change  // Fires when selection changes, with { detail: { value } }
@input   // Fires during interaction
@focus   // Fires when select gains focus
@blur    // Fires when select loses focus
@open    // Fires when dropdown opens
@close   // Fires when dropdown closes
@search  // Fires during search with { detail: { query } }

// Examples
// Basic usage
<schmancy-select
  name="category"
  label="Category"
  value="electronics"
  @change=${(e) => console.log('Selected:', e.detail.value)}>
  
  <schmancy-option value="electronics">Electronics</schmancy-option>
  <schmancy-option value="clothing">Clothing</schmancy-option>
  <schmancy-option value="books">Books</schmancy-option>
  <schmancy-option value="food">Food & Beverages</schmancy-option>
</schmancy-select>

// Multiple select with initial values
<schmancy-select
  name="interests"
  label="Interests"
  multiple
  .value=${userInterests} // Array of selected values
  @change=${(e) => updateInterests(e.detail.value)}>
  
  <schmancy-option value="tech">Technology</schmancy-option>
  <schmancy-option value="sports">Sports</schmancy-option>
  <schmancy-option value="music">Music</schmancy-option>
  <schmancy-option value="movies">Movies</schmancy-option>
  <schmancy-option value="travel">Travel</schmancy-option>
  <schmancy-option value="food">Food</schmancy-option>
</schmancy-select>

// Searchable select with many options
<schmancy-select
  name="country"
  label="Country"
  searchable
  placeholder="Search for a country">
  
  ${countries.map(country => html`
    <schmancy-option value=${country.code}>${country.name}</schmancy-option>
  `)}
</schmancy-select>

// Usage in a form
<schmancy-form @submit=${handleSubmit}>
  <schmancy-input name="name" label="Name" required></schmancy-input>
  
  <schmancy-select
    name="department"
    label="Department"
    required>
    
    <schmancy-option value="hr">Human Resources</schmancy-option>
    <schmancy-option value="engineering">Engineering</schmancy-option>
    <schmancy-option value="marketing">Marketing</schmancy-option>
    <schmancy-option value="finance">Finance</schmancy-option>
  </schmancy-select>
  
  <schmancy-button type="submit">Submit</schmancy-button>
</schmancy-form>

// Select with custom rendering
<schmancy-select
  name="user"
  label="Assign to User"
  @change=${assignToUser}>
  
  ${users.map(user => html`
    <schmancy-option value=${user.id}>
      <div style="display: flex; align-items: center;">
        <schmancy-avatar src=${user.avatar} size="small"></schmancy-avatar>
        <span style="margin-left: 8px;">${user.name}</span>
        <span style="margin-left: auto; color: gray; font-size: 0.8em;">${user.role}</span>
      </div>
    </schmancy-option>
  `)}
</schmancy-select>
```