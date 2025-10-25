import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { $LitElement } from '@mhmo91/schmancy/mixins';

@customElement('lazy-dashboard')
export default class LazyDashboard extends $LitElement() {
  render() {
    return html`
      <schmancy-surface type="container" rounded="all" class="p-6">
        <div class="flex flex-col items-center justify-center space-y-4">
          <schmancy-icon size="xl">dashboard</schmancy-icon>
          <schmancy-typography type="headline" token="lg">Dashboard</schmancy-typography>
          <schmancy-typography type="body" token="md" class="text-center">
            Welcome to your dashboard. Monitor key metrics and performance indicators here.
          </schmancy-typography>
        </div>
      </schmancy-surface>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lazy-dashboard': LazyDashboard;
  }
}