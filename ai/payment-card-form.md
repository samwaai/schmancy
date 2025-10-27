# Schmancy Payment Card Form - AI Reference

## Quick Start

```typescript
import '@schmancy/index'  // For all Schmancy components
// Payment card form is included in the main components
```

## Component Overview

A mobile-friendly payment card form component with real-time validation and formatting for credit card information. Uses Cleave.js for intelligent input formatting.

## API

```typescript
// Payment Card Form Component
<schmancy-payment-card-form
  value?="{
    cardName: string,
    cardNumber: string,
    expirationDate: string,
    cvv: string
  }"
  @change=${handleChange}>
  <!-- Optional additional content -->
</schmancy-payment-card-form>

// Component Properties
value: {
  cardName: string        // Cardholder name
  cardNumber: string      // Card number (formatted)
  expirationDate: string  // MM/YY format
  cvv: string            // 3-4 digits
}

// Events
@change  // Fires when any field changes with complete form data

// Methods
form.checkValidity() -> boolean  // Check if all fields are valid
form.submit() -> void           // Submit the form
```

## Examples

### Basic Usage

```typescript
// Simple payment form
<schmancy-payment-card-form 
  @change=${(e) => console.log('Form data:', e.detail)}>
</schmancy-payment-card-form>

// With initial values
<schmancy-payment-card-form 
  .value=${{
    cardName: 'John Doe',
    cardNumber: '',
    expirationDate: '',
    cvv: ''
  }}
  @change=${handlePaymentChange}>
</schmancy-payment-card-form>
```

### Form Integration

```typescript
// Inside a larger form
<schmancy-form @submit=${handleCheckout}>
  <schmancy-typography type="headline" token="sm" class="mb-4 block">
    Payment Information
  </schmancy-typography>
  
  <schmancy-payment-card-form 
    @change=${(e) => this.paymentData = e.detail}>
  </schmancy-payment-card-form>
  
  <schmancy-button type="submit" variant="filled" class="mt-4">
    Complete Purchase
  </schmancy-button>
</schmancy-form>

// Handling submission
handleCheckout(e) {
  const formData = e.detail;
  const payment = this.paymentData;
  
  // Process payment...
}
```

### Real-World Examples

```typescript
// E-commerce checkout
render() {
  return html`
    <schmancy-surface class="p-6 rounded-lg">
      <schmancy-payment-card-form 
        .value=${this.paymentInfo}
        @change=${this.handlePaymentUpdate}>
        
        <!-- Additional fields can be added via slot -->
        <schmancy-input
          label="Billing ZIP Code"
          name="zipCode"
          required
          pattern="[0-9]{5}"
          class="mt-4">
        </schmancy-input>
      </schmancy-payment-card-form>
      
      <div class="flex gap-4 mt-6">
        <schmancy-button variant="text" @click=${this.goBack}>
          Back
        </schmancy-button>
        <schmancy-button 
          variant="filled" 
          @click=${this.processPayment}
          ?disabled=${!this.isValid}>
          Pay $${this.total}
        </schmancy-button>
      </div>
    </schmancy-surface>
  `
}

// With validation feedback
class CheckoutForm extends LitElement {
  @state() errors = {};
  
  async processPayment() {
    const form = this.shadowRoot.querySelector('schmancy-payment-card-form');
    
    if (!form.checkValidity()) {
      this.errors = {
        payment: 'Please complete all payment fields correctly'
      };
      return;
    }
    
    // Process payment...
  }
}
```

## Features

### Automatic Formatting
- **Card Number**: Spaces added automatically (e.g., "4242 4242 4242 4242")
- **Expiration Date**: MM/YY format enforced
- **CVV**: Length adjusted based on card type (3 for most, 4 for Amex)

### Card Type Detection
- Automatically detects card type from number
- Supports: Visa, Mastercard, Amex, Discover, JCB, Diners, etc.
- Shows appropriate card icon
- Adjusts validation rules per card type

### Real-time Validation
- Card number validity (Luhn algorithm)
- Expiration date must be future date
- CVV length based on card type
- Name field required

### Mobile Optimized
- Appropriate input modes for virtual keyboards
- Large touch targets
- Clear error states
- Smooth animations

## Validation Rules

1. **Card Name**: Required, min 2 characters
2. **Card Number**: 
   - Valid card number format
   - Passes Luhn check
   - Supported card type
3. **Expiration Date**:
   - MM/YY format
   - Must be current or future month
4. **CVV**:
   - 3 digits (most cards)
   - 4 digits (American Express)

## Accessibility

- Proper label associations
- ARIA attributes for validation states
- Keyboard navigation support
- Screen reader announcements for errors
- High contrast error states

## Best Practices

1. **Security**: Never store raw card data - tokenize on backend
2. **PCI Compliance**: Use HTTPS and follow PCI-DSS guidelines
3. **Error Handling**: Show clear, specific error messages
4. **Loading States**: Disable form during payment processing
5. **Confirmation**: Show summary before final submission

## Common Pitfalls

- **Test Cards**: Component validates real card numbers only
- **Date Validation**: MM/YY not MM/YYYY
- **Auto-submit**: Don't auto-submit on completion
- **Browser Autofill**: May conflict with Cleave.js formatting

## Related Components

- **[Form](./form.md)**: Parent form container
- **[Input](./input.md)**: Base input component used internally
- **[Button](./button.md)**: Submit buttons
- **[Surface](./surface.md)**: Card containers

## Dependencies

- **Cleave.js**: Handles input formatting and validation
- Automatically included with component

## TypeScript Interface

```typescript
interface PaymentCardData {
  cardName: string;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
}

interface SchmancyPaymentCardFormElement extends HTMLElement {
  value: PaymentCardData;
  checkValidity(): boolean;
}

// Change event
interface PaymentCardChangeEvent extends CustomEvent {
  detail: PaymentCardData;
}
```