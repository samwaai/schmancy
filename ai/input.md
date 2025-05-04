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

// Input v2 (enhanced version with more features)
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
  @change=${handleChange}
  @focus=${handleFocus}
  @blur=${handleBlur}>
</schmancy-input-v2>

// Input with prefix/suffix
<schmancy-input label="Price">
  <span slot="prefix">$</span>
  <span slot="suffix">.00</span>
</schmancy-input>

// Input with icons
<schmancy-input label="Search">
  <schmancy-icon slot="prefix" icon="search"></schmancy-icon>
  <schmancy-icon slot="suffix" icon="close" @click=${clearInput}></schmancy-icon>
</schmancy-input>

// Input Methods
input.focus() -> void
input.blur() -> void
input.validate() -> boolean
input.setCustomValidity(message) -> void
input.select() -> void

// Examples
<schmancy-input 
  name="email"
  label="Email Address"
  type="email"
  required
  placeholder="Enter your email"
  @change=${(e) => console.log(e.target.value)}>
</schmancy-input>

<schmancy-input-v2
  name="amount"
  label="Amount"
  type="number"
  .format=${(value) => `$${value.toFixed(2)}`}
  .parse=${(value) => parseFloat(value.replace('$', ''))}
  .validate=${(value) => value < 0 ? 'Amount must be positive' : ''}>
</schmancy-input-v2>
```