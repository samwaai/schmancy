import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { $LitElement } from '@mixins/index';
import '@schmancy';

@customElement('demo-data-display-overview')
export class DataDisplayOverview extends $LitElement(css`
  :host {
    display: block;
  }
`) {
  @state() private selectedPrinciple = 0;

  private principles = [
    {
      title: 'Information Hierarchy',
      description: 'Organize data to guide user attention',
      icon: 'layers',
      details: [
        'Use typography weight and size to establish hierarchy',
        'Group related information visually',
        'Progressive disclosure for complex data sets',
        'Highlight key metrics and important values'
      ]
    },
    {
      title: 'Performance at Scale',
      description: 'Handle large datasets efficiently',
      icon: 'speed',
      details: [
        'Virtualization for long lists and tables',
        'Lazy loading for hierarchical data',
        'Pagination vs infinite scroll strategies',
        'Client-side caching and memoization'
      ]
    },
    {
      title: 'Data Density',
      description: 'Balance information richness with clarity',
      icon: 'dashboard',
      details: [
        'Compact view vs comfortable spacing',
        'Inline editing capabilities',
        'Expandable rows for details',
        'Responsive table layouts'
      ]
    },
    {
      title: 'Visual Encoding',
      description: 'Use visual cues to convey meaning',
      icon: 'palette',
      details: [
        'Color coding for categories and status',
        'Icons for quick recognition',
        'Progress indicators for completion',
        'Badges and chips for metadata'
      ]
    },
    {
      title: 'Interactivity',
      description: 'Enable data exploration and manipulation',
      icon: 'touch_app',
      details: [
        'Sorting by multiple columns',
        'Advanced filtering interfaces',
        'Bulk selection and actions',
        'Drag and drop reordering'
      ]
    },
    {
      title: 'Accessibility',
      description: 'Ensure data is consumable by all users',
      icon: 'accessibility',
      details: [
        'Proper ARIA labels for data tables',
        'Keyboard navigation support',
        'Screen reader announcements',
        'High contrast and focus indicators'
      ]
    }
  ];

  private dataPatterns = [
    {
      pattern: 'Master-Detail',
      use: 'Show list with expandable details',
      example: 'Email client, file explorer'
    },
    {
      pattern: 'Dashboard Grid',
      use: 'Overview of key metrics',
      example: 'Analytics, monitoring systems'
    },
    {
      pattern: 'Infinite Scroll',
      use: 'Continuous data streams',
      example: 'Social feeds, activity logs'
    },
    {
      pattern: 'Data Table',
      use: 'Structured tabular data',
      example: 'Admin panels, spreadsheets'
    },
    {
      pattern: 'Tree View',
      use: 'Hierarchical relationships',
      example: 'File systems, org charts'
    },
    {
      pattern: 'Card Grid',
      use: 'Visual browse experience',
      example: 'Product catalogs, galleries'
    }
  ];

  render() {
    return html`
      <div class="container mx-auto p-4 max-w-7xl">
        <div class="mb-8">
          <schmancy-typography type="headline" token="lg" class="mb-2">
            Data Display Principles
          </schmancy-typography>
          <schmancy-typography type="body" token="lg" class="text-surface-onVariant">
            Best practices for presenting information effectively
          </schmancy-typography>
        </div>

        <!-- Core Principles -->
        <schmancy-surface type="filled" class="p-6 mb-8">
          <schmancy-typography type="headline" token="sm" class="mb-4">
            Core Principles
          </schmancy-typography>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            ${this.principles.map((principle, index) => html`
              <schmancy-surface
                type="${this.selectedPrinciple === index ? 'elevated' : 'outlined'}"
                class="p-4 cursor-pointer transition-all"
                @click=${() => this.selectedPrinciple = index}
              >
                <div class="flex items-start gap-3">
                  <schmancy-icon
                    icon="${principle.icon}"
                    class="text-primary text-2xl mt-1"
                  ></schmancy-icon>
                  <div class="flex-1">
                    <schmancy-typography type="headline" token="sm" class="mb-1">
                      ${principle.title}
                    </schmancy-typography>
                    <schmancy-typography type="body" token="md" class="text-surface-onVariant mb-3">
                      ${principle.description}
                    </schmancy-typography>

                    ${this.selectedPrinciple === index ? html`
                      <div class="mt-3 space-y-2">
                        ${principle.details.map(detail => html`
                          <div class="flex items-start gap-2">
                            <schmancy-icon
                              icon="check"
                              class="text-primary text-sm mt-0.5"
                            ></schmancy-icon>
                            <schmancy-typography type="body" token="sm">
                              ${detail}
                            </schmancy-typography>
                          </div>
                        `)}
                      </div>
                    ` : ''}
                  </div>
                </div>
              </schmancy-surface>
            `)}
          </div>
        </schmancy-surface>

        <!-- Common Patterns -->
        <schmancy-surface type="filled" class="p-6 mb-8">
          <schmancy-typography type="headline" token="sm" class="mb-4">
            Common Data Display Patterns
          </schmancy-typography>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-outline">
                  <th class="text-left p-3">
                    <schmancy-typography type="label" token="lg">Pattern</schmancy-typography>
                  </th>
                  <th class="text-left p-3">
                    <schmancy-typography type="label" token="lg">Use Case</schmancy-typography>
                  </th>
                  <th class="text-left p-3">
                    <schmancy-typography type="label" token="lg">Examples</schmancy-typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                ${this.dataPatterns.map(pattern => html`
                  <tr class="border-b border-outline-variant hover:bg-surface-containerHigh">
                    <td class="p-3">
                      <schmancy-typography type="body" token="md" class="font-medium">
                        ${pattern.pattern}
                      </schmancy-typography>
                    </td>
                    <td class="p-3">
                      <schmancy-typography type="body" token="md">
                        ${pattern.use}
                      </schmancy-typography>
                    </td>
                    <td class="p-3">
                      <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                        ${pattern.example}
                      </schmancy-typography>
                    </td>
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        </schmancy-surface>

        <!-- Performance Tips -->
        <schmancy-surface type="filled" class="p-6">
          <schmancy-typography type="headline" token="sm" class="mb-4">
            Performance Optimization Tips
          </schmancy-typography>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div class="flex items-center gap-2 mb-3">
                <schmancy-icon icon="memory" class="text-primary"></schmancy-icon>
                <schmancy-typography type="title" token="md">
                  Memory Management
                </schmancy-typography>
              </div>
              <ul class="space-y-2">
                <li class="flex items-start gap-2">
                  <span class="text-primary">•</span>
                  <schmancy-typography type="body" token="sm">
                    Use virtual scrolling for lists over 100 items
                  </schmancy-typography>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-primary">•</span>
                  <schmancy-typography type="body" token="sm">
                    Implement pagination for data tables
                  </schmancy-typography>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-primary">•</span>
                  <schmancy-typography type="body" token="sm">
                    Lazy load images and heavy content
                  </schmancy-typography>
                </li>
              </ul>
            </div>

            <div>
              <div class="flex items-center gap-2 mb-3">
                <schmancy-icon icon="bolt" class="text-primary"></schmancy-icon>
                <schmancy-typography type="title" token="md">
                  Rendering Performance
                </schmancy-typography>
              </div>
              <ul class="space-y-2">
                <li class="flex items-start gap-2">
                  <span class="text-primary">•</span>
                  <schmancy-typography type="body" token="sm">
                    Use repeat directive with key functions
                  </schmancy-typography>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-primary">•</span>
                  <schmancy-typography type="body" token="sm">
                    Debounce filter and search inputs
                  </schmancy-typography>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-primary">•</span>
                  <schmancy-typography type="body" token="sm">
                    Memoize expensive computations
                  </schmancy-typography>
                </li>
              </ul>
            </div>
          </div>
        </schmancy-surface>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-data-display-overview': DataDisplayOverview;
  }
}