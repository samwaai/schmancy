# Schmancy Checkbox - AI Reference

```js
// Basic Checkbox
<schmancy-checkbox
  name="checkbox-name"
  label="Checkbox Label"
  value="true|false"              // Boolean value (default: false)
  checked?                        // Alias for value
  disabled?
  required?
  size="sm|md|lg"                 // Size of checkbox (default: "md")
  @change=${handleChange}>
</schmancy-checkbox>

// Checkbox with label
<schmancy-checkbox
  label="Subscribe to newsletter"
  value="false">
</schmancy-checkbox>

// Checkbox with slot content
<schmancy-checkbox
  name="terms"
  required>
  I accept the <a href="/terms">terms and conditions</a>
</schmancy-checkbox>

// Checkbox Properties
value: boolean         // The checked state (true/false)
checked: boolean       // Alias for value
name: string           // The name attribute (auto-generated if not provided)
id: string             // The id attribute (auto-generated if not provided)
disabled: boolean      // Whether the checkbox is disabled
required: boolean      // Whether the checkbox is required
label?: string         // Optional label text
size: 'sm'|'md'|'lg'   // Size of the checkbox (default: 'md')

// Checkbox Events
@change  // Fires when checked state changes, with { detail: { value: boolean } }

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