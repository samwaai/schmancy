import { $LitElement } from '@mixins/index';
import { area, lazy } from '@schmancy/area';
import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { filter, map } from 'rxjs';

@customElement('demo-area-lazy')
export class DemoAreaLazy extends $LitElement() {
  @state() private currentRoute = 'dashboard';


  connectedCallback(): void {
    super.connectedCallback()
    area.$current.pipe(
      map(a=> a.get('lazy-main')),
      filter(Boolean),
    ).subscribe({
      next:(r)=>{
        this.currentRoute = r.component.toLowerCase()
      }
    })
  }

  render() {
    return html`
    
          <section class="grid grid-cols-[auto_1fr]">
              <schmancy-list>
              <schmancy-list-item
                ?selected=${this.currentRoute === 'dashboard'}
                @click=${() => {
                  this.currentRoute = 'dashboard';
                  area.push({
                    area: 'lazy-main',
                    component: lazy(()=>import('./lazy-components/dashboard'))
                  });
                }}>
                <schmancy-icon slot="start">dashboard</schmancy-icon>
                Dashboard
              </schmancy-list-item>

              <schmancy-list-item
                ?selected=${this.currentRoute === 'lazy-users'}
                @click=${() => {
                  this.currentRoute = 'users';
                  area.push({
                    area: 'lazy-main',
                    component: lazy(() => import('./lazy-components/users'))
                  });
                }}>
                <schmancy-icon slot="start">group</schmancy-icon>
                Users
              </schmancy-list-item>

              <schmancy-list-item
                ?selected=${this.currentRoute === 'products'}
                @click=${() => {
                  this.currentRoute = 'products';
                  area.push({
                    area: 'lazy-main',
                    component: lazy(() => import('./lazy-components/products'))
                  });
                }}>
                <schmancy-icon slot="start">inventory_2</schmancy-icon>
                Products
              </schmancy-list-item>

              <schmancy-list-item
                ?selected=${this.currentRoute === 'reports'}
                @click=${() => {
                  this.currentRoute = 'reports';
                  area.push({
                    area: 'lazy-main',
                    component: lazy(() => import('./lazy-components/reports'))
                  });
                }}>
                <schmancy-icon slot="start">assessment</schmancy-icon>
                Reports
              </schmancy-list-item>

              <schmancy-list-item
                ?selected=${this.currentRoute === 'settings'}
                @click=${() => {
                  this.currentRoute = 'settings';
                  area.push({
                    area: 'lazy-main',
                    component: lazy(() => import('./lazy-components/settings'))
                  });
                }}>
                <schmancy-icon slot="start">settings</schmancy-icon>
                Settings
              </schmancy-list-item>
            </schmancy-list>

          <schmancy-area name="lazy-main" .default=${lazy(()=>import('./lazy-components/dashboard'))}>
                <schmancy-route when="lazy-users" .component=${lazy(() => import('./lazy-components/users'))}></schmancy-route>

                                <schmancy-route when="lazy-dashboard" .component=${lazy(() => import('./lazy-components/dashboard'))}></schmancy-route>


          </schmancy-area>
          </section>

    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-area-lazy': DemoAreaLazy;
  }
}