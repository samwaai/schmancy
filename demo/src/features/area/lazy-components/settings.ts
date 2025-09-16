import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { $LitElement } from '@mixins/index';

@customElement('lazy-settings')
export default class LazySettings extends $LitElement(css`
  :host {
    display: block;
    padding: 24px;
  }
`) {
  render() {
    return html`
      <schmancy-surface type="container" rounded="all" class="p-6">
        <div class="flex flex-col items-center justify-center space-y-4">
          <schmancy-icon size="xl">settings</schmancy-icon>
          <schmancy-typography type="headline" token="lg">Settings</schmancy-typography>
          <schmancy-typography type="body" token="md" class="text-center">
            Configure system preferences, integrations, and application behavior.
          </schmancy-typography>
        </div>
      </schmancy-surface>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lazy-settings': LazySettings;
  }
}