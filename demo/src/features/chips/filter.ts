import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

@customElement('demo-chips-filter')
export class DemoChipsFilter extends $LitElement() {
  @state() private selectedActivities: string[] = ['running'];
  @state() private selectedPrice: string = 'mid';
  @state() private selectedFeatures: string[] = ['wifi', 'parking'];
  @state() private selectedSize: string = 'md';
  @state() private selectedColors: string[] = [];

  render() {
    return html`
      <schmancy-surface class="p-8">
        <!-- Header -->
        <schmancy-typography type="display" token="lg" class="mb-4 block">
          Filter Chips
        </schmancy-typography>
        <schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
          Filter chips allow users to select multiple options from a set. They toggle between
          selected and unselected states and are commonly used for filtering content or applying criteria.
        </schmancy-typography>

        <!-- API Reference -->
        <schmancy-typography type="title" token="lg" class="mb-4 block">API Reference</schmancy-typography>

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
                  <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">value</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">string</schmancy-typography>
                </td>
                <td class="p-4">
                  <code class="text-sm">''</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">The value identifier for selection (managed by parent container)</schmancy-typography>
                </td>
              </tr>
              <tr class="border-t border-outline">
                <td class="p-4">
                  <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">elevated</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">boolean</schmancy-typography>
                </td>
                <td class="p-4">
                  <code class="text-sm">false</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">Add elevation shadow</schmancy-typography>
                </td>
              </tr>
              <tr class="border-t border-outline">
                <td class="p-4">
                  <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">disabled</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">boolean</schmancy-typography>
                </td>
                <td class="p-4">
                  <code class="text-sm">false</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">Disable the chip</schmancy-typography>
                </td>
              </tr>
              <tr class="border-t border-outline">
                <td class="p-4">
                  <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">label</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">string</schmancy-typography>
                </td>
                <td class="p-4">
                  <code class="text-sm">''</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">Text label</schmancy-typography>
                </td>
              </tr>
            </tbody>
          </table>
        </schmancy-surface>

        <!-- Examples -->
        <schmancy-typography type="title" token="lg" class="mb-6 block">Examples</schmancy-typography>

        <schmancy-grid gap="lg" class="w-full">
          <!-- Basic Filter Chips -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Basic Filter Selection
              </schmancy-typography>
              <!-- Note: Container manages selection state -->
              <schmancy-chips .wrap=${true} .values=${['selected1', 'selected2']}>
                <schmancy-filter-chip value="selected1">Selected</schmancy-filter-chip>
                <schmancy-filter-chip value="unselected">Unselected</schmancy-filter-chip>
                <schmancy-filter-chip value="selected2" elevated>Elevated Selected</schmancy-filter-chip>
                <schmancy-filter-chip value="disabled1" disabled>Disabled</schmancy-filter-chip>
                <schmancy-filter-chip value="disabled2" disabled>Disabled Selected</schmancy-filter-chip>
              </schmancy-chips>
            </div>
          </schmancy-code-preview>

          <!-- Activity Filters -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Activity Types
              </schmancy-typography>
              <schmancy-chips
                .values=${this.selectedActivities}
                @change=${(e: CustomEvent) => this.selectedActivities = e.detail}
              >
                <schmancy-filter-chip value="running">
                  <schmancy-icon slot="icon">directions_run</schmancy-icon>
                  Running
                </schmancy-filter-chip>
                <schmancy-filter-chip value="walking">
                  <schmancy-icon slot="icon">directions_walk</schmancy-icon>
                  Walking
                </schmancy-filter-chip>
                <schmancy-filter-chip value="cycling">
                  <schmancy-icon slot="icon">directions_bike</schmancy-icon>
                  Cycling
                </schmancy-filter-chip>
                <schmancy-filter-chip value="swimming">
                  <schmancy-icon slot="icon">pool</schmancy-icon>
                  Swimming
                </schmancy-filter-chip>
              </schmancy-chips>
              <schmancy-typography type="body" token="xs" class="text-surface-onVariant">
                Selected: ${this.selectedActivities.join(', ') || 'none'}
              </schmancy-typography>
            </div>
          </schmancy-code-preview>

          <!-- Price Range Filters -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Price Range (Single Selection)
              </schmancy-typography>
              <schmancy-chips
                  .value=${this.selectedPrice}
                @change=${(e: CustomEvent) => this.selectedPrice = e.detail}
              >
                <schmancy-filter-chip value="low">
                  $0-50
                </schmancy-filter-chip>
                <schmancy-filter-chip value="mid">
                  $50-100
                </schmancy-filter-chip>
                <schmancy-filter-chip value="high">
                  $100-200
                </schmancy-filter-chip>
                <schmancy-filter-chip value="premium" elevated>
                  <schmancy-icon slot="icon">star</schmancy-icon>
                  $200+
                </schmancy-filter-chip>
              </schmancy-chips>
            </div>
          </schmancy-code-preview>

          <!-- Feature Filters with Icons -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Hotel Features
              </schmancy-typography>
              <schmancy-chips
                .values=${this.selectedFeatures}
                @change=${(e: CustomEvent) => this.selectedFeatures = e.detail}
              >
                <schmancy-filter-chip value="wifi">
                  <schmancy-icon slot="icon">wifi</schmancy-icon>
                  Free WiFi
                </schmancy-filter-chip>
                <schmancy-filter-chip value="parking">
                  <schmancy-icon slot="icon">local_parking</schmancy-icon>
                  Parking
                </schmancy-filter-chip>
                <schmancy-filter-chip value="pool">
                  <schmancy-icon slot="icon">pool</schmancy-icon>
                  Pool
                </schmancy-filter-chip>
                <schmancy-filter-chip value="gym">
                  <schmancy-icon slot="icon">fitness_center</schmancy-icon>
                  Gym
                </schmancy-filter-chip>
                <schmancy-filter-chip value="breakfast">
                  <schmancy-icon slot="icon">restaurant</schmancy-icon>
                  Breakfast
                </schmancy-filter-chip>
                <schmancy-filter-chip value="pet">
                  <schmancy-icon slot="icon">pets</schmancy-icon>
                  Pet Friendly
                </schmancy-filter-chip>
              </schmancy-chips>
              <schmancy-typography type="body" token="xs" class="text-surface-onVariant">
                ${this.selectedFeatures.length} features selected
              </schmancy-typography>
            </div>
          </schmancy-code-preview>

          <!-- Size Selector -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Size Selection
              </schmancy-typography>
              <schmancy-chips
                .value=${this.selectedSize}
                @change=${(e: CustomEvent) => this.selectedSize = e.detail}
              >
                ${['xs', 'sm', 'md', 'lg', 'xl', '2xl'].map(size => html`
                  <schmancy-filter-chip value=${size}>
                    ${size.toUpperCase()}
                  </schmancy-filter-chip>
                `)}
              </schmancy-chips>
            </div>
          </schmancy-code-preview>

          <!-- Color Filters -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Color Filters
              </schmancy-typography>
              <schmancy-chips
                .values=${this.selectedColors}
                @change=${(e: CustomEvent) => this.selectedColors = e.detail}
              >
                <schmancy-filter-chip value="red">
                  <span slot="icon" class="w-4 h-4 rounded-full bg-red-500"></span>
                  Red
                </schmancy-filter-chip>
                <schmancy-filter-chip value="blue">
                  <span slot="icon" class="w-4 h-4 rounded-full bg-blue-500"></span>
                  Blue
                </schmancy-filter-chip>
                <schmancy-filter-chip value="green">
                  <span slot="icon" class="w-4 h-4 rounded-full bg-green-500"></span>
                  Green
                </schmancy-filter-chip>
                <schmancy-filter-chip value="yellow">
                  <span slot="icon" class="w-4 h-4 rounded-full bg-yellow-500"></span>
                  Yellow
                </schmancy-filter-chip>
                <schmancy-filter-chip value="purple">
                  <span slot="icon" class="w-4 h-4 rounded-full bg-purple-500"></span>
                  Purple
                </schmancy-filter-chip>
              </schmancy-chips>
            </div>
          </schmancy-code-preview>

          <!-- Real-World Example: E-commerce Filters -->
          <schmancy-code-preview language="html">
            <schmancy-card>
              <div class="p-6 space-y-4">
                <schmancy-typography type="title" token="md" class="block">
                  Product Filters
                </schmancy-typography>

                <!-- Category -->
                <div>
                  <schmancy-typography type="label" token="sm" class="block mb-2 text-surface-onVariant">
                    Category
                  </schmancy-typography>
                  <schmancy-chips .values=${['electronics', 'books']}>
                    <schmancy-filter-chip value="electronics">
                      <schmancy-icon slot="icon">computer</schmancy-icon>
                      Electronics
                    </schmancy-filter-chip>
                    <schmancy-filter-chip value="clothing">
                      <schmancy-icon slot="icon">checkroom</schmancy-icon>
                      Clothing
                    </schmancy-filter-chip>
                    <schmancy-filter-chip value="books">
                      <schmancy-icon slot="icon">menu_book</schmancy-icon>
                      Books
                    </schmancy-filter-chip>
                    <schmancy-filter-chip value="home">
                      <schmancy-icon slot="icon">home</schmancy-icon>
                      Home
                    </schmancy-filter-chip>
                  </schmancy-chips>
                </div>

                <!-- Availability -->
                <div>
                  <schmancy-typography type="label" token="sm" class="block mb-2 text-surface-onVariant">
                    Availability
                  </schmancy-typography>
                  <schmancy-chips .values=${['in-stock']}>
                    <schmancy-filter-chip value="in-stock">
                      <schmancy-icon slot="icon">check_circle</schmancy-icon>
                      In Stock
                    </schmancy-filter-chip>
                    <schmancy-filter-chip value="free-shipping">
                      <schmancy-icon slot="icon">local_shipping</schmancy-icon>
                      Free Shipping
                    </schmancy-filter-chip>
                    <schmancy-filter-chip value="on-sale">
                      <schmancy-icon slot="icon">sell</schmancy-icon>
                      On Sale
                    </schmancy-filter-chip>
                  </schmancy-chips>
                </div>

                <!-- Ratings -->
                <div>
                  <schmancy-typography type="label" token="sm" class="block mb-2 text-surface-onVariant">
                    Customer Rating
                  </schmancy-typography>
                  <schmancy-chips .value=${''}>
                    <schmancy-filter-chip value="4-plus" elevated>
                      <schmancy-icon slot="icon">star</schmancy-icon>
                      4+ Stars
                    </schmancy-filter-chip>
                    <schmancy-filter-chip value="3-plus">
                      <schmancy-icon slot="icon">star_half</schmancy-icon>
                      3+ Stars
                    </schmancy-filter-chip>
                    <schmancy-filter-chip value="all">
                      <schmancy-icon slot="icon">star_outline</schmancy-icon>
                      All Ratings
                    </schmancy-filter-chip>
                  </schmancy-chips>
                </div>

                <schmancy-divider></schmancy-divider>

                <div class="flex justify-between items-center">
                  <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                    3 filters applied
                  </schmancy-typography>
                  <schmancy-button variant="text">
                    Clear All
                  </schmancy-button>
                </div>
              </div>
            </schmancy-card>
          </schmancy-code-preview>

          <!-- Programmatic Control -->
          <schmancy-code-preview language="javascript">
            // Container-managed selection state
            // Multi-selection example
            const multiChips = document.querySelector('#multi-chips');
            multiChips.values = ['option1', 'option3'];  // Selected values

            multiChips.addEventListener('change', (e) => {
              console.log('Selected values:', e.detail);  // Array of selected values
              // e.detail will be ['option1', 'option3'] or similar
            });

            // Single-selection example
            const singleChips = document.querySelector('#single-chips');
            singleChips.value = 'option2';  // Selected value

            singleChips.addEventListener('change', (e) => {
              console.log('Selected value:', e.detail);  // Single selected value
              // e.detail will be 'option2' or similar
            });

            // Clear all selections
            function clearAllFilters() {
              multiChips.values = [];
              singleChips.value = '';
            }

            // The container automatically detects selection mode:
            // - Use .values (array) for multi-selection
            // - Use .value (string) for single-selection
          </schmancy-code-preview>
        </schmancy-grid>
      </schmancy-surface>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-chips-filter': DemoChipsFilter;
  }
}