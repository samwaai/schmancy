import { $LitElement } from '@mixins/index';
import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('demo-forms-validation')
export default class DemoFormsValidation extends $LitElement() {
  // Real-time validation states
  @state() private emailValue = '';
  @state() private emailError = '';
  @state() private passwordValue = '';
  @state() private passwordError = '';
  @state() private confirmPasswordValue = '';
  @state() private confirmPasswordError = '';
  @state() private phoneValue = '';
  @state() private phoneError = '';
  @state() private urlValue = '';
  @state() private urlError = '';
  @state() private ageValue = '';
  @state() private ageError = '';

  // Form submission states
  @state() private formErrors: string[] = [];
  @state() private formSubmitted = false;
  @state() private formValid = false;

  private validateEmail(email: string): string {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  }

  private validatePassword(password: string): string {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain lowercase letter';
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain uppercase letter';
    if (!/(?=.*\d)/.test(password)) return 'Password must contain a number';
    if (!/(?=.*[@$!%*?&])/.test(password)) return 'Password must contain a special character';
    return '';
  }

  private validateConfirmPassword(confirmPassword: string): string {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== this.passwordValue) return 'Passwords do not match';
    return '';
  }

  private validatePhone(phone: string): string {
    if (!phone) return 'Phone number is required';
    const phoneRegex = /^\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/;
    if (!phoneRegex.test(phone)) return 'Please enter a valid US phone number';
    return '';
  }

  private validateUrl(url: string): string {
    if (!url) return '';
    try {
      new URL(url);
      return '';
    } catch {
      return 'Please enter a valid URL (e.g., https://example.com)';
    }
  }

  private validateAge(age: string): string {
    if (!age) return 'Age is required';
    const ageNum = parseInt(age);
    if (isNaN(ageNum)) return 'Please enter a valid number';
    if (ageNum < 18) return 'You must be at least 18 years old';
    if (ageNum > 120) return 'Please enter a valid age';
    return '';
  }

  private handleFormSubmit(e: Event) {
    e.preventDefault();
    this.formErrors = [];

    // Validate all fields
    const errors = [
      this.validateEmail(this.emailValue),
      this.validatePassword(this.passwordValue),
      this.validateConfirmPassword(this.confirmPasswordValue),
      this.validatePhone(this.phoneValue),
      this.validateAge(this.ageValue)
    ].filter(error => error);

    if (errors.length > 0) {
      this.formErrors = errors;
      this.formValid = false;
    } else {
      this.formValid = true;
      this.formSubmitted = true;
    }
  }

  render() {
    return html`
      <schmancy-surface class="p-8">
        <!-- Header -->
        <schmancy-typography type="display" token="lg" class="mb-4 block">
          Form Validation
        </schmancy-typography>
        <schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
          Implement robust client-side validation with real-time feedback, custom validators, and comprehensive error handling.
        </schmancy-typography>

        <!-- Real-time Validation -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-6 block">Real-time Validation</schmancy-typography>

          <schmancy-grid gap="lg" class="w-full mb-8">
            <schmancy-code-preview language="html">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Email Validation -->
                <schmancy-input
                  label="Email Address"
                  type="email"
                  placeholder="user@example.com"
                  required
                  .value=${this.emailValue}
                  .error=${!!this.emailError}
                  .error-text=${this.emailError}
                  @input=${(e: Event) => {
                    this.emailValue = (e.target as any).value;
                    this.emailError = this.validateEmail(this.emailValue);
                  }}
                  @blur=${() => {
                    this.emailError = this.validateEmail(this.emailValue);
                  }}
                >
                  <schmancy-icon slot="leading">email</schmancy-icon>
                  ${this.emailValue && !this.emailError ? html`
                    <schmancy-icon slot="trailing" class="text-success">check_circle</schmancy-icon>
                  ` : ''}
                </schmancy-input>

                <!-- Password Strength -->
                <schmancy-input
                  label="Password"
                  type="password"
                  placeholder="Enter secure password"
                  required
                  .value=${this.passwordValue}
                  .error=${!!this.passwordError}
                  .error-text=${this.passwordError}
                  .helper=${!this.passwordError && this.passwordValue ? 'Strong password' : 'Min 8 chars, upper/lower, number, special char'}
                  @input=${(e: Event) => {
                    this.passwordValue = (e.target as any).value;
                    this.passwordError = this.validatePassword(this.passwordValue);
                  }}
                >
                  <schmancy-icon slot="leading">lock</schmancy-icon>
                </schmancy-input>

                <!-- Confirm Password -->
                <schmancy-input
                  label="Confirm Password"
                  type="password"
                  placeholder="Re-enter password"
                  required
                  .value=${this.confirmPasswordValue}
                  .error=${!!this.confirmPasswordError}
                  .error-text=${this.confirmPasswordError}
                  @input=${(e: Event) => {
                    this.confirmPasswordValue = (e.target as any).value;
                    this.confirmPasswordError = this.validateConfirmPassword(this.confirmPasswordValue);
                  }}
                >
                  <schmancy-icon slot="leading">lock</schmancy-icon>
                  ${this.confirmPasswordValue && !this.confirmPasswordError ? html`
                    <schmancy-icon slot="trailing" class="text-success">check_circle</schmancy-icon>
                  ` : ''}
                </schmancy-input>

                <!-- Phone Number -->
                <schmancy-input
                  label="Phone Number"
                  type="tel"
                  placeholder="(555) 123-4567"
                  required
                  .value=${this.phoneValue}
                  .error=${!!this.phoneError}
                  .error-text=${this.phoneError}
                  @input=${(e: Event) => {
                    this.phoneValue = (e.target as any).value;
                    this.phoneError = this.validatePhone(this.phoneValue);
                  }}
                >
                  <schmancy-icon slot="leading">phone</schmancy-icon>
                </schmancy-input>

                <!-- URL Validation -->
                <schmancy-input
                  label="Website (Optional)"
                  type="url"
                  placeholder="https://example.com"
                  .value=${this.urlValue}
                  .error=${!!this.urlError}
                  .error-text=${this.urlError}
                  .helper="Include https:// or http://"
                  @input=${(e: Event) => {
                    this.urlValue = (e.target as any).value;
                    if (this.urlValue) {
                      this.urlError = this.validateUrl(this.urlValue);
                    }
                  }}
                >
                  <schmancy-icon slot="leading">link</schmancy-icon>
                </schmancy-input>

                <!-- Age Validation -->
                <schmancy-input
                  label="Age"
                  type="number"
                  placeholder="18"
                  min="18"
                  max="120"
                  required
                  .value=${this.ageValue}
                  .error=${!!this.ageError}
                  .error-text=${this.ageError}
                  @input=${(e: Event) => {
                    this.ageValue = (e.target as any).value;
                    this.ageError = this.validateAge(this.ageValue);
                  }}
                >
                  <schmancy-icon slot="leading">cake</schmancy-icon>
                </schmancy-input>
              </div>
            </schmancy-code-preview>
          </schmancy-grid>
        </div>

        <!-- Built-in HTML5 Validation -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-6 block">HTML5 Validation Attributes</schmancy-typography>

          <schmancy-grid gap="lg" class="w-full mb-8">
            <schmancy-code-preview language="html">
              <form @submit=${(e: Event) => e.preventDefault()}>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Required Field -->
                  <schmancy-input
                    label="Username"
                    required
                    minlength="3"
                    maxlength="20"
                    placeholder="3-20 characters"
                    helper="Choose a unique username"
                  >
                    <schmancy-icon slot="leading">person</schmancy-icon>
                  </schmancy-input>

                  <!-- Pattern Validation -->
                  <schmancy-input
                    label="ZIP Code"
                    pattern="[0-9]{5}"
                    placeholder="12345"
                    required
                    helper="5-digit US ZIP code"
                    error-text="Invalid ZIP code format"
                  >
                    <schmancy-icon slot="leading">location_on</schmancy-icon>
                  </schmancy-input>

                  <!-- Number Range -->
                  <schmancy-input
                    label="Quantity"
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    value="1"
                    required
                    helper="Between 1 and 100"
                  >
                    <schmancy-icon slot="leading">inventory</schmancy-icon>
                  </schmancy-input>

                  <!-- Date Range -->
                  <schmancy-input
                    label="Birth Date"
                    type="date"
                    max=${new Date().toISOString().split('T')[0]}
                    min="1900-01-01"
                    required
                    helper="Must be 18+ years old"
                  >
                    <schmancy-icon slot="leading">calendar_today</schmancy-icon>
                  </schmancy-input>

                  <!-- Email Pattern -->
                  <schmancy-input
                    label="Work Email"
                    type="email"
                    pattern=".+@company\.com"
                    placeholder="name@company.com"
                    required
                    helper="Must be a company email"
                    error-text="Please use your company email"
                  >
                    <schmancy-icon slot="leading">business</schmancy-icon>
                  </schmancy-input>

                  <!-- Credit Card Pattern -->
                  <schmancy-input
                    label="Credit Card"
                    pattern="[0-9]{4}[\s]?[0-9]{4}[\s]?[0-9]{4}[\s]?[0-9]{4}"
                    placeholder="1234 5678 9012 3456"
                    maxlength="19"
                    required
                    helper="16-digit card number"
                  >
                    <schmancy-icon slot="leading">credit_card</schmancy-icon>
                  </schmancy-input>
                </div>
              </form>
            </schmancy-code-preview>
          </schmancy-grid>
        </div>

        <!-- Custom Validation Messages -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-6 block">Custom Error Messages</schmancy-typography>

          <schmancy-grid gap="lg" class="w-full mb-8">
            <schmancy-code-preview language="html">
              <div class="flex flex-col gap-4">
                <!-- Dynamic Error Messages -->
                <schmancy-input
                  label="Username"
                  placeholder="Enter username"
                  .error=${this.emailValue.length > 0 && this.emailValue.length < 3}
                  .error-text=${
                    this.emailValue.length === 1 ? 'Username is too short (minimum 3 characters)' :
                    this.emailValue.length === 2 ? 'Almost there! One more character needed' :
                    ''
                  }
                  .helper=${this.emailValue.length >= 3 ? 'Username available!' : 'Choose your username'}
                >
                  <schmancy-icon slot="leading">person</schmancy-icon>
                  ${this.emailValue.length >= 3 ? html`
                    <schmancy-icon slot="trailing" class="text-success">check</schmancy-icon>
                  ` : ''}
                </schmancy-input>

                <!-- Progressive Password Requirements -->
                <schmancy-input
                  label="New Password"
                  type="password"
                  placeholder="Create a strong password"
                  .error=${false}
                  .helper=${html`
                    <div class="text-xs">
                      Password requirements:
                      <div class="${this.passwordValue.length >= 8 ? 'text-success' : ''}">
                        ${this.passwordValue.length >= 8 ? '✓' : '○'} At least 8 characters
                      </div>
                      <div class="${/[A-Z]/.test(this.passwordValue) ? 'text-success' : ''}">
                        ${/[A-Z]/.test(this.passwordValue) ? '✓' : '○'} One uppercase letter
                      </div>
                      <div class="${/[a-z]/.test(this.passwordValue) ? 'text-success' : ''}">
                        ${/[a-z]/.test(this.passwordValue) ? '✓' : '○'} One lowercase letter
                      </div>
                      <div class="${/\d/.test(this.passwordValue) ? 'text-success' : ''}">
                        ${/\d/.test(this.passwordValue) ? '✓' : '○'} One number
                      </div>
                    </div>
                  `}
                >
                  <schmancy-icon slot="leading">lock</schmancy-icon>
                </schmancy-input>
              </div>
            </schmancy-code-preview>
          </schmancy-grid>
        </div>

        <!-- Form-wide Validation -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-6 block">Complete Form Validation</schmancy-typography>

          <schmancy-grid gap="lg" class="w-full mb-8">
            <schmancy-code-preview language="html">
              <form @submit=${this.handleFormSubmit}>
                <div class="flex flex-col gap-4">
                  <schmancy-input
                    label="Email"
                    type="email"
                    required
                    .value=${this.emailValue}
                    @input=${(e: Event) => this.emailValue = (e.target as any).value}
                  >
                    <schmancy-icon slot="leading">email</schmancy-icon>
                  </schmancy-input>

                  <schmancy-input
                    label="Password"
                    type="password"
                    required
                    .value=${this.passwordValue}
                    @input=${(e: Event) => this.passwordValue = (e.target as any).value}
                  >
                    <schmancy-icon slot="leading">lock</schmancy-icon>
                  </schmancy-input>

                  <schmancy-input
                    label="Confirm Password"
                    type="password"
                    required
                    .value=${this.confirmPasswordValue}
                    @input=${(e: Event) => this.confirmPasswordValue = (e.target as any).value}
                  >
                    <schmancy-icon slot="leading">lock</schmancy-icon>
                  </schmancy-input>

                  <schmancy-input
                    label="Phone"
                    type="tel"
                    required
                    .value=${this.phoneValue}
                    @input=${(e: Event) => this.phoneValue = (e.target as any).value}
                  >
                    <schmancy-icon slot="leading">phone</schmancy-icon>
                  </schmancy-input>

                  <schmancy-input
                    label="Age"
                    type="number"
                    required
                    .value=${this.ageValue}
                    @input=${(e: Event) => this.ageValue = (e.target as any).value}
                  >
                    <schmancy-icon slot="leading">cake</schmancy-icon>
                  </schmancy-input>

                  <schmancy-button type="submit" variant="filled">
                    Validate & Submit
                  </schmancy-button>

                  ${this.formErrors.length > 0 ? html`
                    <div class="bg-error-container text-on-error-container p-4 rounded-lg mt-4">
                      <schmancy-typography type="body" token="md" class="font-medium mb-2">
                        Please fix the following errors:
                      </schmancy-typography>
                      <ul class="list-disc list-inside">
                        ${this.formErrors.map(error => html`
                          <li>${error}</li>
                        `)}
                      </ul>
                    </div>
                  ` : ''}

                  ${this.formSubmitted && this.formValid ? html`
                    <div class="bg-tertiary-container text-on-tertiary-container p-4 rounded-lg mt-4">
                      <schmancy-typography type="body" token="md" class="font-medium">
                        ✓ Form submitted successfully!
                      </schmancy-typography>
                      <schmancy-typography type="body" token="sm" class="mt-1">
                        All validations passed. Form data is ready for processing.
                      </schmancy-typography>
                    </div>
                  ` : ''}
                </div>
              </form>
            </schmancy-code-preview>
          </schmancy-grid>
        </div>

        <!-- Validation Best Practices -->
        <schmancy-typography type="title" token="lg" class="mb-4 block">Validation Best Practices</schmancy-typography>

        <schmancy-surface type="surfaceDim" class="rounded-lg p-6">
          <div class="flex flex-col gap-4">
            <div class="flex gap-2">
              <schmancy-icon class="text-primary">lightbulb</schmancy-icon>
              <div>
                <schmancy-typography type="body" token="md" class="font-medium">
                  Validate on blur for better UX
                </schmancy-typography>
                <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                  Don't show errors while the user is still typing
                </schmancy-typography>
              </div>
            </div>

            <div class="flex gap-2">
              <schmancy-icon class="text-primary">lightbulb</schmancy-icon>
              <div>
                <schmancy-typography type="body" token="md" class="font-medium">
                  Provide clear, actionable error messages
                </schmancy-typography>
                <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                  Tell users exactly what's wrong and how to fix it
                </schmancy-typography>
              </div>
            </div>

            <div class="flex gap-2">
              <schmancy-icon class="text-primary">lightbulb</schmancy-icon>
              <div>
                <schmancy-typography type="body" token="md" class="font-medium">
                  Show positive feedback for valid inputs
                </schmancy-typography>
                <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                  Use success indicators to confirm correct input
                </schmancy-typography>
              </div>
            </div>

            <div class="flex gap-2">
              <schmancy-icon class="text-primary">lightbulb</schmancy-icon>
              <div>
                <schmancy-typography type="body" token="md" class="font-medium">
                  Group related validation errors
                </schmancy-typography>
                <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                  Show form-level errors in a summary at the top
                </schmancy-typography>
              </div>
            </div>

            <div class="flex gap-2">
              <schmancy-icon class="text-primary">lightbulb</schmancy-icon>
              <div>
                <schmancy-typography type="body" token="md" class="font-medium">
                  Always validate on the server too
                </schmancy-typography>
                <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                  Client-side validation is for UX, server-side is for security
                </schmancy-typography>
              </div>
            </div>
          </div>
        </schmancy-surface>
      </schmancy-surface>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-forms-validation': DemoFormsValidation;
  }
}