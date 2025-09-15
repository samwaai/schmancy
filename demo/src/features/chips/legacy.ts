import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

@customElement('demo-chips-legacy')
export class DemoChipsLegacy extends $LitElement() {
  @state() private selectedLegacy = '';
  @state() private selectedMultipleLegacy = ['option2'];

  render() {
    return html`
      <schmancy-surface class="p-8">
        <!-- Header -->
        <schmancy-typography type="display" token="lg" class="mb-4 block">
          Legacy Chip Support
        </schmancy-typography>
        <schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
          The legacy schmancy-chip component is maintained for backward compatibility.
          For new projects, use the specific chip types (filter-chip, assist-chip, input-chip, suggestion-chip).
        </schmancy-typography>

        <!-- Migration Guide -->
        <schmancy-typography type="title" token="lg" class="mb-4 block">Migration Guide</schmancy-typography>

        <schmancy-surface type="surfaceDim" class="rounded-lg p-6 mb-12">
          <schmancy-typography type="headline" token="sm" class="mb-4 block">
            Migrating from Legacy to New Chip Types
          </schmancy-typography>

          <div class="space-y-4">
            <div>
              <schmancy-typography type="label" token="md" class="block mb-2">
                1. Replace generic chip with specific types:
              </schmancy-typography>
              <schmancy-code-preview language="html">
                <!-- Old -->
                <schmancy-chip type="filter">Filter</schmancy-chip>
                <schmancy-chip type="assist">Action</schmancy-chip>
                <schmancy-chip type="input" removable>Tag</schmancy-chip>
                <schmancy-chip type="suggestion">Suggest</schmancy-chip>

                <!-- New (Recommended) -->
                <schmancy-filter-chip>Filter</schmancy-filter-chip>
                <schmancy-assist-chip>Action</schmancy-assist-chip>
                <schmancy-input-chip removable>Tag</schmancy-input-chip>
                <schmancy-suggestion-chip>Suggest</schmancy-suggestion-chip>
              </schmancy-code-preview>
            </div>

            <div>
              <schmancy-typography type="label" token="md" class="block mb-2">
                2. Update icon usage:
              </schmancy-typography>
              <schmancy-code-preview language="html">
                <!-- Old (emoji icons) -->
                <schmancy-chip icon="🔥">Fire</schmancy-chip>

                <!-- New (Material icons with slot) -->
                <schmancy-filter-chip>
                  <schmancy-icon slot="icon">local_fire_department</schmancy-icon>
                  Fire
                </schmancy-filter-chip>
              </schmancy-code-preview>
            </div>

            <div>
              <schmancy-typography type="label" token="md" class="block mb-2">
                3. Update event handling:
              </schmancy-typography>
              <schmancy-code-preview language="javascript">
                // Old
                chip.addEventListener('change', (e) => {
                  console.log(e.detail.value, e.detail.selected);
                });

                // New (simplified)
                filterChip.addEventListener('click', (e) => {
                  filterChip.selected = !filterChip.selected;
                });
              </schmancy-code-preview>
            </div>
          </div>
        </schmancy-surface>

        <!-- Legacy Examples -->
        <schmancy-typography type="title" token="lg" class="mb-6 block">Legacy Examples (Still Supported)</schmancy-typography>

        <schmancy-grid gap="lg" class="w-full">
          <!-- Basic Legacy Chips -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Legacy schmancy-chip (default type="filter")
              </schmancy-typography>
              <schmancy-chips>
                <schmancy-chip selected>Selected</schmancy-chip>
                <schmancy-chip>Unselected</schmancy-chip>
                <schmancy-chip icon="🔥">With Emoji</schmancy-chip>
                <schmancy-chip readOnly>Read Only</schmancy-chip>
                <schmancy-chip disabled>Disabled</schmancy-chip>
              </schmancy-chips>
            </div>
          </schmancy-code-preview>

          <!-- Legacy with Type Property -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Legacy with type property
              </schmancy-typography>
              <schmancy-chips>
                <schmancy-chip type="filter" selected>Filter Type</schmancy-chip>
                <schmancy-chip type="assist">Assist Type</schmancy-chip>
                <schmancy-chip type="input" removable>Input Type</schmancy-chip>
                <schmancy-chip type="suggestion">Suggestion Type</schmancy-chip>
              </schmancy-chips>
            </div>
          </schmancy-code-preview>

          <!-- Legacy with Value Property -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Legacy with value for selection
              </schmancy-typography>
              <schmancy-chips
                .value="${this.selectedLegacy}"
                @change="${(e: CustomEvent) => this.selectedLegacy = e.detail}"
              >
                <schmancy-chip value="option1">Option 1</schmancy-chip>
                <schmancy-chip value="option2">Option 2</schmancy-chip>
                <schmancy-chip value="option3">Option 3</schmancy-chip>
              </schmancy-chips>
              <schmancy-typography type="body" token="xs" class="text-surface-onVariant">
                Selected: ${this.selectedLegacy || 'none'}
              </schmancy-typography>
            </div>
          </schmancy-code-preview>

          <!-- Legacy Multiple Selection -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Legacy multiple selection
              </schmancy-typography>
              <schmancy-chips
                multi
                .values="${this.selectedMultipleLegacy}"
                @change="${(e: CustomEvent) => this.selectedMultipleLegacy = e.detail}"
              >
                <schmancy-chip value="option1" icon="1️⃣">Option 1</schmancy-chip>
                <schmancy-chip value="option2" icon="2️⃣">Option 2</schmancy-chip>
                <schmancy-chip value="option3" icon="3️⃣">Option 3</schmancy-chip>
              </schmancy-chips>
              <schmancy-typography type="body" token="xs" class="text-surface-onVariant">
                Selected: ${this.selectedMultipleLegacy.join(', ') || 'none'}
              </schmancy-typography>
            </div>
          </schmancy-code-preview>

          <!-- Legacy Properties -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Legacy-specific properties
              </schmancy-typography>
              <schmancy-chips>
                <schmancy-chip elevated>Elevated</schmancy-chip>
                <schmancy-chip soft-disabled>Soft Disabled</schmancy-chip>
                <schmancy-chip label="Using label prop"></schmancy-chip>
                <schmancy-chip avatar removable type="input">
                  Avatar Mode
                </schmancy-chip>
              </schmancy-chips>
            </div>
          </schmancy-code-preview>

          <!-- Comparison: Old vs New -->
          <schmancy-code-preview language="html">
            <div class="space-y-6">
              <div>
                <schmancy-typography type="label" token="sm" class="block mb-2 text-surface-onVariant">
                  Old Way (Legacy)
                </schmancy-typography>
                <schmancy-chips>
                  <schmancy-chip type="filter" selected icon="☕">Coffee</schmancy-chip>
                  <schmancy-chip type="assist" icon="🚀">Launch</schmancy-chip>
                  <schmancy-chip type="input" removable icon="📧">Email</schmancy-chip>
                  <schmancy-chip type="suggestion" icon="💡">Idea</schmancy-chip>
                </schmancy-chips>
              </div>

              <schmancy-divider></schmancy-divider>

              <div>
                <schmancy-typography type="label" token="sm" class="block mb-2 text-surface-onVariant">
                  New Way (Recommended)
                </schmancy-typography>
                <schmancy-chips>
                  <schmancy-filter-chip selected>
                    <schmancy-icon slot="icon">coffee</schmancy-icon>
                    Coffee
                  </schmancy-filter-chip>
                  <schmancy-assist-chip>
                    <schmancy-icon slot="icon">rocket_launch</schmancy-icon>
                    Launch
                  </schmancy-assist-chip>
                  <schmancy-input-chip removable>
                    <schmancy-icon slot="icon">email</schmancy-icon>
                    Email
                  </schmancy-input-chip>
                  <schmancy-suggestion-chip>
                    <schmancy-icon slot="icon">lightbulb</schmancy-icon>
                    Idea
                  </schmancy-suggestion-chip>
                </div>
              </div>
            </div>
          </schmancy-code-preview>

          <!-- Breaking Changes -->
          <schmancy-code-preview language="html">
            <schmancy-card>
              <div class="p-6 space-y-4">
                <schmancy-typography type="title" token="md" class="block text-error">
                  ⚠️ Breaking Changes
                </schmancy-typography>

                <schmancy-divider></schmancy-divider>

                <div class="space-y-3">
                  <div class="flex gap-2">
                    <schmancy-icon class="text-error">close</schmancy-icon>
                    <div class="flex-1">
                      <schmancy-typography type="label" token="sm" class="block">
                        Icon size attribute removed
                      </schmancy-typography>
                      <schmancy-typography type="body" token="xs" class="text-surface-onVariant">
                        Icons in slots no longer accept size attribute
                      </schmancy-typography>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <schmancy-icon class="text-warning">warning</schmancy-icon>
                    <div class="flex-1">
                      <schmancy-typography type="label" token="sm" class="block">
                        Default type changed
                      </schmancy-typography>
                      <schmancy-typography type="body" token="xs" class="text-surface-onVariant">
                        Legacy chip defaults to type="filter" for backward compatibility
                      </schmancy-typography>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <schmancy-icon class="text-info">info</schmancy-icon>
                    <div class="flex-1">
                      <schmancy-typography type="label" token="sm" class="block">
                        Event structure simplified
                      </schmancy-typography>
                      <schmancy-typography type="body" token="xs" class="text-surface-onVariant">
                        New chips have simpler event handling
                      </schmancy-typography>
                    </div>
                  </div>
                </div>
              </div>
            </schmancy-card>
          </schmancy-code-preview>

          <!-- Migration Benefits -->
          <schmancy-code-preview language="html">
            <schmancy-card>
              <div class="p-6 space-y-4">
                <schmancy-typography type="title" token="md" class="block text-success">
                  ✅ Benefits of Migration
                </schmancy-typography>

                <schmancy-divider></schmancy-divider>

                <div class="space-y-3">
                  <div class="flex gap-2">
                    <schmancy-icon class="text-success">speed</schmancy-icon>
                    <div class="flex-1">
                      <schmancy-typography type="label" token="sm" class="block">
                        Better Performance
                      </schmancy-typography>
                      <schmancy-typography type="body" token="xs" class="text-surface-onVariant">
                        Specific chip types are optimized for their use case
                      </schmancy-typography>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <schmancy-icon class="text-success">code</schmancy-icon>
                    <div class="flex-1">
                      <schmancy-typography type="label" token="sm" class="block">
                        Cleaner API
                      </schmancy-typography>
                      <schmancy-typography type="body" token="xs" class="text-surface-onVariant">
                        Each chip type has only relevant properties
                      </schmancy-typography>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <schmancy-icon class="text-success">palette</schmancy-icon>
                    <div class="flex-1">
                      <schmancy-typography type="label" token="sm" class="block">
                        Material Design 3 Compliance
                      </schmancy-typography>
                      <schmancy-typography type="body" token="xs" class="text-surface-onVariant">
                        Follows latest Material Design specifications
                      </schmancy-typography>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <schmancy-icon class="text-success">accessibility</schmancy-icon>
                    <div class="flex-1">
                      <schmancy-typography type="label" token="sm" class="block">
                        Improved Accessibility
                      </schmancy-typography>
                      <schmancy-typography type="body" token="xs" class="text-surface-onVariant">
                        Better ARIA support and keyboard navigation
                      </schmancy-typography>
                    </div>
                  </div>
                </div>
              </div>
            </schmancy-card>
          </schmancy-code-preview>

          <!-- Compatibility Table -->
          <div>
            <schmancy-typography type="title" token="md" class="mb-4 block">
              Compatibility Reference
            </schmancy-typography>
            <schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden">
              <table class="w-full">
                <thead class="bg-surface-container">
                  <tr>
                    <th class="text-left p-4">
                      <schmancy-typography type="label" token="md">Legacy Property</schmancy-typography>
                    </th>
                    <th class="text-left p-4">
                      <schmancy-typography type="label" token="md">New Equivalent</schmancy-typography>
                    </th>
                    <th class="text-left p-4">
                      <schmancy-typography type="label" token="md">Status</schmancy-typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-t border-outline">
                    <td class="p-4">
                      <code class="text-sm">type="filter"</code>
                    </td>
                    <td class="p-4">
                      <code class="text-sm">schmancy-filter-chip</code>
                    </td>
                    <td class="p-4">
                      <schmancy-chip class="!px-2 !py-1" selected>Supported</schmancy-chip>
                    </td>
                  </tr>
                  <tr class="border-t border-outline">
                    <td class="p-4">
                      <code class="text-sm">type="assist"</code>
                    </td>
                    <td class="p-4">
                      <code class="text-sm">schmancy-assist-chip</code>
                    </td>
                    <td class="p-4">
                      <schmancy-chip class="!px-2 !py-1" selected>Supported</schmancy-chip>
                    </td>
                  </tr>
                  <tr class="border-t border-outline">
                    <td class="p-4">
                      <code class="text-sm">type="input"</code>
                    </td>
                    <td class="p-4">
                      <code class="text-sm">schmancy-input-chip</code>
                    </td>
                    <td class="p-4">
                      <schmancy-chip class="!px-2 !py-1" selected>Supported</schmancy-chip>
                    </td>
                  </tr>
                  <tr class="border-t border-outline">
                    <td class="p-4">
                      <code class="text-sm">type="suggestion"</code>
                    </td>
                    <td class="p-4">
                      <code class="text-sm">schmancy-suggestion-chip</code>
                    </td>
                    <td class="p-4">
                      <schmancy-chip class="!px-2 !py-1" selected>Supported</schmancy-chip>
                    </td>
                  </tr>
                  <tr class="border-t border-outline">
                    <td class="p-4">
                      <code class="text-sm">icon="emoji"</code>
                    </td>
                    <td class="p-4">
                      <code class="text-sm">slot="icon"</code>
                    </td>
                    <td class="p-4">
                      <schmancy-chip class="!px-2 !py-1" selected>Supported</schmancy-chip>
                    </td>
                  </tr>
                  <tr class="border-t border-outline">
                    <td class="p-4">
                      <code class="text-sm">readOnly</code>
                    </td>
                    <td class="p-4">
                      <code class="text-sm">disabled</code>
                    </td>
                    <td class="p-4">
                      <schmancy-chip class="!px-2 !py-1" selected>Supported</schmancy-chip>
                    </td>
                  </tr>
                </tbody>
              </table>
            </schmancy-surface>
          </div>
        </schmancy-grid>
      </schmancy-surface>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-chips-legacy': DemoChipsLegacy;
  }
}