import { $LitElement } from '@mhmo91/schmancy/mixins';
import { area, lazy } from '@mhmo91/schmancy/area';
import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BehaviorSubject, filter, map, of } from 'rxjs';

// Demo authentication state
const isAuthenticated$ = new BehaviorSubject(true);

@customElement('demo-area-lazy')
export class DemoAreaLazy extends $LitElement() {
  @state() private currentRoute = 'dashboard';
  @state() private isAuthenticated = true;

  connectedCallback(): void {
    super.connectedCallback()

    // Subscribe to authentication state
    isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });

    area.$current.pipe(
      map(a=> a.get('lazy-main')),
      filter(Boolean),
    ).subscribe({
      next:(r)=>{
        this.currentRoute = r.component.toLowerCase()
      }
    })
  }

  toggleAuth() {
    isAuthenticated$.next(!this.isAuthenticated);
  }

  render() {
    return html`
      <div class="p-4">
        <schmancy-card type="outlined" class="mb-4 p-4">
          <schmancy-typography type="headline" token="md" class="mb-4">Lazy Loading with Route Guards Demo</schmancy-typography>
          <div class="flex items-center gap-4">
            <schmancy-button
              variant=${this.isAuthenticated ? 'filled' : 'outlined'}
              @click=${this.toggleAuth}>
              ${this.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </schmancy-button>
            <schmancy-typography type="body" token="md">
              Click to toggle authentication state. Protected routes will redirect when not authenticated.
            </schmancy-typography>
          </div>
        </schmancy-card>

        <section class="grid grid-cols-[auto_1fr]">
              <schmancy-list>
              <schmancy-list-item
                ?selected=${this.currentRoute === 'lazy-dashboard'}
                @click=${() => {
                  area.push({
                    area: 'lazy-main',
                    component: 'lazy-dashboard'
                  });
                }}>
                <schmancy-icon slot="start">dashboard</schmancy-icon>
                Dashboard
              </schmancy-list-item>

              <schmancy-list-item
                ?selected=${this.currentRoute === 'lazy-users'}
                @click=${() => {
                  area.push({
                    area: 'lazy-main',
                    component: 'lazy-users'
                  });
                }}>
                <schmancy-icon slot="start">group</schmancy-icon>
                Users ${!this.isAuthenticated ? '🔒' : ''}
              </schmancy-list-item>

              <schmancy-list-item
                ?selected=${this.currentRoute === 'lazy-products'}
                @click=${() => {
                  area.push({
                    area: 'lazy-main',
                    component: 'lazy-products'
                  });
                }}>
                <schmancy-icon slot="start">inventory_2</schmancy-icon>
                Products ${!this.isAuthenticated ? '🔒' : ''}
              </schmancy-list-item>

              <schmancy-list-item
                ?selected=${this.currentRoute === 'lazy-reports'}
                @click=${() => {
                  area.push({
                    area: 'lazy-main',
                    component: 'lazy-reports'
                  });
                }}>
                <schmancy-icon slot="start">assessment</schmancy-icon>
                Reports ${!this.isAuthenticated ? '🔒' : ''}
              </schmancy-list-item>

              <schmancy-list-item
                ?selected=${this.currentRoute === 'lazy-settings'}
                @click=${() => {
                  area.push({
                    area: 'lazy-main',
                    component: 'lazy-settings'
                  });
                }}>
                <schmancy-icon slot="start">settings</schmancy-icon>
                Settings (Always Accessible)
              </schmancy-list-item>
            </schmancy-list>

          <schmancy-area name="lazy-main" .default=${lazy(()=>import('./lazy-components/dashboard'))}>
                <schmancy-route
                  when="lazy-users"
                  .component=${lazy(() => import('./lazy-components/users'))}
                  .guard=${isAuthenticated$.pipe(
                    map(isAuth => {
                      console.log('Users route guard:', isAuth);
                      return isAuth;
                    })
                  )}
                  @redirect=${() => {
                    console.log('Access denied to Users');
                    area.push({ area: 'lazy-main', component: lazy(() => import('./lazy-components/dashboard')) });
                  }}
                ></schmancy-route>

                <schmancy-route
                  when="lazy-dashboard"
                  .component=${lazy(() => import('./lazy-components/dashboard'))}
                ></schmancy-route>

                <schmancy-route
                  when="lazy-products"
                  .component=${lazy(() => import('./lazy-components/products'))}
                  .guard=${isAuthenticated$}
                  @redirect=${() => {
                    console.log('Access denied to Products');
                    area.push({ area: 'lazy-main', component: lazy(() => import('./lazy-components/dashboard')) });
                  }}
                ></schmancy-route>

                <schmancy-route
                  when="lazy-reports"
                  .component=${lazy(() => import('./lazy-components/reports'))}
                  .guard=${isAuthenticated$}
                  @redirect=${() => {
                    console.log('Access denied to Reports');
                    area.push({ area: 'lazy-main', component: lazy(() => import('./lazy-components/dashboard')) });
                  }}
                ></schmancy-route>

                <schmancy-route
                  when="lazy-settings"
                  .component=${lazy(() => import('./lazy-components/settings'))}
                  .guard=${of(true)}
                ></schmancy-route>
          </schmancy-area>
          </section>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-area-lazy': DemoAreaLazy;
  }
}