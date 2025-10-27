# Schmancy Checkbox - AI Reference

```js
// Basic Checkbox
<schmancy-checkbox
  .value=${booleanValue}         // Boolean value (default: false)
  .checked=${booleanValue}        // Alias for value - use either value or checked
  ?disabled=${isDisabled}        // Whether checkbox is disabled
  ?required=${isRequired}        // Whether checkbox is required
  name="checkbox-name"           // Name attribute (auto-generated if not provided)
  id="checkbox-id"               // ID attribute (auto-generated if not provided)
  label="Checkbox Label"         // Optional label text
  size="sm|md|lg"                // Size of checkbox (default: "md") - Note: currently not affecting rendering
  @change=${handleChange}>       // Change event handler
</schmancy-checkbox>

// Checkbox with label attribute
<schmancy-checkbox
  label="Subscribe to newsletter"
  .checked=${isSubscribed}
  @change=${(e) => this.isSubscribed = e.detail.value}>
</schmancy-checkbox>

// Checkbox with slot content (when no label attribute)
<schmancy-checkbox
  name="terms"
  .checked=${agreedToTerms}
  required
  @change=${(e) => this.agreedToTerms = e.detail.value}>
  I accept the <a href="/terms">terms and conditions</a>
</schmancy-checkbox>

// Checkbox Properties
value: boolean         // The checked state (true/false, default: false)
checked: boolean       // Alias for value - getter/setter that maps to value
name: string           // The name attribute (auto-generated random ID if not provided)
id: string             // The id attribute (auto-generated random ID if not provided)
disabled: boolean      // Whether the checkbox is disabled (default: false)
required: boolean      // Whether the checkbox is required (default: false)
label?: string         // Optional label text - if provided, shows text; otherwise uses slot
size: 'sm'|'md'|'lg'   // Size of the checkbox (default: 'md')

// Checkbox Events
@change  // Fires when checked state changes, event detail: { value: boolean }
         // Access new value via: e.detail.value (NOT e.detail.checked)

// Important Notes:
// - The component uses md-checkbox internally from Material Web Components
// - Use property binding (.value or .checked) for the boolean state, not attribute
// - The label property takes precedence over slot content
// - Event detail contains 'value' property, not 'checked'

// Examples

// Basic usage with property binding
<schmancy-checkbox
  name="agree"
  label="I agree to the terms and conditions"
  .checked=${this.agreed}
  required
  @change=${(e) => {
    console.log('Agreed:', e.detail.value);  // Use e.detail.value, not e.detail.checked
    this.agreed = e.detail.value;
  }}>
</schmancy-checkbox>

// Using slot for custom HTML content
<schmancy-checkbox
  .checked=${this.acceptTerms}
  @change=${(e) => this.acceptTerms = e.detail.value}>
  I accept the <strong>terms</strong> and <a href="/privacy">privacy policy</a>
</schmancy-checkbox>

// Typical checkbox group pattern
<div class="flex flex-col gap-2">
  <schmancy-checkbox
    .checked=${this.preferences.notifications}
    @change=${(e) => this.preferences.notifications = e.detail.value}
    label="Email notifications">
  </schmancy-checkbox>

  <schmancy-checkbox
    .checked=${this.preferences.newsletter}
    @change=${(e) => this.preferences.newsletter = e.detail.value}
    label="Weekly newsletter">
  </schmancy-checkbox>

  <schmancy-checkbox
    .checked=${this.preferences.marketing}
    @change=${(e) => this.preferences.marketing = e.detail.value}
    label="Marketing emails">
  </schmancy-checkbox>
</div>

// Common pattern with external label
<div class="flex items-center gap-2">
  <schmancy-checkbox
    .checked=${this.isSelected}
    @change=${(e) => this.isSelected = e.detail.value}>
  </schmancy-checkbox>
  <schmancy-typography type="body" token="md">
    Custom styled label text
  </schmancy-typography>
</div>

// Disabled states
<schmancy-checkbox
  label="This option is disabled"
  disabled>
</schmancy-checkbox>

<schmancy-checkbox
  label="This option is checked and disabled"
  .checked=${true}
  disabled>
</schmancy-checkbox>

// In a form context
<schmancy-form @submit=${handleSubmit}>
  <schmancy-input name="email" label="Email" type="email" required></schmancy-input>

  <schmancy-checkbox
    name="subscribe"
    .checked=${this.wantsNewsletter}
    @change=${(e) => this.wantsNewsletter = e.detail.value}>
    Send me newsletter updates
  </schmancy-checkbox>

  <schmancy-checkbox
    name="terms"
    required
    .checked=${this.acceptedTerms}
    @change=${(e) => this.acceptedTerms = e.detail.value}>
    I accept the terms and conditions
  </schmancy-checkbox>

  <schmancy-button type="submit">Submit</schmancy-button>
</schmancy-form>
```