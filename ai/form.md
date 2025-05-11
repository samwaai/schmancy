# Schmancy Form - AI Reference

```js
// Form Container
<schmancy-form
  @submit=${handleSubmit}
  @validate=${handleValidation}
  @change=${handleChange}>
  <!-- Form fields go here -->
</schmancy-form>

// Form v2 (enhanced version with model binding)
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

// Events
@submit // { detail: { values: Object, isValid: boolean } }
@validate // { detail: { errors: Object, isValid: boolean } }
@change // { detail: { name: string, value: any, values: Object } }

// Examples
// 1. Basic form with validation
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

// 2. Form v2 with model binding and validators
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

### Form v2 Interfaces
```typescript
interface FormModel {
  [key: string]: any;
}

interface FormValidators {
  [key: string]: (value: any, allValues: FormModel) => string | null;
}

interface FormErrors {
  [key: string]: string;
}
```

### Common Use Cases

1. **Multi-step forms**: Create wizard-like experiences
   ```html
   <schmancy-form id="step1" @submit=${nextStep}>
     <!-- Step 1 fields -->
   </schmancy-form>
   
   <schmancy-form id="step2" @submit=${submitAll} style="display: none;">
     <!-- Step 2 fields -->
   </schmancy-form>
   ```

2. **Dynamic form fields**: Add or remove fields based on user input
   ```js
   <schmancy-form-v2
     .model=${dynamicModel}
     .validators=${dynamicValidators}>
     ${dynamicFields.map(field => html`
       <schmancy-input name=${field.name} label=${field.label}></schmancy-input>
     `)}
     <button type="button" @click=${addField}>Add Field</button>
   </schmancy-form-v2>
   ```

3. **Form with server validation**: Handle backend validation errors
   ```js
   async function submitForm(e) {
     try {
       const response = await fetch('/api/submit', {
         method: 'POST',
         body: JSON.stringify(e.detail.values)
       });
       const data = await response.json();
       if (!data.success) {
         formRef.setErrors(data.errors);
       }
     } catch (error) {
       console.error(error);
     }
   }
   ```