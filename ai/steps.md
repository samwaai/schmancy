# Steps Component

A powerful stepper component for guiding users through multi-step processes with progress tracking, navigation control, and flexible content management.

## Quick Start

```html
<!-- Basic steps -->
<schmancy-steps-container currentStep="1">
  <schmancy-step position="1" title="Account Setup">
    <schmancy-input label="Email" type="email"></schmancy-input>
    <schmancy-input label="Password" type="password"></schmancy-input>
  </schmancy-step>
  
  <schmancy-step position="2" title="Profile Details">
    <schmancy-input label="Full Name"></schmancy-input>
    <schmancy-input label="Phone"></schmancy-input>
  </schmancy-step>
  
  <schmancy-step position="3" title="Review">
    <p>Review your information and submit</p>
    <schmancy-button variant="filled">Complete</schmancy-button>
  </schmancy-step>
</schmancy-steps-container>
```

## Components

### schmancy-steps-container
The parent container managing step state and navigation.

**Properties:**
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `currentStep` | `number` | `1` | Currently active step (1-based) |
| `gap` | `number` | `4` | Gap between steps (Tailwind gap scale: 0-24) |

**Events:**
| Event | Detail | Description |
|-------|---------|-------------|
| `@change` | `{ value: number }` | Fires when currentStep changes |

### schmancy-step
Individual step component with content and metadata.

**Properties:**
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `position` | `number` | `1` | Step position (1-based) |
| `title` | `string` | `''` | Step title |
| `description` | `string` | `''` | Optional step description |
| `completed` | `boolean` | `false` | Explicitly mark as complete |
| `lockBack` | `boolean` | `false` | Prevent navigation to previous steps |

## Examples

### Checkout Process
```html
<schmancy-steps-container currentStep="2">
  <schmancy-step position="1" title="Cart" description="Review your items">
    <schmancy-list>
      ${cartItems.map(item => html`
        <schmancy-list-item>
          ${item.name} - $${item.price}
        </schmancy-list-item>
      `)}
    </schmancy-list>
  </schmancy-step>
  
  <schmancy-step position="2" title="Shipping" description="Enter delivery address">
    <schmancy-form>
      <schmancy-input label="Street Address"></schmancy-input>
      <schmancy-input label="City"></schmancy-input>
      <schmancy-select label="State">
        <!-- State options -->
      </schmancy-select>
      <schmancy-input label="ZIP Code"></schmancy-input>
    </schmancy-form>
  </schmancy-step>
  
  <schmancy-step position="3" title="Payment" description="Payment information">
    <schmancy-payment-card-form></schmancy-payment-card-form>
  </schmancy-step>
  
  <schmancy-step position="4" title="Confirm" description="Review and place order">
    <div class="summary">
      <!-- Order summary -->
    </div>
    <schmancy-button variant="filled" @click="${placeOrder}">
      Place Order
    </schmancy-button>
  </schmancy-step>
</schmancy-steps-container>
```

### Onboarding Flow
```html
<schmancy-steps-container>
  <schmancy-step position="1" title="Welcome" completed>
    <div class="text-center p-8">
      <h2>Welcome to Our Platform!</h2>
      <p>Let's get you set up in just a few steps.</p>
      <schmancy-button @click="${nextStep}">Get Started</schmancy-button>
    </div>
  </schmancy-step>
  
  <schmancy-step position="2" title="Connect Accounts" lockBack>
    <p>Connect your social accounts for better integration:</p>
    <div class="space-y-2">
      <schmancy-button variant="outlined" width="full">
        <schmancy-icon slot="start">facebook</schmancy-icon>
        Connect Facebook
      </schmancy-button>
      <schmancy-button variant="outlined" width="full">
        <schmancy-icon slot="start">twitter</schmancy-icon>
        Connect Twitter
      </schmancy-button>
    </div>
  </schmancy-step>
  
  <schmancy-step position="3" title="Preferences">
    <h3>Customize your experience:</h3>
    <schmancy-checkbox label="Email notifications"></schmancy-checkbox>
    <schmancy-checkbox label="Weekly digest"></schmancy-checkbox>
    <schmancy-checkbox label="Product updates"></schmancy-checkbox>
  </schmancy-step>
</schmancy-steps-container>
```

### Form Wizard
```html
<schmancy-steps-container currentStep="1">
  <schmancy-step position="1" title="Basic Info">
    <schmancy-form>
      <schmancy-input label="Company Name" required></schmancy-input>
      <schmancy-select label="Industry" required>
        <schmancy-option value="tech">Technology</schmancy-option>
        <schmancy-option value="finance">Finance</schmancy-option>
        <schmancy-option value="healthcare">Healthcare</schmancy-option>
      </schmancy-select>
      <schmancy-textarea label="Description"></schmancy-textarea>
    </schmancy-form>
  </schmancy-step>
  
  <schmancy-step position="2" title="Contact Details">
    <schmancy-form>
      <schmancy-input label="Contact Name"></schmancy-input>
      <schmancy-input label="Email" type="email"></schmancy-input>
      <schmancy-input label="Phone" type="tel"></schmancy-input>
    </schmancy-form>
  </schmancy-step>
  
  <schmancy-step position="3" title="Additional Info">
    <schmancy-form>
      <schmancy-date-range
        .dateFrom="${{ label: 'Founded', value: '' }}"
        .dateTo="${{ label: 'Current', value: '' }}"
      ></schmancy-date-range>
      <schmancy-input label="Number of Employees" type="number"></schmancy-input>
    </schmancy-form>
  </schmancy-step>
</schmancy-steps-container>
```

## Features

### Visual States
- **Complete**: Checkmark icon, can navigate back
- **Current**: Active indicator, expanded content
- **Upcoming**: Grayed out, not clickable

### Navigation Control
- Click completed steps to go back
- `lockBack` prevents backward navigation
- Automatic step expansion/collapse

### Flexible Layout
- Steps grow to show content when active
- Smooth transitions between steps
- Responsive design

### Context System
Uses Lit Context API for state management between container and steps.

## Styling

```css
/* Custom step styling */
schmancy-step {
  --step-connector-color: var(--schmancy-sys-color-tertiary-default);
  --step-inactive-color: #9CA3AF;
  --step-icon-size: 1.25rem;
}

/* Active step content spacing */
schmancy-step[position="2"] {
  --step-content-padding: 2rem;
}
```

## Programmatic Control with Lit

Use reactive state properties and property binding for declarative step control:

```typescript
import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('my-wizard')
export class MyWizard extends LitElement {
  // Reactive state for current step
  @state() private currentStep = 1;
  
  // Navigation methods
  goNext() {
    this.currentStep++;
  }
  
  goPrevious() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  
  goToStep(step: number) {
    this.currentStep = step;
  }
  
  render() {
    return html`
      <!-- Use dot syntax for reactive property binding -->
      <schmancy-steps-container .currentStep=${this.currentStep}>
        <schmancy-step position="1" title="First Step">
          <p>Content for step 1</p>
        </schmancy-step>
        
        <schmancy-step position="2" title="Second Step">
          <p>Content for step 2</p>
        </schmancy-step>
        
        <schmancy-step position="3" title="Final Step">
          <p>Content for step 3</p>
        </schmancy-step>
      </schmancy-steps-container>
      
      <!-- Navigation buttons -->
      <div class="flex gap-4 mt-4">
        <schmancy-button 
          @click=${() => this.goPrevious()}
          ?disabled=${this.currentStep === 1}>
          Previous
        </schmancy-button>
        
        <schmancy-button 
          @click=${() => this.goNext()}
          ?disabled=${this.currentStep === 3}>
          Next
        </schmancy-button>
      </div>
    `;
  }
}
```

## Navigation Patterns

### Reactive State Binding

The steps component uses reactive property binding to manage navigation. Always use the `.currentStep` property binding with the dot syntax for proper reactivity:

```typescript
// ✅ CORRECT - Reactive property binding
<schmancy-steps-container .currentStep=${this.currentStep}>

// ❌ WRONG - Attribute binding (won't update reactively)
<schmancy-steps-container currentStep="${this.currentStep}">
```

### Button-Based Navigation

Navigation should be controlled through external buttons or logic, NOT by adding click handlers to step components:

```typescript
@customElement('checkout-flow')
export class CheckoutFlow extends LitElement {
  @state() private currentStep = 1;
  @state() private maxSteps = 4;
  
  // Validation before navigation
  async validateAndProceed() {
    const isValid = await this.validateCurrentStep();
    if (isValid && this.currentStep < this.maxSteps) {
      this.currentStep++;
    }
  }
  
  render() {
    return html`
      <schmancy-steps-container .currentStep=${this.currentStep}>
        <schmancy-step position="1" title="Cart">
          <!-- Cart content -->
        </schmancy-step>
        
        <schmancy-step position="2" title="Shipping">
          <!-- Shipping form -->
        </schmancy-step>
        
        <schmancy-step position="3" title="Payment">
          <!-- Payment form -->
        </schmancy-step>
        
        <schmancy-step position="4" title="Confirm">
          <!-- Order summary -->
        </schmancy-step>
      </schmancy-steps-container>
      
      <!-- Navigation controls -->
      <div class="flex justify-between mt-6">
        <schmancy-button 
          variant="text"
          @click=${() => this.currentStep--}
          ?disabled=${this.currentStep === 1}>
          Back
        </schmancy-button>
        
        <schmancy-button 
          variant="filled"
          @click=${() => this.validateAndProceed()}>
          ${this.currentStep === this.maxSteps ? 'Complete' : 'Continue'}
        </schmancy-button>
      </div>
    `;
  }
}
```

### Programmatic Navigation Examples

```typescript
// Jump to specific step
handleSkipToReview() {
  this.currentStep = 4;
}

// Reset to beginning
handleReset() {
  this.currentStep = 1;
}

// Navigate based on condition
handleConditionalNav() {
  if (this.userType === 'premium') {
    this.currentStep = 3; // Skip step 2 for premium users
  } else {
    this.currentStep = 2;
  }
}
```

## Common Mistakes to Avoid

### ❌ Using querySelector
```javascript
// WRONG - Avoid imperative DOM queries
const container = this.shadowRoot.querySelector('schmancy-steps-container');
container.currentStep = 2;
```

### ❌ Adding Click Handlers to Steps
```html
<!-- WRONG - Steps handle their own click behavior internally -->
<schmancy-step @click=${() => this.goToStep(2)} position="2" title="Step 2">
```

### ❌ Using Attribute Binding Instead of Property Binding
```html
<!-- WRONG - Won't update reactively -->
<schmancy-steps-container currentStep="${this.currentStep}">

<!-- CORRECT - Use dot syntax for properties -->
<schmancy-steps-container .currentStep=${this.currentStep}>
```

### ❌ Directly Manipulating Step State
```javascript
// WRONG - Don't directly modify step properties
const step = this.shadowRoot.querySelector('schmancy-step[position="2"]');
step.completed = true;

// CORRECT - Let the container manage step states
this.currentStep = 3; // This automatically marks step 2 as complete
```

## Best Practices

1. **Clear Titles**: Use descriptive, action-oriented titles
2. **Progress Saving**: Save user progress between sessions
3. **Validation**: Validate before allowing step progression
4. **Mobile**: Ensure steps work well on small screens
5. **Accessibility**: Provide clear navigation cues

## Related Components

- [Form](./form.md) - Form integration
- [Button](./button.md) - Navigation controls
- [List](./list.md) - Step content lists
- [Typography](./typography.md) - Step labels

## Use Cases

1. **Checkout Flows**: E-commerce purchase process
2. **Onboarding**: New user setup
3. **Form Wizards**: Complex multi-page forms
4. **Tutorials**: Step-by-step guides
5. **Configuration**: Multi-step setup processes