# Schmancy Input - AI Reference

```js
// Text Input
<schmancy-input
  id?="custom-id"                                      // Auto-generated if not provided
  name="field-name"                                   // Form field name
  label="Field Label"                                 // Label text
  value="initial value"                               // Input value
  type="text|password|email|number|tel|url|search|date|time|datetime-local" // Input type
  placeholder="Placeholder text"                      // Placeholder text
  hint?="Helper text"                                 // Helper text below input
  align?="left|center|right"                          // Text alignment (default: "left")
  size?="sm|md|lg"                                   // Input size (default: "md")
  required?                                            // Required field
  disabled?                                            // Disabled state
  readonly?                                            // Read-only state
  clickable?                                           // Show pointer cursor when readonly
  error?                                               // Error state (boolean)
  autofocus?                                           // Auto-focus on render
  spellcheck?                                          // Enable spellcheck (default: false)
  inputmode?="none|text|tel|url|email|numeric|decimal|search" // Virtual keyboard hint
  autocomplete?="off|on|name|email|tel|etc"          // Autofill hints
  pattern?="regex"                                    // Validation pattern
  minlength?="number"                                 // Min character length
  maxlength?="number"                                 // Max character length
  min?="number|date"                                  // Min value (number/date)
  max?="number|date"                                  // Max value (number/date)
  step?="number|any"                                  // Step increment
  list?="datalist-id"                                // Associate with datalist
  validateOn?="always|touched|dirty|submitted"        // Validation strategy (default: "touched")
  @input=${handleInput}                                // Every keystroke
  @change=${handleChange}                              // On blur/change
  @enter=${handleEnter}                                // Enter key pressed
  @focus=${handleFocus}                                // Focus event
  @blur=${handleBlur}                                  // Blur event
  @autofill=${handleAutofill}>                         // Autofill detected
</schmancy-input>

// Input Methods
input.focus(options?: FocusOptions) -> void
input.blur() -> void
input.click() -> void
input.select() -> void
input.checkValidity() -> boolean
input.reportValidity() -> boolean
input.setCustomValidity(message: string) -> void
input.getValidity() -> ValidityState
input.setSelectionRange(start: number, end: number, direction?: 'forward'|'backward'|'none') -> void
input.setRangeText(replacement: string, start?: number, end?: number, selectMode?: 'select'|'start'|'end'|'preserve') -> void

// Input Properties
input.selectionStart -> number | null
input.selectionEnd -> number | null
input.selectionDirection -> 'forward' | 'backward' | 'none' | null

// Events (Custom Events with detail)
@input    // CustomEvent<{ value: string }>
@change   // CustomEvent<{ value: string }>
@enter    // CustomEvent<{ value: string }>
@autofill // CustomEvent<{ value: string }>
@reset    // CustomEvent<void>
@focus    // Standard FocusEvent
@blur     // Standard FocusEvent
@click    // Standard MouseEvent

// Examples
// 1. Basic input with validation
<schmancy-input 
  name="email"
  label="Email Address"
  type="email"
  required
  placeholder="Enter your email"
  @change=${(e) => console.log(e.target.value)}>
</schmancy-input>

// 2. Input with currency formatting
<schmancy-input-v2
  name="amount"
  label="Amount"
  type="number"
  .format=${(value) => `$${value.toFixed(2)}`}
  .parse=${(value) => parseFloat(value.replace('$', ''))}
  .validate=${(value) => value < 0 ? 'Amount must be positive' : ''}>
</schmancy-input-v2>

// 3. Password input with visibility toggle
<schmancy-input 
  type="password"
  label="Password"
  name="password"
  required
  minlength="8"
  @enter=${handleSubmit}>
</schmancy-input>

// 4. Number input with constraints
<schmancy-input
  type="number"
  label="Quantity"
  name="quantity"
  min="1"
  max="100"
  step="1"
  value="1">
</schmancy-input>

// 5. Input with error state and hint
<schmancy-input
  label="Username"
  name="username"
  ?error=${hasError}
  hint=${hasError ? "Username already taken" : "Choose a unique username"}
  pattern="^[a-zA-Z0-9_]+$">
</schmancy-input>

// 6. Centered readonly input that's clickable
<schmancy-input
  label="Invitation Code"
  value="ABC123XYZ"
  readonly
  clickable
  align="center"
  @click=${copyToClipboard}>
</schmancy-input>
```

## Related Components
- **[Form](./form.md)**: Container for input and other form components
- **[Textarea](./textarea.md)**: Multi-line text input fields
- **[Icons](./icons.md)**: Can be used within input slots
- **[Autocomplete](./autocomplete.md)**: Extended input with suggestions

## Technical Details

### Form Association
The component is form-associated using ElementInternals API, which means:
- It participates in form submission
- Works with form validation
- Integrates with FormData
- Supports constraint validation API

### Accessibility Features
- Auto-generated IDs for label association
- ARIA attributes (aria-label, aria-required, aria-invalid, etc.)
- Proper form association
- Keyboard navigation support

### Validation
```typescript
// Built-in HTML5 validation
input.checkValidity()     // Returns true/false
input.reportValidity()    // Shows validation message
input.setCustomValidity('Custom error')  // Set custom message
input.getValidity()       // Get ValidityState object
```

### Input Sizes
- `sm`: 40px height, 14px font size, compact padding
- `md`: 50px height, 16px font size, standard padding (default)
- `lg`: 60px height, 18px font size, spacious padding

### Input v2 Interfaces
```typescript
interface InputValidator {
  (value: any): string | null;
}

interface InputFormatter {
  (value: any): string;
}

interface InputParser {
  (displayValue: string): any;
}
```

### Common Use Cases

1. **Password input with show/hide functionality**
   ```html
   <schmancy-input
     type="password"
     label="Password"
     name="password"
     @enter=${handleSubmit}>
   </schmancy-input>
   ```

2. **Validating email format**
   ```html
   <schmancy-input-v2
     type="email"
     label="Email"
     name="email"
     .validate=${value => {
       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       return emailRegex.test(value) ? '' : 'Please enter a valid email';
     }}>
   </schmancy-input-v2>
   ```

3. **Input with character count**
   ```html
   <schmancy-input
     label="Message"
     name="message"
     maxlength="100"
     hint="0/100 characters"
     @input=${e => {
       const count = e.target.value.length;
       e.target.hint = `${count}/100 characters`;
     }}>
   </schmancy-input>
   ```