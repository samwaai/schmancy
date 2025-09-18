import { $LitElement } from '@mixins/index';
import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../../shared/installation-section';

@customElement('demo-forms-overview')
export class DemoFormsOverview extends $LitElement(css`
  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .principle-card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`) {
  @state() private sampleEmail = '';
  @state() private samplePassword = '';

  render() {
    return html`
      <schmancy-surface class="p-8">
        <!-- Header -->
        <schmancy-typography type="display" token="lg" class="mb-4 block">
          Forms Overview
        </schmancy-typography>
        <schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
          Build beautiful, accessible forms with Material Design 3 components. Schmancy provides a comprehensive
          suite of form controls that handle validation, user interaction, and accessibility out of the box.
        </schmancy-typography>

        <!-- Installation -->
        <installation-section></installation-section>

        <!-- Import -->
        <div class="mb-8">
          <schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
          <schmancy-code-preview language="javascript">
            // Text input components
            import '@mhmo91/schmancy/input'
            import '@mhmo91/schmancy/textarea'

            // Selection components
            import '@mhmo91/schmancy/select'
            import '@mhmo91/schmancy/option'
            import '@mhmo91/schmancy/radio-group'
            import '@mhmo91/schmancy/radio'
            import '@mhmo91/schmancy/checkbox'

            // Form utilities
            import '@mhmo91/schmancy/form'
            import '@mhmo91/schmancy/form-field'
          </schmancy-code-preview>
        </div>

        <!-- Design Principles -->
        <schmancy-typography type="title" token="lg" class="mb-6 block">Design Principles</schmancy-typography>

        <div class="form-grid mb-12">
          <!-- Clarity -->
          <schmancy-surface type="surfaceDim" class="rounded-lg p-6">
            <div class="principle-card">
              <schmancy-icon class="text-primary mb-2" size="lg">visibility</schmancy-icon>
              <schmancy-typography type="headline" token="sm" class="block">
                Clear & Intuitive
              </schmancy-typography>
              <schmancy-typography type="body" token="sm" class="text-surface-onVariant block">
                Labels, helper text, and error messages guide users through form completion with clear visual hierarchy.
              </schmancy-typography>
            </div>
          </schmancy-surface>

          <!-- Validation -->
          <schmancy-surface type="surfaceDim" class="rounded-lg p-6">
            <div class="principle-card">
              <schmancy-icon class="text-primary mb-2" size="lg">fact_check</schmancy-icon>
              <schmancy-typography type="headline" token="sm" class="block">
                Real-time Validation
              </schmancy-typography>
              <schmancy-typography type="body" token="sm" class="text-surface-onVariant block">
                Provide immediate feedback on user input with built-in validation states and error messaging.
              </schmancy-typography>
            </div>
          </schmancy-surface>

          <!-- Accessibility -->
          <schmancy-surface type="surfaceDim" class="rounded-lg p-6">
            <div class="principle-card">
              <schmancy-icon class="text-primary mb-2" size="lg">accessibility</schmancy-icon>
              <schmancy-typography type="headline" token="sm" class="block">
                Fully Accessible
              </schmancy-typography>
              <schmancy-typography type="body" token="sm" class="text-surface-onVariant block">
                ARIA labels, keyboard navigation, and screen reader support ensure forms work for everyone.
              </schmancy-typography>
            </div>
          </schmancy-surface>

          <!-- Responsive -->
          <schmancy-surface type="surfaceDim" class="rounded-lg p-6">
            <div class="principle-card">
              <schmancy-icon class="text-primary mb-2" size="lg">devices</schmancy-icon>
              <schmancy-typography type="headline" token="sm" class="block">
                Responsive Design
              </schmancy-typography>
              <schmancy-typography type="body" token="sm" class="text-surface-onVariant block">
                Forms adapt seamlessly to different screen sizes with touch-friendly targets on mobile.
              </schmancy-typography>
            </div>
          </schmancy-surface>
        </div>

        <!-- Component Categories -->
        <schmancy-typography type="title" token="lg" class="mb-6 block">Component Categories</schmancy-typography>

        <!-- Text Inputs -->
        <schmancy-surface type="surfaceDim" class="rounded-lg p-6 mb-4">
          <schmancy-typography type="headline" token="sm" class="mb-4 block">
            Text Input Components
          </schmancy-typography>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <schmancy-input
                label="Email"
                type="email"
                placeholder="Enter your email"
                helper="We'll never share your email"
                .value=${this.sampleEmail}
                @input=${(e: Event) => this.sampleEmail = (e.target as any).value}
              ></schmancy-input>
            </div>
            <div>
              <schmancy-input
                label="Password"
                type="password"
                placeholder="Enter password"
                helper="Must be at least 8 characters"
                .value=${this.samplePassword}
                @input=${(e: Event) => this.samplePassword = (e.target as any).value}
              ></schmancy-input>
            </div>
          </div>
        </schmancy-surface>

        <!-- Selection Controls -->
        <schmancy-surface type="surfaceDim" class="rounded-lg p-6 mb-4">
          <schmancy-typography type="headline" token="sm" class="mb-4 block">
            Selection Controls
          </schmancy-typography>
          <div class="flex flex-wrap gap-6">
            <schmancy-select label="Country" value="us">
              <schmancy-option value="us">United States</schmancy-option>
              <schmancy-option value="uk">United Kingdom</schmancy-option>
              <schmancy-option value="ca">Canada</schmancy-option>
            </schmancy-select>

            <schmancy-radio-group label="Plan" value="pro">
              <schmancy-radio value="free">Free</schmancy-radio>
              <schmancy-radio value="pro">Pro</schmancy-radio>
              <schmancy-radio value="enterprise">Enterprise</schmancy-radio>
            </schmancy-radio-group>

            <div class="flex items-center gap-2">
              <schmancy-checkbox checked></schmancy-checkbox>
              <schmancy-typography type="body" token="md">Accept terms</schmancy-typography>
            </div>
          </div>
        </schmancy-surface>

        <!-- Form States -->
        <schmancy-typography type="title" token="lg" class="mb-4 block">Form States</schmancy-typography>

        <schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden mb-12">
          <table class="w-full">
            <thead class="bg-surface-container">
              <tr>
                <th class="text-left p-4">
                  <schmancy-typography type="label" token="md">State</schmancy-typography>
                </th>
                <th class="text-left p-4">
                  <schmancy-typography type="label" token="md">Description</schmancy-typography>
                </th>
                <th class="text-left p-4">
                  <schmancy-typography type="label" token="md">Visual Indicator</schmancy-typography>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-outline">
                <td class="p-4">
                  <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">default</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">Normal input state</schmancy-typography>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">Outline border, regular label</schmancy-typography>
                </td>
              </tr>
              <tr class="border-t border-outline">
                <td class="p-4">
                  <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">focused</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">Input has focus</schmancy-typography>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">Primary color border, elevated label</schmancy-typography>
                </td>
              </tr>
              <tr class="border-t border-outline">
                <td class="p-4">
                  <code class="text-sm bg-error-container text-error-onContainer px-2 py-1 rounded">error</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">Validation failed</schmancy-typography>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">Error color, error message shown</schmancy-typography>
                </td>
              </tr>
              <tr class="border-t border-outline">
                <td class="p-4">
                  <code class="text-sm bg-surface-containerLow px-2 py-1 rounded">disabled</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">Input is disabled</schmancy-typography>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">Reduced opacity, no interaction</schmancy-typography>
                </td>
              </tr>
              <tr class="border-t border-outline">
                <td class="p-4">
                  <code class="text-sm bg-surface-containerLow px-2 py-1 rounded">readonly</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">Value cannot be edited</schmancy-typography>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">No text cursor, value selectable</schmancy-typography>
                </td>
              </tr>
            </tbody>
          </table>
        </schmancy-surface>

        <!-- Quick Start Example -->
        <schmancy-typography type="title" token="lg" class="mb-6 block">Quick Start</schmancy-typography>

        <schmancy-grid gap="lg" class="w-full">
          <schmancy-code-preview language="html">
            <schmancy-form>
              <div class="flex flex-col gap-4">
                <!-- Text Input -->
                <schmancy-input
                  label="Full Name"
                  required
                  helper="Enter your full name"
                ></schmancy-input>

                <!-- Email with Validation -->
                <schmancy-input
                  label="Email"
                  type="email"
                  required
                  error-text="Please enter a valid email"
                ></schmancy-input>

                <!-- Select Dropdown -->
                <schmancy-select label="Country" required>
                  <schmancy-option value="">Choose a country</schmancy-option>
                  <schmancy-option value="us">United States</schmancy-option>
                  <schmancy-option value="uk">United Kingdom</schmancy-option>
                  <schmancy-option value="ca">Canada</schmancy-option>
                </schmancy-select>

                <!-- Radio Group -->
                <schmancy-radio-group label="Subscription Plan">
                  <schmancy-radio value="monthly">Monthly - $9.99</schmancy-radio>
                  <schmancy-radio value="yearly">Yearly - $99.99 (Save 17%)</schmancy-radio>
                </schmancy-radio-group>

                <!-- Checkbox -->
                <div class="flex items-center gap-2">
                  <schmancy-checkbox required></schmancy-checkbox>
                  <schmancy-typography type="body" token="md">
                    I agree to the terms and conditions
                  </schmancy-typography>
                </div>

                <!-- Submit Button -->
                <schmancy-button type="submit" variant="filled">
                  Submit Form
                </schmancy-button>
              </div>
            </schmancy-form>
          </schmancy-code-preview>
        </schmancy-grid>
      </schmancy-surface>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-forms-overview': DemoFormsOverview;
  }
}