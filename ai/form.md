# Schmancy Form - AI Reference

```js
// Form Container
<schmancy-form
  @submit=${handleSubmit}
  @validate=${handleValidation}
  @change=${handleChange}>
  <!-- Form fields go here -->
</schmancy-form>

// Form v2 (enhanced version)
<schmancy-form-v2
  .model=${formData}
  .validators=${validators}
  @submit=${handleSubmit}
  @change=${handleChange}>
  <!-- Form fields go here -->
</schmancy-form-v2>

// Form Methods
form.submit() -> Promise<any>
form.reset() -> void
form.validate() -> Promise<boolean>
form.setErrors({fieldName: errorMessage}) -> void
form.getValues() -> Object

// Form Field Base Attributes
// These apply to input, textarea, select, checkbox, radio
name="field-name"
label="Field Label"
required?
disabled?
readonly?
value="initial value"
error="Error message"
success?
placeholder="Placeholder text"

// Examples
// Basic form with validation
<schmancy-form @submit=${(e) => {
  const values = e.detail.values;
  console.log('Form submitted:', values);
}}>
  <schmancy-input 
    name="email"
    label="Email Address"
    required
    error=${emailError}>
  </schmancy-input>
  
  <schmancy-button type="submit">Submit</schmancy-button>
</schmancy-form>

// Form v2 with model binding
<schmancy-form-v2
  .model=${{
    username: '',
    password: ''
  }}
  .validators=${{
    username: (value) => value ? '' : 'Username is required',
    password: (value) => value.length >= 8 ? '' : 'Password must be at least 8 characters'
  }}
  @submit=${(e) => console.log('Valid data:', e.detail.values)}>
  
  <schmancy-input name="username" label="Username"></schmancy-input>
  <schmancy-input name="password" label="Password" type="password"></schmancy-input>
  
  <schmancy-button type="submit">Login</schmancy-button>
</schmancy-form-v2>
```