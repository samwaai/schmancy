# Schmancy Input - AI Reference

```js
// Text Input
<schmancy-input
  name="field-name"
  label="Field Label"
  value="initial value"
  type="text|password|email|number|tel|url|search|date"
  placeholder="Placeholder text"
  required?
  disabled?
  readonly?
  error="Error message"
  success?
  size="small|medium|large"
  @input=${handleInput}
  @change=${handleChange}
  @focus=${handleFocus}
  @blur=${handleBlur}>
</schmancy-input>

// Input v2 (enhanced version with formatting and validation)
<schmancy-input-v2
  name="field-name"
  label="Field Label"
  value="initial value"
  type="text|password|email|number|tel|url|search|date"
  placeholder="Placeholder text"
  required?
  disabled?
  readonly?
  error="Error message"
  success?
  size="small|medium|large"
  .format=${(value) => formattedValue}
  .parse=${(displayValue) => parsedValue}
  .validate=${(value) => errorMessage}
  @input=${handleInput}
  @change=${handleChange}>
</schmancy-input-v2>

// Input Methods
input.focus() -> void
input.blur() -> void
input.validate() -> boolean
input.setCustomValidity(message) -> void
input.select() -> void

// Events
@input // { target: { value: string } }
@change // { target: { value: string } }
@focus // { target: HTMLElement }
@blur // { target: HTMLElement }

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

// 3. Input with prefix/suffix
<schmancy-input label="Price">
  <span slot="prefix">$</span>
  <span slot="suffix">.00</span>
</schmancy-input>

// 4. Input with icons
<schmancy-input label="Search">
  <schmancy-icon slot="prefix" icon="search"></schmancy-icon>
  <schmancy-icon slot="suffix" icon="close" @click=${clearInput}></schmancy-icon>
</schmancy-input>
```

## Related Components
- **[Form](./form.md)**: Container for input and other form components
- **[Textarea](./textarea.md)**: Multi-line text input fields
- **[Icons](./icons.md)**: Can be used within input slots
- **[Autocomplete](./autocomplete.md)**: Extended input with suggestions

## Technical Details

### Slots
```html
prefix: Content displayed before the input field
suffix: Content displayed after the input field
```

### CSS Custom Properties
```css
--schmancy-input-height: /* Controls the input height */
--schmancy-input-border-color: /* Controls the border color */
--schmancy-input-focus-color: /* Controls the focus color */
--schmancy-input-error-color: /* Controls the error state color */
--schmancy-input-success-color: /* Controls the success state color */
--schmancy-input-font-size: /* Controls the font size */
```

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

1. **Password input with toggle visibility**
   ```html
   <schmancy-input
     type="password"
     label="Password"
     name="password">
     <schmancy-icon 
       slot="suffix" 
       icon="eye" 
       @click=${togglePasswordVisibility}>
     </schmancy-icon>
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
     @input=${e => updateCharCount(e.target.value.length)}>
     <span slot="suffix" id="charCount">0/100</span>
   </schmancy-input>
   ```