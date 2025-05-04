# Schmancy Checkbox - AI Reference

```js
// Basic Checkbox
<schmancy-checkbox
  name="checkbox-name"
  label="Checkbox Label"
  value="checkbox-value"
  checked?
  indeterminate?
  disabled?
  required?
  @change=${handleChange}>
</schmancy-checkbox>

// Checkbox with helper text
<schmancy-checkbox
  label="Subscribe to newsletter"
  helper-text="You'll receive weekly updates">
</schmancy-checkbox>

// Checkbox with error
<schmancy-checkbox
  label="Accept terms"
  error="You must accept the terms to continue"
  required>
</schmancy-checkbox>

// Checkbox Methods
checkbox.check() -> void       // Programmatically check
checkbox.uncheck() -> void     // Programmatically uncheck
checkbox.toggle() -> void      // Toggle current state
checkbox.focus() -> void       // Focus the checkbox
checkbox.blur() -> void        // Remove focus
checkbox.validate() -> boolean // Validate and show error if invalid

// Checkbox Properties
checked: boolean       // The checked state
indeterminate: boolean // Indeterminate state (neither checked nor unchecked)
value: string          // The value attribute of the checkbox
name: string           // The name attribute
disabled: boolean      // Whether the checkbox is disabled
required: boolean      // Whether the checkbox is required
error: string          // Error message to display

// Checkbox Events
@change  // Fires when checked state changes, with { detail: { checked, value } }
@input   // Fires when value changes during interaction
@focus   // Fires when checkbox gains focus
@blur    // Fires when checkbox loses focus

// Examples
// Basic usage
<schmancy-checkbox
  name="agree"
  label="I agree to the terms and conditions"
  required
  @change=${(e) => console.log('Agreed:', e.detail.checked)}>
</schmancy-checkbox>

// Indeterminate state example
<schmancy-checkbox
  label="Select all"
  .indeterminate=${someChecked && !allChecked}
  .checked=${allChecked}
  @change=${selectAll}>
</schmancy-checkbox>

// Checkbox group
<div>
  <schmancy-checkbox
    name="roles"
    value="admin"
    label="Admin"
    .checked=${roles.includes('admin')}
    @change=${updateRoles}>
  </schmancy-checkbox>
  
  <schmancy-checkbox
    name="roles"
    value="editor"
    label="Editor"
    .checked=${roles.includes('editor')}
    @change=${updateRoles}>
  </schmancy-checkbox>
  
  <schmancy-checkbox
    name="roles"
    value="viewer"
    label="Viewer"
    .checked=${roles.includes('viewer')}
    @change=${updateRoles}>
  </schmancy-checkbox>
</div>

// Usage in a form
<schmancy-form @submit=${handleSubmit}>
  <schmancy-input name="name" label="Name" required></schmancy-input>
  
  <schmancy-checkbox
    name="subscribe"
    label="Subscribe to newsletter"
    value="yes">
  </schmancy-checkbox>
  
  <schmancy-button type="submit">Submit</schmancy-button>
</schmancy-form>
```