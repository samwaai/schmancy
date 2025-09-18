import { $LitElement } from '@mixins/index';
import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('demo-forms-examples')
export class DemoFormsExamples extends $LitElement(css`
  .example-section {
    margin-bottom: 3rem;
  }

  .form-container {
    max-width: 600px;
  }
`) {
  // Registration Form States
  @state() private regForm = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    terms: false
  };

  // Contact Form States
  @state() private contactForm = {
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'normal'
  };

  // Payment Form States
  @state() private paymentForm = {
    cardHolder: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    saveCard: false
  };

  // Profile Form States
  @state() private profileForm = {
    username: '',
    bio: '',
    website: '',
    location: '',
    birthDate: '',
    gender: '',
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    privacy: 'friends'
  };

  // Survey Form States
  @state() private surveyForm = {
    satisfaction: '',
    recommendation: 0,
    improvements: [],
    feedback: ''
  };

  private handleRegistrationSubmit(e: Event) {
    e.preventDefault();
    console.log('Registration form submitted:', this.regForm);
  }

  private handleContactSubmit(e: Event) {
    e.preventDefault();
    console.log('Contact form submitted:', this.contactForm);
  }

  private handlePaymentSubmit(e: Event) {
    e.preventDefault();
    console.log('Payment form submitted:', this.paymentForm);
  }

  private handleProfileSubmit(e: Event) {
    e.preventDefault();
    console.log('Profile form submitted:', this.profileForm);
  }

  private handleSurveySubmit(e: Event) {
    e.preventDefault();
    console.log('Survey form submitted:', this.surveyForm);
  }

  render() {
    return html`
      <schmancy-surface class="p-8">
        <!-- Header -->
        <schmancy-typography type="display" token="lg" class="mb-4 block">
          Complete Form Examples
        </schmancy-typography>
        <schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
          Real-world form examples demonstrating best practices, layout patterns, and component combinations.
        </schmancy-typography>

        <!-- Registration Form -->
        <div class="example-section">
          <schmancy-typography type="title" token="lg" class="mb-6 block">User Registration Form</schmancy-typography>

          <schmancy-grid gap="lg" class="w-full mb-8">
            <schmancy-code-preview language="html">
              <schmancy-surface type="surfaceDim" class="rounded-lg p-6">
                <form @submit=${this.handleRegistrationSubmit} class="form-container">
                  <schmancy-typography type="headline" token="md" class="mb-4 block">
                    Create Your Account
                  </schmancy-typography>

                  <div class="flex flex-col gap-4">
                    <!-- Name Fields -->
                    <div class="grid grid-cols-2 gap-4">
                      <schmancy-input
                        label="First Name"
                        required
                        placeholder="John"
                        .value=${this.regForm.firstName}
                        @input=${(e: Event) => this.regForm.firstName = (e.target as any).value}
                      ></schmancy-input>

                      <schmancy-input
                        label="Last Name"
                        required
                        placeholder="Doe"
                        .value=${this.regForm.lastName}
                        @input=${(e: Event) => this.regForm.lastName = (e.target as any).value}
                      ></schmancy-input>
                    </div>

                    <!-- Email -->
                    <schmancy-input
                      label="Email Address"
                      type="email"
                      required
                      placeholder="john.doe@example.com"
                      helper="We'll never share your email"
                      .value=${this.regForm.email}
                      @input=${(e: Event) => this.regForm.email = (e.target as any).value}
                    >
                      <schmancy-icon slot="leading">email</schmancy-icon>
                    </schmancy-input>

                    <!-- Password Fields -->
                    <schmancy-input
                      label="Password"
                      type="password"
                      required
                      placeholder="Enter password"
                      helper="At least 8 characters with upper/lower case, number, and special character"
                      .value=${this.regForm.password}
                      @input=${(e: Event) => this.regForm.password = (e.target as any).value}
                    >
                      <schmancy-icon slot="leading">lock</schmancy-icon>
                    </schmancy-input>

                    <schmancy-input
                      label="Confirm Password"
                      type="password"
                      required
                      placeholder="Re-enter password"
                      .value=${this.regForm.confirmPassword}
                      @input=${(e: Event) => this.regForm.confirmPassword = (e.target as any).value}
                    >
                      <schmancy-icon slot="leading">lock</schmancy-icon>
                    </schmancy-input>

                    <!-- Country Selection -->
                    <schmancy-select
                      label="Country"
                      required
                      helper="Select your country"
                      .value=${this.regForm.country}
                      @change=${(e: Event) => this.regForm.country = (e.target as any).value}
                    >
                      <schmancy-option value="">Choose country...</schmancy-option>
                      <schmancy-option value="us">United States</schmancy-option>
                      <schmancy-option value="uk">United Kingdom</schmancy-option>
                      <schmancy-option value="ca">Canada</schmancy-option>
                      <schmancy-option value="au">Australia</schmancy-option>
                      <schmancy-option value="de">Germany</schmancy-option>
                      <schmancy-option value="fr">France</schmancy-option>
                    </schmancy-select>

                    <!-- Terms and Conditions -->
                    <div class="flex items-center gap-2">
                      <schmancy-checkbox
                        required
                        .checked=${this.regForm.terms}
                        @change=${(e: Event) => this.regForm.terms = (e.target as any).checked}
                      ></schmancy-checkbox>
                      <schmancy-typography type="body" token="sm">
                        I agree to the <a href="#" class="text-primary">Terms of Service</a> and
                        <a href="#" class="text-primary">Privacy Policy</a>
                      </schmancy-typography>
                    </div>

                    <!-- Submit Button -->
                    <schmancy-button type="submit" variant="filled" class="w-full">
                      Create Account
                    </schmancy-button>

                    <!-- Already have account -->
                    <schmancy-typography type="body" token="sm" class="text-center text-surface-onVariant">
                      Already have an account? <a href="#" class="text-primary">Sign in</a>
                    </schmancy-typography>
                  </div>
                </form>
              </schmancy-surface>
            </schmancy-code-preview>
          </schmancy-grid>
        </div>

        <!-- Contact Form -->
        <div class="example-section">
          <schmancy-typography type="title" token="lg" class="mb-6 block">Contact Form</schmancy-typography>

          <schmancy-grid gap="lg" class="w-full mb-8">
            <schmancy-code-preview language="html">
              <schmancy-surface type="surfaceDim" class="rounded-lg p-6">
                <form @submit=${this.handleContactSubmit} class="form-container">
                  <schmancy-typography type="headline" token="md" class="mb-2 block">
                    Get in Touch
                  </schmancy-typography>
                  <schmancy-typography type="body" token="sm" class="mb-4 text-surface-onVariant block">
                    We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                  </schmancy-typography>

                  <div class="flex flex-col gap-4">
                    <!-- Name -->
                    <schmancy-input
                      label="Your Name"
                      required
                      placeholder="Enter your full name"
                      .value=${this.contactForm.name}
                      @input=${(e: Event) => this.contactForm.name = (e.target as any).value}
                    >
                      <schmancy-icon slot="leading">person</schmancy-icon>
                    </schmancy-input>

                    <!-- Email -->
                    <schmancy-input
                      label="Email Address"
                      type="email"
                      required
                      placeholder="your@email.com"
                      .value=${this.contactForm.email}
                      @input=${(e: Event) => this.contactForm.email = (e.target as any).value}
                    >
                      <schmancy-icon slot="leading">email</schmancy-icon>
                    </schmancy-input>

                    <!-- Subject -->
                    <schmancy-input
                      label="Subject"
                      required
                      placeholder="What is this about?"
                      .value=${this.contactForm.subject}
                      @input=${(e: Event) => this.contactForm.subject = (e.target as any).value}
                    >
                      <schmancy-icon slot="leading">subject</schmancy-icon>
                    </schmancy-input>

                    <!-- Priority -->
                    <schmancy-radio-group
                      label="Priority"
                      orientation="horizontal"
                      .value=${this.contactForm.priority}
                      @change=${(e: Event) => this.contactForm.priority = (e.target as any).value}
                    >
                      <schmancy-radio value="low">Low</schmancy-radio>
                      <schmancy-radio value="normal">Normal</schmancy-radio>
                      <schmancy-radio value="high">High</schmancy-radio>
                      <schmancy-radio value="urgent">Urgent</schmancy-radio>
                    </schmancy-radio-group>

                    <!-- Message -->
                    <schmancy-textarea
                      label="Message"
                      required
                      placeholder="Type your message here..."
                      rows="6"
                      helper="Minimum 50 characters"
                      .value=${this.contactForm.message}
                      @input=${(e: Event) => this.contactForm.message = (e.target as any).value}
                    ></schmancy-textarea>

                    <!-- Submit Button -->
                    <div class="flex gap-2">
                      <schmancy-button type="submit" variant="filled">
                        <schmancy-icon slot="icon">send</schmancy-icon>
                        Send Message
                      </schmancy-button>
                      <schmancy-button type="button" variant="outlined">
                        Cancel
                      </schmancy-button>
                    </div>
                  </div>
                </form>
              </schmancy-surface>
            </schmancy-code-preview>
          </schmancy-grid>
        </div>

        <!-- Payment Form -->
        <div class="example-section">
          <schmancy-typography type="title" token="lg" class="mb-6 block">Payment Form</schmancy-typography>

          <schmancy-grid gap="lg" class="w-full mb-8">
            <schmancy-code-preview language="html">
              <schmancy-surface type="surfaceDim" class="rounded-lg p-6">
                <form @submit=${this.handlePaymentSubmit} class="form-container">
                  <schmancy-typography type="headline" token="md" class="mb-4 block">
                    Payment Details
                  </schmancy-typography>

                  <div class="flex flex-col gap-4">
                    <!-- Card Details Section -->
                    <div class="flex flex-col gap-4">
                      <schmancy-typography type="label" token="lg" class="block">
                        Card Information
                      </schmancy-typography>

                      <!-- Card Holder -->
                      <schmancy-input
                        label="Cardholder Name"
                        required
                        placeholder="Name on card"
                        .value=${this.paymentForm.cardHolder}
                        @input=${(e: Event) => this.paymentForm.cardHolder = (e.target as any).value}
                      >
                        <schmancy-icon slot="leading">person</schmancy-icon>
                      </schmancy-input>

                      <!-- Card Number -->
                      <schmancy-input
                        label="Card Number"
                        required
                        placeholder="1234 5678 9012 3456"
                        maxlength="19"
                        pattern="[0-9]{4}[\s]?[0-9]{4}[\s]?[0-9]{4}[\s]?[0-9]{4}"
                        .value=${this.paymentForm.cardNumber}
                        @input=${(e: Event) => this.paymentForm.cardNumber = (e.target as any).value}
                      >
                        <schmancy-icon slot="leading">credit_card</schmancy-icon>
                      </schmancy-input>

                      <!-- Expiry and CVV -->
                      <div class="grid grid-cols-2 gap-4">
                        <schmancy-input
                          label="Expiry Date"
                          required
                          placeholder="MM/YY"
                          pattern="[0-9]{2}/[0-9]{2}"
                          maxlength="5"
                          .value=${this.paymentForm.expiryDate}
                          @input=${(e: Event) => this.paymentForm.expiryDate = (e.target as any).value}
                        >
                          <schmancy-icon slot="leading">calendar_today</schmancy-icon>
                        </schmancy-input>

                        <schmancy-input
                          label="CVV"
                          required
                          type="password"
                          placeholder="123"
                          pattern="[0-9]{3,4}"
                          maxlength="4"
                          helper="3 or 4 digits"
                          .value=${this.paymentForm.cvv}
                          @input=${(e: Event) => this.paymentForm.cvv = (e.target as any).value}
                        >
                          <schmancy-icon slot="leading">lock</schmancy-icon>
                        </schmancy-input>
                      </div>
                    </div>

                    <!-- Billing Address Section -->
                    <div class="flex flex-col gap-4">
                      <schmancy-typography type="label" token="lg" class="block">
                        Billing Address
                      </schmancy-typography>

                      <!-- Street Address -->
                      <schmancy-input
                        label="Street Address"
                        required
                        placeholder="123 Main Street"
                        .value=${this.paymentForm.billingAddress}
                        @input=${(e: Event) => this.paymentForm.billingAddress = (e.target as any).value}
                      >
                        <schmancy-icon slot="leading">home</schmancy-icon>
                      </schmancy-input>

                      <!-- City and ZIP -->
                      <div class="grid grid-cols-2 gap-4">
                        <schmancy-input
                          label="City"
                          required
                          placeholder="New York"
                          .value=${this.paymentForm.city}
                          @input=${(e: Event) => this.paymentForm.city = (e.target as any).value}
                        >
                          <schmancy-icon slot="leading">location_city</schmancy-icon>
                        </schmancy-input>

                        <schmancy-input
                          label="ZIP Code"
                          required
                          pattern="[0-9]{5}"
                          placeholder="12345"
                          .value=${this.paymentForm.zipCode}
                          @input=${(e: Event) => this.paymentForm.zipCode = (e.target as any).value}
                        >
                          <schmancy-icon slot="leading">pin_drop</schmancy-icon>
                        </schmancy-input>
                      </div>
                    </div>

                    <!-- Save Card Option -->
                    <div class="flex items-center gap-2">
                      <schmancy-checkbox
                        .checked=${this.paymentForm.saveCard}
                        @change=${(e: Event) => this.paymentForm.saveCard = (e.target as any).checked}
                      ></schmancy-checkbox>
                      <schmancy-typography type="body" token="sm">
                        Save this card for future purchases
                      </schmancy-typography>
                    </div>

                    <!-- Submit Button -->
                    <schmancy-button type="submit" variant="filled" class="w-full">
                      <schmancy-icon slot="icon">lock</schmancy-icon>
                      Complete Payment
                    </schmancy-button>

                    <!-- Security Note -->
                    <div class="flex items-center gap-2 justify-center">
                      <schmancy-icon size="sm" class="text-surface-onVariant">lock</schmancy-icon>
                      <schmancy-typography type="body" token="xs" class="text-surface-onVariant">
                        Your payment information is encrypted and secure
                      </schmancy-typography>
                    </div>
                  </div>
                </form>
              </schmancy-surface>
            </schmancy-code-preview>
          </schmancy-grid>
        </div>

        <!-- Profile Settings Form -->
        <div class="example-section">
          <schmancy-typography type="title" token="lg" class="mb-6 block">Profile Settings</schmancy-typography>

          <schmancy-grid gap="lg" class="w-full mb-8">
            <schmancy-code-preview language="html">
              <schmancy-surface type="surfaceDim" class="rounded-lg p-6">
                <form @submit=${this.handleProfileSubmit} class="form-container">
                  <schmancy-typography type="headline" token="md" class="mb-4 block">
                    Edit Profile
                  </schmancy-typography>

                  <div class="flex flex-col gap-6">
                    <!-- Basic Info -->
                    <div class="flex flex-col gap-4">
                      <schmancy-typography type="label" token="lg" class="block">
                        Basic Information
                      </schmancy-typography>

                      <schmancy-input
                        label="Username"
                        required
                        placeholder="@username"
                        helper="This is your public display name"
                        .value=${this.profileForm.username}
                        @input=${(e: Event) => this.profileForm.username = (e.target as any).value}
                      >
                        <schmancy-icon slot="leading">alternate_email</schmancy-icon>
                      </schmancy-input>

                      <schmancy-textarea
                        label="Bio"
                        placeholder="Tell us about yourself..."
                        rows="3"
                        helper="${this.profileForm.bio.length}/160 characters"
                        maxlength="160"
                        .value=${this.profileForm.bio}
                        @input=${(e: Event) => this.profileForm.bio = (e.target as any).value}
                      ></schmancy-textarea>

                      <schmancy-input
                        label="Website"
                        type="url"
                        placeholder="https://yourwebsite.com"
                        .value=${this.profileForm.website}
                        @input=${(e: Event) => this.profileForm.website = (e.target as any).value}
                      >
                        <schmancy-icon slot="leading">link</schmancy-icon>
                      </schmancy-input>

                      <schmancy-input
                        label="Location"
                        placeholder="City, Country"
                        .value=${this.profileForm.location}
                        @input=${(e: Event) => this.profileForm.location = (e.target as any).value}
                      >
                        <schmancy-icon slot="leading">location_on</schmancy-icon>
                      </schmancy-input>
                    </div>

                    <!-- Personal Info -->
                    <div class="flex flex-col gap-4">
                      <schmancy-typography type="label" token="lg" class="block">
                        Personal Information
                      </schmancy-typography>

                      <div class="grid grid-cols-2 gap-4">
                        <schmancy-input
                          label="Birth Date"
                          type="date"
                          .value=${this.profileForm.birthDate}
                          @input=${(e: Event) => this.profileForm.birthDate = (e.target as any).value}
                        >
                          <schmancy-icon slot="leading">cake</schmancy-icon>
                        </schmancy-input>

                        <schmancy-select
                          label="Gender"
                          .value=${this.profileForm.gender}
                          @change=${(e: Event) => this.profileForm.gender = (e.target as any).value}
                        >
                          <schmancy-option value="">Prefer not to say</schmancy-option>
                          <schmancy-option value="male">Male</schmancy-option>
                          <schmancy-option value="female">Female</schmancy-option>
                          <schmancy-option value="other">Other</schmancy-option>
                        </schmancy-select>
                      </div>
                    </div>

                    <!-- Notifications -->
                    <div class="flex flex-col gap-4">
                      <schmancy-typography type="label" token="lg" class="block">
                        Notification Preferences
                      </schmancy-typography>

                      <div class="flex items-center justify-between p-3 bg-surface-container rounded-lg">
                        <div>
                          <schmancy-typography type="body" token="md">Email Notifications</schmancy-typography>
                          <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                            Receive updates via email
                          </schmancy-typography>
                        </div>
                        <schmancy-switch
                          .checked=${this.profileForm.notifications.email}
                          @change=${(e: Event) => this.profileForm.notifications = {...this.profileForm.notifications, email: (e.target as any).checked}}
                        ></schmancy-switch>
                      </div>

                      <div class="flex items-center justify-between p-3 bg-surface-container rounded-lg">
                        <div>
                          <schmancy-typography type="body" token="md">Push Notifications</schmancy-typography>
                          <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                            Browser push notifications
                          </schmancy-typography>
                        </div>
                        <schmancy-switch
                          .checked=${this.profileForm.notifications.push}
                          @change=${(e: Event) => this.profileForm.notifications = {...this.profileForm.notifications, push: (e.target as any).checked}}
                        ></schmancy-switch>
                      </div>

                      <div class="flex items-center justify-between p-3 bg-surface-container rounded-lg">
                        <div>
                          <schmancy-typography type="body" token="md">SMS Notifications</schmancy-typography>
                          <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                            Text message alerts
                          </schmancy-typography>
                        </div>
                        <schmancy-switch
                          .checked=${this.profileForm.notifications.sms}
                          @change=${(e: Event) => this.profileForm.notifications = {...this.profileForm.notifications, sms: (e.target as any).checked}}
                        ></schmancy-switch>
                      </div>
                    </div>

                    <!-- Privacy -->
                    <div class="flex flex-col gap-4">
                      <schmancy-typography type="label" token="lg" class="block">
                        Privacy Settings
                      </schmancy-typography>

                      <schmancy-radio-group
                        label="Profile Visibility"
                        .value=${this.profileForm.privacy}
                        @change=${(e: Event) => this.profileForm.privacy = (e.target as any).value}
                      >
                        <schmancy-radio value="public">
                          <div>
                            <div>Public</div>
                            <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                              Anyone can view your profile
                            </schmancy-typography>
                          </div>
                        </schmancy-radio>
                        <schmancy-radio value="friends">
                          <div>
                            <div>Friends Only</div>
                            <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                              Only friends can view your profile
                            </schmancy-typography>
                          </div>
                        </schmancy-radio>
                        <schmancy-radio value="private">
                          <div>
                            <div>Private</div>
                            <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                              Only you can view your profile
                            </schmancy-typography>
                          </div>
                        </schmancy-radio>
                      </schmancy-radio-group>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-2">
                      <schmancy-button type="submit" variant="filled">
                        Save Changes
                      </schmancy-button>
                      <schmancy-button type="button" variant="text">
                        Cancel
                      </schmancy-button>
                    </div>
                  </div>
                </form>
              </schmancy-surface>
            </schmancy-code-preview>
          </schmancy-grid>
        </div>
      </schmancy-surface>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-forms-examples': DemoFormsExamples;
  }
}