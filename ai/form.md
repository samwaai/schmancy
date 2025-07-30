# Schmancy Form - AI Reference

```js
// Form Container
<sch-form
  novalidate?                              // Skip form validation on submit
  @submit=${handleSubmit}                  // Form submission event
  @reset=${handleReset}>                   // Form reset event
  <!-- Form fields go here -->
</sch-form>

// Form Methods
form.submit() -> boolean                   // Submit the form programmatically
form.reset() -> void                       // Reset all form fields to default values
form.getFormData() -> FormData            // Get form data as FormData object
form.reportValidity() -> boolean          // Check validity and show validation messages
form.checkValidity() -> boolean           // Check validity without showing messages

// Events
@submit // CustomEvent<FormData>          // Fired when form is submitted
@reset  // CustomEvent                    // Fired when form is reset

// Examples
// 1. Basic form with validation
<sch-form @submit=${(e) => {
  const formData = e.detail;
  console.log('Form submitted:', formData);
  // Convert FormData to object if needed
  const values = Object.fromEntries(formData);
  console.log('Values:', values);
}}>
  <schmancy-input 
    name="email"
    label="Email Address"
    type="email"
    required>
  </schmancy-input>
  
  <schmancy-button type="submit">Submit</schmancy-button>
</sch-form>

// 2. Form with multiple fields and validation
<sch-form 
  @submit=${async (e) => {
    const formData = e.detail;
    // Send to server
    await fetch('/api/submit', {
      method: 'POST',
      body: formData
    });
  }}>
  
  <schmancy-input name="username" label="Username" required></schmancy-input>
  <schmancy-input name="password" label="Password" type="password" required></schmancy-input>
  <schmancy-checkbox name="remember" label="Remember me"></schmancy-checkbox>
  
  <schmancy-button type="submit">Login</schmancy-button>
</sch-form>
```

## Related Components
- **[Input](./input.md)**: Form input fields for text entry
- **[Textarea](./textarea.md)**: Multi-line text input fields
- **[Select](./select.md)**: Dropdown selection fields
- **[Checkbox](./checkbox.md)**: Boolean selection controls
- **[Radio-Group](./radio-group.md)**: Exclusive option selection controls
- **[Button](./button.md)**: Action triggers for form submission

## Technical Details

### Form Field Common Attributes
All form fields (input, textarea, select, checkbox, radio) support these attributes:
```js
name="field-name"       // Field identifier
label="Field Label"     // Display label
required?               // Makes field required
disabled?               // Disables the field
readonly?               // Makes field read-only
value="initial value"   // Sets initial value
error="Error message"   // Shows validation error
success?                // Shows success state
placeholder="Text"      // Placeholder text (where applicable)
```

### Form Behavior
- Submits when Enter key is pressed in input fields
- Submits when submit button is clicked
- Automatically collects data from all form controls
- Supports native HTML5 validation
- Works with custom Schmancy form components

### Common Use Cases

1. **Multi-step forms**: Create wizard-like experiences
   ```html
   <sch-form id="step1" @submit=${nextStep}>
     <!-- Step 1 fields -->
   </sch-form>
   
   <sch-form id="step2" @submit=${submitAll} style="display: none;">
     <!-- Step 2 fields -->
   </sch-form>
   ```

2. **Programmatic form submission**
   ```js
   const form = document.querySelector('schmancy-form');
   
   // Check validity before submitting
   if (form.checkValidity()) {
     form.submit();
   } else {
     // Show validation messages
     form.reportValidity();
   }
   ```

3. **Form with server validation**: Handle backend validation errors
   ```js
   async function submitForm(e) {
     const formData = e.detail;
     
     try {
       const response = await fetch('/api/submit', {
         method: 'POST',
         body: formData
       });
       
       if (!response.ok) {
         // Handle server errors
         const errors = await response.json();
         // Update form fields with errors
         Object.entries(errors).forEach(([field, message]) => {
           const input = form.querySelector(`[name="${field}"]`);
           if (input) {
             input.error = true;
             input.hint = message;
           }
         });
       }
     } catch (error) {
       console.error('Submission failed:', error);
     }
   }
   ```