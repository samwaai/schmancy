import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { $LitElement } from '@mixins/index';

@customElement('lazy-reports')
export default class LazyReports extends $LitElement() {
  render() {
    return html`
      <schmancy-surface type="container" rounded="all" class="p-6">
        <div class="flex flex-col items-center justify-center space-y-4">
          <schmancy-icon size="xl">assessment</schmancy-icon>
          <schmancy-typography type="headline" token="lg">Reports</schmancy-typography>
          <schmancy-typography type="body" token="md" class="text-center">
            Generate and view comprehensive reports, analytics, and insights.
          </schmancy-typography>
        </div>
      </schmancy-surface>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lazy-reports': LazyReports;
  }
}