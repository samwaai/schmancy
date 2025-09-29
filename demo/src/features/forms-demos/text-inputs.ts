import { $LitElement } from '@mixins/index';
import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('demo-forms-text-inputs')
export default class DemoFormsTextInputs extends $LitElement() {
  @state() private basicValue = '';
  @state() private filledValue = 'Pre-filled text';
  @state() private outlinedValue = '';
  @state() private emailValue = '';
  @state() private passwordValue = '';
  @state() private numberValue = '';
  @state() private searchValue = '';
  @state() private telValue = '';
  @state() private urlValue = '';
  @state() private textareaValue = '';
  @state() private errorValue = '';
  @state() private showError = false;

  render() {
    return html`
      <schmancy-surface class="p-8">
        <!-- Header -->
        <schmancy-typography type="display" token="lg" class="mb-4 block">
          Text Inputs
        </schmancy-typography>
        <schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
          Text fields let users enter and edit text. They come in two variants: outlined and filled.
        </schmancy-typography>

        <!-- Basic Text Inputs -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-6 block">Basic Text Fields</schmancy-typography>

          <schmancy-grid gap="lg" class="w-full mb-8">
            <schmancy-code-preview language="html">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Outlined (Default) -->
                <schmancy-input
                  label="Outlined"
                  placeholder="Enter text"
                  helper="This is helper text"
                  .value=${this.outlinedValue}
                  @input=${(e: Event) => this.outlinedValue = (e.target as any).value}
                ></schmancy-input>

                <!-- Filled Variant -->
                <schmancy-input
                  label="Filled"
                  variant="filled"
                  placeholder="Enter text"
                  helper="Filled style variant"
                  .value=${this.filledValue}
                  @input=${(e: Event) => this.filledValue = (e.target as any).value}
                ></schmancy-input>

                <!-- With Leading Icon -->
                <schmancy-input
                  label="With Icon"
                  placeholder="Search"
                  helper="Leading icon example"
                >
                  <schmancy-icon slot="leading">search</schmancy-icon>
                </schmancy-input>

                <!-- With Trailing Icon -->
                <schmancy-input
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                >
                  <schmancy-icon slot="trailing">visibility</schmancy-icon>
                </schmancy-input>

                <!-- Required Field -->
                <schmancy-input
                  label="Required Field"
                  required
                  placeholder="This field is required"
                  helper="* indicates required"
                ></schmancy-input>

                <!-- Disabled Field -->
                <schmancy-input
                  label="Disabled"
                  disabled
                  value="Cannot edit this"
                  helper="This field is disabled"
                ></schmancy-input>
              </div>
            </schmancy-code-preview>
          </schmancy-grid>
        </div>

        <!-- Input Types -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-6 block">Input Types</schmancy-typography>

          <schmancy-grid gap="lg" class="w-full mb-8">
            <schmancy-code-preview language="html">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Email -->
                <schmancy-input
                  label="Email"
                  type="email"
                  placeholder="user@example.com"
                  helper="Email validation built-in"
                  .value=${this.emailValue}
                  @input=${(e: Event) => this.emailValue = (e.target as any).value}
                >
                  <schmancy-icon slot="leading">email</schmancy-icon>
                </schmancy-input>

                <!-- Password -->
                <schmancy-input
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  helper="Min 8 characters"
                  .value=${this.passwordValue}
                  @input=${(e: Event) => this.passwordValue = (e.target as any).value}
                >
                  <schmancy-icon slot="leading">lock</schmancy-icon>
                </schmancy-input>

                <!-- Number -->
                <schmancy-input
                  label="Quantity"
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  helper="Between 0 and 100"
                  .value=${this.numberValue}
                  @input=${(e: Event) => this.numberValue = (e.target as any).value}
                >
                  <schmancy-icon slot="leading">numbers</schmancy-icon>
                </schmancy-input>

                <!-- Search -->
                <schmancy-input
                  label="Search"
                  type="search"
                  placeholder="Type to search..."
                  helper="Press enter to search"
                  .value=${this.searchValue}
                  @input=${(e: Event) => this.searchValue = (e.target as any).value}
                >
                  <schmancy-icon slot="leading">search</schmancy-icon>
                </schmancy-input>

                <!-- Telephone -->
                <schmancy-input
                  label="Phone"
                  type="tel"
                  placeholder="(555) 000-0000"
                  helper="US phone format"
                  .value=${this.telValue}
                  @input=${(e: Event) => this.telValue = (e.target as any).value}
                >
                  <schmancy-icon slot="leading">phone</schmancy-icon>
                </schmancy-input>

                <!-- URL -->
                <schmancy-input
                  label="Website"
                  type="url"
                  placeholder="https://example.com"
                  helper="Include https://"
                  .value=${this.urlValue}
                  @input=${(e: Event) => this.urlValue = (e.target as any).value}
                >
                  <schmancy-icon slot="leading">link</schmancy-icon>
                </schmancy-input>
              </div>
            </schmancy-code-preview>
          </schmancy-grid>
        </div>

        <!-- Textarea -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-6 block">Textarea</schmancy-typography>

          <schmancy-grid gap="lg" class="w-full mb-8">
            <schmancy-code-preview language="html">
              <div class="flex flex-col gap-4">
                <!-- Basic Textarea -->
                <schmancy-textarea
                  label="Comments"
                  placeholder="Enter your comments here..."
                  helper="Maximum 500 characters"
                  rows="4"
                  .value=${this.textareaValue}
                  @input=${(e: Event) => this.textareaValue = (e.target as any).value}
                ></schmancy-textarea>

                <!-- Filled Variant -->
                <schmancy-textarea
                  label="Description"
                  variant="filled"
                  placeholder="Describe your issue..."
                  helper="Please be as detailed as possible"
                  rows="6"
                ></schmancy-textarea>

                <!-- With Character Counter -->
                <schmancy-textarea
                  label="Bio"
                  placeholder="Tell us about yourself..."
                  helper=${`${this.textareaValue.length}/200 characters`}
                  maxlength="200"
                  rows="3"
                ></schmancy-textarea>
              </div>
            </schmancy-code-preview>
          </schmancy-grid>
        </div>

        <!-- Validation States -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-6 block">Validation & Error States</schmancy-typography>

          <schmancy-grid gap="lg" class="w-full mb-8">
            <schmancy-code-preview language="html">
              <div class="flex flex-col gap-4">
                <!-- Error State -->
                <schmancy-input
                  label="Username"
                  placeholder="Choose a username"
                  error
                  error-text="Username already taken"
                  .value=${this.errorValue}
                  @input=${(e: Event) => {
                    this.errorValue = (e.target as any).value;
                    this.showError = this.errorValue.length < 3;
                  }}
                >
                  <schmancy-icon slot="leading">person</schmancy-icon>
                </schmancy-input>

                <!-- Success State with Helper -->
                <schmancy-input
                  label="Verified Email"
                  type="email"
                  value="user@example.com"
                  helper="Email verified successfully"
                  readonly
                >
                  <schmancy-icon slot="leading">email</schmancy-icon>
                  <schmancy-icon slot="trailing" class="text-success">check_circle</schmancy-icon>
                </schmancy-input>

                <!-- Dynamic Validation -->
                <schmancy-input
                  label="Password"
                  type="password"
                  placeholder="Min 8 characters"
                  .error=${this.passwordValue.length > 0 && this.passwordValue.length < 8}
                  .error-text=${this.passwordValue.length > 0 && this.passwordValue.length < 8
                    ? 'Password must be at least 8 characters'
                    : ''}
                  .helper=${this.passwordValue.length >= 8
                    ? 'Password strength: Good'
                    : 'Enter a secure password'}
                >
                  <schmancy-icon slot="leading">lock</schmancy-icon>
                </schmancy-input>

                <!-- Pattern Validation -->
                <schmancy-input
                  label="ZIP Code"
                  pattern="[0-9]{5}"
                  placeholder="12345"
                  helper="5-digit US ZIP code"
                  error-text="Invalid ZIP code format"
                >
                  <schmancy-icon slot="leading">location_on</schmancy-icon>
                </schmancy-input>
              </div>
            </schmancy-code-preview>
          </schmancy-grid>
        </div>

        <!-- Advanced Features -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-6 block">Advanced Features</schmancy-typography>

          <schmancy-grid gap="lg" class="w-full mb-8">
            <schmancy-code-preview language="html">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- With Prefix/Suffix -->
                <schmancy-input
                  label="Price"
                  type="number"
                  placeholder="0.00"
                  prefix="$"
                  suffix="USD"
                  helper="Enter amount in USD"
                ></schmancy-input>

                <!-- With Max Length -->
                <schmancy-input
                  label="Tweet"
                  placeholder="What's happening?"
                  maxlength="280"
                  helper="Max 280 characters"
                ></schmancy-input>

                <!-- Auto-complete -->
                <schmancy-input
                  label="Country"
                  placeholder="Start typing..."
                  autocomplete="country"
                  list="countries"
                >
                  <schmancy-icon slot="leading">public</schmancy-icon>
                </schmancy-input>

                <!-- Read-only -->
                <schmancy-input
                  label="User ID"
                  value="USR-123456"
                  readonly
                  helper="Auto-generated ID"
                >
                  <schmancy-icon slot="leading">badge</schmancy-icon>
                </schmancy-input>

                <!-- With Clear Button -->
                <schmancy-input
                  label="Search"
                  placeholder="Type to search..."
                  .value=${this.searchValue}
                  @input=${(e: Event) => this.searchValue = (e.target as any).value}
                >
                  <schmancy-icon slot="leading">search</schmancy-icon>
                  ${this.searchValue ? html`
                    <schmancy-icon
                      slot="trailing"
                      @click=${() => this.searchValue = ''}
                      style="cursor: pointer"
                    >clear</schmancy-icon>
                  ` : ''}
                </schmancy-input>

                <!-- Date Input -->
                <schmancy-input
                  label="Date"
                  type="date"
                  helper="Select a date"
                >
                  <schmancy-icon slot="leading">calendar_today</schmancy-icon>
                </schmancy-input>
              </div>
            </schmancy-code-preview>
          </schmancy-grid>
        </div>

        <!-- Best Practices -->
        <schmancy-typography type="title" token="lg" class="mb-4 block">Best Practices</schmancy-typography>

        <schmancy-surface type="surfaceDim" class="rounded-lg p-6">
          <div class="flex flex-col gap-4">
            <div class="flex gap-2">
              <schmancy-icon class="text-primary">check_circle</schmancy-icon>
              <div>
                <schmancy-typography type="body" token="md" class="font-medium">
                  Use clear, descriptive labels
                </schmancy-typography>
                <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                  Labels should clearly indicate what information is required
                </schmancy-typography>
              </div>
            </div>

            <div class="flex gap-2">
              <schmancy-icon class="text-primary">check_circle</schmancy-icon>
              <div>
                <schmancy-typography type="body" token="md" class="font-medium">
                  Provide helpful placeholder text
                </schmancy-typography>
                <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                  Show examples of the expected format (e.g., "user@example.com")
                </schmancy-typography>
              </div>
            </div>

            <div class="flex gap-2">
              <schmancy-icon class="text-primary">check_circle</schmancy-icon>
              <div>
                <schmancy-typography type="body" token="md" class="font-medium">
                  Use helper text for additional context
                </schmancy-typography>
                <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                  Explain requirements, formats, or constraints
                </schmancy-typography>
              </div>
            </div>

            <div class="flex gap-2">
              <schmancy-icon class="text-primary">check_circle</schmancy-icon>
              <div>
                <schmancy-typography type="body" token="md" class="font-medium">
                  Show errors immediately after validation
                </schmancy-typography>
                <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                  Display specific error messages to help users correct mistakes
                </schmancy-typography>
              </div>
            </div>

            <div class="flex gap-2">
              <schmancy-icon class="text-primary">check_circle</schmancy-icon>
              <div>
                <schmancy-typography type="body" token="md" class="font-medium">
                  Use appropriate input types
                </schmancy-typography>
                <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                  Choose the right type (email, tel, number) for better mobile keyboards and validation
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
    'demo-forms-text-inputs': DemoFormsTextInputs;
  }
}