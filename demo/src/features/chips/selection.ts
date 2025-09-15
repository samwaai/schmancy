import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

@customElement('demo-chips-selection')
export class DemoChipsSelection extends $LitElement() {
  @state() private singleSelection = 'medium';
  @state() private multipleSelection = ['react', 'typescript'];
  @state() private selectedSize = 'md';
  @state() private selectedColors = ['blue', 'green'];
  @state() private selectedDays = ['mon', 'wed', 'fri'];
  @state() private selectedPriority = 'high';

  render() {
    return html`
      <schmancy-surface class="p-8">
        <!-- Header -->
        <schmancy-typography type="display" token="lg" class="mb-4 block">
          Chip Selection Patterns
        </schmancy-typography>
        <schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
          Chips can be used for single or multiple selections. The schmancy-chips container
          manages selection state and provides consistent behavior.
        </schmancy-typography>

        <!-- API Reference -->
        <schmancy-typography type="title" token="lg" class="mb-4 block">schmancy-chips Container API</schmancy-typography>

        <schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden mb-12">
          <table class="w-full">
            <thead class="bg-surface-container">
              <tr>
                <th class="text-left p-4">
                  <schmancy-typography type="label" token="md">Property</schmancy-typography>
                </th>
                <th class="text-left p-4">
                  <schmancy-typography type="label" token="md">Type</schmancy-typography>
                </th>
                <th class="text-left p-4">
                  <schmancy-typography type="label" token="md">Default</schmancy-typography>
                </th>
                <th class="text-left p-4">
                  <schmancy-typography type="label" token="md">Description</schmancy-typography>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-outline">
                <td class="p-4">
                  <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">multi</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">boolean</schmancy-typography>
                </td>
                <td class="p-4">
                  <code class="text-sm">false</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">Enable multiple selection</schmancy-typography>
                </td>
              </tr>
              <tr class="border-t border-outline">
                <td class="p-4">
                  <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">value</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">string</schmancy-typography>
                </td>
                <td class="p-4">
                  <code class="text-sm">''</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">Selected value (single selection)</schmancy-typography>
                </td>
              </tr>
              <tr class="border-t border-outline">
                <td class="p-4">
                  <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">values</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">string[]</schmancy-typography>
                </td>
                <td class="p-4">
                  <code class="text-sm">[]</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">Selected values (multiple selection)</schmancy-typography>
                </td>
              </tr>
              <tr class="border-t border-outline">
                <td class="p-4">
                  <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">wrap</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">boolean</schmancy-typography>
                </td>
                <td class="p-4">
                  <code class="text-sm">true</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">Whether chips wrap to new lines</schmancy-typography>
                </td>
              </tr>
            </tbody>
          </table>
        </schmancy-surface>

        <!-- Events -->
        <schmancy-typography type="title" token="lg" class="mb-4 block">Events</schmancy-typography>

        <schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden mb-12">
          <table class="w-full">
            <thead class="bg-surface-container">
              <tr>
                <th class="text-left p-4">
                  <schmancy-typography type="label" token="md">Event</schmancy-typography>
                </th>
                <th class="text-left p-4">
                  <schmancy-typography type="label" token="md">Detail</schmancy-typography>
                </th>
                <th class="text-left p-4">
                  <schmancy-typography type="label" token="md">Description</schmancy-typography>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-outline">
                <td class="p-4">
                  <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">@change</code>
                </td>
                <td class="p-4">
                  <code class="text-sm">string | string[]</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">Fires when selection changes</schmancy-typography>
                </td>
              </tr>
            </tbody>
          </table>
        </schmancy-surface>

        <!-- Examples -->
        <schmancy-typography type="title" token="lg" class="mb-6 block">Examples</schmancy-typography>

        <schmancy-grid gap="lg" class="w-full">
          <!-- Single Selection -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Single Selection (Radio-like behavior)
              </schmancy-typography>
              <schmancy-chips
                .value="${this.singleSelection}"
                @change="${(e: CustomEvent) => this.singleSelection = e.detail}"
              >
                <schmancy-chip value="small">Small</schmancy-chip>
                <schmancy-chip value="medium">Medium</schmancy-chip>
                <schmancy-chip value="large">Large</schmancy-chip>
                <schmancy-chip value="extra-large">Extra Large</schmancy-chip>
              </schmancy-chips>
              <schmancy-typography type="body" token="xs" class="text-surface-onVariant">
                Selected: ${this.singleSelection}
              </schmancy-typography>
            </div>
          </schmancy-code-preview>

          <!-- Multiple Selection -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Multiple Selection (Checkbox-like behavior)
              </schmancy-typography>
              <schmancy-chips
                multi
                .values="${this.multipleSelection}"
                @change="${(e: CustomEvent) => this.multipleSelection = e.detail}"
              >
                <schmancy-chip value="javascript">JavaScript</schmancy-chip>
                <schmancy-chip value="typescript">TypeScript</schmancy-chip>
                <schmancy-chip value="react">React</schmancy-chip>
                <schmancy-chip value="vue">Vue</schmancy-chip>
                <schmancy-chip value="angular">Angular</schmancy-chip>
              </schmancy-chips>
              <schmancy-typography type="body" token="xs" class="text-surface-onVariant">
                Selected: ${this.multipleSelection.join(', ') || 'none'}
              </schmancy-typography>
            </div>
          </schmancy-code-preview>

          <!-- Size Selector with Icons -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                T-Shirt Size
              </schmancy-typography>
              <schmancy-chips
                .value="${this.selectedSize}"
                @change="${(e: CustomEvent) => this.selectedSize = e.detail}"
              >
                <schmancy-chip value="xs">
                  <schmancy-icon slot="icon">straighten</schmancy-icon>
                  XS
                </schmancy-chip>
                <schmancy-chip value="sm">
                  <schmancy-icon slot="icon">straighten</schmancy-icon>
                  Small
                </schmancy-chip>
                <schmancy-chip value="md">
                  <schmancy-icon slot="icon">straighten</schmancy-icon>
                  Medium
                </schmancy-chip>
                <schmancy-chip value="lg">
                  <schmancy-icon slot="icon">straighten</schmancy-icon>
                  Large
                </schmancy-chip>
                <schmancy-chip value="xl">
                  <schmancy-icon slot="icon">straighten</schmancy-icon>
                  XL
                </schmancy-chip>
              </schmancy-chips>
            </div>
          </schmancy-code-preview>

          <!-- Color Selection -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Color Options (Multiple)
              </schmancy-typography>
              <schmancy-chips
                multi
                .values="${this.selectedColors}"
                @change="${(e: CustomEvent) => this.selectedColors = e.detail}"
              >
                <schmancy-chip value="red">
                  <span slot="icon" class="w-4 h-4 rounded-full bg-red-500"></span>
                  Red
                </schmancy-chip>
                <schmancy-chip value="blue">
                  <span slot="icon" class="w-4 h-4 rounded-full bg-blue-500"></span>
                  Blue
                </schmancy-chip>
                <schmancy-chip value="green">
                  <span slot="icon" class="w-4 h-4 rounded-full bg-green-500"></span>
                  Green
                </schmancy-chip>
                <schmancy-chip value="yellow">
                  <span slot="icon" class="w-4 h-4 rounded-full bg-yellow-500"></span>
                  Yellow
                </schmancy-chip>
                <schmancy-chip value="purple">
                  <span slot="icon" class="w-4 h-4 rounded-full bg-purple-500"></span>
                  Purple
                </schmancy-chip>
              </schmancy-chips>
              <schmancy-typography type="body" token="xs" class="text-surface-onVariant">
                ${this.selectedColors.length} color(s) selected
              </schmancy-typography>
            </div>
          </schmancy-code-preview>

          <!-- Day Selection -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Recurring Days
              </schmancy-typography>
              <schmancy-chips
                multi
                .values="${this.selectedDays}"
                @change="${(e: CustomEvent) => this.selectedDays = e.detail}"
              >
                <schmancy-chip value="mon">Mon</schmancy-chip>
                <schmancy-chip value="tue">Tue</schmancy-chip>
                <schmancy-chip value="wed">Wed</schmancy-chip>
                <schmancy-chip value="thu">Thu</schmancy-chip>
                <schmancy-chip value="fri">Fri</schmancy-chip>
                <schmancy-chip value="sat">Sat</schmancy-chip>
                <schmancy-chip value="sun">Sun</schmancy-chip>
              </schmancy-chips>
            </div>
          </schmancy-code-preview>

          <!-- Priority Selection with Elevated -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Priority Level
              </schmancy-typography>
              <schmancy-chips
                .value="${this.selectedPriority}"
                @change="${(e: CustomEvent) => this.selectedPriority = e.detail}"
              >
                <schmancy-chip value="low">
                  <schmancy-icon slot="icon">arrow_downward</schmancy-icon>
                  Low
                </schmancy-chip>
                <schmancy-chip value="medium">
                  <schmancy-icon slot="icon">remove</schmancy-icon>
                  Medium
                </schmancy-chip>
                <schmancy-chip value="high" elevated>
                  <schmancy-icon slot="icon">arrow_upward</schmancy-icon>
                  High
                </schmancy-chip>
                <schmancy-chip value="urgent" elevated>
                  <schmancy-icon slot="icon">priority_high</schmancy-icon>
                  Urgent
                </schmancy-chip>
              </schmancy-chips>
            </div>
          </schmancy-code-preview>

          <!-- Non-Wrapping Horizontal Scroll -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Horizontal Scrolling (No Wrap)
              </schmancy-typography>
              <div class="overflow-x-auto">
                <schmancy-chips wrap="false" .value="${'jan'}">
                  <schmancy-chip value="jan">January</schmancy-chip>
                  <schmancy-chip value="feb">February</schmancy-chip>
                  <schmancy-chip value="mar">March</schmancy-chip>
                  <schmancy-chip value="apr">April</schmancy-chip>
                  <schmancy-chip value="may">May</schmancy-chip>
                  <schmancy-chip value="jun">June</schmancy-chip>
                  <schmancy-chip value="jul">July</schmancy-chip>
                  <schmancy-chip value="aug">August</schmancy-chip>
                  <schmancy-chip value="sep">September</schmancy-chip>
                  <schmancy-chip value="oct">October</schmancy-chip>
                  <schmancy-chip value="nov">November</schmancy-chip>
                  <schmancy-chip value="dec">December</schmancy-chip>
                </schmancy-chips>
              </div>
            </div>
          </schmancy-code-preview>

          <!-- Real-World Example: Product Configurator -->
          <schmancy-code-preview language="html">
            <schmancy-card>
              <div class="p-6 space-y-6">
                <schmancy-typography type="title" token="md" class="block">
                  Configure Your Product
                </schmancy-typography>

                <!-- Size -->
                <div>
                  <schmancy-typography type="label" token="sm" class="block mb-2 text-surface-onVariant">
                    Size
                  </schmancy-typography>
                  <schmancy-chips .value="${'medium'}">
                    <schmancy-chip value="small">S</schmancy-chip>
                    <schmancy-chip value="medium">M</schmancy-chip>
                    <schmancy-chip value="large">L</schmancy-chip>
                    <schmancy-chip value="x-large">XL</schmancy-chip>
                    <schmancy-chip value="xx-large">XXL</schmancy-chip>
                  </schmancy-chips>
                </div>

                <!-- Color -->
                <div>
                  <schmancy-typography type="label" token="sm" class="block mb-2 text-surface-onVariant">
                    Color
                  </schmancy-typography>
                  <schmancy-chips .value="${'black'}">
                    <schmancy-chip value="black">
                      <span slot="icon" class="w-4 h-4 rounded-full bg-black"></span>
                      Black
                    </schmancy-chip>
                    <schmancy-chip value="white">
                      <span slot="icon" class="w-4 h-4 rounded-full bg-white border border-outline"></span>
                      White
                    </schmancy-chip>
                    <schmancy-chip value="navy">
                      <span slot="icon" class="w-4 h-4 rounded-full bg-blue-900"></span>
                      Navy
                    </schmancy-chip>
                    <schmancy-chip value="gray">
                      <span slot="icon" class="w-4 h-4 rounded-full bg-gray-500"></span>
                      Gray
                    </schmancy-chip>
                  </schmancy-chips>
                </div>

                <!-- Features -->
                <div>
                  <schmancy-typography type="label" token="sm" class="block mb-2 text-surface-onVariant">
                    Additional Features
                  </schmancy-typography>
                  <schmancy-chips multi .values="${['warranty']}">
                    <schmancy-chip value="gift-wrap">
                      <schmancy-icon slot="icon">card_giftcard</schmancy-icon>
                      Gift Wrap (+$5)
                    </schmancy-chip>
                    <schmancy-chip value="express">
                      <schmancy-icon slot="icon">local_shipping</schmancy-icon>
                      Express Shipping (+$10)
                    </schmancy-chip>
                    <schmancy-chip value="warranty">
                      <schmancy-icon slot="icon">shield</schmancy-icon>
                      Extended Warranty (+$25)
                    </schmancy-chip>
                  </schmancy-chips>
                </div>

                <schmancy-divider></schmancy-divider>

                <div class="flex justify-between items-center">
                  <schmancy-typography type="headline" token="sm">
                    Total: $89.25
                  </schmancy-typography>
                  <schmancy-button variant="filled">
                    Add to Cart
                  </schmancy-button>
                </div>
              </div>
            </schmancy-card>
          </schmancy-code-preview>

          <!-- Real-World Example: Survey Form -->
          <schmancy-code-preview language="html">
            <schmancy-card>
              <div class="p-6 space-y-6">
                <schmancy-typography type="title" token="md" class="block">
                  Quick Survey
                </schmancy-typography>

                <!-- Question 1 -->
                <div>
                  <schmancy-typography type="body" token="md" class="block mb-3">
                    How satisfied are you with our service?
                  </schmancy-typography>
                  <schmancy-chips .value="${'satisfied'}">
                    <schmancy-chip value="very-dissatisfied">
                      <schmancy-icon slot="icon">sentiment_very_dissatisfied</schmancy-icon>
                      Very Dissatisfied
                    </schmancy-chip>
                    <schmancy-chip value="dissatisfied">
                      <schmancy-icon slot="icon">sentiment_dissatisfied</schmancy-icon>
                      Dissatisfied
                    </schmancy-chip>
                    <schmancy-chip value="neutral">
                      <schmancy-icon slot="icon">sentiment_neutral</schmancy-icon>
                      Neutral
                    </schmancy-chip>
                    <schmancy-chip value="satisfied">
                      <schmancy-icon slot="icon">sentiment_satisfied</schmancy-icon>
                      Satisfied
                    </schmancy-chip>
                    <schmancy-chip value="very-satisfied">
                      <schmancy-icon slot="icon">sentiment_very_satisfied</schmancy-icon>
                      Very Satisfied
                    </schmancy-chip>
                  </schmancy-chips>
                </div>

                <!-- Question 2 -->
                <div>
                  <schmancy-typography type="body" token="md" class="block mb-3">
                    Which features do you use? (Select all that apply)
                  </schmancy-typography>
                  <schmancy-chips multi .values="${['dashboard', 'reports']}">
                    <schmancy-chip value="dashboard">Dashboard</schmancy-chip>
                    <schmancy-chip value="reports">Reports</schmancy-chip>
                    <schmancy-chip value="analytics">Analytics</schmancy-chip>
                    <schmancy-chip value="api">API</schmancy-chip>
                    <schmancy-chip value="integrations">Integrations</schmancy-chip>
                    <schmancy-chip value="mobile">Mobile App</schmancy-chip>
                  </schmancy-chips>
                </div>

                <!-- Question 3 -->
                <div>
                  <schmancy-typography type="body" token="md" class="block mb-3">
                    How often do you use our product?
                  </schmancy-typography>
                  <schmancy-chips .value="${'weekly'}">
                    <schmancy-chip value="daily">Daily</schmancy-chip>
                    <schmancy-chip value="weekly">Weekly</schmancy-chip>
                    <schmancy-chip value="monthly">Monthly</schmancy-chip>
                    <schmancy-chip value="rarely">Rarely</schmancy-chip>
                  </schmancy-chips>
                </div>

                <schmancy-button variant="filled" class="w-full">
                  Submit Survey
                </schmancy-button>
              </div>
            </schmancy-card>
          </schmancy-code-preview>

          <!-- Programmatic Control -->
          <schmancy-code-preview language="javascript">
            // Managing chip selection programmatically
            const chipsContainer = document.querySelector('schmancy-chips');

            // Single selection
            chipsContainer.multi = false;
            chipsContainer.value = 'option1';

            // Multiple selection
            chipsContainer.multi = true;
            chipsContainer.values = ['option1', 'option2'];

            // Listen to changes
            chipsContainer.addEventListener('change', (event) => {
              if (chipsContainer.multi) {
                console.log('Selected values:', event.detail); // array
              } else {
                console.log('Selected value:', event.detail); // string
              }
            });

            // Programmatically update selection
            function selectAll() {
              const allValues = Array.from(chipsContainer.querySelectorAll('schmancy-chip'))
                .map(chip => chip.value);
              chipsContainer.values = allValues;
            }

            function clearSelection() {
              if (chipsContainer.multi) {
                chipsContainer.values = [];
              } else {
                chipsContainer.value = '';
              }
            }
          </schmancy-code-preview>
        </schmancy-grid>
      </schmancy-surface>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-chips-selection': DemoChipsSelection;
  }
}