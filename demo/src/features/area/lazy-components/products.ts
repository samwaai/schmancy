import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { $LitElement } from '@mixins/index';

@customElement('lazy-products')
export default class LazyProducts extends $LitElement(css`
  :host {
    display: block;
    padding: 24px;
  }
`) {
  render() {
    return html`
      <schmancy-surface type="container" rounded="all" class="p-6">
        <div class="flex flex-col items-center justify-center space-y-4">
          <schmancy-icon size="xl">inventory_2</schmancy-icon>
          <schmancy-typography type="headline" token="lg">Products</schmancy-typography>
          <schmancy-typography type="body" token="md" class="text-center">
            Browse and manage your product catalog, inventory, and pricing.
          </schmancy-typography>
        </div>
      </schmancy-surface>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lazy-products': LazyProducts;
  }
}