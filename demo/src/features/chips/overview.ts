import { $LitElement } from '@mixins/index'
import { html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import '../../shared/installation-section'

@customElement('demo-chips-overview')
export class DemoChipsOverview extends $LitElement(css`
  .chip-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .chip-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`) {
  @state() private filterSelected = ['running', 'walking'];
  @state() private assistClicked = '';
  @state() private inputChips = ['design', 'development', 'testing'];
  @state() private suggestionClicked = '';

  private handleFilterChange(value: string) {
    const index = this.filterSelected.indexOf(value);
    if (index >= 0) {
      this.filterSelected = this.filterSelected.filter(v => v !== value);
    } else {
      this.filterSelected = [...this.filterSelected, value];
    }
  }

  private handleInputRemove(value: string) {
    this.inputChips = this.inputChips.filter(chip => chip !== value);
  }

  render() {
    return html`
      <schmancy-surface class="p-8">
        <!-- Header -->
        <schmancy-typography type="display" token="lg" class="mb-4 block">
          Chips Overview
        </schmancy-typography>
        <schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
          Material Design 3 chips provide compact elements that represent inputs, attributes, or actions.
          Schmancy offers four distinct chip types, each optimized for specific use cases.
        </schmancy-typography>

        <!-- Installation -->
        <installation-section></installation-section>

        <!-- Import -->
        <div class="mb-8">
          <schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
          <schmancy-code-preview language="javascript">
            // Import specific chip types (recommended)
            import '@mhmo91/schmancy/assist-chip'
            import '@mhmo91/schmancy/filter-chip'
            import '@mhmo91/schmancy/input-chip'
            import '@mhmo91/schmancy/suggestion-chip'

            // IMPORTANT: Always import and use the chip container
            // Chips MUST be wrapped in schmancy-chips for proper styling
            import '@mhmo91/schmancy/chips'

            // Legacy import (backward compatibility)
            import '@mhmo91/schmancy/chip'
          </schmancy-code-preview>
        </div>

        <!-- Chip Types Overview -->
        <schmancy-typography type="title" token="lg" class="mb-6 block">Chip Types</schmancy-typography>

        <div class="chip-grid mb-12">
          <!-- Filter Chips -->
          <schmancy-surface type="surfaceDim" class="rounded-lg p-6">
            <div class="chip-section">
              <schmancy-typography type="headline" token="sm" class="block">
                Filter Chips
              </schmancy-typography>
              <schmancy-typography type="body" token="sm" class="text-surface-onVariant block">
                Toggle between selected and unselected states to filter content
              </schmancy-typography>
              <schmancy-chips>
                <schmancy-filter-chip
                  .selected=${this.filterSelected.includes('running')}
                  @click=${() => this.handleFilterChange('running')}
                >
                  <schmancy-icon slot="icon">directions_run</schmancy-icon>
                  Running
                </schmancy-filter-chip>
                <schmancy-filter-chip
                  .selected=${this.filterSelected.includes('walking')}
                  @click=${() => this.handleFilterChange('walking')}
                >
                  <schmancy-icon slot="icon">directions_walk</schmancy-icon>
                  Walking
                </schmancy-filter-chip>
                <schmancy-filter-chip
                  .selected=${this.filterSelected.includes('cycling')}
                  @click=${() => this.handleFilterChange('cycling')}
                >
                  <schmancy-icon slot="icon">directions_bike</schmancy-icon>
                  Cycling
                </schmancy-filter-chip>
              </schmancy-chips>
              <schmancy-typography type="body" token="xs" class="text-surface-onVariant">
                Selected: ${this.filterSelected.join(', ') || 'none'}
              </schmancy-typography>
            </div>
          </schmancy-surface>

          <!-- Assist Chips -->
          <schmancy-surface type="surfaceDim" class="rounded-lg p-6">
            <div class="chip-section">
              <schmancy-typography type="headline" token="sm" class="block">
                Assist Chips
              </schmancy-typography>
              <schmancy-typography type="body" token="sm" class="text-surface-onVariant block">
                Trigger actions or open additional options
              </schmancy-typography>
              <schmancy-chips>
                <schmancy-assist-chip @click=${() => this.assistClicked = 'calendar'}>
                  <schmancy-icon slot="icon">calendar_today</schmancy-icon>
                  Set date
                </schmancy-assist-chip>
                <schmancy-assist-chip @click=${() => this.assistClicked = 'alarm'}>
                  <schmancy-icon slot="icon">alarm</schmancy-icon>
                  Set alarm
                </schmancy-assist-chip>
                <schmancy-assist-chip elevated @click=${() => this.assistClicked = 'directions'}>
                  <schmancy-icon slot="icon">directions</schmancy-icon>
                  Get directions
                </schmancy-assist-chip>
              </schmancy-chips>
              ${this.assistClicked ? html`
                <schmancy-typography type="body" token="xs" class="text-surface-onVariant">
                  Clicked: ${this.assistClicked}
                </schmancy-typography>
              ` : ''}
            </div>
          </schmancy-surface>

          <!-- Input Chips -->
          <schmancy-surface type="surfaceDim" class="rounded-lg p-6">
            <div class="chip-section">
              <schmancy-typography type="headline" token="sm" class="block">
                Input Chips
              </schmancy-typography>
              <schmancy-typography type="body" token="sm" class="text-surface-onVariant block">
                Represent user inputs that can be removed
              </schmancy-typography>
              <schmancy-chips>
                ${this.inputChips.map(chip => html`
                  <schmancy-input-chip
                    removable
                    @remove=${() => this.handleInputRemove(chip)}
                  >
                    ${chip}
                  </schmancy-input-chip>
                `)}
                ${this.inputChips.length === 0 ? html`
                  <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                    All chips removed
                  </schmancy-typography>
                ` : ''}
              </schmancy-chips>
            </div>
          </schmancy-surface>

          <!-- Suggestion Chips -->
          <schmancy-surface type="surfaceDim" class="rounded-lg p-6">
            <div class="chip-section">
              <schmancy-typography type="headline" token="sm" class="block">
                Suggestion Chips
              </schmancy-typography>
              <schmancy-typography type="body" token="sm" class="text-surface-onVariant block">
                Provide quick reply options or suggestions
              </schmancy-typography>
              <schmancy-chips>
                <schmancy-suggestion-chip @click=${() => this.suggestionClicked = 'yes'}>
                  <schmancy-icon slot="icon">thumb_up</schmancy-icon>
                  Yes, please
                </schmancy-suggestion-chip>
                <schmancy-suggestion-chip @click=${() => this.suggestionClicked = 'no'}>
                  <schmancy-icon slot="icon">thumb_down</schmancy-icon>
                  No, thanks
                </schmancy-suggestion-chip>
                <schmancy-suggestion-chip elevated @click=${() => this.suggestionClicked = 'maybe'}>
                  <schmancy-icon slot="icon">help</schmancy-icon>
                  Tell me more
                </schmancy-suggestion-chip>
              </schmancy-chips>
              ${this.suggestionClicked ? html`
                <schmancy-typography type="body" token="xs" class="text-surface-onVariant">
                  Selected: ${this.suggestionClicked}
                </schmancy-typography>
              ` : ''}
            </div>
          </schmancy-surface>
        </div>

        <!-- Quick Comparison -->
        <schmancy-typography type="title" token="lg" class="mb-4 block">Quick Comparison</schmancy-typography>

        <schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden mb-12">
          <table class="w-full">
            <thead class="bg-surface-container">
              <tr>
                <th class="text-left p-4">
                  <schmancy-typography type="label" token="md">Chip Type</schmancy-typography>
                </th>
                <th class="text-left p-4">
                  <schmancy-typography type="label" token="md">Purpose</schmancy-typography>
                </th>
                <th class="text-left p-4">
                  <schmancy-typography type="label" token="md">Selectable</schmancy-typography>
                </th>
                <th class="text-left p-4">
                  <schmancy-typography type="label" token="md">Removable</schmancy-typography>
                </th>
                <th class="text-left p-4">
                  <schmancy-typography type="label" token="md">Icon Support</schmancy-typography>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-outline">
                <td class="p-4">
                  <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">filter-chip</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">Filter content</schmancy-typography>
                </td>
                <td class="p-4">
                  <schmancy-icon class="text-success">check</schmancy-icon>
                </td>
                <td class="p-4">
                  <schmancy-icon class="text-error">close</schmancy-icon>
                </td>
                <td class="p-4">
                  <schmancy-icon class="text-success">check</schmancy-icon>
                </td>
              </tr>
              <tr class="border-t border-outline">
                <td class="p-4">
                  <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">assist-chip</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">Trigger actions</schmancy-typography>
                </td>
                <td class="p-4">
                  <schmancy-icon class="text-error">close</schmancy-icon>
                </td>
                <td class="p-4">
                  <schmancy-icon class="text-error">close</schmancy-icon>
                </td>
                <td class="p-4">
                  <schmancy-icon class="text-success">check</schmancy-icon>
                </td>
              </tr>
              <tr class="border-t border-outline">
                <td class="p-4">
                  <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">input-chip</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">User inputs</schmancy-typography>
                </td>
                <td class="p-4">
                  <schmancy-icon class="text-error">close</schmancy-icon>
                </td>
                <td class="p-4">
                  <schmancy-icon class="text-success">check</schmancy-icon>
                </td>
                <td class="p-4">
                  <schmancy-icon class="text-success">check</schmancy-icon>
                </td>
              </tr>
              <tr class="border-t border-outline">
                <td class="p-4">
                  <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">suggestion-chip</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">Quick suggestions</schmancy-typography>
                </td>
                <td class="p-4">
                  <schmancy-icon class="text-error">close</schmancy-icon>
                </td>
                <td class="p-4">
                  <schmancy-icon class="text-error">close</schmancy-icon>
                </td>
                <td class="p-4">
                  <schmancy-icon class="text-success">check</schmancy-icon>
                </td>
              </tr>
            </tbody>
          </table>
        </schmancy-surface>

        <!-- Common Properties -->
        <schmancy-typography type="title" token="lg" class="mb-4 block">Common Properties</schmancy-typography>

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
                  <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">elevated</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">boolean</schmancy-typography>
                </td>
                <td class="p-4">
                  <code class="text-sm">false</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">Add elevation shadow for emphasis</schmancy-typography>
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
                  <schmancy-typography type="body" token="sm">Text label (alternative to slot content)</schmancy-typography>
                </td>
              </tr>
            </tbody>
          </table>
        </schmancy-surface>

        <!-- Basic Examples -->
        <schmancy-typography type="title" token="lg" class="mb-6 block">Basic Examples</schmancy-typography>

        <schmancy-grid gap="lg" class="w-full">
          <!-- All chip types with icons -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-4">
              <!-- Note: Chips MUST be wrapped in schmancy-chips for proper styling -->
              <schmancy-chips>
                <schmancy-filter-chip selected>
                  <schmancy-icon slot="icon">filter_list</schmancy-icon>
                  Filter Chip
                </schmancy-filter-chip>

                <schmancy-assist-chip>
                  <schmancy-icon slot="icon">assistant</schmancy-icon>
                  Assist Chip
                </schmancy-assist-chip>

                <schmancy-input-chip removable>
                  <schmancy-icon slot="icon">tag</schmancy-icon>
                  Input Chip
                </schmancy-input-chip>

                <schmancy-suggestion-chip>
                  <schmancy-icon slot="icon">lightbulb</schmancy-icon>
                  Suggestion Chip
                </schmancy-suggestion-chip>
              </schmancy-chips>
            </div>
          </schmancy-code-preview>

          <!-- Elevated variants -->
          <schmancy-code-preview language="html">
            <schmancy-chips>
              <schmancy-filter-chip elevated selected>
                <schmancy-icon slot="icon">star</schmancy-icon>
                Featured
              </schmancy-filter-chip>

              <schmancy-assist-chip elevated>
                <schmancy-icon slot="icon">rocket_launch</schmancy-icon>
                Launch
              </schmancy-assist-chip>

              <schmancy-input-chip elevated removable>
                <schmancy-icon slot="icon">person</schmancy-icon>
                John Doe
              </schmancy-input-chip>

              <schmancy-suggestion-chip elevated>
                <schmancy-icon slot="icon">auto_awesome</schmancy-icon>
                Magic
              </schmancy-suggestion-chip>
            </schmancy-chips>
          </schmancy-code-preview>

          <!-- Without icons -->
          <schmancy-code-preview language="html">
            <schmancy-chips>
              <schmancy-filter-chip selected>Active</schmancy-filter-chip>
              <schmancy-assist-chip>Help</schmancy-assist-chip>
              <schmancy-input-chip removable>Tag</schmancy-input-chip>
              <schmancy-suggestion-chip>Quick Reply</schmancy-suggestion-chip>
            </schmancy-chips>
          </schmancy-code-preview>

          <!-- Using label property -->
          <schmancy-code-preview language="html">
            <schmancy-chips>
              <schmancy-filter-chip label="Option 1" selected></schmancy-filter-chip>
              <schmancy-assist-chip label="Action"></schmancy-assist-chip>
              <schmancy-input-chip label="Input" removable></schmancy-input-chip>
              <schmancy-suggestion-chip label="Suggest"></schmancy-suggestion-chip>
            </schmancy-chips>
          </schmancy-code-preview>
        </schmancy-grid>
      </schmancy-surface>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-chips-overview': DemoChipsOverview;
  }
}