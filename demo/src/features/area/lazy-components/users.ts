import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { $LitElement } from '@mixins/index';

@customElement('lazy-users')
export default class LazyUsers extends $LitElement() {
  render() {
    return html`
      <schmancy-surface type="container" rounded="all" class="p-6">
        <div class="flex flex-col items-center justify-center space-y-4">
          <schmancy-icon size="xl">group</schmancy-icon>
          <schmancy-typography type="headline" token="lg">Users</schmancy-typography>
          <schmancy-typography type="body" token="md" class="text-center">
            Manage user accounts, permissions, and access controls from this section.
          </schmancy-typography>
        </div>
      </schmancy-surface>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lazy-users': LazyUsers;
  }
}