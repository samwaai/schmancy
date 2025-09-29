import { $LitElement } from '@mixins/index';
import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('demo-forms-selection')
export default class DemoFormsSelection extends $LitElement() {
  @state() private selectValue = 'option2';
  @state() private multiSelectValue: string[] = ['option1', 'option3'];
  @state() private radioValue = 'medium';
  @state() private checkboxValues = {
    terms: false,
    newsletter: true,
    notifications: false
  };
  @state() private switchValues = {
    darkMode: false,
    autoSave: true,
    notifications: false
  };

  render() {
    return html`
      <schmancy-surface class="p-8">
        <!-- Header -->
        <schmancy-typography type="display" token="lg" class="mb-4 block">
          Selection Controls
        </schmancy-typography>
        <schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
          Selection controls allow users to choose from a set of options using dropdowns, radio buttons, checkboxes, and switches.
        </schmancy-typography>

        <!-- Select Dropdowns -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-6 block">Select Dropdowns</schmancy-typography>

          <schmancy-grid gap="lg" class="w-full mb-8">
            <schmancy-code-preview language="html">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Basic Select -->
                <schmancy-select
                  label="Choose an option"
                  .value=${this.selectValue}
                  @change=${(e: Event) => this.selectValue = (e.target as any).value}
                >
                  <schmancy-option value="option1">Option 1</schmancy-option>
                  <schmancy-option value="option2">Option 2</schmancy-option>
                  <schmancy-option value="option3">Option 3</schmancy-option>
                  <schmancy-option value="option4">Option 4</schmancy-option>
                </schmancy-select>

                <!-- Filled Variant -->
                <schmancy-select
                  label="Country"
                  variant="filled"
                  value="us"
                  helper="Select your country"
                >
                  <schmancy-option value="">Choose...</schmancy-option>
                  <schmancy-option value="us">United States</schmancy-option>
                  <schmancy-option value="uk">United Kingdom</schmancy-option>
                  <schmancy-option value="ca">Canada</schmancy-option>
                  <schmancy-option value="au">Australia</schmancy-option>
                </schmancy-select>

                <!-- With Icons -->
                <schmancy-select
                  label="Payment Method"
                  value="card"
                >
                  <schmancy-option value="card">
                    <schmancy-icon slot="icon">credit_card</schmancy-icon>
                    Credit Card
                  </schmancy-option>
                  <schmancy-option value="paypal">
                    <schmancy-icon slot="icon">account_balance</schmancy-icon>
                    PayPal
                  </schmancy-option>
                  <schmancy-option value="bank">
                    <schmancy-icon slot="icon">account_balance</schmancy-icon>
                    Bank Transfer
                  </schmancy-option>
                </schmancy-select>

                <!-- Required Select -->
                <schmancy-select
                  label="Department"
                  required
                  helper="* Required field"
                >
                  <schmancy-option value="">Select department...</schmancy-option>
                  <schmancy-option value="sales">Sales</schmancy-option>
                  <schmancy-option value="marketing">Marketing</schmancy-option>
                  <schmancy-option value="engineering">Engineering</schmancy-option>
                  <schmancy-option value="hr">Human Resources</schmancy-option>
                </schmancy-select>

                <!-- Disabled Select -->
                <schmancy-select
                  label="Disabled Select"
                  value="locked"
                  disabled
                  helper="This field is disabled"
                >
                  <schmancy-option value="locked">Locked Value</schmancy-option>
                </schmancy-select>

                <!-- Error State -->
                <schmancy-select
                  label="Priority"
                  error
                  error-text="Please select a priority"
                >
                  <schmancy-option value="">Choose priority...</schmancy-option>
                  <schmancy-option value="low">Low</schmancy-option>
                  <schmancy-option value="medium">Medium</schmancy-option>
                  <schmancy-option value="high">High</schmancy-option>
                </schmancy-select>
              </div>
            </schmancy-code-preview>
          </schmancy-grid>
        </div>

        <!-- Radio Groups -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-6 block">Radio Groups</schmancy-typography>

          <schmancy-grid gap="lg" class="w-full mb-8">
            <schmancy-code-preview language="html">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Basic Radio Group -->
                <schmancy-radio-group
                  label="Size"
                  .value=${this.radioValue}
                  @change=${(e: Event) => this.radioValue = (e.target as any).value}
                >
                  <schmancy-radio value="small">Small</schmancy-radio>
                  <schmancy-radio value="medium">Medium</schmancy-radio>
                  <schmancy-radio value="large">Large</schmancy-radio>
                  <schmancy-radio value="xlarge">Extra Large</schmancy-radio>
                </schmancy-radio-group>

                <!-- Horizontal Layout -->
                <schmancy-radio-group
                  label="Shipping Speed"
                  orientation="horizontal"
                  value="standard"
                >
                  <schmancy-radio value="express">Express (2 days)</schmancy-radio>
                  <schmancy-radio value="standard">Standard (5-7 days)</schmancy-radio>
                  <schmancy-radio value="economy">Economy (10+ days)</schmancy-radio>
                </schmancy-radio-group>

                <!-- With Descriptions -->
                <schmancy-radio-group
                  label="Subscription Plan"
                  value="pro"
                >
                  <schmancy-radio value="free">
                    <div>
                      <div>Free</div>
                      <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                        Basic features for individuals
                      </schmancy-typography>
                    </div>
                  </schmancy-radio>
                  <schmancy-radio value="pro">
                    <div>
                      <div>Pro - $9.99/mo</div>
                      <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                        Advanced features for professionals
                      </schmancy-typography>
                    </div>
                  </schmancy-radio>
                  <schmancy-radio value="enterprise">
                    <div>
                      <div>Enterprise</div>
                      <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                        Custom solutions for teams
                      </schmancy-typography>
                    </div>
                  </schmancy-radio>
                </schmancy-radio-group>

                <!-- Required Radio Group -->
                <schmancy-radio-group
                  label="Gender"
                  required
                  helper="* Required for demographic data"
                >
                  <schmancy-radio value="male">Male</schmancy-radio>
                  <schmancy-radio value="female">Female</schmancy-radio>
                  <schmancy-radio value="other">Other</schmancy-radio>
                  <schmancy-radio value="prefer-not">Prefer not to say</schmancy-radio>
                </schmancy-radio-group>
              </div>
            </schmancy-code-preview>
          </schmancy-grid>
        </div>

        <!-- Checkboxes -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-6 block">Checkboxes</schmancy-typography>

          <schmancy-grid gap="lg" class="w-full mb-8">
            <schmancy-code-preview language="html">
              <div class="flex flex-col gap-4">
                <!-- Basic Checkbox -->
                <div class="flex items-center gap-2">
                  <schmancy-checkbox
                    .checked=${this.checkboxValues.terms}
                    @change=${(e: Event) => this.checkboxValues = {...this.checkboxValues, terms: (e.target as any).checked}}
                  ></schmancy-checkbox>
                  <schmancy-typography type="body" token="md">
                    I agree to the terms and conditions
                  </schmancy-typography>
                </div>

                <!-- Pre-checked -->
                <div class="flex items-center gap-2">
                  <schmancy-checkbox
                    .checked=${this.checkboxValues.newsletter}
                    @change=${(e: Event) => this.checkboxValues = {...this.checkboxValues, newsletter: (e.target as any).checked}}
                  ></schmancy-checkbox>
                  <schmancy-typography type="body" token="md">
                    Send me newsletter updates
                  </schmancy-typography>
                </div>

                <!-- Indeterminate State -->
                <div class="flex items-center gap-2">
                  <schmancy-checkbox indeterminate></schmancy-checkbox>
                  <schmancy-typography type="body" token="md">
                    Select all items (partial selection)
                  </schmancy-typography>
                </div>

                <!-- Disabled -->
                <div class="flex items-center gap-2">
                  <schmancy-checkbox disabled></schmancy-checkbox>
                  <schmancy-typography type="body" token="md" class="opacity-50">
                    This option is disabled
                  </schmancy-typography>
                </div>

                <!-- Disabled Checked -->
                <div class="flex items-center gap-2">
                  <schmancy-checkbox checked disabled></schmancy-checkbox>
                  <schmancy-typography type="body" token="md" class="opacity-50">
                    This option is locked as selected
                  </schmancy-typography>
                </div>

                <!-- Checkbox Group -->
                <div class="mt-4">
                  <schmancy-typography type="label" token="lg" class="mb-2 block">
                    Select your interests:
                  </schmancy-typography>
                  <div class="flex flex-col gap-2">
                    <div class="flex items-center gap-2">
                      <schmancy-checkbox></schmancy-checkbox>
                      <schmancy-typography type="body" token="md">Technology</schmancy-typography>
                    </div>
                    <div class="flex items-center gap-2">
                      <schmancy-checkbox></schmancy-checkbox>
                      <schmancy-typography type="body" token="md">Design</schmancy-typography>
                    </div>
                    <div class="flex items-center gap-2">
                      <schmancy-checkbox></schmancy-checkbox>
                      <schmancy-typography type="body" token="md">Business</schmancy-typography>
                    </div>
                    <div class="flex items-center gap-2">
                      <schmancy-checkbox></schmancy-checkbox>
                      <schmancy-typography type="body" token="md">Marketing</schmancy-typography>
                    </div>
                  </div>
                </div>
              </div>
            </schmancy-code-preview>
          </schmancy-grid>
        </div>

        <!-- Switches -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-6 block">Switches</schmancy-typography>

          <schmancy-grid gap="lg" class="w-full mb-8">
            <schmancy-code-preview language="html">
              <div class="flex flex-col gap-4">
                <!-- Basic Switch -->
                <div class="flex items-center justify-between p-4 bg-surface-container rounded-lg">
                  <div>
                    <schmancy-typography type="body" token="md" class="font-medium">
                      Dark Mode
                    </schmancy-typography>
                    <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                      Use dark theme across the application
                    </schmancy-typography>
                  </div>
                  <schmancy-switch
                    .checked=${this.switchValues.darkMode}
                    @change=${(e: Event) => this.switchValues = {...this.switchValues, darkMode: (e.target as any).checked}}
                  ></schmancy-switch>
                </div>

                <!-- Pre-checked Switch -->
                <div class="flex items-center justify-between p-4 bg-surface-container rounded-lg">
                  <div>
                    <schmancy-typography type="body" token="md" class="font-medium">
                      Auto-save
                    </schmancy-typography>
                    <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                      Automatically save changes
                    </schmancy-typography>
                  </div>
                  <schmancy-switch
                    .checked=${this.switchValues.autoSave}
                    @change=${(e: Event) => this.switchValues = {...this.switchValues, autoSave: (e.target as any).checked}}
                  ></schmancy-switch>
                </div>

                <!-- With Icons -->
                <div class="flex items-center justify-between p-4 bg-surface-container rounded-lg">
                  <div class="flex items-center gap-3">
                    <schmancy-icon>notifications</schmancy-icon>
                    <div>
                      <schmancy-typography type="body" token="md" class="font-medium">
                        Push Notifications
                      </schmancy-typography>
                      <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                        Receive push notifications
                      </schmancy-typography>
                    </div>
                  </div>
                  <schmancy-switch
                    .checked=${this.switchValues.notifications}
                    @change=${(e: Event) => this.switchValues = {...this.switchValues, notifications: (e.target as any).checked}}
                  ></schmancy-switch>
                </div>

                <!-- Disabled Switch -->
                <div class="flex items-center justify-between p-4 bg-surface-container rounded-lg opacity-50">
                  <div>
                    <schmancy-typography type="body" token="md" class="font-medium">
                      Advanced Settings
                    </schmancy-typography>
                    <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                      Requires admin permissions
                    </schmancy-typography>
                  </div>
                  <schmancy-switch disabled></schmancy-switch>
                </div>
              </div>
            </schmancy-code-preview>
          </schmancy-grid>
        </div>

        <!-- Selection States Summary -->
        <schmancy-typography type="title" token="lg" class="mb-4 block">Current Selections</schmancy-typography>

        <schmancy-surface type="surfaceDim" class="rounded-lg p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <schmancy-typography type="label" token="md" class="mb-2 block">Select Value:</schmancy-typography>
              <code class="bg-primary-container text-primary-onContainer px-2 py-1 rounded">
                ${this.selectValue || 'none'}
              </code>
            </div>
            <div>
              <schmancy-typography type="label" token="md" class="mb-2 block">Radio Value:</schmancy-typography>
              <code class="bg-primary-container text-primary-onContainer px-2 py-1 rounded">
                ${this.radioValue || 'none'}
              </code>
            </div>
            <div>
              <schmancy-typography type="label" token="md" class="mb-2 block">Checkbox Values:</schmancy-typography>
              <code class="bg-primary-container text-primary-onContainer px-2 py-1 rounded">
                ${JSON.stringify(this.checkboxValues, null, 2)}
              </code>
            </div>
            <div>
              <schmancy-typography type="label" token="md" class="mb-2 block">Switch Values:</schmancy-typography>
              <code class="bg-primary-container text-primary-onContainer px-2 py-1 rounded">
                ${JSON.stringify(this.switchValues, null, 2)}
              </code>
            </div>
          </div>
        </schmancy-surface>
      </schmancy-surface>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-forms-selection': DemoFormsSelection;
  }
}