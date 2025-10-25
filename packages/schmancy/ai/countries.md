# Schmancy Countries Select - AI Reference

## Quick Start

```typescript
import '@schmancy/index'  // For all Schmancy components
// Or specific import: import '@schmancy/extra' // Countries are part of extra
```

## Component Overview

A specialized country selection component with autocomplete, built on top of schmancy-autocomplete with a comprehensive list of countries including flags and dial codes.

## API

```typescript
// Countries Select Component
<schmancy-select-countries
  value?="string"                    // Selected country code
  label?="string"                    // Label text (default: "Country")
  hint?="string"                     // Helper text (default: "Please select a country")
  placeholder?="string"              // Placeholder (default: "Select a country")
  name?="string"                     // Form field name
  required?="boolean"                // Required field
  @change=${handleChange}>           // Selection change event
</schmancy-select-countries>

// Component Properties
value: string         // ISO country code (e.g., "US", "GB")
label: string        // Field label
hint: string         // Helper text below field
placeholder: string  // Placeholder text
name: string         // Form field name
required: boolean    // Required validation

// Events
@change  // Fires when country selection changes

// Methods
checkValidity() -> boolean      // Validate selection
reportValidity() -> boolean     // Report validation state
setCustomValidity(message) -> void  // Set custom error
```

## Examples

### Basic Usage

```typescript
// Simple country selector
<schmancy-select-countries 
  @change=${(e) => console.log('Selected:', e.detail.value)}>
</schmancy-select-countries>

// With initial value
<schmancy-select-countries 
  value="US"
  @change=${handleCountryChange}>
</schmancy-select-countries>

// Required field
<schmancy-select-countries 
  required
  name="country"
  label="Your Country"
  hint="Required for shipping">
</schmancy-select-countries>
```

### Form Integration

```typescript
// In a registration form
<schmancy-form @submit=${handleSubmit}>
  <schmancy-input 
    label="Full Name" 
    name="name" 
    required>
  </schmancy-input>
  
  <schmancy-select-countries 
    name="country" 
    required
    @change=${updatePhoneFormat}>
  </schmancy-select-countries>
  
  <schmancy-input 
    label="Phone" 
    name="phone" 
    type="tel">
  </schmancy-input>
  
  <schmancy-button type="submit" variant="filled">
    Register
  </schmancy-button>
</schmancy-form>
```

### Real-World Examples

```typescript
// Address form with country
class AddressForm extends LitElement {
  @state() selectedCountry = '';
  
  render() {
    return html`
      <schmancy-surface class="p-6">
        <schmancy-typography type="headline" token="sm" class="mb-4 block">
          Shipping Address
        </schmancy-typography>
        
        <schmancy-form @submit=${this.handleSubmit}>
          <div class="grid gap-4">
            <schmancy-input 
              label="Street Address" 
              name="street" 
              required>
            </schmancy-input>
            
            <div class="grid grid-cols-2 gap-4">
              <schmancy-input 
                label="City" 
                name="city" 
                required>
              </schmancy-input>
              
              <schmancy-input 
                label="Postal Code" 
                name="postalCode" 
                required>
              </schmancy-input>
            </div>
            
            <schmancy-select-countries 
              name="country" 
              required
              value=${this.selectedCountry}
              @change=${(e) => this.selectedCountry = e.detail.value}>
            </schmancy-select-countries>
            
            ${this.selectedCountry === 'US' ? html`
              <schmancy-select 
                label="State" 
                name="state" 
                required>
                <!-- State options -->
              </schmancy-select>
            ` : ''}
          </div>
          
          <schmancy-button type="submit" variant="filled" class="mt-4">
            Save Address
          </schmancy-button>
        </schmancy-form>
      </schmancy-surface>
    `
  }
}

// Phone number with country code
class PhoneInput extends LitElement {
  @state() countryCode = '';
  @state() dialCode = '';
  
  handleCountryChange(e) {
    const country = countriesData.find(c => c.code === e.detail.value);
    this.dialCode = country?.dial_code || '';
  }
  
  render() {
    return html`
      <div class="space-y-4">
        <schmancy-select-countries 
          @change=${this.handleCountryChange}>
        </schmancy-select-countries>
        
        <schmancy-input 
          label="Phone Number"
          .value=${this.dialCode}
          placeholder="${this.dialCode} ">
        </schmancy-input>
      </div>
    `
  }
}
```

## Country Data Structure

Each country in the dataset includes:

```typescript
interface Country {
  name: string;       // Full country name
  code: string;       // ISO 3166-1 alpha-2 code
  dial_code: string;  // International dialing code
  flag: string;       // Flag emoji
}

// Example:
{
  name: "United States",
  code: "US",
  dial_code: "+1",
  flag: "🇺🇸"
}
```

## Features

- **Comprehensive List**: All countries with ISO codes
- **Flag Emojis**: Visual country identification
- **Dial Codes**: International phone codes included
- **Search**: Type to filter countries by name
- **Keyboard Navigation**: Full keyboard support
- **Form Integration**: Works with native forms
- **Validation**: Built-in required field validation

## Accessibility

- Proper ARIA labels and roles
- Keyboard navigation (arrow keys, enter, escape)
- Screen reader announcements
- High contrast mode support
- Focus management

## Best Practices

1. **Default Selection**: Consider pre-selecting based on user's location
2. **Validation**: Use required attribute for mandatory fields
3. **Phone Integration**: Use dial_code for phone number inputs
4. **Localization**: Country names are in English by default
5. **Performance**: Virtual scrolling for large lists

## Common Pitfalls

- **Code vs Name**: Value is country code, not full name
- **Case Sensitivity**: Country codes are uppercase
- **Missing Countries**: Some territories may not be included
- **Flag Display**: Emoji flags may not work on all systems

## Related Components

- **[Autocomplete](./autocomplete.md)**: Base component for country select
- **[Form](./form.md)**: Form integration
- **[Input](./input.md)**: Often used with phone inputs
- **[Timezone](./timezone.md)**: Related location selector

## TypeScript Interface

```typescript
interface SchmancySelectCountriesElement extends HTMLElement {
  value: string;
  label: string;
  hint: string;
  placeholder: string;
  name: string;
  required: boolean;
  checkValidity(): boolean;
  reportValidity(): boolean;
  setCustomValidity(message: string): void;
}

// Change event
interface CountryChangeEvent extends CustomEvent {
  detail: {
    value: string;  // Country code
  };
}
```