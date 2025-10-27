# Schmancy Radio Group - AI Reference

```js
// Basic Radio Group with options array
<schmancy-radio-group
  name="radio-group-name"
  label="Group Label"
  value="selected-value"
  .options=${[
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" }
  ]}
  required?
  @change=${handleChange}>
</schmancy-radio-group>

// Radio Group with slotted radio buttons
<schmancy-radio-group
  label="Select payment method"
  value="credit"
  @change=${handleChange}>
  
  <schmancy-radio-button
    value="credit"
    name="payment">
    <span slot="label">Credit Card</span>
  </schmancy-radio-button>
  
  <schmancy-radio-button
    value="paypal"
    name="payment">
    <span slot="label">PayPal</span>
  </schmancy-radio-button>
  
  <schmancy-radio-button
    value="bank"
    name="payment"
    disabled>
    <span slot="label">Bank Transfer</span>
  </schmancy-radio-button>
</schmancy-radio-group>

// Standalone radio button (without group)
<schmancy-radio-button 
  value="standalone" 
  name="standalone-radio"
  checked
  @change=${handleChange}>
  <span slot="label">Standalone Option</span>
</schmancy-radio-button>

// Radio Group Properties
name: string           // Form field name
label: string          // Group label
value: string          // Currently selected value
options: Array<{       // Options array (alternative to slotted content)
  value: string,
  label: string
}>
required: boolean      // Whether selection is required

// Radio Button Properties
value: string          // The value of this option
name: string           // Form field name (for standalone use)
checked: boolean       // Whether this option is selected
disabled: boolean      // Whether this option is disabled

// Events
@change  // CustomEvent<{ value: string }> - Fired when selection changes
@radio-button-click  // Internal event for group communication

// Radio Group Methods
radioGroup.focus() -> void       // Focus the first/selected radio button
radioGroup.validate() -> boolean // Validate and show error if invalid
radioGroup.reset() -> void       // Reset to initial value

// Radio Group Properties
value: string        // Currently selected value
name: string         // Name attribute for the radio buttons
disabled: boolean    // Whether the entire group is disabled
required: boolean    // Whether a selection is required
error: string        // Error message to display

// Radio Button Properties
value: string        // Value of this option
label: string        // Label text
disabled: boolean    // Whether this option is disabled
checked: boolean     // Whether this option is selected (set by group)

// Radio Group Events
@change  // Fires when selection changes, with { detail: { value } }
@input   // Fires during interaction
@focus   // Fires when group gains focus
@blur    // Fires when group loses focus

// Examples
// Basic usage
<schmancy-radio-group
  name="flavor"
  label="Select flavor"
  value="vanilla"
  @change=${(e) => console.log('Selected:', e.detail.value)}>
  
  <schmancy-radio-button
    value="vanilla"
    label="Vanilla">
  </schmancy-radio-button>
  
  <schmancy-radio-button
    value="chocolate"
    label="Chocolate">
  </schmancy-radio-button>
  
  <schmancy-radio-button
    value="strawberry"
    label="Strawberry">
  </schmancy-radio-button>
</schmancy-radio-group>

// Radio buttons with descriptions
<schmancy-radio-group
  name="plan"
  label="Select subscription plan"
  value="basic">
  
  <schmancy-radio-button
    value="basic"
    label="Basic Plan">
    <div slot="description">
      $9.99/month - Access to basic features
    </div>
  </schmancy-radio-button>
  
  <schmancy-radio-button
    value="pro"
    label="Pro Plan">
    <div slot="description">
      $19.99/month - Access to all features
    </div>
  </schmancy-radio-button>
  
  <schmancy-radio-button
    value="enterprise"
    label="Enterprise Plan">
    <div slot="description">
      $49.99/month - Priority support and advanced features
    </div>
  </schmancy-radio-button>
</schmancy-radio-group>

// Usage in a form
<schmancy-form @submit=${handleSubmit}>
  <schmancy-input name="name" label="Name" required></schmancy-input>
  
  <schmancy-radio-group
    name="gender"
    label="Gender"
    required>
    
    <schmancy-radio-button
      value="male"
      label="Male">
    </schmancy-radio-button>
    
    <schmancy-radio-button
      value="female"
      label="Female">
    </schmancy-radio-button>
    
    <schmancy-radio-button
      value="other"
      label="Other">
    </schmancy-radio-button>
  </schmancy-radio-group>
  
  <schmancy-button type="submit">Submit</schmancy-button>
</schmancy-form>

// Dynamic radio options from data
<schmancy-radio-group
  name="country"
  label="Select country"
  value=${selectedCountry}
  @change=${(e) => selectedCountry = e.detail.value}>
  
  ${countries.map(country => html`
    <schmancy-radio-button
      value=${country.code}
      label=${country.name}>
    </schmancy-radio-button>
  `)}
</schmancy-radio-group>
```